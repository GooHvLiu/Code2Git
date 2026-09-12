/**
 * 构建体积分析（bundle-size）
 * 分析前端构建产物目录（dist/build/out）中每个文件的原始体积与 gzip 体积，
 * 按类型汇总，标记超过单文件阈值/总体积阈值的产物。默认只分析已有产物，
 * 不会自动执行构建（可在配置中显式开启并指定命令）。
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { exec } = require('child_process');
const TestModuleBase = require('../base');

const TYPE_MAP = {
  '.js': 'JavaScript', '.mjs': 'JavaScript', '.css': '样式表',
  '.png': '图片', '.jpg': '图片', '.jpeg': '图片', '.gif': '图片', '.svg': '图片', '.webp': '图片', '.ico': '图片',
  '.woff': '字体', '.woff2': '字体', '.ttf': '字体', '.eot': '字体',
  '.html': 'HTML', '.json': 'JSON', '.map': 'SourceMap'
};

class BundleSizeModule extends TestModuleBase {
  static get moduleType() { return 'bundle-size'; }
  static get moduleName() { return '构建体积分析'; }
  static get description() {
    return '统计前端构建产物中每个文件的大小与 gzip 后大小，按 JS/CSS/图片/字体等类型汇总，识别超大 chunk 与总体积是否超标，辅助首屏加载优化。默认只分析已存在的产物目录；如需先构建，可显式开启执行构建命令。';
  }
  static get icon() { return 'Box'; }
  static get category() { return 'performance'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '定位产物目录' },
      { key: 'build', label: '构建(可选)' },
      { key: 'analyze', label: '统计体积' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'distDir', label: '产物目录', type: 'path', span: 12, default: 'dist',
        tip: '相对于前端路径的构建产物目录，Vite 通常是 dist，Vue CLI 是 dist，Next 是 .next。' },
      { key: 'runBuild', label: '执行前先构建', type: 'boolean', span: 12, default: false,
        tip: '开启后会在前端目录执行构建命令再分析；关闭则只分析现有产物（推荐，避免副作用）。' },
      { key: 'buildCommand', label: '构建命令', type: 'string', span: 12, default: 'npm run build',
        tip: '开启构建时执行的命令。' },
      { key: 'buildTimeout', label: '构建超时(秒)', type: 'number', span: 12, default: 180, min: 30, max: 1200 },
      { key: 'fileLimitKB', label: '单文件阈值(KB)', type: 'number', span: 12, default: 500,
        tip: '单个 JS/CSS 文件原始体积超过该值标记为超标（gzip 体积仅作参考展示）。' },
      { key: 'totalLimitMB', label: '总体积阈值(MB)', type: 'number', span: 12, default: 10,
        tip: '全部产物原始体积总和超过该值标记为超标。' },
      { key: 'ignoreSourcemap', label: '忽略SourceMap', type: 'boolean', span: 12, default: true,
        tip: '.map 文件仅用于调试，不计入体积评估。' },
      { key: 'topN', label: '列出最大文件数', type: 'number', span: 12, default: 15, min: 5, max: 100 }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { totalFiles: 0, totalSizeKB: 0, totalGzipKB: 0, oversized: 0, byType: {} };

    try {
      this.setProgress('prepare', 100);
      const fePath = project.frontend_path;
      if (!fePath || !fs.existsSync(fePath)) {
        this.addResult({ name: '前端路径', passed: false, category: 'error', message: '前端路径不存在' });
        return this.complete(stats);
      }
      const distAbs = path.join(fePath, cfg.distDir || 'dist');

      if (cfg.runBuild) {
        this.setProgress('build', 10);
        await this.runCommand(fePath, cfg.buildCommand || 'npm run build', (cfg.buildTimeout || 180) * 1000);
        this.setProgress('build', 100);
      }

      this.setProgress('analyze', 20);
      if (!fs.existsSync(distAbs)) {
        this.addResult({ name: '产物目录', passed: false, category: 'error',
          message: `产物目录不存在：${distAbs}。可先执行构建，或在配置中修改产物目录。` });
        return this.complete(stats);
      }

      const files = this.collectFiles(distAbs);
      const rows = [];
      let totalBytes = 0;
      let totalGzip = 0;
      for (const f of files) {
        if (cfg.ignoreSourcemap && f.endsWith('.map')) continue;
        const buf = fs.readFileSync(f);
        const size = buf.length;
        const gz = zlib.gzipSync(buf, { level: 9 }).length;
        const ext = path.extname(f).toLowerCase();
        const type = TYPE_MAP[ext] || '其他';
        totalBytes += size;
        totalGzip += gz;
        stats.byType[type] = stats.byType[type] || { files: 0, kb: 0 };
        stats.byType[type].files++;
        stats.byType[type].kb += size / 1024;
        rows.push({ file: path.relative(distAbs, f).split(path.sep).join('/'), size, gzip: gz, type, ext });
      }

      stats.totalFiles = rows.length;
      stats.totalSizeKB = Number((totalBytes / 1024).toFixed(1));
      stats.totalGzipKB = Number((totalGzip / 1024).toFixed(1));

      // 最大文件 TopN
      rows.sort((a, b) => b.gzip - a.gzip);
      const topN = cfg.topN || 15;
      const fileLimitBytes = (cfg.fileLimitKB || 500) * 1024;
      for (const r of rows.slice(0, topN)) {
        const over = ['.js', '.mjs', '.css'].includes(r.ext) && r.size > fileLimitBytes;
        if (over) stats.oversized++;
        this.addResult({
          name: r.file, passed: !over, category: over ? 'warning' : 'pass',
          message: `${r.type}，原始 ${fmtKB(r.size)}，gzip ${fmtKB(r.gzip)}${over ? '（超过单文件阈值）' : ''}`,
          detail: { file: r.file, type: r.type, sizeKB: Number((r.size / 1024).toFixed(2)), gzipKB: Number((r.gzip / 1024).toFixed(2)) }
        });
      }

      // 类型汇总
      for (const [type, v] of Object.entries(stats.byType)) {
        this.addResult({ name: `类型汇总: ${type}`, passed: true, category: 'info',
          message: `${v.files} 个文件，合计 ${fmtKB(v.kb * 1024)}` });
      }

      // 总体积判定
      const totalLimitBytes = (cfg.totalLimitMB || 10) * 1024 * 1024;
      const totalOver = totalBytes > totalLimitBytes;
      const hasIssue = totalOver || stats.oversized > 0;
      this.setProgress('summary', 100);
      this.addResult({ name: '总体积', passed: !hasIssue, category: hasIssue ? 'warning' : 'pass',
        message: `共 ${stats.totalFiles} 个文件，原始 ${fmtKB(totalBytes)}，gzip ${fmtKB(totalGzip)}；超大文件 ${stats.oversized} 个`,
        detail: { totalBytes, totalGzip, oversized: stats.oversized } });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }

  collectFiles(dir) {
    const out = [];
    const stack = [dir];
    while (stack.length) {
      const d = stack.pop();
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) stack.push(full);
        else out.push(full);
      }
    }
    return out;
  }

  runCommand(cwd, command, timeout) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd, timeout, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
        if (err) {
          this.addResult({ name: '构建命令', passed: false, category: 'error', message: `${command} 执行失败：${err.message}`,
            detail: { stderr: String(stderr).slice(-2000) } });
          return reject(err);
        }
        this.addResult({ name: '构建命令', passed: true, category: 'info', message: `${command} 执行完成` });
        resolve(stdout);
      });
    });
  }
}

function fmtKB(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}

module.exports = BundleSizeModule;
