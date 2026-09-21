/**
 * ==========================================
 * v-watermark 指令（Vue3）
 * ==========================================
 * 用法：v-watermark="'水印文本'"
 */
import type { Directive } from 'vue'

function createWatermark(text: string): HTMLDivElement {
  const watermark = document.createElement('div')
  watermark.className = 'nex-watermark'
  watermark.style.position = 'absolute'
  watermark.style.top = '0'
  watermark.style.left = '0'
  watermark.style.width = '100%'
  watermark.style.height = '100%'
  watermark.style.pointerEvents = 'none'
  watermark.style.zIndex = '9999'
  watermark.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><text x='50%' y='50%' transform='rotate(-30 100 100)' fill='rgba(0,0,0,0.08)' font-size='14' text-anchor='middle'>${text}</text></svg>`
  )}")`
  return watermark
}

export const watermark: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    if (!binding.value) return
    el.style.position = el.style.position || 'relative'
    el.appendChild(createWatermark(binding.value))
  },
  updated(el, binding) {
    const old = el.querySelector('.nex-watermark')
    if (old) old.remove()
    if (binding.value) el.appendChild(createWatermark(binding.value))
  }
}

export default watermark
