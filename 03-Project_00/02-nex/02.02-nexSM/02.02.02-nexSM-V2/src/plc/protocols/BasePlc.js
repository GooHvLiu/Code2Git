/**
 * PLC 协议抽象基类
 * 所有通讯协议继承该类，对外方法名统一
 *
 * 子类必须实现：
 *   - connect()      建立连接
 *   - disconnect()   断开连接
 *   - readTag()      读取单个点位
 *   - writeTag()     写入单个点位
 *
 * 子类可重写（有默认实现）：
 *   - readTags()     批量读取（默认逐个读取，协议支持时应重写为批量请求）
 *   - getStatus()    获取连接状态
 */
class BasePlc {
  constructor(config) {
    this.config = config
    this.isConnected = false
    this.lastError = null
    this.connectTime = null
  }

  /** 建立连接 */
  async connect() {
    throw new Error('子类必须实现 connect()')
  }

  /** 断开连接 */
  async disconnect() {
    throw new Error('子类必须实现 disconnect()')
  }

  /**
   * 读取单个点位
   * @param {Object} tagItem 点位配置 { tag, address, type, ... }
   * @returns {Promise<any>} 点位值
   */
  async readTag(tagItem) {
    throw new Error('子类必须实现 readTag()')
  }

  /**
   * 写入单个点位
   * @param {Object} tagItem 点位配置
   * @param {any} value 写入值
   */
  async writeTag(tagItem, value) {
    throw new Error('子类必须实现 writeTag()')
  }

  /**
   * 批量读取点位（默认逐个读取）
   * 协议支持批量请求时（如 Modbus 连续寄存器），子类应重写此方法优化性能
   * @param {Array} tagItems 点位配置数组
   * @returns {Promise<Object>} { tag: value }
   */
  async readTags(tagItems) {
    const result = {}
    for (const tagItem of tagItems) {
      try {
        result[tagItem.tag] = await this.readTag(tagItem)
      } catch (err) {
        result[tagItem.tag] = null
        this.lastError = err.message
      }
    }
    return result
  }

  /**
   * 获取连接状态
   * @returns {Object} 状态信息
   */
  getStatus() {
    return {
      connected: this.isConnected,
      protocol: this.config.protocol || this.constructor.name,
      lastError: this.lastError,
      connectTime: this.connectTime
    }
  }

  /**
   * 确保已连接，未连接则抛出错误
   */
  _ensureConnected() {
    if (!this.isConnected) {
      throw new Error('PLC 未连接')
    }
  }
}

module.exports = BasePlc
