/**
 * ==========================================
 * 系统配置管理工具（加载 / 缓存 / 应用）
 * ==========================================
 */
import { requestGetAllConfigsApi } from '@/api'
import { useDeviceStore } from '@/store/modules/device'
import { useWebSocketStore } from '@/store/modules/websocket'
import ws from '@/utils/request/websocket'
import { setLanguage } from '@/i18n'
import type { SystemConfig } from '@/types/business'

let configCache: Partial<SystemConfig> = {}
let loaded = false
let loadingPromise: Promise<Partial<SystemConfig>> | null = null

const DEFAULT_CONFIG: SystemConfig = {
  sessionTimeout: 30,
  defaultPageSize: 20,
  defaultLanguage: 'zh-CN',
  dateFormat: 'YYYY-MM-DD',
  watermarkEnabled: false,
  watermarkText: '',
  plcProtocol: 'ModbusTcp',
  plcHost: '127.0.0.1',
  plcPort: 502,
  plcUnitId: 1,
  pollFastInterval: 200,
  pollSlowInterval: 1000,
  pdfWatermarkEnabled: true,
  pdfWatermarkText: '',
  heartbeatInterval: 25000,
  allowNoOrderProduction: false,
  noOrderProductionHighlight: false,
  showOperatorName: true,
  showAlarmCount: true,
  showRuntime: true,
  reportIncludeAlarmDetail: true,
  reportIncludeOperatorDetail: true,
  reportIncludeDownloadCount: true,
  allowRunningOrderDownload: false,
  autoArchiveCompleted: true,
  orderSwitchConfirm: true,
  deviceName: 'nexCM-灌装机-001',
  deviceCode: 'NEXCM-001',
  deviceRegion: ['CN', 'CN-WX'],
  deviceInstallDate: '2024-01-01',
  partLifeReminderEnabled: true,
  partLifeThreshold: '20',
  partLifeRemindInterval: 'day',
  partLifeSnoozeInterval: '10'
}

export async function loadConfig(forceRefresh = false): Promise<Partial<SystemConfig>> {
  if (loaded && !forceRefresh) return { ...configCache }
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const res = await requestGetAllConfigsApi()
      if ((res as unknown as { code: number }).code === 200 && res.data) {
        configCache = { ...DEFAULT_CONFIG, ...(res.data as Partial<SystemConfig>) }
      } else {
        configCache = { ...DEFAULT_CONFIG }
      }
      loaded = true
      syncDeviceInfoToStore()
      return { ...configCache }
    } catch (err) {
      console.error('[配置管理] 加载配置失败:', err)
      configCache = { ...DEFAULT_CONFIG }
      loaded = true
      syncDeviceInfoToStore()
      return { ...configCache }
    } finally {
      loadingPromise = null
    }
  })()

  return loadingPromise
}

export function getConfig<T = unknown>(key?: string, defaultValue: T | null = null): T | Partial<SystemConfig> | null {
  if (!key) return { ...configCache }
  const v = (configCache as Record<string, unknown>)[key]
  return v !== undefined ? (v as T) : defaultValue
}

export function updateConfigCache(configs: Partial<SystemConfig>): void {
  configCache = { ...configCache, ...configs }
}

function syncDeviceInfoToStore(): void {
  try {
    const deviceStore = useDeviceStore()
    const patch: Record<string, unknown> = {}
    if (configCache.deviceName !== undefined) patch.name = configCache.deviceName
    if (configCache.deviceCode !== undefined) patch.code = configCache.deviceCode
    if (configCache.deviceInstallDate !== undefined) patch.installDate = configCache.deviceInstallDate
    if (Object.keys(patch).length > 0) deviceStore.setDeviceInfo(patch)
  } catch (e) {
    console.error('[配置管理] 同步设备参数失败:', e)
  }
}

export function applyConfig(configs: Partial<SystemConfig>): void {
  updateConfigCache(configs)
  if (configs.heartbeatInterval !== undefined) {
    try {
      useWebSocketStore().setHeartbeatInterval(configs.heartbeatInterval)
      if (ws.isConnected()) ws.send({ type: 'ping' })
    } catch (e) {
      console.error('[配置管理] 更新心跳间隔失败:', e)
    }
  }
  if (configs.defaultLanguage !== undefined) {
    try { setLanguage(configs.defaultLanguage) } catch (e) { console.error('[配置管理] 切换语言失败:', e) }
  }
  if (configs.sessionTimeout !== undefined) {
    window.dispatchEvent(new CustomEvent('sessionTimeoutChanged', { detail: { timeout: configs.sessionTimeout } }))
  }
  if (configs.defaultPageSize !== undefined) {
    window.dispatchEvent(new CustomEvent('defaultPageSizeChanged', { detail: { pageSize: configs.defaultPageSize } }))
  }
  if (configs.dateFormat !== undefined) {
    window.dispatchEvent(new CustomEvent('dateFormatChanged', { detail: { format: configs.dateFormat } }))
  }
  if (configs.deviceName !== undefined || configs.deviceCode !== undefined || configs.deviceInstallDate !== undefined) {
    syncDeviceInfoToStore()
  }
}

export default { loadConfig, getConfig, updateConfigCache, applyConfig, DEFAULT_CONFIG }
