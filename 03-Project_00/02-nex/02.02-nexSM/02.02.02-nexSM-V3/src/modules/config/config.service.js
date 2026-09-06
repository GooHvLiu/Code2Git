/**
 * 系统配置服务层
 * 负责系统配置的业务逻辑处理
 */
const configModel = require('./config.model');

// 内存缓存，避免频繁查询数据库
let configCache = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 缓存有效期 60 秒

/**
 * 初始化系统配置（创建表 + 初始化默认数据）
 */
async function initConfig() {
  await configModel.initTable();
  await configModel.initDefaultData();
  // 清空缓存
  configCache = null;
  cacheTime = 0;
}

/**
 * 解析配置值（根据类型转换）
 * @param {Object} config 配置项
 * @returns {any} 解析后的值
 */
function parseConfigValue(config) {
  if (!config) return null;
  const { config_value, config_type } = config;
  switch (config_type) {
    case 'number':
      return Number(config_value);
    case 'boolean':
      return config_value === 'true';
    case 'json':
      try {
        return JSON.parse(config_value);
      } catch {
        return config_value;
      }
    default:
      return config_value;
  }
}

/**
 * 获取所有配置（解析后的值）
 * @param {boolean} forceRefresh 是否强制刷新缓存
 * @returns {Promise<Object>} 配置对象 { key: value }
 */
async function getAllConfigs(forceRefresh = false) {
  // 检查缓存
  const now = Date.now();
  if (!forceRefresh && configCache && (now - cacheTime) < CACHE_TTL) {
    return { ...configCache };
  }

  const configs = await configModel.getAllConfigs();
  const result = {};
  for (const config of configs) {
    result[config.config_key] = parseConfigValue(config);
  }

  // 更新缓存
  configCache = result;
  cacheTime = now;

  return { ...result };
}

/**
 * 根据分类获取配置
 * @param {string} category 配置分类
 * @returns {Promise<Object>} 配置对象 { key: value }
 */
async function getConfigsByCategory(category) {
  const configs = await configModel.getConfigsByCategory(category);
  const result = {};
  for (const config of configs) {
    result[config.config_key] = parseConfigValue(config);
  }
  return result;
}

/**
 * 根据键获取单个配置值
 * @param {string} key 配置键
 * @param {any} defaultValue 默认值
 * @returns {Promise<any>} 配置值
 */
async function getConfigValue(key, defaultValue = null) {
  const configs = await getAllConfigs();
  return configs[key] !== undefined ? configs[key] : defaultValue;
}

/**
 * 批量更新配置
 * @param {Object} configs 配置对象 { key: value }
 */
async function updateConfigs(configs) {
  await configModel.updateConfigs(configs);
  // 清空缓存，强制下次查询时重新加载
  configCache = null;
  cacheTime = 0;
}

/**
 * 清空缓存（配置变更后调用）
 */
function clearCache() {
  configCache = null;
  cacheTime = 0;
}

module.exports = {
  initConfig,
  getAllConfigs,
  getConfigsByCategory,
  getConfigValue,
  updateConfigs,
  clearCache
};

