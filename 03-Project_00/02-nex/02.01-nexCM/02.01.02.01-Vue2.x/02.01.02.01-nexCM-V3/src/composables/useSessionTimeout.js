/**
 * useSessionTimeout - 操作超时自动登出组合式函数
 * GMP 合规：用户一段时间无操作后自动登出，防止未授权访问
 * 替代原 mixins/sessionTimeout.js
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import store from '@/store'
import router from '@/router'
import settings from '@/settings'

export function useSessionTimeout() {

  const sessionTimer = ref(null)
  const lastActivityTime = ref(Date.now())
  let activityHandler = null

  const sessionTimeout = computed(() => {
    return (settings.sessionTimeout || 30) * 60 * 1000
  })

  function initSessionMonitor() {
    activityHandler = resetSessionTimer
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, activityHandler, { passive: true })
    })
    resetSessionTimer()
  }

  function resetSessionTimer() {
    lastActivityTime.value = Date.now()
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
    }
    sessionTimer.value = setTimeout(() => {
      handleSessionTimeout()
    }, sessionTimeout.value)
  }

  async function handleSessionTimeout() {
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
      sessionTimer.value = null
    }
    destroySessionMonitor()
    await store.dispatch('user/logout').catch(() => {})
    if (router.currentRoute.path !== '/login') {
      router.push('/login')
    }
  }

  function destroySessionMonitor() {
    if (sessionTimer.value) {
      clearTimeout(sessionTimer.value)
      sessionTimer.value = null
    }
    if (activityHandler) {
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
      events.forEach(event => {
        window.removeEventListener(event, activityHandler)
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
