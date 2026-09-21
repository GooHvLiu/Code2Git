/**
 * 翻译格式转换工具
 * 支持三种格式：正常翻译、首字大写、驼峰命名
 * @author GooHv
 */

/**
 * 将文本拆分为单词数组，处理空格、连字符、下划线、驼峰等多种分隔方式
 * @param text 输入文本
 * @returns 单词数组（已小写）
 */
function splitWords(text: string): string[] {
  if (!text || typeof text !== 'string') return []
  let processed = text.replace(/[-_]/g, ' ')
  processed = processed.replace(/([a-z])([A-Z])/g, '$1 $2')
  processed = processed.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
  return processed
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase())
}

/** 正常格式：全小写，单词间空格。例：system privileges */
export function toNormalCase(text: string): string {
  const words = splitWords(text)
  if (words.length === 0) return text || ''
  return words.join(' ')
}

/** 首字大写格式：每个单词首字母大写。例：System Privileges */
export function toTitleCase(text: string): string {
  const words = splitWords(text)
  if (words.length === 0) return text || ''
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** 驼峰格式：首词小写其余首字母大写无空格。例：systemPrivileges */
export function toCamelCase(text: string): string {
  const words = splitWords(text)
  if (words.length === 0) return text || ''
  if (words.length === 1) return words[0]
  return words[0] + words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

export type FormatType = 'normal' | 'title' | 'camel'

/** 根据格式类型应用对应格式化 */
export function applyFormat(text: string, format: string): string {
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

export const FORMAT_TYPES = {
  NORMAL: 'normal',
  TITLE: 'title',
  CAMEL: 'camel'
} as const

export default {
  toNormalCase,
  toTitleCase,
  toCamelCase,
  applyFormat,
  FORMAT_TYPES,
  splitWords
}
