/**
 * ==========================================
 * 主题切换工具
 * ==========================================
 * 基于 CSS 变量实现运行时主题色切换
 * 支持主题色、侧边栏、标签页等多维度颜色配置
 *
 * 核心原理：
 *   Less 变量是编译时确定的，运行时无法修改；
 *   因此通过 CSS 变量在运行时覆盖 Element UI 及布局组件的颜色。
 *
 * 默认值策略：
 *   - 与 themeVariables.js 共享的字段（sidebar-bg / sidebar-hover-bg），
 *     默认值从 themeVariables.js 读取，确保编译时和运行时一致
 *   - 其他字段保持写死默认值
 *   - initTheme 只恢复 localStorage 中用户主动切换过的值，
 *     未切换过的字段不设置 CSS 变量，让编译时的默认值生效
 *
 * 用法：
 * import { setThemeField, getThemeField, initTheme, THEME_FIELDS } from '@/utils/theme'
 * setThemeField('primaryColor', '#67c23a')  // 设置主题色
 * getThemeField('sidebarBg')                 // 获取侧边栏背景色
 */
import themeVariables from '@/config/themeVariables'
import i18n from '@/i18n'

/**
 * 可配置的主题字段列表
 * key: 字段标识，用于 localStorage 存储和 JS 调用
 * label: 显示名称，用于 ThemePicker 面板
 * varName: 对应的 CSS 变量名
 * default: 默认值（与 variables.less / themeVariables.js 保持一致）
 * hasLight: 是否需要自动计算浅色变体（仅主题色需要）
 */
export const THEME_FIELDS = [
  {
    key: 'sidebarBg',
    get label() { return i18n.t('theme.sidebarBg') },
    varName: '--sidebar-bg',
    default: themeVariables['sidebar-bg']
  },
  {
    key: 'sidebarHoverText',
    get label() { return i18n.t('theme.sidebarHoverText') },
    varName: '--sidebar-hover-text',
    default: themeVariables['sidebar-hover-text']
  },
  {
    key: 'sidebarHoverBg',
    get label() { return i18n.t('theme.sidebarHoverBg') },
    varName: '--sidebar-hover-bg',
    default: themeVariables['sidebar-hover-bg']
  },
  {
    key: 'sidebarIconColor',
    get label() { return i18n.t('theme.sidebarIconColor') },
    varName: '--sidebar-icon-color',
    default: themeVariables['sidebar-icon-color']
  },
  {
    key: 'sidebarActiveBg',
    get label() { return i18n.t('theme.sidebarActiveBg') },
    varName: '--sidebar-active-bg',
    default: themeVariables['sidebar-active-bg']
  }
]

/** localStorage 存储前缀 */
const STORAGE_PREFIX = 'theme-'

/** 浅色变体后缀映射（hasLight 字段自动计算） */
const LIGHT_VARIANTS = [
  { suffix: '-light', ratio: 0.1 },
  { suffix: '-lighter', ratio: 0.2 },
  { suffix: '-dark', ratio: -0.1 }
]

/**
 * 设置 CSS 变量
 */
function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value)
}

/**
 * 将 #RRGGBB 颜色解析为 RGB 对象
 */
function hexToRgb(hex) {
  let color = hex.replace('#', '')
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('')
  }
  const num = parseInt(color, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

/**
 * RGB 转 #RRGGBB
 */
function rgbToHex(r, g, b) {
  const toHex = n => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * 颜色混合（与白色混合变亮，与黑色混合变暗）
 */
function mixColor(hex, ratio) {
  const { r, g, b } = hexToRgb(hex)
  const mixWith = ratio >= 0 ? 255 : 0
  const absRatio = Math.abs(ratio)
  return rgbToHex(
    r + (mixWith - r) * absRatio,
    g + (mixWith - g) * absRatio,
    b + (mixWith - b) * absRatio
  )
}

/**
 * 根据 key 查找字段配置
 */
function getFieldConfig(key) {
  return THEME_FIELDS.find(f => f.key === key)
}

/**
 * 设置单个主题字段
 * @param {string} key 字段标识（THEME_FIELDS 中的 key）
 * @param {string} color 颜色值
 */
export function setThemeField(key, color) {
  if (!color) return
  const field = getFieldConfig(key)
  if (!field) return

  // 统一转小写，避免大小写不一致导致 active 判断失败
  const normalizedColor = color.toLowerCase()

  // 设置主 CSS 变量
  setCssVar(field.varName, normalizedColor)

  // 如果需要浅色变体（主题色），自动计算并设置
  if (field.hasLight) {
    LIGHT_VARIANTS.forEach(({ suffix, ratio }) => {
      setCssVar(field.varName + suffix, mixColor(normalizedColor, ratio))
    })
  }

  // 持久化到 localStorage
  localStorage.setItem(STORAGE_PREFIX + key, normalizedColor)
}

/**
 * 获取单个主题字段
 * @param {string} key 字段标识
 * @returns {string} 颜色值
 */
export function getThemeField(key) {
  const field = getFieldConfig(key)
  if (!field) return ''
  return (localStorage.getItem(STORAGE_PREFIX + key) || field.default).toLowerCase()
}

/**
 * 重置单个主题字段为默认值
 */
export function resetThemeField(key) {
  const field = getFieldConfig(key)
  if (!field) return
  localStorage.removeItem(STORAGE_PREFIX + key)
  setThemeField(key, field.default)
}

/**
 * 重置所有主题字段
 */
export function resetAllTheme() {
  THEME_FIELDS.forEach(field => {
    localStorage.removeItem(STORAGE_PREFIX + field.key)
    setThemeField(field.key, field.default)
  })
}

// ==================== 兼容旧 API ====================

/**
 * 设置主题色（兼容旧调用）
 */
export function setThemeColor(color) {
  setThemeField('primaryColor', color)
}

/**
 * 获取主题色（兼容旧调用）
 */
export function getThemeColor() {
  return getThemeField('primaryColor')
}

/**
 * 初始化所有主题字段（应用启动时调用）
 * 只恢复 localStorage 中用户主动切换过的值，
 * 未切换过的字段不设置 CSS 变量，让编译时的默认值（:root 中定义）生效
 */
export function initTheme() {
  THEME_FIELDS.forEach(field => {
    const saved = localStorage.getItem(STORAGE_PREFIX + field.key)
    if (saved) {
      setThemeField(field.key, saved)
    }
  })
}

/**
 * 重置为默认主题（兼容旧调用，重置全部）
 */
export function resetTheme() {
  resetAllTheme()
}
