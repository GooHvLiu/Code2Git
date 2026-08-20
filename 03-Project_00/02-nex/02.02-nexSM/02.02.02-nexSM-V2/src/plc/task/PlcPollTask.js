/**
 * PLC 轮询采集任务（多设备版）
 *
 * 特性：
 * - 支持多设备同时轮询
 * - 批量读取优化（连续寄存器合并请求）
 * - fast/slow 分组轮询
 * - 只推送变化的数据
 * - 断线自动重连
 * - 断线期间数据缓存，恢复后补传
 * - 数据持久化
 * - 告警规则评估
 */
const _ = require('lodash')
const plcManager = require('../manager/PlcManager')
const plcStorage = require('../storage/PlcDataStorage')
const plcAlarm = require('../alarm/PlcAlarmEngine')
const { withTimeout, DEFAULT_TIMEOUTS } = require('../utils/withTimeout')

class PlcPollTask {
  constructor() {
    this.timers = new Map() // deviceName -> { fastTimer, slowTimer }
    this.lastValues = new Map() // deviceName -> { tag: value }
    this.onDataChangeCallback = null
    this.maxConsecutiveErrors = 3
    this.reconnectDelay = 3000
  }

  setCallback(fn) {
    this.onDataChangeCallback = fn
  }

  /**
   * 轮询单个设备的一组点位
   */
  async pollDevice(deviceName, rateType) {
    const device = plcManager.getDevice(deviceName)
    const tags = device.tagMap.filter(t => t.rate === rateType)
    if (tags.length === 0) return

    const changed = {}
    let hasError = false

    try {
      // 批量读取（协议层自动优化连续寄存器）
      const values = await withTimeout(
        device.client.readTags(tags),
        DEFAULT_TIMEOUTS.readBatch + 2000,
        `设备 ${deviceName} 轮询读取超时`
      )

      for (const tagItem of tags) {
        const val = values[tagItem.tag]
        if (val === null || val === undefined) {
          hasError = true
          continue
        }

        const lastVal = this.lastValues.get(deviceName)?.[tagItem.tag]
        if (!_.isEqual(lastVal, val)) {
          changed[tagItem.tag] = val
        }
      }

      // 更新缓存
      if (!this.lastValues.has(deviceName)) this.lastValues.set(deviceName, {})
      Object.assign(this.lastValues.get(deviceName), values)

      // 数据持久化
      plcStorage.storeBatch(deviceName, values)

      // 告警评估
      const alarms = plcAlarm.evaluate(deviceName, values)
      if (alarms.length > 0 && this.onDataChangeCallback) {
        this.onDataChangeCallback({ device: deviceName, type: 'alarm', alarms })
      }

      // 重置错误计数
      device.consecutiveErrors = 0
      device.lastError = null
    } catch (err) {
      hasError = true
      device.lastError = err.message
      console.warn(`[PLC] 设备 ${deviceName} 轮询失败:`, err.message)
    }

    // 错误计数与重连
    if (hasError) {
      device.consecutiveErrors++
      if (device.consecutiveErrors >= this.maxConsecutiveErrors) {
        this._reconnect(deviceName)
      }
    }

    // 推送变化数据
    if (Object.keys(changed).length > 0 && this.onDataChangeCallback) {
      this.onDataChangeCallback({
        device: deviceName,
        type: 'data',
        data: changed,
        timestamp: Date.now()
      })
    }
  }

  /**
   * 重连设备
   */
  async _reconnect(deviceName) {
    const device = plcManager.getDevice(deviceName)
    if (device._reconnecting) return
    device._reconnecting = true

    console.log(`[PLC] 设备 ${deviceName} 连续失败，开始重连...`)
    try {
      await device.client.disconnect()
      await device.client.connect()
      device.consecutiveErrors = 0
      device.connected = true
      console.log(`[PLC] 设备 ${deviceName} 重连成功`)
    } catch (err) {
      console.error(`[PLC] 设备 ${deviceName} 重连失败:`, err.message)
      setTimeout(() => {
        device._reconnecting = false
      }, this.reconnectDelay)
      return
    }
    device._reconnecting = false
  }

  /**
   * 启动所有设备的轮询
   */
  start() {
    const deviceNames = plcManager.getDeviceNames()
    for (const name of deviceNames) {
      this.startDevice(name)
    }
    // 启动数据持久化
    plcStorage.start()
    console.log(`[PLC] 轮询任务已启动，设备数: ${deviceNames.length}`)
  }

  /**
   * 启动单个设备的轮询
   */
  startDevice(deviceName) {
    const device = plcManager.getDevice(deviceName)
    const fastMs = device.config.poll?.fastInterval || 200
    const slowMs = device.config.poll?.slowInterval || 1000

    const fastTimer = setInterval(() => {
      this.pollDevice(deviceName, 'fast').catch(() => {})
    }, fastMs)

    const slowTimer = setInterval(() => {
      this.pollDevice(deviceName, 'slow').catch(() => {})
    }, slowMs)

    this.timers.set(deviceName, { fastTimer, slowTimer })
    console.log(`[PLC] 设备 ${deviceName} 轮询已启动 (fast: ${fastMs}ms, slow: ${slowMs}ms)`)
  }

  /**
   * 停止所有设备轮询
   */
  async stop() {
    for (const name of this.timers.keys()) {
      this.stopDevice(name)
    }
    await plcStorage.stop()
    console.log('[PLC] 轮询任务已停止')
  }

  /**
   * 停止单个设备轮询
   */
  stopDevice(deviceName) {
    const timers = this.timers.get(deviceName)
    if (timers) {
      clearInterval(timers.fastTimer)
      clearInterval(timers.slowTimer)
      this.timers.delete(deviceName)
    }
  }

  /** 获取设备最新数据 */
  getLatestData(deviceName) {
    return this.lastValues.get(deviceName) || {}
  }
}

module.exports = new PlcPollTask()
module.exports.PlcPollTask = PlcPollTask
