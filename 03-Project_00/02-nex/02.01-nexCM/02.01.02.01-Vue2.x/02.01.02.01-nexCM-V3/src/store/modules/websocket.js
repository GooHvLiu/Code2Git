/**
 * ==========================================
 * WebSocket 状态管理模块
 * ==========================================
 * 管理 WebSocket 连接状态、心跳状态、最后心跳时间等
 * 供 HeartbeatIndicator 等组件使用
 */
import i18n from '@/i18n'

const state = {
  /** 是否连接成功 */
  connected: false,
  /** 是否认证成功 */
  authenticated: false,
  /** PLC 是否连接成功 */
  plcConnected: false,
  /** 最后心跳时间（时间戳） */
  lastHeartbeat: null,
  /** 最后收到消息时间（时间戳） */
  lastMessageTime: null,
  /** 重连次数 */
  reconnectAttempts: 0,
  /** 心跳间隔时间（毫秒） */
  heartbeatInterval: 25000,
  /** 是否启用心跳日志（默认开启，方便调试） */
  enableHeartbeatLog: true,
  /** 是否正在手动重连中 */
  isReconnecting: false,
  /** 重连结果（null / 'success' / 'failed'） */
  reconnectResult: null,
  /** 重连失败的错误信息 */
  reconnectError: null
}

const mutations = {
  /**
   * 设置连接状态
   * @param {Object} state - Vuex state
   * @param {boolean} connected - 是否连接
   */
  SET_CONNECTED(state, connected) {
    state.connected = connected
  },

  /**
   * 设置认证状态
   * @param {Object} state - Vuex state
   * @param {boolean} authenticated - 是否认证
   */
  SET_AUTHENTICATED(state, authenticated) {
    state.authenticated = authenticated
  },

  /**
   * 设置 PLC 连接状态
   * @param {Object} state - Vuex state
   * @param {boolean} connected - PLC 是否连接
   */
  SET_PLC_CONNECTED(state, connected) {
    state.plcConnected = connected
  },

  /**
   * 更新最后心跳时间
   * @param {Object} state - Vuex state
   */
  UPDATE_HEARTBEAT(state) {
    state.lastHeartbeat = Date.now()
  },

  /**
   * 更新最后消息时间
   * @param {Object} state - Vuex state
   */
  UPDATE_MESSAGE_TIME(state) {
    state.lastMessageTime = Date.now()
  },

  /**
   * 设置重连次数
   * @param {Object} state - Vuex state
   * @param {number} attempts - 重连次数
   */
  SET_RECONNECT_ATTEMPTS(state, attempts) {
    state.reconnectAttempts = attempts
  },

  /**
   * 设置心跳间隔
   * @param {Object} state - Vuex state
   * @param {number} interval - 心跳间隔（毫秒）
   */
  SET_HEARTBEAT_INTERVAL(state, interval) {
    state.heartbeatInterval = interval
  },

  /**
   * 设置是否启用心跳日志
   * @param {Object} state - Vuex state
   * @param {boolean} enable - 是否启用
   */
  SET_ENABLE_HEARTBEAT_LOG(state, enable) {
    state.enableHeartbeatLog = enable
  },

  /**
   * 设置是否正在手动重连中
   * @param {Object} state - Vuex state
   * @param {boolean} reconnecting - 是否正在重连
   */
  SET_RECONNECTING(state, reconnecting) {
    state.isReconnecting = reconnecting
  },

  /**
   * 设置重连结果
   * @param {Object} state - Vuex state
   * @param {string|null} result - 重连结果（null / 'success' / 'failed'）
   */
  SET_RECONNECT_RESULT(state, result) {
    state.reconnectResult = result
  },

  /**
   * 设置重连错误信息
   * @param {Object} state - Vuex state
   * @param {string|null} error - 错误信息
   */
  SET_RECONNECT_ERROR(state, error) {
    state.reconnectError = error
  },

  /**
   * 重置状态（断开连接时调用）
   * @param {Object} state - Vuex state
   */
  RESET_STATE(state) {
    state.connected = false
    state.authenticated = false
    state.lastHeartbeat = null
    state.isReconnecting = false
    state.reconnectResult = null
    state.reconnectError = null
  }
}

const actions = {
  /**
   * 连接成功
   * @param {Object} context - Vuex context
   */
  onConnected({ commit }) {
    commit('SET_CONNECTED', true)
    commit('SET_RECONNECT_ATTEMPTS', 0)
  },

  /**
   * 认证成功
   * @param {Object} context - Vuex context
   */
  onAuthenticated({ commit }) {
    commit('SET_AUTHENTICATED', true)
  },

  /**
   * PLC 连接状态变化
   * @param {Object} context - Vuex context
   * @param {boolean} connected - PLC 是否连接
   */
  onPlcStatusChanged({ commit }, connected) {
    commit('SET_PLC_CONNECTED', connected)
  },

  /**
   * 收到心跳响应
   * @param {Object} context - Vuex context
   */
  onHeartbeat({ commit }) {
    commit('UPDATE_HEARTBEAT')
  },

  /**
   * 收到消息
   * @param {Object} context - Vuex context
   */
  onMessage({ commit }) {
    commit('UPDATE_MESSAGE_TIME')
  },

  /**
   * 断开连接
   * @param {Object} context - Vuex context
   */
  onDisconnected({ commit }) {
    commit('RESET_STATE')
  },

  /**
   * 开始重连
   * @param {Object} context - Vuex context
   * @param {number} attempts - 重连次数
   */
  onReconnecting({ commit }, attempts) {
    commit('SET_RECONNECT_ATTEMPTS', attempts)
  },

  /**
   * 开始手动重连
   * @param {Object} context - Vuex context
   */
  startManualReconnect({ commit }) {
    commit('SET_RECONNECTING', true)
    commit('SET_RECONNECT_RESULT', null)
    commit('SET_RECONNECT_ERROR', null)
  },

  /**
   * 手动重连成功
   * @param {Object} context - Vuex context
   */
  manualReconnectSuccess({ commit }) {
    commit('SET_RECONNECTING', false)
    commit('SET_RECONNECT_RESULT', 'success')
    commit('SET_RECONNECT_ERROR', null)
  },

  /**
   * 手动重连失败
   * @param {Object} context - Vuex context
   * @param {string} error - 错误信息
   */
  manualReconnectFailed({ commit }, error) {
    commit('SET_RECONNECTING', false)
    commit('SET_RECONNECT_RESULT', 'failed')
    commit('SET_RECONNECT_ERROR', error || '未知错误')
  },

  /**
   * 重置手动重连状态
   * @param {Object} context - Vuex context
   */
  resetManualReconnect({ commit }) {
    commit('SET_RECONNECTING', false)
    commit('SET_RECONNECT_RESULT', null)
    commit('SET_RECONNECT_ERROR', null)
  },

  /**
   * 设置心跳间隔
   * @param {Object} context - Vuex context
   * @param {number} interval - 心跳间隔（毫秒）
   */
  setHeartbeatInterval({ commit }, interval) {
    commit('SET_HEARTBEAT_INTERVAL', interval)
  },

  /**
   * 设置是否启用心跳日志
   * @param {Object} context - Vuex context
   * @param {boolean} enable - 是否启用
   */
  setEnableHeartbeatLog({ commit }, enable) {
    commit('SET_ENABLE_HEARTBEAT_LOG', enable)
  }
}

const getters = {
  /**
   * WebSocket 是否在线（连接且认证）
   * @param {Object} state - Vuex state
   * @returns {boolean}
   */
  isWsOnline: state => state.connected && state.authenticated,

  /**
   * PLC 是否在线
   * @param {Object} state - Vuex state
   * @returns {boolean}
   */
  isPlcOnline: state => state.plcConnected,

  /**
   * 是否完全在线（WebSocket 连接且 PLC 连接）
   * @param {Object} state - Vuex state
   * @returns {boolean}
   */
  isOnline: (state, getters) => getters.isWsOnline && getters.isPlcOnline,

  /**
   * 是否正在手动重连中
   * @param {Object} state - Vuex state
   * @returns {boolean}
   */
  isReconnecting: state => state.isReconnecting,

  /**
   * 重连结果
   * @param {Object} state - Vuex state
   * @returns {string|null}
   */
  reconnectResult: state => state.reconnectResult,

  /**
   * 重连错误信息
   * @param {Object} state - Vuex state
   * @returns {string|null}
   */
  reconnectError: state => state.reconnectError,

  /**
   * 最后心跳时间（格式化字符串）
   * @param {Object} state - Vuex state
   * @returns {string}
   */
  lastHeartbeatText: state => {
    if (!state.lastHeartbeat) return i18n.t('heartbeat.timeNever')
    const diff = Math.floor((Date.now() - state.lastHeartbeat) / 1000)
    if (diff < 60) return i18n.t('heartbeat.timeSecondsAgo', { n: diff })
    if (diff < 3600) return i18n.t('heartbeat.timeMinutesAgo', { n: Math.floor(diff / 60) })
    return i18n.t('heartbeat.timeHoursAgo', { n: Math.floor(diff / 3600) })
  },

  /**
   * 连接状态文本
   * 状态优先级（从低到高）：
   * 0. 手动重连中 → 重连中
   * 1. 服务器未连接 → 离线 / 重连中
   * 2. 服务器已连接但未认证 → 认证中
   * 3. 服务器已连接且认证，但设备未连接 → 设备未连接
   * 4. 服务器已连接且认证 + 设备已连接 → 在线
   *
   * 连接服务器是基础，没有连接服务器就不考虑 PLC 状态
   *
   * @param {Object} state - Vuex state
   * @returns {string}
   */
  connectionStatusText: (state) => {
    // 0. 手动重连中
    if (state.isReconnecting) {
      return i18n.t('heartbeat.statusManualReconnecting')
    }
    // 1. 服务器未连接
    if (!state.connected) {
      if (state.reconnectAttempts > 0) {
        return i18n.t('heartbeat.statusReconnecting', { count: state.reconnectAttempts })
      }
      return i18n.t('heartbeat.statusOffline')
    }
    // 2. 服务器已连接但未认证
    if (!state.authenticated) {
      return i18n.t('heartbeat.statusAuthenticating')
    }
    // 3. 服务器已连接且认证，但设备未连接
    if (!state.plcConnected) {
      return i18n.t('heartbeat.statusDeviceDisconnected')
    }
    // 4. 服务器已连接且认证 + PLC 已连接
    return i18n.t('heartbeat.statusOnline')
  },

  /**
   * 连接状态类型（用于样式判断）
   * @param {Object} state - Vuex state
   * @param {Object} getters - Vuex getters
   * @returns {string} online / warning / offline / reconnecting
   */
  connectionStatusType: (state, getters) => {
    if (state.isReconnecting) return 'reconnecting'
    if (getters.isOnline) return 'online'
    if (getters.isWsOnline) return 'warning' // 服务器在线但 PLC 未连接
    return 'offline'
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
