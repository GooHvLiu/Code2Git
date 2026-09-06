/**
 * 项目配置服务
 * 收集项目运行的所有配置信息
 */
const os = require('os');
const path = require('path');
const dbConfig = require('../../config/db.config');
const jwtConfig = require('../../config/jwt.config');
const uploadConfig = require('../../config/upload.config');
const licenseConfig = require('../../config/license.config');
const appConfig = require('../../config/app.config');
const plcSetting = require('../../plc/config/plcSetting');
const emailConfig = require('../email/email.config');
const { DEFAULT_TIMEOUTS } = require('../../plc/utils/withTimeout');

class ProjectConfigService {
  /**
   * 获取项目所有配置信息
   */
  async getAllConfig() {
    return {
      // 1. 环境信息
      environment: this.getEnvironmentInfo(),
      // 2. 接口配置
      api: this.getApiConfig(),
      // 3. 存储配置
      storage: this.getStorageConfig(),
      // 4. 安全配置
      security: this.getSecurityConfig(),
      // 5. 数据库配置
      database: this.getDatabaseConfig(),
      // 6. 授权配置
      license: this.getLicenseConfig(),
      // 7. 邮箱配置
      email: this.getEmailConfig(),
      // 8. PLC配置
      plc: this.getPlcConfig()
    };
  }

  // ==================== 环境信息 ====================
  getEnvironmentInfo() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      appPort: process.env.APP_PORT || 3000,
      appHost: process.env.APP_HOST || '0.0.0.0',
      localIp: process.env.LOCAL_IP || '',
      systemVersion: '2.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      hostname: os.hostname(),
      // 运行目录
      cwd: process.cwd(),
      // 项目根目录
      projectRoot: path.resolve(__dirname, '../../../')
    };
  }

  // ==================== 接口配置 ====================
  getApiConfig() {
    return {
      apiPrefix: '/prod-api/v2',
      corsEnabled: true,
      corsOrigin: '*',
      rateLimit: 100,
      rateLimitWindow: 60,
      requestTimeout: 30000,
      requestTimeoutFormatted: '30秒',
      maxBodySize: '10mb',
      maxFileSize: uploadConfig.local.maxSize,
      maxFileSizeFormatted: this.formatBytes(uploadConfig.local.maxSize)
    };
  }

  // ==================== 存储配置 ====================
  getStorageConfig() {
    return {
      // 本地上传
      upload: {
        dir: uploadConfig.local.dir,
        dirAbsolute: path.resolve(uploadConfig.local.dir),
        maxSize: uploadConfig.local.maxSize,
        maxSizeFormatted: this.formatBytes(uploadConfig.local.maxSize),
        allowedTypes: uploadConfig.local.allowedExtnames.join(', '),
        staticPrefix: uploadConfig.local.staticPrefix
      },
      // GitHub图床
      github: {
        enabled: uploadConfig.github.enabled,
        owner: uploadConfig.github.owner,
        repo: uploadConfig.github.repo,
        branch: uploadConfig.github.branch,
        pathPrefix: uploadConfig.github.pathPrefix,
        maxSize: uploadConfig.github.maxSize,
        maxSizeFormatted: this.formatBytes(uploadConfig.github.maxSize)
      },
      // 数据库备份
      backup: {
        dir: './backups/database',
        dirAbsolute: path.resolve('./backups/database')
      },
      // 日志
      logs: {
        dir: './logs',
        dirAbsolute: path.resolve('./logs')
      },
      // 授权文件
      license: {
        dir: path.dirname(licenseConfig.licensePath),
        licensePath: licenseConfig.licensePath,
        publicKeyPath: licenseConfig.publicKeyPath,
        timeGuardPath: licenseConfig.timeGuardPath
      }
    };
  }

  // ==================== 安全配置 ====================
  getSecurityConfig() {
    return {
      // JWT
      jwt: {
        expiresIn: jwtConfig.expiresIn,
        algorithm: jwtConfig.algorithm
        // secret 不返回，安全考虑
      },
      // 会话
      session: {
        timeout: 40,
        timeoutUnit: '分钟'
      },
      // 登录安全
      login: {
        failedThreshold: 3,
        lockDuration: 25,
        lockDurationUnit: '分钟'
      },
      // 密码
      password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSymbol: true,
        bcryptSaltRounds: appConfig.bcrypt.saltRounds
      },
      // 水印
      watermark: {
        enabled: false
      }
    };
  }

  // ==================== 数据库配置 ====================
  getDatabaseConfig() {
    return {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      // 密码不返回明文，只返回是否已配置
      passwordConfigured: !!dbConfig.password,
      password: '******',
      database: dbConfig.database,
      connectionLimit: dbConfig.connectionLimit,
      waitForConnections: dbConfig.waitForConnections,
      queueLimit: dbConfig.queueLimit
    };
  }

  // ==================== 授权配置 ====================
  getLicenseConfig() {
    return {
      projectId: licenseConfig.projectId,
      licensePath: licenseConfig.licensePath,
      publicKeyPath: licenseConfig.publicKeyPath,
      timeGuardPath: licenseConfig.timeGuardPath,
      licenseServerUrl: licenseConfig.licenseServerUrl || '未配置（使用公共时间源）',
      strictMode: licenseConfig.strictMode,
      maxFileSize: licenseConfig.upload.maxSize,
      maxFileSizeFormatted: this.formatBytes(licenseConfig.upload.maxSize),
      allowedExtname: licenseConfig.upload.allowedExtname
    };
  }

  // ==================== 邮箱配置 ====================
  getEmailConfig() {
    return {
      enabled: emailConfig.enabled,
      defaultProvider: emailConfig.default.provider,
      host: emailConfig.default.host,
      port: emailConfig.default.port,
      secure: emailConfig.default.secure,
      username: emailConfig.default.username,
      // 密码不返回明文
      passwordConfigured: !!emailConfig.default.password,
      password: '******',
      fromName: emailConfig.default.fromName,
      send: {
        maxRetries: emailConfig.send.maxRetries,
        retryDelay: emailConfig.send.retryDelay,
        retryDelayFormatted: emailConfig.send.retryDelay + 'ms',
        timeout: emailConfig.send.timeout,
        timeoutFormatted: (emailConfig.send.timeout / 1000) + '秒',
        logEnabled: emailConfig.send.logEnabled
      },
      passwordReset: {
        tokenExpiresIn: emailConfig.passwordReset.tokenExpiresIn,
        tokenExpiresInUnit: '分钟',
        tokenLength: emailConfig.passwordReset.tokenLength,
        maxActiveTokens: emailConfig.passwordReset.maxActiveTokens
      }
    };
  }

  // ==================== PLC配置 ====================
  getPlcConfig() {
    return {
      activeProtocol: plcSetting.activeProtocol,
      supportedProtocols: plcSetting.supportedProtocols,
      connection: {
        host: plcSetting.connection.host,
        port: plcSetting.connection.port,
        unitId: plcSetting.connection.unitId,
        rack: plcSetting.connection.rack,
        slot: plcSetting.connection.slot
      },
      poll: {
        fastInterval: plcSetting.poll.fastInterval,
        fastIntervalUnit: 'ms',
        slowInterval: plcSetting.poll.slowInterval,
        slowIntervalUnit: 'ms',
        reconnectDelay: plcSetting.poll.reconnectDelay,
        reconnectDelayUnit: 'ms'
      },
      enablePoll: plcSetting.enablePoll,
      enableWriteAudit: plcSetting.enableWriteAudit,
      maxWriteRetry: plcSetting.maxWriteRetry,
      timeouts: {
        connect: DEFAULT_TIMEOUTS.connect,
        read: DEFAULT_TIMEOUTS.read,
        readBatch: DEFAULT_TIMEOUTS.readBatch,
        write: DEFAULT_TIMEOUTS.write,
        general: DEFAULT_TIMEOUTS.general,
        unit: 'ms'
      },
      multiDeviceEnabled: !!plcSetting.devices
    };
  }

  // ==================== 工具方法 ====================
  
  /**
   * 格式化字节数
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 格式化运行时间
   */
  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (days > 0) parts.push(days + '天');
    if (hours > 0) parts.push(hours + '小时');
    if (minutes > 0) parts.push(minutes + '分钟');
    parts.push(secs + '秒');
    
    return parts.join(' ');
  }
}

module.exports = new ProjectConfigService();
