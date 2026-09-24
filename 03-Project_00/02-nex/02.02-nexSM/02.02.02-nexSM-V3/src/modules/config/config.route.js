/**
 * 系统配置路由
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const configController = require('./config.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

/**
 * @openapi
 * /config:
 *   get:
 *     tags: [系统配置]
 *     summary: 获取所有系统配置
 *     responses:
 *       200:
 *         description: 全部配置键值对
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       additionalProperties: { type: string }
 *                       example: { PLC_HOST: '127.0.0.1', PLC_PORT: '502', POLL_INTERVAL: '1000' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 获取所有配置
router.get('/', requireAuth, configController.getAllConfigs);

/**
 * @openapi
 * /config/category/{category}:
 *   get:
 *     tags: [系统配置]
 *     summary: 按分类获取系统配置
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *         description: 配置分类，如 plc / system / notification
 *     responses:
 *       200:
 *         description: 该分类下配置
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: object, additionalProperties: { type: string } }
 */
// 根据分类获取配置
router.get('/category/:category', requireAuth, configController.getConfigsByCategory);

/**
 * @openapi
 * /config:
 *   put:
 *     tags: [系统配置]
 *     summary: 批量更新系统配置
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 键值对，key 为配置名，value 为配置值
 *           example: { POLL_INTERVAL: '2000', DEVICE_NAME: 'Line-A' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 批量更新配置
router.put('/', requireAuth, configController.updateConfigs);

module.exports = router;
