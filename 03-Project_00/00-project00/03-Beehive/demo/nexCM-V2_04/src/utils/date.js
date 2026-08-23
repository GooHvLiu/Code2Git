/**
 * ==========================================
 * 日期工具封装
 * ==========================================
 * 基于 dayjs 封装常用日期处理方法
 * dayjs 轻量（2KB），API 与 moment 兼容
 *
 * 用法：
 * import { formatDate, parseDate, addDays, diffDays, isBetween } from '@/utils/date'
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/zh-cn'

// 注册插件
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
// 设置中文
dayjs.locale('zh-cn')

/**
 * 常用格式化模板
 */
export const DATE_FORMATS = {
  /** 年-月-日 */
  DATE: 'YYYY-MM-DD',
  /** 年-月-日 时:分:秒 */
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  /** 年-月-日 时:分 */
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  /** 时:分:秒 */
  TIME: 'HH:mm:ss',
  /** 时:分 */
  TIME_MINUTE: 'HH:mm',
  /** 年-月 */
  MONTH: 'YYYY-MM',
  /** 年月日（无分隔符，用于文件名） */
  COMPACT: 'YYYYMMDD',
  /** 年月日时分秒（无分隔符，用于文件名） */
  COMPACT_DATETIME: 'YYYYMMDDHHmmss'
}

/**
 * 格式化日期
 * @param {Date|String|Number} date 日期
 * @param {String} format 格式化模板，默认 YYYY-MM-DD HH:mm:ss
 * @returns {String} 格式化后的字符串
 */
export function formatDate(date, format = DATE_FORMATS.DATETIME) {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 解析日期字符串为 Date 对象
 * @param {String} dateStr 日期字符串
 * @param {String} format 日期格式，可选
 * @returns {Date} Date 对象
 */
export function parseDate(dateStr, format) {
  if (!dateStr) return null
  return format ? dayjs(dateStr, format).toDate() : dayjs(dateStr).toDate()
}

/**
 * 获取当前时间
 * @param {String} format 格式化模板，默认 DATETIME
 * @returns {String}
 */
export function now(format = DATE_FORMATS.DATETIME) {
  return dayjs().format(format)
}

/**
 * 日期加减（天）
 * @param {Date|String} date 基准日期
 * @param {Number} days 天数，正数加，负数减
 * @returns {Date}
 */
export function addDays(date, days) {
  return dayjs(date).add(days, 'day').toDate()
}

/**
 * 日期加减（月）
 * @param {Date|String} date 基准日期
 * @param {Number} months 月数
 * @returns {Date}
 */
export function addMonths(date, months) {
  return dayjs(date).add(months, 'month').toDate()
}

/**
 * 计算两个日期相差天数
 * @param {Date|String} start 开始日期
 * @param {Date|String} end 结束日期
 * @returns {Number} 天数
 */
export function diffDays(start, end) {
  return dayjs(end).diff(dayjs(start), 'day')
}

/**
 * 判断日期是否在两个日期之间
 * @param {Date|String} date 要判断的日期
 * @param {Date|String} start 开始日期
 * @param {Date|String} end 结束日期
 * @param {String} inclusivity 包含方式：'()' 不包含, '[]' 包含两端, '[)' 含左不含右, '(]' 含右不含左
 * @returns {Boolean}
 */
export function isDateBetween(date, start, end, inclusivity = '[]') {
  return dayjs(date).isBetween(start, end, null, inclusivity)
}

/**
 * 获取日期的开始时间（当天 00:00:00）
 * @param {Date|String} date
 * @returns {Date}
 */
export function startOfDay(date) {
  return dayjs(date).startOf('day').toDate()
}

/**
 * 获取日期的结束时间（当天 23:59:59）
 * @param {Date|String} date
 * @returns {Date}
 */
export function endOfDay(date) {
  return dayjs(date).endOf('day').toDate()
}

/**
 * 获取相对时间描述（如"3 分钟前"、"2 天前"）
 * @param {Date|String} date
 * @returns {String}
 */
export function fromNow(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}

/**
 * 判断是否为今天
 * @param {Date|String} date
 * @returns {Boolean}
 */
export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * 判断是否为同一天
 * @param {Date|String} date1
 * @param {Date|String} date2
 * @returns {Boolean}
 */
export function isSameDay(date1, date2) {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

/**
 * 获取月份的第一天
 * @param {Date|String} date
 * @returns {Date}
 */
export function startOfMonth(date) {
  return dayjs(date).startOf('month').toDate()
}

/**
 * 获取月份的最后一天
 * @param {Date|String} date
 * @returns {Date}
 */
export function endOfMonth(date) {
  return dayjs(date).endOf('month').toDate()
}

/**
 * 导出 dayjs 实例（需要使用高级 API 时直接用）
 */
export default dayjs
