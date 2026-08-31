/**
 * 用户在线设备模块 - 业务逻辑层
 *
 * 用于客户端授权（限制在线人数）和设备管理
 * 提供查询在线设备数、记录设备信息、更新设备状态、踢掉设备等业务逻辑
 */
const BaseService = require('../../services/BaseService')
const userDeviceModel = require('./userDevice.model')
const wsManager = require('../../socket/wsManager')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class UserDeviceService extends BaseService {
  constructor() {
    super(userDeviceModel, {
      name: '设备',
      langFields: []
    })
  }

  /**
   * 获取用户的在线设备数
   * @param {number} userId - 用户ID
   * @returns {Promise<number>} 在线设备数
   */
  async getOnlineDeviceCount(userId) {
    return await userDeviceModel.getOnlineDeviceCount(userId)
  }

  /**
   * 获取整个系统的在线设备总数（所有用户）
   * @returns {Promise<number>} 在线设备总数
   */
  async getTotalOnlineDeviceCount() {
    return await userDeviceModel.getTotalOnlineDeviceCount()
  }

  /**
   * 获取用户的在线设备列表
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 在线设备列表
   */
  async getOnlineDevices(userId) {
    return await userDeviceModel.getOnlineDevices(userId)
  }

  /**
   * 获取所有用户的在线设备列表（管理员）
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getAllOnlineDevices(params = {}) {
    return await userDeviceModel.getAllOnlineDevices(params)
  }

  /**
   * 记录或更新设备信息（登录时调用）
   * @param {Object} deviceInfo - 设备信息
   * @returns {Promise<Object>} 设备记录
   */
  async upsertDevice(deviceInfo) {
    return await userDeviceModel.upsertDevice(deviceInfo)
  }

  /**
   * 更新设备最后活跃时间（心跳时调用）
   * @param {number} userId - 用户ID
   * @param {string} deviceId - 设备ID
   * @returns {Promise<void>}
   */
  async updateLastActiveTime(userId, deviceId) {
    await userDeviceModel.updateLastActiveTime(userId, deviceId)
  }

  /**
   * 设置设备离线（WebSocket断开时调用）
   * @param {number} userId - 用户ID
   * @param {string} deviceId - 设备ID
   * @returns {Promise<void>}
   */
  async setDeviceOffline(userId, deviceId) {
    await userDeviceModel.setDeviceOffline(userId, deviceId)
  }

  /**
   * 把设备设置为离线
   * @param {number} [userId] - 用户ID（可选，不传则清理所有用户的设备）
   * @returns {Promise<void>}
   */
  async setAllDevicesOffline(userId) {
    await userDeviceModel.setAllDevicesOffline(userId)
  }

  /**
   * 检查并清理离线设备
   * 根据最后活跃时间阈值，把超时的设备设置为离线
   * @param {number} thresholdMs - 离线阈值（毫秒）
   * @returns {Promise<Object>} 清理结果 { cleanedCount, online, offline, total, onlineUsers }
   */
  async cleanOfflineDevices(thresholdMs) {
    const cleanedCount = await userDeviceModel.markOfflineDevicesByThreshold(thresholdMs)
    const summary = await userDeviceModel.getDeviceStatusSummary()
    return {
      cleanedCount,
      ...summary
    }
  }

  /**
   * 获取设备状态统计
   * @returns {Promise<Object>} { total, online, offline, onlineUsers }
   */
  async getDeviceStatusSummary() {
    return await userDeviceModel.getDeviceStatusSummary()
  }

  /**
   * 踢掉指定设备（管理员操作）
   * @param {number} id - 设备记录ID
   * @param {Object} operator - 操作人信息
   * @param {number} operator.id - 操作人ID
   * @param {string} operator.username - 操作人用户名
   * @returns {Promise<void>}
   * @throws {BusinessError} 设备不存在
   */
  async kickDevice(id, operator) {
    const device = await userDeviceModel.getById(id)
    if (!device) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, '设备不存在', { name: '设备' })
    }

    // 通过 device_id 找到对应的 WebSocket 连接，推送 kicked_out 消息
    try {
      const connections = wsManager.userConnections.get(device.user_id)
      if (connections && connections.length > 0) {
        connections.forEach(ws => {
          if (ws.deviceId === device.device_id && ws.readyState === 1) {
            ws.send(JSON.stringify({
              type: 'kicked_out',
              message: '您已被管理员踢下线',
              data: {
                reason: 'admin_kick',
                operator: operator.username,
                deviceId: device.device_id,
                deviceName: device.device_name
              }
            }))
          }
        })
      }
    } catch (err) {
      console.error('[设备管理] 推送踢下线消息失败:', err.message)
    }

    // 更新设备状态为离线
    await userDeviceModel.kickDevice(id)

    return device
  }

  /**
   * 检查用户是否可以登录（整个系统在线设备数是否达到上限）
   * @param {number} maxDevices - 最大在线设备数（0表示不限制）
   * @returns {Promise<{allowed: boolean, currentCount: number, maxDevices: number}>}
   */

  /**
   * 删除离线设备（管理员操作）
   * 注意：只能删除离线状态的设备，在线设备需要先踢下线再删除
   * @param {number} id - 设备记录ID
   * @param {Object} operator - 操作人信息
   * @param {number} operator.id - 操作人ID
   * @param {string} operator.username - 操作人用户名
   * @returns {Promise<Object>} 被删除的设备信息
   * @throws {BusinessError} 设备不存在 / 设备在线，无法删除
   */
  async deleteDevice(id, operator) {
    const device = await userDeviceModel.getById(id)
    if (!device) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, '设备不存在', { name: '设备' })
    }

    // 检查设备是否在线
    if (device.status === 1) {
      throw new BusinessError(ERROR_CODE.BAD_REQUEST, '设备在线，无法删除，请先踢下线', { name: '设备' })
    }

    // 删除设备记录
    await userDeviceModel.delete(id)

    console.log(`[设备管理] 管理员 ${operator.username} 删除了离线设备 ${device.device_name || device.device_id}`)

    return device
  }

  /**
   * 检查用户是否可以登录（整个系统在线设备数是否达到上限）
   * @param {number} maxDevices - 最大在线设备数（0表示不限制）
   * @param {number} [excludeUserId] - 要排除的用户ID（当前正在登录的用户，其旧设备马上会被踢掉）
   * @returns {Promise<{allowed: boolean, currentCount: number, maxDevices: number}>}
   */
  async checkLoginAllowed(maxDevices, excludeUserId = null) {
    // 如果指定了排除用户，则排除该用户的设备（因为该用户的旧设备马上会被单点登录踢掉）
    let currentCount
    if (excludeUserId) {
      currentCount = await userDeviceModel.getTotalOnlineDeviceCountExcludeUser(excludeUserId)
    } else {
      currentCount = await this.getTotalOnlineDeviceCount()
    }

    // maxDevices 为 0 或未配置，表示不限制
    if (!maxDevices || maxDevices <= 0) {
      return { allowed: true, currentCount, maxDevices: 0 }
    }


    return {
      allowed: currentCount < maxDevices,
      currentCount,
      maxDevices
    }
  }
}

module.exports = new UserDeviceService()
