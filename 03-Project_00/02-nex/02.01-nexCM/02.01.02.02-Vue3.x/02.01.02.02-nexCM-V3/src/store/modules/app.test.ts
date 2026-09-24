/**
 * ==========================================
 * store/modules/app.ts 单元测试
 * ==========================================
 * 使用 createPinia + setActivePinia 隔离 store 实例
 * 覆盖 toggleSideBar / closeSideBar / showLoading / hideLoading
 * 作者：GooHv
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from './app'
import { LOCALSTORAGE_KEYS } from '@/utils/data/storageKey'

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('初始 sidebar 默认展开且不带动画', () => {
    const store = useAppStore()
    expect(store.sidebar.opened).toBe(true)
    expect(store.sidebar.withoutAnimation).toBe(false)
  })

  it('toggleSideBar 切换展开状态并持久化', () => {
    const store = useAppStore()
    store.toggleSideBar()
    expect(store.sidebar.opened).toBe(false)
    expect(localStorage.getItem(LOCALSTORAGE_KEYS.SIDEBAR_STATUS)).toBe('"closed"')
    store.toggleSideBar()
    expect(store.sidebar.opened).toBe(true)
    expect(localStorage.getItem(LOCALSTORAGE_KEYS.SIDEBAR_STATUS)).toBe('"opened"')
  })

  it('closeSideBar 关闭并记录 withoutAnimation', () => {
    const store = useAppStore()
    store.closeSideBar(true)
    expect(store.sidebar.opened).toBe(false)
    expect(store.sidebar.withoutAnimation).toBe(true)
  })

  it('toggleDevice 切换设备类型', () => {
    const store = useAppStore()
    expect(store.device).toBe('desktop')
    store.toggleDevice('mobile')
    expect(store.device).toBe('mobile')
  })

  it('showLoading / hideLoading / resetLoading 计数', () => {
    const store = useAppStore()
    expect(store.globalLoading).toBe(0)
    store.showLoading()
    store.showLoading()
    expect(store.globalLoading).toBe(2)
    store.hideLoading()
    expect(store.globalLoading).toBe(1)
    store.hideLoading()
    store.hideLoading() // 不应减到负数
    expect(store.globalLoading).toBe(0)
    store.showLoading()
    store.resetLoading()
    expect(store.globalLoading).toBe(0)
  })
})
