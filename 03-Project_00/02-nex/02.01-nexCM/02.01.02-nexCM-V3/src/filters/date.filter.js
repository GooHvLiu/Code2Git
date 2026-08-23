/**
 * 日期格式化过滤器 Vue2
 * 内部调用 @/utils/date 的 formatDate 函数，统一日期处理逻辑
 * @param {String|Number|Date} originVal 原始日期：时间戳/日期字符串/Date对象
 * @param {String} fmt 输出格式 YYYY-MM-DD HH:mm:ss | YYYY-MM-DD | YYYY-MM-DD HH:mm
 * @param {String} emptyText 空数据占位符
 * @returns {String} 格式化后日期
 */
import { formatDate, getGlobalDateFormat } from '@/utils/date'

export function formatDateFilter(originVal, fmt, emptyText = '--') {
  // 空值直接返回占位符
  if (originVal === null || originVal === undefined || originVal === '') {
    return emptyText
  }

  // 如果没有指定格式，使用全局默认日期格式 + 时间部分
  if (!fmt) {
    fmt = getGlobalDateFormat() + ' HH:mm:ss'
  }

  try {
    // 处理字符串时间戳（转换为数字）
    let value = originVal
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = Number(value)
    }

    // 兼容 10位秒时间戳（转换为 13位毫秒时间戳）
    if (typeof value === 'number' && value.toString().length === 10) {
      value = value * 1000
    }

    // 调用统一的日期格式化函数
    const result = formatDate(value, fmt)

    // 如果格式化结果为空或无效，返回占位符
    if (!result || result === 'Invalid Date') {
      return emptyText
    }

    return result
  } catch (err) {
    // 发生异常时返回占位符
    // eslint-disable-next-line no-console
    console.warn('日期格式化失败：', err)
    return emptyText
  }
}
