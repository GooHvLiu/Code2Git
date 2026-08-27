/* eslint-disable no-console */
/**
 * ==========================================
 * 系统配置管理工具
 * ==========================================
 * 负责前端配置的缓存、加载、获取和实时生效
 */
import { requestGetAllConfigsApi } from '@/api'
import store from '@/store'
import ws from '@/utils/websocket'
import { setLanguage } from '@/i18n'
import { getCoordsByValues, getCityByCode } from '@/utils/worldCities'

// 配置缓存
let configCache = {}
// 是否已经加载
let loaded = false
// 加载中的 Promise
let loadingPromise = null

// 默认配置
const DEFAULT_CONFIG = {
  // 系统设置
  sessionTimeout: 30,
  defaultPageSize: 20,
  defaultLanguage: 'zh-CN',
  dateFormat: 'YYYY-MM-DD',
  // 安全设置
  watermarkEnabled: false,
  watermarkText: '',
  // PLC 设置
  plcProtocol: 'ModbusTcp',
  plcHost: '127.0.0.1',
  plcPort: 502,
  plcUnitId: 1,
  pollFastInterval: 200,
  pollSlowInterval: 1000,
  // 导出设置
  pdfWatermarkEnabled: true,
  pdfWatermarkText: '',
  // 连接设置
  heartbeatInterval: 25000,
  // 订单设置
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
  // 设备参数
  deviceName: 'nexCM-灌装机-001',
  deviceCode: 'NEXCM-001',
  deviceRegion: ['CN', 'CN-WX'], // 所在地区（级联选择器值）
  deviceInstallDate: '2024-01-01',
  // 部件寿命提醒设置
  partLifeReminderEnabled: true,
  partLifeThreshold: '20',
  partLifeRemindInterval: 'day',
  partLifeSnoozeInterval: '10'
}

/**
 * 加载配置（从后端）
 * @param {boolean} forceRefresh 是否强制刷新
 * @returns {Promise<Object>} 配置对象
 */
export async function loadConfig(forceRefresh = false) {
  // 如果已经加载且不强制刷新，直接返回缓存
  if (loaded && !forceRefresh) {
    return { ...configCache }
  }

  // 如果正在加载，返回同一个 Promise
  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = (async () => {
    try {
      const res = await requestGetAllConfigsApi()
      if (res.code === 200 && res.data) {
        configCache = { ...DEFAULT_CONFIG, ...res.data }
      } else {
        configCache = { ...DEFAULT_CONFIG }
      }
      loaded = true
      // 配置加载完成后，同步设备参数到 device store
      syncDeviceInfoToStore()
      return { ...configCache }
    } catch (err) {
      console.error('[配置管理] 加载配置失败:', err)
      configCache = { ...DEFAULT_CONFIG }
      loaded = true
      // 即使加载失败，也同步默认设备参数
      syncDeviceInfoToStore()
      return { ...configCache }
    } finally {
      loadingPromise = null
    }
  })()

  return loadingPromise
}

/**
 * 获取配置
 * @param {string} key 配置键（可选，不传返回所有配置）
 * @param {any} defaultValue 默认值
 * @returns {any} 配置值
 */
export function getConfig(key, defaultValue = null) {
  if (!key) {
    return { ...configCache }
  }
  return configCache[key] !== undefined ? configCache[key] : defaultValue
}

/**
 * 更新配置（本地缓存，不调用后端）
 * @param {Object} configs 配置对象
 */
export function updateConfigCache(configs) {
  configCache = { ...configCache, ...configs }
}

/**
 * 解析 deviceRegion 为数组格式（兼容多种后端存储格式）
 */
function parseDeviceRegion(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // JSON 字符串格式：'["CN","CN-WX"]'
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      // 不是 JSON，继续尝试其他格式
    }
    // 逗号分隔格式：'CN,CN-WX'
    if (value.includes(',')) {
      return value.split(',').map(s => s.trim())
    }
  }
  return null
}

/**
 * 同步设备参数到 device store（配置加载后自动调用）
 * 把配置中的设备名称、编号、所在地区、投用日期等同步到 device store
 */
function syncDeviceInfoToStore() {
  try {
    const deviceName = configCache.deviceName
    const deviceCode = configCache.deviceCode
    const deviceRegion = parseDeviceRegion(configCache.deviceRegion)
    const deviceInstallDate = configCache.deviceInstallDate

    const deviceInfo = {}

    if (deviceName !== undefined) deviceInfo.name = deviceName
    if (deviceCode !== undefined) deviceInfo.code = deviceCode
    if (deviceInstallDate !== undefined) deviceInfo.installDate = deviceInstallDate

    // 处理所在地区：级联选择器值 → 城市名称 + 经纬度
    if (Array.isArray(deviceRegion) && deviceRegion.length >= 2) {
      const cityCode = deviceRegion[deviceRegion.length - 1]
      const city = getCityByCode(cityCode)
      const coords = getCoordsByValues(deviceRegion)

      if (city) {
        // 城市名称格式：国家 · 城市（如：中国 · 无锡）
        const countryName = city.countryNameZh || city.countryName || ''
        const cityName = city.nameZh || city.name || ''
        deviceInfo.location = countryName ? `${countryName} · ${cityName}` : cityName
      }

      if (coords) {
        deviceInfo.locationCode = deviceRegion
        deviceInfo.locationCoords = { lng: coords.lng, lat: coords.lat }
      }
    }

    if (Object.keys(deviceInfo).length > 0) {
      store.commit('device/SET_DEVICE_INFO', deviceInfo)
    }
  } catch (e) {
    console.error('[配置管理] 同步设备参数到 store 失败:', e)
  }
}

/**
 * 应用配置到相关模块（实时生效）
 * @param {Object} configs 配置对象
 */
export function applyConfig(configs) {
  // 更新本地缓存
  updateConfigCache(configs)

  // 1. 心跳间隔：更新 Vuex 并重启心跳
  if (configs.heartbeatInterval !== undefined) {
    try {
      store.commit('websocket/SET_HEARTBEAT_INTERVAL', configs.heartbeatInterval)
      // 如果已连接，重启心跳定时器
      if (ws.isConnected && ws.isConnected()) {
        ws.startHeartbeat()
      }
    } catch (e) {
      console.error('[配置管理] 更新心跳间隔失败:', e)
    }
  }

  // 2. 默认语言：切换界面语言
  if (configs.defaultLanguage !== undefined) {
    try {
      setLanguage(configs.defaultLanguage)
    } catch (e) {
      console.error('[配置管理] 切换语言失败:', e)
    }
  }

  // 3. 会话超时：发送事件通知 sessionTimeout mixin
  if (configs.sessionTimeout !== undefined) {
    try {
      const event = new CustomEvent('sessionTimeoutChanged', {
        detail: { timeout: configs.sessionTimeout }
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('[配置管理] 更新会话超时失败:', e)
    }
  }

  // 4. 默认每页条数：发送事件通知表格组件
  if (configs.defaultPageSize !== undefined) {
    try {
      const event = new CustomEvent('defaultPageSizeChanged', {
        detail: { pageSize: configs.defaultPageSize }
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('[配置管理] 更新默认每页条数失败:', e)
    }
  }

  // 5. 日期格式：发送事件通知日期格式化工具
  if (configs.dateFormat !== undefined) {
    try {
      const event = new CustomEvent('dateFormatChanged', {
        detail: { format: configs.dateFormat }
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('[配置管理] 更新日期格式失败:', e)
    }
  }

  // 6. 水印设置：发送事件通知水印组件
  if (configs.watermarkEnabled !== undefined || configs.watermarkText !== undefined) {
    try {
      const event = new CustomEvent('watermarkConfigChanged', {
        detail: {
          enabled: configs.watermarkEnabled,
          text: configs.watermarkText
        }
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('[配置管理] 更新水印配置失败:', e)
    }
  }

  // 7. PDF 导出水印设置：发送事件通知导出组件
  if (configs.pdfWatermarkEnabled !== undefined || configs.pdfWatermarkText !== undefined) {
    try {
      const event = new CustomEvent('pdfWatermarkConfigChanged', {
        detail: {
          enabled: configs.pdfWatermarkEnabled,
          text: configs.pdfWatermarkText
        }
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('[配置管理] 更新PDF导出水印配置失败:', e)
    }
  }

  // 8. 轮询间隔：通过 WebSocket 通知后端更新（如果已连接）
  if (configs.pollFastInterval !== undefined || configs.pollSlowInterval !== undefined) {
    try {
      if (ws.isConnected && ws.isConnected()) {
        ws.send({
          type: 'update_poll_interval',
          data: {
            fastInterval: configs.pollFastInterval,
            slowInterval: configs.pollSlowInterval
          }
        })
      }
    } catch (e) {
      console.error('[配置管理] 更新轮询间隔失败:', e)
    }
  }

  // 9. 设备参数：同步到 device store（设备信息卡片、地图等使用）
  if (configs.deviceName !== undefined ||
      configs.deviceCode !== undefined ||
      configs.deviceRegion !== undefined ||
      configs.deviceInstallDate !== undefined) {
    syncDeviceInfoToStore()
  }

  // 10. 部件寿命提醒开关：发送事件通知 Layout 组件
  if (configs.partLifeReminderEnabled !== undefined) {
    try {
      const event = new CustomEvent('partLifeReminderEnabledChanged', {
        detail: { enabled: configs.partLifeReminderEnabled }
      })
      window.dispatchEvent(event)
    } catch (e) {
      console.error('[配置管理] 更新部件寿命提醒开关失败:', e)
    }
  }
}

// 导出默认对象
export default {
  loadConfig,
  getConfig,
  updateConfigCache,
  applyConfig,
  DEFAULT_CONFIG
}
