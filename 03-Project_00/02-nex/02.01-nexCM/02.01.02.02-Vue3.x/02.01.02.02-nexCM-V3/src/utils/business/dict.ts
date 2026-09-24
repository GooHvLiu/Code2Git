/**
 * ==========================================
 * 数据字典工具
 * ==========================================
 * 管理系统枚举/字典数据（状态、类型等），从后端获取并缓存，并发请求合并。
 *
 * 国际化策略（严格不兜底）：
 *   - 缓存中只存后端原始项（label 为后端中文）。
 *   - 读取时按当前 locale 用 i18n key `common.dict.items.{code}.{value}` 翻译 label。
 *   - i18n key 存在 → 用翻译；不存在 → 回退后端 label（开发环境 console.warn 提示缺失 key）。
 *   - 字典类型名同理：`common.dict.types.{code}`。
 *   - 这样切换 locale 后，只要组件重新读取字典（re-fetch / watch locale），label 自动跟随新语言。
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

/** 字典缓存（存后端原始项，label 未翻译） */
const dictCache = new Map<string, DictItem[]>()
/** 进行中的请求（并发合并） */
const pendingRequests = new Map<string, Promise<DictItem[]>>()

/** 当前 locale（组合式模式下 global.locale 是 ref） */
function currentLocale(): string {
  return (i18n.global.locale as { value: string }).value
}

/**
 * 翻译单个字典项 label。
 * 有 i18n key → 返回译文；无 → 回退后端 label（开发环境 warn）。
 */
export function localizeDictLabel(code: string, value: string | number, fallback: string): string {
  const key = `common.dict.items.${code}.${value}`
  if (i18n.global.te(key)) {
    return i18n.global.t(key) as string
  }
  if (import.meta.env.DEV) {
    console.warn(`[dict] 缺少字典翻译 key: ${key}，回退后端 label="${fallback}"`)
  }
  return fallback
}

/** 对字典项列表做国际化（读取时按当前 locale 翻译 label，不污染缓存） */
function localizeDictItems(code: string, list: DictItem[]): DictItem[] {
  if (!Array.isArray(list)) return list
  return list.map(item => ({
    ...item,
    label: localizeDictLabel(code, item.value, item.label)
  }))
}

/** 获取字典类型名称：有 i18n key 走 i18n，否则返回兜底值 */
export function getDictTypeLabel(code: string, fallback = ''): string {
  const key = `common.dict.types.${code}`
  if (i18n.global.te(key)) {
    return i18n.global.t(key) as string
  }
  return fallback || code
}

/** 手动设置字典数据（本地静态字典；缓存原始项，读取时再翻译） */
export function setDict(code: string, list: DictItem[]): void {
  dictCache.set(code, Array.isArray(list) ? list : [])
}

/**
 * 获取字典：缓存命中直接返回（按当前 locale 翻译 label）；
 * 并发同 key 共享同一 Promise。
 */
export async function getDict(code: string): Promise<DictItem[]> {
  const cached = dictCache.get(code)
  if (cached) return localizeDictItems(code, cached)
  if (pendingRequests.has(code)) return pendingRequests.get(code)!

  const requestPromise = (async (): Promise<DictItem[]> => {
    try {
      const res = await requestGetDictItemsByCodeApi(code)
      const raw = (res.data as DictItem[]) || []
      dictCache.set(code, raw)
      return localizeDictItems(code, raw)
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
    codes.map(async code => {
      result[code] = await getDict(code)
    })
  )
  return result
}

/** 根据字典值获取标签（按当前 locale 翻译；缓存未命中回退 value 本身） */
export function getDictLabel(code: string, value: string | number): string {
  const list = dictCache.get(code) || []
  const item = list.find(i => String(i.value) === String(value))
  if (!item) return String(value ?? '')
  return localizeDictLabel(code, item.value, item.label)
}

/** 根据字典值获取类型（DictTag 颜色） */
export function getDictType(code: string, value: string | number): string {
  const list = dictCache.get(code) || []
  const item = list.find(i => String(i.value) === String(value))
  return item ? item.type || 'info' : 'info'
}

/** 清除字典缓存（不传 code 则清空全部）。切换 locale 后调用可强制下次重新拉取。 */
export function clearDictCache(code?: string): void {
  if (code) dictCache.delete(code)
  else dictCache.clear()
}

/** 当前 locale 变化时调用：清空缓存，强制组件下次读取时按新语言重新翻译。 */
export function handleDictLocaleChange(): void {
  clearDictCache()
}

// re-export 供外部读取当前 locale（DictTag/useDict watch 用）
export { currentLocale }
