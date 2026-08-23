/**
 * 通知中心模块 - 业务逻辑层
 * 
 * 处理通知的增删改查、未读数量统计、标记已读、WebSocket 实时推送等业务逻辑
 * 用户只能查看和操作自己的通知
 * 继承 BaseService，复用通用 CRUD 操作
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseService = require('../../services/BaseService')
const notificationModel = require('./notification.model')
const wsManager = require('../../socket/wsManager')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class NotificationService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，传入通知模型和配置
   * 通知模块没有多语言字段
   */
  constructor() {
    super(notificationModel, {
      name: '通知',
      langFields: []
    })
  }

  // ==================== 特殊功能方法 ====================

  /**
   * 获取用户通知列表
   * 
   * 用户只能查看自己的通知
   * 
   * @param {number} userId - 用户 ID
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {number} [params.is_read] - 是否已读 1是 0否
   * @param {string} [params.type] - 通知类型 system/plc/user/audit
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getNotificationList(userId, params) {
    return await notificationModel.getByUserId(userId, params)
  }

  /**
   * 获取未读通知数量
   * 
   * @param {number} userId - 用户 ID
   * @returns {Promise<Object>} { count }
   */
  async getUnreadCount(userId) {
    const count = await notificationModel.getUnreadCount(userId)
    return { count }
  }

  /**
   * 获取通知详情
   * 
   * 用户只能查看自己的通知，查看时自动标记为已读
   * 
   * @param {number} id - 通知 ID
   * @param {number} userId - 用户 ID（用于权限校验）
   * @returns {Promise<Object>} 通知详情
   * @throws {BusinessError} 通知不存在
   */
  async getNotificationById(id, userId) {
    const notification = await notificationModel.getById(id)
    if (!notification || notification.user_id !== userId) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, '通知不存在')
    }
    // 自动标记为已读
    if (!notification.is_read) {
      await notificationModel.markAsRead(id, userId)
      notification.is_read = 1
    }
    return notification
  }

  /**
   * 标记通知为已读
   * 
   * @param {number} id - 通知 ID
   * @param {number} userId - 用户 ID（用于权限校验）
   * @returns {Promise<void>}
   */
  async markAsRead(id, userId) {
    await notificationModel.markAsRead(id, userId)
  }

  /**
   * 标记所有通知为已读
   * 
   * @param {number} userId - 用户 ID
   * @returns {Promise<void>}
   */
  async markAllAsRead(userId) {
    await notificationModel.markAllAsRead(userId)
  }

  /**
   * 删除通知
   * 
   * 用户只能删除自己的通知
   * 
   * @param {number} id - 通知 ID
   * @param {number} userId - 用户 ID（用于权限校验）
   * @returns {Promise<void>}
   */
  async deleteNotification(id, userId) {
    await notificationModel.deleteByUser(id, userId)
  }

  /**
   * 发送通知（系统内部调用）
   * 
   * 保存到数据库并通过 WebSocket 实时推送给用户
   * 
   * @param {Object} params - 通知参数
   * @param {number} params.userId - 接收用户 ID
   * @param {string} params.title - 通知标题
   * @param {string} params.content - 通知内容
   * @param {string} [params.type='system'] - 通知类型 system/plc/user/audit
   * @param {string} [params.priority='normal'] - 优先级 high/normal/low
   * @param {string} [params.link=''] - 跳转链接
   * @returns {Promise<Object>} { insertId, affectedRows }
   */
  async sendNotification(params) {
    const { userId, title, content, type = 'system', priority = 'normal', link = '' } = params

    // 保存到数据库
    const result = await notificationModel.create({
      user_id: userId,
      title,
      content,
      type,
      priority,
      link,
      is_read: 0
    })

    // WebSocket 实时推送
    wsManager.sendToUser(userId, {
      type: 'notification',
      data: {
        id: result.insertId,
        title,
        content,
        type,
        priority,
        created_at: new Date().toISOString()
      }
    })

    return result
  }

  /**
   * 批量发送通知
   * 
   * 给多个用户发送相同的通知
   * 
   * @param {Array<number>} userIds - 用户 ID 数组
   * @param {Object} params - 通知参数（同 sendNotification，不含 userId）
   * @returns {Promise<Array>} 创建结果数组
   */
  async sendBatchNotifications(userIds, params) {
    const results = []
    for (const userId of userIds) {
      const result = await this.sendNotification({ ...params, userId })
      results.push(result)
    }
    return results
  }
}

module.exports = new NotificationService()
