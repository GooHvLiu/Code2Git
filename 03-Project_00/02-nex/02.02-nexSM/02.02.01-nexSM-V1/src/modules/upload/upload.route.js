/**
 * 文件上传路由
 * 自动注册到 /prod-api/upload 前缀下
 */
const express = require('express');
const router = express.Router();
const UploadController = require('./upload.controller');
const uploadMiddleware = require('../../middleware/upload.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');

// 需要登录的接口
router.use(requireAuth);

// ==================== 本地上传 ====================

// 单文件上传
router.post(
  '/local',
  uploadMiddleware.localSingle('file'),
  UploadController.uploadLocalSingle
);

// 多文件上传
router.post(
  '/local/batch',
  uploadMiddleware.localArray('files', 10),
  UploadController.uploadLocalBatch
);

// 删除本地文件
router.delete(
  '/local',
  UploadController.deleteLocalFile
);

// ==================== GitHub 图床 ====================

// 单文件上传
router.post(
  '/github',
  uploadMiddleware.githubSingle('file'),
  UploadController.uploadGithubSingle
);

// 多文件上传
router.post(
  '/github/batch',
  uploadMiddleware.githubArray('files', 10),
  UploadController.uploadGithubBatch
);

// 删除 GitHub 文件
router.delete(
  '/github',
  UploadController.deleteGithubFile
);

module.exports = router;