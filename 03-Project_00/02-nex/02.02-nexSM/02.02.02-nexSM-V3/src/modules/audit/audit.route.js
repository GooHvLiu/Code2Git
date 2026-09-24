/**
 * 审计日志模块 - 路由
 * GMP 21CFR Part 11 电子记录合规
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const auditController = require('./audit.controller');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');

// 所有审计接口需要登录
router.use(requireAuth);

/**
 * @openapi
 * /audit/list:
 *   get:
 *     tags: [审计追踪]
 *     summary: 分页查询审计日志
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10, maximum: 100 }
 *       - in: query
 *         name: userName
 *         schema: { type: string }
 *         description: 操作用户筛选
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *         description: 操作类型筛选
 *       - in: query
 *         name: startTime
 *         schema: { type: string, format: date-time }
 *         description: 开始时间
 *       - in: query
 *         name: endTime
 *         schema: { type: string, format: date-time }
 *         description: 结束时间
 *     responses:
 *       200:
 *         description: 分页审计日志
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PageResult'
 *                         - type: object
 *                           properties:
 *                             list: { type: array, items: { $ref: '#/components/schemas/AuditLog' } }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 分页查询审计日志
router.get('/list', auditController.getList);

/**
 * @openapi
 * /audit/my:
 *   get:
 *     tags: [审计追踪]
 *     summary: 查询当前用户的操作记录
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 当前用户操作记录
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PageResult'
 *                         - type: object
 *                           properties:
 *                             list: { type: array, items: { $ref: '#/components/schemas/AuditLog' } }
 */
// 查询当前用户的操作记录
router.get('/my', auditController.getMyLogs);

/**
 * @openapi
 * /audit/verify:
 *   get:
 *     tags: [审计追踪]
 *     summary: 校验审计日志哈希链完整性（仅管理员）
 *     description: 逐条校验审计日志的哈希链，确保记录未被篡改（21CFR Part 11 合规要求）。
 *     responses:
 *       200:
 *         description: 校验结果
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
 *                         valid: { type: boolean, example: true }
 *                         total: { type: integer, example: 1024 }
 *                         brokenIndex: { type: integer, nullable: true, example: null }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 校验哈希链完整性（仅管理员）
router.get('/verify', requireRole('administrator'), auditController.verifyIntegrity);

module.exports = router;
