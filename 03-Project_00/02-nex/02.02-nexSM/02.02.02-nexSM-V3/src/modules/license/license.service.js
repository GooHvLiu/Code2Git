/**
 * 授权模块 - 服务层
 * 负责授权文件导入、授权状态查询、机器ID查询、时间校准等业务逻辑
 */
const fs = require('fs');
const path = require('path');
const { LicenseGuard } = require('../../../beehive/sdk');
const licenseConfig = require('../../config/license.config');
const audit = require('../../utils/audit');

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

class LicenseService {
  /**
   * 导入授权文件
   * @param {Object} req Express 请求对象
   * @returns {Object} 授权信息
   */
  async importLicense(req) {
    if (!req.file) {
      const error = new Error('参数缺失');
      error.code = 'PARAM_MISSING';
      throw error;
    }

    // 检查文件扩展名
    const originalName = req.file.originalname || '';
    if (!originalName.endsWith(licenseConfig.upload.allowedExtname)) {
      const error = new Error(`授权文件格式错误，应为 ${licenseConfig.upload.allowedExtname} 文件`);
      error.code = 'INVALID_FORMAT';
      throw error;
    }

    // 获取上传的文件内容
    const licenseContent = req.file.buffer.toString('utf8');

    // 先临时保存到一个临时文件，用于验证
    const tempPath = licenseConfig.licensePath + '.tmp';
    fs.writeFileSync(tempPath, licenseContent, 'utf8');

    try {
      // 用临时文件创建验证实例，验证授权有效性
      const tempGuard = createGuard(tempPath);
      const result = await tempGuard.check();

      if (!result.valid) {
        // 验证失败，删除临时文件
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        const error = new Error(`授权文件无效: ${result.reason}`);
        error.code = 'INVALID_LICENSE';
        throw error;
      }

      // 验证通过，备份原有授权文件（如果存在）
      if (fs.existsSync(licenseConfig.licensePath)) {
        const backupPath = licenseConfig.licensePath + '.bak.' + Date.now();
        fs.copyFileSync(licenseConfig.licensePath, backupPath);
      }

      // 替换正式授权文件
      fs.copyFileSync(tempPath, licenseConfig.licensePath);
      fs.unlinkSync(tempPath);

      // 记录审计日志：授权导入
      audit.log(req, {
        action: audit.ACTION.LICENSE_IMPORT,
        target: `授权文件:${originalName}`,
        newValue: `授权ID:${result.licenseData?.licenseId}, 到期时间:${result.licenseData?.expiresAt}`,
        result: 'success',
        reason: '管理员导入授权文件'
      }).catch(err => {
        console.error('[授权导入] 记录审计日志失败:', err);
      });

      // 返回授权信息
      const lic = result.licenseData;
      return {
        licenseId: lic.licenseId,
        projectId: lic.projectId,
        projectName: lic.projectName,
        licenseType: lic.licenseType,
        issuedAt: lic.issuedAt,
        expiresAt: lic.expiresAt,
        features: lic.features,
        maxUsers: lic.maxUsers,
        maxDevices: lic.maxDevices || 0,
        customer: lic.customer
      };
    } catch (err) {
      // 确保临时文件被清理
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw err;
    }
  }

  /**
   * 查询当前授权状态（完整信息）
   * @returns {Object} 授权状态信息
   */
  async getLicenseStatus() {
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

      return {
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
        maxDevices: lic.maxDevices || 0,
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
      };
    } else {
      return {
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
      };
    }
  }

  /**
   * 获取当前服务器机器ID
   * @returns {Object} 机器ID信息
   */
  async getMachineId() {
    const guard = createGuard();
    const machineId = guard.getMachineId();
    const machineInfo = guard.getMachineInfo();
    return {
      machineId: machineId,
      machineInfo: machineInfo
    };
  }

  /**
   * 手动触发联网时间校准
   * @returns {Object} 时间校准结果
   */
  async syncTime() {
    const guard = createGuard();
    const beforeTime = Date.now();
    const result = await guard.syncTime();

    if (result.ok) {
      const afterTime = Date.now();
      return {
        ok: true,
        beforeTime: beforeTime,
        afterTime: afterTime,
        drift: result.drift || 0,
        serverTime: result.serverTime || null,
        message: result.reason || '时间校准成功'
      };
    } else {
      const error = new Error(`时间校准失败: ${result.reason}`);
      error.code = 'SYNC_TIME_FAILED';
      throw error;
    }
  }

  /**
   * 下载当前授权文件
   * @returns {Object} 授权文件路径和文件名
   */
  async downloadLicense() {
    if (!fs.existsSync(licenseConfig.licensePath)) {
      const error = new Error('授权文件不存在');
      error.code = 'NOT_FOUND';
      throw error;
    }
    const fileName = path.basename(licenseConfig.licensePath);
    return {
      filePath: licenseConfig.licensePath,
      fileName: fileName
    };
  }
}

module.exports = new LicenseService();
