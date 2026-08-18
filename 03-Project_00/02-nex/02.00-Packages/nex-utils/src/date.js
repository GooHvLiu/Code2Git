/**
 * ==========================================
 * 日期工具封装（基于 dayjs）
 * ==========================================
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('zh-cn')

export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  TIME: 'HH:mm:ss',
  TIME_MINUTE: 'HH:mm',
  MONTH: 'YYYY-MM',
  COMPACT: 'YYYYMMDD',
  COMPACT_DATETIME: 'YYYYMMDDHHmmss'
}

export function formatDate(date, format = DATE_FORMATS.DATETIME) {
  if (!date) return ''
  return dayjs(date).format(format)
}

export function parseDate(dateStr, format) {
  if (!dateStr) return null
  return format ? dayjs(dateStr, format).toDate() : dayjs(dateStr).toDate()
}

export function now(format = DATE_FORMATS.DATETIME) {
  return dayjs().format(format)
}

export function addDays(date, days) {
  return dayjs(date).add(days, 'day').toDate()
}

export function addMonths(date, months) {
  return dayjs(date).add(months, 'month').toDate()
}

export function diffDays(start, end) {
  return dayjs(end).diff(dayjs(start), 'day')
}

export function isDateBetween(date, start, end, inclusivity = '[]') {
  return dayjs(date).isBetween(start, end, null, inclusivity)
}

export function startOfDay(date) {
  return dayjs(date).startOf('day').toDate()
}

export function endOfDay(date) {
  return dayjs(date).endOf('day').toDate()
}

export function fromNow(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isSameDay(date1, date2) {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

export function startOfMonth(date) {
  return dayjs(date).startOf('month').toDate()
}

export function endOfMonth(date) {
  return dayjs(date).endOf('month').toDate()
}

export default dayjs
