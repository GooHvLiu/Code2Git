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


/**
 * 解析 User-Agent，提取浏览器和操作系统信息
 * @param {string} userAgent - User-Agent 字符串
 * @returns {string} 精简的设备名称，如 "Chrome 150 · Windows 10"
 */
function parseUserAgent(userAgent) {
  if (!userAgent) return 'Unknown Device'

  // 解析浏览器
  let browser = 'Unknown'
  let browserVersion = ''
  if (userAgent.includes('Edg/')) {
    browser = 'Edge'
    browserVersion = userAgent.match(/Edg\/([\d.]+)/)?.[1] || ''
  } else if (userAgent.includes('Chrome/')) {
    browser = 'Chrome'
    browserVersion = userAgent.match(/Chrome\/([\d.]+)/)?.[1] || ''
  } else if (userAgent.includes('Firefox/')) {
    browser = 'Firefox'
    browserVersion = userAgent.match(/Firefox\/([\d.]+)/)?.[1] || ''
  } else if (userAgent.includes('Safari/')) {
    browser = 'Safari'
    browserVersion = userAgent.match(/Version\/([\d.]+)/)?.[1] || ''
  }

  // 解析操作系统
  let os = 'Unknown'
  if (userAgent.includes('Windows NT 10')) {
    os = 'Windows 10'
  } else if (userAgent.includes('Windows NT 6.3')) {
    os = 'Windows 8.1'
  } else if (userAgent.includes('Windows NT 6.2')) {
    os = 'Windows 8'
  } else if (userAgent.includes('Windows NT 6.1')) {
    os = 'Windows 7'
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS'
  } else if (userAgent.includes('Linux')) {
    os = 'Linux'
  } else if (userAgent.includes('Android')) {
    os = 'Android'
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS'
  }

  // 组合结果
  const browserStr = browserVersion ? browser + ' ' + browserVersion.split('.')[0] : browser
  return browserStr + ' · ' + os
}

class WebSocketClient {
  constructor() {
    this.ws = null
    this.userId = null
    this.deviceId = this.getOrCreateDeviceId() // 设备唯一标识（存储在 localStorage）
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
   * 获取或创建设备唯一标识
   * 设备ID存储在 localStorage，同一浏览器的多个标签页共享同一个设备ID
   * @returns {string} 设备唯一标识
   */
  getOrCreateDeviceId() {
    try {
      let deviceId = localStorage.getItem('nex_device_id')
      if (!deviceId) {
        // 生成 UUID（简化版）
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('nex_device_id', deviceId)
      }
      return deviceId
    } catch (e) {
      // localStorage 可能被禁用，使用内存中的临时ID
      return 'device_temp_' + Date.now()
    }
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
   * 获取 WebSocket 地址
   */
  getWsUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // 开发环境直连后端，避免 webpack-dev-server 代理问题
    // 生产环境使用当前 host，通过 Nginx 反向代理
    const host = process.env.NODE_ENV === 'development'
      ? 'localhost:3002'
      : window.location.host
    return `${protocol}//${host}/ws-api`
  }

  /**
   * 连接 WebSocket
   * @param {number} userId - 用户ID
   */
  connect(userId) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.userId = userId
    this.manualClose = false

    try {
      const url = this.getWsUrl()
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
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

      this.ws.onclose = () => {
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
        console.error('[WS] WebSocket 连接错误:', error)
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
        userId: this.userId,
        deviceId: this.deviceId,
        deviceName: parseUserAgent(navigator.userAgent)
      })
    }
  }

  /**
   * 处理收到的消息
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data)

      // 同步消息时间到 Vuex
      store.dispatch('websocket/onMessage')

      switch (message.type) {
        case 'auth_success':
          this.authenticated = true
          // 同步认证状态到 Vuex
          store.dispatch('websocket/onAuthenticated')
          break
        case 'auth_failed':
          console.error('[WS] 认证失败:', message.message)
          break
        case 'pong':
          // 心跳响应，同步心跳时间到 Vuex
          store.dispatch('websocket/onHeartbeat')
          break
        case 'plc_status': {
          // 设备连接状态变化
          const deviceConnected = message.data?.connected ?? message.connected ?? false
          store.dispatch('websocket/onPlcStatusChanged', deviceConnected)
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
  }

  /**
   * 获取连接状态
   */
  isConnected() {
    return this.connected && this.authenticated
  }
}

// 导出单例
// 导出单例和工具函数
export { parseUserAgent }
export default new WebSocketClient()
