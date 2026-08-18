/**
 * ==========================================
 * 本地存储工具
 * ==========================================
 * localStorage / sessionStorage 的封装
 * 自动 JSON 序列化/解析
 */

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalStorage(key) {
  const value = localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

export function removeLocalStorage(key) {
  localStorage.removeItem(key)
}

export function setSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStorage(key) {
  const value = sessionStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

export function removeSessionStorage(key) {
  sessionStorage.removeItem(key)
}

/** 清除所有 localStorage */
export function clearAllLocalStorage() {
  localStorage.clear()
}

/** 清除所有 sessionStorage */
export function clearAllSessionStorage() {
  sessionStorage.clear()
}
