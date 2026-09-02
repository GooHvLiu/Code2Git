/**
 * 网易邮箱适配器（163/126）
 */
const BaseProvider = require('./base.provider');

class NeteaseProvider extends BaseProvider {
  constructor(config, type = '163') {
    const hosts = {
      '163': 'smtp.163.com',
      '126': 'smtp.126.com'
    };
    super({
      ...config,
      host: config.host || hosts[type] || 'smtp.163.com',
      port: config.port || 465,
      secure: config.secure !== undefined ? config.secure : true
    });
    this.providerName = type;
  }

  validate() {
    const result = super.validate();
    const validDomains = ['@163.com', '@126.com'];
    if (this.config.username && !validDomains.some(d => this.config.username.endsWith(d))) {
      result.errors.push('网易邮箱账号必须以@163.com或@126.com结尾');
    }
    result.valid = result.errors.length === 0;
    return result;
  }
}

module.exports = NeteaseProvider;
