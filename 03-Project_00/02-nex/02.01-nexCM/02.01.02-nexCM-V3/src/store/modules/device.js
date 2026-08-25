/**
 * ==========================================
 * 设备数据统一管理模块
 * ==========================================
 * 职责：统一管理设备的所有业务数据，供各业务页面读取
 * 包括：设备信息、运行状态、实时参数、生产统计、报警、趋势、部件寿命
 *
 * 设计原则：
 * 1. 各页面只从本模块读数据，不直接请求后端
 * 2. 数据更新统一入口：WebSocket 消息 / 轮询 / 手动刷新
 * 3. 与 websocket 模块分工：websocket 管连接（传输层），本模块管数据（应用层）
 *
 * 使用方式：
 *   import { mapGetters } from 'vuex'
 *   computed: {
 *     ...mapGetters(['deviceInfo', 'deviceStatus', 'realtimeParams', 'productionStats'])
 *   }
 *   mounted() {
 *     this.$store.dispatch('device/fetchAllData')
 *   }
 */

// ==================== 初始状态 ====================
const state = {
  // ---------- 设备基本信息 ----------
  info: {
    name: 'nexCM-灌装机-001',
    code: 'NEXCM-FILL-2026-001',
    model: 'nexCM-V2 全自动灌装机',
    location: '中国 · 江苏无锡 · 生产车间A区',
    installDate: '2026-01-15',
    manufacturer: 'nexCM 科技',
    ip: '192.168.1.100'
  },

  // ---------- 运行状态 ----------
  /** 运行状态：running / idle / fault / offline */
  status: 'running',
  /** 状态文本 */
  statusText: '运行中',
  /** 当前运行时长（毫秒） */
  runningDuration: 0,
  /** 本次运行开始时间 */
  runningStartTime: null,

  // ---------- 实时参数 ----------
  params: {
    speed: 1200,        // 运行速度（瓶/h）
    fillVolume: 2.0,    // 灌装体积（mL）
    vacuum: -0.085,     // 真空度（MPa）
    temperature: 22.5,  // 灌装温度（℃）
    pressure: 0.12,     // 加塞压力（MPa）
    vibration: 0.8      // 设备振动（mm/s）
  },

  /** 参数配置（范围、单位、名称），用于校验和展示 */
  paramsConfig: {
    speed:       { name: '运行速度', unit: '瓶/h', min: 0,    max: 1500,  decimal: 0 },
    fillVolume:  { name: '灌装体积', unit: 'mL',   min: 0.5,  max: 10,    decimal: 1 },
    vacuum:      { name: '真空度',   unit: 'MPa',  min: -0.1, max: -0.05, decimal: 3 },
    temperature: { name: '灌装温度', unit: '℃',    min: 15,   max: 35,    decimal: 1 },
    pressure:    { name: '加塞压力', unit: 'MPa',  min: 0.05, max: 0.2,   decimal: 2 },
    vibration:   { name: '设备振动', unit: 'mm/s', min: 0,    max: 2.5,   decimal: 1 }
  },

  // ---------- 生产统计 ----------
  production: {
    todayOutput: 8560,      // 今日产量
    todayTarget: 12000,     // 今日目标
    todayRate: 71.3,        // 今日完成率
    shiftOutput: 3240,      // 本班产量
    shiftTarget: 5000,      // 本班目标
    shiftName: '白班',       // 当前班次
    totalOutput: 125680,    // 累计产量
    qualifiedRate: 98.5,    // 合格率
    qualifiedCount: 8432,   // 合格数
    unqualifiedCount: 128,  // 不合格数
    // OEE 三要素
    oee: 85.6,
    availability: 92.8,
    performance: 94.2,
    quality: 97.9
  },

  // ---------- 当前批次 ----------
  currentBatch: {
    batchNo: 'B20260824001',
    productName: '卡式瓶灌装',
    fillVolume: 2.0,
    startTime: '08:00:00',
    estimatedEnd: '18:00:00',
    produced: 3240,
    target: 5000,
    progress: 64.8,
    estimatedTime: '2小时28分',
    qualifiedRate: 98.5
  },

  // ---------- 报警数据 ----------
  alarms: {
    /** 当前未处理报警列表 */
    current: [],
    /** 今日报警总数 */
    todayCount: 12,
    /** 紧急报警数 */
    criticalCount: 2,
    /** 未处理数 */
    pendingCount: 5,
    /** 按类别统计 { category: count } */
    categoryStats: {
      position: 35,    // 位置异动
      vacuum: 28,      // 真空异常
      servo: 22,       // 伺服使能
      timeout: 18,     // 超时
      temperature: 10,  // 温度异常
      other: 7          // 其他
    },
    /** 按级别统计 { level: count } */
    levelStats: {
      critical: 8,   // 紧急
      major: 32,     // 重要
      minor: 58,     // 一般
      info: 22       // 提示
    }
  },

  // ---------- 趋势数据（缓存） ----------
  /** 各参数近24小时趋势数据，每项为 { time, value } 数组 */
  trendData: {
    speed: [
      { time: '00:00', value: 0 }, { time: '02:00', value: 0 },
      { time: '04:00', value: 0 }, { time: '06:00', value: 120 },
      { time: '08:00', value: 850 }, { time: '10:00', value: 1200 },
      { time: '12:00', value: 1100 }, { time: '14:00', value: 1350 },
      { time: '16:00', value: 1280 }, { time: '18:00', value: 660 },
      { time: '20:00', value: 0 }, { time: '22:00', value: 0 }
    ],
    fillVolume: [],
    vacuum: [],
    temperature: [],
    output: []
  },

  // ---------- 部件寿命 ----------
  parts: [
    {
      id: 1,
      name: '灌装针组件',
      code: 'FILL-NEEDLE-001',
      spec: '2.0mL 标准型',
      icon: 'el-icon-aim',
      used: 8500,
      total: 10000,
      unit: '次',
      installDate: '2026-07-15',
      lastReplaceDate: '2026-07-15'
    },
    {
      id: 2,
      name: '灌装管组件',
      code: 'FILL-TUBE-001',
      spec: '硅胶管 φ8×12',
      icon: 'el-icon-s-operation',
      used: 420,
      total: 500,
      unit: '小时',
      installDate: '2026-08-01',
      lastReplaceDate: '2026-08-01'
    },
    {
      id: 3,
      name: '加塞杆',
      code: 'STOPPER-ROD-001',
      spec: '标准加塞杆',
      icon: 'el-icon-top-right',
      used: 15600,
      total: 20000,
      unit: '次',
      installDate: '2026-06-20',
      lastReplaceDate: '2026-06-20'
    },
    {
      id: 4,
      name: '真空组件',
      code: 'VACUUM-UNIT-001',
      spec: '真空发生器组件',
      icon: 'el-icon-download',
      used: 680,
      total: 800,
      unit: '小时',
      installDate: '2026-07-01',
      lastReplaceDate: '2026-07-01'
    }
  ],

  // ---------- 运行时长统计（今日） ----------
  runtimeStats: {
    running: 6.5,    // 运行时长（小时）
    idle: 0.8,       // 空闲时长
    fault: 0.2,      // 故障时长
    plannedStop: 0.5 // 计划停机
  },

  // ---------- 元数据 ----------
  /** 数据最后更新时间戳 */
  lastUpdateTime: null,
  /** 是否正在加载 */
  loading: false,
  /** 数据同步是否已启动 */
  syncStarted: false,
  /** 轮询定时器 ID */
  pollTimer: null
}

// ==================== Mutations ====================
const mutations = {
  // ---------- 设备信息 ----------
  SET_DEVICE_INFO(state, info) {
    state.info = { ...state.info, ...info }
  },

  // ---------- 运行状态 ----------
  SET_DEVICE_STATUS(state, { status, statusText }) {
    state.status = status
    state.statusText = statusText || state.statusText
    if (status === 'running' && !state.runningStartTime) {
      state.runningStartTime = Date.now()
    }
    if (status !== 'running') {
      state.runningStartTime = null
    }
  },
  UPDATE_RUNNING_DURATION(state) {
    if (state.runningStartTime) {
      state.runningDuration = Date.now() - state.runningStartTime
    }
  },

  // ---------- 实时参数 ----------
  /**
   * 更新单个参数
   * @param {Object} state
   * @param {Object} payload - { key, value }
   */
  UPDATE_PARAM(state, { key, value }) {
    if (Object.prototype.hasOwnProperty.call(state.params, key)) {
      state.params[key] = value
    }
  },
  /**
   * 批量更新参数
   * @param {Object} state
   * @param {Object} params - 键值对对象
   */
  UPDATE_PARAMS(state, params) {
    state.params = { ...state.params, ...params }
  },
  SET_PARAMS_CONFIG(state, config) {
    state.paramsConfig = { ...state.paramsConfig, ...config }
  },

  // ---------- 生产统计 ----------
  SET_PRODUCTION(state, production) {
    state.production = { ...state.production, ...production }
  },
  UPDATE_PRODUCTION(state, patch) {
    state.production = { ...state.production, ...patch }
  },

  // ---------- 当前批次 ----------
  SET_CURRENT_BATCH(state, batch) {
    state.currentBatch = { ...state.currentBatch, ...batch }
  },

  // ---------- 报警 ----------
  SET_ALARMS(state, alarms) {
    state.alarms = { ...state.alarms, ...alarms }
  },
  ADD_CURRENT_ALARM(state, alarm) {
    state.alarms.current.unshift(alarm)
    state.alarms.todayCount++
    state.alarms.pendingCount++
  },
  REMOVE_CURRENT_ALARM(state, alarmId) {
    const index = state.alarms.current.findIndex(a => a.id === alarmId)
    if (index > -1) {
      state.alarms.current.splice(index, 1)
      state.alarms.pendingCount = Math.max(0, state.alarms.pendingCount - 1)
    }
  },
  UPDATE_ALARM_STATS(state, { categoryStats, levelStats }) {
    if (categoryStats) state.alarms.categoryStats = { ...state.alarms.categoryStats, ...categoryStats }
    if (levelStats) state.alarms.levelStats = { ...state.alarms.levelStats, ...levelStats }
  },

  // ---------- 趋势数据 ----------
  SET_TREND_DATA(state, { key, data }) {
    if (Object.prototype.hasOwnProperty.call(state.trendData, key)) {
      state.trendData[key] = data
    }
  },
  APPEND_TREND_POINT(state, { key, point }) {
    if (Object.prototype.hasOwnProperty.call(state.trendData, key)) {
      state.trendData[key].push(point)
      // 保留最近 100 个点
      if (state.trendData[key].length > 100) {
        state.trendData[key].shift()
      }
    }
  },

  // ---------- 部件寿命 ----------
  SET_PARTS(state, parts) {
    state.parts = parts
  },
  UPDATE_PART(state, { id, patch }) {
    const index = state.parts.findIndex(p => p.id === id)
    if (index > -1) {
      state.parts.splice(index, 1, { ...state.parts[index], ...patch })
    }
  },
  REPLACE_PART(state, { id, newCode, newSpec }) {
    const part = state.parts.find(p => p.id === id)
    if (part) {
      part.used = 0
      part.code = newCode || part.code
      part.spec = newSpec || part.spec
      part.installDate = new Date().toISOString().split('T')[0]
      part.lastReplaceDate = part.installDate
    }
  },

  // ---------- 运行统计 ----------
  SET_RUNTIME_STATS(state, stats) {
    state.runtimeStats = { ...state.runtimeStats, ...stats }
  },

  // ---------- 元数据 ----------
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  UPDATE_LAST_UPDATE_TIME(state) {
    state.lastUpdateTime = Date.now()
  },
  SET_SYNC_STARTED(state, started) {
    state.syncStarted = started
  },
  SET_POLL_TIMER(state, timer) {
    state.pollTimer = timer
  },

  // ---------- 全量重置 ----------
  RESET_DEVICE_DATA(state) {
    state.status = 'offline'
    state.statusText = '离线'
    state.params = {
      speed: 0, fillVolume: 0, vacuum: 0,
      temperature: 0, pressure: 0, vibration: 0
    }
    state.alarms.current = []
    state.lastUpdateTime = null
  }
}

// ==================== Actions ====================
const actions = {
  /**
   * 获取全量设备数据（首次加载或手动刷新时调用）
   * 目前为模拟数据，后续对接后端接口
   */
  async fetchAllData({ dispatch }) {
    await Promise.all([
      dispatch('fetchDeviceInfo'),
      dispatch('fetchRealtimeParams'),
      dispatch('fetchProductionStats'),
      dispatch('fetchCurrentBatch'),
      dispatch('fetchAlarms'),
      dispatch('fetchTrendData'),
      dispatch('fetchParts'),
      dispatch('fetchRuntimeStats')
    ])
  },

  /** 获取设备基本信息 */
  async fetchDeviceInfo({ commit }) {
    // TODO: 对接后端接口 GET /api/device/info
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取实时参数 */
  async fetchRealtimeParams({ commit }) {
    // TODO: 对接后端接口 GET /api/device/realtime
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取生产统计 */
  async fetchProductionStats({ commit }) {
    // TODO: 对接后端接口 GET /api/device/production
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取当前批次 */
  async fetchCurrentBatch({ commit }) {
    // TODO: 对接后端接口 GET /api/device/batch/current
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取报警数据 */
  async fetchAlarms({ commit }) {
    // TODO: 对接后端接口 GET /api/device/alarms
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取趋势数据 */
  async fetchTrendData({ commit }, { key = 'speed', range = '24h' } = {}) {
    // TODO: 对接后端接口 GET /api/device/trend?key=xxx&range=24h
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取部件寿命 */
  async fetchParts({ commit }) {
    // TODO: 对接后端接口 GET /api/device/parts
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /** 获取运行统计 */
  async fetchRuntimeStats({ commit }) {
    // TODO: 对接后端接口 GET /api/device/runtime-stats
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /**
   * WebSocket 消息统一处理入口
   * 后端推送的设备数据消息在这里分发更新
   * @param {Object} context - Vuex context
   * @param {Object} message - WebSocket 消息体
   *   message.type: 'status' | 'params' | 'production' | 'alarm' | 'batch' | 'part'
   *   message.data: 对应的数据
   */
  onWebSocketMessage({ commit, dispatch }, message) {
    if (!message || !message.type) return

    switch (message.type) {
      case 'status':
        commit('SET_DEVICE_STATUS', message.data)
        break
      case 'params':
        commit('UPDATE_PARAMS', message.data)
        // 同时追加到趋势数据
        Object.keys(message.data).forEach(key => {
          commit('APPEND_TREND_POINT', {
            key,
            point: { time: new Date().toLocaleTimeString('zh-CN', { hour12: false }), value: message.data[key] }
          })
        })
        break
      case 'production':
        commit('UPDATE_PRODUCTION', message.data)
        break
      case 'batch':
        commit('SET_CURRENT_BATCH', message.data)
        break
      case 'alarm':
        if (message.data.action === 'add') {
          commit('ADD_CURRENT_ALARM', message.data.alarm)
        } else if (message.data.action === 'resolve') {
          commit('REMOVE_CURRENT_ALARM', message.data.id)
        }
        break
      case 'part':
        if (message.data.action === 'replace') {
          commit('REPLACE_PART', message.data)
        } else {
          commit('UPDATE_PART', message.data)
        }
        break
      case 'runtime':
        commit('SET_RUNTIME_STATS', message.data)
        break
      default:
        break
    }
    commit('UPDATE_LAST_UPDATE_TIME')
  },

  /**
   * 开始数据同步
   * 优先使用 WebSocket，未连接时启动轮询兜底
   */
  startDataSync({ state, commit, dispatch, rootGetters }) {
    if (state.syncStarted) return

    // 首次拉取全量数据
    dispatch('fetchAllData')

    // 如果 WebSocket 已连接，依赖推送即可
    if (rootGetters.isWsOnline) {
      commit('SET_SYNC_STARTED', true)
      return
    }

    // WebSocket 未连接，启动轮询兜底（每 5 秒拉一次实时参数）
    const timer = setInterval(() => {
      dispatch('fetchRealtimeParams')
    }, 5000)
    commit('SET_POLL_TIMER', timer)
    commit('SET_SYNC_STARTED', true)
  },

  /** 停止数据同步 */
  stopDataSync({ state, commit }) {
    if (state.pollTimer) {
      clearInterval(state.pollTimer)
      commit('SET_POLL_TIMER', null)
    }
    commit('SET_SYNC_STARTED', false)
  },

  /** 手动刷新数据 */
  async refreshData({ dispatch }) {
    await dispatch('fetchAllData')
  },

  /** 设备断开连接时重置数据 */
  onDeviceDisconnected({ commit }) {
    commit('RESET_DEVICE_DATA')
  }
}

// ==================== Getters ====================
const getters = {
  /** 设备基本信息 */
  deviceInfo: state => state.info,

  /** 设备运行状态 */
  deviceStatus: state => state.status,
  deviceStatusText: state => state.statusText,

  /** 是否在线（运行或空闲） */
  isDeviceOnline: state => state.status === 'running' || state.status === 'idle',

  /** 实时参数（全部） */
  realtimeParams: state => state.params,

  /**
   * 获取单个参数（含配置信息）
   * 返回 { value, config, percent, status }
   */
  getParam: state => key => {
    const value = state.params[key]
    const config = state.paramsConfig[key]
    if (!config) return { value, config: null, percent: 0, status: 'normal' }
    const percent = ((value - config.min) / (config.max - config.min)) * 100
    let status = 'normal'
    if (percent >= 90 || percent <= 10) status = 'danger'
    else if (percent >= 80 || percent <= 20) status = 'warning'
    return { value, config, percent: Math.max(0, Math.min(100, percent)), status }
  },

  /** 参数配置 */
  paramsConfig: state => state.paramsConfig,

  /** 生产统计 */
  productionStats: state => state.production,

  /** 当前批次 */
  currentBatch: state => state.currentBatch,

  /** 当前未处理报警 */
  currentAlarms: state => state.alarms.current,

  /** 报警统计 */
  alarmStats: state => ({
    todayCount: state.alarms.todayCount,
    criticalCount: state.alarms.criticalCount,
    pendingCount: state.alarms.pendingCount,
    categoryStats: state.alarms.categoryStats,
    levelStats: state.alarms.levelStats
  }),

  /** 趋势数据 */
  trendData: state => state.trendData,
  getTrendData: state => key => state.trendData[key] || [],

  /** 部件寿命列表 */
  partsList: state => state.parts,

  /**
   * 部件状态统计
   * 返回 { normal, notice, warning, expired }
   */
  partsStatusCount: state => {
    const result = { normal: 0, notice: 0, warning: 0, expired: 0 }
    state.parts.forEach(part => {
      const percent = part.used / part.total
      if (percent >= 1) result.expired++
      else if (percent >= 0.8) result.warning++
      else if (percent >= 0.6) result.notice++
      else result.normal++
    })
    return result
  },

  /** 运行统计 */
  runtimeStats: state => state.runtimeStats,

  /** 数据最后更新时间（格式化） */
  lastUpdateText: state => {
    if (!state.lastUpdateTime) return '从未更新'
    const diff = Math.floor((Date.now() - state.lastUpdateTime) / 1000)
    if (diff < 5) return '刚刚'
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    return `${Math.floor(diff / 3600)}小时前`
  },

  /** 是否正在加载 */
  deviceLoading: state => state.loading,

  /** 数据同步是否已启动 */
  syncStarted: state => state.syncStarted,

  // ==================== 视图模型转换（多页面复用） ====================

  /**
   * 核心指标卡片数据（今日产量/运行速度/合格率/故障次数）
   */
  coreMetrics: state => {
    const prod = state.production
    const params = state.params
    const fmt = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return [
      { label: '今日产量', value: fmt(prod.todayOutput), unit: '瓶', icon: 'el-icon-box', type: 'success', trend: 5.2 },
      { label: '运行速度', value: fmt(params.speed), unit: '瓶/h', icon: 'el-icon-speed', type: 'primary', trend: 2.1 },
      { label: '合格率', value: prod.qualifiedRate, unit: '%', icon: 'el-icon-circle-check', type: 'warning', trend: -0.3 },
      { label: '故障次数', value: 2, unit: '次', icon: 'el-icon-warning', type: 'danger', trend: -33.3 }
    ]
  },

  /**
   * 实时参数列表（带状态判断和百分比）
   */
  realtimeParamsList: state => {
    const params = state.params
    const config = state.paramsConfig
    const keys = ['speed', 'fillVolume', 'vacuum', 'temperature', 'pressure', 'vibration']
    return keys.map(key => {
      const cfg = config[key]
      const value = params[key]
      const percent = cfg ? ((value - cfg.min) / (cfg.max - cfg.min)) * 100 : 50
      let status = 'normal', statusText = '正常'
      if (percent >= 90 || percent <= 10) { status = 'danger'; statusText = '超限' }
      else if (percent >= 80 || percent <= 20) { status = 'warning'; statusText = '注意' }
      return {
        name: cfg ? cfg.name : key,
        value, unit: cfg ? cfg.unit : '',
        min: cfg ? cfg.min : 0, max: cfg ? cfg.max : 100,
        percent: Math.max(0, Math.min(100, percent)),
        status, statusText
      }
    })
  },

  /**
   * 今日运行统计（运行/空闲/故障/计划停机）
   */
  todayStats: state => {
    const rt = state.runtimeStats
    const total = rt.running + rt.idle + rt.fault + rt.plannedStop
    return [
      { label: '运行时长', value: rt.running, unit: 'h', icon: 'el-icon-time', type: 'success', percent: total ? (rt.running / total * 100) : 0 },
      { label: '空闲时长', value: rt.idle, unit: 'h', icon: 'el-icon-clock', type: 'warning', percent: total ? (rt.idle / total * 100) : 0 },
      { label: '故障时长', value: rt.fault, unit: 'h', icon: 'el-icon-warning-outline', type: 'danger', percent: total ? (rt.fault / total * 100) : 0 },
      { label: '计划停机', value: rt.plannedStop, unit: 'h', icon: 'el-icon-video-pause', type: 'info', percent: total ? (rt.plannedStop / total * 100) : 0 }
    ]
  },

  /**
   * OEE 三要素分析
   */
  oeeAnalysis: state => ({
    oee: state.production.oee,
    availability: state.production.availability,
    performance: state.production.performance,
    quality: state.production.quality
  }),

  /**
   * 设备状态对象（兼容模板中的 deviceStatus.status/text/duration）
   */
  deviceStatusObj: state => {
    const rt = state.runtimeStats
    const h = Math.floor(rt.running)
    const m = Math.round((rt.running - h) * 60)
    return {
      status: state.status,
      text: state.statusText,
      duration: `${h}小时${m}分钟`
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
