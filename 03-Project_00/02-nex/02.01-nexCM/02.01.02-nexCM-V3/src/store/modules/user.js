/**
 * ==========================================
 * User 模块 - 用户信息与权限
 * ==========================================
 * 管理 Token、用户信息、角色权限
 */
import { requestGetUserInfoApi } from '@/api'
import { getToken, removeToken } from '@/utils/auth'
import ws from '@/utils/websocket'
import { clearLoginStorage } from '@/utils/storage'
import { resetRouter } from '@/router'

const getDefaultUserInfo = () => ({
  id: null,
  username: null,
  role: null,
  avatar: null,
  realName: null,
  real_name: null,
  sex: null,
  remark: null,
  phone: null,
  email: null,
  status: null,
  createTime: null,
  create_time: null,
  deptId: null,
  dept_id: null,
  loginIp: null,
  login_ip: null,
  loginDate: null,
  login_date: null
})

const state = {
  token: getToken(),
  userInfo: getDefaultUserInfo(),
  roles: [],
  /** 权限码列表（如 ['user:add', 'user:edit']），用于按钮级权限控制 */
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  RESET_STATE: state => {
    state.token = ''
    state.userInfo = getDefaultUserInfo()
    state.roles = []
    state.permissions = []
  }
}

const actions = {
  /**
   * 获取用户信息
   * 从后端拉取用户信息和角色，存入 state
   */
  async getUserInfo({ commit }) {
    const res = await requestGetUserInfoApi()
    if (!res || !res.data) return

    // 后端返回下划线式字段，同时保留原字段和驼峰式字段，兼容前端各种写法
    const data = res.data
    const userInfo = {
      ...data,
      // 常用字段转成驼峰式，兼容前端代码
      realName: data.real_name || data.realName,
      createTime: data.create_time || data.createTime,
      deptId: data.dept_id || data.deptId,
      loginIp: data.login_ip || data.loginIp,
      loginDate: data.login_date || data.loginDate,
      isFirstLogin: data.is_first_login || data.isFirstLogin,
      firstLoginAt: data.first_login_at || data.firstLoginAt
    }

    commit('SET_USER_INFO', userInfo)
    // role 字段可能是字符串或数组，统一转数组
    const roles = data.role ? (Array.isArray(data.role) ? data.role : [data.role]) : []
    commit('SET_ROLES', roles)
    // 权限码列表，后端可能返回 permissions 字段
    const permList = Array.isArray(data.permissions) ? data.permissions : []
    commit('SET_PERMISSIONS', permList)
  },

  /**
   * 退出登录
   * 清除前端状态，重置路由
   */
  async logout({ commit, dispatch }) {
    try {
      // 断开 WebSocket 连接
      ws.disconnect()
      removeToken()
      clearLoginStorage()
      commit('RESET_STATE')
      // 清除标签页缓存，避免切换用户后残留上一个用户的页面
      dispatch('tagsView/delAllViews', null, { root: true })
      // 清除菜单缓存，避免重新登录后使用旧的菜单缓存导致 404
      Object.keys(localStorage)
        .filter(key => key.startsWith('nex_menu_'))
        .forEach(key => localStorage.removeItem(key))
      // 重置权限模块的路由生成标志，确保重新登录时重新生成路由
      commit('permission/SET_ROUTES_GENERATED', false, { root: true })
      commit('permission/SET_ROUTES', [], { root: true })
      resetRouter()
    } catch (e) {
      // 忽略清理过程中的异常，确保退出流程不中断
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
