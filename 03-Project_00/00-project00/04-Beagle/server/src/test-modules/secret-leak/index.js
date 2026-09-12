/**
 * 敏感信息泄露检测（secret-leak）
 * 扫描硬编码的私钥、云厂商 AccessKey、API Secret/Token、数据库连接串、JWT、弱口令，
 * 并可选基于香农熵识别疑似随机密钥。安全类问题默认以错误级别报告。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { scanDirectory, matchAll } = require('../shared/sourceScan');

// 固定特征规则
const RULES = [
  { key: 'privateKey', label: '私钥', cat: 'error', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g },
  { key: 'awsKey', label: 'AWS AccessKey', cat: 'error', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { key: 'awsSecret', label: 'AWS SecretKey', cat: 'error', re: /aws_secret[_\w]*\s*[:=]\s*['"][A-Za-z0-9/+=]{40}['"]/gi },
  { key: 'jwt', label: 'JWT令牌', cat: 'warning', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{6,}/g },
  { key: 'connString', label: '数据库连接串', cat: 'error',
    re: /\b(?:mongodb(?:\+srv)?|mysql|postgres(?:ql)?|redis|amqp):\/\/[^\s'"`]+/g },
  { key: 'assignSecret', label: '硬编码密钥赋值', cat: 'warning',
    re: /\b(?:secret|api[_-]?key|apikey|access[_-]?token|auth[_-]?token|client[_-]?secret|passwd|password)\s*[:=]\s*['"][^'"\n]{6,}['"]/gi },
  { key: 'weakPassword', label: '弱口令', cat: 'warning',
    re: /\b(?:password|passwd|pwd)\s*[:=]\s*['"](?:123456|password|admin|root|111111|000000|888888|qwerty|abc123)['"]/gi },
  { key: 'basicAuth', label: 'Basic认证串', cat: 'warning', re: /\bBasic\s+[A-Za-z0-9+/=]{16,}/g }
];

// 香农熵
function shannonEntropy(s) {
  const freq = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  let h = 0;
  for (const k in freq) {
    const p = freq[k] / s.length;
    h -= p * Math.log2(p);
  }
  return h;
}

class SecretLeakModule extends TestModuleBase {
  static get moduleType() { return 'secret-leak'; }
  static get moduleName() { return '敏感信息泄露检测'; }
  static get description() {
    return '扫描代码与配置中硬编码的私钥(PEM)、云厂商 AccessKey、API Secret/Token、JWT、数据库连接串、HTTP Basic 认证、弱口令，并可基于信息熵识别疑似随机生成的密钥，防止凭证随源码泄露。逐处给出文件、行号与风险等级。';
  }
  static get icon() { return 'Key'; }
  static get category() { return 'security'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '校验路径' },
      { key: 'scan', label: '扫描敏感特征' },
      { key: 'entropy', label: '高熵字符串分析' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'frontendSrcDir', label: '前端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'scanBackend', label: '同时扫描后端', type: 'boolean', span: 12, default: true },
      { key: 'backendSrcDir', label: '后端源码目录', type: 'path', span: 12, default: 'src' },
      { key: 'includeConfig', label: '扫描配置/环境文件', type: 'boolean', span: 12, default: true,
        tip: '额外扫描 .env、config.json、yaml/yml 等配置文件（密钥常写在此处）。' },
      { key: 'checkEntropy', label: '高熵字符串检测', type: 'boolean', span: 12, default: true,
        tip: '对疑似密钥赋值的字符串计算香农熵，超过阈值判为疑似随机密钥。可能有误报，归为存疑。' },
      { key: 'entropyThreshold', label: '熵阈值', type: 'number', span: 12, default: 4.5, min: 3, max: 8, step: 0.1,
        tip: '香农熵阈值，越高越严格，常用 4.0~5.0。' },
      { key: 'minSecretLength', label: '密钥最小长度', type: 'number', span: 12, default: 16, min: 8, max: 64,
        tip: '参与高熵分析的字符串最小长度。' },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', span: 24, default: 'test,tests,__tests__,fixtures,mock' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { filesScanned: 0, errors: 0, warnings: 0, entropyHits: 0 };
    const ignoreDirs = this.parseIgnoreDirs(cfg.ignoreDirs);
    const exts = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs', '.cjs', '.json', '.yaml', '.yml', '.env', '.txt', '.ini', '.conf'];

    const lineFn = (ctx) => {
      const hits = [];
      for (const rule of RULES) {
        for (const h of matchAll(ctx.line, ctx.text, rule.re, rule.key)) {
          hits.push({
            name: `[${rule.label}] ${ctx.rel}:${ctx.line}`, passed: false, category: rule.cat,
            message: `${ctx.rel} 第 ${ctx.line} 行疑似${rule.label}`,
            detail: { file: ctx.rel, line: ctx.line, col: h.col, match: mask(h.match), code: ctx.raw.trim().slice(0, 160) }
          });
        }
      }
      // 高熵：xxx = '随机串'
      if (cfg.checkEntropy) {
        const re = /\b(?:key|secret|token|password|credential)[\w]*\s*[:=]\s*['"]([A-Za-z0-9+/=_\-]{8,})['"]/gi;
        for (const h of matchAll(ctx.line, ctx.text, re, 'entropy')) {
          const val = (ctx.text.substring(h.col - 1).match(/['"]([A-Za-z0-9+/=_\-]{8,})['"]/) || [])[1];
          if (!val || val.length < (cfg.minSecretLength || 16)) continue;
          const ent = shannonEntropy(val);
          if (ent >= (cfg.entropyThreshold || 4.5)) {
            hits.push({ name: `[高熵疑似密钥] ${ctx.rel}:${ctx.line}`, passed: false, category: 'uncertain',
              message: `${ctx.rel} 第 ${ctx.line} 行字符串熵=${ent.toFixed(2)}，疑似随机密钥`,
              detail: { file: ctx.rel, line: ctx.line, entropy: Number(ent.toFixed(2)), length: val.length, code: ctx.raw.trim().slice(0, 160) } });
          }
        }
      }
      return hits;
    };

    try {
      this.setProgress('prepare', 100);
      const targets = [];
      if (project.frontend_path && fs.existsSync(project.frontend_path))
        targets.push({ root: project.frontend_path, sub: cfg.frontendSrcDir || 'src', whole: false });
      if (cfg.scanBackend && project.backend_path && fs.existsSync(project.backend_path))
        targets.push({ root: project.backend_path, sub: cfg.backendSrcDir || 'src', whole: false });
      // 配置文件：从项目根扫描（含 .env）
      const configRoots = cfg.includeConfig
        ? [project.frontend_path, project.backend_path].filter(p => p && fs.existsSync(p))
        : [];

      if (!targets.length && !configRoots.length) {
        this.addResult({ name: '路径', passed: false, category: 'error', message: '未找到有效的源码路径' });
        return this.complete(stats);
      }

      this.setProgress('scan', 30);
      const all = [];
      for (const t of targets) {
        const root = path.join(t.root, t.sub);
        if (!fs.existsSync(root)) continue;
        const res = scanDirectory(root, lineFn, null, { ignoreDirs, exts });
        stats.filesScanned += res.files;
        all.push(...res.hits);
      }
      this.setProgress('entropy', 70);
      // 配置文件从根扫描，但忽略已扫过的源码子目录(默认 src)，避免重复
      const srcDirNames = [cfg.frontendSrcDir || 'src', cfg.backendSrcDir || 'src']
        .map(d => String(d).split(/[\\/]/)[0]);
      for (const r of configRoots) {
        const res = scanDirectory(r, lineFn, null, {
          ignoreDirs: [...ignoreDirs, ...srcDirNames, 'node_modules', 'dist', 'build'], exts, maxFiles: 8000
        });
        stats.filesScanned += res.files;
        all.push(...res.hits);
      }

      const seen = new Set();
      for (const h of all) {
        const dedup = `${h.detail.file}:${h.detail.line}:${h.name}`;
        if (seen.has(dedup)) continue;
        seen.add(dedup);
        if (h.category === 'error') stats.errors++;
        else if (h.category === 'warning') stats.warnings++;
        else stats.entropyHits++;
        this.addResult(h);
      }
      this.setProgress('summary', 100);
      this.addResult({ name: '扫描概览', passed: stats.errors === 0, category: 'info',
        message: `扫描 ${stats.filesScanned} 个文件：高危 ${stats.errors}，警告 ${stats.warnings}，高熵存疑 ${stats.entropyHits}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }
}

// 脱敏：只保留前后少量字符，避免把完整密钥写进报告
function mask(s) {
  if (!s) return s;
  s = String(s);
  if (s.length <= 12) return s;
  return s.slice(0, 6) + '******' + s.slice(-4);
}

module.exports = SecretLeakModule;
