/**
 * ==========================================
 * Permission 模块 - 路由权限与菜单
 * ==========================================
 * 支持菜单缓存（localStorage + 版本号检测 + 多语言）
 */
import { constantRoutes } from '@/router/constant/constantRoutes'
import { requestGetUserMenuApi, getMenuVersionApi } from '@/api'
import { formatMenu } from '@/router/helper/menuHelper'
import { buildDynamicRoutes, filterRoutesByRoles } from '@/router/helper/routerHelper'
import { CODE_MENU_NOT_MODIFIED } from '@/utils/constants'
import i18n from '@/i18n'

/** 菜单版本号缓存 key（全局，不分语言） */
const MENU_VERSION_KEY = 'nex_menu_version'

/** 按语言获取菜单缓存 key */
function getMenuCacheKey(lang) {
  return `nex_menu_cache_${lang}`
}

/** 从接口响应中提取菜单数组 */
function extractMenu(res) {
  const data = res?.data
  return Array.isArray(data?.menu) ? data.menu : Array.isArray(data) ? data : []
}

/** 读取指定语言的缓存菜单，损坏则清除并返回 null */
function getCachedMenu(lang) {
  try {
    const raw = localStorage.getItem(getMenuCacheKey(lang))
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && !Array.isArray(parsed)) {
      localStorage.removeItem(getMenuCacheKey(lang))
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(getMenuCacheKey(lang))
    return null
  }
}

/** 提交菜单和路由 */
function commitMenuAndRoutes(commit, rootState, rawArr, version) {
  const userRole = rootState.user?.userInfo?.role || ''
  commit('SET_MENU', formatMenu(rawArr, userRole))
  commit('SET_MENU_VERSION', version)
  let routes = buildDynamicRoutes(rawArr)
  routes = filterRoutesByRoles(routes, rootState.user.roles || [])
  commit('SET_ROUTES', routes)
  return routes
}

const state = {
  userMenu: [],
  routes: [],
  addRoutes: [],
  menuVersion: null,
  routesGenerated: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENU: (state, menu) => { state.userMenu = menu },
  SET_MENU_VERSION: (state, version) => { state.menuVersion = version },
  SET_ROUTES_GENERATED: (state, val) => { state.routesGenerated = val }
}

const actions = {
  /**
   * 生成路由（带菜单缓存 + 多语言）
   */
  async generateRoutes({ commit, rootState }) {
    const lang = i18n.locale
    const cachedMenu = getCachedMenu(lang)
    const cachedVersion = localStorage.getItem(MENU_VERSION_KEY)
    let menuTree = []
    let newVersion = cachedVersion

    try {
      // 1. 获取最新版本号
      const versionRes = await getMenuVersionApi()
      const latestVersion = versionRes.data?.version || null

      // 2. 版本一致且有非空缓存 → 直接用缓存
      if (cachedMenu && cachedMenu.length > 0 && cachedVersion && latestVersion && String(cachedVersion) === String(latestVersion)) {
        menuTree = cachedMenu
        newVersion = latestVersion
      } else {
        // 3. 请求菜单（带语言参数，有非空缓存时传version）
        const res = await requestGetUserMenuApi(cachedMenu && cachedMenu.length > 0 ? latestVersion : null, lang)

        // 4. 返回10304 → 用缓存
        if (res.code === CODE_MENU_NOT_MODIFIED) {
          menuTree = cachedMenu || []
          newVersion = latestVersion
        } else {
          // 5. 正常返回 → 更新当前语言的缓存
          menuTree = extractMenu(res)
          newVersion = res.data?.version || latestVersion
          localStorage.setItem(getMenuCacheKey(lang), JSON.stringify(menuTree))
          localStorage.setItem(MENU_VERSION_KEY, String(newVersion))
        }
      }
    } catch {
      // version接口失败 → 降级直接请求菜单
      const res = await requestGetUserMenuApi(null, lang)
      menuTree = extractMenu(res)
      newVersion = res.data?.version || null
      if (menuTree.length) {
        localStorage.setItem(getMenuCacheKey(lang), JSON.stringify(menuTree))
        localStorage.setItem(MENU_VERSION_KEY, String(newVersion))
      }
    }

    const result = commitMenuAndRoutes(commit, rootState, menuTree, newVersion)
    commit('SET_ROUTES_GENERATED', true)
    return result
  },

  /** 强制刷新菜单（清除所有语言缓存后重新请求） */
  async refreshMenu({ dispatch, commit }) {
    // 清除所有语言的菜单缓存
    Object.keys(localStorage)
      .filter(key => key.startsWith('nex_menu_cache_'))
      .forEach(key => localStorage.removeItem(key))
    localStorage.removeItem(MENU_VERSION_KEY)
    commit('SET_ROUTES_GENERATED', false)
    return await dispatch('generateRoutes')
  }
}

export default { namespaced: true, state, mutations, actions }
