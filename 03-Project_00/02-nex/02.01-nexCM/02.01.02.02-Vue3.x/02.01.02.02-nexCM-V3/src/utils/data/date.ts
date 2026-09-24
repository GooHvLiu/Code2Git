/**
 * ==========================================
 * 日期工具封装（基于 dayjs）
 * ==========================================
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('zh-cn')

let globalDateFormat = 'YYYY-MM-DD'

if (typeof window !== 'undefined') {
  window.addEventListener('dateFormatChanged', (event: Event) => {
    const detail = (event as CustomEvent<{ format?: string }>).detail
    if (detail?.format) globalDateFormat = detail.format
  })
}

export function getGlobalDateFormat(): string {
  return globalDateFormat
}

export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  TIME: 'HH:mm:ss',
  TIME_MINUTE: 'HH:mm',
  MONTH: 'YYYY-MM',
  COMPACT: 'YYYYMMDD',
  COMPACT_DATETIME: 'YYYYMMDDHHmmss'
} as const

export function formatDate(date: Date | string | number | undefined | null, format?: string): string {
  if (!date) return ''
  return dayjs(date).format(format || `${globalDateFormat} HH:mm:ss`)
}

export function parseDate(dateStr: string, format?: string): Date | null {
  if (!dateStr) return null
  return format ? dayjs(dateStr, format).toDate() : dayjs(dateStr).toDate()
}

export function now(format: string = DATE_FORMATS.DATETIME): string {
  return dayjs().format(format)
}

export function addDays(date: Date | string, days: number): Date {
  return dayjs(date).add(days, 'day').toDate()
}

export function addMonths(date: Date | string, months: number): Date {
  return dayjs(date).add(months, 'month').toDate()
}

export function diffDays(start: Date | string, end: Date | string): number {
  return dayjs(end).diff(dayjs(start), 'day')
}

export function isDateBetween(
  date: Date | string,
  start: Date | string,
  end: Date | string,
  inclusivity: string = '[]'
): boolean {
  return dayjs(date).isBetween(start, end, null, inclusivity as '[]')
}

export function startOfDay(date: Date | string): Date {
  return dayjs(date).startOf('day').toDate()
}

export function endOfDay(date: Date | string): Date {
  return dayjs(date).endOf('day').toDate()
}

export function fromNow(date: Date | string | undefined | null): string {
  if (!date) return ''
  return dayjs(date).fromNow()
}

export function isToday(date: Date | string): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  return dayjs(date1).isSame(dayjs(date2), 'day')
}

export function startOfMonth(date: Date | string): Date {
  return dayjs(date).startOf('month').toDate()
}

export function endOfMonth(date: Date | string): Date {
  return dayjs(date).endOf('month').toDate()
}

export default dayjs
