/**
 * ==========================================
 * 全局 Message 防重复封装
 * ==========================================
 * 相同内容的消息在指定时间窗口内只显示一次
 */
import { Message } from 'element-ui'

const DEDUPLICATE_WINDOW = 3000
const lastMessageMap = new Map()

function isDuplicate(content) {
  const now = Date.now()
  const lastTime = lastMessageMap.get(content)
  if (lastTime && now - lastTime < DEDUPLICATE_WINDOW) {
    return true
  }
  lastMessageMap.set(content, now)
  return false
}

let messageCount = 0
function cleanupExpired() {
  messageCount++
  if (messageCount < 10) return
  messageCount = 0
  const now = Date.now()
  lastMessageMap.forEach((time, key) => {
    if (now - time >= DEDUPLICATE_WINDOW) {
      lastMessageMap.delete(key)
    }
  })
}

export function showMessage(options, type = 'info') {
  const config = typeof options === 'string' ? { message: options } : { ...options }
  const content = config.message || ''
  if (!content) return
  if (isDuplicate(content)) return
  cleanupExpired()
  return Message({
    type,
    duration: config.duration || 3000,
    showClose: config.showClose !== false,
    ...config
  })
}

export function showSuccess(message, options = {}) {
  return showMessage({ message, ...options }, 'success')
}

export function showError(message, options = {}) {
  return showMessage({ message, ...options }, 'error')
}

export function showWarning(message, options = {}) {
  return showMessage({ message, ...options }, 'warning')
}

export function showInfo(message, options = {}) {
  return showMessage({ message, ...options }, 'info')
}

/** Vue 插件：挂载到 Vue.prototype.$msg */
export default {
  install(Vue) {
    Vue.prototype.$msg = {
      show: showMessage,
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo
    }
  }
}
