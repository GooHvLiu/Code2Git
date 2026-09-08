/**
 * 翻译模块 - 路由层
 * 配置管理需要超级管理员权限，翻译接口需要登录权限
 */
const express = require('express')
const router = express.Router()
const translationController = require('./translation.controller')
const { requireAuth } = require('../../middleware/auth.middleware')
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')

// 获取翻译配置（需要超级管理员）
router.get('/config', requireAuth, requireSuperAdmin, translationController.getConfig)

// 保存翻译配置（需要超级管理员）
router.post('/config/save', requireAuth, requireSuperAdmin, translationController.saveConfig)

// 测试翻译配置（需要超级管理员）
router.post('/config/test', requireAuth, requireSuperAdmin, translationController.testConfig)

// 翻译文本（需要登录）
router.post('/translate', requireAuth, translationController.translate)

// 批量翻译（需要登录）
router.post('/translate/batch', requireAuth, translationController.translateBatch)

module.exports = router
