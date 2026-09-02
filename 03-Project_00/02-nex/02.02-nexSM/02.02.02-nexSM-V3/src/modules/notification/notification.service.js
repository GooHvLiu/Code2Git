/**
 * 通知中心模块 - 业务逻辑层
 *
 * 处理通知的增删改查、未读数量统计、标记已读、WebSocket 实时推送等业务逻辑
 * 用户只能查看和操作自己的通知
 * 继承 BaseService，复用通用 CRUD 操作
 *
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-26
 */
const BaseService = require('../../services/BaseService')
const notificationModel = require('./notification.model')
const notificationSettingModel = require('./notificationSetting.model')
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
      throw new BusinessError(ERROR_CODE.NOTIFICATION_NOT_FOUND, null, { name: '通知' })
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
    // 实时同步：推送已读通知给该用户的其他在线设备
    this._syncReadStatus(userId, [id], false)
  }

  /**
   * 标记所有通知为已读
   *
   * @param {number} userId - 用户 ID
   * @returns {Promise<void>}
   */
  async markAllAsRead(userId) {
    await notificationModel.markAllAsRead(userId)
    // 实时同步：推送全部已读通知给该用户的其他在线设备
    this._syncReadStatus(userId, [], true)
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
   * 使用国际化 key + 动态参数的方式，前端使用 $t(key, params) 渲染
   *
   * @param {Object} params - 通知参数
   * @param {number} params.userId - 接收用户 ID
   * @param {string} params.titleKey - 通知标题国际化 key
   * @param {string} params.titleParams - 通知标题动态参数（JSON 字符串）
   * @param {string} params.contentKey - 通知内容国际化 key
   * @param {string} params.contentParams - 通知内容动态参数（JSON 字符串）
   * @param {string} [params.type='system'] - 通知类型 system/plc/user/audit
   * @param {string} [params.priority='normal'] - 优先级 high/normal/low
   * @param {string} [params.link=''] - 跳转链接
   * @returns {Promise<Object>} { insertId, affectedRows }
   */
  async sendNotification(params) {
    const {
      userId,
      titleKey,
      titleParams = '',
      contentKey,
      contentParams = '',
      type = 'system',
      priority = 'normal',
      link = ''
    } = params

    // 保存到数据库
    const result = await notificationModel.create({
      user_id: userId,
      title_key: titleKey,
      title_params: titleParams,
      content_key: contentKey,
      content_params: contentParams,
      type,
      priority,
      link,
      is_read: 0
    })

    // WebSocket 实时推送
    const pushResult = wsManager.sendToUser(userId, {
      type: 'notification',
      data: {
        id: result.insertId,
        titleKey,
        titleParams,
        contentKey,
        contentParams,
        type,
        priority,
        created_at: new Date().toISOString()
      }
    })
    console.log(`[通知推送] 当前在线用户: ${JSON.stringify(wsManager.getOnlineUserIds())}`)

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

  /**
   * 实时同步已读状态给该用户的其他在线设备
   *
   * @param {number} userId - 用户 ID
   * @param {Array<number>} notificationIds - 已读的通知 ID 列表
   * @param {boolean} markAll - 是否是全部标记已读
   * @private
   */
  async _syncReadStatus(userId, notificationIds, markAll) {
    try {
      // 获取最新的未读数量
      const unreadCount = await notificationModel.getUnreadCount(userId)
      // 通过 WebSocket 推送给该用户的其他在线设备
      wsManager.sendToUser(userId, {
        type: 'notification_read',
        data: {
          notificationIds: notificationIds || [],
          unreadCount: unreadCount,
          markAll: markAll || false
        }
      })
    } catch (err) {
      console.error('[通知同步] 推送已读状态失败:', err.message)
    }
  }

  // ==================== 批量操作 ====================

  /**
   * 批量标记为已读
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   */
  async batchMarkAsRead(userId, ids) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    await notificationModel.batchMarkAsRead(userId, ids)
    // 实时同步：推送批量已读通知给该用户的其他在线设备
    this._syncReadStatus(userId, ids, false)
  }

  /**
   * 批量删除通知
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   */
  async batchDelete(userId, ids) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    return await notificationModel.batchDelete(userId, ids)
  }

  /**
   * 全部删除（清空用户所有通知）
   * @param {number} userId - 用户ID
   * @param {boolean} includeArchived - 是否包含已归档的通知
   */
  async deleteAll(userId, includeArchived = false) {
    return await notificationModel.deleteAll(userId, includeArchived)
  }

  // ==================== 通知归档 ====================

  /**
   * 归档通知
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   */
  async archive(userId, ids) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    return await notificationModel.archive(userId, ids)
  }

  /**
   * 恢复已归档的通知
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   */
  async unarchive(userId, ids) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    return await notificationModel.unarchive(userId, ids)
  }

  /**
   * 获取各类型通知数量统计
   * @param {number} userId - 用户ID
   */
  async getTypeStats(userId) {
    return await notificationModel.getTypeStats(userId)
  }

  // ==================== 用户通知设置 ====================

  /**
   * 获取用户通知设置
   * @param {number} userId - 用户ID
   */
  async getSettings(userId) {
    return await notificationSettingModel.getByUserId(userId)
  }

  /**
   * 更新用户通知设置
   * @param {number} userId - 用户ID
   * @param {Object} settings - 设置对象（会与现有设置合并）
   */
  async updateSettings(userId, settings) {
    if (!settings || typeof settings !== 'object') {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    return await notificationSettingModel.update(userId, settings)
  }
}

module.exports = new NotificationService()
