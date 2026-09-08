/**
 * 国际化管理模块 - 路由层
 * 仅超级管理员可访问
 */
const express = require('express')
const router = express.Router()
const i18nManagerController = require('./i18n-manager.controller')
const { requireAuth } = require('../../middleware/auth.middleware')
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')

// 获取语言列表（所有登录用户可访问，用于语言切换）
router.get('/languages', requireAuth, i18nManagerController.getFileList)

// 读取语言文件内容（所有登录用户可访问，用于动态加载语言包）
router.get('/language/read', requireAuth, i18nManagerController.readFile)

// 获取国际化文件列表（仅超级管理员可访问，用于国际化管理页面）
router.get('/files', requireAuth, requireSuperAdmin, i18nManagerController.getFileList)

// 读取国际化文件内容（仅超级管理员可访问，用于国际化管理页面）
router.get('/file/read', requireAuth, requireSuperAdmin, i18nManagerController.readFile)

// 搜索国际化内容
router.get('/search', requireAuth, requireSuperAdmin, i18nManagerController.searchContent)

// 保存国际化文件内容
router.post('/file/save', requireAuth, requireSuperAdmin, i18nManagerController.saveFile)

// 手动备份
router.post('/backup', requireAuth, requireSuperAdmin, i18nManagerController.backupFile)

// 获取备份文件列表
router.get('/backups', requireAuth, requireSuperAdmin, i18nManagerController.getBackupList)

// 恢复备份
router.post('/backup/restore', requireAuth, requireSuperAdmin, i18nManagerController.restoreBackup)

// 删除备份
router.post('/backup/delete', requireAuth, requireSuperAdmin, i18nManagerController.deleteBackup)

// 新增国际化配置
router.post('/config/add', requireAuth, requireSuperAdmin, i18nManagerController.addConfig)

// 删除国际化配置
router.post('/config/delete', requireAuth, requireSuperAdmin, i18nManagerController.deleteConfig)

// 获取备份目录配置
router.get('/backup-config', requireAuth, requireSuperAdmin, i18nManagerController.getBackupConfig)

// 设置备份目录
router.post('/backup-dir', requireAuth, requireSuperAdmin, i18nManagerController.setBackupDir)

// 创建新语言文件
router.post('/language/create', requireAuth, requireSuperAdmin, i18nManagerController.createLanguage)

// 获取预设语言列表
router.get('/preset-languages', requireAuth, requireSuperAdmin, i18nManagerController.getPresetLanguages)

// 获取预设语言配置文件内容
router.get('/preset-languages/config', requireAuth, requireSuperAdmin, i18nManagerController.getPresetLanguagesConfigContent)

// 保存预设语言配置文件内容
router.post('/preset-languages/config', requireAuth, requireSuperAdmin, i18nManagerController.savePresetLanguagesConfigContent)

// 获取所有语言元数据
router.get('/language-meta', requireAuth, requireSuperAdmin, i18nManagerController.getAllLanguageMeta)

module.exports = router
