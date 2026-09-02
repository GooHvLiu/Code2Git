/**
 * Outlook邮箱适配器
 */
const BaseProvider = require('./base.provider');

class OutlookProvider extends BaseProvider {
  constructor(config) {
    super({
      ...config,
      host: config.host || 'smtp.office365.com',
      port: config.port || 587,
      secure: config.secure !== undefined ? config.secure : false
    });
    this.providerName = 'outlook';
  }

  validate() {
    const result = super.validate();
    if (this.config.username && !this.config.username.endsWith('@outlook.com') && !this.config.username.endsWith('@hotmail.com')) {
      result.errors.push('Outlook账号必须以@outlook.com或@hotmail.com结尾');
    }
    result.valid = result.errors.length === 0;
    return result;
  }
}

module.exports = OutlookProvider;
