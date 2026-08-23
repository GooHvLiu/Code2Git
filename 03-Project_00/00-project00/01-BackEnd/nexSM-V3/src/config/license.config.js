/**
 * 授权配置
 * 统一管理 Beehive 授权 SDK 的配置项
 */
const path = require('path');

module.exports = {
  // 授权项目ID（必须与 Beehive 管理后台登记的项目ID一致）
  projectId: process.env.LICENSE_PROJECT_ID || 'nex-sm-v2',

  // 授权文件路径（.lic 文件）
  licensePath: process.env.LICENSE_FILE_PATH || path.join(__dirname, '../../license.lic'),

  // RSA 公钥文件路径（用于验证授权文件签名）
  publicKeyPath: process.env.LICENSE_PUBLIC_KEY_PATH || path.join(__dirname, '../../public.pem'),

  // 时间守卫文件路径（防时间回退，记录上次验证时间）
  timeGuardPath: process.env.LICENSE_TIME_GUARD_PATH || path.join(__dirname, '../../.timeguard'),

  // 授权服务器地址（可选，联网时间校准用，留空则使用公共时间源：百度/淘宝/京东/worldtimeapi）
  licenseServerUrl: process.env.LICENSE_SERVER_URL || '',

  // 严格模式：授权失败时返回403；非严格模式只警告不拦截
  strictMode: process.env.LICENSE_STRICT_MODE !== 'false',

  // 授权中间件白名单：这些路径跳过授权校验（未授权时也能访问）
  whitelist: [
    '/prod-api/v2/license/import',
    '/prod-api/v2/license/status'
  ],

  // 授权文件上传限制
  upload: {
    // 最大文件大小（默认 1MB）
    maxSize: parseInt(process.env.LICENSE_MAX_FILE_SIZE) || 1 * 1024 * 1024,
    // 允许的文件扩展名
    allowedExtname: '.lic',
    // 上传字段名
    fieldName: 'file'
  }
};
