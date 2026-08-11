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
  roles: []
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
  RESET_STATE: state => {
    state.token = ''
    state.userInfo = getDefaultUserInfo()
    state.roles = []
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

    const { id, username, role, avatar, real_name: realName, sex, remark } = res.data
    const userInfo = { id, username, role, avatar, realName, sex, remark }

    commit('SET_USER_INFO', userInfo)
    // role 字段可能是字符串或数组，统一转数组
    const roles = role ? (Array.isArray(role) ? role : [role]) : []
    commit('SET_ROLES', roles)
  },

  /**
   * 退出登录
   * 清除前端状态，重置路由
   */
  logout({ commit }) {
    return new Promise(resolve => {
      try {
        removeToken()
        clearLoginStorage()
        commit('RESET_STATE')
        resetRouter()
        resolve()
      } catch (e) {
        resolve()
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
