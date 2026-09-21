/**
 * ==========================================
 * Vue I18n 9 国际化配置
 * ==========================================
 * - createI18n({ legacy: false }) 组合式模式
 * - 仅 zh-CN / en-US 内置，不设 fallbackLocale，缺 key 直接显示 key
 * - 保留动态加载后端语言能力（loadLanguageList / loadLanguageFile / setLanguage ...）
 * - Element Plus 语言由 App.vue 中 ElConfigProvider 绑定
 */
import { createI18n } from 'vue-i18n'
import type { Composer } from 'vue-i18n'
import zhCN from './modules/index'
import enUS from './modules-en-us/index'

/** 动态语言元信息 */
export interface DynamicLanguage {
  label: string
  value: string
  autonym: string
  short: string
  flag: string
  isBuiltIn?: boolean
  isMaster?: boolean
  isDynamic?: boolean
}

export let dynamicLanguages: DynamicLanguage[] = [
  { label: '简体中文', value: 'zh-CN', autonym: '简体中文', short: '中', flag: 'zh-CN', isBuiltIn: true },
  { label: 'English', value: 'en-US', autonym: 'English', short: 'EN', flag: 'en-US', isBuiltIn: true }
]

const loadedLanguages = new Set<string>(['zh-CN', 'en-US'])

const LANG_KEY = 'app-language'

function getDefaultLang(): string {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved) return saved
  const browserLang = navigator.language || 'zh-CN'
  return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US'
}

/** 中英文 key 一致性校验（仅开发环境） */
function validateI18nConsistency(zh: Record<string, unknown>, en: Record<string, unknown>, path = ''): void {
  if (import.meta.env.PROD) return
  const zhKeys = Object.keys(zh || {})
  const enKeys = Object.keys(en || {})
  zhKeys.forEach(key => {
    const currentPath = path ? `${path}.${key}` : key
    if (!(key in en)) {
      console.warn(`[I18n] 英文配置缺少 key: ${currentPath}`)
    } else if (typeof zh[key] === 'object' && zh[key] !== null && !Array.isArray(zh[key])) {
      validateI18nConsistency(zh[key] as Record<string, unknown>, (en as Record<string, unknown>)[key] as Record<string, unknown>, currentPath)
    }
  })
  enKeys.forEach(key => {
    const currentPath = path ? `${path}.${key}` : key
    if (!(key in zh)) {
      console.warn(`[I18n] 中文配置缺少 key: ${currentPath}`)
    }
  })
}

validateI18nConsistency(zhCN, enUS)

/**
 * i18n 实例
 * legacy: false → 组合式模式；missingWarn 关闭兜底提示但仍显示 key
 */
const i18n = createI18n({
  legacy: false,
  locale: getDefaultLang(),
  fallbackLocale: false as unknown as string, // 不兜底，缺 key 直接显示 key
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

/** 当前 locale（组合式模式下 global.locale 是 ref） */
export function getCurrentLocale(): string {
  return (i18n.global.locale as { value: string }).value
}

function setLocale(lang: string): void {
  (i18n.global.locale as { value: string }).value = lang
  document.documentElement.setAttribute('lang', lang)
}

let loadingLanguageListPromise: Promise<DynamicLanguage[]> | null = null

export async function loadLanguageList(): Promise<DynamicLanguage[]> {
  if (loadingLanguageListPromise) return loadingLanguageListPromise

  loadingLanguageListPromise = (async () => {
    try {
      const { requestGetLanguagesApi } = await import('@/api/i18n-manager')
      const res = await requestGetLanguagesApi()
      const fileList = (res.data || []) as Array<Record<string, string>>
      const langMap = new Map<string, DynamicLanguage>()
      dynamicLanguages.forEach(l => langMap.set(l.value, { ...l }))
      fileList.forEach(file => {
        const langCode = file.langCode
        if (!langCode) return
        const existing = langMap.get(langCode)
        if (existing) {
          langMap.set(langCode, {
            ...existing,
            label: file.name || existing.label,
            autonym: file.autonym || existing.autonym,
            flag: file.flag || existing.flag,
            isBuiltIn: existing.isBuiltIn || !!file.isBuiltIn,
            isMaster: !!file.isMaster
          })
        } else {
          langMap.set(langCode, {
            label: file.name || langCode,
            value: langCode,
            autonym: file.autonym || langCode,
            short: langCode.split('-')[0].toUpperCase(),
            flag: file.flag || 'global',
            isBuiltIn: !!file.isBuiltIn,
            isMaster: !!file.isMaster,
            isDynamic: true
          })
        }
      })
      dynamicLanguages = Array.from(langMap.values())
      return dynamicLanguages
    } catch (err) {
      return dynamicLanguages
    } finally {
      loadingLanguageListPromise = null
    }
  })()

  return loadingLanguageListPromise
}

export async function loadLanguageFile(lang: string): Promise<boolean> {
  if (loadedLanguages.has(lang)) return true
  try {
    const { requestReadLanguageApi } = await import('@/api/i18n-manager')
    const res = await requestReadLanguageApi(lang)
    const resData = (res as unknown as { data?: { data?: unknown } }).data
    if (resData && resData.data) {
      // 动态注册整门语言
      (i18n.global as unknown as Composer).setLocaleMessage(lang, resData.data)
      loadedLanguages.add(lang)
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export async function setLanguage(lang: string): Promise<boolean> {
  const langExists = dynamicLanguages.some(l => l.value === lang)
  if (!langExists) return false
  if (!loadedLanguages.has(lang)) {
    const loaded = await loadLanguageFile(lang)
    if (!loaded) return false
  }
  setLocale(lang)
  localStorage.setItem(LANG_KEY, lang)
  return true
}

export function applySystemDefaultLanguage(systemDefaultLang: string): void {
  if (!systemDefaultLang || !dynamicLanguages.some(l => l.value === systemDefaultLang)) return
  if (localStorage.getItem(LANG_KEY)) return
  setLocale(systemDefaultLang)
}

export function hasUserSetLanguage(): boolean {
  return !!localStorage.getItem(LANG_KEY)
}

export default i18n
