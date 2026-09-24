/**
 * ==========================================
 * v-safe-html 指令（Vue3）
 * ==========================================
 * 功能描述：
 *   替代原生 v-html。在 mounted / updated 钩子里，先经 DOMPurify 白名单消毒，
 *   再写入 el.innerHTML，杜绝 XSS 注入风险。
 *
 * 用法：
 *   <div v-safe-html="untrustedHtml"></div>
 *   <span v-safe-html="metric.subLeft"></span>
 *
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import type { Directive } from 'vue'
import { sanitizeHtml } from '@/utils/security/dompurify'

/**
 * 将绑定值消毒后写入元素 innerHTML
 */
function renderSafeHtml(el: HTMLElement, value: unknown): void {
  el.innerHTML = sanitizeHtml(typeof value === 'string' ? value : value == null ? '' : String(value))
}

export const safeHtml: Directive<HTMLElement, string | undefined | null> = {
  mounted(el, binding) {
    renderSafeHtml(el, binding.value)
  },
  updated(el, binding) {
    // 仅在值变化时重渲染，避免不必要的 innerHTML 写入
    if (binding.value !== binding.oldValue) {
      renderSafeHtml(el, binding.value)
    }
  }
}

export default safeHtml
