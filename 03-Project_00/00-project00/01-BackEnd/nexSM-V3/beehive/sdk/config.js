/**
 * ==========================================
 * Beehive 授权 SDK 配置中心
 * ==========================================
 * 集中管理授权 SDK 的默认配置项
 * 修改配置只需改此文件，无需全局搜索替换
 */

module.exports = {
  // ==================== AES 加密配置 ====================
  // 注意：必须与 Beehive 服务端的 AES_KEY / AES_IV 完全一致
  // 建议通过环境变量或构造函数参数传入，此处仅作为默认值
  AES_KEY: 'BeehiveTools@2024#AES256Key!',
  AES_IV: 'BeehiveIV@2024!',

  // ==================== 时间防护配置 ====================
  // 时间回退检测容忍度（毫秒），允许5分钟时钟漂移
  TIME_DRIFT_TOLERANCE: 5 * 60 * 1000,

  // 自动时间校准间隔（毫秒），默认6小时
  AUTO_SYNC_INTERVAL: 6 * 60 * 60 * 1000,

  // 启动后延迟多久开始首次校准（毫秒），默认5秒
  AUTO_SYNC_DELAY: 5000,

  // 联网校准超时时间（毫秒）
  SYNC_TIMEOUT: 5000,

  // ==================== 时间源配置 ====================
  // 公共时间源（按优先级排序，授权服务器优先）
  TIME_SOURCES: [
    // 授权服务器时间接口（如果配置了 licenseServerUrl）
    // { url: `${serverUrl}/api/time`, source: 'license_server', type: 'json' },
    // 公网稳定网站（从响应头Date字段获取时间，无需专用接口）
    { url: 'https://www.baidu.com', source: 'baidu', type: 'header' },
    { url: 'https://www.taobao.com', source: 'taobao', type: 'header' },
    { url: 'https://www.jd.com', source: 'jd', type: 'header' },
    // 公共时间API（返回JSON）
    { url: 'https://worldtimeapi.org/api/timezone/Etc/UTC', source: 'worldtimeapi', type: 'json' },
    { url: 'http://worldtimeapi.org/api/ip', source: 'worldtimeapi_ip', type: 'json' }
  ],

  // ==================== 时间守卫文件配置 ====================
  // 时间守卫文件加密密钥
  TIME_GUARD_KEY: 'BeehiveTimeGuard@2024',

  // 时间守卫文件版本
  TIME_GUARD_VERSION: '1.0',

  // ==================== 授权文件配置 ====================
  // 授权文件最大大小（字节），默认1MB
  MAX_LICENSE_FILE_SIZE: 1 * 1024 * 1024,

  // 授权文件扩展名
  LICENSE_FILE_EXTNAME: '.lic',

  // 授权文件上传字段名
  LICENSE_UPLOAD_FIELD_NAME: 'file',

  // ==================== 授权类型 ====================
  LICENSE_TYPE: {
    TRIAL: 'trial',        // 试用授权
    FORMAL: 'formal',      // 正式授权
    PERMANENT: 'permanent' // 永久授权
  },

  // ==================== 日志配置 ====================
  // 是否启用详细日志
  ENABLE_VERBOSE_LOG: false,

  // 日志前缀
  LOG_PREFIX: '[BeehiveLicense]'
}
