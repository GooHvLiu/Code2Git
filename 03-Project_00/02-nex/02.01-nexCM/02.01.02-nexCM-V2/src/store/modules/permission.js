/**
 * store/modules/permission.js - 权限路由模块
 * 
 * 核心逻辑：根据用户角色过滤 asyncRoutes，生成可访问的路由表
 */
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 判断当前路由是否有权限访问
 * @param {Array} roles - 用户角色列表
 * @param {Object} route - 路由配置
 * @returns {boolean}
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 路由配置了 roles，判断用户角色是否在其中
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 没有配置 roles，默认所有人可访问
    return true
  }
}

/**
 * 递归过滤异步路由表
 * @param {Array} routes - asyncRoutes
 * @param {Array} roles - 用户角色
 * @returns {Array} 可访问的路由
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // 有子路由，递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 完整路由表（常量 + 动态）
  addRoutes: [] // 动态添加的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  /**
   * 根据角色生成路由
   * @param {Array} roles - 用户角色列表
   */
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        // admin 角色可以访问所有路由
        accessedRoutes = asyncRoutes || []
      } else {
        // 其他角色按权限过滤
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
