/**
 * ==========================================
 * v-permission 指令（Vue3）
 * ==========================================
 * 用法：v-permission="['system:user:add']" 或 v-permission="'admin'"
 * 无权限时从 DOM 移除该元素
 */
import type { Directive } from 'vue'
import { checkPermission } from '@/utils/auth/permission'

function updateEl(el: HTMLElement, bindingValue: string | string[]): void {
  const hasPermission = checkPermission(bindingValue)
  if (!hasPermission) {
    el.parentNode?.removeChild(el)
  }
}

export const permission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    updateEl(el, binding.value)
  }
}

export default permission
