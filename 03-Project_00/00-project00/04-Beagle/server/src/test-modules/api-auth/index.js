/**
 * 接口鉴权检测（api-auth）
 * 静态分析后端路由定义（Express / Koa-router），判断每个接口是否处于鉴权中间件保护下：
 *  - 路由组级：router.use(authMiddleware) 之后定义的路由视为已保护
 *  - 路由级：router.post('/x', authMiddleware, handler) 行内带鉴权中间件
 *  - 白名单：登录/注册/验证码/健康检查等公开接口按正则放行
 * 静态分析无法 100% 确定的（动态挂载、跨文件中间件）归入存疑，不武断判错。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { walk, readText, toRel } = require('../i18n-check/lib/fileWalker');

const DEFAULT_AUTH_NAMES = ['auth', 'authenticate', 'authentication', 'authMiddleware', 'verifyToken', 'jwtAuth', 'requireAuth', 'checkAuth', 'isAuth', 'protect'];
const DEFAULT_PUBLIC = ['login', 'register', 'signup', 'captcha', 'health', 'ping', 'public', 'reset-password', 'forgot', 'logout', 'swagger', 'docs'];

class ApiAuthModule extends TestModuleBase {
  static get moduleType() { return 'api-auth'; }
  static get moduleName() { return '接口鉴权检测'; }
  static get description() {
    return '扫描后端 Express/Koa 路由，识别每个接口是否被鉴权中间件保护（路由组 router.use 或路由内联中间件），列出缺少鉴权保护的敏感接口；登录、注册、健康检查等可通过白名单放行。动态挂载等无法静态确定的情况归为存疑，供人工复核。';
  }
  static get icon() { return 'Lock'; }
  static get category() { return 'security'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '校验后端路径' },
      { key: 'parse', label: '解析路由与中间件' },
      { key: 'judge', label: '判定鉴权覆盖' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'backendSrcDir', label: '后端源码目录', type: 'path', span: 12, default: 'src',
        tip: '相对于项目「后端路径」。' },
      { key: 'authNames', label: '鉴权中间件名', type: 'textarea', span: 12, rows: 4,
        default: DEFAULT_AUTH_NAMES.join('\n'), tip: '每行一个中间件名（函数名/变量名），命中即视为鉴权保护。' },
      { key: 'publicPatterns', label: '公开接口白名单', type: 'textarea', span: 12, rows: 4,
        default: DEFAULT_PUBLIC.join('\n'), tip: '每行一个关键字（不区分大小写），路由路径包含即视为无需鉴权。' },
      { key: 'exts', label: '扫描扩展名', type: 'string', span: 12, default: '.js,.ts,.mjs,.cjs' },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: 'test,tests,__tests__,node_modules' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { routesFound: 0, protected: 0, public: 0, unprotected: 0, uncertain: 0 };

    try {
      this.setProgress('prepare', 100);
      if (!project.backend_path || !fs.existsSync(project.backend_path)) {
        this.addResult({ name: '后端路径', passed: false, category: 'error', message: '未配置或不存在后端路径，无法分析接口鉴权' });
        return this.complete(stats);
      }
      const root = path.join(project.backend_path, cfg.backendSrcDir || 'src');
      if (!fs.existsSync(root)) {
        this.addResult({ name: '源码目录', passed: false, category: 'error', message: `${root} 不存在` });
        return this.complete(stats);
      }

      const authNames = String(cfg.authNames || '').split('\n').map(s => s.trim()).filter(Boolean);
      const publicPatterns = String(cfg.publicPatterns || '').split('\n').map(s => s.trim()).filter(Boolean);
      const exts = String(cfg.exts || '.js,.ts').split(',').map(s => s.trim()).filter(Boolean);
      const ignoreDirs = this.parseIgnoreDirs(cfg.ignoreDirs);

      this.setProgress('parse', 40);
      const { files } = walk(root, { exts, ignoreDirs, maxFiles: 15000 });
      // 同时匹配 use(...) 与 method(...)，按出现顺序判定（中间件顺序敏感）
      const stmtRe = /\b(?:router|app|route)\.(use|get|post|put|delete|patch|all)\s*\(/g;
      const routePathRe = /\b(?:router|app|route)\.(?:get|post|put|delete|patch|all)\s*\(\s*['"`]([^'"`]+)['"`]/;

      for (const file of files) {
        const content = readText(file);
        if (content == null) continue;
        if (!/\.(get|post|put|delete|patch|all|use)\s*\(/.test(content)) continue;
        const rel = toRel(root, file);

        // 逐语句按顺序扫描：遇到 router.use(鉴权) 后，其后注册的路由才受组保护
        let groupProtected = false;
        let stmt;
        stmtRe.lastIndex = 0;
        while ((stmt = stmtRe.exec(content)) !== null) {
          const verb = stmt[1].toLowerCase();
          const start = stmt.index;
          // 取该语句向后片段（粗略覆盖跨行 handler，最多 400 字符）
          const snippet = content.slice(start, start + 400);

          if (verb === 'use') {
            if (authNames.some(n => new RegExp(`\\b${escapeRe(n)}\\b`).test(snippet))) {
              groupProtected = true;
            }
            continue;
          }

          // 路由语句
          const pm = snippet.match(routePathRe);
          if (!pm) continue;
          const method = verb.toUpperCase();
          const url = pm[1];
          const lineNo = content.slice(0, start).split('\n').length;
          stats.routesFound++;

          // 行内鉴权：只看「当前这条调用」括号内的参数，避免把后续语句的中间件误算进来
          const openParen = content.indexOf('(', start);
          const callArgs = extractCallArgs(content, openParen);
          const inlineProtected = authNames.some(n => new RegExp(`\\b${escapeRe(n)}\\b`).test(callArgs));

          const isPublic = publicPatterns.some(p => url.toLowerCase().includes(p.toLowerCase()));
          if (isPublic) {
            stats.public++;
            this.addResult({ name: `[公开] ${method} ${url}`, passed: true, category: 'pass',
              message: `${rel}:${lineNo} 命中公开白名单`, detail: { file: rel, line: lineNo, method, url } });
            continue;
          }

          if (groupProtected || inlineProtected) {
            stats.protected++;
            this.addResult({ name: `[已鉴权] ${method} ${url}`, passed: true, category: 'pass',
              message: `${rel}:${lineNo}（${groupProtected ? '路由组' : '行内'}保护）`,
              detail: { file: rel, line: lineNo, method, url, groupProtected, inlineProtected } });
          } else {
            const dynamic = /\$\{|require\(|import\(/.test(callArgs);
            if (dynamic) stats.uncertain++; else stats.unprotected++;
            this.addResult({
              name: `[${dynamic ? '存疑' : '未鉴权'}] ${method} ${url}`, passed: false,
              category: dynamic ? 'uncertain' : 'error',
              message: `${rel}:${lineNo} ${method} ${url} ${dynamic ? '可能为动态挂载，需人工确认' : '注册于鉴权中间件之前且未内联鉴权'}`,
              detail: { file: rel, line: lineNo, method, url, groupProtected, inlineProtected }
            });
          }
        }
      }

      this.setProgress('summary', 100);
      this.addResult({ name: '鉴权覆盖概览', passed: stats.unprotected === 0, category: 'info',
        message: `共识别 ${stats.routesFound} 个接口：已保护 ${stats.protected}，公开白名单 ${stats.public}，未鉴权 ${stats.unprotected}，存疑 ${stats.uncertain}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// 从左括号位置开始做括号配平（感知字符串/模板/注释），返回本次调用括号内的参数文本
function extractCallArgs(content, openParenIdx) {
  if (openParenIdx < 0 || content[openParenIdx] !== '(') return '';
  let depth = 0;
  let quote = null;
  for (let i = openParenIdx; i < content.length && i < openParenIdx + 2000; i++) {
    const ch = content[i];
    const next = content[i + 1];
    if (quote) {
      if (ch === '\\') { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '/' && next === '/') { const nl = content.indexOf('\n', i); i = nl < 0 ? content.length : nl; continue; }
    if (ch === '/' && next === '*') { const end = content.indexOf('*/', i + 2); i = end < 0 ? content.length : end + 1; continue; }
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth === 0) return content.slice(openParenIdx + 1, i); }
  }
  return content.slice(openParenIdx + 1, openParenIdx + 500);
}

module.exports = ApiAuthModule;
