/**
 * 授权验证中间件
 * 供被保护的 Express 项目（如 nexSM）集成使用
 *
 * 使用方式：
 * const { licenseAuth } = require('beehive-tools-sdk');
 * app.use(licenseAuth({
 *   projectId: 'nex-sm-v2',
 *   licensePath: './license.lic',
 *   publicKey: '-----BEGIN PUBLIC KEY-----...',
 *   timeGuardPath: './.timeguard',
 *   licenseServerUrl: 'http://your-server:3100'
 * }));
 *
 * 验证流程：
 * 1. 读取并解密授权文件
 * 2. RSA 公钥验证签名
 * 3. 检查项目ID匹配
 * 4. 检查机器指纹绑定
 * 5. 时间防护：检查是否时间回退
 * 6. 检查授权是否过期
 * 7. 通过则挂载 req.license，失败则返回403
 */
const licenseCore = require('../core/license');
const machineId = require('../core/machineId');
const timeGuard = require('../core/timeGuard');

/**
 * 创建授权验证中间件
 * @param {Object} options
 * @param {string} options.projectId 被保护项目的ID
 * @param {string} options.licensePath 授权文件路径
 * @param {string} options.publicKey RSA公钥（PEM格式）
 * @param {string} options.timeGuardPath 时间守卫文件路径
 * @param {string} [options.licenseServerUrl] 授权服务器地址（用于联网时间校准）
 * @param {string[]} [options.requiredFeatures] 需要的功能列表
 * @param {boolean} [options.strictMode] 严格模式：验证失败直接返回403，否则只挂警告
 */
function createLicenseAuth(options = {}) {
  const {
    projectId,
    licensePath,
    publicKey,
    timeGuardPath,
    licenseServerUrl,
    requiredFeatures = [],
    strictMode = true
  } = options;

  // 初始化时间守卫
  if (timeGuardPath) {
    timeGuard.init(timeGuardPath);
  }

  // 缓存授权数据（避免每次请求都读文件）
  let cachedLicense = null;
  let cacheTime = 0;
  const CACHE_TTL = 60 * 1000; // 缓存1分钟

  return async function licenseAuthMiddleware(req, res, next) {
    try {
      // 1. 时间防护检查（防回退）
      if (timeGuardPath) {
        const timeCheck = timeGuard.checkTimeRollback();
        if (!timeCheck.ok) {
          // 检测到时间回退，尝试联网校准
          if (licenseServerUrl) {
            const syncResult = await timeGuard.syncNetworkTime(licenseServerUrl);
            if (syncResult.ok) {
              timeGuard.reset();
            } else {
              return res.status(403).json({
                code: 403,
                msg: timeCheck.reason + '，且联网校准失败，请检查网络后重试',
                data: null,
                timestamp: Date.now()
              });
            }
          } else {
            return res.status(403).json({
              code: 403,
              msg: timeCheck.reason,
              data: null,
              timestamp: Date.now()
            });
          }
        }
      }

      // 2. 读取授权文件（带缓存）
      const now = Date.now();
      if (!cachedLicense || now - cacheTime > CACHE_TTL) {
        cachedLicense = licenseCore.parse(licensePath);
        cacheTime = now;
      }

      if (!cachedLicense) {
        if (strictMode) {
          return res.status(403).json({
            code: 403,
            msg: '授权文件不存在或验证失败，请导入有效的授权文件',
            data: null,
            timestamp: Date.now()
          });
        }
        req.licenseWarning = '授权文件验证失败';
        return next();
      }

      // 3. 验证授权有效性
      const currentMachineId = machineId.getMachineId();
      const result = licenseCore.validate(cachedLicense, {
        projectId,
        machineId: currentMachineId,
        requiredFeatures
      });

      if (!result.valid) {
        if (strictMode) {
          return res.status(403).json({
            code: 403,
            msg: `授权验证失败: ${result.reason}`,
            data: null,
            timestamp: Date.now()
          });
        }
        req.licenseWarning = result.reason;
        return next();
      }

      // 4. 验证通过，挂载授权信息
      req.license = cachedLicense;
      next();
    } catch (e) {
      console.error('[LicenseAuth] 授权验证异常:', e);
      if (strictMode) {
        return res.status(500).json({
          code: 500,
          msg: '授权验证系统异常',
          data: null,
          timestamp: Date.now()
        });
      }
      next();
    }
  };
}

module.exports = { createLicenseAuth };
