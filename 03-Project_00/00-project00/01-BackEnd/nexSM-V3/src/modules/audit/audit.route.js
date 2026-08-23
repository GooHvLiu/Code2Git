/**
 * 审计日志模块 - 路由
 * GMP 21CFR Part 11 电子记录合规
 */
const express = require('express');
const router = express.Router();
const auditController = require('./audit.controller');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');

// 所有审计接口需要登录
router.use(requireAuth);

// 分页查询审计日志
router.get('/list', auditController.getList);

// 查询当前用户的操作记录
router.get('/my', auditController.getMyLogs);

// 校验哈希链完整性（仅管理员）
router.get('/verify', requireRole('administrator'), auditController.verifyIntegrity);

module.exports = router;
