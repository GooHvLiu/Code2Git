/**
 * ==========================================
 * nex-theme-picker 主题切换工具
 * ==========================================
 * 基于 CSS 变量实现运行时主题色切换
 * 支持侧边栏、标签页等多维度颜色配置
 *
 * 核心原理：
 *   Less 变量是编译时确定的，运行时无法修改；
 *   因此通过 CSS 变量在运行时覆盖布局组件的颜色。
 *
 * 用法：
 * import { setThemeField, getThemeField, initTheme, THEME_FIELDS } from 'nex-theme-picker'
 * setThemeField('sidebarIconColor', '#67c23a')
 */
import themeVariables from './themeVariables'

/**
 * 可配置的主题字段列表
 * key: 字段标识，用于 localStorage 存储和 JS 调用
 * label: 显示名称，用于 ThemePicker 面板
 * varName: 对应的 CSS 变量名
 * default: 默认值（与 themeVariables.js 保持一致）
 */
export const THEME_FIELDS = [
  {
    key: 'sidebarBg',
    label: '侧边栏背景颜色',
    varName: '--sidebar-bg',
    default: themeVariables['sidebar-bg']
  },
  {
    key: 'sidebarText',
    label: '侧边栏文字颜色',
    varName: '--sidebar-text',
    default: themeVariables['sidebar-text']
  },
  {
    key: 'sidebarIconColor',
    label: '侧边栏图标颜色',
    varName: '--sidebar-icon-color',
    default: themeVariables['sidebar-icon-color']
  },
  {
    key: 'sidebarHoverBg',
    label: '侧边栏悬停背景',
    varName: '--sidebar-hover-bg',
    default: themeVariables['sidebar-hover-bg']
  },
  {
    key: 'sidebarHoverText',
    label: '侧边栏悬停文字',
    varName: '--sidebar-hover-text',
    default: themeVariables['sidebar-hover-text']
  },
  {
    key: 'sidebarActiveBg',
    label: '选中菜单背景',
    varName: '--sidebar-active-bg',
    default: themeVariables['sidebar-active-bg']
  },
  {
    key: 'tagActiveBg',
    label: '选中标签背景',
    varName: '--tag-active-bg',
    default: themeVariables['tag-active-bg']
  },
  {
    key: 'tagBorder',
    label: '标签边框颜色',
    varName: '--tag-border',
    default: themeVariables['tag-border']
  },
  {
    key: 'tagCloseColor',
    label: '标签叉号颜色',
    varName: '--tag-close-color',
    default: themeVariables['tag-close-color']
  },
  {
    key: 'appMainBg',
    label: '主内容背景色',
    varName: '--app-main-bg',
    default: themeVariables['app-main-bg']
  }
]

/** localStorage 存储前缀 */
const STORAGE_PREFIX = 'theme-'

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

  const normalizedColor = color.toLowerCase()
  setCssVar(field.varName, normalizedColor)
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
  setCssVar(field.varName, field.default)
}

/**
 * 重置所有主题字段为默认值
 */
export function resetAllTheme() {
  THEME_FIELDS.forEach(field => {
    localStorage.removeItem(STORAGE_PREFIX + field.key)
    setCssVar(field.varName, field.default)
  })
}

/**
 * 初始化主题（从 localStorage 恢复用户配置）
 * 在 main.js 中调用一次即可
 */
export function initTheme() {
  THEME_FIELDS.forEach(field => {
    const saved = localStorage.getItem(STORAGE_PREFIX + field.key)
    if (saved) {
      setCssVar(field.varName, saved.toLowerCase())
    }
  })
}

/**
 * 导出 mixColor 供外部使用（如计算浅色变体）
 */
export { mixColor }
