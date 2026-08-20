/**
 * ==========================================
 * ErrorLog 模块 - 前端错误日志
 * ==========================================
 * 收集运行时错误，便于排查问题
 * 根据 settings.errorLog 配置决定收集环境：
 *   - 'production'：仅生产环境收集
 *   - 'always'：始终收集
 *   - 'none'：不收集
 */
import settings from '@/settings'

const state = {
  /** 错误日志列表 */
  logs: []
}

const mutations = {
  /**
   * 添加错误日志
   * @param {Object} log - { message, stack, info, url, time }
   */
  ADD_ERROR_LOG(state, log) {
    state.logs.push({
      ...log,
      time: new Date().toLocaleString()
    })
  },
  /** 清空错误日志 */
  CLEAR_ERROR_LOG(state) {
    state.logs = []
  }
}

const actions = {
  /**
   * 添加错误日志
   * @param {Object} errorInfo - { err, vm, info }
   */
  addErrorLog({ commit }, errorInfo) {
    // 根据配置决定是否收集
    const env = process.env.NODE_ENV
    if (settings.errorLog === 'none') return
    if (settings.errorLog === 'production' && env !== 'production') return

    const { err, info } = errorInfo
    commit('ADD_ERROR_LOG', {
      message: err?.message || '未知错误',
      stack: err?.stack || '',
      info: info || '',
      url: window.location.href
    })
  },
  /** 清空错误日志 */
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
