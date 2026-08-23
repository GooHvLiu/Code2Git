/**
 * ==========================================
 * 全局数据缓存工具
 * ==========================================
 * 用于缓存全局共享数据（如角色列表、部门树、字典数据等），
 * 避免重复请求，提高性能。
 *
 * 支持：
 * 1. 数据缓存（命中缓存直接返回）
 * 2. 并发请求合并（相同请求同时发起时，只发起一个请求）
 * 3. 缓存失效（手动清除缓存）
 */

/**
 * 缓存数据存储
 * key: 缓存键名
 * value: { data, timestamp, expire }
 */
const cacheStore = {}

/**
 * 请求中状态存储
 * key: 缓存键名
 * value: Promise（正在进行的请求）
 */
const loadingStore = {}

/**
 * 默认缓存过期时间（毫秒）
 * 5 分钟
 */
const DEFAULT_EXPIRE = 5 * 60 * 1000

/**
 * 获取缓存数据
 *
 * @param {string} key - 缓存键名
 * @returns {*} 缓存数据，如果缓存不存在或已过期返回 null
 */
export function getCache(key) {
  const cache = cacheStore[key]
  if (!cache) return null

  // 检查是否过期
  if (cache.expire && Date.now() - cache.timestamp > cache.expire) {
    delete cacheStore[key]
    return null
  }

  return cache.data
}

/**
 * 设置缓存数据
 *
 * @param {string} key - 缓存键名
 * @param {*} data - 要缓存的数据
 * @param {number} [expire] - 缓存过期时间（毫秒），默认 5 分钟
 */
export function setCache(key, data, expire = DEFAULT_EXPIRE) {
  cacheStore[key] = {
    data,
    timestamp: Date.now(),
    expire
  }
}

/**
 * 清除指定缓存
 *
 * @param {string} key - 缓存键名
 */
export function clearCache(key) {
  if (key) {
    delete cacheStore[key]
  } else {
    // 清除所有缓存
    Object.keys(cacheStore).forEach(k => delete cacheStore[k])
  }
}

/**
 * 带缓存的请求
 *
 * 如果缓存命中，直接返回缓存数据；
 * 如果有相同请求正在进行，等待第一个请求返回；
 * 否则发起新的请求，并缓存结果。
 *
 * @param {string} key - 缓存键名
 * @param {Function} requestFn - 请求函数（返回 Promise）
 * @param {number} [expire] - 缓存过期时间（毫秒），默认 5 分钟
 * @returns {Promise<*>} 请求结果
 *
 * @example
 * const roles = await withCache('roleList', () => requestGetRoleAllApi())
 */
export async function withCache(key, requestFn, expire = DEFAULT_EXPIRE) {
  // 命中缓存
  const cachedData = getCache(key)
  if (cachedData !== null) {
    return cachedData
  }

  // 如果有相同请求正在进行，等待第一个请求返回
  if (loadingStore[key]) {
    return await loadingStore[key]
  }

  // 发起新的请求
  const promise = (async () => {
    try {
      const result = await requestFn()
      setCache(key, result, expire)
      return result
    } finally {
      delete loadingStore[key]
    }
  })()

  loadingStore[key] = promise
  return await promise
}

/**
 * 清除所有缓存（退出登录时调用）
 */
export function clearAllCache() {
  Object.keys(cacheStore).forEach(key => delete cacheStore[key])
  Object.keys(loadingStore).forEach(key => delete loadingStore[key])
}

export default {
  getCache,
  setCache,
  clearCache,
  withCache,
  clearAllCache
}
