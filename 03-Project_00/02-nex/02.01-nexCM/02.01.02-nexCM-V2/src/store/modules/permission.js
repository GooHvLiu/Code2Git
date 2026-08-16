/**
 * ==========================================
 * Permission 模块 - 路由权限与菜单
 * ==========================================
 * 管理动态路由、侧边栏菜单
 */
import { constantRoutes } from '@/router/constantRoutes'
import { requestGetUserMenuApi } from '@/api/login'
import { formatMenu } from '@/router/helper/menuHelper'
import { buildDynamicRoutes, filterRoutesByRoles } from '@/router/helper/routerHelper'

const state = {
  /** 侧边栏菜单数据 */
  userMenu: [],
  /** 完整路由表（静态 + 动态） */
  routes: [],
  /** 动态添加的路由 */
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENU: (state, menu) => {
    state.userMenu = menu
  }
}

const actions = {
  /**
   * 生成路由
   * 从后端获取菜单数据，构建动态路由，按用户角色过滤
   * @returns {Array} 动态路由数组
   */
  async generateRoutes({ commit, rootState }) {
    const res = await requestGetUserMenuApi()
    const rawArr = res.data || []

    // 格式化菜单数据（侧边栏用）
    const menuList = formatMenu(rawArr)
    commit('SET_MENU', menuList)

    // 构建动态路由
    let dynamicRoutes = buildDynamicRoutes(rawArr)

    // 按用户角色过滤（后端菜单 meta.roles 配置时生效）
    const userRoles = rootState.user.roles || []
    dynamicRoutes = filterRoutesByRoles(dynamicRoutes, userRoles)

    commit('SET_ROUTES', dynamicRoutes)
    return dynamicRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
