/**
 * ==========================================
 * 响应式检测 Mixin
 * ==========================================
 * 监听窗口大小变化，自动切换 device 状态
 * 小于 992px 自动切换为 mobile 并折叠侧边栏
 *
 * 用法：在 Layout 组件中 mixins: [resizeMixin]
 */
import { mapActions } from 'vuex'
import config from '@/config'

// 移动端断点（与 variables.less @screen-sm 保持一致）
const WIDTH = config.MOBILE_BREAKPOINT

export default {
  data() {
    return {
      $_resizeHandler: null
    }
  },
  mounted() {
    this.$_initResizeEvent()
  },
  beforeDestroy() {
    this.$_destroyResizeEvent()
  },
  methods: {
    ...mapActions('app', ['toggleDevice', 'closeSideBar']),

    /** 初始化 resize 监听 */
    $_initResizeEvent() {
      this.$_resizeHandler = () => {
        const isMobile = this.$_isMobile()
        if (isMobile) {
          this.toggleDevice('mobile')
          this.closeSideBar({ withoutAnimation: true })
        } else {
          this.toggleDevice('desktop')
        }
      }
      window.addEventListener('resize', this.$_resizeHandler)
      // 首次加载也检测一次
      if (this.$_isMobile()) {
        this.toggleDevice('mobile')
        this.closeSideBar({ withoutAnimation: true })
      }
    },

    /** 销毁 resize 监听 */
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    },

    /** 判断是否为移动端 */
    $_isMobile() {
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    }
  }
}
