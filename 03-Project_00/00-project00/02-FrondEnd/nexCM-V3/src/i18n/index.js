/**
 * ==========================================
 * Vue I18n 国际化配置
 * ==========================================
 * 支持中英文切换，语言偏好持久化到 localStorage
 *
 * 用法：
 *   模板中：{{ $t('common.confirm') }}
 *   JS 中：this.$t('common.confirm')
 *   切换语言：this.$i18n.locale = 'en-US'
 *
 * 新增语言：
 *   1. 在 langs/ 下新建语言包文件
 *   2. 在下方 messages 中引入
 *   3. 在 LANGUAGES 常量中添加选项
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './langs/zh-CN'
import enUS from './langs/en-US'

// Element UI 语言包（用于分页、日期选择器等组件的国际化）
import ElementLocale from 'element-ui/lib/locale'
import ElementZhCN from 'element-ui/lib/locale/lang/zh-CN'
import ElementEnUS from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

/**
 * 支持的语言列表
 * label: 当前语言下的显示名（用于界面翻译）
 * autonym: 该语言自己的写法（永远不变，用户总能找到自己的语言）
 * short: 简短代码（用于菜单显示）
 */
export const LANGUAGES = [
  { label: '简体中文', value: 'zh-CN', autonym: '简体中文', short: '中' },
  { label: 'English', value: 'en-US', autonym: 'English', short: 'EN' }
]

/** localStorage 存储 key */
const LANG_KEY = 'app-language'

/**
 * 获取当前语言
 * 优先从 localStorage 读取，否则用系统默认语言，否则用浏览器默认语言，兜底中文
 * @param {string} systemDefaultLang - 系统默认语言（从后端配置获取）
 */
function getDefaultLang(systemDefaultLang = null) {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved && LANGUAGES.some(l => l.value === saved)) return saved
  // 如果有系统默认语言，使用系统默认语言
  if (systemDefaultLang && LANGUAGES.some(l => l.value === systemDefaultLang)) {
    return systemDefaultLang
  }
  const browserLang = navigator.language || 'zh-CN'
  return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US'
}

const i18n = new VueI18n({
  locale: getDefaultLang(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 初始化时设置 Element UI 语言
if (i18n.locale === 'en-US') {
  ElementLocale.use(ElementEnUS)
} else {
  ElementLocale.use(ElementZhCN)
}

/**
 * 切换语言并持久化
 * @param {string} lang - 语言代码，如 'zh-CN' / 'en-US'
 */
export function setLanguage(lang) {
  if (!LANGUAGES.some(l => l.value === lang)) return
  i18n.locale = lang
  localStorage.setItem(LANG_KEY, lang)
  document.documentElement.setAttribute('lang', lang)
  // 同步设置 Element UI 语言（分页、日期选择器等组件）
  if (lang === 'zh-CN') {
    ElementLocale.use(ElementZhCN)
  } else if (lang === 'en-US') {
    ElementLocale.use(ElementEnUS)
  }
}

/**
 * 应用系统默认语言（仅当用户没有手动设置过语言时生效）
 * @param {string} systemDefaultLang - 系统默认语言
 */
export function applySystemDefaultLanguage(systemDefaultLang) {
  if (!systemDefaultLang || !LANGUAGES.some(l => l.value === systemDefaultLang)) return
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
