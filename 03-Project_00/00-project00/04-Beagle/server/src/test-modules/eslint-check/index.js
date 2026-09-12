/**
 * 代码规范检测（eslint-check）
 * 双模式：
 *  A. 优先加载【被测项目自身】安装的 ESLint 及其配置，使用官方 Node API 进行真实 lint（最准确，零侵入）；
 *  B. 若项目未安装 ESLint，则降级为内置轻量规则集（var 声明、松散相等、空块、超长行、TODO 等）。
 * 只检测与报告，不自动改写被测代码。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { scanDirectory } = require('../shared/sourceScan');
const { walk } = require('../i18n-check/lib/fileWalker');

class EslintCheckModule extends TestModuleBase {
  static get moduleType() { return 'eslint-check'; }
  static get moduleName() { return '代码规范检测'; }
  static get description() {
    return '优先调用被测项目本地安装的 ESLint 与项目配置做真实静态检查（最贴近团队规范）；若项目未安装 ESLint，则使用内置规则检测 var 声明、松散相等(==)、空代码块、超长行、TODO/FIXME 等常见问题。仅检测报告，不会修改源代码。';
  }
  static get icon() { return 'Select'; }
  static get category() { return 'quality'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '检测ESLint环境' },
      { key: 'lint', label: '执行规范检查' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'frontendSrcDir', label: '前端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'scanBackend', label: '同时检查后端', type: 'boolean', span: 12, default: false },
      { key: 'backendSrcDir', label: '后端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'preferProjectEslint', label: '优先用项目ESLint', type: 'boolean', span: 12, default: true,
        tip: '开启后优先加载被测项目 node_modules 中的 ESLint 与配置；找不到时自动降级为内置规则。' },
      { key: 'lintTarget', label: 'ESLint检查范围', type: 'string', span: 12, default: 'src',
        tip: '使用项目 ESLint 时的目标（相对项目根），如 src 或 src/**/*.{js,vue}。' },
      { key: 'noVar', label: '内置: 禁用var', type: 'boolean', span: 12, default: true },
      { key: 'eqeqeq', label: '内置: 强制===', type: 'boolean', span: 12, default: true },
      { key: 'noEmptyBlock', label: '内置: 空代码块', type: 'boolean', span: 12, default: true },
      { key: 'maxLineLength', label: '内置: 单行最大长度', type: 'number', span: 12, default: 0, min: 0, max: 400,
        tip: '超过该行长提示，0 表示不检测。' },
      { key: 'todoStat', label: '内置: 统计TODO/FIXME', type: 'boolean', span: 12, default: true },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: 'test,tests,node_modules,dist,build' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { mode: '', filesScanned: 0, errors: 0, warnings: 0, fixable: 0 };

    try {
      this.setProgress('prepare', 100);
      // 优先项目 ESLint（以前端为准）
      let usedProjectEslint = false;
      if (cfg.preferProjectEslint && project.frontend_path) {
        usedProjectEslint = await this.tryProjectEslint(project.frontend_path, cfg.lintTarget || 'src', stats);
      }
      stats.mode = usedProjectEslint ? '项目ESLint' : '内置规则';

      if (!usedProjectEslint) {
        this.setProgress('lint', 30);
        await this.runBuiltinRules(project, cfg, stats);
      }

      this.setProgress('summary', 100);
      this.addResult({ name: '检查概览', passed: stats.errors === 0, category: 'info',
        message: `模式：${stats.mode}；扫描 ${stats.filesScanned} 文件，错误 ${stats.errors}，警告 ${stats.warnings}${usedProjectEslint ? `，可自动修复 ${stats.fixable}` : ''}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }

  // 尝试加载被测项目自带 ESLint
  async tryProjectEslint(projectRoot, target, stats) {
    const eslintEntry = path.join(projectRoot, 'node_modules', 'eslint');
    if (!fs.existsSync(eslintEntry)) {
      this.addResult({ name: 'ESLint环境', passed: true, category: 'info', message: '项目未安装 ESLint，使用内置规则集' });
      return false;
    }
    let ESLint;
    try {
      // eslint-disable-next-line import/no-dynamic-require
      const mod = require(eslintEntry);
      ESLint = mod.ESLint || mod.Linter;
      if (!ESLint || !mod.ESLint) return false;
    } catch (e) {
      this.addResult({ name: 'ESLint加载', passed: false, category: 'uncertain', message: `加载项目 ESLint 失败，降级内置规则：${e.message}` });
      return false;
    }
    try {
      const eslint = new ESLint({ cwd: projectRoot });
      const results = await eslint.lintFiles([target]);
      for (const r of results) {
        stats.filesScanned++;
        const rel = path.relative(projectRoot, r.filePath).split(path.sep).join('/');
        for (const msg of r.messages) {
          const cat = msg.severity === 2 ? 'error' : 'warning';
          if (cat === 'error') stats.errors++; else stats.warnings++;
          if (msg.fix) stats.fixable++;
          this.addResult({
            name: `[${msg.ruleId || 'parse'}] ${rel}:${msg.line}`, passed: false, category: cat,
            message: msg.message,
            detail: { file: rel, line: msg.line, column: msg.column, ruleId: msg.ruleId, fixable: !!msg.fix }
          });
        }
      }
      return true;
    } catch (e) {
      this.addResult({ name: 'ESLint执行', passed: false, category: 'uncertain', message: `项目 ESLint 执行失败，降级内置规则：${e.message}` });
      return false;
    }
  }

  // 内置规则
  async runBuiltinRules(project, cfg, stats) {
    const ignoreDirs = this.parseIgnoreDirs(cfg.ignoreDirs);
    const lineFn = (ctx) => {
      const hits = [];
      const add = (rule, cat, message) => hits.push({
        name: `[${rule}] ${ctx.rel}:${ctx.line}`, passed: false, category: cat, message: `${ctx.rel} 第 ${ctx.line} 行：${message}`,
        detail: { file: ctx.rel, line: ctx.line, code: ctx.raw.trim().slice(0, 160) }
      });
      if (cfg.noVar && /\bvar\s+[A-Za-z_$]/.test(ctx.text)) { stats.warnings++; add('no-var', 'warning', '建议使用 let/const 替代 var'); }
      if (cfg.eqeqeq) {
        const m = ctx.text.match(/[^=!<>][=!]==?[^=]/);
        if (m && !/===|!==/.test(ctx.text.match(/[=!]==?/g)?.join('') || '')) add('eqeqeq', 'warning', '建议使用严格相等 === / !==');
      }
      if (cfg.noEmptyBlock && /\{\s*\}/.test(ctx.text) && !/\b(?:catch|while|for)\b/.test(ctx.raw)) { stats.warnings++; add('no-empty', 'warning', '空代码块'); }
      if (cfg.maxLineLength > 0 && ctx.raw.length > cfg.maxLineLength) { stats.warnings++; add('max-len', 'warning', `行长度 ${ctx.raw.length} 超过 ${cfg.maxLineLength}`); }
      if (cfg.todoStat && /\b(?:TODO|FIXME|XXX|HACK)\b/.test(ctx.text)) {
        add('todo', 'uncertain', '存在待办标记，发布前建议清理');
      }
      return hits;
    };

    const roots = [];
    if (project.frontend_path && fs.existsSync(project.frontend_path))
      roots.push(path.join(project.frontend_path, cfg.frontendSrcDir || 'src'));
    if (cfg.scanBackend && project.backend_path && fs.existsSync(project.backend_path))
      roots.push(path.join(project.backend_path, cfg.backendSrcDir || 'src'));

    for (const root of roots) {
      if (!fs.existsSync(root)) continue;
      const res = scanDirectory(root, lineFn, null, { ignoreDirs, skipComments: false });
      stats.filesScanned += res.files;
      for (const h of res.hits) {
        if (h.category === 'error') stats.errors++;
        this.addResult(h);
      }
    }
  }
}

module.exports = EslintCheckModule;
