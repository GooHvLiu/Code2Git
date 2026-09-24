/**
 * ==========================================
 * 全局数据缓存工具
 * ==========================================
 * 缓存全局共享数据（角色列表、部门树、字典等），避免重复请求。
 * 支持：数据缓存、并发请求合并、手动失效。
 *
 * 用法：
 *   import { withCache, clearCache, clearAllCache } from '@/utils/data/cache'
 *   const roles = await withCache('user_roleList', () => requestGetRoleAllApi())
 * 作者：GooHv
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expire: number
}

/** 缓存存储 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cacheStore: Record<string, CacheEntry<any>> = {}
/** 进行中的请求（并发合并） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadingStore: Record<string, Promise<any>> = {}

/** 默认过期时间：5 分钟 */
const DEFAULT_EXPIRE = 5 * 60 * 1000

/** 获取缓存数据（不存在或已过期返回 null） */
export function getCache<T = unknown>(key: string): T | null {
  const cache = cacheStore[key]
  if (!cache) return null
  if (cache.expire && Date.now() - cache.timestamp > cache.expire) {
    delete cacheStore[key]
    return null
  }
  return cache.data as T
}

/** 设置缓存数据 */
export function setCache<T>(key: string, data: T, expire = DEFAULT_EXPIRE): void {
  cacheStore[key] = { data, timestamp: Date.now(), expire }
}

/** 清除指定缓存（不传 key 清空全部） */
export function clearCache(key?: string): void {
  if (key) delete cacheStore[key]
  else Object.keys(cacheStore).forEach(k => delete cacheStore[k])
}

/**
 * 带缓存的请求：命中缓存直接返回；相同并发请求复用同一 Promise；否则发起并缓存。
 * @param key 缓存键名
 * @param requestFn 请求函数
 * @param expire 过期时间（毫秒），默认 5 分钟
 */
export async function withCache<T>(key: string, requestFn: () => Promise<T>, expire = DEFAULT_EXPIRE): Promise<T> {
  const cachedData = getCache<T>(key)
  if (cachedData !== null) return cachedData

  if (loadingStore[key] !== undefined) return loadingStore[key] as Promise<T>

  const promise = (async (): Promise<T> => {
    try {
      const result = await requestFn()
      setCache(key, result, expire)
      return result
    } finally {
      delete loadingStore[key]
    }
  })()

  loadingStore[key] = promise
  return promise
}

/** 清除所有缓存（退出登录时调用） */
export function clearAllCache(): void {
  Object.keys(cacheStore).forEach(k => delete cacheStore[k])
  Object.keys(loadingStore).forEach(k => delete loadingStore[k])
}

export default {
  getCache,
  setCache,
  clearCache,
  withCache,
  clearAllCache
}
