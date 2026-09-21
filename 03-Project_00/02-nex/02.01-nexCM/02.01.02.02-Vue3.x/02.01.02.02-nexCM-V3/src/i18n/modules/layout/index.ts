/**
 * 布局模块 - 国际化字段聚合入口
 * 聚合所有布局相关子模块的国际化字段
 */
import login from './login'
import navbar from './navbar'
import tagsview from './tagsview'
import profile from './profile'
import errorPage from './error-page'
import quickMenu from './quickMenu'
import home from './home'
import menu from './menu'

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
