/**
 * ==========================================
 * WebSocket Store - 连接状态
 * ==========================================
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import i18n from '@/i18n'

export const useWebSocketStore = defineStore('websocket', () => {
  const connected = ref(false)
  const authenticated = ref(false)
  const plcConnected = ref(false)
  const lastHeartbeat = ref<number | null>(null)
  const lastMessageTime = ref<number | null>(null)
  const reconnectAttempts = ref(0)
  const heartbeatInterval = ref(25000)
  const enableHeartbeatLog = ref(true)
  const isReconnecting = ref(false)
  const reconnectResult = ref<'success' | 'failed' | null>(null)
  const reconnectError = ref<string | null>(null)

  const isWsOnline = computed(() => connected.value && authenticated.value)
  const isPlcOnline = computed(() => plcConnected.value)
  const isOnline = computed(() => isWsOnline.value && isPlcOnline.value)

  const lastHeartbeatText = computed(() => {
    if (!lastHeartbeat.value) return i18n.global.t('heartbeat.timeNever') as string
    const diff = Math.floor((Date.now() - lastHeartbeat.value) / 1000)
    if (diff < 60) return i18n.global.t('heartbeat.timeSecondsAgo', { n: diff }) as string
    if (diff < 3600) return i18n.global.t('heartbeat.timeMinutesAgo', { n: Math.floor(diff / 60) }) as string
    return i18n.global.t('heartbeat.timeHoursAgo', { n: Math.floor(diff / 3600) }) as string
  })

  const connectionStatusText = computed(() => {
    if (isReconnecting.value) return i18n.global.t('heartbeat.statusManualReconnecting') as string
    if (!connected.value) {
      if (reconnectAttempts.value > 0) {
        return i18n.global.t('heartbeat.statusReconnecting', { count: reconnectAttempts.value }) as string
      }
      return i18n.global.t('heartbeat.statusOffline') as string
    }
    if (!authenticated.value) return i18n.global.t('heartbeat.statusAuthenticating') as string
    if (!plcConnected.value) return i18n.global.t('heartbeat.statusDeviceDisconnected') as string
    return i18n.global.t('heartbeat.statusOnline') as string
  })

  const connectionStatusType = computed(() => {
    if (isReconnecting.value) return 'reconnecting'
    if (isOnline.value) return 'online'
    if (isWsOnline.value) return 'warning'
    return 'offline'
  })

  function onConnected(): void {
    connected.value = true
    reconnectAttempts.value = 0
  }
  function onAuthenticated(): void {
    authenticated.value = true
  }
  function onPlcStatusChanged(c: boolean): void {
    plcConnected.value = c
  }
  function onHeartbeat(): void {
    lastHeartbeat.value = Date.now()
  }
  function onMessage(): void {
    lastMessageTime.value = Date.now()
  }
  function onDisconnected(): void {
    connected.value = false
    authenticated.value = false
    lastHeartbeat.value = null
    isReconnecting.value = false
    reconnectResult.value = null
    reconnectError.value = null
  }
  function onReconnecting(attempts: number): void {
    reconnectAttempts.value = attempts
  }
  function startManualReconnect(): void {
    isReconnecting.value = true
    reconnectResult.value = null
    reconnectError.value = null
  }
  function manualReconnectSuccess(): void {
    isReconnecting.value = false
    reconnectResult.value = 'success'
    reconnectError.value = null
  }
  function manualReconnectFailed(error?: string): void {
    isReconnecting.value = false
    reconnectResult.value = 'failed'
    reconnectError.value = error || '未知错误'
  }
  function setHeartbeatInterval(interval: number): void {
    heartbeatInterval.value = interval
  }
  function setEnableHeartbeatLog(enable: boolean): void {
    enableHeartbeatLog.value = enable
  }

  return {
    connected,
    authenticated,
    plcConnected,
    lastHeartbeat,
    lastMessageTime,
    reconnectAttempts,
    heartbeatInterval,
    enableHeartbeatLog,
    isReconnecting,
    reconnectResult,
    reconnectError,
    isWsOnline,
    isPlcOnline,
    isOnline,
    lastHeartbeatText,
    connectionStatusText,
    connectionStatusType,
    onConnected,
    onAuthenticated,
    onPlcStatusChanged,
    onHeartbeat,
    onMessage,
    onDisconnected,
    onReconnecting,
    startManualReconnect,
    manualReconnectSuccess,
    manualReconnectFailed,
    setHeartbeatInterval,
    setEnableHeartbeatLog
  }
})
