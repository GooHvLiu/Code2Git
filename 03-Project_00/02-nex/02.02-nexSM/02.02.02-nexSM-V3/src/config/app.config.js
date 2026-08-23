/**
 * 应用全局配置
 */
module.exports = {
  // 服务端口
  port: process.env.APP_PORT || 3000,
  host: process.env.APP_HOST || '0.0.0.0',

  // 分页默认配置
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    maxPageSize: 100
  },

  // 文件上传配置
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },

  // 密码加密强度
  bcrypt: {
    saltRounds: 10
  }
};
