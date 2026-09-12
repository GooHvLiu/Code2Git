/**
 * 硬编码检测（hardcode-check）
 * 扫描源码中写死的 URL / IP:端口 / 邮箱 / 本地地址，提示抽取到配置或环境变量。
 * 魔法数字噪音较大，默认关闭。字符串/注释感知，减少误报。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { scanDirectory, matchAll, COMMON_PATTERNS } = require('../shared/sourceScan');

class HardcodeCheckModule extends TestModuleBase {
  static get moduleType() { return 'hardcode-check'; }
  static get moduleName() { return '硬编码检测'; }
  static get description() {
    return '检测前端/后端源码中写死的 http(s)/ws 地址、IPv4 及端口、邮箱地址、localhost/127.0.0.1 等，帮助将环境相关值统一抽取到配置文件或环境变量。可选检测魔法数字，逐处给出文件与行号。';
  }
  static get icon() { return 'Link'; }
  static get category() { return 'quality'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '校验路径' },
      { key: 'scan', label: '扫描硬编码' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'frontendSrcDir', label: '前端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'scanBackend', label: '同时扫描后端', type: 'boolean', span: 12, default: true },
      { key: 'backendSrcDir', label: '后端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'checkUrl', label: '检测http/ws地址', type: 'boolean', span: 12, default: true,
        tip: '检测 http://、https://、ws://、wss:// 开头的写死地址。' },
      { key: 'checkIp', label: '检测IP与端口', type: 'boolean', span: 12, default: true,
        tip: '检测写死的 IPv4 地址（可含端口）。' },
      { key: 'checkLocalhost', label: '检测localhost', type: 'boolean', span: 12, default: true,
        tip: '检测 localhost、127.0.0.1、0.0.0.0 等本地地址写死。' },
      { key: 'checkEmail', label: '检测邮箱地址', type: 'boolean', span: 12, default: false,
        tip: '检测写死的邮箱（示例文档中较多，默认关闭以减少噪音）。' },
      { key: 'checkMagicNumber', label: '检测魔法数字', type: 'boolean', span: 12, default: false,
        tip: '检测代码中未经命名的孤立数字。噪音较大，默认关闭；0/1 等常见值自动忽略。' },
      { key: 'allowDomains', label: '白名单域名', type: 'textarea', span: 24, default: '',
        tip: '包含这些域名/片段的地址不报错（如官方文档链接、CDN 域名），每行一个或英文逗号分隔。' },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: '' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { filesScanned: 0, url: 0, ip: 0, localhost: 0, email: 0, magic: 0 };
    const ignoreDirs = this.parseIgnoreDirs(cfg.ignoreDirs);
    const whitelist = this.parseIgnoreDirs(cfg.allowDomains);

    const isWhitelisted = (s) => whitelist.some(w => s.includes(w));

    const lineFn = (ctx) => {
      const hits = [];
      const push = (rule, label, cat) => {
        for (const h of matchAll(ctx.line, ctx.text, rule.re, rule.key)) {
          if (isWhitelisted(h.match)) continue;
          hits.push({
            name: `[${label}] ${ctx.rel}:${ctx.line}`, passed: false, category: cat,
            message: `${ctx.rel} 第 ${ctx.line} 行：${h.match.slice(0, 100)}`,
            detail: { file: ctx.rel, line: ctx.line, col: h.col, value: h.match, code: ctx.raw.trim().slice(0, 160) }
          });
        }
      };
      if (cfg.checkUrl) push({ key: 'url', re: COMMON_PATTERNS.url }, 'URL', 'warning');
      if (cfg.checkUrl) push({ key: 'ws', re: COMMON_PATTERNS.wsUrl }, 'WS地址', 'warning');
      if (cfg.checkIp) push({ key: 'ip', re: COMMON_PATTERNS.ipv4 }, 'IP', 'warning');
      if (cfg.checkEmail) push({ key: 'email', re: COMMON_PATTERNS.email }, '邮箱', 'uncertain');
      if (cfg.checkLocalhost && /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0)\b/.test(ctx.text)) {
        hits.push({ name: `[本地地址] ${ctx.rel}:${ctx.line}`, passed: false, category: 'warning',
          message: `${ctx.rel} 第 ${ctx.line} 行写死了本地地址`,
          detail: { file: ctx.rel, line: ctx.line, code: ctx.raw.trim().slice(0, 160) } });
      }
      if (cfg.checkMagicNumber) {
        const re = /(?<![\w.])(?!0\b|1\b)(-?\d{2,})(?![\w.])/g;
        for (const h of matchAll(ctx.line, ctx.text, re, 'magic')) {
          // 跳过版本号、年份等明显场景
          if (/version|year|copyright|@author/i.test(ctx.raw)) continue;
          hits.push({ name: `[魔法数字] ${ctx.rel}:${ctx.line}`, passed: false, category: 'uncertain',
            message: `${ctx.rel} 第 ${ctx.line} 行存在未命名数字 ${h.match}`,
            detail: { file: ctx.rel, line: ctx.line, value: h.match, code: ctx.raw.trim().slice(0, 160) } });
        }
      }
      return hits;
    };

    try {
      this.setProgress('prepare', 100);
      const targets = [];
      if (project.frontend_path && fs.existsSync(project.frontend_path))
        targets.push(path.join(project.frontend_path, cfg.frontendSrcDir || 'src'));
      if (cfg.scanBackend && project.backend_path && fs.existsSync(project.backend_path))
        targets.push(path.join(project.backend_path, cfg.backendSrcDir || 'src'));
      if (!targets.length) {
        this.addResult({ name: '路径', passed: false, category: 'error', message: '未找到有效的源码路径' });
        return this.complete(stats);
      }

      this.setProgress('scan', 0);
      const all = [];
      for (let i = 0; i < targets.length; i++) {
        const root = targets[i];
        if (!fs.existsSync(root)) continue;
        const res = scanDirectory(root, lineFn, null, { ignoreDirs });
        stats.filesScanned += res.files;
        all.push(...res.hits);
        this.setProgress('scan', ((i + 1) / targets.length) * 100);
      }
      for (const h of all) {
        const k = h.name.match(/^\[(.+?)\]/)?.[1];
        const statMap = { 'URL': 'url', 'WS地址': 'url', 'IP': 'ip', '邮箱': 'email', '本地地址': 'localhost', '魔法数字': 'magic' };
        const sk = statMap[k];
        if (sk && stats[sk] !== undefined) stats[sk]++;
        this.addResult(h);
      }
      this.setProgress('summary', 100);
      this.addResult({ name: '扫描概览', passed: all.length === 0, category: 'info',
        message: `扫描 ${stats.filesScanned} 个文件：URL ${stats.url}，IP ${stats.ip}，本地地址 ${stats.localhost}，邮箱 ${stats.email}，魔法数字 ${stats.magic}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }
}

module.exports = HardcodeCheckModule;
