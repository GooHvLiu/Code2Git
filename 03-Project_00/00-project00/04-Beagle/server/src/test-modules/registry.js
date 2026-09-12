/**
 * 测试模块注册器
 * 自动扫描 test-modules 目录下的所有子目录，注册插件
 */
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('./base');

class ModuleRegistry {
  constructor() {
    this.modules = new Map();
  }

  /**
   * 注册一个测试模块
   */
  register(ModuleClass) {
    if (!(ModuleClass.prototype instanceof TestModuleBase)) {
      throw new Error(`模块 ${ModuleClass.name} 必须继承 TestModuleBase`);
    }
    const type = ModuleClass.moduleType;
    if (this.modules.has(type)) {
      console.warn(`[Registry] 模块类型 ${type} 已存在，将被覆盖`);
    }
    this.modules.set(type, ModuleClass);
    console.log(`[Registry] 已注册模块: ${type} - ${ModuleClass.moduleName}`);
  }

  /**
   * 自动扫描目录并注册所有插件
   */
  autoDiscover() {
    const modulesDir = __dirname;
    const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === 'node_modules') continue;
      const indexPath = path.join(modulesDir, entry.name, 'index.js');
      if (fs.existsSync(indexPath)) {
        try {
          const ModuleClass = require(indexPath);
          if (ModuleClass.prototype instanceof TestModuleBase) {
            this.register(ModuleClass);
          }
        } catch (err) {
          console.error(`[Registry] 加载插件 ${entry.name} 失败:`, err.message);
        }
      }
    }
  }

  getModule(moduleType) {
    return this.modules.get(moduleType) || null;
  }

  listModules() {
    const list = [];
    for (const [type, ModuleClass] of this.modules) {
      list.push(ModuleClass.getMeta());
    }
    return list;
  }

  listModulesByCategory() {
    const groups = {};
    for (const [type, ModuleClass] of this.modules) {
      const meta = ModuleClass.getMeta();
      if (!groups[meta.category]) {
        groups[meta.category] = [];
      }
      groups[meta.category].push(meta);
    }
    return groups;
  }

  createInstance(moduleType, projectConfig, moduleConfig) {
    const ModuleClass = this.getModule(moduleType);
    if (!ModuleClass) {
      throw new Error(`未找到模块类型: ${moduleType}`);
    }
    return new ModuleClass(projectConfig, moduleConfig);
  }

  has(moduleType) {
    return this.modules.has(moduleType);
  }
}

// 全局单例
const registry = new ModuleRegistry();

// 自动发现所有插件
registry.autoDiscover();

module.exports = registry;
