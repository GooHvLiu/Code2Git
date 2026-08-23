/**
 * 西门子 S7 协议客户端
 * 支持 S7-1200 / S7-1500 / S7-300 / S7-400
 *
 * 依赖安装：npm install nodes7
 * 点位地址格式：DB1.DBX0.0 / DB1.DBW0 / DB1.DBD0 / DB1.DBD0.REAL
 *
 * 使用前请确保：
 * 1. PLC 已启用 PUT/GET 通信（S7-1200/1500 需要在博图中设置）
 * 2. 防火墙允许 102 端口
 */
const BasePlc = require('./BasePlc')

class S7Client extends BasePlc {
  constructor(cfg) {
    super(cfg)
    this.client = null
    this.config.protocol = 'S7'
    this._nodes7 = null
  }

  /** 懒加载 nodes7 依赖，未安装时给出明确提示 */
  _getNodes7() {
    if (!this._nodes7) {
      try {
        this._nodes7 = require('nodes7')
      } catch (e) {
        throw new Error('S7 协议需要安装 nodes7 依赖：npm install nodes7')
      }
    }
    return this._nodes7
  }

  async connect() {
    const nodes7 = this._getNodes7()
    this.client = new nodes7()

    return new Promise((resolve, reject) => {
      this.client.initiateConnection({
        host: this.config.connection.host,
        port: this.config.connection.port || 102,
        rack: this.config.connection.rack || 0,
        slot: this.config.connection.slot || 1
      }, (err) => {
        if (err) {
          this.isConnected = false
          this.lastError = err.message
          reject(err)
        } else {
          this.isConnected = true
          this.connectTime = new Date().toISOString()
          this.lastError = null
          resolve()
        }
      })
    })
  }

  async disconnect() {
    if (this.client) {
      return new Promise((resolve) => {
        this.client.dropConnection(() => {
          this.isConnected = false
          resolve()
        })
      })
    }
    this.isConnected = false
  }

  /**
   * S7 地址转换
   * 点位配置中的 address 字段支持：
   *   - DB1.DBX0.0  (布尔)
   *   - DB1.DBW0    (字/int16/uint16)
   *   - DB1.DBD0    (双字/int32/uint32/float)
   */
  _toS7Address(tagItem) {
    return tagItem.address // S7 直接使用地址字符串
  }

  async readTag(tagItem) {
    this._ensureConnected()
    return new Promise((resolve, reject) => {
      this.client.readItems([this._toS7Address(tagItem)], (err, values) => {
        if (err) {
          this.lastError = err.message
          reject(err)
        } else {
          resolve(values[0])
        }
      })
    })
  }

  async readTags(tagItems) {
    this._ensureConnected()
    const addresses = tagItems.map(t => this._toS7Address(t))
    return new Promise((resolve, reject) => {
      this.client.readItems(addresses, (err, values) => {
        if (err) {
          this.lastError = err.message
          // 批量失败时逐个重试
          const result = {}
          let pending = tagItems.length
          tagItems.forEach((tag, idx) => {
            this.readTag(tag).then(val => {
              result[tag.tag] = val
            }).catch(() => {
              result[tag.tag] = null
            }).finally(() => {
              pending--
              if (pending === 0) resolve(result)
            })
          })
        } else {
          const result = {}
          tagItems.forEach((tag, idx) => {
            result[tag.tag] = values[idx]
          })
          resolve(result)
        }
      })
    })
  }

  async writeTag(tagItem, value) {
    this._ensureConnected()
    return new Promise((resolve, reject) => {
      this.client.writeItems([this._toS7Address(tagItem)], [value], (err) => {
        if (err) {
          this.lastError = err.message
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  getStatus() {
    return {
      ...super.getStatus(),
      host: this.config.connection.host,
      port: this.config.connection.port || 102,
      rack: this.config.connection.rack || 0,
      slot: this.config.connection.slot || 1
    }
  }
}

module.exports = S7Client
