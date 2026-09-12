/**
 * 必备文件完整性检测（required-files）
 * 检查前端/后端项目根目录是否具备工程化必备文件（README、package.json、.gitignore、锁文件等）
 * 与必备目录，支持简单通配符与自定义清单；并校验 package.json 必备字段。
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');

// 默认推荐清单（缺失时给警告，而非错误，因为技术栈不同）
const DEFAULT_FRONT_FILES = ['README.md', 'package.json', '.gitignore', 'index.html', 'vite.config.*', '.env.example'];
const DEFAULT_BACK_FILES = ['README.md', 'package.json', '.gitignore', '.env.example'];
const DEFAULT_DIRS = ['src'];

class RequiredFilesModule extends TestModuleBase {
  static get moduleType() { return 'required-files'; }
  static get moduleName() { return '必备文件完整性'; }
  static get description() {
    return '检查前端/后端工程是否具备标准化项目应有的文件与目录（说明文档、清单、忽略规则、环境变量样例、锁文件、源码目录等），并校验 package.json 是否包含 name/version/scripts 等必备字段，帮助产出结构完整、可交接的标准项目模板。支持通配符与自定义清单。';
  }
  static get icon() { return 'FolderChecked'; }
  static get category() { return 'quality'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'prepare', label: '解析清单' },
      { key: 'check', label: '逐项检查' },
      { key: 'summary', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'checkFrontend', label: '检查前端', type: 'boolean', span: 12, default: true },
      { key: 'checkBackend', label: '检查后端', type: 'boolean', span: 12, default: true },
      { key: 'frontendFiles', label: '前端必备文件', type: 'textarea', span: 12, rows: 6,
        default: DEFAULT_FRONT_FILES.join('\n'), tip: '每行一个，相对前端根路径，支持 * 通配，如 vite.config.*。' },
      { key: 'backendFiles', label: '后端必备文件', type: 'textarea', span: 12, rows: 6,
        default: DEFAULT_BACK_FILES.join('\n') },
      { key: 'requiredDirs', label: '必备目录', type: 'textarea', span: 12, rows: 4,
        default: DEFAULT_DIRS.join('\n'), tip: '每行一个目录名，前后端均检查。' },
      { key: 'checkPackageJson', label: '校验package.json字段', type: 'boolean', span: 12, default: true,
        tip: '检查 package.json 是否含 name、version、scripts、依赖等关键字段。' },
      { key: 'checkLockFile', label: '检查依赖锁文件', type: 'boolean', span: 12, default: true,
        tip: '检查是否存在 package-lock.json / yarn.lock / pnpm-lock.yaml 之一。' },
      { key: 'missingLevel', label: '缺失级别', type: 'select', span: 12, default: 'warning',
        options: [{ label: '警告', value: 'warning' }, { label: '错误', value: 'error' }],
        tip: '必备项缺失时报告为警告还是错误。' }
    ];
  }

  async run() {
    this.startTimer();
    const cfg = this.cfg;
    const project = this.project;
    const stats = { checked: 0, missing: 0, present: 0 };
    const level = cfg.missingLevel || 'warning';
    const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);

    try {
      this.setProgress('prepare', 100);
      const jobs = [];
      if (cfg.checkFrontend && project.frontend_path && fs.existsSync(project.frontend_path))
        jobs.push({ root: project.frontend_path, label: '前端', files: lines(cfg.frontendFiles) });
      if (cfg.checkBackend && project.backend_path && fs.existsSync(project.backend_path))
        jobs.push({ root: project.backend_path, label: '后端', files: lines(cfg.backendFiles) });
      if (!jobs.length) {
        this.addResult({ name: '路径', passed: false, category: 'error', message: '未找到有效的前端/后端路径' });
        return this.complete(stats);
      }

      this.setProgress('check', 0);
      const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
      for (let ji = 0; ji < jobs.length; ji++) {
        const job = jobs[ji];
        // 必备文件
        for (const rel of job.files) {
          stats.checked++;
          const exists = this.matchExists(job.root, rel);
          if (exists) {
            stats.present++;
            this.addResult({ name: `[${job.label}] ${rel}`, passed: true, category: 'pass', message: '存在' });
          } else {
            stats.missing++;
            this.addResult({ name: `[${job.label}] 缺少 ${rel}`, passed: false, category: level,
              message: `${job.label}根目录缺少推荐文件：${rel}` });
          }
        }
        // 必备目录
        for (const d of lines(cfg.requiredDirs)) {
          stats.checked++;
          if (fs.existsSync(path.join(job.root, d)) && fs.statSync(path.join(job.root, d)).isDirectory()) {
            stats.present++;
          } else {
            stats.missing++;
            this.addResult({ name: `[${job.label}] 缺少目录 ${d}`, passed: false, category: level, message: `${job.label}缺少目录：${d}` });
          }
        }
        // 锁文件
        if (cfg.checkLockFile) {
          stats.checked++;
          const hasLock = lockFiles.some(f => fs.existsSync(path.join(job.root, f)));
          if (hasLock) stats.present++;
          else {
            stats.missing++;
            this.addResult({ name: `[${job.label}] 缺少依赖锁文件`, passed: false, category: 'uncertain',
              message: '未发现 package-lock.json / yarn.lock / pnpm-lock.yaml，依赖版本可能不稳定' });
          }
        }
        // package.json 字段
        if (cfg.checkPackageJson) {
          const pkgPath = path.join(job.root, 'package.json');
          if (fs.existsSync(pkgPath)) {
            try {
              const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
              for (const field of ['name', 'version', 'scripts']) {
                stats.checked++;
                if (pkg[field] !== undefined && pkg[field] !== null && pkg[field] !== '') {
                  stats.present++;
                } else {
                  stats.missing++;
                  this.addResult({ name: `[${job.label}] package.json 缺 ${field}`, passed: false, category: 'warning',
                    message: `package.json 缺少必备字段：${field}`, detail: { field } });
                }
              }
              const hasDep = pkg.dependencies || pkg.devDependencies || pkg.peerDependencies;
              stats.checked++;
              if (hasDep) stats.present++;
              else this.addResult({ name: `[${job.label}] package.json 无依赖`, passed: false, category: 'uncertain', message: '未声明任何 dependencies/devDependencies' });
            } catch (e) {
              this.addResult({ name: `[${job.label}] package.json 解析失败`, passed: false, category: 'error', message: e.message });
            }
          }
        }
        this.setProgress('check', ((ji + 1) / jobs.length) * 100);
      }

      this.setProgress('summary', 100);
      this.addResult({ name: '完整性概览', passed: stats.missing === 0, category: 'info',
        message: `共检查 ${stats.checked} 项，齐备 ${stats.present}，缺失 ${stats.missing}` });
    } catch (err) {
      this.addResult({ name: '执行异常', passed: false, category: 'error', message: err.message, detail: { stack: err.stack } });
    }
    return this.complete(stats);
  }

  // 支持简单 * 通配的存在判断
  matchExists(root, rel) {
    if (!rel.includes('*')) return fs.existsSync(path.join(root, rel));
    const dir = path.dirname(rel);
    const base = path.basename(rel);
    const dirAbs = path.join(root, dir === '.' ? '' : dir);
    if (!fs.existsSync(dirAbs)) return false;
    const pattern = new RegExp('^' + base.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
    try {
      return fs.readdirSync(dirAbs).some(name => pattern.test(name));
    } catch (e) {
      return false;
    }
  }
}

module.exports = RequiredFilesModule;
