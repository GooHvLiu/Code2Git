/**
 * ==========================================
 * 主题切换工具（CSS 变量运行时切换）
 * ==========================================
 */
import themeVariables from '@/config/theme-variables.config'
import i18n from '@/i18n'

interface ThemeField {
  key: string
  label: string
  varName: string
  default: string
  hasLight?: boolean
}

export const THEME_FIELDS: ThemeField[] = [
  { key: 'sidebarBg', get label() { return i18n.global.t('layout.quickMenu.theme.sidebarBg') as string }, varName: '--sidebar-bg', default: themeVariables['sidebar-bg'] },
  { key: 'sidebarHoverText', get label() { return i18n.global.t('layout.quickMenu.theme.sidebarHoverText') as string }, varName: '--sidebar-hover-text', default: themeVariables['sidebar-hover-text'] },
  { key: 'sidebarHoverBg', get label() { return i18n.global.t('layout.quickMenu.theme.sidebarHoverBg') as string }, varName: '--sidebar-hover-bg', default: themeVariables['sidebar-hover-bg'] },
  { key: 'sidebarIconColor', get label() { return i18n.global.t('layout.quickMenu.theme.sidebarIconColor') as string }, varName: '--sidebar-icon-color', default: themeVariables['sidebar-icon-color'] },
  { key: 'sidebarActiveBg', get label() { return i18n.global.t('layout.quickMenu.theme.sidebarActiveBg') as string }, varName: '--sidebar-active-bg', default: themeVariables['sidebar-active-bg'] }
]

const STORAGE_PREFIX = 'theme-'

const LIGHT_VARIANTS = [
  { suffix: '-light', ratio: 0.1 },
  { suffix: '-lighter', ratio: 0.2 },
  { suffix: '-dark', ratio: -0.1 }
] as const

function setCssVar(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let color = hex.replace('#', '')
  if (color.length === 3) color = color.split('').map(c => c + c).join('')
  const num = parseInt(color, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mixColor(hex: string, ratio: number): string {
  const { r, g, b } = hexToRgb(hex)
  const mixWith = ratio >= 0 ? 255 : 0
  const absRatio = Math.abs(ratio)
  return rgbToHex(
    r + (mixWith - r) * absRatio,
    g + (mixWith - g) * absRatio,
    b + (mixWith - b) * absRatio
  )
}

function getFieldConfig(key: string): ThemeField | undefined {
  return THEME_FIELDS.find(f => f.key === key)
}

export function setThemeField(key: string, color: string): void {
  if (!color) return
  const field = getFieldConfig(key)
  if (!field) return
  const normalizedColor = color.toLowerCase()
  setCssVar(field.varName, normalizedColor)
  if (field.hasLight) {
    LIGHT_VARIANTS.forEach(({ suffix, ratio }) => {
      setCssVar(field.varName + suffix, mixColor(normalizedColor, ratio))
    })
  }
  localStorage.setItem(STORAGE_PREFIX + key, normalizedColor)
}

export function getThemeField(key: string): string {
  const field = getFieldConfig(key)
  if (!field) return ''
  return (localStorage.getItem(STORAGE_PREFIX + key) || field.default).toLowerCase()
}

export function resetThemeField(key: string): void {
  const field = getFieldConfig(key)
  if (!field) return
  localStorage.removeItem(STORAGE_PREFIX + key)
  setThemeField(key, field.default)
}

export function resetAllTheme(): void {
  THEME_FIELDS.forEach(field => {
    localStorage.removeItem(STORAGE_PREFIX + field.key)
    setThemeField(field.key, field.default)
  })
}

export function setThemeColor(color: string): void {
  setThemeField('primaryColor', color)
}

export function getThemeColor(): string {
  return getThemeField('primaryColor')
}

export function initTheme(): void {
  THEME_FIELDS.forEach(field => {
    const saved = localStorage.getItem(STORAGE_PREFIX + field.key)
    if (saved) setThemeField(field.key, saved)
  })
}

export function resetTheme(): void {
  resetAllTheme()
}
