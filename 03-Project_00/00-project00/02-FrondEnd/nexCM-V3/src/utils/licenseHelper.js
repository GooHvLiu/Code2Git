/**
 * ==========================================
 * 授权工具函数
 * ==========================================
 * 授权管理相关的通用工具函数
 * 可在任意组件中 import 使用
 */

/**
 * 格式化授权时间戳
 * @param {number} timestamp 时间戳（毫秒）
 * @returns {string} 格式化后的时间字符串 YYYY-MM-DD HH:mm:ss
 */
export function formatLicenseTime(timestamp) {
  if (!timestamp) return '-'
  const d = new Date(timestamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * 获取授权类型对应的 Element UI tag 类型
 * @param {string} type 授权类型 trial/formal/permanent
 * @returns {string} Element UI tag 类型 success/warning/info
 */
export function licenseTypeTag(type) {
  const map = { trial: 'warning', formal: 'success', permanent: 'success' }
  return map[type] || 'info'
}

/**
 * 获取授权类型的中文标签
 * @param {string} type 授权类型 trial/formal/permanent
 * @returns {string} 中文标签
 */
export function licenseTypeLabel(type) {
  const map = { trial: '试用授权', formal: '正式授权', permanent: '永久授权' }
  return map[type] || type || '-'
}

/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export function copyToClipboard(text) {
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
 * @param {number} bytes 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 计算授权剩余时间文本
 * @param {number} expireTimestamp 过期时间戳
 * @returns {string} 剩余时间文本，如 "30天 12时 30分" 或 "已过期"
 */
export function getLicenseCountdown(expireTimestamp) {
  if (!expireTimestamp) return '-'
  const diff = expireTimestamp - Date.now()
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
