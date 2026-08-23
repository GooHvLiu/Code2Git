/**
 * 授权模块 - 路由层
 * 自动注册到 /prod-api/v2/license 前缀下
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const licenseController = require('./license.controller');
const licenseConfig = require('../../config/license.config');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');
const { USER_ROLE } = require('../../constants/statusCode');

// 配置 multer 内存存储（授权文件不需要保存到 uploads，直接在 controller 里处理）
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: licenseConfig.upload.maxSize
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith(licenseConfig.upload.allowedExtname)) {
      cb(null, true);
    } else {
      cb(new Error(`只允许上传 ${licenseConfig.upload.allowedExtname} 授权文件`));
    }
  }
});

// ==================== 公开接口（无需登录） ====================

/**
 * 导入授权文件（公开接口，无需登录）
 * POST /prod-api/v2/license/import
 */
router.post('/import', upload.single(licenseConfig.upload.fieldName), licenseController.importLicense);

/**
 * 查询当前授权状态（公开接口，无需登录）
 * GET /prod-api/v2/license/status
 */
router.get('/status', licenseController.getLicenseStatus);

// ==================== 需要登录的接口 ====================

router.use(requireAuth);

/**
 * 获取当前服务器机器ID（需登录）
 * GET /prod-api/v2/license/machine-id
 */
router.get('/machine-id', licenseController.getMachineId);

/**
 * 手动触发联网时间校准（需登录）
 * POST /prod-api/v2/license/sync-time
 */
router.post('/sync-time', licenseController.syncTime);

// ==================== 仅管理员接口 ====================

router.use(requireRole(USER_ROLE.ADMINISTRATOR));

/**
 * 下载当前授权文件（仅管理员）
 * GET /prod-api/v2/license/download
 */
router.get('/download', licenseController.downloadLicense);

module.exports = router;
