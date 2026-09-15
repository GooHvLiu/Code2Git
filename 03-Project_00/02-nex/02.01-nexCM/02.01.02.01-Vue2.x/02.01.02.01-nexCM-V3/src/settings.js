/**
 * ==========================================
 * 系统全局设置
 * ==========================================
 * 管理系统级别的 UI 开关和行为配置
 * 与 config/index.js 的区别：
 *   - config 偏底层常量（超时、Token 头、分页等）
 *   - settings 偏用户可感知的 UI 开关
 * 后续可扩展为用户个性化设置（存 localStorage）
 */

import config from '@/config'

export default {
  /** 系统标题（统一引用 config.SYSTEM_NAME，支持国际化） */
  get title() {
    return config.SYSTEM_NAME
  },

  /** 是否固定顶部导航栏（预留，当前布局已默认固定，后续可扩展为可切换） */
  fixedHeader: true,

  /** 是否显示侧边栏 Logo */
  sidebarLogo: true,

  /** 是否显示标签页导航 */
  tagsView: true,

  /** 是否显示设置面板（当前模板不提供，预留） */
  showSettings: false,

  /** 错误日志收集环境：production / always / none */
  errorLog: 'production',

  /** 是否启用水印（显示当前用户名，防止截图泄露） */
  watermark: false,

  /** 水印文字（为空时自动使用当前用户名） */
  watermarkText: '',

  /** 会话超时时间（分钟），用户无操作超过此时间自动登出，GMP 合规要求 */
  sessionTimeout: 30
}
