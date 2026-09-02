/**
 * 通用通知邮件模板
 * 用于系统通知、操作提醒等通用场景
 */
const BaseTemplate = require('./base.template');

class NotificationTemplate extends BaseTemplate {
  constructor() {
    super();
    this.templateName = 'notification';
  }

  /**
   * 渲染邮件主题
   * @param {Object} data - 模板数据
   * @param {string} data.title - 通知标题
   * @returns {string} 邮件主题
   */
  renderSubject(data = {}) {
    return data.title || '【nexSM】系统通知';
  }

  /**
   * 渲染邮件HTML内容
   * @param {Object} data - 模板数据
   * @param {string} data.username - 用户名
   * @param {string} data.title - 通知标题
   * @param {string} data.content - 通知内容（支持HTML）
   * @param {string} data.level - 通知级别：info/warning/error/success
   * @param {Object} data.action - 操作按钮 { text, link }
   * @returns {string} 邮件HTML内容
   */
  renderHtml(data = {}) {
    const {
      username = '用户',
      title = '系统通知',
      content = '',
      level = 'info',
      action = null
    } = data;

    const levelColors = {
      info: { bg: '#f0f9ff', border: '#409eff', icon: 'ℹ️' },
      warning: { bg: '#fdf6ec', border: '#e6a23c', icon: '⚠️' },
      error: { bg: '#fef0f0', border: '#f56c6c', icon: '❌' },
      success: { bg: '#f0f9eb', border: '#67c23a', icon: '✅' }
    };
    const color = levelColors[level] || levelColors.info;

    let actionHtml = '';
    if (action && action.text && action.link) {
      actionHtml = `
        <p style="text-align: center; margin: 24px 0;">
          <a href="${action.link}" class="btn" style="color: #ffffff; text-decoration: none;">${action.text}</a>
        </p>
      `;
    }

    return this.wrapContent(`
      <p>您好，${username}：</p>
      <div class="info-box" style="background-color: ${color.bg}; border-left-color: ${color.border};">
        <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
          ${color.icon} ${title}
        </p>
        <div style="margin: 0; line-height: 1.6;">
          ${content}
        </div>
      </div>
      ${actionHtml}
    `);
  }

  /**
   * 渲染邮件纯文本内容
   * @param {Object} data - 模板数据
   * @returns {string} 邮件纯文本内容
   */
  renderText(data = {}) {
    const { username = '用户', title = '系统通知', content = '' } = data;
    return `
您好，${username}：

【${title}】

${content}

此邮件由系统自动发送，请勿回复。
    `.trim();
  }
}

module.exports = NotificationTemplate;
