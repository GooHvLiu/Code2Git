/**
 * 密码相关邮件模板
 * 支持三种场景：
 * 1. adminReset - 管理员重置用户密码（发送新密码）
 * 2. forgotPassword - 忘记密码（发送验证码）
 * 3. resetSuccess - 自助重置密码成功（通知邮件）
 */
const BaseTemplate = require('./base.template');

class PasswordResetTemplate extends BaseTemplate {
  constructor() {
    super();
    this.templateName = 'passwordReset';
  }

  /**
   * 渲染邮件主题
   * @param {Object} data - 模板数据
   * @param {string} data.type - 场景类型：adminReset/forgotPassword/resetSuccess
   * @returns {string} 邮件主题
   */
  renderSubject(data = {}) {
    const { type = 'adminReset' } = data;
    const subjects = {
      adminReset: '【nexSM】您的密码已被重置',
      forgotPassword: '【nexSM】密码重置验证码',
      resetSuccess: '【nexSM】密码重置成功'
    };
    return subjects[type] || subjects.adminReset;
  }

  /**
   * 渲染邮件HTML内容
   * @param {Object} data - 模板数据
   * @param {string} data.type - 场景类型：adminReset/forgotPassword/resetSuccess
   * @param {string} data.username - 用户名
   * @param {string} data.newPassword - 新密码（adminReset 场景）
   * @param {string} data.operator - 操作人（adminReset 场景）
   * @param {string} data.resetCode - 验证码（forgotPassword 场景）
   * @param {number} data.expireMinutes - 有效期（分钟，forgotPassword 场景）
   * @returns {string} 邮件HTML内容
   */
  renderHtml(data = {}) {
    const {
      type = 'adminReset',
      username = '用户',
      newPassword = '',
      operator = '系统管理员',
      resetCode = '',
      expireMinutes = 15
    } = data;

    let content = '';

    if (type === 'adminReset') {
      // 场景1：管理员重置用户密码
      content = `
        <p>您好，${username}：</p>
        <p>您的登录密码已被 <strong>${operator}</strong> 重置。</p>
        <div class="info-box" style="text-align: center; padding: 24px;">
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">您的新密码</p>
          <p style="margin: 0; font-size: 28px; font-weight: bold; color: #409eff; letter-spacing: 4px; font-family: 'Courier New', monospace;">${newPassword}</p>
        </div>
        <p>请使用新密码登录系统，并及时修改密码。</p>
        <div class="warning-box">
          <p style="margin: 0;"><strong>安全提示：</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>请勿将密码透露给他人</li>
            <li>建议登录后立即修改密码</li>
            <li>如果不是您本人操作，请立即联系管理员</li>
          </ul>
        </div>
      `;
    } else if (type === 'forgotPassword') {
      // 场景2：忘记密码，发送验证码
      content = `
        <p>您好，${username}：</p>
        <p>您正在进行密码重置操作。</p>
        <div class="info-box" style="text-align: center; padding: 24px;">
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">您的验证码</p>
          <p style="margin: 0; font-size: 32px; font-weight: bold; color: #409eff; letter-spacing: 8px; font-family: 'Courier New', monospace;">${resetCode}</p>
        </div>
        <p>验证码有效期为 <strong>${expireMinutes} 分钟</strong>，过期后请重新获取。</p>
        <div class="warning-box">
          <p style="margin: 0;"><strong>安全提示：</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>请勿将验证码透露给他人</li>
            <li>如果不是您本人操作，请忽略此邮件</li>
            <li>工作人员不会向您索取验证码</li>
          </ul>
        </div>
      `;
    } else if (type === 'resetSuccess') {
      // 场景3：自助重置密码成功
      content = `
        <p>您好，${username}：</p>
        <p>您的密码已成功重置。</p>
        <div class="info-box" style="background-color: #f0f9eb; border-left-color: #67c23a;">
          <p style="margin: 0; font-size: 16px; color: #67c23a;">
            ✅ 密码重置成功，您可以使用新密码登录系统。
          </p>
        </div>
        <div class="warning-box">
          <p style="margin: 0;"><strong>安全提示：</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>请妥善保管您的密码</li>
            <li>建议定期修改密码</li>
            <li>如果不是您本人操作，请立即联系管理员</li>
          </ul>
        </div>
      `;
    }

    return this.wrapContent(content);
  }

  /**
   * 渲染邮件纯文本内容
   * @param {Object} data - 模板数据
   * @returns {string} 邮件纯文本内容
   */
  renderText(data = {}) {
    const {
      type = 'adminReset',
      username = '用户',
      newPassword = '',
      operator = '系统管理员',
      resetCode = '',
      expireMinutes = 15
    } = data;

    if (type === 'adminReset') {
      return `
您好，${username}：

您的登录密码已被 ${operator} 重置。

您的新密码：${newPassword}

请使用新密码登录系统，并及时修改密码。

安全提示：
1. 请勿将密码透露给他人
2. 建议登录后立即修改密码
3. 如果不是您本人操作，请立即联系管理员

此邮件由系统自动发送，请勿回复。
      `.trim();
    } else if (type === 'forgotPassword') {
      return `
您好，${username}：

您正在进行密码重置操作。

您的验证码：${resetCode}

验证码有效期为 ${expireMinutes} 分钟，过期后请重新获取。

安全提示：
1. 请勿将验证码透露给他人
2. 如果不是您本人操作，请忽略此邮件
3. 工作人员不会向您索取验证码

此邮件由系统自动发送，请勿回复。
      `.trim();
    } else if (type === 'resetSuccess') {
      return `
您好，${username}：

您的密码已成功重置。

您可以使用新密码登录系统。

安全提示：
1. 请妥善保管您的密码
2. 建议定期修改密码
3. 如果不是您本人操作，请立即联系管理员

此邮件由系统自动发送，请勿回复。
      `.trim();
    }

    return '';
  }
}

module.exports = PasswordResetTemplate;
