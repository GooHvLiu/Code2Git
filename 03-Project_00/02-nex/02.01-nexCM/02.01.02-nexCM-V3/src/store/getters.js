/**
 * ==========================================
 * Vuex 全局 Getters
 * ==========================================
 * 统一出口，组件中通过 this.$store.getters.xxx 使用
 * 避免组件中直接访问深层 state，便于维护
 */
const getters = {
  // app 模块
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  /** 全局 Loading 是否显示（计数 > 0 时为 true） */
  globalLoading: state => state.app.globalLoading > 0,

  // user 模块
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,

  // permission 模块
  routes: state => state.permission.routes,
  userMenu: state => state.permission.userMenu,

  // tagsView 模块
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // errorLog 模块
  errorLogs: state => state.errorLog.logs,

  // websocket 模块
  wsConnected: state => state.websocket.connected,
  wsAuthenticated: state => state.websocket.authenticated,
  plcConnected: state => state.websocket.plcConnected,
  isWsOnline: state => state.websocket.connected && state.websocket.authenticated,
  isPlcOnline: state => state.websocket.plcConnected,
  isOnline: (state, getters) => getters.isWsOnline && getters.isPlcOnline,
  connectionStatusText: state => {
    if (!state.websocket.connected) {
      return state.websocket.reconnectAttempts > 0 ? `重连中(${state.websocket.reconnectAttempts})` : '离线'
    }
    if (!state.websocket.authenticated) return '认证中...'
    if (!state.websocket.plcConnected) return '设备未连接'
    return '在线'
  },

  // device 模块（设备数据统一管理）
  deviceInfo: state => state.device.info,
  deviceStatus: state => state.device.status,
  deviceStatusText: state => state.device.statusText,
  isDeviceOnline: state => state.device.status === 'running' || state.device.status === 'idle',
  realtimeParams: state => state.device.params,
  paramsConfig: state => state.device.paramsConfig,
  productionStats: state => state.device.production,
  currentBatch: state => state.device.currentBatch,
  currentAlarms: state => state.device.alarms.current,
  alarmStats: state => state.device.alarms,
  trendData: state => state.device.trendData,
  partsList: state => state.device.parts,
  runtimeStats: state => state.device.runtimeStats,
  // 视图模型转换（多页面复用）—— 引用 device 模块的 getter
  coreMetrics: (state, getters) => getters['device/coreMetrics'],
  realtimeParamsList: (state, getters) => getters['device/realtimeParamsList'],
  todayStats: (state, getters) => getters['device/todayStats'],
  oeeAnalysis: (state, getters) => getters['device/oeeAnalysis'],
  deviceStatusObj: (state, getters) => getters['device/deviceStatusObj'],
  deviceLastUpdateText: state => {
    if (!state.device.lastUpdateTime) return '从未更新'
    const diff = Math.floor((Date.now() - state.device.lastUpdateTime) / 1000)
    if (diff < 5) return '刚刚'
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    return `${Math.floor(diff / 3600)}小时前`
  }
}

export default getters
