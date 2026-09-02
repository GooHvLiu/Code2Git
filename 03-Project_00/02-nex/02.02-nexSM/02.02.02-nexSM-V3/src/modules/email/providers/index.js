/**
 * SMTP服务商工厂
 * 根据服务商类型创建对应的适配器实例
 */
const QQProvider = require('./qq.provider');
const NeteaseProvider = require('./netease.provider');
const GmailProvider = require('./gmail.provider');
const OutlookProvider = require('./outlook.provider');
const CustomProvider = require('./custom.provider');

/**
 * 服务商类型映射
 */
const providerMap = {
  'qq': (config) => new QQProvider(config),
  '163': (config) => new NeteaseProvider(config, '163'),
  '126': (config) => new NeteaseProvider(config, '126'),
  'gmail': (config) => new GmailProvider(config),
  'outlook': (config) => new OutlookProvider(config),
  'custom': (config) => new CustomProvider(config)
};

/**
 * 获取所有支持的服务商列表
 * @returns {Array} 服务商列表
 */
function getSupportedProviders() {
  return [
    { value: 'qq', label: 'QQ邮箱', host: 'smtp.qq.com', port: 465, secure: true },
    { value: '163', label: '163邮箱', host: 'smtp.163.com', port: 465, secure: true },
    { value: '126', label: '126邮箱', host: 'smtp.126.com', port: 465, secure: true },
    { value: 'gmail', label: 'Gmail', host: 'smtp.gmail.com', port: 465, secure: true },
    { value: 'outlook', label: 'Outlook', host: 'smtp.office365.com', port: 587, secure: false },
    { value: 'custom', label: '自定义企业邮箱', host: '', port: 465, secure: true }
  ];
}

/**
 * 创建服务商实例
 * @param {string} provider - 服务商类型
 * @param {Object} config - 邮箱配置
 * @returns {BaseProvider} 服务商实例
 */
function createProvider(provider, config) {
  const ProviderClass = providerMap[provider] || CustomProvider;
  if (typeof ProviderClass === 'function') {
    return ProviderClass(config);
  }
  return new CustomProvider(config);
}

/**
 * 根据服务商类型获取默认配置
 * @param {string} provider - 服务商类型
 * @returns {Object} 默认配置
 */
function getDefaultConfig(provider) {
  const providers = getSupportedProviders();
  const found = providers.find(p => p.value === provider);
  return found || { host: '', port: 465, secure: true };
}

module.exports = {
  createProvider,
  getSupportedProviders,
  getDefaultConfig
};
