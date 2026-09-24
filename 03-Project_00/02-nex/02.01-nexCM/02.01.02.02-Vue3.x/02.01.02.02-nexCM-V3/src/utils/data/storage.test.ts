/**
 * ==========================================
 * storage.ts 单元测试
 * ==========================================
 * jsdom 环境下 localStorage / sessionStorage 原生可用，无需额外 mock
 * 覆盖 get/set/remove 与 JSON 解析兜底
 * 作者：GooHv
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearLoginStorage
} from './storage'
import { LOCALSTORAGE_KEYS, SESSIONSTORAGE_KEYS } from './storageKey'

describe('localStorage 封装', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('setLocalStorage 后 getLocalStorage 能取回对象', () => {
    setLocalStorage('user', { name: 'zhangsan', age: 30 })
    expect(getLocalStorage<{ name: string; age: number }>('user')).toEqual({ name: 'zhangsan', age: 30 })
  })

  it('存储字符串数字能正确 JSON 往返', () => {
    setLocalStorage('count', 42)
    expect(getLocalStorage<number>('count')).toBe(42)
  })

  it('不存在的 key 返回 null', () => {
    expect(getLocalStorage('not-exist')).toBeNull()
  })

  it('非法 JSON 原样返回字符串', () => {
    localStorage.setItem('raw', 'not-a-json{')
    expect(getLocalStorage('raw')).toBe('not-a-json{')
  })

  it('removeLocalStorage 清除指定 key', () => {
    setLocalStorage('tmp', 1)
    removeLocalStorage('tmp')
    expect(getLocalStorage('tmp')).toBeNull()
  })
})

describe('sessionStorage 封装', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('setSessionStorage / getSessionStorage 往返', () => {
    setSessionStorage('tag', [{ path: '/home' }])
    expect(getSessionStorage<Array<{ path: string }>>('tag')).toEqual([{ path: '/home' }])
  })

  it('不存在返回 null', () => {
    expect(getSessionStorage('miss')).toBeNull()
  })

  it('removeSessionStorage 清除', () => {
    setSessionStorage('x', 'v')
    removeSessionStorage('x')
    expect(getSessionStorage('x')).toBeNull()
  })
})

describe('clearLoginStorage', () => {
  it('清除登录相关缓存且不影响其他 key', () => {
    setLocalStorage(LOCALSTORAGE_KEYS.TOKEN, 'abc')
    setLocalStorage(LOCALSTORAGE_KEYS.USER_INFO, { a: 1 })
    setLocalStorage(LOCALSTORAGE_KEYS.PERMISSIONS, ['p1'])
    setLocalStorage(LOCALSTORAGE_KEYS.PERMISSION_VERSION, 1)
    setLocalStorage('keep-me', 'yes')
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, [{ path: '/x' }])

    clearLoginStorage()

    expect(getLocalStorage(LOCALSTORAGE_KEYS.TOKEN)).toBeNull()
    expect(getLocalStorage(LOCALSTORAGE_KEYS.USER_INFO)).toBeNull()
    expect(getLocalStorage(LOCALSTORAGE_KEYS.PERMISSIONS)).toBeNull()
    expect(getLocalStorage(LOCALSTORAGE_KEYS.PERMISSION_VERSION)).toBeNull()
    expect(getSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST)).toBeNull()
    // 非登录 key 保留
    expect(getLocalStorage('keep-me')).toBe('yes')
  })
})
