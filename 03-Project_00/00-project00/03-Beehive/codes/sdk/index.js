/**
 * BeehiveTools 授权验证 SDK
 * 供被保护的 Node.js 项目（如 nexSM）集成使用
 *
 * 快速开始：
 * const { LicenseGuard } = require('beehive-license-sdk');
 *
 * const guard = new LicenseGuard({
 *   projectId: 'nex-sm-v2',
 *   publicKey: fs.readFileSync('./public.pem', 'utf8'),
 *   licensePath: './license.lic',
 *   timeGuardPath: './.timeguard',
 *   licenseServerUrl: 'http://your-server:3100'
 * });
 *
 * // Express 中间件（全局授权校验）
 * app.use(guard.middleware());
 *
 * // 或手动验证
 * const result = await guard.check();
 * console.log(result.valid ? '授权有效' : result.reason);
 */
const LicenseVerifier = require('./license-verify');
const timeGuard = require('./time-guard');
const { getMachineId, getMachineInfo } = require('./machine-id');

class LicenseGuard {
  /**
   * @param {Object} options
   * @param {string} options.projectId 被保护项目ID
   * @param {string} options.publicKey RSA公钥（PEM格式）
   * @param {string} options.licensePath 授权文件路径
   * @param {string} options.timeGuardPath 时间守卫文件路径
   * @param {string} [options.licenseServerUrl] 授权服务器地址（联网校准用）
   * @param {string} [options.aesKey] AES密钥
   * @param {string} [options.aesIv] AES IV
   * @param {string[]} [options.requiredFeatures] 必需功能列表
   * @param {boolean} [options.strictMode=true] 严格模式（失败返回403）
   * @param {boolean} [options.autoSync=true] 是否启用自动时间校准
   * @param {number} [options.autoSyncInterval=21600000] 自动校准间隔（毫秒，默认6小时）
   * @param {number} [options.autoSyncDelay=5000] 启动后延迟多久开始首次校准（毫秒，默认5秒）
   */
  constructor(options = {}) {
    this.options = options;
    this.verifier = new LicenseVerifier({
      projectId: options.projectId,
      publicKey: options.publicKey,
      licensePath: options.licensePath,
      aesKey: options.aesKey,
      aesIv: options.aesIv,
      requiredFeatures: options.requiredFeatures
    });
    this.strictMode = options.strictMode !== false;
    this.autoSync = options.autoSync !== false;
    this.autoSyncInterval = options.autoSyncInterval || 6 * 60 * 60 * 1000; // 默认6小时
    this.autoSyncDelay = options.autoSyncDelay || 5000; // 默认5秒
    this.autoSyncTimer = null;

    // 初始化时间守卫
    if (options.timeGuardPath) {
      timeGuard.init(options.timeGuardPath);
    }
  }

  /**
   * 完整授权检查（时间防护 + 授权验证）
   * @returns {Promise<Object>}
   */
  async check() {
    // 1. 时间防护检查
    if (this.options.timeGuardPath) {
      const timeCheck = timeGuard.checkTimeRollback();
      if (!timeCheck.ok) {
        // 尝试联网校准
        if (this.options.licenseServerUrl) {
          const syncResult = await timeGuard.syncNetworkTime(this.options.licenseServerUrl);
          if (syncResult.ok) {
            timeGuard.reset();
          } else {
            return { valid: false, reason: timeCheck.reason + '，且联网校准失败', type: 'time_rollback' };
          }
        } else {
          return { valid: false, reason: timeCheck.reason, type: 'time_rollback' };
        }
      }
    }

    // 2. 授权验证
    const result = this.verifier.verify();
    return result;
  }

  /**
   * Express 中间件
   * 放在所有路由之前，全局校验授权
   */
  middleware() {
    return async (req, res, next) => {
      try {
        const result = await this.check();
        if (result.valid) {
          req.license = result.licenseData;
          return next();
        }
        if (this.strictMode) {
          return res.status(403).json({
            code: 403,
            msg: `授权验证失败: ${result.reason}`,
            data: { type: result.type || 'license_invalid' },
            timestamp: Date.now()
          });
        }
        req.licenseWarning = result.reason;
        next();
      } catch (e) {
        console.error('[LicenseGuard] 授权验证异常:', e);
        if (this.strictMode) {
          return res.status(500).json({ code: 500, msg: '授权验证系统异常', data: null, timestamp: Date.now() });
        }
        next();
      }
    };
  }

  /**
   * 手动触发联网时间校准（联网诊断）
   * 即使未配置授权服务器地址，也会尝试使用公共时间源（百度/淘宝/京东等）
   */
  async syncTime() {
    // 即使 licenseServerUrl 为空，也调用 syncNetworkTime，会自动使用公共时间源
    return await timeGuard.syncNetworkTime(this.options.licenseServerUrl);
  }

  /**
   * 启动自动时间校准
   * 1. 延迟 autoSyncDelay 毫秒后执行首次校准
   * 2. 之后每隔 autoSyncInterval 毫秒自动校准一次
   * 校准失败不影响服务运行，只记录日志
   */
  startAutoSync() {
    if (!this.autoSync) {
      console.log('[LicenseGuard] 自动时间校准已禁用');
      return;
    }

    // 首次校准（延迟执行，避免服务启动时阻塞）
    setTimeout(async () => {
      try {
        const result = await this.syncTime();
        if (result.ok) {
          console.log(`[LicenseGuard] 启动时时间校准成功，时间源: ${result.source}，偏移: ${Math.round(result.offset)}ms`);
        } else {
          console.log(`[LicenseGuard] 启动时时间校准失败: ${result.reason}（将在下次自动校准时重试）`);
        }
      } catch (e) {
        console.error('[LicenseGuard] 启动时时间校准异常:', e.message);
      }
    }, this.autoSyncDelay);

    // 定时校准
    this.autoSyncTimer = setInterval(async () => {
      try {
        const result = await this.syncTime();
        if (result.ok) {
          console.log(`[LicenseGuard] 自动时间校准成功，时间源: ${result.source}，偏移: ${Math.round(result.offset)}ms`);
        } else {
          console.log(`[LicenseGuard] 自动时间校准失败: ${result.reason}（将在下次自动校准时重试）`);
        }
      } catch (e) {
        console.error('[LicenseGuard] 自动时间校准异常:', e.message);
      }
    }, this.autoSyncInterval);

    // 防止进程退出时定时器阻止退出
    if (this.autoSyncTimer.unref) {
      this.autoSyncTimer.unref();
    }

    console.log(`[LicenseGuard] 自动时间校准已启动，间隔: ${this.autoSyncInterval / 1000 / 60} 分钟`);
  }

  /**
   * 停止自动时间校准
   */
  stopAutoSync() {
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer);
      this.autoSyncTimer = null;
      console.log('[LicenseGuard] 自动时间校准已停止');
    }
  }

  /**
   * 重新加载授权文件（导入新授权后调用）
   */
  reloadLicense() {
    this.verifier.clearCache();
    return { ok: true, reason: '授权文件缓存已清除，下次验证将重新读取' };
  }

  /**
   * 获取当前机器ID
   */
  getMachineId() {
    return getMachineId();
  }

  /**
   * 获取机器详细信息
   */
  getMachineInfo() {
    return getMachineInfo();
  }
}

module.exports = {
  LicenseGuard,
  LicenseVerifier,
  timeGuard,
  getMachineId,
  getMachineInfo,
  LICENSE_TYPE: LicenseVerifier.LICENSE_TYPE
};
