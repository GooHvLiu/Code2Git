/**
 * ==========================================
 * 数据字典工具
 * ==========================================
 * 管理系统中的枚举/字典数据（如状态、类型等）
 * 支持从后端获取并缓存，避免重复请求
 *
 * 用法：
 * import { getDict, setDict, clearDictCache } from '@/utils/dict'
 *
 * // 获取字典（优先从缓存读取，缓存没有则调用接口）
 * const statusList = await getDict('sys_user_status')
 *
 * // 手动设置字典（本地静态字典）
 * setDict('sys_user_status', [
 *   { label: '正常', value: '1', type: 'success' },
 *   { label: '禁用', value: '0', type: 'danger' }
 * ])
 */
import { requestGetDictItemsByCodeApi } from '@/api'

/** 字典缓存 Map */
const dictCache = new Map()

/** 正在请求中的 Promise 缓存（避免并发重复请求） */
const pendingRequests = new Map()

/**
 * 设置字典数据（手动设置，用于本地静态字典）
 * @param {string} code - 字典编码
 * @param {Array} list - 字典列表 [{ label, value, type }]
 */
export function setDict(code, list) {
  dictCache.set(code, list)
}

/**
 * 获取字典数据
 * 优先从缓存读取，缓存没有则调用后端接口
 * 并发请求同一个字典时，共享同一个 Promise，避免重复请求
 * @param {string} code - 字典编码
 * @returns {Promise<Array>} 字典列表
 */
export async function getDict(code) {
  // 缓存命中
  if (dictCache.has(code)) {
    return dictCache.get(code)
  }
  // 如果有正在进行的请求，复用该 Promise
  if (pendingRequests.has(code)) {
    return pendingRequests.get(code)
  }
  // 创建请求 Promise 并缓存
  const requestPromise = (async () => {
    try {
      const res = await requestGetDictItemsByCodeApi(code)
      const list = res.data || []
      dictCache.set(code, list)
      return list
    } catch (e) {
      // 被取消的请求不视为错误，返回空数组
      if (e?.code === 'ERR_CANCELED' || e?.message?.includes('CanceledError')) {
        return []
      }
      return []
    } finally {
      // 请求完成后移除 pending 缓存
      pendingRequests.delete(code)
    }
  })()
  
  pendingRequests.set(code, requestPromise)
  return requestPromise
}

/**
 * 批量获取字典
 * @param {string[]} codes - 字典编码数组
 * @returns {Promise<Object>} { code: list }
 */
export async function getDicts(codes) {
  const result = {}
  await Promise.all(
    codes.map(async code => {
      result[code] = await getDict(code)
    })
  )
  return result
}

/**
 * 根据字典值获取标签
 * @param {string} code - 字典编码
 * @param {*} value - 字典值
 * @returns {string} 标签文本
 */
export function getDictLabel(code, value) {
  const list = dictCache.get(code) || []
  const item = list.find(i => String(i.value) === String(value))
  return item ? item.label : value
}

/**
 * 根据字典值获取类型（用于 DictTag 组件的颜色）
 * @param {string} code - 字典编码
 * @param {*} value - 字典值
 * @returns {string} 类型（success/warning/danger/info）
 */
export function getDictType(code, value) {
  const list = dictCache.get(code) || []
  const item = list.find(i => String(i.value) === String(value))
  return item ? item.type || 'info' : 'info'
}

/**
 * 清除指定字典缓存
 * @param {string} code - 字典编码，不传则清除全部
 */
export function clearDictCache(code) {
  if (code) {
    dictCache.delete(code)
  } else {
    dictCache.clear()
  }
}
