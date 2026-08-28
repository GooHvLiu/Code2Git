/**
 * ==========================================
 * 进程内缓存工具类（基于 node-cache）
 * ==========================================
 * 用于缓存用户权限、菜单等高频访问数据，减少数据库查询
 * 使用人数不多的场景下，进程内缓存足够，无需引入 Redis
 *
 * 注意：多进程/集群部署时，各进程缓存独立，需要额外处理缓存同步
 */
const NodeCache = require('node-cache')

// 默认缓存配置
const DEFAULT_OPTIONS = {
  stdTTL: 30 * 60,      // 默认过期时间 30 分钟（秒）
  checkperiod: 60,       // 定期检查过期键的间隔（秒）
  useClones: false       // 不克隆对象，直接引用（性能更好，注意不要修改缓存对象）
}

// 全局缓存实例
const cache = new NodeCache(DEFAULT_OPTIONS)

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @returns {any} 缓存值，不存在返回 undefined
 */
function get(key) {
  return cache.get(key)
}

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {any} value - 缓存值
 * @param {number} [ttl] - 过期时间（秒），不传使用默认值
 * @returns {boolean} 是否设置成功
 */
function set(key, value, ttl) {
  if (ttl !== undefined) {
    return cache.set(key, value, ttl)
  }
  return cache.set(key, value)
}

/**
 * 删除缓存
 * @param {string} key - 缓存键
 * @returns {number} 删除的键数量
 */
function del(key) {
  return cache.del(key)
}

/**
 * 检查缓存是否存在
 * @param {string} key - 缓存键
 * @returns {boolean} 是否存在
 */
function has(key) {
  return cache.has(key)
}

/**
 * 清空所有缓存
 */
function flushAll() {
  cache.flushAll()
}

/**
 * 获取缓存统计信息
 * @returns {Object} 统计信息
 */
function getStats() {
  return cache.getStats()
}

/**
 * 按前缀删除缓存
 * @param {string} prefix - 键前缀
 * @returns {number} 删除的键数量
 */
function delByPrefix(prefix) {
  const keys = cache.keys()
  const matchedKeys = keys.filter(k => k.startsWith(prefix))
  if (matchedKeys.length === 0) return 0
  return cache.del(matchedKeys)
}

module.exports = {
  get,
  set,
  del,
  has,
  flushAll,
  getStats,
  delByPrefix,
  cache // 暴露原始实例，方便高级用法
}
