/**
 * 项目配置路由（只读，仅超级管理员）
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const projectConfigController = require('./project-config.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware');

/**
 * @openapi
 * /project-config/all:
 *   get:
 *     tags: [项目配置]
 *     summary: 获取项目所有配置信息（仅超管，只读）
 *     responses:
 *       200:
 *         description: 项目配置
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: object, additionalProperties: true }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 *       403: { description: 非超级管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 获取项目所有配置信息
router.get('/all', requireAuth, requireSuperAdmin, projectConfigController.getAllConfig);

module.exports = router;
