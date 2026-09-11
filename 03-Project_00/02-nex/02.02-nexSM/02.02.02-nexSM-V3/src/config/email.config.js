/**
 * 邮箱系统默认配置
 * 作为兜底配置，当数据库中没有配置时使用
 * 生产环境建议通过环境变量配置，不要硬编码
 */
module.exports = {
  // 是否启用系统默认邮箱（当数据库中没有配置时使用）
  enabled: process.env.EMAIL_ENABLED !== 'false',

  // 系统默认邮箱配置（兜底）
  default: {
    provider: process.env.EMAIL_PROVIDER || 'qq',
    host: process.env.EMAIL_HOST || 'smtp.qq.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE !== 'false',
    username: process.env.EMAIL_USERNAME || '879639340@qq.com',
    password: process.env.EMAIL_PASSWORD || 'eyogmnuoljbwbcfj',
    fromName: process.env.EMAIL_FROM_NAME || 'nexSM系统通知'
  },

  // 邮件发送配置
  send: {
    // 最大重试次数
    maxRetries: 3,
    // 重试间隔（毫秒）
    retryDelay: 1000,
    // 发送超时（毫秒）
    timeout: 30000,
    // 是否记录发送日志
    logEnabled: true
  },

  // 密码重置Token配置
  passwordReset: {
    // Token有效期（分钟）
    tokenExpiresIn: 30,
    // Token长度
    tokenLength: 64,
    // 同一用户最大有效Token数
    maxActiveTokens: 5
  }
};
