const ModbusRTU = require('modbus-serial')
const BasePlc = require('./BasePlc')
const plcLock = require('../utils/plcLock')
const { withTimeout, DEFAULT_TIMEOUTS } = require('../utils/withTimeout')
const {
  wordsToFloat,
  floatToWords,
  uint16ToInt16,
  int16ToUint16,
  wordsToUint32,
  uint32ToWords,
  wordsToInt32,
  int32ToWords,
  wordsToString,
  stringToWords
} = require('../utils/plcDataConvert')

/**
 * Modbus TCP 客户端
 * 支持数据类型：uint16 / int16 / uint32 / int32 / float / bool / string
 * 支持批量读取：连续寄存器自动合并为一次请求
 */
class ModbusTcpClient extends BasePlc {
  constructor(cfg) {
    super(cfg)
    this.client = null
    this.config.protocol = 'ModbusTcp'
  }

  async connect() {
    await plcLock.acquire(10000, 'connect')
    try {
      if (this.client) {
        try {
          // 给 close() 加上超时保护，防止 socket 半关闭状态导致永远卡住
          await withTimeout(
            this.client.close(),
            3000,
            '关闭旧连接超时（3秒）'
          )
        } catch (e) { /* ignore */ }
      }
      this.client = new ModbusRTU()
      this.client.setID(this.config.connection.unitId)
      this.client.setTimeout(3000)
      await withTimeout(
        this.client.connectTCP(this.config.connection.host, {
          port: this.config.connection.port
        }),
        DEFAULT_TIMEOUTS.connect,
        `连接 PLC ${this.config.connection.host}:${this.config.connection.port} 超时`
      )
      this.isConnected = true
      this.connectTime = new Date().toISOString()
      this.lastError = null
    } catch (e) {
      this.isConnected = false
      this.lastError = e.message
      throw e
    } finally {
      plcLock.release()
    }
  }

  async disconnect() {
    await plcLock.acquire(5000, 'disconnect')
    try {
      if (this.client) {
        try {
          // 给 close() 加上超时保护，防止 socket 半关闭状态导致永远卡住
          await withTimeout(
            this.client.close(),
            3000,
            '关闭连接超时（3秒）'
          )
        } catch (e) { /* ignore */ }
      }
    } finally {
      this.isConnected = false
      plcLock.release()
    }
  }

  /** 根据数据类型计算寄存器数量 */
  _getRegisterCount(tagItem) {
    switch (tagItem.type) {
      case 'uint16':
      case 'int16':
      case 'bool':
        return 1
      case 'uint32':
      case 'int32':
      case 'float':
        return 2
      case 'string':
        return tagItem.length || 10
      default:
        throw new Error(`未支持数据类型: ${tagItem.type}`)
    }
  }

  /** Modbus 4x 保持寄存器地址偏移 */
  _toOffset(address) {
    return address - 40001
  }

  /** 从原始寄存器数据解析值 */
  _parseValue(tagItem, data, startIdx) {
    switch (tagItem.type) {
      case 'uint16':
        return data[startIdx]
      case 'int16':
        return uint16ToInt16(data[startIdx])
      case 'bool':
        return data[startIdx] !== 0
      case 'float':
        return wordsToFloat(data[startIdx], data[startIdx + 1], true)
      case 'uint32':
        return wordsToUint32(data[startIdx], data[startIdx + 1], true)
      case 'int32':
        return wordsToInt32(data[startIdx], data[startIdx + 1], true)
      case 'string': {
        const count = this._getRegisterCount(tagItem)
        return wordsToString(data.slice(startIdx, startIdx + count), count * 2)
      }
      default:
        throw new Error(`未支持数据类型: ${tagItem.type}`)
    }
  }

  async readTag(tagItem) {
    this._ensureConnected()
    await plcLock.acquire(8000, `readTag:${tagItem.tag}`)
    try {
      const addr = this._toOffset(tagItem.address)
      const count = this._getRegisterCount(tagItem)
      const r = await withTimeout(
        this.client.readHoldingRegisters(addr, count),
        DEFAULT_TIMEOUTS.read,
        `读取点位 ${tagItem.tag} 超时`
      )
      return this._parseValue(tagItem, r.data, 0)
    } finally {
      plcLock.release()
    }
  }

  /**
   * 批量读取优化：将连续地址的点位合并为一次 Modbus 请求
   * 性能提升：10个连续点位从10次请求降为1次
   */
  async readTags(tagItems) {
    this._ensureConnected()
    if (tagItems.length === 0) return {}
    if (tagItems.length === 1) {
      const val = await this.readTag(tagItems[0])
      return { [tagItems[0].tag]: val }
    }

    await plcLock.acquire(15000, `readTags:${tagItems.length}items`)
    try {
      // 按起始地址排序
      const sorted = [...tagItems].sort((a, b) => a.address - b.address)
      const result = {}

      // 分组：连续地址合并为一组
      const groups = []
      let currentGroup = [sorted[0]]
      let currentEnd = sorted[0].address + this._getRegisterCount(sorted[0])

      for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i]
        // 地址连续（间隔 <= 5 个寄存器也合并，避免过多碎片请求）
        if (item.address - currentEnd <= 5) {
          currentGroup.push(item)
          currentEnd = Math.max(currentEnd, item.address + this._getRegisterCount(item))
        } else {
          groups.push(currentGroup)
          currentGroup = [item]
          currentEnd = item.address + this._getRegisterCount(item)
        }
      }
      groups.push(currentGroup)

      // 逐组读取
      for (const group of groups) {
        const startAddr = this._toOffset(group[0].address)
        const endAddr = this._toOffset(
          Math.max(...group.map(t => t.address + this._getRegisterCount(t)))
        )
        const count = endAddr - startAddr

        try {
          const r = await withTimeout(
            this.client.readHoldingRegisters(startAddr, count),
            DEFAULT_TIMEOUTS.readBatch,
            `批量读取超时 (地址 ${group[0].address})`
          )
          // 从批量数据中解析每个点位
          for (const tagItem of group) {
            const idx = tagItem.address - group[0].address
            result[tagItem.tag] = this._parseValue(tagItem, r.data, idx)
          }
        } catch (err) {
          // 整组读取失败，逐个重试（注意：锁已被当前方法持有，不能调用 readTag，否则死锁）
          for (const tagItem of group) {
            try {
              const addr = this._toOffset(tagItem.address)
              const cnt = this._getRegisterCount(tagItem)
              const r = await withTimeout(
                this.client.readHoldingRegisters(addr, cnt),
                DEFAULT_TIMEOUTS.read,
                `读取点位 ${tagItem.tag} 超时`
              )
              result[tagItem.tag] = this._parseValue(tagItem, r.data, 0)
            } catch (e) {
              result[tagItem.tag] = null
              this.lastError = e.message
            }
          }
        }
      }

      return result
    } finally {
      plcLock.release()
    }
  }

  async writeTag(tagItem, value) {
    this._ensureConnected()
    await plcLock.acquire(8000, `writeTag:${tagItem.tag}`)
    try {
      const addr = this._toOffset(tagItem.address)

      const writePromise = (async () => {
        switch (tagItem.type) {
          case 'uint16':
            await this.client.writeRegister(addr, value)
            break
          case 'int16':
            await this.client.writeRegister(addr, int16ToUint16(value))
            break
          case 'bool':
            await this.client.writeRegister(addr, value ? 1 : 0)
            break
          case 'float': {
            const words = floatToWords(value, true)
            await this.client.writeRegisters(addr, words)
            break
          }
          case 'uint32': {
            const words = uint32ToWords(value, true)
            await this.client.writeRegisters(addr, words)
            break
          }
          case 'int32': {
            const words = int32ToWords(value, true)
            await this.client.writeRegisters(addr, words)
            break
          }
          case 'string': {
            const wordCount = tagItem.length || 10
            const words = stringToWords(value, wordCount)
            await this.client.writeRegisters(addr, words)
            break
          }
          default:
            throw new Error(`未支持数据类型: ${tagItem.type}`)
        }
      })()

      await withTimeout(writePromise, DEFAULT_TIMEOUTS.write, `写入点位 ${tagItem.tag} 超时`)
    } finally {
      plcLock.release()
    }
  }

  getStatus() {
    return {
      ...super.getStatus(),
      host: this.config.connection.host,
      port: this.config.connection.port,
      unitId: this.config.connection.unitId
    }
  }
}

module.exports = ModbusTcpClient
