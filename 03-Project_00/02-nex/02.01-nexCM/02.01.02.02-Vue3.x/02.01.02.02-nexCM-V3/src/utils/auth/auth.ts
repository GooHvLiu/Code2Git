/**
 * ==========================================
 * Token 存取工具
 * ==========================================
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../data/storage'
import { LOCALSTORAGE_KEYS } from '../data/storageKey'

export function getToken(): string | null {
  return getLocalStorage<string>(LOCALSTORAGE_KEYS.TOKEN)
}

export function setToken(token: string): void {
  setLocalStorage(LOCALSTORAGE_KEYS.TOKEN, token)
}

export function removeToken(): void {
  removeLocalStorage(LOCALSTORAGE_KEYS.TOKEN)
}
