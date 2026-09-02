/**
 * 邮箱模块入口
 * 提供简洁的API，一行代码就能发邮件
 *
 * 使用示例：
 * const email = require('./modules/email');
 *
 * // 发送简单邮件
 * await email.send({
 *   to: 'user@example.com',
 *   subject: '邮件主题',
 *   html: '<h1>邮件内容</h1>'
 * });
 *
 * // 发送模板邮件
 * await email.sendTemplate('passwordReset', {
 *   username: '张三',
 *   resetLink: 'https://example.com/reset?token=xxx',
 *   expiresInMinutes: 30
 * }, {
 *   to: 'user@example.com'
 * });
 *
 * // 发送测试邮件
 * await email.sendTestEmail(1, 'test@example.com');
 *
 * // 验证SMTP连接
 * await email.verifyConnection({ host: 'smtp.qq.com', port: 465, username: 'xxx@qq.com', password: 'xxx' });
 */

const emailService = require('./email.service');
const emailConfigModel = require('./email.model');
const { createProvider, getSupportedProviders, getDefaultConfig } = require('./providers');
const templateRegistry = require('./templates');
const { encrypt, decrypt, maskEmail } = require('./utils/crypto.util');

/**
 * 发送邮件
 * @param {Object} options - 发送选项
 * @returns {Promise<Object>} 发送结果
 */
async function send(options) {
  return emailService.send(options);
}

/**
 * 发送模板邮件
 * @param {string} template - 模板名称
 * @param {Object} templateData - 模板数据
 * @param {Object} options - 其他发送选项
 * @returns {Promise<Object>} 发送结果
 */
async function sendTemplate(template, templateData = {}, options = {}) {
  return emailService.sendTemplate(template, templateData, options);
}

/**
 * 发送测试邮件
 * @param {number} configId - 配置ID
 * @param {string} toEmail - 测试收件人邮箱
 * @returns {Promise<Object>} 发送结果
 */
async function sendTestEmail(configId, toEmail) {
  return emailService.sendTestEmail(configId, toEmail);
}

/**
 * 验证SMTP连接
 * @param {Object} config - 邮箱配置
 * @returns {Promise<Object>} 验证结果
 */
async function verifyConnection(config) {
  return emailService.verifyConnection(config);
}

module.exports = {
  // 核心发送方法
  send,
  sendTemplate,
  sendTestEmail,
  verifyConnection,

  // 服务和模型
  service: emailService,
  model: emailConfigModel,

  // 服务商相关
  providers: {
    create: createProvider,
    getSupported: getSupportedProviders,
    getDefault: getDefaultConfig
  },

  // 模板相关
  templates: templateRegistry,

  // 工具函数
  utils: {
    encrypt,
    decrypt,
    maskEmail
  }
};
