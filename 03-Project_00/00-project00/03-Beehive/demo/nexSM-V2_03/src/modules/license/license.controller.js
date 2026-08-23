/**
 * 授权模块 - 控制器层
 * 负责授权文件导入、授权状态查询、机器ID查询、时间校准
 */
const fs = require('fs');
const path = require('path');
const { LicenseGuard } = require('../../../sdk');
const licenseConfig = require('../../config/license.config');

/**
 * 创建授权验证实例
 * @param {string} [customLicensePath] 自定义授权文件路径（用于验证临时文件）
 * @returns {LicenseGuard}
 */
function createGuard(customLicensePath) {
  return new LicenseGuard({
    projectId: licenseConfig.projectId,
    publicKey: fs.readFileSync(licenseConfig.publicKeyPath, 'utf8'),
    licensePath: customLicensePath || licenseConfig.licensePath,
    timeGuardPath: licenseConfig.timeGuardPath,
    licenseServerUrl: licenseConfig.licenseServerUrl,
    strictMode: licenseConfig.strictMode
  });
}

/**
 * 获取授权文件信息
 * @returns {Object|null}
 */
function getLicenseFileInfo() {
  try {
    if (!fs.existsSync(licenseConfig.licensePath)) {
      return null;
    }
    const stat = fs.statSync(licenseConfig.licensePath);
    return {
      path: licenseConfig.licensePath,
      size: stat.size,
      sizeFormatted: formatFileSize(stat.size),
      lastModified: stat.mtimeMs,
      fileName: path.basename(licenseConfig.licensePath)
    };
  } catch (e) {
    return null;
  }
}

/**
 * 获取时间守卫文件信息
 * @returns {Object|null}
 */
function getTimeGuardInfo() {
  try {
    if (!fs.existsSync(licenseConfig.timeGuardPath)) {
      return { exists: false, lastVerifiedAt: null };
    }
    const stat = fs.statSync(licenseConfig.timeGuardPath);
    const content = fs.readFileSync(licenseConfig.timeGuardPath, 'utf8');
    let lastVerifiedAt = null;
    try {
      const data = JSON.parse(content);
      lastVerifiedAt = data.lastVerifiedAt || data.timestamp || null;
    } catch (e) {
      // 解析失败，用文件修改时间
      lastVerifiedAt = stat.mtimeMs;
    }
    return {
      exists: true,
      path: licenseConfig.timeGuardPath,
      lastVerifiedAt,
      fileModifiedAt: stat.mtimeMs
    };
  } catch (e) {
    return { exists: false, lastVerifiedAt: null };
  }
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

class LicenseController {
  /**
   * 导入授权文件
   * POST /prod-api/v2/license/import
   */
  async importLicense(req, res, next) {
    try {
      if (!req.file) {
        return res.error('请上传授权文件');
      }

      // 检查文件扩展名
      const originalName = req.file.originalname || '';
      if (!originalName.endsWith(licenseConfig.upload.allowedExtname)) {
        return res.error(`授权文件格式错误，应为 ${licenseConfig.upload.allowedExtname} 文件`);
      }

      // 获取上传的文件内容
      const licenseContent = req.file.buffer.toString('utf8');

      // 先临时保存到一个临时文件，用于验证
      const tempPath = licenseConfig.licensePath + '.tmp';
      fs.writeFileSync(tempPath, licenseContent, 'utf8');

      // 用临时文件创建验证实例，验证授权有效性
      const tempGuard = createGuard(tempPath);
      const result = await tempGuard.check();

      if (!result.valid) {
        // 验证失败，删除临时文件
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        return res.error(`授权文件无效: ${result.reason}`);
      }

      // 验证通过，备份原有授权文件（如果存在）
      if (fs.existsSync(licenseConfig.licensePath)) {
        const backupPath = licenseConfig.licensePath + '.bak.' + Date.now();
        fs.copyFileSync(licenseConfig.licensePath, backupPath);
      }

      // 替换正式授权文件
      fs.copyFileSync(tempPath, licenseConfig.licensePath);
      fs.unlinkSync(tempPath);

      // 返回授权信息
      const lic = result.licenseData;
      return res.success({
        licenseId: lic.licenseId,
        projectId: lic.projectId,
        projectName: lic.projectName,
        licenseType: lic.licenseType,
        issuedAt: lic.issuedAt,
        expiresAt: lic.expiresAt,
        features: lic.features,
        maxUsers: lic.maxUsers,
        customer: lic.customer
      }, '授权文件导入成功');

    } catch (err) {
      next(err);
    }
  }

  /**
   * 查询当前授权状态（完整信息）
   * GET /prod-api/v2/license/status
   */
  async getLicenseStatus(req, res, next) {
    try {
      const guard = createGuard();
      const result = await guard.check();
      const currentMachineId = guard.getMachineId();
      const machineInfo = guard.getMachineInfo();
      const licenseFileInfo = getLicenseFileInfo();
      const timeGuardInfo = getTimeGuardInfo();

      if (result.valid) {
        const lic = result.licenseData;
        // 机器绑定状态
        const boundMachineId = lic.machineId || '';
        const machineBound = !!boundMachineId;
        const machineMatched = !machineBound || (boundMachineId === currentMachineId);

        return res.success({
          valid: true,
          // 授权基本信息
          licenseId: lic.licenseId,
          projectId: lic.projectId,
          projectName: lic.projectName,
          licenseType: lic.licenseType,
          issuedAt: lic.issuedAt,
          expiresAt: lic.expiresAt,
          features: lic.features,
          maxUsers: lic.maxUsers,
          customer: lic.customer,
          // 机器绑定信息
          machineId: currentMachineId,
          machineInfo: machineInfo,
          boundMachineId: boundMachineId,
          machineBound: machineBound,
          machineMatched: machineMatched,
          // 授权文件信息
          licenseFile: licenseFileInfo,
          // 时间守卫信息
          timeGuard: timeGuardInfo,
          // 服务器当前时间
          serverTime: Date.now()
        });
      } else {
        return res.success({
          valid: false,
          reason: result.reason,
          type: result.type,
          // 机器信息（即使授权无效也返回，方便用户绑定机器）
          machineId: currentMachineId,
          machineInfo: machineInfo,
          // 授权文件信息
          licenseFile: licenseFileInfo,
          // 时间守卫信息
          timeGuard: timeGuardInfo,
          // 服务器当前时间
          serverTime: Date.now()
        });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取当前服务器机器ID
   * GET /prod-api/v2/license/machine-id
   */
  async getMachineId(req, res, next) {
    try {
      const guard = createGuard();
      const machineId = guard.getMachineId();
      const machineInfo = guard.getMachineInfo();
      return res.success({
        machineId: machineId,
        machineInfo: machineInfo
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 手动触发联网时间校准
   * POST /prod-api/v2/license/sync-time
   */
  async syncTime(req, res, next) {
    try {
      const guard = createGuard();
      const beforeTime = Date.now();
      const result = await guard.syncTime();

      if (result.ok) {
        const afterTime = Date.now();
        return res.success({
          ok: true,
          beforeTime: beforeTime,
          afterTime: afterTime,
          drift: result.drift || 0,
          serverTime: result.serverTime || null,
          message: result.reason || '时间校准成功'
        }, '时间校准成功');
      } else {
        return res.error(`时间校准失败: ${result.reason}`);
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * 下载当前授权文件
   * GET /prod-api/v2/license/download
   */
  async downloadLicense(req, res, next) {
    try {
      if (!fs.existsSync(licenseConfig.licensePath)) {
        return res.error('授权文件不存在');
      }
      const fileName = path.basename(licenseConfig.licensePath);
      res.download(licenseConfig.licensePath, fileName);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LicenseController();
