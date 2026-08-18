/**
 * ==========================================
 * UI 配置
 * ==========================================
 * 分页、侧边栏、标签页、主题色、动画、响应式
 *
 * 侧边栏颜色从 themeVariables.js 导入，与 Less 共享同一份配置，
 * 修改 themeVariables.js 即可同时影响样式和 JS 逻辑。
 */
import themeVariables from './themeVariables'

export default {
  // ==================== 分页配置 ====================
  /** 默认每页条数 */
  PAGE_SIZE: 20,
  /** 可选每页条数 */
  PAGE_SIZES: [10, 20, 50, 100],

  // ==================== 侧边栏 ====================
  /** 侧边栏展开宽度 */
  SIDEBAR_WIDTH: '220px',
  /** 侧边栏折叠宽度 */
  SIDEBAR_COLLAPSE_WIDTH: '64px',

  // ==================== 标签页 ====================
  /** 标签页最大缓存数量 */
  TAGS_VIEW_MAX: 20,

  // ==================== 主题色 ====================
  /** 侧边栏背景色（从共享变量导入） */
  SIDEBAR_BG: themeVariables['sidebar-bg'],
  /** 侧边栏文字色（从共享变量导入） */
  SIDEBAR_TEXT: themeVariables['sidebar-text'],
  /** 侧边栏选中菜单文字色（固定默认值，悬停文字色见 themeVariables.js） */
  SIDEBAR_ACTIVE_TEXT: '#409eff',

  // ==================== 动画 ====================
  /** 页面切换动画时长（毫秒） */
  TRANSITION_DURATION: 280,
  /** 分页切换后滚动到顶部的动画时长（毫秒） */
  SCROLL_TOP_DURATION: 800,

  // ==================== 响应式 ====================
  /** 移动端断点（像素），小于此宽度视为移动端，与 variables.less @screen-sm 保持一致 */
  MOBILE_BREAKPOINT: 576,

  // ==================== 登录/注册页 ====================
  LOGIN: {
    /** 登录页标题 */
    PAGE_TITLE_LOGIN: '登录',
    /** 注册页标题 */
    PAGE_TITLE_REGISTER: '注册',
    /** 验证码加载中文字 */
    CAPTCHA_LOADING: 'Loading',
    /** 注册功能开发中提示 */
    REGISTER_DEVELOPING: '注册功能开发中，敬请期待'
  }
}
