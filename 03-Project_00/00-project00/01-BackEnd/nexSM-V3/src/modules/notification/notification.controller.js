/**
 * 通知中心模块 - 控制器层
 * 
 * 负责参数接收、调用 Service 层、返回统一响应
 * 用户只能查看和操作自己的通知
 * 继承 BaseController，复用通用 CRUD 接口
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseController = require('../../controllers/BaseController')
const notificationService = require('./notification.service')

class NotificationController extends BaseController {
  /**
   * 构造函数
   * 初始化 BaseController，传入通知 Service 实例
   */
  constructor() {
    super(notificationService)
  }

  // ==================== 特殊功能接口 ====================

  /**
   * 获取通知列表
   * 
   * 用户只能查看自己的通知
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} req.query - 查询参数
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getList(req, res) {
    const result = await notificationService.getNotificationList(req.user.id, req.query)
    res.success(result)
  }

  /**
   * 获取未读通知数量
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getUnreadCount(req, res) {
    const result = await notificationService.getUnreadCount(req.user.id)
    res.success(result)
  }

  /**
   * 获取通知详情
   * 
   * 查看时自动标记为已读
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 通知 ID
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getDetail(req, res) {
    const result = await notificationService.getNotificationById(req.params.id, req.user.id)
    res.success(result)
  }

  /**
   * 标记通知为已读
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 通知 ID
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async markAsRead(req, res) {
    await notificationService.markAsRead(req.params.id, req.user.id)
    res.success(null, '标记成功')
  }

  /**
   * 全部标记为已读
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async markAllAsRead(req, res) {
    await notificationService.markAllAsRead(req.user.id)
    res.success(null, '全部标记成功')
  }

  /**
   * 删除通知
   * 
   * 用户只能删除自己的通知
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 通知 ID
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async delete(req, res) {
    await notificationService.deleteNotification(req.params.id, req.user.id)
    res.success(null, '删除成功')
  }

  /**
   * 创建并推送通知（测试/系统内部调用）
   * 
   * Body: { userId, title, content, type, priority, link }
   * 或 { broadcast: true, title, content, type, priority } 给所有在线用户推送
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {number} [req.body.userId] - 接收用户 ID
   * @param {string} req.body.title - 通知标题
   * @param {string} req.body.content - 通知内容
   * @param {string} [req.body.type='system'] - 通知类型
   * @param {string} [req.body.priority='normal'] - 优先级
   * @param {string} [req.body.link=''] - 跳转链接
   * @param {boolean} [req.body.broadcast=false] - 是否广播给所有在线用户
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async create(req, res) {
    const { userId, title, content, type, priority, link, broadcast } = req.body

    if (!title || !content) {
      return res.error('标题和内容不能为空')
    }

    if (broadcast) {
      // 广播：给所有在线用户推送（不保存到数据库）
      const wsManager = require('../../socket/wsManager')
      wsManager.broadcast({
        type: 'notification',
        data: { title, content, type: type || 'system', priority: priority || 'normal', created_at: new Date().toISOString() }
      })
      return res.success(null, '广播推送成功')
    }

    if (!userId) {
      return res.error('userId 不能为空（或使用 broadcast: true 广播）')
    }

    const result = await notificationService.sendNotification({
      userId,
      title,
      content,
      type: type || 'system',
      priority: priority || 'normal',
      link: link || ''
    })

    res.success({ id: result.insertId }, '通知发送成功')
  }
}

module.exports = new NotificationController()
