/**
 * ==========================================
 * 本地存储工具
 * ==========================================
 * localStorage / sessionStorage 的封装
 * 自动 JSON 序列化/解析，统一清理登录缓存
 */
import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from '@/utils/storageKey'

/**
 * 退出登录时清除登录相关所有缓存
 */
export function clearLoginStorage() {
  localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN)
  localStorage.removeItem(LOCALSTORAGE_KEYS.USER_INFO)
  sessionStorage.removeItem(SESSIONSTORAGE_KEYS.TAG_LIST)
}

/**
 * localStorage 存储，自动 JSON 序列化
 */
export function setLocalStorage(key, value) {
  const data = typeof value === 'object' ? JSON.stringify(value) : value
  localStorage.setItem(key, data)
}

/**
 * localStorage 读取，自动 JSON 解析
 */
export function getLocalStorage(key) {
  const value = localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

/**
 * localStorage 删除单个
 */
export function removeLocalStorage(key) {
  localStorage.removeItem(key)
}

/**
 * sessionStorage 存储，自动 JSON 序列化
 */
export function setSessionStorage(key, value) {
  const data = typeof value === 'object' ? JSON.stringify(value) : value
  sessionStorage.setItem(key, data)
}

/**
 * sessionStorage 读取，自动 JSON 解析
 */
export function getSessionStorage(key) {
  const value = sessionStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

/**
 * sessionStorage 删除单个
 */
export function removeSessionStorage(key) {
  sessionStorage.removeItem(key)
}
