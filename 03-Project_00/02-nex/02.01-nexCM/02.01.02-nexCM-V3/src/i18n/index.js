/**
 * ==========================================
 * Vue I18n 国际化配置
 * ==========================================
 * 支持中英文切换，语言偏好持久化到 localStorage
 * 支持动态加载后端管理的语言文件
 *
 * 用法：
 *   模板中：{{ $t('common.confirm') }}
 *   JS 中：this.$t('common.confirm')
 *   切换语言：this.$i18n.locale = 'en-US'
 *
 * 新增语言：
 *   1. 在国际化管理页面创建新语言文件
 *   2. 系统会自动加载并注册到 Vue I18n 中
 *   3. Quick Menu 中的语言切换会自动显示新语言
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
// 模块化国际化配置：中文固定 modules 目录，其他语言为 modules-<langCode 全小写> 目录
import zhCN from './modules/index.js'
import enUS from './modules-en-us/index.js'

// Element UI 语言包（用于分页、日期选择器等组件的国际化）
import ElementLocale from 'element-ui/lib/locale'
import ElementZhCN from 'element-ui/lib/locale/lang/zh-CN'
import ElementEnUS from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

/**
 * 动态语言列表（包含内置语言和后端管理的语言）
 * 初始值为内置语言（中文和英文），应用启动时会从后端加载并更新
 */
export let dynamicLanguages = [
  { label: '简体中文', value: 'zh-CN', autonym: '简体中文', short: '中', flag: 'zh-CN', isBuiltIn: true },
  { label: 'English', value: 'en-US', autonym: 'English', short: 'EN', flag: 'en-US', isBuiltIn: true }
]

/** 已加载的语言文件缓存 */
const loadedLanguages = new Set(['zh-CN', 'en-US'])

/** localStorage 存储 key */
const LANG_KEY = 'app-language'

/**
 * 获取当前语言
 * 优先从 localStorage 读取，否则用系统默认语言，否则用浏览器默认语言，兜底中文
 * 注意：对于 localStorage 中保存的语言，不检查是否在 dynamicLanguages 中，
 * 因为模块加载时 dynamicLanguages 还只有内置语言，动态语言列表尚未加载
 * @param {string} systemDefaultLang - 系统默认语言（从后端配置获取）
 */
function getDefaultLang(systemDefaultLang = null) {
  const saved = localStorage.getItem(LANG_KEY)
  // 对于用户手动保存的语言，直接返回，不检查是否在 dynamicLanguages 中
  // （因为模块加载时动态语言列表尚未加载，会导致用户选择的语言被错误地回退）
  if (saved) return saved
  // 如果有系统默认语言，使用系统默认语言
  if (systemDefaultLang && dynamicLanguages.some(l => l.value === systemDefaultLang)) {
    return systemDefaultLang
  }
  const browserLang = navigator.language || 'zh-CN'
  return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US'
}

/**
 * 中英文一致性校验
 * 检查中英文配置的 key 是否完全一致，开发环境下会在控制台输出警告
 * 注意：不使用兜底方案，缺失字段直接显示 key，问题马上暴露
 */
function validateI18nConsistency(zh, en, path = '') {
  if (process.env.NODE_ENV === 'production') return
  
  const zhKeys = Object.keys(zh || {})
  const enKeys = Object.keys(en || {})
  
  // 检查中文有但英文没有的 key
  zhKeys.forEach(key => {
    const currentPath = path ? `${path}.${key}` : key
    if (!(key in en)) {
      // 开发期一致性诊断，函数顶部已有 production 守卫
      // eslint-disable-next-line no-console
      console.warn(`[I18n] 英文配置缺少 key: ${currentPath}`)
    } else if (typeof zh[key] === 'object' && zh[key] !== null && !Array.isArray(zh[key])) {
      validateI18nConsistency(zh[key], en[key], currentPath)
    }
  })
  
  // 检查英文有但中文没有的 key
  enKeys.forEach(key => {
    const currentPath = path ? `${path}.${key}` : key
    if (!(key in zh)) {
      // 开发期一致性诊断，函数顶部已有 production 守卫
      // eslint-disable-next-line no-console
      console.warn(`[I18n] 中文配置缺少 key: ${currentPath}`)
    }
  })
}

// 开发环境下执行中英文一致性校验
validateI18nConsistency(zhCN, enUS)

const i18n = new VueI18n({
  locale: getDefaultLang(),
  // 注意：不使用兜底方案，缺失字段直接显示 key，问题马上暴露
  // fallbackLocale 不设置，让缺失的 key 直接显示原始 key
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  // 缺失 key 时不使用回退，直接显示 key
  silentTranslationWarn: false,
  silentFallbackWarn: true
})

// 初始化时设置 Element UI 语言
if (i18n.locale === 'en-US') {
  ElementLocale.use(ElementEnUS)
} else {
  ElementLocale.use(ElementZhCN)
}

// 加载语言列表的 Promise 缓存，避免重复请求
let loadingLanguageListPromise = null

/**
 * 从后端加载语言列表并更新动态语言列表
 * @returns {Promise<Array>} 语言列表
 */
export async function loadLanguageList() {
  // 如果正在加载，返回同一个 Promise，避免重复请求
  if (loadingLanguageListPromise) {
    return loadingLanguageListPromise
  }

  loadingLanguageListPromise = (async () => {
    try {
      // 动态导入 API，避免循环依赖
      // 使用 /languages 接口（所有登录用户可访问），而不是 /files 接口（仅超级管理员可访问）
      const { requestGetLanguagesApi } = await import('@/api/i18n-manager')
      const res = await requestGetLanguagesApi()
      const fileList = res.data || []
      
      // 构建动态语言列表：内置语言 + 后端管理的语言（去重）
      const langMap = new Map()
      dynamicLanguages.forEach(l => langMap.set(l.value, { ...l }))
      
      fileList.forEach(file => {
        const langCode = file.langCode
        if (!langCode) return
        const existing = langMap.get(langCode)
        if (existing) {
          // 已存在的内置语言，用后端目录扫描结果补充元数据（展示一律用 autonym）
          langMap.set(langCode, {
            ...existing,
            label: file.name || existing.label,
            autonym: file.autonym || existing.autonym,
            flag: file.flag || existing.flag,
            isBuiltIn: existing.isBuiltIn || !!file.isBuiltIn,
            isMaster: !!file.isMaster
          })
        } else {
          // 新建的动态语言
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
      // 加载完成后清除缓存
      loadingLanguageListPromise = null
    }
  })()

  return loadingLanguageListPromise
}

/**
 * 动态加载语言文件并注册到 Vue I18n 中
 * @param {string} lang - 语言代码，如 'ja-JP'
 * @returns {Promise<boolean>} 是否加载成功
 */
export async function loadLanguageFile(lang) {
  if (loadedLanguages.has(lang)) {
    return true
  }
  
  try {
    // 动态导入 API，避免循环依赖
    // 使用 /language/read 接口（所有登录用户可访问），按 langCode 聚合整门语言目录
    const { requestReadLanguageApi } = await import('@/api/i18n-manager')
    const res = await requestReadLanguageApi(lang)

    // request 响应拦截器已解包为 body {code,message,data}，后端 readLanguage 的语言嵌套对象在 res.data.data
    if (res && res.data && res.data.data) {
      // 注册语言包到 Vue I18n
      i18n.setLocaleMessage(lang, res.data.data)
      loadedLanguages.add(lang)
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

/**
 * 切换语言并持久化（支持动态加载语言文件）
 * @param {string} lang - 语言代码，如 'zh-CN' / 'en-US' / 'ja-JP'
 * @returns {Promise<boolean>} 是否切换成功
 */
export async function setLanguage(lang) {
  // 检查语言是否在动态语言列表中
  const langExists = dynamicLanguages.some(l => l.value === lang)
  if (!langExists) {
    return false
  }
  
  // 如果是动态语言且尚未加载，先加载语言文件
  if (!loadedLanguages.has(lang)) {
    const loaded = await loadLanguageFile(lang)
    if (!loaded) {
      return false
    }
  }
  
  // 切换语言
  i18n.locale = lang
  localStorage.setItem(LANG_KEY, lang)
  document.documentElement.setAttribute('lang', lang)
  
  // 同步设置 Element UI 语言（分页、日期选择器等组件）
  if (lang === 'zh-CN') {
    ElementLocale.use(ElementZhCN)
  } else if (lang === 'en-US') {
    ElementLocale.use(ElementEnUS)
  }
  // 其他语言暂时使用英文 Element UI 语言包（后续可扩展）
  
  return true
}

/**
 * 应用系统默认语言（仅当用户没有手动设置过语言时生效）
 * @param {string} systemDefaultLang - 系统默认语言
 */
export function applySystemDefaultLanguage(systemDefaultLang) {
  if (!systemDefaultLang || !dynamicLanguages.some(l => l.value === systemDefaultLang)) return
  // 如果用户已经手动设置过语言（localStorage 中有值），不覆盖用户选择
  const saved = localStorage.getItem(LANG_KEY)
  if (saved) return
  // 应用系统默认语言（不写入 localStorage，只是临时应用）
  i18n.locale = systemDefaultLang
  document.documentElement.setAttribute('lang', systemDefaultLang)
  if (systemDefaultLang === 'zh-CN') {
    ElementLocale.use(ElementZhCN)
  } else if (systemDefaultLang === 'en-US') {
    ElementLocale.use(ElementEnUS)
  }
}

/**
 * 检查用户是否手动设置过语言
 * @returns {boolean}
 */
export function hasUserSetLanguage() {
  return !!localStorage.getItem(LANG_KEY)
}

export default i18n

