/**
 * useResize - 响应式检测组合式函数
 * 监听窗口大小变化，自动切换 device 状态
 * 小于断点自动切换为 mobile 并折叠侧边栏
 * 替代原 mixins/resize.js
 *
 * 用法：
 *   const { isMobile } = useResize()
 *
 * 作者：GooHv
 */
import { onMounted, onUnmounted } from 'vue'
import config from '@/config'
import { useAppStore } from '@/store/modules/app'

const WIDTH: number = config.MOBILE_BREAKPOINT

export interface UseResizeReturn {
  /** 当前是否为移动端宽度 */
  isMobile: () => boolean
}

export function useResize(): UseResizeReturn {
  const appStore = useAppStore()
  let resizeHandler: (() => void) | null = null

  function isMobile(): boolean {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function initResizeEvent(): void {
    resizeHandler = () => {
      const mobile = isMobile()
      if (mobile) {
        appStore.toggleDevice('mobile')
        appStore.closeSideBar(true)
      } else {
        appStore.toggleDevice('desktop')
      }
    }
    window.addEventListener('resize', resizeHandler)
    // 首次加载也检测一次
    if (isMobile()) {
      appStore.toggleDevice('mobile')
      appStore.closeSideBar(true)
    }
  }

  function destroyResizeEvent(): void {
    if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  }

  onMounted(() => {
    initResizeEvent()
  })

  onUnmounted(() => {
    destroyResizeEvent()
  })

  return {
    isMobile
  }
}
