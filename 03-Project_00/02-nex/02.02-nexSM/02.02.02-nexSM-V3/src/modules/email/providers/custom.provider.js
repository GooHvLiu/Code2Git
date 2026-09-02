/**
 * 自定义企业邮箱适配器
 * 用于企业自建邮箱系统或其他未内置的服务商
 */
const BaseProvider = require('./base.provider');

class CustomProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.providerName = 'custom';
  }

  // 自定义邮箱不做特殊验证，使用基础验证即可
}

module.exports = CustomProvider;
