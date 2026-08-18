/**
 * ==========================================
 * nex-theme-picker 默认主题变量
 * ==========================================
 * 可自定义主题变量（JS / Less 共享）
 * 本文件只放需要用户自定义的颜色变量
 *
 * 工作原理：
 *   vue.config.js 构建时自动将本文件转成 Less 变量，
 *   通过 style-resources-loader 注入，覆盖 variables.less 中的同名变量。
 *
 * 用法：
 *   // Less 中直接用 @sidebar-bg 等变量
 *   // JS 中 import themeVariables from 'nex-theme-picker/src/themeVariables'
 */
module.exports = {
  /** 1. 菜单栏整个竖条的背景色 */
  'sidebar-bg': '#faf7f2',

  /** 2. 菜单栏文字颜色 */
  'sidebar-text': '#808080',

  /** 3. 菜单栏图标颜色 */
  'sidebar-icon-color': '#49c3ce',

  /** 4. 菜单栏鼠标悬停背景色 */
  'sidebar-hover-bg': '#808080',

  /** 5. 菜单栏鼠标悬停文字颜色 */
  'sidebar-hover-text': '#ffffff',

  /** 6. 菜单栏选中的菜单背景色 */
  'sidebar-active-bg': '#ffffff',

  /** 7. 选中标签背景色 */
  'tag-active-bg': '#49c3ce',

  /** 8. 标签边框颜色 */
  'tag-border': '#49c3ce',

  /** 9. 标签叉号颜色 */
  'tag-close-color': '#49c3ce',

  /** 10. 主内容区域背景色 */
  'app-main-bg': '#ffffff'
}
