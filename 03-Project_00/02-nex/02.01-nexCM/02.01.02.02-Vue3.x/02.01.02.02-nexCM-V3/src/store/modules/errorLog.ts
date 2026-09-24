/**
 * ==========================================
 * ErrorLog Store - 前端错误日志
 * ==========================================
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import settings from '@/settings'
import i18n from '@/i18n'
import { IS_PROD } from '@/utils/config/env'

interface ErrorLogItem {
  message: string
  stack: string
  info: string
  url: string
  time: string
}

export const useErrorLogStore = defineStore('errorLog', () => {
  const logs = ref<ErrorLogItem[]>([])

  function addErrorLog(errorInfo: { err?: { message?: string; stack?: string }; info?: string }): void {
    if (settings.errorLog === 'none') return
    if (settings.errorLog === 'production' && !IS_PROD) return
    const { err, info } = errorInfo
    logs.value.push({
      message: err?.message || (i18n.global.t('common.error.UNKNOWN_ERROR') as string),
      stack: err?.stack || '',
      info: info || '',
      url: window.location.href,
      time: new Date().toLocaleString()
    })
  }

  function clearErrorLog(): void {
    logs.value = []
  }

  return { logs, addErrorLog, clearErrorLog }
})
