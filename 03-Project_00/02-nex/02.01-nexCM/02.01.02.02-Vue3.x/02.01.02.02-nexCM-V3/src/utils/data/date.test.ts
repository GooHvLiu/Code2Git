/**
 * ==========================================
 * date.ts 单元测试
 * ==========================================
 * 覆盖 formatDate 各格式与边界值、parseDate、addDays、diffDays、isSameDay 等
 * 作者：GooHv
 */
import { describe, it, expect } from 'vitest'
import {
  formatDate,
  parseDate,
  now,
  addDays,
  addMonths,
  diffDays,
  isSameDay,
  isDateBetween,
  startOfDay,
  endOfDay,
  DATE_FORMATS,
  getGlobalDateFormat
} from './date'

describe('formatDate', () => {
  it('空值返回空字符串', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('')).toBe('')
  })

  it('支持时间戳输入', () => {
    // 2024-01-01 00:00:00 UTC+8 → 时间戳
    const ts = new Date(2024, 0, 1, 12, 30, 45).getTime()
    const out = formatDate(ts, 'YYYY-MM-DD HH:mm:ss')
    expect(out).toMatch(/^2024-01-01 12:30:45$/)
  })

  it('支持 Date 对象输入与自定义格式', () => {
    const d = new Date(2024, 5, 15, 8, 30, 5)
    expect(formatDate(d, 'YYYY-MM-DD')).toBe('2024-06-15')
    expect(formatDate(d, 'YYYY/MM/DD')).toBe('2024/06/15')
    expect(formatDate(d, 'HH:mm:ss')).toBe('08:30:05')
  })

  it('支持字符串输入', () => {
    expect(formatDate('2024-12-25', 'YYYY-MM-DD')).toBe('2024-12-25')
  })

  it('默认格式拼接全局日期格式 + HH:mm:ss', () => {
    expect(getGlobalDateFormat()).toBe('YYYY-MM-DD')
    const out = formatDate('2024-03-08 10:20:30')
    expect(out).toBe('2024-03-08 10:20:30')
  })

  it('DATE_FORMATS 常量齐全', () => {
    expect(DATE_FORMATS.DATE).toBe('YYYY-MM-DD')
    expect(DATE_FORMATS.DATETIME).toBe('YYYY-MM-DD HH:mm:ss')
    expect(DATE_FORMATS.COMPACT).toBe('YYYYMMDD')
  })
})

describe('parseDate', () => {
  it('空字符串返回 null', () => {
    expect(parseDate('')).toBeNull()
  })

  it('解析 ISO 字符串为 Date 对象', () => {
    const d = parseDate('2024-07-01')
    expect(d).toBeInstanceOf(Date)
    expect(d!.getFullYear()).toBe(2024)
    expect(d!.getMonth()).toBe(6)
    expect(d!.getDate()).toBe(1)
  })

  it('带 format 参数时返回 Date 对象（依赖内置解析）', () => {
    const d = parseDate('2024-12-25', 'YYYY-MM-DD')
    expect(d).toBeInstanceOf(Date)
    expect(d!.getFullYear()).toBe(2024)
  })
})

describe('日期运算', () => {
  it('addDays 增减天数', () => {
    const base = new Date(2024, 0, 1)
    expect(addDays(base, 5).getDate()).toBe(6)
    expect(addDays(base, -1).getDate()).toBe(31)
  })

  it('addMonths 增减月份', () => {
    expect(addMonths(new Date(2024, 0, 15), 1).getMonth()).toBe(1)
  })

  it('diffDays 计算天数差', () => {
    expect(diffDays('2024-01-01', '2024-01-11')).toBe(10)
    expect(diffDays('2024-01-11', '2024-01-01')).toBe(-10)
  })

  it('isSameDay 判断同一天', () => {
    expect(isSameDay('2024-05-01 08:00', '2024-05-01 22:00')).toBe(true)
    expect(isSameDay('2024-05-01', '2024-05-02')).toBe(false)
  })

  it('isDateBetween 判断区间', () => {
    expect(isDateBetween('2024-06-15', '2024-06-01', '2024-06-30')).toBe(true)
    expect(isDateBetween('2024-06-01', '2024-06-01', '2024-06-30')).toBe(true)
    expect(isDateBetween('2024-07-01', '2024-06-01', '2024-06-30')).toBe(false)
  })

  it('startOfDay / endOfDay', () => {
    const s = startOfDay('2024-03-10 15:45:30')
    expect(s.getHours()).toBe(0)
    expect(s.getMinutes()).toBe(0)
    const e = endOfDay('2024-03-10 15:45:30')
    expect(e.getHours()).toBe(23)
  })
})

describe('now', () => {
  it('返回当前时间字符串', () => {
    const out = now()
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('支持自定义格式', () => {
    expect(now('YYYY')).toBe(String(new Date().getFullYear()))
  })
})
