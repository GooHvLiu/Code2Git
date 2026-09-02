/**
 * 邮件基础模板类
 * 所有邮件模板都继承自这个基类
 */
class BaseTemplate {
  constructor() {
    this.templateName = 'base';
  }

  /**
   * 渲染邮件主题
   * @param {Object} data - 模板数据
   * @returns {string} 邮件主题
   */
  renderSubject(data = {}) {
    return 'nexSM系统通知';
  }

  /**
   * 渲染邮件HTML内容
   * @param {Object} data - 模板数据
   * @returns {string} 邮件HTML内容
   */
  renderHtml(data = {}) {
    return this.wrapContent(`
      <p>您好！</p>
      <p>这是一封系统通知邮件。</p>
    `);
  }

  /**
   * 渲染邮件纯文本内容
   * @param {Object} data - 模板数据
   * @returns {string} 邮件纯文本内容
   */
  renderText(data = {}) {
    return '您好！这是一封系统通知邮件。';
  }

  /**
   * 包裹邮件内容（添加统一的页眉页脚）
   * @param {string} content - 邮件主体内容
   * @returns {string} 完整的HTML内容
   */
  wrapContent(content) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>nexSM系统通知</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .email-header {
            background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
            color: #ffffff;
            padding: 24px 32px;
          }
          .email-header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
          }
          .email-body {
            padding: 32px;
            color: #333333;
            line-height: 1.6;
          }
          .email-footer {
            background-color: #f5f7fa;
            padding: 16px 32px;
            color: #999999;
            font-size: 12px;
            text-align: center;
            border-top: 1px solid #ebeef5;
          }
          .btn {
            display: inline-block;
            background-color: #409eff;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            margin: 16px 0;
          }
          .btn:hover {
            background-color: #66b1ff;
          }
          .info-box {
            background-color: #f0f9ff;
            border-left: 4px solid #409eff;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 0 4px 4px 0;
          }
          .warning-box {
            background-color: #fdf6ec;
            border-left: 4px solid #e6a23c;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 0 4px 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>nexSM 系统通知</h1>
          </div>
          <div class="email-body">
            ${content}
          </div>
          <div class="email-footer">
            <p>此邮件由系统自动发送，请勿回复。</p>
            <p>如有疑问，请联系系统管理员。</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 获取模板名称
   * @returns {string} 模板名称
   */
  getTemplateName() {
    return this.templateName;
  }
}

module.exports = BaseTemplate;
