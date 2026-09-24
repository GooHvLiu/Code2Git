/**
 * 国际化管理模块 - 路由层
 * 语言列表/读取：登录用户即可；其余写操作/备份/配置：仅超级管理员
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const ctrl = require('./i18n-manager.controller')
const { requireAuth } = require('../../middleware/auth.middleware')
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')

// ---------- 登录用户可访问（语言切换 / 动态加载） ----------

/**
 * @openapi
 * /i18n-manager/languages:
 *   get:
 *     tags: [国际化管理]
 *     summary: 获取支持的语言列表
 *     responses:
 *       200:
 *         description: 语言列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           code: { type: string, example: 'zh-CN' }
 *                           name: { type: string, example: '简体中文' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
router.get('/languages', requireAuth, ctrl.listLanguages)

/**
 * @openapi
 * /i18n-manager/language/read:
 *   get:
 *     tags: [国际化管理]
 *     summary: 读取整语言包
 *     parameters:
 *       - in: query
 *         name: lang
 *         required: true
 *         schema: { type: string }
 *         description: 语言代码，如 zh-CN
 *     responses:
 *       200:
 *         description: 语言包键值
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: object, additionalProperties: { type: string } }
 */
router.get('/language/read', requireAuth, ctrl.readLanguage)

// ---------- 超级管理员：语言读取与节点编辑 ----------

/**
 * @openapi
 * /i18n-manager/language/search:
 *   get:
 *     tags: [国际化管理]
 *     summary: 搜索翻译词条（仅超管）
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: lang
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 搜索结果
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非超级管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.get('/language/search', requireAuth, requireSuperAdmin, ctrl.searchLanguage)

/**
 * @openapi
 * /i18n-manager/node/save:
 *   post:
 *     tags: [国际化管理]
 *     summary: 保存单个翻译节点的值（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lang, key, value]
 *             properties:
 *               lang: { type: string, example: 'zh-CN' }
 *               key: { type: string, example: 'login.username' }
 *               value: { type: string, example: '用户名' }
 *           example: { lang: 'zh-CN', key: 'login.username', value: '用户名' }
 *     responses:
 *       200:
 *         description: 保存成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/node/save', requireAuth, requireSuperAdmin, ctrl.saveNodeValue)

/**
 * @openapi
 * /i18n-manager/node/add:
 *   post:
 *     tags: [国际化管理]
 *     summary: 新增翻译节点（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentKey: { type: string }
 *               key: { type: string }
 *           example: { parentKey: 'login', key: 'rememberMe' }
 *     responses:
 *       200:
 *         description: 新增成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/node/add', requireAuth, requireSuperAdmin, ctrl.addNode)

/**
 * @openapi
 * /i18n-manager/node/delete:
 *   post:
 *     tags: [国际化管理]
 *     summary: 删除翻译节点（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key: { type: string }
 *           example: { key: 'login.rememberMe' }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/node/delete', requireAuth, requireSuperAdmin, ctrl.deleteNode)

/**
 * @openapi
 * /i18n-manager/language/save-values:
 *   post:
 *     tags: [国际化管理]
 *     summary: 批量保存整语言值（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lang: { type: string }
 *               values: { type: object, additionalProperties: { type: string } }
 *           example: { lang: 'zh-CN', values: { 'login.username': '用户名' } }
 *     responses:
 *       200:
 *         description: 保存成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/language/save-values', requireAuth, requireSuperAdmin, ctrl.saveLanguageValues)

/**
 * @openapi
 * /i18n-manager/language/create:
 *   post:
 *     tags: [国际化管理]
 *     summary: 创建新语言（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code: { type: string, example: 'en-US' }
 *               name: { type: string, example: 'English' }
 *           example: { code: 'en-US', name: 'English' }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/language/create', requireAuth, requireSuperAdmin, ctrl.createLanguage)

// ---------- 超级管理员：zip 备份 / 恢复 / 删除 ----------

/**
 * @openapi
 * /i18n-manager/backup:
 *   post:
 *     tags: [国际化管理]
 *     summary: 备份语言包为 zip（仅超管）
 *     responses:
 *       200:
 *         description: 备份成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/backup', requireAuth, requireSuperAdmin, ctrl.backupLanguage)

/**
 * @openapi
 * /i18n-manager/backups:
 *   get:
 *     tags: [国际化管理]
 *     summary: 获取语言包备份列表（仅超管）
 *     responses:
 *       200:
 *         description: 备份列表
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/backups', requireAuth, requireSuperAdmin, ctrl.getBackupList)

/**
 * @openapi
 * /i18n-manager/backup/restore:
 *   post:
 *     tags: [国际化管理]
 *     summary: 从 zip 备份恢复语言包（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName: { type: string }
 *           example: { fileName: 'i18n-backup-20260924.zip' }
 *     responses:
 *       200:
 *         description: 恢复成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/backup/restore', requireAuth, requireSuperAdmin, ctrl.restoreBackup)

/**
 * @openapi
 * /i18n-manager/backup/delete:
 *   post:
 *     tags: [国际化管理]
 *     summary: 删除语言包备份（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName: { type: string }
 *           example: { fileName: 'i18n-backup-20260101.zip' }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/backup/delete', requireAuth, requireSuperAdmin, ctrl.deleteBackup)

// ---------- 超级管理员：备份目录配置 ----------

/**
 * @openapi
 * /i18n-manager/backup-config:
 *   get:
 *     tags: [国际化管理]
 *     summary: 获取语言包备份目录配置（仅超管）
 *     responses:
 *       200:
 *         description: 备份目录配置
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/backup-config', requireAuth, requireSuperAdmin, ctrl.getBackupConfig)

/**
 * @openapi
 * /i18n-manager/backup-dir:
 *   post:
 *     tags: [国际化管理]
 *     summary: 设置语言包备份目录（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dir: { type: string }
 *           example: { dir: 'D:\\backup\\i18n' }
 *     responses:
 *       200:
 *         description: 设置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/backup-dir', requireAuth, requireSuperAdmin, ctrl.setBackupDir)

// ---------- 超级管理员：预设语言 ----------

/**
 * @openapi
 * /i18n-manager/preset-languages:
 *   get:
 *     tags: [国际化管理]
 *     summary: 获取预设语言列表（仅超管）
 *     responses:
 *       200:
 *         description: 预设语言
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/preset-languages', requireAuth, requireSuperAdmin, ctrl.getPresetLanguages)

/**
 * @openapi
 * /i18n-manager/preset-languages/config:
 *   get:
 *     tags: [国际化管理]
 *     summary: 读取预设语言配置文件内容（仅超管）
 *     responses:
 *       200:
 *         description: 配置文件内容
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/preset-languages/config', requireAuth, requireSuperAdmin, ctrl.getPresetLanguagesConfigContent)

/**
 * @openapi
 * /i18n-manager/preset-languages/config:
 *   post:
 *     tags: [国际化管理]
 *     summary: 保存预设语言配置文件内容（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *           example: { content: '[{ "code": "zh-CN", "name": "简体中文" }]' }
 *     responses:
 *       200:
 *         description: 保存成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/preset-languages/config', requireAuth, requireSuperAdmin, ctrl.savePresetLanguagesConfigContent)

module.exports = router
