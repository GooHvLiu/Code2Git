/**
 * QQ邮箱适配器
 */
const BaseProvider = require('./base.provider');

class QQProvider extends BaseProvider {
  constructor(config) {
    super({
      ...config,
      host: config.host || 'smtp.qq.com',
      port: config.port || 465,
      secure: config.secure !== undefined ? config.secure : true
    });
    this.providerName = 'qq';
  }

  /**
   * QQ邮箱特殊验证
   */
  validate() {
    const result = super.validate();
    if (this.config.username && !this.config.username.endsWith('@qq.com')) {
      result.errors.push('QQ邮箱账号必须以@qq.com结尾');
    }
    // QQ邮箱授权码通常是16位
    if (this.config.password && this.config.password.length !== 16) {
      result.errors.push('QQ邮箱授权码通常是16位，请检查是否正确');
    }
    result.valid = result.errors.length === 0;
    return result;
  }
}

module.exports = QQProvider;
