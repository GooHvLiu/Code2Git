/**
 * PLC读写互斥锁
 * 同一时间只能执行一个读/写操作
 * 支持获取锁超时，避免无限等待
 */
class PlcLock {
  constructor() {
    this._locked = false
    this._queue = []
    this._holder = null // 当前持有锁的标识（用于调试）
  }

  /**
   * 获取锁
   * @param {number} timeout 超时时间(ms)，默认 10000ms，超时后抛出错误
   * @param {string} holder 持有者标识（调试用）
   */
  async acquire(timeout = 10000, holder = 'unknown') {
    return new Promise((resolve, reject) => {
      if (!this._locked) {
        this._locked = true
        this._holder = holder
        return resolve()
      }

      // 已被占用，加入等待队列
      let timer = null
      const resolveWrapper = () => {
        if (timer) clearTimeout(timer)
        this._holder = holder
        resolve()
      }

      // 超时处理
      timer = setTimeout(() => {
        // 从队列中移除
        const idx = this._queue.indexOf(resolveWrapper)
        if (idx >= 0) this._queue.splice(idx, 1)
        reject(new Error(`获取PLC锁超时（等待 ${timeout}ms），当前持有者: ${this._holder}`))
      }, timeout)

      this._queue.push(resolveWrapper)
    })
  }

  release() {
    this._holder = null
    if (this._queue.length > 0) {
      const next = this._queue.shift()
      next()
    } else {
      this._locked = false
    }
  }

  /** 获取锁状态（调试用） */
  getStatus() {
    return {
      locked: this._locked,
      queueLength: this._queue.length,
      holder: this._holder
    }
  }
}

module.exports = new PlcLock()
module.exports.PlcLock = PlcLock
