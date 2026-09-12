/**
 * 测试模块基类
 * 所有测试模块必须继承此类，实现 run() 方法
 * 新增测试模块只需：继承本类 + 在 registry.js 中注册
 */
class TestModuleBase {
  constructor(projectConfig, moduleConfig = {}) {
    this.project = projectConfig;
    // 自动按 configSchema 默认值合并项目级配置
    this.config = moduleConfig;
    this.cfg = { ...this.constructor.getDefaultConfig(), ...moduleConfig };
    this.results = [];
    this.startTime = null;
    this.endTime = null;
    this.currentStage = '';
    this.stageProgress = 0;
  }

  // ========== 子类必须实现的静态属性 ==========
  static get moduleType() {
    throw new Error('子类必须实现 moduleType');
  }
  static get moduleName() {
    throw new Error('子类必须实现 moduleName');
  }
  static get description() {
    return '';
  }
  static get icon() {
    return 'Setting';
  }
  static get category() {
    return 'other';
  }
  static get version() {
    return '1.0.0';
  }
  static get author() {
    return '';
  }

  /**
   * 进度阶段定义（子类可覆盖）
   * 返回数组，每个元素 { key, label }
   * 例如：[{ key: 'scan', label: '扫描文件' }, { key: 'compare', label: '对比字段' }]
   */
  static get progressStages() {
    return [{ key: 'run', label: '执行测试' }];
  }

  /**
   * 声明式配置 Schema（L1：覆盖约90%场景，插件无需写前端界面）
   * 平台据此自动渲染配置表单。每个字段：
   * {
   *   key, label, type, default, required, placeholder, tip,
   *   options(select用), group(分组), span(栅格跨度)
   * }
   * type 支持: string | password | number | boolean | select | textarea | path
   */
  static get configSchema() {
    return [];
  }

  /**
   * 从 configSchema 提取默认配置对象
   */
  static getDefaultConfig() {
    const cfg = {};
    for (const field of this.configSchema) {
      if (field.default !== undefined) {
        // 深拷贝，避免数组/对象默认值被实例共享篡改
        cfg[field.key] = JSON.parse(JSON.stringify(field.default));
      } else if (field.type === 'boolean') {
        cfg[field.key] = false;
      } else if (field.type === 'multiselect') {
        cfg[field.key] = [];
      } else if (field.type === 'number') {
        cfg[field.key] = null;
      } else {
        cfg[field.key] = '';
      }
    }
    return cfg;
  }

  // ========== 子类必须实现的方法 ==========
  async run() {
    throw new Error('子类必须实现 run() 方法');
  }

  // ========== 通用方法 ==========

  /**
   * 开始计时
   */
  startTimer() {
    this.startTime = Date.now();
  }

  /**
   * 结束计时
   */
  stopTimer() {
    this.endTime = Date.now();
  }

  /**
   * 获取耗时（毫秒）
   */
  getDuration() {
    if (!this.startTime) return 0;
    const end = this.endTime || Date.now();
    return end - this.startTime;
  }

  /**
   * 设置当前进度阶段（子类在 run() 中调用）
   * @param {string} stageKey - 阶段 key
   * @param {number} progress - 当前阶段进度 0-100
   */
  setProgress(stageKey, progress = 0) {
    this.currentStage = stageKey;
    this.stageProgress = progress;
    // 输出到 stdout，供执行器捕获
    const stages = this.constructor.progressStages;
    const stageIndex = stages.findIndex(s => s.key === stageKey);
    const overallProgress = stages.length > 1
      ? Math.round(((stageIndex + progress / 100) / stages.length) * 100)
      : progress;
    console.log(`[PROGRESS] ${stageKey}|${progress}|${overallProgress}`);
  }

  /**
   * 添加一条测试结果
   * @param {Object} result - { name, passed, message, expected, actual, detail, category }
   */
  addResult(result) {
    this.results.push({
      id: this.results.length + 1,
      name: result.name || '',
      passed: !!result.passed,
      message: result.message || '',
      expected: result.expected || '',
      actual: result.actual || '',
      detail: result.detail || null,
      category: result.category || '',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 批量添加结果
   */
  addResults(results) {
    results.forEach(r => this.addResult(r));
  }

  /**
   * 解析"额外忽略目录"配置（中英文逗号分隔）
   */
  parseIgnoreDirs(s) {
    return s ? String(s).split(/[,，]/).map(x => x.trim()).filter(Boolean) : [];
  }

  /**
   * 统一收尾：停止计时、生成报告并注入 stats 与分类计数
   * 子类 run() 末尾直接 return this.complete(stats) 即可
   */
  complete(stats = {}) {
    this.stopTimer();
    const report = this.generateReport();
    report.stats = stats;
    report.categoryCount = {};
    for (const r of this.results) {
      report.categoryCount[r.category || 'other'] = (report.categoryCount[r.category || 'other'] || 0) + 1;
    }
    return report;
  }

  /**
   * 生成统一格式的报告
   */
  generateReport() {
    const total = this.results.length;
    const pass = this.results.filter(r => r.passed).length;
    const fail = total - pass;
    return {
      moduleType: this.constructor.moduleType,
      moduleName: this.constructor.moduleName,
      projectId: this.project.id,
      projectName: this.project.name,
      total,
      pass,
      fail,
      passRate: total > 0 ? Number(((pass / total) * 100).toFixed(1)) : 0,
      duration: this.getDuration(),
      results: this.results,
      summary: this.generateSummary(),
      progressStages: this.constructor.progressStages,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 生成摘要（子类可覆盖）
   */
  generateSummary() {
    const total = this.results.length;
    const pass = this.results.filter(r => r.passed).length;
    return `共 ${total} 项检查，通过 ${pass} 项，失败 ${total - pass} 项`;
  }

  /**
   * 获取模块元信息
   */
  static getMeta() {
    return {
      moduleType: this.moduleType,
      moduleName: this.moduleName,
      description: this.description,
      icon: this.icon,
      category: this.category,
      version: this.version,
      author: this.author,
      progressStages: this.progressStages,
      configSchema: this.configSchema
    };
  }
}

module.exports = TestModuleBase;
