/**
 * 项目配置路由
 * 只读接口，需要超级管理员权限
 */
const express = require('express');
const router = express.Router();
const projectConfigController = require('./project-config.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware');

// 获取项目所有配置信息
router.get('/all', requireAuth, requireSuperAdmin, projectConfigController.getAllConfig);

module.exports = router;
