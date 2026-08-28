/**
 * ==========================================
 * 菜单标题解析工具
 * ==========================================
 * 统一处理 i18n 嵌套对象返回对象的情况
 * 当 $t('menu.home') 返回对象 {default: '...', ...} 时，自动取 .default
 *
 * 适用场景：侧边栏菜单、面包屑导航、标签页标题
 */
import i18n from '@/i18n'

/**
 * 解析菜单标题（处理 i18n 嵌套对象返回对象的情况）
 * 如果翻译结果是对象，取 .default；如果 .default 不存在，返回原 key
 * @param {string} titleKey - 标题文本或 i18n key
 * @returns {string} 解析后的标题字符串
 */
export function resolveMenuTitle(titleKey) {
  if (!titleKey) return ''

  // 不是 i18n key，直接返回原文
  if (!i18n.te(titleKey)) {
    return titleKey
  }

  const translated = i18n.t(titleKey)

  // 翻译结果是字符串，直接返回
  if (typeof translated !== 'object' || translated === null) {
    return translated
  }

  // 翻译结果是对象（嵌套结构），尝试取 .default
  const defaultKey = titleKey + '.default'
  if (i18n.te(defaultKey)) {
    return i18n.t(defaultKey)
  }

  // 没有 .default，返回原 key（兜底）
  return titleKey
}

export default {
  resolveMenuTitle
}
