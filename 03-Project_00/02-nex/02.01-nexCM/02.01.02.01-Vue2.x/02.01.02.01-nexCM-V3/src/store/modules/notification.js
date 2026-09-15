/**
 * ==========================================
 * Notification Store Module
 * ==========================================
 * 通知中心 Vuex 模块
 * 用于存储未读数量，实现铃铛组件和通知中心页面的状态同步
 */

const state = {
  // 未读通知数量
  unreadCount: 0
}

const mutations = {
  // 设置未读数量
  SET_UNREAD_COUNT(state, count) {
    state.unreadCount = count
  },
  // 增加未读数量
  INCREMENT_UNREAD_COUNT(state, count = 1) {
    state.unreadCount += count
  },
  // 减少未读数量
  DECREMENT_UNREAD_COUNT(state, count = 1) {
    state.unreadCount = Math.max(0, state.unreadCount - count)
  },
  // 清零未读数量
  CLEAR_UNREAD_COUNT(state) {
    state.unreadCount = 0
  }
}

const actions = {
  // 设置未读数量
  setUnreadCount({ commit }, count) {
    commit('SET_UNREAD_COUNT', count)
  },
  // 增加未读数量
  incrementUnreadCount({ commit }, count) {
    commit('INCREMENT_UNREAD_COUNT', count)
  },
  // 减少未读数量
  decrementUnreadCount({ commit }, count) {
    commit('DECREMENT_UNREAD_COUNT', count)
  },
  // 清零未读数量
  clearUnreadCount({ commit }) {
    commit('CLEAR_UNREAD_COUNT')
  }
}

const getters = {
  // 未读通知数量
  unreadCount: state => state.unreadCount,
  // 是否有未读通知
  hasUnread: state => state.unreadCount > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
