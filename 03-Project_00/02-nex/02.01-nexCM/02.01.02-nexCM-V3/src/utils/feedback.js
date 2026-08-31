/**
 * ==========================================
 * 用户反馈工具（消息提示 + 确认弹窗）
 * ==========================================
 * 统一封装 Element UI 的 Message 和 MessageBox
 * 包含消息防重复、确认弹窗、删除确认、批量操作确认等
 *
 * 用法：
 * import { showSuccess, showError, confirmDelete, confirmAction } from '@/utils/feedback'
 * showError('请求失败')
 * const ok = await confirmDelete('确定要删除吗？')
 */
import { Message, MessageBox } from 'element-ui'

// ==================== 消息提示（防重复） ====================

/** 消息去重时间窗口（毫秒） */
const DEDUPLICATE_WINDOW = 3000

/** 最近显示的消息记录 */
const lastMessageMap = new Map()

/** 检查消息是否在去重窗口内 */
function isDuplicate(content) {
  const now = Date.now()
  const lastTime = lastMessageMap.get(content)
  if (lastTime && now - lastTime < DEDUPLICATE_WINDOW) {
    return true
  }
  lastMessageMap.set(content, now)
  return false
}

/** 清理过期的消息记录 */
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

/** 显示消息（带防重复） */
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

// ==================== 确认弹窗 ====================

/** 通用确认弹窗 */
export function confirmAction(message, title = '提示', options = {}) {
  return MessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    ...options
  })
    .then(() => true)
    .catch(() => false)
}

/** 删除确认 */
export function confirmDelete(message = '确定要删除吗？删除后不可恢复。') {
  return confirmAction(message, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

/** 批量操作确认 */
export function confirmBatch(count, action = '操作') {
  if (count === 0) {
    return Promise.resolve(false)
  }
  return confirmAction(`已选中 ${count} 项，确定要执行${action}吗？`, '批量操作确认', {
    type: 'warning'
  })
}

/** 危险操作确认 */
export function confirmDanger(message, confirmText = '') {
  return MessageBox.confirm(message, '危险操作', {
    confirmButtonText: '确认执行',
    cancelButtonText: '取消',
    type: 'error',
    distinguishCancelAndClose: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm' && confirmText) {
        if (instance.inputValue !== confirmText) {
          instance.$message.error(`请输入 "${confirmText}" 以确认`)
          return
        }
      }
      done()
    }
  })
    .then(() => true)
    .catch(() => false)
}

/** 退出登录确认 */
export function confirmLogout() {
  return confirmAction('确定要退出登录吗？', '退出确认', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

// ==================== Vue 插件安装 ====================

export default {
  install(Vue) {
    Vue.prototype.$msg = {
      show: showMessage,
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo
    }
    Vue.prototype.$confirm = {
      action: confirmAction,
      delete: confirmDelete,
      batch: confirmBatch,
      danger: confirmDanger,
      logout: confirmLogout
    }
  }
}
