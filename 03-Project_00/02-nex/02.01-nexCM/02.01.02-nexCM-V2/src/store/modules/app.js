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
  device: 'desktop'
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
