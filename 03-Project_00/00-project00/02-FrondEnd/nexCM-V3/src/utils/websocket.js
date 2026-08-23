/* eslint-disable no-console */
/**
 * ==========================================
 * WebSocket 客户端工具
 * ==========================================
 * 功能：
 * 1. 连接 WebSocket 服务器（路径 /ws）
 * 2. 自动认证（发送 userId）
 * 3. 心跳检测（可配置间隔时间）
 * 4. 断线自动重连（指数退避）
 * 5. 消息监听和分发（按 type 回调）
 * 6. 状态同步到 Vuex（供 HeartbeatIndicator 等组件使用）
 *
 * 使用方式：
 * import ws from '@/utils/websocket'
 * ws.connect(userId)
 * ws.on('notification', (data) => { console.log(data) })
 * ws.disconnect()
 *
 * 心跳配置：
 * - 在 Vuex websocket 模块中设置 heartbeatInterval（毫秒）
 * - 在 Vuex websocket 模块中设置 enableHeartbeatLog（是否显示心跳日志）
 */

import store from '@/store'

class WebSocketClient {
  constructor() {
    this.ws = null
    this.userId = null
    this.connected = false
    this.authenticated = false
    this.listeners = {} // { type: [callback1, callback2, ...] }
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 1000 // 初始重连延迟 1秒
    this.heartbeatInterval = null
    this.reconnectTimer = null
    this.manualClose = false
  }

  /**
   * 获取心跳间隔时间（从 Vuex 配置读取）
   * @returns {number} 心跳间隔（毫秒）
   */
  getHeartbeatIntervalTime() {
    return store.state.websocket?.heartbeatInterval || 25000
  }

  /**
   * 是否启用心跳日志
   * @returns {boolean}
   */
  isHeartbeatLogEnabled() {
    return store.state.websocket?.enableHeartbeatLog || false
  }

  /**
   * 输出心跳日志（根据配置决定是否显示）
   * @param {string} message - 日志消息
   */
  heartbeatLog(message) {
    if (this.isHeartbeatLogEnabled()) {
      console.log(`[WS] ${message}`)
    }
  }

  /**
   * 获取 WebSocket 地址
   */
  getWsUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = process.env.VUE_APP_WS_PORT || '3002'
    // 如果是开发环境，使用后端端口；生产环境使用当前 host
    if (process.env.NODE_ENV === 'development') {
      return `${protocol}//${host}:${port}/ws`
    }
    return `${protocol}//${host}/ws`
  }

  /**
   * 连接 WebSocket
   * @param {number} userId - 用户ID
   */
  connect(userId) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('[WS] 已连接或正在连接，跳过')
      return
    }

    this.userId = userId
    this.manualClose = false

    try {
      const url = this.getWsUrl()
      console.log('[WS] 正在连接:', url)
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('[WS] 连接成功')
        this.connected = true
        this.reconnectAttempts = 0
        // 同步状态到 Vuex
        store.dispatch('websocket/onConnected')
        // 发送认证
        this.authenticate()
        // 启动心跳
        this.startHeartbeat()
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data)
      }

      this.ws.onclose = (event) => {
        console.log('[WS] 连接关闭:', event.code, event.reason)
        this.connected = false
        this.authenticated = false
        this.stopHeartbeat()
        // 同步状态到 Vuex
        store.dispatch('websocket/onDisconnected')
        // 非手动关闭则自动重连
        if (!this.manualClose) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.error('[WS] 连接错误:', error)
      }
    } catch (e) {
      console.error('[WS] 连接失败:', e.message)
      this.scheduleReconnect()
    }
  }

  /**
   * 发送认证消息
   */
  authenticate() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.userId) {
      this.send({
        type: 'auth',
        userId: this.userId
      })
    }
  }

  /**
   * 处理收到的消息
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data)
      this.heartbeatLog(`收到消息: ${message.type}`)

      // 同步消息时间到 Vuex
      store.dispatch('websocket/onMessage')

      switch (message.type) {
        case 'auth_success':
          this.authenticated = true
          console.log('[WS] 认证成功')
          // 同步认证状态到 Vuex
          store.dispatch('websocket/onAuthenticated')
          break
        case 'auth_failed':
          console.error('[WS] 认证失败:', message.message)
          break
        case 'pong':
          // 心跳响应，同步心跳时间到 Vuex
          store.dispatch('websocket/onHeartbeat')
          this.heartbeatLog('收到心跳响应: pong')
          break
        case 'plc_status': {
          // 设备连接状态变化
          const deviceConnected = message.data?.connected ?? message.connected ?? false
          store.dispatch('websocket/onPlcStatusChanged', deviceConnected)
          console.log(`[WS] 设备连接状态: ${deviceConnected ? '已连接' : '已断开'}`)
          break
        }
        default:
          // 分发给监听器
          this.emit(message.type, message.data || message)
      }
    } catch (e) {
      console.error('[WS] 消息解析失败:', e.message, data)
    }
  }

  /**
   * 发送消息
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
      return true
    }
    console.warn('[WS] 连接未建立，无法发送')
    return false
  }

  /**
   * 启动心跳
   * 心跳间隔时间从 Vuex 配置读取，可动态调整
   */
  startHeartbeat() {
    this.stopHeartbeat()
    const interval = this.getHeartbeatIntervalTime()
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
        this.heartbeatLog('发送心跳: ping')
      }
    }, interval)
  }

  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * 计划重连（指数退避）
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] 达到最大重连次数，停止重连')
      return
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    this.reconnectAttempts++
    console.log(`[WS] ${delay / 1000}秒后第 ${this.reconnectAttempts} 次重连`)
    // 同步重连状态到 Vuex
    store.dispatch('websocket/onReconnecting', this.reconnectAttempts)

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.userId)
    }, delay)
  }

  /**
   * 注册消息监听器
   * @param {string} type - 消息类型
   * @param {function} callback - 回调函数
   */
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }

  /**
   * 移除消息监听器
   */
  off(type, callback) {
    if (this.listeners[type]) {
      const index = this.listeners[type].indexOf(callback)
      if (index > -1) {
        this.listeners[type].splice(index, 1)
      }
    }
  }

  /**
   * 触发消息事件
   */
  emit(type, data) {
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => {
        try {
          callback(data)
        } catch (e) {
          console.error(`[WS] 监听器 ${type} 执行错误:`, e)
        }
      })
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.manualClose = true
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.connected = false
    this.authenticated = false
    console.log('[WS] 已断开连接')
  }

  /**
   * 获取连接状态
   */
  isConnected() {
    return this.connected && this.authenticated
  }
}

// 导出单例
export default new WebSocketClient()
