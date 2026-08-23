/**
 * ==========================================
 * PLC 轮询采集任务（重写版）
 * ==========================================
 *
 * 核心功能：
 * 1. 正常通讯：定时轮询 PLC 数据
 * 2. 自动重连：中途断开后持续尝试，直到连接成功
 * 3. 状态通知：PLC 连接状态变化时通知所有前端用户
 *
 * 设计原则：
 * - 连接管理与轮询分离，职责清晰
 * - 状态机模式：connected → disconnected → reconnecting → connected
 * - 指数退避重连：3s → 6s → 12s → ... → 最大 60s
 * - 无死锁：重连时不调用 disconnect()，直接调用 connect()（内部自动清理）
 */

const _ = require('lodash')
const plcManager = require('../manager/PlcManager')
const plcStorage = require('../storage/PlcDataStorage')
const plcAlarm = require('../alarm/PlcAlarmEngine')
const { withTimeout, DEFAULT_TIMEOUTS } = require('../utils/withTimeout')

/**
 * PLC 轮询任务管理器
 */
class PlcPollTask {
  constructor() {
    // 定时器：deviceName -> { fastTimer, slowTimer }
    this.timers = new Map()
    // 最新数据缓存：deviceName -> { tag: value }
    this.lastValues = new Map()
    // 数据变化回调
    this.onDataChangeCallback = null

    // ========== 重连配置 ==========
    // 连续失败多少次后触发重连
    this.maxConsecutiveErrors = 3
    // 初始重连延迟（毫秒）
    this.reconnectDelay = 3000
    // 最大重连延迟（毫秒）
    this.maxReconnectDelay = 60000
  }

  /**
   * 设置数据变化回调
   */
  setCallback(fn) {
    this.onDataChangeCallback = fn
  }

  // ==========================================
  // 一、连接状态管理
  // ==========================================

  /**
   * 更新设备连接状态，并通知前端
   * @param {string} deviceName - 设备名称
   * @param {boolean} connected - 是否已连接
   */
  updateConnectionStatus(deviceName, connected) {
    const device = plcManager.getDevice(deviceName)
    if (!device) return

    // 状态未变化则不通知
    if (device.connected === connected) return

    device.connected = connected
    console.log(`[PLC] 设备 ${deviceName} 连接状态: ${connected ? '已连接 ✓' : '已断开 ✗'}`)

    // 通知所有前端用户
    plcManager.notifyPlcStatusChanged(plcManager.isAllConnected(), deviceName)
  }

  // ==========================================
  // 二、自动重连机制
  // ==========================================

  /**
   * 开始重连流程（持续尝试直到成功）
   * @param {string} deviceName - 设备名称
   */
  startReconnect(deviceName) {
    const device = plcManager.getDevice(deviceName)
    if (!device) return

    // 已经在重连中，不重复启动
    if (device._reconnecting) return

    device._reconnecting = true
    device._reconnectAttempts = 0
    console.log(`[PLC] 设备 ${deviceName} 启动自动重连流程`)

    this._doReconnect(deviceName)
  }

  /**
   * 执行一次重连尝试，失败则自动调度下一次
   * @param {string} deviceName - 设备名称
   */
  async _doReconnect(deviceName) {
    const device = plcManager.getDevice(deviceName)
    if (!device) return

    device._reconnectAttempts++
    console.log(`[PLC] 设备 ${deviceName} 第 ${device._reconnectAttempts} 次重连尝试...`)

    try {
      // 等待一小段时间，确保 Modbus Slave 准备好接受新连接
      await this._sleep(500)

      // 直接调用 connect()，不调用 disconnect()
      // 原因：connect() 内部会先关闭旧连接再创建新连接
      // 直接调用 disconnect() 可能导致 PLC 锁死锁
      // 注意：给 connect() 整体加上超时保护，防止内部 close() 卡住导致永远等待
      console.log(`[PLC] 设备 ${deviceName} 正在连接...`)
      await withTimeout(
        device.client.connect(),
        15000,
        `设备 ${deviceName} 连接超时（15秒）`
      )

      // 重连成功
      device._reconnecting = false
      device._reconnectAttempts = 0
      device.consecutiveErrors = 0
      console.log(`[PLC] 设备 ${deviceName} 重连成功 ✓`)
      this.updateConnectionStatus(deviceName, true)
    } catch (err) {
      // 重连失败，调度下一次
      console.error(`[PLC] 设备 ${deviceName} 重连失败 ✗:`, err.message)
      this.updateConnectionStatus(deviceName, false)

      // 指数退避计算延迟
      const delay = Math.min(
        this.reconnectDelay * Math.pow(2, device._reconnectAttempts - 1),
        this.maxReconnectDelay
      )
      console.log(`[PLC] 设备 ${deviceName} ${(delay / 1000).toFixed(0)} 秒后继续重连...`)

      // 调度下一次重连
      setTimeout(() => {
        this._doReconnect(deviceName)
      }, delay)
    }
  }

  // ==========================================
  // 三、轮询任务
  // ==========================================

  /**
   * 轮询单个设备的一组点位
   * @param {string} deviceName - 设备名称
   * @param {string} rateType - 速率类型 ('fast' | 'slow')
   */
  async pollDevice(deviceName, rateType) {
    const device = plcManager.getDevice(deviceName)
    if (!device) return

    // 正在重连中，跳过轮询
    if (device._reconnecting) return

    // 初始化错误计数
    if (typeof device.consecutiveErrors !== 'number') {
      device.consecutiveErrors = 0
    }

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

      // 解析数据，检测变化
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
    } catch (err) {
      hasError = true
      device.lastError = err.message
      console.warn(`[PLC] 设备 ${deviceName} 轮询失败:`, err.message)
    }

    // ========== 错误处理与重连触发 ==========
    if (hasError) {
      device.consecutiveErrors++

      // 更新连接状态为未连接
      this.updateConnectionStatus(deviceName, false)

      // 达到错误阈值，启动重连流程
      if (device.consecutiveErrors >= this.maxConsecutiveErrors && !device._reconnecting) {
        console.log(`[PLC] 设备 ${deviceName} 连续失败 ${device.consecutiveErrors} 次，启动重连`)
        this.startReconnect(deviceName)
      }
    } else {
      // 轮询成功，重置错误计数
      device.consecutiveErrors = 0
      device.lastError = null

      // 更新连接状态为已连接
      this.updateConnectionStatus(deviceName, true)
    }

    // ========== 推送变化数据 ==========
    if (Object.keys(changed).length > 0 && this.onDataChangeCallback) {
      this.onDataChangeCallback({
        device: deviceName,
        type: 'data',
        data: changed,
        timestamp: Date.now()
      })
    }
  }

  // ==========================================
  // 四、定时器管理
  // ==========================================

  /**
   * 启动所有设备的轮询
   */
  start() {
    const deviceNames = plcManager.getDeviceNames()
    for (const name of deviceNames) {
      this.startDevice(name)
    }
    plcStorage.start()
    console.log(`[PLC] 轮询任务已启动，设备数: ${deviceNames.length}`)
  }

  /**
   * 启动单个设备的轮询
   * @param {string} deviceName - 设备名称
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
   * @param {string} deviceName - 设备名称
   */
  stopDevice(deviceName) {
    const timers = this.timers.get(deviceName)
    if (timers) {
      clearInterval(timers.fastTimer)
      clearInterval(timers.slowTimer)
      this.timers.delete(deviceName)
    }
  }

  // ==========================================
  // 五、工具方法
  // ==========================================

  /**
   * 获取设备最新数据
   * @param {string} deviceName - 设备名称
   * @returns {Object} 最新数据
   */
  getLatestData(deviceName) {
    return this.lastValues.get(deviceName) || {}
  }

  /**
   * 休眠指定毫秒数
   * @param {number} ms - 毫秒数
   * @returns {Promise<void>}
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = new PlcPollTask()
module.exports.PlcPollTask = PlcPollTask
