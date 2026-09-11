/**
 * 国际化管理模块 - 路由层（模块化「目录模型」版）
 * - 语言列表 / 整语言读取：登录用户即可（语言切换、动态加载语言包）
 * - 其余写操作 / 备份 / 配置：仅超级管理员
 */
const express = require('express')
const router = express.Router()
const ctrl = require('./i18n-manager.controller')
const { requireAuth } = require('../../middleware/auth.middleware')
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')

// ---------- 登录用户可访问（语言切换 / 动态加载） ----------
router.get('/languages', requireAuth, ctrl.listLanguages)
router.get('/language/read', requireAuth, ctrl.readLanguage)

// ---------- 超级管理员：语言读取与节点编辑 ----------
router.get('/language/search', requireAuth, requireSuperAdmin, ctrl.searchLanguage)
router.post('/node/save', requireAuth, requireSuperAdmin, ctrl.saveNodeValue)
router.post('/node/add', requireAuth, requireSuperAdmin, ctrl.addNode)
router.post('/node/delete', requireAuth, requireSuperAdmin, ctrl.deleteNode)
router.post('/language/save-values', requireAuth, requireSuperAdmin, ctrl.saveLanguageValues)
router.post('/language/create', requireAuth, requireSuperAdmin, ctrl.createLanguage)

// ---------- 超级管理员：zip 备份 / 恢复 / 删除 ----------
router.post('/backup', requireAuth, requireSuperAdmin, ctrl.backupLanguage)
router.get('/backups', requireAuth, requireSuperAdmin, ctrl.getBackupList)
router.post('/backup/restore', requireAuth, requireSuperAdmin, ctrl.restoreBackup)
router.post('/backup/delete', requireAuth, requireSuperAdmin, ctrl.deleteBackup)

// ---------- 超级管理员：备份目录配置 ----------
router.get('/backup-config', requireAuth, requireSuperAdmin, ctrl.getBackupConfig)
router.post('/backup-dir', requireAuth, requireSuperAdmin, ctrl.setBackupDir)

// ---------- 超级管理员：预设语言 ----------
router.get('/preset-languages', requireAuth, requireSuperAdmin, ctrl.getPresetLanguages)
router.get('/preset-languages/config', requireAuth, requireSuperAdmin, ctrl.getPresetLanguagesConfigContent)
router.post('/preset-languages/config', requireAuth, requireSuperAdmin, ctrl.savePresetLanguagesConfigContent)

module.exports = router
