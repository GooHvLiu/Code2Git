/**
 * ==========================================
 * WebSocket 客户端工具（单例）
 * ==========================================
 * 自动认证、心跳、断线重连、消息分发，状态同步到 Pinia websocket store。
 */
import { IS_DEV, WS_HOST } from '@/utils/config/env'
import { useWebSocketStore } from '@/store/modules/websocket'

export function parseUserAgent(userAgent: string): string {
  if (!userAgent) return 'Unknown Device'
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
  let os = 'Unknown'
  if (userAgent.includes('Windows NT 10')) os = 'Windows 10'
  else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1'
  else if (userAgent.includes('Windows NT 6.2')) os = 'Windows 8'
  else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7'
  else if (userAgent.includes('Mac OS X')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'
  const browserStr = browserVersion ? browser + ' ' + browserVersion.split('.')[0] : browser
  return browserStr + ' · ' + os
}

type Listener = (data?: unknown) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private userId: number | string | null = null
  private deviceId: string
  private connected = false
  private authenticated = false
  private listeners: Record<string, Listener[]> = {}
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 1000
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private manualClose = false

  constructor() {
    this.deviceId = this.getOrCreateDeviceId()
  }

  private getOrCreateDeviceId(): string {
    try {
      let deviceId = localStorage.getItem('nex_device_id')
      if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('nex_device_id', deviceId)
      }
      return deviceId
    } catch {
      return 'device_temp_' + Date.now()
    }
  }

  private get store() {
    return useWebSocketStore()
  }

  private getHeartbeatIntervalTime(): number {
    return this.store?.heartbeatInterval || 25000
  }

  private getWsUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = IS_DEV ? WS_HOST : window.location.host
    return `${protocol}//${host}/ws-api`
  }

  connect(userId: number | string): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return
    this.userId = userId
    this.manualClose = false
    try {
      this.ws = new WebSocket(this.getWsUrl())
      this.ws.onopen = () => {
        this.connected = true
        this.reconnectAttempts = 0
        this.store.onConnected()
        this.authenticate()
        this.startHeartbeat()
      }
      this.ws.onmessage = (event) => this.handleMessage(event.data)
      this.ws.onclose = () => {
        this.connected = false
        this.authenticated = false
        this.stopHeartbeat()
        this.store.onDisconnected()
        if (!this.manualClose) this.scheduleReconnect()
      }
      this.ws.onerror = (error) => console.error('[WS] WebSocket 连接错误:', error)
    } catch (e) {
      console.error('[WS] 连接失败:', (e as Error).message)
      this.scheduleReconnect()
    }
  }

  private authenticate(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.userId) {
      this.send({
        type: 'auth',
        userId: this.userId,
        deviceId: this.deviceId,
        deviceName: parseUserAgent(navigator.userAgent)
      })
    }
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data) as { type: string; data?: unknown; connected?: boolean; message?: string }
      this.store.onMessage()
      switch (message.type) {
        case 'auth_success':
          this.authenticated = true
          this.store.onAuthenticated()
          break
        case 'auth_failed':
          console.error('[WS] 认证失败:', message.message)
          break
        case 'pong':
          this.store.onHeartbeat()
          break
        case 'plc_status': {
          const d = (message.data || {}) as { connected?: boolean }
          this.store.onPlcStatusChanged(d.connected ?? message.connected ?? false)
          break
        }
        default:
          this.emit(message.type, message.data || message)
      }
    } catch (e) {
      console.error('[WS] 消息解析失败:', (e as Error).message, data)
    }
  }

  send(data: unknown): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
      return true
    }
    console.warn('[WS] 连接未建立，无法发送')
    return false
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    const interval = this.getHeartbeatIntervalTime()
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) this.send({ type: 'ping' })
    }, interval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] 达到最大重连次数，停止重连')
      return
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    const delayMs = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    this.reconnectAttempts++
    this.store.onReconnecting(this.reconnectAttempts)
    this.reconnectTimer = setTimeout(() => {
      if (this.userId !== null) this.connect(this.userId)
    }, delayMs)
  }

  on(type: string, callback: Listener): void {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(callback)
  }

  off(type: string, callback: Listener): void {
    if (!this.listeners[type]) return
    const index = this.listeners[type].indexOf(callback)
    if (index > -1) this.listeners[type].splice(index, 1)
  }

  emit(type: string, data?: unknown): void {
    if (!this.listeners[type]) return
    this.listeners[type].forEach(callback => {
      try { callback(data) } catch (e) { console.error(`[WS] 监听器 ${type} 执行错误:`, e) }
    })
  }

  disconnect(): void {
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

  isConnected(): boolean {
    return this.connected && this.authenticated
  }

  /**
   * 获取当前设备唯一标识（登录/注册时随设备信息上报后端）
   */
  getDeviceId(): string {
    return this.deviceId
  }
}

export default new WebSocketClient()
