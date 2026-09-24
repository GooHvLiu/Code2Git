/**
 * ==========================================
 * 富文本 HTML 消毒工具（DOMPurify 封装）
 * ==========================================
 * 功能描述：
 *   对外暴露 sanitizeHtml()，对不可信的 HTML 字符串做白名单过滤，
 *   剥离 script / iframe / object / embed / form / input 等危险标签与属性，
 *   防止 XSS 注入。统一供 v-safe-html 指令与 JS 中直接写 innerHTML 的场景使用。
 *
 *   允许的富文本标签：b / i / u / em / strong / p / br / ul / ol / li /
 *   a / img / span / div / h1~h6 / table / thead / tbody / tr / td / th
 *   允许的属性：href / src / alt / title / class / style / colspan / rowspan
 *   及 data-*（ALLOW_DATA_ATTR）。
 *   a 标签强制 rel="noopener noreferrer"，target 仅允许 _blank。
 *
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import DOMPurify from 'dompurify'

// 允许的标签白名单
const ALLOWED_TAGS = [
  'b',
  'i',
  'u',
  'em',
  'strong',
  'p',
  'br',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'span',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th'
]

// 允许的属性白名单
const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'style', 'colspan', 'rowspan']

// 明确禁止的危险标签（即便未来白名单调整也强制剥离）
const FORBID_TAGS = [
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'style',
  'link',
  'meta',
  'base',
  'frame',
  'frameset',
  'noscript'
]

/**
 * 安装 a 标签安全钩子：强制 rel="noopener noreferrer"，target 归一为 _blank。
 * 模块加载时执行一次；HMR 下先清空已有钩子避免重复挂载。
 */
DOMPurify.removeAllHooks()
DOMPurify.addHook('afterSanitizeAttributes', node => {
  // DOMPurify 传入的是被消毒文档中的 Element
  const el = node as Element
  if (el.tagName === 'A') {
    el.setAttribute('rel', 'noopener noreferrer')
    // target 仅允许 _blank，其余一律归一为 _blank
    el.setAttribute('target', '_blank')
  }
})

/**
 * 消毒 HTML 字符串
 *
 * @param html 待消毒的原始 HTML 字符串（可能来自后端 / 用户输入）
 * @returns 消毒后的安全 HTML 字符串，可直接用于 innerHTML / v-safe-html
 *
 * @example
 *   el.innerHTML = sanitizeHtml(untrustedHtml)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS,
    // 允许 data-* 属性
    ALLOW_DATA_ATTR: true,
    // 不允许自定义协议（如 javascript:），仅保留 http/https/mailto/相对路径等
    ALLOW_UNKNOWN_PROTOCOLS: false
  })
}

export default sanitizeHtml
