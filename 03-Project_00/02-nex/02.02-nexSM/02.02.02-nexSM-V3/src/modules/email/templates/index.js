/**
 * 邮件模板注册中心
 * 管理所有邮件模板，支持动态注册和获取
 */
const BaseTemplate = require('./base.template');
const PasswordResetTemplate = require('./passwordReset.template');
const NotificationTemplate = require('./notification.template');
const TestEmailTemplate = require('./test.template');

class TemplateRegistry {
  constructor() {
    this.templates = new Map();
    // 注册内置模板
    this.register('base', new BaseTemplate());
    this.register('passwordReset', new PasswordResetTemplate());
    this.register('notification', new NotificationTemplate());
    this.register('test', new TestEmailTemplate());
  }

  /**
   * 注册模板
   * @param {string} name - 模板名称
   * @param {BaseTemplate} template - 模板实例
   */
  register(name, template) {
    if (!(template instanceof BaseTemplate)) {
      throw new Error('模板必须继承自BaseTemplate');
    }
    this.templates.set(name, template);
    console.log(`[邮件模板] 注册模板: ${name}`);
  }

  /**
   * 获取模板
   * @param {string} name - 模板名称
   * @returns {BaseTemplate} 模板实例
   */
  get(name) {
    const template = this.templates.get(name);
    if (!template) {
      console.warn(`[邮件模板] 未找到模板: ${name}，使用默认模板`);
      return this.templates.get('base');
    }
    return template;
  }

  /**
   * 检查模板是否存在
   * @param {string} name - 模板名称
   * @returns {boolean} 是否存在
   */
  has(name) {
    return this.templates.has(name);
  }

  /**
   * 获取所有模板名称
   * @returns {Array} 模板名称列表
   */
  getAllNames() {
    return Array.from(this.templates.keys());
  }

  /**
   * 渲染模板
   * @param {string} name - 模板名称
   * @param {Object} data - 模板数据
   * @returns {Object} { subject, html, text }
   */
  render(name, data = {}) {
    const template = this.get(name);
    return {
      subject: template.renderSubject(data),
      html: template.renderHtml(data),
      text: template.renderText(data)
    };
  }
}

// 导出单例
module.exports = new TemplateRegistry();
module.exports.TemplateRegistry = TemplateRegistry;
