/**
 * ==========================================
 * 静态路由（无需权限）
 * ==========================================
 */
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { ROUTE_PATHS } from './pathConstants'

/** Layout 下的常驻子路由：个人中心 */
const profileChildRoute: RouteRecordRaw = {
  path: 'profile',
  name: 'Profile',
  component: () => import('@/views/profile/index.vue'),
  meta: { titles: ['layout.profile.title'], hidden: true }
}

/** Layout 下的常驻子路由：通知中心 */
const notificationChildRoute: RouteRecordRaw = {
  path: 'notification',
  name: 'Notification',
  component: () => import('@/views/notification/index.vue'),
  meta: { titles: ['notification.page.title'], hidden: true }
}

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { titles: ['layout.login.title'], hidden: true }
  },
  {
    path: ROUTE_PATHS.LICENSE_IMPORT,
    name: 'LicenseImport',
    component: () => import('@/views/license/license-import/index.vue'),
    meta: { titles: ['superPanel.license.page.importTitle'], hidden: true }
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { titles: ['layout.errorPage.notFound'], hidden: true }
  },
  {
    path: ROUTE_PATHS.FORBIDDEN,
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: { titles: ['layout.errorPage.forbidden'], hidden: true }
  },
  {
    path: ROUTE_PATHS.REDIRECT,
    name: 'Redirect',
    component: () => import('@/views/redirect/index.vue'),
    meta: { titles: ['redirect'], hidden: true }
  },
  {
    path: ROUTE_PATHS.MENU_CONFIG_PREVIEW,
    name: 'MenuConfigPreview',
    component: () => import('@/views/super-panel/menu-config/preview.vue'),
    meta: { titles: ['superPanel.menuConfig.preview.title'], hidden: true }
  },
  {
    path: ROUTE_PATHS.ROOT,
    component: Layout,
    name: 'Layout',
    children: [profileChildRoute, notificationChildRoute]
  }
]

/**
 * Layout 下的常驻子路由（个人中心 / 通知中心）
 *
 * 单独导出供路由守卫在动态路由挂载后重新 addRoute('Layout', ...) 时补挂。
 * 原因：Vue Router 4 在通过 addRoute(parentName, route) 批量追加动态子路由后，
 * 会重建 matcher，导致最初随 constantRoutes 一起注册的相对路径子路由（profile/notification）
 * 从匹配表中丢失，直接访问或菜单跳转均落到 404。在 guard 中按同名 addRoute 重新补挂即可恢复。
 */
export const layoutChildRoutes: RouteRecordRaw[] = [profileChildRoute, notificationChildRoute]
