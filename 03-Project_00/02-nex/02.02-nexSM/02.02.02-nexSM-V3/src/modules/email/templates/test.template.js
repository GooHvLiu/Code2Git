/**
 * 测试邮件模板
 * 用于验证邮箱配置是否正确
 */
const BaseTemplate = require('./base.template');

class TestEmailTemplate extends BaseTemplate {
  constructor() {
    super();
    this.templateName = 'test';
  }

  /**
   * 渲染邮件主题
   * @param {Object} data - 模板数据
   * @returns {string} 邮件主题
   */
  renderSubject(data = {}) {
    return '【nexSM】邮箱配置测试邮件';
  }

  /**
   * 渲染邮件HTML内容
   * @param {Object} data - 模板数据
   * @param {string} data.configName - 配置名称
   * @param {string} data.provider - 服务商
   * @param {string} data.username - 邮箱账号
   * @param {string} data.testTime - 测试时间
   * @returns {string} 邮件HTML内容
   */
  renderHtml(data = {}) {
    const {
      configName = '默认配置',
      provider = 'custom',
      username = '',
      testTime = new Date().toLocaleString()
    } = data;

    const providerNames = {
      qq: 'QQ邮箱',
      '163': '163邮箱',
      '126': '126邮箱',
      gmail: 'Gmail',
      outlook: 'Outlook',
      custom: '自定义企业邮箱'
    };
    const providerName = providerNames[provider] || provider;

    return this.wrapContent(`
      <p>您好！</p>
      <p>这是一封测试邮件，用于验证您的邮箱配置是否正确。</p>
      <div class="info-box">
        <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
          ✅ 邮箱配置信息
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 100px;">配置名称：</td>
            <td style="padding: 6px 0; color: #333;">${configName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">服务商：</td>
            <td style="padding: 6px 0; color: #333;">${providerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">邮箱账号：</td>
            <td style="padding: 6px 0; color: #333;">${username}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">测试时间：</td>
            <td style="padding: 6px 0; color: #333;">${testTime}</td>
          </tr>
        </table>
      </div>
      <p style="color: #67c23a; font-size: 16px; font-weight: 600; text-align: center; margin: 24px 0;">
        🎉 恭喜！您的邮箱配置正确，可以正常发送邮件！
      </p>
    `);
  }

  /**
   * 渲染邮件纯文本内容
   * @param {Object} data - 模板数据
   * @returns {string} 邮件纯文本内容
   */
  renderText(data = {}) {
    const { configName = '默认配置', provider = 'custom', username = '', testTime = new Date().toLocaleString() } = data;
    return `
您好！

这是一封测试邮件，用于验证您的邮箱配置是否正确。

邮箱配置信息：
- 配置名称：${configName}
- 服务商：${provider}
- 邮箱账号：${username}
- 测试时间：${testTime}

恭喜！您的邮箱配置正确，可以正常发送邮件！

此邮件由系统自动发送，请勿回复。
    `.trim();
  }
}

module.exports = TestEmailTemplate;
