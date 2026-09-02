/**
 * Gmail邮箱适配器
 */
const BaseProvider = require('./base.provider');

class GmailProvider extends BaseProvider {
  constructor(config) {
    super({
      ...config,
      host: config.host || 'smtp.gmail.com',
      port: config.port || 465,
      secure: config.secure !== undefined ? config.secure : true
    });
    this.providerName = 'gmail';
  }

  validate() {
    const result = super.validate();
    if (this.config.username && !this.config.username.endsWith('@gmail.com')) {
      result.errors.push('Gmail账号必须@gmail.com结尾');
    }
    result.valid = result.errors.length === 0;
    return result;
  }
}

module.exports = GmailProvider;
