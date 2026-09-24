/**
 * ==========================================
 * 用户反馈工具（消息提示 + 确认弹窗）
 * ==========================================
 * 统一封装 Element Plus 的 ElMessage / ElMessageBox，含消息防重复。
 * 页面直接 import 使用，不再依赖 Vue.prototype.$msg / $confirm。
 *
 * 用法：
 *   import { showSuccess, showError, confirmDelete } from '@/utils/ui/feedback'
 *   showError('请求失败')
 *   const ok = await confirmDelete('确定要删除吗？')
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/i18n'

function t(key: string, params?: Record<string, unknown>): string {
  return i18n.global.t(key, params || {}) as string
}

/** 消息去重时间窗口（毫秒） */
const DEDUPLICATE_WINDOW = 3000
const lastMessageMap = new Map<string, number>()

function isDuplicate(content: string): boolean {
  const now = Date.now()
  const lastTime = lastMessageMap.get(content)
  if (lastTime && now - lastTime < DEDUPLICATE_WINDOW) return true
  lastMessageMap.set(content, now)
  return false
}

let messageCount = 0
function cleanupExpired(): void {
  messageCount++
  if (messageCount < 10) return
  messageCount = 0
  const now = Date.now()
  lastMessageMap.forEach((time, key) => {
    if (now - time >= DEDUPLICATE_WINDOW) lastMessageMap.delete(key)
  })
}

interface ShowMessageOptions {
  message?: string
  duration?: number
  showClose?: boolean
  [key: string]: unknown
}

export function showMessage(
  options: string | ShowMessageOptions,
  type: 'success' | 'warning' | 'info' | 'error' = 'info'
) {
  const config: ShowMessageOptions = typeof options === 'string' ? { message: options } : { ...options }
  const content = config.message || ''
  if (!content) return
  if (isDuplicate(content)) return
  cleanupExpired()
  return ElMessage({
    type,
    duration: config.duration || 3000,
    showClose: config.showClose !== false,
    message: content
  })
}

export function showSuccess(message: string, options: ShowMessageOptions = {}) {
  return showMessage({ message, ...options }, 'success')
}
export function showError(message: string, options: ShowMessageOptions = {}) {
  return showMessage({ message, ...options }, 'error')
}
export function showWarning(message: string, options: ShowMessageOptions = {}) {
  return showMessage({ message, ...options }, 'warning')
}
export function showInfo(message: string, options: ShowMessageOptions = {}) {
  return showMessage({ message, ...options }, 'info')
}

export function confirmAction(
  message: string,
  title: string = t('common.tip'),
  options: Record<string, unknown> = {}
): Promise<boolean> {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    ...options
  })
    .then(() => true)
    .catch(() => false)
}

export function confirmDelete(message?: string): Promise<boolean> {
  return confirmAction(message || t('common.deleteConfirmDefault'), t('common.deleteConfirm'), {
    confirmButtonText: t('common.confirmDelete'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
}

export function confirmBatch(count: number, action?: string): Promise<boolean> {
  if (count === 0) return Promise.resolve(false)
  return confirmAction(
    t('common.batchConfirmMessage', { count, action: action || t('common.action') }),
    t('common.batchConfirm'),
    {
      type: 'warning'
    }
  )
}

export function confirmDanger(message: string, confirmText = ''): Promise<boolean> {
  return ElMessageBox.confirm(message, t('common.dangerOperation'), {
    confirmButtonText: t('common.confirmExecute'),
    cancelButtonText: t('common.cancel'),
    type: 'error',
    distinguishCancelAndClose: true,
    beforeClose: (action: string, instance, done: () => void) => {
      if (action === 'confirm' && confirmText) {
        if (instance.inputValue !== confirmText) {
          ElMessage.error(t('common.confirmTextRequired', { text: confirmText }))
          return
        }
      }
      done()
    }
  })
    .then(() => true)
    .catch(() => false)
}

export function confirmLogout(): Promise<boolean> {
  return confirmAction(t('common.logoutConfirmMessage'), t('common.logoutConfirm'), {
    confirmButtonText: t('common.logout'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
}

/** 命令式快捷封装（替代原 Vue.prototype.$msg / $confirm） */
export const $msg = {
  show: showMessage,
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo
}

export const $confirm = {
  action: confirmAction,
  delete: confirmDelete,
  batch: confirmBatch,
  danger: confirmDanger,
  logout: confirmLogout
}
