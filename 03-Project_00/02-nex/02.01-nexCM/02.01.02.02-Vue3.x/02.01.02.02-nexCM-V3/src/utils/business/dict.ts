/**
 * ==========================================
 * 数据字典工具
 * ==========================================
 * 管理系统枚举/字典数据（状态、类型等），从后端获取并缓存，并发请求合并。
 * 内置字典类型的名称与项标签走前端 i18n；自定义字典使用数据库值。
 *
 * 用法：
 *   import { getDict, getDicts, clearDictCache, getDictTypeLabel } from '@/utils/business/dict'
 *   const statusList = await getDict('user_status')
 * 作者：GooHv
 */
import { requestGetDictItemsByCodeApi } from '@/api'
import i18n from '@/i18n'

/** 字典项 */
export interface DictItem {
  label: string
  value: string | number
  type?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | string
  list_class?: string
  css_class?: string
  [key: string]: unknown
}

/** 内置字典类型编码（名称与项标签走前端 i18n） */
const BUILTIN_DICT_TYPES = [
  'user_status',
  'user_sex',
  'user_role',
  'audit_action',
  'audit_result',
  'notification_type',
  'notification_priority'
]

/** 字典缓存 */
const dictCache = new Map<string, DictItem[]>()
/** 进行中的请求（并发合并） */
const pendingRequests = new Map<string, Promise<DictItem[]>>()

/** 是否为内置字典类型 */
export function isBuiltinDictType(dictCode: string): boolean {
  return BUILTIN_DICT_TYPES.includes(dictCode)
}

/** 获取字典类型名称：内置走 i18n，否则返回兜底值 */
export function getDictTypeLabel(dictCode: string, fallback = ''): string {
  if (isBuiltinDictType(dictCode)) {
    const key = `common.dict.types.${dictCode}`
    const translated = i18n.global.t(key)
    if (typeof translated === 'string' && translated && translated !== key) {
      return translated
    }
  }
  return fallback || dictCode
}

/** 对字典项列表做国际化处理（内置字典项标签走 i18n） */
function translateDictItems(dictCode: string, list: DictItem[]): DictItem[] {
  if (!isBuiltinDictType(dictCode) || !Array.isArray(list)) return list
  return list.map((item) => {
    const key = `common.dict.items.${dictCode}.${item.value}`
    const translated = i18n.global.t(key)
    if (typeof translated === 'string' && translated && translated !== key) {
      return { ...item, label: translated }
    }
    return item
  })
}

/** 手动设置字典数据（本地静态字典） */
export function setDict(code: string, list: DictItem[]): void {
  dictCache.set(code, translateDictItems(code, list))
}

/**
 * 获取字典：缓存命中直接返回；并发同 key 共享同一 Promise；内置字典自动国际化。
 */
export async function getDict(code: string): Promise<DictItem[]> {
  if (dictCache.has(code)) return dictCache.get(code)!
  if (pendingRequests.has(code)) return pendingRequests.get(code)!

  const requestPromise = (async (): Promise<DictItem[]> => {
    try {
      const res = await requestGetDictItemsByCodeApi(code)
      const list = translateDictItems(code, ((res.data as DictItem[]) || []))
      dictCache.set(code, list)
      return list
    } catch (e) {
      const err = e as { code?: string; message?: string }
      if (err?.code === 'ERR_CANCELED' || err?.message?.includes('CanceledError')) return []
      return []
    } finally {
      pendingRequests.delete(code)
    }
  })()

  pendingRequests.set(code, requestPromise)
  return requestPromise
}

/** 批量获取字典 */
export async function getDicts(codes: string[]): Promise<Record<string, DictItem[]>> {
  const result: Record<string, DictItem[]> = {}
  await Promise.all(
    codes.map(async (code) => {
      result[code] = await getDict(code)
    })
  )
  return result
}

/** 根据字典值获取标签 */
export function getDictLabel(code: string, value: string | number): string {
  const list = dictCache.get(code) || []
  const item = list.find((i) => String(i.value) === String(value))
  return item ? item.label : String(value ?? '')
}

/** 根据字典值获取类型（DictTag 颜色） */
export function getDictType(code: string, value: string | number): string {
  const list = dictCache.get(code) || []
  const item = list.find((i) => String(i.value) === String(value))
  return item ? item.type || 'info' : 'info'
}

/** 清除字典缓存（不传 code 则清空全部） */
export function clearDictCache(code?: string): void {
  if (code) dictCache.delete(code)
  else dictCache.clear()
}
