/**
 * ==========================================
 * 菜单标题解析工具
 * ==========================================
 */
import i18n from '@/i18n'

export function resolveMenuTitle(titleKey: string): string {
  if (!titleKey) return ''
  if (!i18n.global.te(titleKey)) return titleKey
  const translated = i18n.global.t(titleKey)
  if (typeof translated !== 'object' || translated === null) return translated as string
  const defaultKey = titleKey + '.default'
  if (i18n.global.te(defaultKey)) return i18n.global.t(defaultKey) as string
  return titleKey
}

export default { resolveMenuTitle }
