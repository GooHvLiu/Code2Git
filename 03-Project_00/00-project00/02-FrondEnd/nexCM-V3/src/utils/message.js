/**
 * ==========================================
 * 全局 Message 防重复封装
 * ==========================================
 * 解决多个请求同时失败时弹出多个相同提示的问题
 * 相同内容的消息在指定时间窗口内只显示一次
 *
 * 用法：
 * import { showMessage, showSuccess, showError, showWarning, showInfo } from '@/utils/message'
 * showError('请求失败')
 *
 * 也可通过 Vue 原型调用：
 * this.$msg.error('请求失败')
 */
import { Message } from 'element-ui'

/**
 * 消息去重时间窗口（毫秒）
 * 相同内容在此时间内只显示一次
 */
const DEDUPLICATE_WINDOW = 3000

/**
 * 最近显示的消息记录
 * key: 消息内容, value: 最后显示时间戳
 */
const lastMessageMap = new Map()

/**
 * 检查消息是否在去重窗口内
 * @param {String} content 消息内容
 * @returns {Boolean} true=需要跳过（重复）, false=可以显示
 */
function isDuplicate(content) {
  const now = Date.now()
  const lastTime = lastMessageMap.get(content)
  if (lastTime && now - lastTime < DEDUPLICATE_WINDOW) {
    return true
  }
  lastMessageMap.set(content, now)
  return false
}

/**
 * 清理过期的消息记录（防止 Map 无限增长）
 * 每 10 条消息清理一次
 */
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

/**
 * 显示消息（带防重复）
 * @param {Object|String} options Element UI Message 配置或直接传消息文本
 * @param {String} type 消息类型：success / warning / info / error
 */
export function showMessage(options, type = 'info') {
  // 支持直接传字符串
  const config = typeof options === 'string' ? { message: options } : { ...options }
  const content = config.message || ''

  // 空消息不显示
  if (!content) return

  // 防重复检查
  if (isDuplicate(content)) return

  cleanupExpired()

  // 调用 Element UI Message
  return Message({
    type,
    duration: config.duration || 3000,
    showClose: config.showClose !== false,
    ...config
  })
}

/** 成功提示 */
export function showSuccess(message, options = {}) {
  return showMessage({ message, ...options }, 'success')
}

/** 错误提示 */
export function showError(message, options = {}) {
  return showMessage({ message, ...options }, 'error')
}

/** 警告提示 */
export function showWarning(message, options = {}) {
  return showMessage({ message, ...options }, 'warning')
}

/** 信息提示 */
export function showInfo(message, options = {}) {
  return showMessage({ message, ...options }, 'info')
}

/**
 * Vue 插件安装
 * 挂载到 Vue.prototype，组件中可通过 this.$msg.xxx 调用
 */
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
