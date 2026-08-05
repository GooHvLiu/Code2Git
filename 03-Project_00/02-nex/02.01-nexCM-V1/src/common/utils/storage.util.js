import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from "@/common/constants/storageKey.js";

/**
 * 退出登录调用 - 清除登录相关所有本地缓存 LOCALSTORAGE_KEYS 和 SESSIONSTORAGE_KEYS
 */
export function clearLoginStorage() {
  // 删除 localStorage 本地token
  localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN);
  // 删除 localStorage 本地用户信息
  localStorage.removeItem(LOCALSTORAGE_KEYS.USER_INFO);
  // 删除 localStorage 本地 Tag 缓存
  sessionStorage.removeItem(SESSIONSTORAGE_KEYS.TAG_LIST);
}

/**
 * localStorage - 存储，自动转换为JSON
 * @param {string} key
 * @param {any} value
 */
export function setLocalStorage(key, value) {
  const data = typeof value === "object" ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
}

/**
 * localStorage - 读取，自动JSON解析
 * @param {string} key
 * @returns {any}
 */
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

/**
 * localStorage - 删除，单个缓存
 * @param {string} key
 */
export function removeLocalStorage(key) {
  localStorage.removeItem(key);
}

/**
 * sessionStorage - 存储，自动转换为JSON
 * @param {string} key
 * @param {any} value
 */
export function setSessionStorage(key, value) {
  const data = typeof value === "object" ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, data);
}

/**
 * sessionStorage - 读取，自动解析JSON
 * @param {string} key
 * @returns {any}
 */
export function getSessionStorage(key) {
  const value = sessionStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

/**
 * sessionStorage - 删除单个缓存
 * @param {string} key
 */
export function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}