/**
 * API 可达性检测（api-reachability）
 * 1) 从前端/后端代码静态提取接口调用（axios/request/fetch），也支持手工补充接口清单；
 * 2) 拼接 baseURL 后主动发起 HTTP 探测，按状态码判定：2xx 可达、401/403 可达但需鉴权、
 *    404 路径不存在、5xx 服务异常、网络错误/超时不可达。
 * 默认只探测 GET/HEAD 等无副作用方法，写操作(POST/PUT/DELETE)默认跳过或改用 OPTIONS 预检。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { walk, readText, toRel } = require('../i18n-check/lib/fileWalker');

// 提取接口调用：axios.get('/x')、request({ url:'/x', method:'post' })、fetch('/x')
const CALL_PATTERNS = [
  /\b(?:axios|http|request|service|api)\.(get|post|put|delete|patch|head|options)\s*\(\s*['"`]([^'"`]+)['"`]/gi,
  /\brequest\s*\(\s*\{[\s\S]{0,200}?url\s*:\s*['"`]([^'"`]+)['"`][\s\S]{0,120}?method\s*:\s*['"`]([a-z]+)['"`]/gi,
  /\bfetch\s*\(\s*['"`]([^'"`]+)['"`]/gi
];
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

class ApiReachabilityModule extends TestModuleBase {
  static get moduleType() { return 'api-reachability'; }
  static get moduleName() { return 'API可达性检测'; }
  static get description() {
    return '自动从代码中提取接口路径并拼接基础地址发起真实 HTTP 探测，判断每个接口是否可达、是否需要鉴权、是否 404/5xx；也支持手工录入接口清单。为避免副作用，默认只探测 GET 等安全方法，写操作可选择跳过或用 OPTIONS 预检，适合接口联调前的批量连通性验证。';
  }
  static get icon() { return 'Position'; }
  static get category() { return 'api'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '准备配置' },
      { key: 'extract', label: '提取接口' },
      { key: 'probe', label: '逐个探测' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'apiBaseUrl', label: '接口基础地址', type: 'string', span: 12, default: '',
        tip: '如 http://127.0.0.1:3000，留空则使用项目配置中的 API 基础地址。接口路径会拼接到其后。' },
      { key: 'extractFromCode', label: '从代码提取接口', type: 'boolean', span: 12, default: true,
        tip: '扫描源码中的 axios/request/fetch 调用，自动收集接口。' },
      { key: 'frontendSrcDir', label: '前端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'manualApis', label: '手工接口清单', type: 'textarea', span: 12, rows: 4, default: '',
        tip: '补充代码中提取不到的接口，每行一个，格式：METHOD 路径，如 GET /api/user/list。' },
      { key: 'timeoutMs', label: '请求超时(ms)', type: 'number', span: 12, default: 8000, min: 1000, max: 60000 },
      { key: 'probeWrite', label: '探测写操作', type: 'boolean', span: 12, default: false,
        tip: '开启后 POST/PUT/DELETE 也会真实发请求（可能产生数据副作用，谨慎开启）。关闭时写操作默认跳过。' },
      { key: 'writeUseOptions', label: '写操作改用OPTIONS', type: 'boolean', span: 12, default: true,
        tip: '不直接发写请求，而用 OPTIONS 预检判断接口是否存在，避免副作用。' },
      { key: 'authToken', label: 'Authorization令牌', type: 'password', span: 12, default: '',
        tip: '需要登录的接口可填入 Bearer Token，探测时附带 Authorization 头。' },
      { key: 'extraHeaders', label: '自定义请求头', type: 'textarea', span: 12, rows: 3, default: '',
        tip: '每行一个，格式 Key: Value。' },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: 'test,tests,node_modules,dist,build' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { apis: 0, reachable: 0, needsAuth: 0, notFound: 0, serverError: 0, networkError: 0, skipped: 0 };
    const apiMap = new Map();

    try {
      this.setProgress('prepare', 100);
      const baseUrl = (cfg.apiBaseUrl || project.api_base_url || '').replace(/\/+$/, '');
      if (!baseUrl) {
        this.addResult({ name: '基础地址', passed: false, category: 'error', message: '未配置接口基础地址（apiBaseUrl 或项目 API 地址）' });
        return this.complete(stats);
      }
      const addApi = (method, urlPath, src) => {
        if (/^https?:\/\//.test(urlPath)) return; // 绝对地址不拼接
        const key = `${method.toUpperCase()} ${urlPath}`;
        if (!apiMap.has(key)) apiMap.set(key, { method: method.toUpperCase(), path: urlPath, sources: [] });
        if (src) apiMap.get(key).sources.push(src);
      };

      // 代码提取
      if (cfg.extractFromCode && project.frontend_path && fs.existsSync(project.frontend_path)) {
        this.setProgress('extract', 50);
        const srcRoot = path.join(project.frontend_path, cfg.frontendSrcDir || 'src');
        if (fs.existsSync(srcRoot)) {
          const ignoreDirs = this.parseIgnoreDirs(cfg.ignoreDirs);
          const { files } = walk(srcRoot, { exts: ['.js', '.jsx', '.ts', '.tsx', '.vue'], ignoreDirs, maxFiles: 12000 });
          for (const file of files) {
            const content = readText(file);
            if (!content) continue;
            const rel = toRel(srcRoot, file);
            for (const re of CALL_PATTERNS) {
              re.lastIndex = 0;
              let m;
              while ((m = re.exec(content)) !== null) {
                if (m[0].startsWith('fetch')) addApi('GET', m[1], rel);
                else if (m[2] && re.source.includes('method')) addApi(m[2], m[1], rel); // request({url,method})
                else addApi(m[1], m[2], rel);
              }
            }
          }
        }
      }
      // 手工清单
      for (const line of String(cfg.manualApis || '').split('\n')) {
        const t = line.trim();
        if (!t) continue;
        const mm = t.match(/^([A-Za-z]+)\s+(.+)$/);
        if (mm) addApi(mm[1], mm[2].trim(), '手工');
      }

      stats.apis = apiMap.size;
      this.addResult({ name: '接口收集', passed: stats.apis > 0, category: 'info', message: `共收集 ${stats.apis} 个去重接口，基础地址 ${baseUrl}` });
      if (!stats.apis) return this.complete(stats);

      // 请求头
      const headers = {};
      if (cfg.authToken) headers.Authorization = cfg.authToken.startsWith('Bearer ') ? cfg.authToken : `Bearer ${cfg.authToken}`;
      for (const l of String(cfg.extraHeaders || '').split('\n')) {
        const idx = l.indexOf(':');
        if (idx > 0) headers[l.slice(0, idx).trim()] = l.slice(idx + 1).trim();
      }

      // 逐个探测
      this.setProgress('probe', 0);
      const apis = [...apiMap.values()];
      let i = 0;
      for (const api of apis) {
        i++;
        let method = api.method;
        if (!SAFE_METHODS.has(method)) {
          if (!cfg.probeWrite) {
            if (cfg.writeUseOptions) method = 'OPTIONS';
            else { stats.skipped++; this.addResult({ name: `[跳过] ${api.method} ${api.path}`, passed: true, category: 'info', message: '写操作默认跳过，避免副作用' }); continue; }
          }
        }
        const url = baseUrl + api.path;
        const result = await this.probe(url, method, headers, cfg.timeoutMs || 8000);
        this.classify(result, api, method, stats);
        this.setProgress('probe', (i / apis.length) * 100);
      }

      this.setProgress('summary', 100);
      this.addResult({ name: '可达性概览', passed: stats.networkError === 0 && stats.serverError === 0, category: 'info',
        message: `共 ${stats.apis}：可达 ${stats.reachable}，需鉴权 ${stats.needsAuth}，404 ${stats.notFound}，5xx ${stats.serverError}，网络错误 ${stats.networkError}，跳过 ${stats.skipped}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }

  async probe(url, method, headers, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { method, headers, signal: controller.signal });
      return { ok: true, status: res.status };
    } catch (e) {
      return { ok: false, error: e.name === 'AbortError' ? '超时' : e.message };
    } finally {
      clearTimeout(timer);
    }
  }

  classify(result, api, usedMethod, stats) {
    const label = `${usedMethod} ${api.path}`;
    if (!result.ok) {
      stats.networkError++;
      this.addResult({ name: `[不可达] ${label}`, passed: false, category: 'error', message: `请求失败：${result.error}`, detail: { ...api } });
      return;
    }
    const s = result.status;
    if (s >= 200 && s < 400) {
      stats.reachable++;
      this.addResult({ name: `[可达] ${label}`, passed: true, category: 'pass', message: `状态码 ${s}`, detail: { ...api, status: s } });
    } else if (s === 401 || s === 403) {
      stats.needsAuth++;
      this.addResult({ name: `[需鉴权] ${label}`, passed: true, category: 'uncertain', message: `状态码 ${s}，接口存在但需要认证`, detail: { ...api, status: s } });
    } else if (s === 404) {
      stats.notFound++;
      this.addResult({ name: `[404] ${label}`, passed: false, category: 'warning', message: '路径不存在(404)', detail: { ...api, status: s } });
    } else if (s >= 500) {
      stats.serverError++;
      this.addResult({ name: `[5xx] ${label}`, passed: false, category: 'error', message: `服务异常 ${s}`, detail: { ...api, status: s } });
    } else {
      stats.reachable++;
      this.addResult({ name: `[${s}] ${label}`, passed: true, category: 'info', message: `状态码 ${s}`, detail: { ...api, status: s } });
    }
  }
}

module.exports = ApiReachabilityModule;
