/**
 * ==========================================
 * 本地存储工具
 * ==========================================
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from './storageKey'

/** 退出登录时清除登录相关所有缓存 */
export function clearLoginStorage(): void {
  localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN)
  localStorage.removeItem(LOCALSTORAGE_KEYS.USER_INFO)
  localStorage.removeItem(LOCALSTORAGE_KEYS.PERMISSIONS)
  localStorage.removeItem(LOCALSTORAGE_KEYS.PERMISSION_VERSION)
  sessionStorage.removeItem(SESSIONSTORAGE_KEYS.TAG_LIST)
}

export function setLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalStorage<T = unknown>(key: string): T | null {
  const value = localStorage.getItem(key)
  if (value === null) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return value as unknown as T
  }
}

export function removeLocalStorage(key: string): void {
  localStorage.removeItem(key)
}

export function setSessionStorage<T>(key: string, value: T): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStorage<T = unknown>(key: string): T | null {
  const value = sessionStorage.getItem(key)
  if (value === null) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return value as unknown as T
  }
}

export function removeSessionStorage(key: string): void {
  sessionStorage.removeItem(key)
}
