/**
 * 维护任务管理模块
 * 负责设备维护提醒、配件寿命预警、授权到期检查等定时任务
 *
 * 功能：
 * 1. 授权到期检查（30天内提醒，已过期警告）
 * 2. 配件寿命预警（寿命低于阈值时警告）
 * 3. 从系统配置读取执行间隔（maintenanceCheckInterval，单位小时）
 * 4. 配置变化时自动重启定时任务
 */

const dayjs = require('dayjs')

class MaintenanceTaskManager {
  constructor() {
    this.checkInterval = null
    this.partLifeStatInterval = null
    // 默认配置（会从系统配置中读取）
    this.defaultCheckIntervalHours = 24 // 默认24小时
    this.defaultPartLifeStatIntervalMinutes = 5 // 默认5分钟
    this.licenseExpiringDays = 30 // 授权即将到期提醒天数
  }

  /**
   * 初始化：从配置中读取参数启动定时任务
   */
  async init() {
    try {
      await this.startFromConfig()
      await this.startPartLifeStatsFromConfig()
      console.log('[MaintenanceTaskManager] 初始化完成')
    } catch (err) {
      console.error('[MaintenanceTaskManager] 初始化失败:', err.message)
    }
  }

  /**
   * 从系统配置中读取参数并启动定时任务
   */
  async startFromConfig() {
    try {
      const configService = require('../modules/config/config.service')
      const configs = await configService.getAllConfigs()

      // 查找维护检查间隔配置
      const checkIntervalConfig = configs.find(c => c.config_key === 'maintenanceCheckInterval')
      const checkIntervalHours = checkIntervalConfig ? Number(checkIntervalConfig.config_value) : this.defaultCheckIntervalHours
      const checkIntervalMs = checkIntervalHours * 60 * 60 * 1000

      this.startPeriodicCheck(checkIntervalMs)
    } catch (err) {
      console.error('[MaintenanceTaskManager] 从配置启动定时任务失败，使用默认值:', err.message)
      this.startPeriodicCheck(this.defaultCheckIntervalHours * 60 * 60 * 1000)
    }
  }

  /**
   * 重新从配置中读取参数并重启定时任务（配置变化时调用）
   */
  async restartFromConfig() {
    this.stopPeriodicCheck()
    this.stopPartLifeStats()
    await this.startFromConfig()
    await this.startPartLifeStatsFromConfig()
  }

  /**
   * 启动定期检查任务
   * @param {number} interval - 检查间隔（毫秒）
   */
  startPeriodicCheck(interval) {
    this.stopPeriodicCheck()

    const checkInterval = interval || this.defaultCheckIntervalHours * 60 * 60 * 1000

    this.checkInterval = setInterval(async () => {
      try {
        console.log('[MaintenanceTaskManager] 开始执行定期检查任务...')
        // 1. 授权到期检查
        await this.checkLicenseExpiry()
        // 2. 配件寿命预警
        await this.checkPartLifeWarning()
        console.log('[MaintenanceTaskManager] 定期检查任务执行完成')
      } catch (err) {
        console.error('[MaintenanceTaskManager] 定期检查失败:', err.message)
      }
    }, checkInterval)

    console.log(`[MaintenanceTaskManager] 定期检查已启动，间隔: ${checkInterval / (60 * 60 * 1000)} 小时`)
  }

  /**
   * 停止定期检查任务
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('[MaintenanceTaskManager] 定期检查已停止')
    }
  }

  // ==========================================
  // 使用寿命统计定时任务（间隔：partLifeStatInterval，单位分钟）
  // ==========================================

  /**
   * 从系统配置中读取参数并启动使用寿命统计定时任务
   */
  async startPartLifeStatsFromConfig() {
    try {
      const configService = require('../modules/config/config.service')
      const configs = await configService.getAllConfigs()

      // 查找使用寿命统计间隔配置
      const statIntervalConfig = configs.find(c => c.config_key === 'partLifeStatInterval')
      const statIntervalMinutes = statIntervalConfig ? Number(statIntervalConfig.config_value) : this.defaultPartLifeStatIntervalMinutes
      const statIntervalMs = statIntervalMinutes * 60 * 1000

      this.startPartLifeStats(statIntervalMs)
    } catch (err) {
      console.error('[MaintenanceTaskManager] 从配置启动使用寿命统计任务失败，使用默认值:', err.message)
      this.startPartLifeStats(this.defaultPartLifeStatIntervalMinutes * 60 * 1000)
    }
  }

  /**
   * 重新从配置中读取参数并重启使用寿命统计定时任务
   */
  async restartPartLifeStatsFromConfig() {
    this.stopPartLifeStats()
    await this.startPartLifeStatsFromConfig()
  }

  /**
   * 启动使用寿命统计定时任务
   * @param {number} interval - 统计间隔（毫秒）
   */
  startPartLifeStats(interval) {
    this.stopPartLifeStats()

    const statInterval = interval || this.defaultPartLifeStatIntervalMinutes * 60 * 1000

    this.partLifeStatInterval = setInterval(async () => {
      try {
        await this.updatePartLifeStats()
      } catch (err) {
        console.error('[MaintenanceTaskManager] 使用寿命统计失败:', err.message)
      }
    }, statInterval)

    console.log(`[MaintenanceTaskManager] 使用寿命统计任务已启动，间隔: ${statInterval / (60 * 1000)} 分钟`)
  }

  /**
   * 停止使用寿命统计定时任务
   */
  stopPartLifeStats() {
    if (this.partLifeStatInterval) {
      clearInterval(this.partLifeStatInterval)
      this.partLifeStatInterval = null
      console.log('[MaintenanceTaskManager] 使用寿命统计任务已停止')
    }
  }

  /**
   * 执行使用寿命统计
   * 从PLC数据中读取计数器，计算增量，更新部件使用寿命
   */
  async updatePartLifeStats() {
    try {
      console.log('[MaintenanceTaskManager] 开始执行使用寿命统计...')

      const devicePartService = require('../modules/device-part/device-part.service')
      const plcPollTask = require('../plc/task/PlcPollTask')

      // 从PLC轮询任务中获取最新的计数器数据
      const latestData = plcPollTask.getLatestData('default')
      
      const plcData = {}
      const tags = ['fillNeedleSuccessCount', 'fillMotorRotationCount', 'stopperSuccessCount', 'vacuumHoldSuccessCount']
      
      for (const tag of tags) {
        const value = latestData[tag]
        if (value !== null && value !== undefined) {
          plcData[tag] = Number(value)
        }
      }

      if (Object.keys(plcData).length === 0) {
        console.log('[MaintenanceTaskManager] 未获取到PLC计数器数据，跳过本次统计')
        return
      }

      console.log('[MaintenanceTaskManager] 获取到PLC计数器数据:', plcData)

      // 批量更新所有部件的使用寿命
      const results = await devicePartService.batchUpdateUsedLife(plcData)
      
      if (results.length > 0) {
        console.log(`[MaintenanceTaskManager] 使用寿命统计完成，更新了 ${results.length} 个部件`)
        results.forEach(r => {
          console.log(`  - 部件${r.part_id}: PLC值=${r.plc_value}, 增量=${r.increment}, 使用寿命=${r.old_used_life}→${r.new_used_life}, 状态=${r.status}`)
        })
      } else {
        console.log('[MaintenanceTaskManager] 使用寿命统计完成，无需更新的部件')
      }
    } catch (err) {
      console.error('[MaintenanceTaskManager] 使用寿命统计失败:', err.message)
    }
  }

  /**
   * 授权到期检查
   * 检查授权是否即将到期（30天内）或已过期，触发相应通知
   */
  async checkLicenseExpiry() {
    try {
      const fs = require('fs')
      const { LicenseGuard } = require('../../beehive/sdk')
      const licenseConfig = require('../config/license.config')
      const notification = require('../utils/notification')

      // 检查授权文件是否存在
      if (!fs.existsSync(licenseConfig.licensePath)) {
        console.log('[MaintenanceTaskManager] 授权文件不存在，跳过到期检查')
        return
      }

      // 创建授权验证实例
      const guard = new LicenseGuard({
        projectId: licenseConfig.projectId,
        publicKey: fs.readFileSync(licenseConfig.publicKeyPath, 'utf8'),
        licensePath: licenseConfig.licensePath,
        timeGuardPath: licenseConfig.timeGuardPath,
        licenseServerUrl: licenseConfig.licenseServerUrl,
        strictMode: licenseConfig.strictMode
      })

      // 验证授权
      const result = await guard.check()

      if (!result.valid || !result.licenseData) {
        console.log('[MaintenanceTaskManager] 授权无效，跳过到期检查')
        return
      }

      const licenseData = result.licenseData
      const expiresAt = licenseData.expiresAt
      const now = dayjs()
      const expireDate = dayjs(expiresAt)
      const daysUntilExpire = expireDate.diff(now, 'day')

      console.log(`[MaintenanceTaskManager] 授权到期检查: 到期时间=${expiresAt}, 剩余天数=${daysUntilExpire}`)

      // 授权已过期
      if (daysUntilExpire < 0) {
        console.log('[MaintenanceTaskManager] 授权已过期，触发通知')
        await notification.triggerNotification('license.expired', {
          expiresAt: expiresAt,
          expiredDays: Math.abs(daysUntilExpire)
        })
      }
      // 授权即将到期（30天内）
      else if (daysUntilExpire <= this.licenseExpiringDays) {
        console.log(`[MaintenanceTaskManager] 授权即将到期（${daysUntilExpire}天），触发通知`)
        await notification.triggerNotification('license.expiring', {
          expiresAt: expiresAt,
          daysLeft: daysUntilExpire
        })
      }
      // 授权正常
      else {
        console.log(`[MaintenanceTaskManager] 授权正常，剩余 ${daysUntilExpire} 天到期`)
      }
    } catch (err) {
      console.error('[MaintenanceTaskManager] 授权到期检查失败:', err.message)
    }
  }

  /**
   * 配件寿命预警检查
   * 检查配件寿命是否低于阈值，触发相应通知
   */
  async checkPartLifeWarning() {
    try {
      const configService = require('../modules/config/config.service')
      const notification = require('../utils/notification')
      const devicePartService = require('../modules/device-part/device-part.service')

      // 读取配件寿命提醒配置
      const configs = await configService.getAllConfigs()
      const reminderEnabled = configs.find(c => c.config_key === 'partLifeReminderEnabled')
      const thresholdConfig = configs.find(c => c.config_key === 'partLifeThreshold')

      // 检查是否启用了配件寿命提醒
      const isEnabled = reminderEnabled ? reminderEnabled.config_value === 'true' : true
      if (!isEnabled) {
        console.log('[MaintenanceTaskManager] 配件寿命提醒未启用，跳过检查')
        return
      }

      const threshold = thresholdConfig ? Number(thresholdConfig.config_value) : 20

      console.log(`[MaintenanceTaskManager] 配件寿命预警检查: 阈值=${threshold}%`)

      // 从部件寿命表中获取所有部件实例
      const parts = await devicePartService.getAllParts()
      console.log(`[MaintenanceTaskManager] 共检查 ${parts.length} 个部件`)

      // 筛选出寿命低于阈值的部件（剩余寿命百分比 <= threshold）
      const warningParts = parts.filter(part => {
        const remainingPercent = 100 - (part.life_percent || 0)
        return remainingPercent <= threshold
      })

      if (warningParts.length > 0) {
        console.log(`[MaintenanceTaskManager] 发现 ${warningParts.length} 个部件寿命低于阈值，触发通知`)
        
        // 逐个触发通知（也可以合并成一个通知）
        for (const part of warningParts) {
          await notification.triggerNotification('device.part.life.warning', {
            part_code: part.part_code,
            template_key: part.template_key,
            used_life: part.used_life,
            rated_life: part.rated_life,
            life_percent: part.life_percent,
            remaining_life: part.remaining_life,
            threshold: threshold
          })
        }
      } else {
        console.log('[MaintenanceTaskManager] 所有部件寿命正常')
      }

      console.log('[MaintenanceTaskManager] 配件寿命预警检查完成')
    } catch (err) {
      console.error('[MaintenanceTaskManager] 配件寿命预警检查失败:', err.message)
    }
  }
}

module.exports = new MaintenanceTaskManager()
