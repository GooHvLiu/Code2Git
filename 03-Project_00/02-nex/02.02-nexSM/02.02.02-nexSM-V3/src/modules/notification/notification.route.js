/**
 * 通知中心模块 - 路由配置
 * 路由前缀：/prod-api/v2/notification（自动加载）
 */
const express = require('express')
const router = express.Router()
const notificationController = require('./notification.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// ==================== 基础查询 ====================
// 获取未读数量
router.get('/unread-count', requireAuth, notificationController.getUnreadCount)
// 获取各类型通知数量统计
router.get('/type-stats', requireAuth, notificationController.getTypeStats)
// 获取通知列表（支持类型、优先级、时间范围、归档状态筛选）
router.get('/', requireAuth, notificationController.getList)
// 获取通知详情
router.get('/:id', requireAuth, notificationController.getDetail)

// ==================== 标记已读 ====================
// 标记为已读
router.put('/:id/read', requireAuth, notificationController.markAsRead)
// 全部标记为已读
router.put('/read-all', requireAuth, notificationController.markAllAsRead)
// 批量标记为已读
router.put('/batch-read', requireAuth, notificationController.batchMarkAsRead)

// ==================== 删除操作 ====================
// 删除通知
router.delete('/:id', requireAuth, notificationController.delete)
// 批量删除通知
router.delete('/batch', requireAuth, notificationController.batchDelete)
// 全部删除（清空所有通知）
router.delete('/all', requireAuth, notificationController.deleteAll)

// ==================== 通知归档 ====================
// 归档通知
router.put('/archive', requireAuth, notificationController.archive)
// 恢复已归档的通知
router.put('/unarchive', requireAuth, notificationController.unarchive)

// ==================== 用户通知设置 ====================
// 获取用户通知设置
router.get('/settings/get', requireAuth, notificationController.getSettings)
// 更新用户通知设置
router.put('/settings/update', requireAuth, notificationController.updateSettings)

// ==================== 系统调用 ====================
// 创建并推送通知（测试/系统调用）
router.post('/', requireAuth, notificationController.create)

module.exports = router
