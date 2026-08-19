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
 * 优先从 localStorage 读取，否则用浏览器默认语言，兜底中文
 */
function getDefaultLang() {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved && LANGUAGES.some(l => l.value === saved)) return saved
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

/**
 * 切换语言并持久化
 * @param {string} lang - 语言代码，如 'zh-CN' / 'en-US'
 */
export function setLanguage(lang) {
  if (!LANGUAGES.some(l => l.value === lang)) return
  i18n.locale = lang
  localStorage.setItem(LANG_KEY, lang)
  document.documentElement.setAttribute('lang', lang)
}

export default i18n
