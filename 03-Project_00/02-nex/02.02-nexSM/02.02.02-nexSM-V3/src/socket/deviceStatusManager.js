/**
 * 设备状态管理模块
 * 负责设备在线状态的检查、清理和统计
 *
 * 功能：
 * 1. 服务端启动时清理所有设备状态
 * 2. 定期检查并清理离线设备
 * 3. 手动刷新设备状态
 * 4. 获取设备状态统计
 */

const userDeviceService = require('../modules/user/userDevice.service')

class DeviceStatusManager {
  constructor() {
    this.checkInterval = null
    // 默认配置（会从系统配置中读取）
    this.defaultCheckInterval = 300000 // 5分钟，单位毫秒
    this.defaultOfflineThreshold = 600000 // 10分钟，单位毫秒
  }

  /**
   * 初始化：服务端启动时清理所有设备状态，并从配置中读取参数启动定时任务
   */
  async init() {
    try {
      await this.cleanAllDevices()
      console.log('[DeviceStatusManager] 服务端启动，已清理所有设备状态')
      // 从配置中读取参数并启动定时任务
      await this.startFromConfig()
    } catch (err) {
      console.error('[DeviceStatusManager] 初始化失败:', err.message)
    }
  }

  /**
   * 从系统配置中读取参数并启动定时任务
   */
  async startFromConfig() {
    try {
      const configService = require('../modules/config/config.service')
      const configs = await configService.getAllConfigs()
      
      // 查找配置项
      const checkIntervalConfig = configs.find(c => c.config_key === 'deviceStatusCheckInterval')
      const offlineThresholdConfig = configs.find(c => c.config_key === 'deviceOfflineThreshold')
      
      const checkInterval = checkIntervalConfig ? Number(checkIntervalConfig.config_value) * 1000 : this.defaultCheckInterval
      const offlineThreshold = offlineThresholdConfig ? Number(offlineThresholdConfig.config_value) * 1000 : this.defaultOfflineThreshold
      
      this.startPeriodicCheck(checkInterval, offlineThreshold)
    } catch (err) {
      console.error('[DeviceStatusManager] 从配置启动定时任务失败，使用默认值:', err.message)
      this.startPeriodicCheck(this.defaultCheckInterval, this.defaultOfflineThreshold)
    }
  }

  /**
   * 重新从配置中读取参数并重启定时任务（配置变化时调用）
   */
  async restartFromConfig() {
    this.stopPeriodicCheck()
    await this.startFromConfig()
  }

  /**
   * 清理所有设备状态（设置为离线）
   * 服务端启动时调用
   */
  async cleanAllDevices() {
    try {
      await userDeviceService.setAllDevicesOffline()
      return true
    } catch (err) {
      console.error('[DeviceStatusManager] 清理所有设备状态失败:', err.message)
      throw err
    }
  }

  /**
   * 检查并清理离线设备
   * 定时任务和手动刷新时调用
   * @param {number} offlineThreshold - 离线阈值（毫秒），超过此时间未活跃则视为离线
   * @returns {Promise<Object>} 清理结果 { cleanedCount, onlineCount, offlineCount }
   */
  async checkAndCleanOfflineDevices(offlineThreshold) {
    try {
      const threshold = offlineThreshold || this.defaultOfflineThreshold
      const result = await userDeviceService.cleanOfflineDevices(threshold)
      console.log(`[DeviceStatusManager] 检查完成，清理离线设备: ${result.cleanedCount} 台，在线: ${result.onlineCount} 台，离线: ${result.offlineCount} 台`)
      return result
    } catch (err) {
      console.error('[DeviceStatusManager] 检查并清理离线设备失败:', err.message)
      throw err
    }
  }

  /**
   * 获取设备状态统计
   * @returns {Promise<Object>} 统计信息 { total, online, offline, onlineUsers }
   */
  async getDeviceStatusSummary() {
    try {
      const summary = await userDeviceService.getDeviceStatusSummary()
      return summary
    } catch (err) {
      console.error('[DeviceStatusManager] 获取设备状态统计失败:', err.message)
      throw err
    }
  }

  /**
   * 启动定期检查任务
   * @param {number} interval - 检查间隔（毫秒）
   * @param {number} offlineThreshold - 离线阈值（毫秒）
   */
  startPeriodicCheck(interval, offlineThreshold) {
    this.stopPeriodicCheck()

    const checkInterval = interval || this.defaultCheckInterval
    const threshold = offlineThreshold || this.defaultOfflineThreshold

    this.checkInterval = setInterval(async () => {
      try {
        await this.checkAndCleanOfflineDevices(threshold)
      } catch (err) {
        console.error('[DeviceStatusManager] 定期检查失败:', err.message)
      }
    }, checkInterval)

    console.log(`[DeviceStatusManager] 定期检查已启动，间隔: ${checkInterval / 1000} 秒，离线阈值: ${threshold / 1000} 秒`)
  }

  /**
   * 停止定期检查任务
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('[DeviceStatusManager] 定期检查已停止')
    }
  }

  /**
   * 重新启动定期检查任务（配置变化时调用）
   * @param {number} interval - 检查间隔（毫秒）
   * @param {number} offlineThreshold - 离线阈值（毫秒）
   */
  restartPeriodicCheck(interval, offlineThreshold) {
    this.stopPeriodicCheck()
    this.startPeriodicCheck(interval, offlineThreshold)
  }
}

module.exports = new DeviceStatusManager()
