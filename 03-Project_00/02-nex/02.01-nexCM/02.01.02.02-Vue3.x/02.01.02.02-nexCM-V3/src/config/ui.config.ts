/**
 * ==========================================
 * UI 配置
 * ==========================================
 */
import themeVariables from './theme-variables.config'

export default {
  // 分页
  PAGE_SIZE: 20,
  PAGE_SIZES: [10, 20, 50, 100] as number[],
  // 侧边栏
  SIDEBAR_WIDTH: '220px',
  SIDEBAR_COLLAPSE_WIDTH: '64px',
  // 标签页
  TAGS_VIEW_MAX: 20,
  // 主题色（从共享变量导入）
  SIDEBAR_BG: themeVariables['sidebar-bg'],
  SIDEBAR_TEXT: themeVariables['sidebar-text'],
  SIDEBAR_ACTIVE_TEXT: '#409eff',
  // 动画
  TRANSITION_DURATION: 280,
  SCROLL_TOP_DURATION: 800,
  // 响应式
  MOBILE_BREAKPOINT: 576,
  // 登录页文案
  LOGIN: {
    PAGE_TITLE_LOGIN: '登录',
    PAGE_TITLE_REGISTER: '注册',
    CAPTCHA_LOADING: 'Loading',
    REGISTER_DEVELOPING: '注册功能开发中，敬请期待'
  }
}
