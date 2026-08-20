/**
 * ==========================================
 * 文件上传工具
 * ==========================================
 * 统一处理文件上传的校验、进度、错误
 * 配合 request.js 的 axios 实例使用
 *
 * 用法：
 * import { uploadFile, uploadImage, validateFile } from '@/utils/upload'
 * uploadFile(file, '/api/upload', { onProgress: e => console.log(e.percent) })
 */
import request from './request'
import { showError } from './message'

/**
 * 默认文件大小限制（字节）
 * 10MB = 10 * 1024 * 1024
 */
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024

/**
 * 默认图片类型
 */
const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']

/**
 * 文件校验配置
 */
export const UPLOAD_CONFIG = {
  /** 最大文件大小（字节） */
  maxSize: DEFAULT_MAX_SIZE,
  /** 允许的图片类型 */
  imageTypes: DEFAULT_IMAGE_TYPES,
  /** 允许的文件类型（空数组表示不限制） */
  allowTypes: []
}

/**
 * 校验文件大小
 * @param {File} file 文件对象
 * @param {Number} maxSize 最大大小（字节）
 * @returns {Boolean} true=通过, false=超限
 */
export function validateFileSize(file, maxSize = UPLOAD_CONFIG.maxSize) {
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(1)
    showError(`文件大小不能超过 ${sizeMB}MB`)
    return false
  }
  return true
}

/**
 * 校验文件类型
 * @param {File} file 文件对象
 * @param {Array} allowTypes 允许的 MIME 类型数组
 * @returns {Boolean} true=通过, false=类型不允许
 */
export function validateFileType(file, allowTypes = UPLOAD_CONFIG.allowTypes) {
  if (allowTypes.length === 0) return true
  if (!allowTypes.includes(file.type)) {
    showError(`不支持的文件类型：${file.type}`)
    return false
  }
  return true
}

/**
 * 校验图片文件
 * @param {File} file 文件对象
 * @param {Array} imageTypes 允许的图片类型
 * @returns {Boolean}
 */
export function validateImage(file, imageTypes = UPLOAD_CONFIG.imageTypes) {
  if (!imageTypes.includes(file.type)) {
    showError('只支持 JPG、PNG、GIF、WEBP、BMP 格式的图片')
    return false
  }
  return true
}

/**
 * 综合校验文件（大小 + 类型）
 * @param {File} file 文件对象
 * @param {Object} options 校验配置
 * @param {Number} options.maxSize 最大大小
 * @param {Array} options.allowTypes 允许类型
 * @param {Boolean} options.isImage 是否为图片
 * @returns {Boolean}
 */
export function validateFile(file, options = {}) {
  const { maxSize, allowTypes, isImage = false } = options

  if (!validateFileSize(file, maxSize)) return false
  if (isImage) {
    return validateImage(file, allowTypes && allowTypes.length ? allowTypes : undefined)
  }
  if (allowTypes && allowTypes.length) {
    return validateFileType(file, allowTypes)
  }
  return true
}

/**
 * 上传文件
 * @param {File} file 文件对象
 * @param {String} url 上传地址
 * @param {Object} options 配置项
 * @param {Object} options.data 额外表单数据
 * @param {String} options.fieldName 文件字段名，默认 file
 * @param {Function} options.onProgress 进度回调 (percent) => {}
 * @param {Object} options.headers 额外请求头
 * @returns {Promise} 上传结果
 */
export function uploadFile(file, url, options = {}) {
  const { data = {}, fieldName = 'file', onProgress, headers = {} } = options

  const formData = new FormData()
  formData.append(fieldName, file)

  // 追加额外表单数据
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })

  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    // 上传进度
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onProgress(percent)
      }
    }
  })
}

/**
 * 上传图片（自动校验图片类型和大小）
 * @param {File} file 图片文件
 * @param {String} url 上传地址
 * @param {Object} options 配置项（同 uploadFile，额外支持 maxSize）
 * @returns {Promise|null} 校验失败返回 null
 */
export function uploadImage(file, url, options = {}) {
  const { maxSize, ...rest } = options

  // 校验图片
  if (!validateImage(file)) return null
  if (!validateFileSize(file, maxSize || UPLOAD_CONFIG.maxSize)) return null

  return uploadFile(file, url, rest)
}

/**
 * 获取文件扩展名
 * @param {String} filename 文件名
 * @returns {String} 扩展名（小写，不含点）
 */
export function getFileExtension(filename) {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

/**
 * 格式化文件大小
 * @param {Number} bytes 字节数
 * @returns {String} 格式化后的大小，如 "1.5 MB"
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}
