/**
 * 翻译格式转换工具
 * 支持三种格式：正常翻译、首字大写、驼峰命名
 */

/**
 * 将文本拆分为单词数组
 * 处理空格、连字符、下划线、大小写转换等多种分隔方式
 * @param {string} text - 输入文本
 * @returns {string[]} 单词数组
 */
function splitWords(text) {
  if (!text || typeof text !== 'string') return []
  
  // 先将连字符和下划线替换为空格
  let processed = text.replace(/[-_]/g, ' ')
  
  // 处理驼峰命名：在大写字母前插入空格
  processed = processed.replace(/([a-z])([A-Z])/g, '$1 $2')
  processed = processed.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
  
  // 按空格拆分，过滤空字符串
  return processed
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase())
}

/**
 * 正常翻译格式：全小写，单词间有空格
 * 示例："system privileges"
 * @param {string} text - 输入文本
 * @returns {string} 格式化后的文本
 */
export function toNormalCase(text) {
  const words = splitWords(text)
  if (words.length === 0) return text || ''
  return words.join(' ')
}

/**
 * 首字大写格式：每个单词首字母大写，单词间有空格
 * 示例："System Privileges"
 * @param {string} text - 输入文本
 * @returns {string} 格式化后的文本
 */
export function toTitleCase(text) {
  const words = splitWords(text)
  if (words.length === 0) return text || ''
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * 驼峰命名格式：首词小写，后续单词首字母大写，无空格
 * 示例："systemPrivileges"
 * @param {string} text - 输入文本
 * @returns {string} 格式化后的文本
 */
export function toCamelCase(text) {
  const words = splitWords(text)
  if (words.length === 0) return text || ''
  if (words.length === 1) return words[0]
  return words[0] + words
    .slice(1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * 根据格式类型应用对应的格式化
 * @param {string} text - 输入文本
 * @param {string} format - 格式类型：normal | title | camel
 * @returns {string} 格式化后的文本
 */
export function applyFormat(text, format) {
  switch (format) {
    case 'normal':
      return toNormalCase(text)
    case 'title':
      return toTitleCase(text)
    case 'camel':
      return toCamelCase(text)
    default:
      return text
  }
}

/**
 * 格式类型定义
 */
export const FORMAT_TYPES = {
  NORMAL: 'normal',
  TITLE: 'title',
  CAMEL: 'camel'
}

export default {
  toNormalCase,
  toTitleCase,
  toCamelCase,
  applyFormat,
  FORMAT_TYPES,
  splitWords
}
