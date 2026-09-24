/**
 * 通知中心模块 - 路由配置
 * 路由前缀：/prod-api/v2/notification（自动加载）
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const notificationController = require('./notification.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// ==================== 基础查询 ====================

/**
 * @openapi
 * /notification/unread-count:
 *   get:
 *     tags: [通知中心]
 *     summary: 获取当前用户未读通知数量
 *     responses:
 *       200:
 *         description: 未读数
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
 *                         count: { type: integer, example: 3 }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
router.get('/unread-count', requireAuth, notificationController.getUnreadCount)

/**
 * @openapi
 * /notification/type-stats:
 *   get:
 *     tags: [通知中心]
 *     summary: 获取各类型通知数量统计
 *     responses:
 *       200:
 *         description: 类型统计
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       additionalProperties: { type: integer }
 *                       example: { info: 2, warning: 1, error: 0 }
 */
router.get('/type-stats', requireAuth, notificationController.getTypeStats)

/**
 * @openapi
 * /notification:
 *   get:
 *     tags: [通知中心]
 *     summary: 分页查询通知列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: 通知类型 info/warning/error/success
 *       - in: query
 *         name: priority
 *         schema: { type: string }
 *       - in: query
 *         name: isRead
 *         schema: { type: integer, enum: [0, 1] }
 *       - in: query
 *         name: isArchived
 *         schema: { type: integer, enum: [0, 1] }
 *     responses:
 *       200:
 *         description: 通知分页
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/Notification' } }
 */
router.get('/', requireAuth, notificationController.getList)

/**
 * @openapi
 * /notification/{id}:
 *   get:
 *     tags: [通知中心]
 *     summary: 获取通知详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 通知详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Notification' }
 *       404: { description: 通知不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
router.get('/:id', requireAuth, notificationController.getDetail)

// ==================== 标记已读 ====================

/**
 * @openapi
 * /notification/{id}/read:
 *   put:
 *     tags: [通知中心]
 *     summary: 标记单条通知为已读
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 操作成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/:id/read', requireAuth, notificationController.markAsRead)

/**
 * @openapi
 * /notification/read-all:
 *   put:
 *     tags: [通知中心]
 *     summary: 全部标记为已读
 *     responses:
 *       200:
 *         description: 操作成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/read-all', requireAuth, notificationController.markAllAsRead)

/**
 * @openapi
 * /notification/batch-read:
 *   put:
 *     tags: [通知中心]
 *     summary: 批量标记为已读
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: integer } }
 *           example: { ids: [1, 2, 3] }
 *     responses:
 *       200:
 *         description: 操作成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/batch-read', requireAuth, notificationController.batchMarkAsRead)

// ==================== 删除操作 ====================

/**
 * @openapi
 * /notification/{id}:
 *   delete:
 *     tags: [通知中心]
 *     summary: 删除单条通知
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/:id', requireAuth, notificationController.delete)

/**
 * @openapi
 * /notification/batch:
 *   delete:
 *     tags: [通知中心]
 *     summary: 批量删除通知
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: integer } }
 *           example: { ids: [1, 2] }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/batch', requireAuth, notificationController.batchDelete)

/**
 * @openapi
 * /notification/all:
 *   delete:
 *     tags: [通知中心]
 *     summary: 清空所有通知
 *     responses:
 *       200:
 *         description: 清空成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/all', requireAuth, notificationController.deleteAll)

// ==================== 通知归档 ====================

/**
 * @openapi
 * /notification/archive:
 *   put:
 *     tags: [通知中心]
 *     summary: 归档通知
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids: { type: array, items: { type: integer } }
 *           example: { ids: [1, 2] }
 *     responses:
 *       200:
 *         description: 归档成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/archive', requireAuth, notificationController.archive)

/**
 * @openapi
 * /notification/unarchive:
 *   put:
 *     tags: [通知中心]
 *     summary: 恢复已归档的通知
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids: { type: array, items: { type: integer } }
 *           example: { ids: [1] }
 *     responses:
 *       200:
 *         description: 恢复成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/unarchive', requireAuth, notificationController.unarchive)

// ==================== 用户通知设置 ====================

/**
 * @openapi
 * /notification/settings/get:
 *   get:
 *     tags: [通知中心]
 *     summary: 获取当前用户通知设置
 *     responses:
 *       200:
 *         description: 用户通知设置
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/settings/get', requireAuth, notificationController.getSettings)

/**
 * @openapi
 * /notification/settings/update:
 *   put:
 *     tags: [通知中心]
 *     summary: 更新当前用户通知设置
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 各类通知开关
 *           example: { emailEnabled: true, smsEnabled: false, types: { warning: true } }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/settings/update', requireAuth, notificationController.updateSettings)

// ==================== 系统调用 ====================

/**
 * @openapi
 * /notification:
 *   post:
 *     tags: [通知中心]
 *     summary: 创建并推送通知（系统/测试调用）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               type: { type: string, enum: [info, warning, error, success] }
 *               priority: { type: string }
 *               userId: { type: integer, description: '指定接收人，不传则广播' }
 *           example: { title: '测试通知', content: '这是一条测试通知', type: 'info' }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/', requireAuth, notificationController.create)

module.exports = router
