/**
 * ==========================================
 * 通用工具函数
 * ==========================================
 * 防抖、节流、深拷贝、类型判断等常用工具
 * 业务代码按需 import，如 import { debounce } from '@/utils'
 */

/**
 * 防抖：事件触发后等待 wait 毫秒才执行，期间再次触发则重新计时
 * @param {Function} fn 要执行的函数
 * @param {Number} wait 等待毫秒数
 * @param {Boolean} immediate 是否立即执行（首次触发立即执行，后续等待）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, wait = 300, immediate = false) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    if (immediate && !timer) {
      fn.apply(this, args)
    }
    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args)
      timer = null
    }, wait)
  }
}

/**
 * 节流：每隔 wait 毫秒最多执行一次
 * @param {Function} fn 要执行的函数
 * @param {Number} wait 间隔毫秒数
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, wait = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝（支持 Date、RegExp、Array、Object，不支持函数/循环引用）
 * @param {*} obj 要拷贝的对象
 * @returns {*} 拷贝后的新对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof RegExp) return new RegExp(obj)
  if (Array.isArray(obj)) return obj.map(item => deepClone(item))
  const result = {}
  Object.keys(obj).forEach(key => {
    result[key] = deepClone(obj[key])
  })
  return result
}

/**
 * 判断是否为空值（null / undefined / '' / [] / {}）
 * @param {*} value
 * @returns {Boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}

/**
 * 判断数据类型
 * @param {*} value
 * @returns {String} 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' | 'Null' | 'Undefined' | 'Date' | 'RegExp' | 'Function'
 */
export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * 生成唯一 ID（简易版，非 UUID 标准）
 * @param {String} prefix 前缀
 * @returns {String}
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 树形结构扁平化
 * @param {Array} tree 树形数组
 * @param {String} childrenKey 子节点字段名
 * @returns {Array} 扁平化后的数组
 */
export function flattenTree(tree, childrenKey = 'children') {
  const result = []
  const traverse = nodes => {
    nodes.forEach(node => {
      result.push(node)
      if (node[childrenKey] && node[childrenKey].length > 0) {
        traverse(node[childrenKey])
      }
    })
  }
  traverse(tree)
  return result
}

/**
 * 在树形结构中查找节点
 * @param {Array} tree 树形数组
 * @param {Function} predicate 判断函数
 * @param {String} childrenKey 子节点字段名
 * @returns {Object|null} 找到的节点
 */
export function findInTree(tree, predicate, childrenKey = 'children') {
  for (const node of tree) {
    if (predicate(node)) return node
    if (node[childrenKey] && node[childrenKey].length > 0) {
      const found = findInTree(node[childrenKey], predicate, childrenKey)
      if (found) return found
    }
  }
  return null
}

/**
 * 下载文件（通过 Blob）
 * @param {Blob} blob 文件内容
 * @param {String} filename 文件名
 */
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 金额格式化（千分位）
 * @param {Number|String} num 金额
 * @param {Number} decimals 小数位数
 * @returns {String}
 */
export function formatMoney(num, decimals = 2) {
  if (isNaN(Number(num))) return '--'
  return Number(num).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}
