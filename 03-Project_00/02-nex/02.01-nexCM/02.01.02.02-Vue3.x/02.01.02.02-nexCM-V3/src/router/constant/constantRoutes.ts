/**
 * ==========================================
 * 静态路由（无需权限）
 * ==========================================
 */
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { ROUTE_PATHS } from './pathConstants'

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
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { titles: ['layout.profile.title'], hidden: true }
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        meta: { titles: ['notification.page.title'], hidden: true }
      }
    ]
  }
]
