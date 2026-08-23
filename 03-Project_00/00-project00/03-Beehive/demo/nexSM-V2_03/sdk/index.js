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
   * 手动触发联网时间校准
   */
  async syncTime() {
    if (!this.options.licenseServerUrl) {
      return { ok: false, reason: '未配置授权服务器地址' };
    }
    return await timeGuard.syncNetworkTime(this.options.licenseServerUrl);
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
