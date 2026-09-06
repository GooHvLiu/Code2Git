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
 *   - verifyConnection() 连接验证（默认读取第一个点位，子类可重写）
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
   * 连接验证：连接成功后读取一个点位，验证通讯真的可用
   * 这是非常重要的严格验证，确保不是"假连接"
   * @param {Array} tagMap 点位映射表
   * @returns {Promise<boolean>} 验证是否通过
   * @throws {Error} 验证失败时抛出异常
   */
  async verifyConnection(tagMap = []) {
    if (!this.isConnected) {
      throw new Error('连接未建立，无法验证')
    }

    // 如果没有点位配置，跳过验证（但记录警告）
    if (!tagMap || tagMap.length === 0) {
      console.warn('[PLC] 没有点位配置，跳过通讯验证')
      return true
    }

    // 选择第一个可读点位进行验证
    const testTag = tagMap.find(t => t.rw === 'read' || t.rw === 'read-write') || tagMap[0]
    if (!testTag) {
      console.warn('[PLC] 没有找到可读点位，跳过通讯验证')
      return true
    }

    try {
      // 读取点位验证通讯，设置5秒超时
      const value = await this._withReadTimeout(
        this.readTag(testTag),
        5000,
        `通讯验证超时（读取点位 ${testTag.tag}）`
      )

      // 验证读取结果有效（不是 undefined 或 null）
      if (value === undefined || value === null) {
        throw new Error(`通讯验证失败：读取点位 ${testTag.tag} 返回空值`)
      }

      console.log(`[PLC] 通讯验证通过：点位 ${testTag.tag} = ${value}`)
      return true
    } catch (err) {
      // 验证失败，标记连接断开
      this.isConnected = false
      this.lastError = `通讯验证失败: ${err.message}`
      throw new Error(this.lastError)
    }
  }

  /**
   * 读取超时包装（内部工具方法）
   * @param {Promise} promise - 读取操作的 Promise
   * @param {number} timeout - 超时时间（毫秒）
   * @param {string} message - 超时错误信息
   * @returns {Promise<any>} 读取结果
   */
  async _withReadTimeout(promise, timeout, message) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(message))
      }, timeout)

      promise
        .then(result => {
          clearTimeout(timer)
          resolve(result)
        })
        .catch(err => {
          clearTimeout(timer)
          reject(err)
        })
    })
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
