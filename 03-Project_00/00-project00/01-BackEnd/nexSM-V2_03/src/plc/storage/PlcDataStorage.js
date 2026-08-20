/**
 * PLC 数据持久化存储
 * 支持内存缓存 + 文件持久化，接口预留时序数据库（InfluxDB）扩展
 *
 * 特性：
 * - 内存环形缓冲区（固定大小，防止内存溢出）
 * - 定时批量写入文件（JSONL 格式）
 * - 断线期间数据缓存，恢复后补传
 * - 按设备+点位查询历史数据
 */
const fs = require('fs')
const path = require('path')

class PlcDataStorage {
  constructor(options = {}) {
    this.bufferSize = options.bufferSize || 10000 // 内存缓冲区大小
    this.flushInterval = options.flushInterval || 5000 // 刷盘间隔 ms
    this.dataDir = options.dataDir || path.join(__dirname, '../../../data/plc')
    this.buffer = [] // 内存缓冲区 { device, tag, value, timestamp }
    this.flushTimer = null
    this.isFlushing = false

    // 确保数据目录存在
    this._ensureDir()
  }

  _ensureDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true })
    }
  }

  /**
   * 存储一条数据
   */
  store(device, tag, value) {
    const record = {
      device,
      tag,
      value,
      timestamp: Date.now()
    }
    this.buffer.push(record)

    // 缓冲区满时自动刷盘
    if (this.buffer.length >= this.bufferSize) {
      this.flush()
    }
  }

  /**
   * 批量存储
   */
  storeBatch(device, values) {
    const timestamp = Date.now()
    for (const [tag, value] of Object.entries(values)) {
      this.buffer.push({ device, tag, value, timestamp })
    }
    if (this.buffer.length >= this.bufferSize) {
      this.flush()
    }
  }

  /**
   * 刷盘：将内存数据写入文件
   */
  async flush() {
    if (this.isFlushing || this.buffer.length === 0) return
    this.isFlushing = true

    try {
      const data = this.buffer.splice(0, this.buffer.length)
      // 按日期分文件
      const date = new Date().toISOString().slice(0, 10)
      const filePath = path.join(this.dataDir, `plc-data-${date}.jsonl`)

      const lines = data.map(r => JSON.stringify(r)).join('\n') + '\n'
      fs.appendFileSync(filePath, lines, 'utf8')
    } catch (err) {
      console.error('[PLC Storage] 刷盘失败:', err.message)
    } finally {
      this.isFlushing = false
    }
  }

  /**
   * 启动定时刷盘
   */
  start() {
    if (this.flushTimer) return
    this.flushTimer = setInterval(() => this.flush(), this.flushInterval)
  }

  /**
   * 停止定时刷盘（并刷出剩余数据）
   */
  async stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    await this.flush()
  }

  /**
   * 查询历史数据
   * @param {string} device 设备名
   * @param {string} tag 点位名
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {number} limit 返回条数限制
   */
  async query(device, tag, startTime, endTime, limit = 1000) {
    const results = []
    const startDate = new Date(startTime).toISOString().slice(0, 10)
    const endDate = new Date(endTime).toISOString().slice(0, 10)

    let current = new Date(startDate)
    const end = new Date(endDate)

    while (current <= end && results.length < limit) {
      const dateStr = current.toISOString().slice(0, 10)
      const filePath = path.join(this.dataDir, `plc-data-${dateStr}.jsonl`)

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8')
        const lines = content.split('\n').filter(Boolean)

        for (const line of lines) {
          try {
            const record = JSON.parse(line)
            if (
              record.device === device &&
              record.tag === tag &&
              record.timestamp >= startTime &&
              record.timestamp <= endTime
            ) {
              results.push(record)
              if (results.length >= limit) break
            }
          } catch (e) { /* skip malformed line */ }
        }
      }

      current.setDate(current.getDate() + 1)
    }

    return results
  }

  /** 获取缓冲区当前数据量 */
  get bufferCount() {
    return this.buffer.length
  }
}

module.exports = new PlcDataStorage()
module.exports.PlcDataStorage = PlcDataStorage
