/**
 * ==========================================
 * 路由路径常量
 * ==========================================
 * 所有页面跳转、菜单配置、标签页中的路径统一从这里引用
 * 避免 '/home'、'/login' 等字符串散落在多个文件中
 */

/** 路由路径常量 */
export const ROUTE_PATHS = {
  /** 根路径 */
  ROOT: '/',
  /** 登录页 */
  LOGIN: '/login',
  /** 首页 */
  HOME: '/home',
  /** 个人中心 */
  PROFILE: '/profile',
  /** 404 页面 */
  NOT_FOUND: '/404',
  /** 403 无权限页面 */
  FORBIDDEN: '/403',
  /** 路由重定向页（无刷新重载用） */
  REDIRECT: '/redirect',
  /** 授权导入页（软件授权失效时跳转，无需登录） */
  LICENSE_IMPORT: '/license/import',
  /** 授权管理页 */
  LICENSE_MANAGE: '/license/manage',
  /** 首页 - 概况预览 */
  HOME_OVERVIEW: '/home/overview',
  /** 首页 - 数据看板 */
  HOME_DASHBOARD: '/home/dashboard',
  /** 首页 - 数据管理 */
  HOME_DATA: '/home/data'

}

/** 首页固定标签（TagsView 首页不可关闭） */
export const HOME_TAG = {
  title: '网站首页',
  path: ROUTE_PATHS.HOME_OVERVIEW,
  icon: 'home'
}
