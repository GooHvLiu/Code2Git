/**
 * useSessionTimeout - 操作超时自动登出组合式函数
 * GMP 合规：用户一段时间无操作后自动登出，防止未授权访问
 * 替代原 mixins/sessionTimeout.js
 *
 * 用法：
 *   useSessionTimeout()
 *
 * 作者：GooHv
 */
import { ref, computed, onMounted, onUnmounted, type ComputedRef, type Ref } from 'vue'
import router from '@/router'
import settings from '@/settings'
import { useUserStore } from '@/store/modules/user'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'

export interface UseSessionTimeoutReturn {
  sessionTimer: Ref<ReturnType<typeof setTimeout> | null>
  lastActivityTime: Ref<number>
  sessionTimeout: ComputedRef<number>
  resetSessionTimer: () => void
  handleSessionTimeout: () => Promise<void>
  destroySessionMonitor: () => void
}

export function useSessionTimeout(): UseSessionTimeoutReturn {
  const userStore = useUserStore()

  const sessionTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityTime = ref<number>(Date.now())
  let activityHandler: ((event: Event) => void) | null = null

  const sessionTimeout = computed<number>(() => {
    return (settings.sessionTimeout || 30) * 60 * 1000
  })

  function initSessionMonitor(): void {
    activityHandler = resetSessionTimer
    const handler = resetSessionTimer
    const events: Array<'mousemove' | 'keydown' | 'click' | 'scroll' | 'touchstart'> = [
      'mousemove', 'keydown', 'click', 'scroll', 'touchstart'
    ]
    events.forEach(event => {
      window.addEventListener(event, handler, { passive: true })
    })
    resetSessionTimer()
  }

  function resetSessionTimer(): void {
    lastActivityTime.value = Date.now()
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
    }
    sessionTimer.value = setTimeout(() => {
      void handleSessionTimeout()
    }, sessionTimeout.value)
  }

  async function handleSessionTimeout(): Promise<void> {
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
      sessionTimer.value = null
    }
    destroySessionMonitor()
    await userStore.logout().catch(() => {})
    if (router.currentRoute.value.path !== ROUTE_PATHS.LOGIN) {
      router.push(ROUTE_PATHS.LOGIN)
    }
  }

  function destroySessionMonitor(): void {
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
      sessionTimer.value = null
    }
    if (activityHandler) {
      const handler = activityHandler
      const events: Array<'mousemove' | 'keydown' | 'click' | 'scroll' | 'touchstart'> = [
        'mousemove', 'keydown', 'click', 'scroll', 'touchstart'
      ]
      events.forEach(event => {
        window.removeEventListener(event, handler)
      })
      activityHandler = null
    }
  }

  onMounted(() => {
    initSessionMonitor()
  })

  onUnmounted(() => {
    destroySessionMonitor()
  })

  return {
    sessionTimer,
    lastActivityTime,
    sessionTimeout,
    resetSessionTimer,
    handleSessionTimeout,
    destroySessionMonitor
  }
}
