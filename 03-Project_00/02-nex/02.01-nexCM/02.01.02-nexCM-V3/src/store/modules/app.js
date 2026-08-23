/**
 * ==========================================
 * App 模块 - 全局 UI 状态
 * ==========================================
 * 管理侧边栏折叠、设备类型等全局 UI 状态
 * 侧边栏状态持久化到 localStorage，刷新后保持
 */
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCALSTORAGE_KEYS } from '@/utils/storageKey'

/** 从 localStorage 读取侧边栏状态，默认展开 */
const getSidebarOpened = () => {
  const stored = getLocalStorage(LOCALSTORAGE_KEYS.SIDEBAR_STATUS)
  return stored === null ? true : stored === 'opened'
}

const state = {
  /**
   * 侧边栏状态
   * opened: 是否展开
   * withoutAnimation: 是否禁用动画（移动端切换时用）
   */
  sidebar: {
    opened: getSidebarOpened(),
    withoutAnimation: false
  },
  /** 设备类型：desktop / mobile */
  device: 'desktop',
  /**
   * 全局 Loading 计数
   * 多个请求并发时，计数累加，归零时才关闭 loading
   * 避免多个请求先后完成导致 loading 闪烁
   */
  globalLoading: 0
}

const mutations = {
  /** 切换侧边栏展开/折叠 */
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    setLocalStorage(LOCALSTORAGE_KEYS.SIDEBAR_STATUS, state.sidebar.opened ? 'opened' : 'closed')
  },
  /** 关闭侧边栏 */
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
    setLocalStorage(LOCALSTORAGE_KEYS.SIDEBAR_STATUS, 'closed')
  },
  /** 切换设备类型 */
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  /** 增加全局 Loading 计数 */
  INC_LOADING: state => {
    state.globalLoading++
  },
  /** 减少全局 Loading 计数（最小为 0） */
  DEC_LOADING: state => {
    if (state.globalLoading > 0) {
      state.globalLoading--
    }
  },
  /** 重置全局 Loading 计数（异常时用） */
  RESET_LOADING: state => {
    state.globalLoading = 0
  }
}

const actions = {
  /** 切换侧边栏 */
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  /** 关闭侧边栏 */
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  /** 切换设备类型 */
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  /** 显示全局 Loading（计数 +1） */
  showLoading({ commit }) {
    commit('INC_LOADING')
  },
  /** 隐藏全局 Loading（计数 -1） */
  hideLoading({ commit }) {
    commit('DEC_LOADING')
  },
  /** 强制重置 Loading（路由切换/异常时调用） */
  resetLoading({ commit }) {
    commit('RESET_LOADING')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
