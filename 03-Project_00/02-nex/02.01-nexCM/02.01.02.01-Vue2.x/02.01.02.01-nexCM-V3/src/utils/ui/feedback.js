/**
 * ==========================================
 * 用户反馈工具（消息提示 + 确认弹窗）
 * ==========================================
 * 统一封装 Element UI 的 Message 和 MessageBox
 * 包含消息防重复、确认弹窗、删除确认、批量操作确认等
 *
 * 用法：
 * import { showSuccess, showError, confirmDelete, confirmAction } from '@/utils/ui/feedback'
 * showError('请求失败')
 * const ok = await confirmDelete('确定要删除吗？')
 */
import { Message, MessageBox } from 'element-ui'
import i18n from '@/i18n'

// 国际化辅助函数
function t(key) {
  return i18n.t(key)
}

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
export function confirmAction(message, title = t('common.tip'), options = {}) {
  return MessageBox.confirm(message, title, {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    ...options
  })
    .then(() => true)
    .catch(() => false)
}

/** 删除确认 */
export function confirmDelete(message = '确定要删除吗？删除后不可恢复。') {
  return confirmAction(message, t('common.deleteConfirm'), {
    confirmButtonText: t('common.confirmDelete'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
}

/** 批量操作确认 */
export function confirmBatch(count, action = '操作') {
  if (count === 0) {
    return Promise.resolve(false)
  }
  return confirmAction(`已选中 ${count} 项，确定要执行${action}吗？`, t('common.batchConfirm'), {
    type: 'warning'
  })
}

/** 危险操作确认 */
export function confirmDanger(message, confirmText = '') {
  return MessageBox.confirm(message, t('common.dangerOperation'), {
    confirmButtonText: t('common.confirmExecute'),
    cancelButtonText: t('common.cancel'),
    type: 'error',
    distinguishCancelAndClose: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm' && confirmText) {
        if (instance.inputValue !== confirmText) {
          instance.$message.error(t('common.message.confirmTextRequired', { text: confirmText }))
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
  return confirmAction('确定要退出登录吗？', t('common.logoutConfirm'), {
    confirmButtonText: t('common.logout'),
    cancelButtonText: t('common.cancel'),
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
