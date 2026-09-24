/**
 * plc模块 - 路由层
 * 所有接口需要登录鉴权
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const plcController = require('./plc.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// 所有 PLC 接口需要登录
router.use(requireAuth)

/**
 * @openapi
 * /plc/status:
 *   get:
 *     tags: [PLC 通讯]
 *     summary: 获取 PLC 通讯状态
 *     responses:
 *       200:
 *         description: 连接状态
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
 *                         connected: { type: boolean, example: true }
 *                         deviceCount: { type: integer, example: 1 }
 *                         connectedCount: { type: integer, example: 1 }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
router.get('/status', plcController.getStatus)

/**
 * @openapi
 * /plc/read-tag:
 *   get:
 *     tags: [PLC 通讯]
 *     summary: 读取单个 PLC 点位
 *     parameters:
 *       - in: query
 *         name: tag
 *         required: true
 *         schema: { type: string }
 *         description: 点位名称，如 deviceRunStatus
 *     responses:
 *       200:
 *         description: 点位当前值
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
 *                         tag: { type: string, example: 'deviceRunStatus' }
 *                         value: { example: 1 }
 */
router.get('/read-tag', plcController.readTag)

/**
 * @openapi
 * /plc/read-all:
 *   get:
 *     tags: [PLC 通讯]
 *     summary: 读取所有 PLC 点位
 *     responses:
 *       200:
 *         description: 全量点位键值
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       additionalProperties: true
 *                       example: { deviceRunStatus: 1, fillVolume: 5.0, speed: 30 }
 */
router.get('/read-all', plcController.readAllTags)

/**
 * @openapi
 * /plc/write-tag:
 *   post:
 *     tags: [PLC 通讯]
 *     summary: 下发写参数到 PLC
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tag, value]
 *             properties:
 *               tag: { type: string, description: '点位名称' }
 *               value: { description: '写入值(数值/布尔/字符串,视点位类型而定)' }
 *           example: { tag: 'fillVolume', value: 5.0 }
 *     responses:
 *       200:
 *         description: 写入成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       400: { description: 点位不存在或写入失败, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 */
router.post('/write-tag', plcController.writeParameter)

/**
 * @openapi
 * /plc/reconnect:
 *   post:
 *     tags: [PLC 通讯]
 *     summary: 手动重连 PLC 设备
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device: { type: string, description: '设备名称，不传则重连所有设备' }
 *           example: { device: 'default' }
 *     responses:
 *       200:
 *         description: 重连结果
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/reconnect', plcController.reconnect)

module.exports = router
