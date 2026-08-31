/**
 * ==========================================
 * TagsView 标签页状态管理
 * ==========================================
 * 管理已打开的标签页列表，支持增删、关闭其他、关闭全部
 * 数据持久化到 sessionStorage，刷新页面后标签不丢失
 */
import { setSessionStorage, getSessionStorage } from '@/utils/storage'
import { SESSIONSTORAGE_KEYS } from '@/utils/storageKey'
import { HOME_TAG, ROUTE_PATHS } from '@/router/constant/pathConstants'
import i18n from '@/i18n'
import { resolveMenuTitle } from '@/router/helper/menuTitle'

/** 获取国际化的首页标签 */
function getHomeTag() {
  return { ...HOME_TAG, title: i18n.t('menu.home.overview.default') }
}

/** 从 sessionStorage 读取并过滤掉无效标签（登录页、404等 hidden 路由） */
function getValidVisitedViews() {
  const saved = getSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST)
  if (!Array.isArray(saved)) return [getHomeTag()]
  // 过滤掉登录页等不应该出现在标签栏的路由（路径过滤）
  const invalidPaths = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.NOT_FOUND, ROUTE_PATHS.FORBIDDEN, ROUTE_PATHS.REDIRECT, ROUTE_PATHS.LICENSE_IMPORT]
  // 过滤掉标题包含登录页标题的标签（双重保险，处理旧数据）
  const invalidTitles = ['欢迎登录', 'login.title']
  const filtered = saved.filter(v => {
    if (invalidPaths.includes(v.path)) return false
    // title 不是字符串的旧数据直接过滤掉（兼容历史数据）
    if (typeof v.title !== 'string') return false
    if (invalidTitles.some(t => v.title.includes(t))) return false
    return true
  })
  // 确保首页标签存在
  if (!filtered.some(v => v.path === HOME_TAG.path)) {
    filtered.unshift(getHomeTag())
  }
  return filtered
}

const state = {
  /** 已访问的标签页列表 */
  visitedViews: getValidVisitedViews(),
  /** 已缓存的组件名列表（用于 keep-alive include） */
  cachedViews: []
}

const mutations = {
  /** 添加标签页（已存在则不重复添加） */
  ADD_VIEW(state, view) {
    // 过滤掉 hidden 路由（登录页、404、403、重定向等），不显示在标签栏
    // Vue Router 3 中 hidden 属性在 matched 数组的路由记录中，不在 route 对象上
    const isHiddenRoute = view.hidden === true ||
      (Array.isArray(view.matched) && view.matched.some(r => r.hidden === true)) ||
      (view.meta && view.meta.hidden === true)
    if (isHiddenRoute) return
    // 额外路径过滤（双重保险）
    const invalidPaths = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.NOT_FOUND, ROUTE_PATHS.FORBIDDEN, ROUTE_PATHS.REDIRECT, ROUTE_PATHS.LICENSE_IMPORT]
    if (invalidPaths.includes(view.path)) return
    if (state.visitedViews.some(v => v.path === view.path)) return
    const rawTitle = view.meta?.titles?.[view.meta.titles.length - 1] || view.meta?.title || 'no-name'
    state.visitedViews.push({
      name: view.name,
      path: view.path,
      title: resolveMenuTitle(rawTitle),
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
    state.visitedViews = [getHomeTag()]
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
