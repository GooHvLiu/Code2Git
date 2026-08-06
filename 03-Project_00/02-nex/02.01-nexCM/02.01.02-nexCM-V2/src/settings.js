/**
 * src/settings.js - 系统全局配置
 * 
 * 这里的配置可以在页面中通过 this.$store.state.settings 访问
 */
module.exports = {
  // 系统标题（显示在浏览器标签和侧边栏 Logo）
  title: '医疗设备上位机管理系统',

  /**
   * 是否显示右侧设置面板
   * 生产环境建议关闭
   */
  showSettings: false,

  /**
   * 是否显示多标签页（TagsView）
   * true: 顶部显示打开的页面标签
   * false: 不显示标签页
   */
  tagsView: true,

  /**
   * 是否固定顶部导航栏
   * true: 滚动时导航栏固定在顶部
   */
  fixedHeader: false,

  /**
   * 侧边栏是否显示 Logo
   */
  sidebarLogo: true,

  /**
   * 错误日志显示环境
   * production: 只在生产环境记录错误日志
   * ['production', 'development']: 开发和生产都记录
   */
  errorLog: 'production'
}
