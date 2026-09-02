/**
 * SMTP服务商基础适配器
 * 所有服务商适配器都继承自这个基类
 */
class BaseProvider {
  /**
   * 构造函数
   * @param {Object} config - 邮箱配置
   * @param {string} config.host - SMTP服务器地址
   * @param {number} config.port - SMTP端口
   * @param {boolean} config.secure - 是否使用SSL
   * @param {string} config.username - 邮箱账号
   * @param {string} config.password - 邮箱授权码
   * @param {string} config.fromName - 发件人名称
   */
  constructor(config) {
    this.config = config;
    this.providerName = 'base';
  }

  /**
   * 获取SMTP连接配置
   * @returns {Object} nodemailer的SMTP配置
   */
  getSmtpConfig() {
    return {
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.username,
        pass: this.config.password
      },
      // 连接超时
      connectionTimeout: 10000,
      //  greeting超时
      greetingTimeout: 10000,
      //  socket超时
      socketTimeout: 10000
    };
  }

  /**
   * 获取发件人信息
   * @returns {Object} 发件人信息
   */
  getFrom() {
    return {
      name: this.config.fromName || this.config.username,
      address: this.config.username
    };
  }

  /**
   * 验证配置是否完整
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];
    if (!this.config.host) {
      errors.push('SMTP服务器地址不能为空');
    }
    if (!this.config.port) {
      errors.push('SMTP端口不能为空');
    }
    if (!this.config.username) {
      errors.push('邮箱账号不能为空');
    }
    if (!this.config.password) {
      errors.push('邮箱授权码不能为空');
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 获取服务商名称
   * @returns {string} 服务商名称
   */
  getProviderName() {
    return this.providerName;
  }
}

module.exports = BaseProvider;
