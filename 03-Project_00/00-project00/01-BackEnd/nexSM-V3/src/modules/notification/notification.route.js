/**
 * 通知中心模块 - 路由配置
 * 路由前缀：/prod-api/v2/notification（自动加载）
 */
const express = require('express')
const router = express.Router()
const notificationController = require('./notification.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// 获取未读数量
router.get('/unread-count', requireAuth, notificationController.getUnreadCount)
// 获取通知列表
router.get('/', requireAuth, notificationController.getList)
// 获取通知详情
router.get('/:id', requireAuth, notificationController.getDetail)
// 标记为已读
router.put('/:id/read', requireAuth, notificationController.markAsRead)
// 全部标记为已读
router.put('/read-all', requireAuth, notificationController.markAllAsRead)
// 删除通知
router.delete('/:id', requireAuth, notificationController.delete)
// 创建并推送通知（测试/系统调用）
router.post('/', requireAuth, notificationController.create)

module.exports = router
