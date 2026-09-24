/**
 * 文件上传路由
 * 自动注册到 /prod-api/v2/upload 前缀下
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const UploadController = require('./upload.controller');
const uploadMiddleware = require('../../middleware/upload.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { deleteFileSchema } = require('./upload.schema');

// 需要登录的接口
router.use(requireAuth);

// ==================== 本地上传 ====================

/**
 * @openapi
 * /upload/local:
 *   post:
 *     tags: [文件上传]
 *     summary: 单文件本地上传
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
 *                 description: 上传的文件
 *     responses:
 *       200:
 *         description: 上传成功，返回文件访问地址
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
 *                         url: { type: string, example: '/uploads/2026/09/xxx.png' }
 *                         name: { type: string }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
router.post(
  '/local',
  uploadMiddleware.localSingle('file'),
  UploadController.uploadLocalSingle
);

/**
 * @openapi
 * /upload/local/batch:
 *   post:
 *     tags: [文件上传]
 *     summary: 多文件本地上传（最多10个）
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: 上传成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post(
  '/local/batch',
  uploadMiddleware.localArray('files', 10),
  UploadController.uploadLocalBatch
);

/**
 * @openapi
 * /upload/local:
 *   delete:
 *     tags: [文件上传]
 *     summary: 删除本地文件
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [path]
 *             properties:
 *               path: { type: string, description: 文件相对路径 }
 *           example: { path: '/uploads/2026/09/xxx.png' }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete(
  '/local',
  validate(deleteFileSchema, 'body'),
  UploadController.deleteLocalFile
);

// ==================== GitHub 图床 ====================

/**
 * @openapi
 * /upload/github:
 *   post:
 *     tags: [文件上传]
 *     summary: 单文件上传到 GitHub 图床
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
 *     responses:
 *       200:
 *         description: 上传成功，返回 CDN 地址
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
 *                         url: { type: string, example: 'https://cdn.example.com/xxx.png' }
 */
router.post(
  '/github',
  uploadMiddleware.githubSingle('file'),
  UploadController.uploadGithubSingle
);

/**
 * @openapi
 * /upload/github/batch:
 *   post:
 *     tags: [文件上传]
 *     summary: 多文件上传到 GitHub 图床（最多10个）
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: 上传成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post(
  '/github/batch',
  uploadMiddleware.githubArray('files', 10),
  UploadController.uploadGithubBatch
);

/**
 * @openapi
 * /upload/github:
 *   delete:
 *     tags: [文件上传]
 *     summary: 删除 GitHub 图床文件
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [path]
 *             properties:
 *               path: { type: string, description: 文件在仓库中的路径 }
 *           example: { path: 'images/xxx.png' }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete(
  '/github',
  validate(deleteFileSchema, 'body'),
  UploadController.deleteGithubFile
);

module.exports = router;
