/**
 * 翻译模块 - 路由层
 * 配置管理需超管，翻译接口需登录
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const translationController = require('./translation.controller')
const { requireAuth } = require('../../middleware/auth.middleware')
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')

/**
 * @openapi
 * /translation/config:
 *   get:
 *     tags: [翻译服务]
 *     summary: 获取翻译配置（仅超管）
 *     responses:
 *       200:
 *         description: 翻译配置
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
// 获取翻译配置（需要超级管理员）
router.get('/config', requireAuth, requireSuperAdmin, translationController.getConfig)

/**
 * @openapi
 * /translation/config/save:
 *   post:
 *     tags: [翻译服务]
 *     summary: 保存翻译配置（仅超管）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 翻译服务配置（provider/appKey/secret 等）
 *           example: { provider: 'google', enabled: true, apiKey: 'xxx' }
 *     responses:
 *       200:
 *         description: 保存成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/config/save', requireAuth, requireSuperAdmin, translationController.saveConfig)

/**
 * @openapi
 * /translation/config/test:
 *   post:
 *     tags: [翻译服务]
 *     summary: 测试翻译配置连通性（仅超管）
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 同配置保存
 *           example: { provider: 'google', apiKey: 'xxx' }
 *     responses:
 *       200:
 *         description: 测试结果
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/config/test', requireAuth, requireSuperAdmin, translationController.testConfig)

/**
 * @openapi
 * /translation/translate:
 *   post:
 *     tags: [翻译服务]
 *     summary: 翻译单条文本（需登录）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text, from, to]
 *             properties:
 *               text: { type: string, example: 'Hello' }
 *               from: { type: string, example: 'en' }
 *               to: { type: string, example: 'zh-CN' }
 *           example: { text: 'Hello', from: 'en', to: 'zh-CN' }
 *     responses:
 *       200:
 *         description: 翻译结果
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
 *                         translatedText: { type: string, example: '你好' }
 */
router.post('/translate', requireAuth, translationController.translate)

/**
 * @openapi
 * /translation/translate/batch:
 *   post:
 *     tags: [翻译服务]
 *     summary: 批量翻译文本（需登录）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [texts, from, to]
 *             properties:
 *               texts: { type: array, items: { type: string } }
 *               from: { type: string }
 *               to: { type: string }
 *           example: { texts: ['Hello', 'World'], from: 'en', to: 'zh-CN' }
 *     responses:
 *       200:
 *         description: 批量翻译结果
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/translate/batch', requireAuth, translationController.translateBatch)

module.exports = router
