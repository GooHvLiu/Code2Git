/**
 * ==========================================
 * notificationPresenter - 通知展示适配层（单一事实来源）
 * ==========================================
 * 后端通知只存国际化 key（title_key / content_key）与参数，不存多语言文案；
 * 本模块统一负责：参数解析、标题/内容翻译、相对时间格式化、DTO -> 视图模型(VM) 映射。
 * 顶部铃铛（NotificationBell）与「通知中心」页（views/notification）必须共用本模块，
 * 不得在各组件内各自实现一套字段取值，避免出现字段名不一致导致的空白。
 * 作者：GooHv
 */

import { formatDate, DATE_FORMATS } from '@/utils/data/date'

/** 翻译函数最小契约（解耦 vue-i18n 实例，便于单测） */
export type Translate = (key: string, named?: Record<string, unknown>) => string

/** 后端通知数据传输对象（字段与后端 /notification 列表一致，下划线命名） */
export interface NotificationDTO {
  id: number | string
  type?: string
  /** 0=未读 1=已读 */
  is_read?: number
  /** 标题国际化 key */
  title_key?: string
  /** 内容国际化 key */
  content_key?: string
  /** 标题插值参数（后端可能以 JSON 字符串或对象返回） */
  title_params?: string | Record<string, unknown>
  /** 内容插值参数 */
  content_params?: string | Record<string, unknown>
  create_time?: string
  [key: string]: unknown
}

/** 通知视图模型（供模板直接渲染，驼峰命名） */
export interface NotificationVM {
  id: number | string
  type: string
  /** 是否已读（布尔，便于模板/样式判断） */
  read: boolean
  /** 已翻译标题 */
  title: string
  /** 已翻译内容 */
  content: string
  /** 已格式化（相对时间）时间 */
  time: string
  /** 原始 DTO，标记已读/删除等操作仍使用其 id/is_read */
  raw: NotificationDTO
}

/** 时间类插值参数名：time / 以 time|date 结尾（不区分大小写）/ 驼峰以 Time|Date|At 结尾 */
const TIME_KEY_RE = /(?:^time$|(?:time|date)$|(?:Time|Date|At)$)/

/** ISO 8601 / 标准日期时间字符串（如 2026-09-16T03:11:16.188Z、2026-09-16 03:11:16） */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/

/** 判断参数名是否为时间字段 */
function isTimeKey(key: string): boolean {
  return TIME_KEY_RE.test(key)
}

/**
 * 统一格式化插值参数中的时间字段：
 * 后端可能把原始 ISO 时间作为 {time} 等命名参数下发，这里在翻译前统一转为
 * 项目标准日期时间格式（DATE_FORMATS.DATETIME），与表格等页面保持一致。
 * 非时间字段、非日期字符串原样返回。
 */
function formatTimeParams(params: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(params || {})) {
    if (typeof value === 'string' && isTimeKey(key) && ISO_DATE_RE.test(value.trim())) {
      const formatted = formatDate(value, DATE_FORMATS.DATETIME)
      out[key] = formatted || value
    } else {
      out[key] = value
    }
  }
  return out
}

/** 解析插值参数：兼容 JSON 字符串 / 对象 / 空值，并统一格式化其中的时间字段 */
export function parseParams(paramsStr?: string | Record<string, unknown>): Record<string, unknown> {
  let params: Record<string, unknown>
  if (!paramsStr) return {}
  if (typeof paramsStr === 'string') {
    try {
      const parsed = JSON.parse(paramsStr)
      params = parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  } else {
    params = paramsStr
  }
  return formatTimeParams(params)
}

/** 翻译标题（不使用兜底：key 缺失时返回空串，问题直接暴露） */
export function displayTitle(t: Translate, item?: NotificationDTO | null): string {
  if (!item || !item.title_key) return ''
  return t(item.title_key, parseParams(item.title_params))
}

/** 翻译内容 */
export function displayContent(t: Translate, item?: NotificationDTO | null): string {
  if (!item || !item.content_key) return ''
  return t(item.content_key, parseParams(item.content_params))
}

/** 相对时间格式化（<1分钟 刚刚；<1小时 x分钟前；<24小时 x小时前；<7天 x天前；否则日期） */
export function relativeTime(t: Translate, time?: string): string {
  if (!time) return ''
  const date = new Date(time)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('notification.time.justNow')
  if (minutes < 60) return `${minutes}${t('notification.time.minutesAgo')}`
  if (hours < 24) return `${hours}${t('notification.time.hoursAgo')}`
  if (days < 7) return `${days}${t('notification.time.daysAgo')}`
  return formatDate(date, DATE_FORMATS.DATE)
}

/** 单条 DTO -> VM */
export function toNotificationVM(t: Translate, raw: NotificationDTO): NotificationVM {
  return {
    id: raw.id,
    type: raw.type || 'system',
    read: Number(raw.is_read) === 1,
    title: displayTitle(t, raw),
    content: displayContent(t, raw),
    time: relativeTime(t, raw.create_time),
    raw
  }
}

/** 列表 DTO[] -> VM[] */
export function toNotificationVMList(t: Translate, list: NotificationDTO[]): NotificationVM[] {
  return (Array.isArray(list) ? list : []).map((raw) => toNotificationVM(t, raw))
}
