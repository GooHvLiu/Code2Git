/**
 * ==========================================
 * 路由路径常量
 * ==========================================
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  HOME: '/home',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  REDIRECT: '/redirect',
  LICENSE_IMPORT: '/license/import',
  LICENSE_MANAGE: '/license/manage',
  HOME_OVERVIEW: '/home/overview',
  MENU_CONFIG_PREVIEW: '/menu-config/preview'
} as const

/**
 * 404 兜底通配路由名称（固定 name）
 * - 动态路由生成后才注册，避免提前拦截未就绪的业务路由；
 * - 固定 name 使重复 addRoute 自动去重，且登出 resetRouter() 可按 name 移除，
 *   防止无名通配路由残留导致再次登录（页面未刷新）首屏误进 404。
 */
export const CATCH_ALL_ROUTE_NAME = 'CatchAll'

/** 首页固定标签（TagsView 首页不可关闭）
 *  title 必须与侧边栏首页菜单（数据库 nex_menu 中 /home/overview 节点）使用同一 i18n key，
 *  否则标签页标题与菜单名不一致（菜单为「概况预览」，页面内大标题可另用 layout.home.overview）。
 */
export const HOME_TAG = {
  title: 'layout.menu.home.overview.default',
  path: ROUTE_PATHS.HOME_OVERVIEW,
  icon: 'home'
} as const
