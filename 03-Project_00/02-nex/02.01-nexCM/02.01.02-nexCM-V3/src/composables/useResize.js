/**
 * useResize - 响应式检测组合式函数
 * 监听窗口大小变化，自动切换 device 状态
 * 小于 992px 自动切换为 mobile 并折叠侧边栏
 * 替代原 mixins/resize.js
 */
import { onMounted, onUnmounted } from 'vue'
import store from '@/store'
import config from '@/config'

const WIDTH = config.MOBILE_BREAKPOINT

export function useResize() {
  let resizeHandler = null

  function isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function initResizeEvent() {
    resizeHandler = () => {
      const mobile = isMobile()
      if (mobile) {
        store.dispatch('app/toggleDevice', 'mobile')
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      } else {
        store.dispatch('app/toggleDevice', 'desktop')
      }
    }
    window.addEventListener('resize', resizeHandler)
    // 首次加载也检测一次
    if (isMobile()) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  }

  function destroyResizeEvent() {
    window.removeEventListener('resize', resizeHandler)
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
