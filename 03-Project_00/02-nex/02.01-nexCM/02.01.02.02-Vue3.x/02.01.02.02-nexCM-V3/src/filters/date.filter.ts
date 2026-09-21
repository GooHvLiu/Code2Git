/**
 * 日期格式化过滤器等价函数（Vue3 无模板过滤器，导出纯函数）
 * @param originVal 时间戳/日期字符串/Date 对象
 * @param fmt 输出格式
 * @param emptyText 空数据占位符
 */
import { formatDate, getGlobalDateFormat } from '@/utils/data/date'

export function formatDateFilter(originVal: unknown, fmt?: string, emptyText = '--'): string {
  if (originVal === null || originVal === undefined || originVal === '') return emptyText
  let format = fmt
  if (!format) format = getGlobalDateFormat() + ' HH:mm:ss'
  try {
    let value = originVal
    if (typeof value === 'string' && /^\d+$/.test(value)) value = Number(value)
    if (typeof value === 'number' && value.toString().length === 10) value = value * 1000
    const result = formatDate(value as Date, format)
    if (!result || result === 'Invalid Date') return emptyText
    return result
  } catch (err) {
    console.warn('日期格式化失败：', err)
    return emptyText
  }
}
