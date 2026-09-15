/**
 * 布局模块 - 国际化字段聚合入口
 * 聚合所有布局相关子模块的国际化字段
 */
import login from './login.js'
import navbar from './navbar.js'
import tagsview from './tagsview.js'
import profile from './profile.js'
import errorPage from './error-page.js'
import quickMenu from './quickMenu.js'
import home from './home.js'
import menu from './menu.js'

export default {
  // 登录页
  login,
  // 导航栏
  navbar,
  // 标签页
  tagsview,
  // 个人中心
  profile,
  // 错误页面
  errorPage,
  // 快捷菜单
  quickMenu,
  // 首页
  home,
  // 菜单数据翻译
  menu
}
