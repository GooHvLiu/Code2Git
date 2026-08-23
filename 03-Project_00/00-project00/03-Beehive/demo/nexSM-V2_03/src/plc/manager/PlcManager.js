/**
 * PLC 多设备管理器
 * 管理多台 PLC 设备的连接、读写、状态监控
 *
 * 特性：
 * - 支持多台 PLC 同时在线
 * - 按设备名隔离点位配置
 * - 统一的读写接口
 * - 自动重连
 * - 健康检查
 */
const ModbusTcpClient = require('../protocols/ModbusTcpClient')
const S7Client = require('../protocols/S7Client')
const OpcUaClient = require('../protocols/OpcUaClient')

// 协议类映射
const PROTOCOL_MAP = {
  ModbusTcp: ModbusTcpClient,
  S7: S7Client,
  OpcUa: OpcUaClient
}

class PlcManager {
  constructor() {
    this.devices = new Map() // deviceName -> { client, config, tagMap, pollTask }
    this.dataCache = new Map() // deviceName -> { tag: value }
    this.onDataChangeCallback = null
  }

  /**
   * 注册设备
   * @param {string} name 设备名称（唯一标识）
   * @param {Object} config 设备配置 { protocol, connection, poll, ... }
   * @param {Array} tagMap 点位映射表
   */
  registerDevice(name, config, tagMap = []) {
    if (this.devices.has(name)) {
      throw new Error(`设备 ${name} 已注册`)
    }

    // 兼容 protocol 和 activeProtocol 两种字段名
    const protocol = config.protocol || config.activeProtocol
    const ProtocolClass = PROTOCOL_MAP[protocol]
    if (!ProtocolClass) {
      throw new Error(`不支持的协议: ${protocol}，可选: ${Object.keys(PROTOCOL_MAP).join(', ')}`)
    }

    // 确保 config 中有 protocol 字段（子类可能用到）
    const deviceConfig = { ...config, protocol }

    const client = new ProtocolClass(deviceConfig)
    this.devices.set(name, {
      client,
      config: deviceConfig,
      tagMap,
      connected: false,
      lastError: null,
      consecutiveErrors: 0
    })
    this.dataCache.set(name, {})

    return client
  }

  /** 移除设备 */
  async removeDevice(name) {
    const device = this.devices.get(name)
    if (device) {
      try { await device.client.disconnect() } catch (e) { /* ignore */ }
      this.devices.delete(name)
      this.dataCache.delete(name)
    }
  }

  /** 获取设备实例 */
  getDevice(name) {
    const device = this.devices.get(name)
    if (!device) throw new Error(`设备 ${name} 未注册`)
    return device
  }

  /** 获取设备客户端 */
  getClient(name) {
    return this.getDevice(name).client
  }

  /** 连接所有设备 */
  async connectAll() {
    const results = {}
    for (const [name, device] of this.devices) {
      try {
        await device.client.connect()
        device.connected = true
        device.consecutiveErrors = 0
        results[name] = { success: true }
      } catch (err) {
        device.connected = false
        device.lastError = err.message
        device.consecutiveErrors++
        results[name] = { success: false, error: err.message }
      }
    }
    return results
  }

  /** 断开所有设备 */
  async disconnectAll() {
    for (const [name, device] of this.devices) {
      try {
        await device.client.disconnect()
        device.connected = false
      } catch (e) { /* ignore */ }
    }
  }

  /**
   * 读取单个点位
   * @param {string} deviceName 设备名
   * @param {string} tagName 点位名
   */
  async readTag(deviceName, tagName) {
    const device = this.getDevice(deviceName)
    const tagItem = device.tagMap.find(t => t.tag === tagName)
    if (!tagItem) throw new Error(`点位 ${tagName} 不存在于设备 ${deviceName}`)
    const value = await device.client.readTag(tagItem)
    this.dataCache.get(deviceName)[tagName] = value
    return value
  }

  /**
   * 读取设备所有点位（批量优化）
   */
  async readAllTags(deviceName) {
    const device = this.getDevice(deviceName)
    if (device.tagMap.length === 0) return {}
    const values = await device.client.readTags(device.tagMap)
    const cache = this.dataCache.get(deviceName)
    Object.assign(cache, values)
    return values
  }

  /**
   * 写入点位
   */
  async writeTag(deviceName, tagName, value) {
    const device = this.getDevice(deviceName)
    const tagItem = device.tagMap.find(t => t.tag === tagName)
    if (!tagItem) throw new Error(`点位 ${tagName} 不存在于设备 ${deviceName}`)
    if (tagItem.rw !== 'write') throw new Error(`点位 ${tagName} 只读，禁止写入`)
    await device.client.writeTag(tagItem, value)
    // 写入后更新缓存
    this.dataCache.get(deviceName)[tagName] = value
    return { tag: tagName, value }
  }

  /** 获取缓存数据 */
  getCachedData(deviceName) {
    return this.dataCache.get(deviceName) || {}
  }

  /** 获取所有设备状态 */
  getAllStatus() {
    const status = {}
    for (const [name, device] of this.devices) {
      status[name] = {
        ...device.client.getStatus(),
        tagCount: device.tagMap.length,
        consecutiveErrors: device.consecutiveErrors,
        lastError: device.lastError
      }
    }
    return status
  }

  /** 获取已注册设备名列表 */
  getDeviceNames() {
    return Array.from(this.devices.keys())
  }

  /** 设备数量 */
  get size() {
    return this.devices.size
  }
}

// 导出单例
module.exports = new PlcManager()
module.exports.PlcManager = PlcManager
module.exports.PROTOCOL_MAP = PROTOCOL_MAP
