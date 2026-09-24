/**
 * ==========================================
 * 功能配置模块 - 路由层（仅超级管理员）
 * 路由前缀：/prod-api/v2/feature-config
 * 作者: GooHv
 * ==========================================
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

/**
 * @openapi
 * /feature-config:
 *   get:
 *     tags: [功能配置]
 *     summary: 获取所有功能配置
 *     responses:
 *       200:
 *         description: 全部功能配置
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: object, additionalProperties: true }
 *       403: { description: 非超级管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 获取所有功能配置
router.get('/', featureConfigController.getAllConfig)

/**
 * @openapi
 * /feature-config/category/{category}:
 *   get:
 *     tags: [功能配置]
 *     summary: 按分类获取功能配置
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 分类配置
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 按分类获取功能配置
router.get('/category/:category', featureConfigController.getByCategory)

/**
 * @openapi
 * /feature-config/check/{featureKey}:
 *   get:
 *     tags: [功能配置]
 *     summary: 检查功能是否启用
 *     parameters:
 *       - in: path
 *         name: featureKey
 *         required: true
 *         schema: { type: string }
 *         description: 功能标识
 *     responses:
 *       200:
 *         description: 启用状态
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
 *                         enabled: { type: boolean, example: true }
 */
// 检查功能是否启用
router.get('/check/:featureKey', featureConfigController.checkFeatureEnabled)

/**
 * @openapi
 * /feature-config/{featureKey}:
 *   get:
 *     tags: [功能配置]
 *     summary: 获取单个功能配置
 *     parameters:
 *       - in: path
 *         name: featureKey
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 单个功能配置
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 获取单个功能配置
router.get('/:featureKey', featureConfigController.getConfig)

/**
 * @openapi
 * /feature-config/{featureKey}:
 *   put:
 *     tags: [功能配置]
 *     summary: 更新单个功能配置
 *     parameters:
 *       - in: path
 *         name: featureKey
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 配置键值
 *           example: { enabled: true, value: '100' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 更新单个功能配置
router.put('/:featureKey', featureConfigController.updateConfig)

/**
 * @openapi
 * /feature-config/{featureKey}/reset:
 *   put:
 *     tags: [功能配置]
 *     summary: 重置单个功能配置为默认值
 *     parameters:
 *       - in: path
 *         name: featureKey
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 重置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 重置单个功能配置为默认值
router.put('/:featureKey/reset', featureConfigController.resetConfig)

/**
 * @openapi
 * /feature-config/batch-update:
 *   post:
 *     tags: [功能配置]
 *     summary: 批量更新功能配置
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 多个功能键值对
 *           example: { PLC_POLL: { enabled: true }, NOTIFICATION: { enabled: false } }
 *     responses:
 *       200:
 *         description: 批量更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 批量更新功能配置
router.post('/batch-update', featureConfigController.batchUpdateConfig)

/**
 * @openapi
 * /feature-config/category/{category}/reset:
 *   put:
 *     tags: [功能配置]
 *     summary: 按分类重置为默认值
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 重置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 按分类重置为默认值
router.put('/category/:category/reset', featureConfigController.resetCategory)

/**
 * @openapi
 * /feature-config/reset-all:
 *   put:
 *     tags: [功能配置]
 *     summary: 全部重置为默认值
 *     responses:
 *       200:
 *         description: 重置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 全部重置为默认值
router.put('/reset-all', featureConfigController.resetAll)

module.exports = router
