/**
 * ==========================================
 * TagsView 标签页状态管理
 * ==========================================
 * 管理已打开的标签页列表，支持增删、关闭其他、关闭全部
 * 数据持久化到 sessionStorage，刷新页面后标签不丢失
 */
import { setSessionStorage, getSessionStorage } from '@/utils/storage'
import { SESSIONSTORAGE_KEYS } from '@/utils/storageKey'
import { HOME_TAG } from '@/router/pathConstants'

const state = {
  /** 已访问的标签页列表 */
  visitedViews: getSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST) || [HOME_TAG],
  /** 已缓存的组件名列表（用于 keep-alive include） */
  cachedViews: []
}

const mutations = {
  /** 添加标签页（已存在则不重复添加） */
  ADD_VIEW(state, view) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push({
      name: view.name,
      path: view.path,
      title: view.meta?.titles?.[view.meta.titles.length - 1] || 'no-name',
      fullPath: view.fullPath
    })
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, state.visitedViews)
  },

  /** 添加缓存视图（meta.noCache 为 true 的不缓存） */
  ADD_CACHED_VIEW(state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta?.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  /** 删除指定标签页 */
  DEL_VIEW(state, view) {
    state.visitedViews = state.visitedViews.filter(v => v.path !== view.path)
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, state.visitedViews)
  },

  /** 删除缓存视图 */
  DEL_CACHED_VIEW(state, view) {
    state.cachedViews = state.cachedViews.filter(name => name !== view.name)
  },

  /** 关闭其他标签页（保留当前和首页） */
  DEL_OTHERS_VIEWS(state, view) {
    state.visitedViews = state.visitedViews.filter(
      v => v.path === view.path || v.path === HOME_TAG.path
    )
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, state.visitedViews)
  },

  /** 关闭其他缓存视图（保留当前和首页） */
  DEL_OTHERS_CACHED_VIEWS(state, view) {
    state.cachedViews = state.cachedViews.filter(name => {
      return name === view.name || name === 'Home'
    })
  },

  /** 关闭全部标签页（保留首页） */
  DEL_ALL_VIEWS(state) {
    state.visitedViews = [HOME_TAG]
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, state.visitedViews)
  },

  /** 关闭全部缓存视图（保留首页） */
  DEL_ALL_CACHED_VIEWS(state) {
    state.cachedViews = ['Home']
  },

  /** 关闭指定标签左侧的所有标签（首页保留） */
  DEL_LEFT_VIEWS(state, view) {
    const targetIndex = state.visitedViews.findIndex(v => v.path === view.path)
    if (targetIndex <= 1) return // 首页或无左侧标签
    state.visitedViews = state.visitedViews.filter(
      (v, index) => index === 0 || index >= targetIndex
    )
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, state.visitedViews)
  },

  /** 关闭指定标签右侧的所有标签 */
  DEL_RIGHT_VIEWS(state, view) {
    const targetIndex = state.visitedViews.findIndex(v => v.path === view.path)
    if (targetIndex === -1 || targetIndex === state.visitedViews.length - 1) return
    state.visitedViews = state.visitedViews.slice(0, targetIndex + 1)
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, state.visitedViews)
  }
}

const actions = {
  addView({ commit }, view) {
    commit('ADD_VIEW', view)
    commit('ADD_CACHED_VIEW', view)
  },
  delView({ commit, state }, view) {
    commit('DEL_VIEW', view)
    commit('DEL_CACHED_VIEW', view)
    return state.visitedViews
  },
  delOthersViews({ commit, state }, view) {
    commit('DEL_OTHERS_VIEWS', view)
    commit('DEL_OTHERS_CACHED_VIEWS', view)
    return state.visitedViews
  },
  delAllViews({ commit, state }) {
    commit('DEL_ALL_VIEWS')
    commit('DEL_ALL_CACHED_VIEWS')
    return state.visitedViews
  },
  delLeftViews({ commit, state }, view) {
    commit('DEL_LEFT_VIEWS', view)
    return state.visitedViews
  },
  delRightViews({ commit, state }, view) {
    commit('DEL_RIGHT_VIEWS', view)
    return state.visitedViews
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
