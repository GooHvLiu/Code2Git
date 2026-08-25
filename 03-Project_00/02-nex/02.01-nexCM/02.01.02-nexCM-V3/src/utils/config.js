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
  orderSwitchConfirm: true
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
      return { ...configCache }
    } catch (err) {
      console.error('[配置管理] 加载配置失败:', err)
      configCache = { ...DEFAULT_CONFIG }
      loaded = true
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
}

// 导出默认对象
export default {
  loadConfig,
  getConfig,
  updateConfigCache,
  applyConfig,
  DEFAULT_CONFIG
}
