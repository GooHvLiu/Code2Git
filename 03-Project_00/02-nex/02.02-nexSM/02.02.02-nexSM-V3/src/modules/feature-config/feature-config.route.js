/**
 * ==========================================
 * 功能配置模块 - 路由层
 * ==========================================
 * 路由前缀：/prod-api/v2/feature-config（自动加载）
 * 仅超级管理员可访问
 */
const express = require('express')
const router = express.Router()
const featureConfigController = require('./feature-config.controller')
const { requireAuth } = require('../../middleware/auth.middleware')
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')

// 需要登录的接口
router.use(requireAuth)

// 仅超级管理员可访问
router.use(requireSuperAdmin)

// 获取所有功能配置
router.get('/', featureConfigController.getAllConfig)

// 按分类获取功能配置
router.get('/category/:category', featureConfigController.getByCategory)

// 检查功能是否启用
router.get('/check/:featureKey', featureConfigController.checkFeatureEnabled)

// 获取单个功能配置
router.get('/:featureKey', featureConfigController.getConfig)

// 更新单个功能配置
router.put('/:featureKey', featureConfigController.updateConfig)

// 重置单个功能配置为默认值
router.put('/:featureKey/reset', featureConfigController.resetConfig)

// 批量更新功能配置
router.post('/batch-update', featureConfigController.batchUpdateConfig)

// 按分类重置为默认值
router.put('/category/:category/reset', featureConfigController.resetCategory)

// 全部重置为默认值
router.put('/reset-all', featureConfigController.resetAll)

module.exports = router
