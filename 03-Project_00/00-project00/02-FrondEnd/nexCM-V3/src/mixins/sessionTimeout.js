/**
 * 操作超时自动登出 mixin
 * GMP 合规：用户一段时间无操作后自动登出，防止未授权访问
 *
 * 使用方法：在 App.vue 或 Layout 组件中引入此 mixin
 *
 * 配置：可在 settings.js 中设置 sessionTimeout（分钟），默认 30 分钟
 */
import store from '@/store'
import router from '@/router'

export default {
  data() {
    return {
      sessionTimer: null,
      lastActivityTime: Date.now()
    }
  },
  computed: {
    /** 超时时间（从 settings 读取，默认 30 分钟） */
    sessionTimeout() {
      const settings = require('@/settings').default
      return (settings.sessionTimeout || 30) * 60 * 1000
    }
  },
  mounted() {
    this.initSessionMonitor()
  },
  beforeDestroy() {
    this.destroySessionMonitor()
  },
  methods: {
    /** 初始化会话监控 */
    initSessionMonitor() {
      // 监听用户活动事件
      this._activityHandler = this.resetSessionTimer.bind(this)
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
      events.forEach(event => {
        window.addEventListener(event, this._activityHandler, { passive: true })
      })

      // 启动定时器
      this.resetSessionTimer()
    },

    /** 重置会话定时器（用户有操作时调用） */
    resetSessionTimer() {
      this.lastActivityTime = Date.now()
      if (this.sessionTimer) {
        clearTimeout(this.sessionTimer)
      }
      this.sessionTimer = setTimeout(() => {
        this.handleSessionTimeout()
      }, this.sessionTimeout)
    },

    /** 会话超时处理 */
    async handleSessionTimeout() {
      // 清除定时器
      if (this.sessionTimer) {
        clearTimeout(this.sessionTimer)
        this.sessionTimer = null
      }

      // 移除事件监听
      this.destroySessionMonitor()

      // 清除 token 和用户信息
      await store.dispatch('user/logout').catch(() => {})

      // 显示提示并跳转到登录页
      this.$message && this.$message.warning(this.$t('common.sessionTimeout'))

      // 跳转到登录页（如果当前不在登录页）
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      }
    },

    /** 销毁会话监控 */
    destroySessionMonitor() {
      if (this.sessionTimer) {
        clearTimeout(this.sessionTimer)
        this.sessionTimer = null
      }
      if (this._activityHandler) {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
        events.forEach(event => {
          window.removeEventListener(event, this._activityHandler)
        })
        this._activityHandler = null
      }
    }
  }
}
