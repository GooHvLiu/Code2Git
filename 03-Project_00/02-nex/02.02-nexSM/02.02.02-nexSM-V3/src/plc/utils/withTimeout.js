/**
 * Promise 超时工具
 * 为异步操作添加超时限制，超时后自动 reject
 */

/**
 * 默认超时时间配置（ms）
 * 可通过环境变量覆盖
 */
const DEFAULT_TIMEOUTS = {
  connect: parseInt(process.env.PLC_TIMEOUT_CONNECT) || 5000,
  read: parseInt(process.env.PLC_TIMEOUT_READ) || 5000,
  readBatch: parseInt(process.env.PLC_TIMEOUT_READ_BATCH) || 8000,
  write: parseInt(process.env.PLC_TIMEOUT_WRITE) || 5000,
  general: parseInt(process.env.PLC_TIMEOUT_GENERAL) || 10000
}

/**
 * Promise 超时包装
 * @param {Promise} promise 原始 Promise
 * @param {number} ms 超时时间(ms)
 * @param {string} msg 超时错误信息
 * @returns {Promise} 带超时的 Promise
 */
function withTimeout(promise, ms, msg = '操作超时') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(msg)), ms)
    promise.then(
      (val) => { clearTimeout(timer); resolve(val) },
      (err) => { clearTimeout(timer); reject(err) }
    )
  })
}

module.exports = {
  withTimeout,
  DEFAULT_TIMEOUTS
}
