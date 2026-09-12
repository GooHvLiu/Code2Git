/**
 * 调试残留检测（console-debug）
 * 扫描生产代码中遗留的 console.* / debugger / alert 等调试语句，
 * 支持放行指定 console 级别、忽略注释、前后端分别扫描。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { scanDirectory, matchAll } = require('../shared/sourceScan');

class ConsoleDebugModule extends TestModuleBase {
  static get moduleType() { return 'console-debug'; }
  static get moduleName() { return '调试残留检测'; }
  static get description() {
    return '扫描前端/后端源码中遗留的 console.log 等控制台输出、debugger 断点、alert/confirm/prompt 调试弹窗。可放行 warn/error 等用于生产上报的级别，自动忽略注释，逐处给出文件与行号。';
  }
  static get icon() { return 'Monitor'; }
  static get category() { return 'quality'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '校验路径' },
      { key: 'scan', label: '扫描调试语句' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    const levelOpts = ['log', 'info', 'debug', 'warn', 'error', 'trace', 'table', 'dir', 'group']
      .map(v => ({ label: `console.${v}`, value: v }));
    return [
      { key: 'frontendSrcDir', label: '前端源码目录', type: 'path', span: 12, default: 'src',
        tip: '相对于项目「前端路径」，一般为 src。' },
      { key: 'scanBackend', label: '同时扫描后端', type: 'boolean', span: 12, default: true,
        tip: '开启后同时扫描项目「后端路径」下的源码。' },
      { key: 'backendSrcDir', label: '后端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'consoleLevels', label: '检测的console级别', type: 'multiselect', span: 12,
        default: ['log', 'info', 'debug', 'trace', 'table', 'dir', 'group'], options: levelOpts,
        tip: '选中的 console.xxx 会被判定为残留；warn/error 常用于生产错误上报，默认不检测，可按需勾选。' },
      { key: 'checkDebugger', label: '检测debugger', type: 'boolean', span: 12, default: true,
        tip: '检测 debugger 断点语句，生产代码中绝不允许遗留。' },
      { key: 'checkAlert', label: '检测alert/confirm', type: 'boolean', span: 12, default: true,
        tip: '检测浏览器原生 alert/confirm/prompt 弹窗（现代应用通常用组件弹窗替代）。' },
      { key: 'skipComments', label: '忽略注释中的内容', type: 'boolean', span: 12, default: true,
        tip: '注释里出现的 console 文本不算残留。' },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: '',
        tip: '额外不扫描的目录名，英文逗号分隔，如 mock,scripts,legacy。' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { filesScanned: 0, consoleHits: 0, debuggerHits: 0, alertHits: 0 };
    const ignoreDirs = this.parseIgnoreDirs(cfg.ignoreDirs);

    try {
      this.setProgress('prepare', 100);
      const levels = new Set(cfg.consoleLevels || []);
      const consoleRe = new RegExp(`\\bconsole\\.(log|info|debug|warn|error|trace|table|dir|group)\\s*\\(`, 'g');

      const lineFn = (ctx) => {
        const hits = [];
        // console
        if (levels.size) {
          for (const h of matchAll(ctx.line, ctx.text, consoleRe, 'console')) {
            const level = (h.match.match(/console\.(\w+)/) || [])[1];
            if (levels.has(level)) {
              hits.push({ name: `[console.${level}] ${ctx.rel}:${ctx.line}`, passed: false, category: 'warning',
                message: `${ctx.rel} 第 ${ctx.line} 行存在 console.${level}`,
                detail: { file: ctx.rel, line: ctx.line, col: h.col, code: ctx.raw.trim().slice(0, 160) } });
            }
          }
        }
        // debugger
        if (cfg.checkDebugger && /\bdebugger\b/.test(ctx.text)) {
          hits.push({ name: `[debugger] ${ctx.rel}:${ctx.line}`, passed: false, category: 'error',
            message: `${ctx.rel} 第 ${ctx.line} 行存在 debugger 断点`,
            detail: { file: ctx.rel, line: ctx.line, code: ctx.raw.trim().slice(0, 160) } });
        }
        // alert
        if (cfg.checkAlert && /\b(?:alert|confirm|prompt)\s*\(/.test(ctx.text)) {
          const mm = ctx.text.match(/\b(alert|confirm|prompt)\s*\(/);
          hits.push({ name: `[${mm[1]}] ${ctx.rel}:${ctx.line}`, passed: false, category: 'warning',
            message: `${ctx.rel} 第 ${ctx.line} 行使用了原生 ${mm[1]}()`,
            detail: { file: ctx.rel, line: ctx.line, code: ctx.raw.trim().slice(0, 160) } });
        }
        return hits;
      };

      const targets = [];
      if (project.frontend_path && fs.existsSync(project.frontend_path)) {
        targets.push({ root: path.join(project.frontend_path, cfg.frontendSrcDir || 'src'), label: '前端' });
      }
      if (cfg.scanBackend && project.backend_path && fs.existsSync(project.backend_path)) {
        targets.push({ root: path.join(project.backend_path, cfg.backendSrcDir || 'src'), label: '后端' });
      }
      if (!targets.length) {
        this.addResult({ name: '路径', passed: false, category: 'error', message: '未找到有效的前端/后端源码路径' });
        return this.finish(stats);
      }

      this.setProgress('scan', 0);
      const all = [];
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        if (!fs.existsSync(t.root)) {
          this.addResult({ name: `${t.label}路径`, passed: false, category: 'uncertain', message: `${t.root} 不存在，跳过` });
          continue;
        }
        const res = scanDirectory(t.root, lineFn, null, { ignoreDirs, skipComments: cfg.skipComments });
        stats.filesScanned += res.files;
        for (const h of res.hits) { h.detail.side = t.label; all.push(h); }
        this.setProgress('scan', ((i + 1) / targets.length) * 100);
      }

      // 汇总分类计数
      for (const h of all) {
        if (h.category === 'error') stats.debuggerHits++;
        else if (h.name.startsWith('[alert') || h.name.startsWith('[confirm') || h.name.startsWith('[prompt')) stats.alertHits++;
        else stats.consoleHits++;
        this.addResult(h);
      }

      this.setProgress('summary', 100);
      this.addResult({ name: '扫描概览', passed: all.length === 0, category: 'info',
        message: `扫描 ${stats.filesScanned} 个文件：console 残留 ${stats.consoleHits}，debugger ${stats.debuggerHits}，原生弹窗 ${stats.alertHits}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }
}

module.exports = ConsoleDebugModule;
