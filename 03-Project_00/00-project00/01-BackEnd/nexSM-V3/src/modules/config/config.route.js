/**
 * 系统配置路由
 */
const express = require('express');
const router = express.Router();
const configController = require('./config.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

// 获取所有配置
router.get('/', requireAuth, configController.getAllConfigs);

// 根据分类获取配置
router.get('/category/:category', requireAuth, configController.getConfigsByCategory);

// 批量更新配置
router.put('/', requireAuth, configController.updateConfigs);

// 重置所有配置为默认值
router.post('/reset', requireAuth, configController.resetAllConfigs);

module.exports = router;
