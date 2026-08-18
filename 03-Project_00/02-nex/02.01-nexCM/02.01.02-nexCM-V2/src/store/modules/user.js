/**
 * ==========================================
 * User 模块 - 用户信息与权限
 * ==========================================
 * 管理 Token、用户信息、角色权限
 */
import { requestGetUserInfoApi } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'
import { clearLoginStorage } from '@/utils/storage'
import { resetRouter } from '@/router'

const getDefaultUserInfo = () => ({
  id: null,
  username: null,
  role: null,
  avatar: null,
  realName: null,
  sex: null,
  remark: null
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

    const { id, username, role, avatar, real_name: realName, sex, remark, permissions } = res.data
    const userInfo = { id, username, role, avatar, realName, sex, remark }

    commit('SET_USER_INFO', userInfo)
    // role 字段可能是字符串或数组，统一转数组
    const roles = role ? (Array.isArray(role) ? role : [role]) : []
    commit('SET_ROLES', roles)
    // 权限码列表，后端可能返回 permissions 字段
    const permList = Array.isArray(permissions) ? permissions : []
    commit('SET_PERMISSIONS', permList)
  },

  /**
   * 退出登录
   * 清除前端状态，重置路由
   */
  async logout({ commit }) {
    try {
      removeToken()
      clearLoginStorage()
      commit('RESET_STATE')
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
