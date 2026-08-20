/**
 * ==========================================
 * Token 存取工具
 * ==========================================
 * 统一管理 Token 的增删查，所有需要操作 Token 的地方都从这里引入
 * 避免直接操作 localStorage 导致 key 不一致
 */
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/utils/storage'
import { LOCALSTORAGE_KEYS } from '@/utils/storageKey'

/**
 * 获取 Token
 * @returns {string|null}
 */
export function getToken() {
  return getLocalStorage(LOCALSTORAGE_KEYS.TOKEN)
}

/**
 * 设置 Token
 * @param {string} token
 */
export function setToken(token) {
  setLocalStorage(LOCALSTORAGE_KEYS.TOKEN, token)
}

/**
 * 删除 Token
 */
export function removeToken() {
  removeLocalStorage(LOCALSTORAGE_KEYS.TOKEN)
}
