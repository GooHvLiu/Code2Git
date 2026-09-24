/**
 * 授权模块 - 路由层
 * 自动注册到 /prod-api/v2/license 前缀下
 * 作者: GooHv
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
 * @openapi
 * /license/import:
 *   post:
 *     tags: [授权管理]
 *     summary: 导入授权文件（公开）
 *     description: 上传 .license 授权文件完成授权激活。
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 授权文件
 *     responses:
 *       200:
 *         description: 导入成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       400: { description: 文件格式错误, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 */
router.post('/import', upload.single(licenseConfig.upload.fieldName), licenseController.importLicense);

/**
 * @openapi
 * /license/status:
 *   get:
 *     tags: [授权管理]
 *     summary: 查询当前授权状态（公开）
 *     security: []
 *     responses:
 *       200:
 *         description: 授权状态
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         valid: { type: boolean, example: true }
 *                         customer: { type: string, example: 'nexCM' }
 *                         expireTime: { type: string, format: 'date-time' }
 *                         licenseType: { type: string, example: 'standard' }
 */
router.get('/status', licenseController.getLicenseStatus);

// ==================== 需要登录的接口 ====================

router.use(requireAuth);

/**
 * @openapi
 * /license/machine-id:
 *   get:
 *     tags: [授权管理]
 *     summary: 获取当前服务器机器ID（需登录）
 *     description: 用于向厂商申请授权文件时提供机器指纹。
 *     responses:
 *       200:
 *         description: 机器ID
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         machineId: { type: string, example: 'ABC-1234-DEF' }
 */
router.get('/machine-id', licenseController.getMachineId);

/**
 * @openapi
 * /license/sync-time:
 *   post:
 *     tags: [授权管理]
 *     summary: 手动触发联网时间校准（需登录）
 *     responses:
 *       200:
 *         description: 校准完成
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/sync-time', licenseController.syncTime);

// ==================== 仅管理员接口 ====================

router.use(requireRole(USER_ROLE.ADMINISTRATOR));

/**
 * @openapi
 * /license/download:
 *   get:
 *     tags: [授权管理]
 *     summary: 下载当前授权文件（仅管理员）
 *     responses:
 *       200:
 *         description: 授权文件流
 *         content:
 *           application/octet-stream:
 *             schema: { type: string, format: binary }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.get('/download', licenseController.downloadLicense);

module.exports = router;
