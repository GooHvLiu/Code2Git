/**
 * store/modules/user.js - 用户状态模块
 * 
 * 管理：Token、用户信息、角色、权限
 * 
 * 注意：当前 getInfo 使用 mock 数据，对接后端时改为调用真实接口
 */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

// 获取默认状态
const getDefaultState = () => {
  return {
    token: getToken(), // 从 Cookie 获取
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  /**
   * 用户登录
   * @param {Object} userInfo - { username, password }
   */
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token) // 存入 Cookie
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
   * 获取用户信息
   * 
   * 注意：当前是 mock 数据，对接后端时使用接口返回的数据
   */
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // ========== Mock 数据（对接后端时删除这部分，改用真实接口） ==========
      const mockData = {
        token: state.token,
        name: '管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        introduction: '系统管理员',
        roles: ['admin'],
        permissions: ['*']
      }
      commit('SET_NAME', mockData.name)
      commit('SET_AVATAR', mockData.avatar)
      commit('SET_ROLES', mockData.roles)
      commit('SET_PERMISSIONS', mockData.permissions)
      resolve(mockData)
      // ========== Mock 结束 ==========

      // ========== 对接后端时使用以下代码 ==========
      // getInfo(state.token).then(response => {
      //   const { data } = response
      //   if (!data) {
      //     return reject('验证失败，请重新登录')
      //   }
      //   const { name, avatar, roles, permissions } = data
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles 必须是非空数组!')
      //   }
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_ROLES', roles)
      //   commit('SET_PERMISSIONS', permissions)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  /**
   * 登出
   */
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 删除 Cookie
        resetRouter() // 重置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 重置 Token（Token 过期时调用）
   */
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
