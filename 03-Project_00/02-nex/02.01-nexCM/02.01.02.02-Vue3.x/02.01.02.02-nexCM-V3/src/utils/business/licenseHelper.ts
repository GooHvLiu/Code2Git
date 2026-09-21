/**
 * ==========================================
 * 授权工具函数
 * ==========================================
 * 授权管理相关的通用工具函数，可在任意组件 / composable 中 import 使用。
 *
 * 作者：GooHv
 */

/**
 * 格式化授权时间戳
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串 YYYY-MM-DD HH:mm:ss
 */
export function formatLicenseTime(timestamp?: number | string | null): string {
  if (!timestamp) return '-'
  const d = new Date(timestamp)
  if (Number.isNaN(d.getTime())) return '-'
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 授权类型 */
export type LicenseType = 'trial' | 'formal' | 'permanent' | (string & {})

/** Element Plus tag 类型 */
export type EpTagType = 'success' | 'warning' | 'danger' | 'info' | 'primary'

/**
 * 获取授权类型对应的 Element Plus tag 类型
 * @param type 授权类型 trial/formal/permanent
 */
export function licenseTypeTag(type?: LicenseType): EpTagType {
  const map: Record<string, EpTagType> = { trial: 'warning', formal: 'success', permanent: 'success' }
  return (type && map[type]) || 'info'
}

/**
 * 获取授权类型的展示标签
 * @param type 授权类型 trial/formal/permanent
 */
export function licenseTypeLabel(type?: LicenseType): string {
  const map: Record<string, string> = { trial: '试用授权', formal: '正式授权', permanent: '永久授权' }
  return (type && map[type]) || type || '-'
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns 是否复制成功
 */
export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!text) {
      resolve(false)
      return
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      resolve(true)
    } catch (e) {
      resolve(false)
    }
    document.body.removeChild(textarea)
  })
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 计算授权剩余时间文本
 * @param expireTimestamp 过期时间戳（毫秒）
 * @returns 剩余时间文本，如 "30天 12时 30分" 或 "已过期"
 */
export function getLicenseCountdown(expireTimestamp?: number | string | null): string {
  if (!expireTimestamp) return '-'
  const diff = Number(expireTimestamp) - Date.now()
  if (diff <= 0) return '已过期'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${days}天 ${hours}时 ${minutes}分`
}

export default {
  formatLicenseTime,
  licenseTypeTag,
  licenseTypeLabel,
  copyToClipboard,
  formatFileSize,
  getLicenseCountdown
}
