/**
 * 用户在线设备模块 - 控制器层
 *
 * 负责参数接收、调用 Service 层、返回统一响应
 * 提供查询在线设备列表、踢掉指定设备、删除离线设备等接口
 */
const BaseController = require('../../controllers/BaseController')
const userDeviceService = require('./userDevice.service')
const userModel = require('./user.model')
const notificationService = require('../notification/notification.service')
const wsManager = require('../../socket/wsManager')

class UserDeviceController extends BaseController {
  constructor() {
    super(userDeviceService)
  }

  /**
   * 查询当前用户的在线设备列表
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getMyDevices(req, res) {
    const list = await userDeviceService.getOnlineDevices(req.user.id)
    res.success(list)
  }

  /**
   * 查询所有用户的在线设备列表（管理员）
   * @param {Object} req - Express 请求对象
   * @param {Object} req.query - 查询参数
   * @param {number} [req.query.page=1] - 页码
   * @param {number} [req.query.pageSize=20] - 每页数量
   * @param {number} [req.query.userId] - 用户ID筛选
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getAllDevices(req, res) {
    const result = await userDeviceService.getAllOnlineDevices(req.query)
    res.success(result)
  }

  /**
   * 获取系统在线设备总数
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getOnlineCount(req, res) {
    const count = await userDeviceService.getTotalOnlineDeviceCount()
    res.success({ count })
  }

  /**
   * 踢掉指定设备（管理员操作）
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 设备记录ID
   * @param {Object} req.user - 当前登录用户信息（操作人）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async kickDevice(req, res) {
    const deviceId = Number(req.params.id)
    const operator = {
      id: req.user.id,
      username: req.user.username
    }

    // 踢掉设备
    const device = await userDeviceService.kickDevice(deviceId, operator)

    // 推送通知给被踢的用户
    try {
      await notificationService.sendNotification({
        userId: device.user_id,
        titleKey: 'notification.deviceKickedTitle',
        contentKey: 'notification.deviceKickedContent',
        contentParams: JSON.stringify({
          deviceName: device.device_name || '未知设备',
          operator: operator.username,
          time: new Date().toISOString()
        }),
        type: 'security',
        priority: 'high'
      })
    } catch (err) {
      console.error('[设备管理] 推送被踢通知失败:', err.message)
    }

    // 推送通知给所有管理员（操作日志）
    try {
      const adminUserIds = await userModel.getAdminUserIds()
      if (adminUserIds.length > 0) {
        await notificationService.sendBatchNotifications(adminUserIds, {
          titleKey: 'notification.deviceKickedAdminTitle',
          contentKey: 'notification.deviceKickedAdminContent',
          contentParams: JSON.stringify({
            operator: operator.username,
            deviceName: device.device_name || '未知设备',
            userId: device.user_id,
            time: new Date().toISOString()
          }),
          type: 'security',
          priority: 'normal'
        })
      }
    } catch (err) {
      console.error('[设备管理] 推送管理员通知失败:', err.message)
    }

    res.success(null, '设备已踢下线')
  }

  /**
   * 删除离线设备（管理员操作）
   * 注意：只能删除离线状态的设备，在线设备需要先踢下线再删除
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 设备记录ID
   * @param {Object} req.user - 当前登录用户信息（操作人）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async deleteDevice(req, res) {
    const deviceId = Number(req.params.id)
    const operator = {
      id: req.user.id,
      username: req.user.username
    }

    // 删除设备
    const device = await userDeviceService.deleteDevice(deviceId, operator)

    res.success(null, '设备已删除')
  }

  /**
   * 手动刷新设备状态（管理员操作）
   * 立即执行一次设备状态检查和清理
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {number} [req.body.offlineThreshold] - 离线阈值（毫秒），不传则使用默认值
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async refreshDeviceStatus(req, res) {
    const deviceStatusManager = require('../../socket/deviceStatusManager')
    const offlineThreshold = req.body?.offlineThreshold
    const result = await deviceStatusManager.checkAndCleanOfflineDevices(offlineThreshold)
    res.success(result, '设备状态已刷新')
  }
}

module.exports = new UserDeviceController()
