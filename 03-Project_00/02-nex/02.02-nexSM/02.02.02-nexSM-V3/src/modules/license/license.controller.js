/**
 * 授权模块 - 控制器层
 * 负责请求参数校验、调用 service 层、响应处理
 */
const licenseService = require('./license.service');
const { ERROR_CODE } = require('../../constants/errorCode');

class LicenseController {
  /**
   * 导入授权文件
   * POST /prod-api/v2/license/import
   */
  async importLicense(req, res, next) {
    try {
      const result = await licenseService.importLicense(req);
      return res.success(result);
    } catch (err) {
      if (err.code === 'PARAM_MISSING') {
        return res.error(ERROR_CODE.PARAM_MISSING);
      }
      if (err.code === 'INVALID_FORMAT' || err.code === 'INVALID_LICENSE') {
        return res.error(err.message);
      }
      next(err);
    }
  }

  /**
   * 查询当前授权状态（完整信息）
   * GET /prod-api/v2/license/status
   */
  async getLicenseStatus(req, res, next) {
    try {
      const result = await licenseService.getLicenseStatus();
      return res.success(result);
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
      const result = await licenseService.getMachineId();
      return res.success(result);
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
      const result = await licenseService.syncTime();
      return res.success(result);
    } catch (err) {
      if (err.code === 'SYNC_TIME_FAILED') {
        return res.error(err.message);
      }
      next(err);
    }
  }

  /**
   * 下载当前授权文件
   * GET /prod-api/v2/license/download
   */
  async downloadLicense(req, res, next) {
    try {
      const result = await licenseService.downloadLicense();
      res.download(result.filePath, result.fileName);
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        return res.error(ERROR_CODE.NOT_FOUND);
      }
      next(err);
    }
  }
}

module.exports = new LicenseController();
