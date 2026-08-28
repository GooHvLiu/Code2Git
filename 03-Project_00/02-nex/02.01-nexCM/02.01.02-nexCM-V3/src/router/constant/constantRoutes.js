/**
 * ==========================================
 * 静态路由（无需权限，所有人可访问）
 * ==========================================
 * 登录页、404、主布局等基础路由
 * 注意：业务菜单全部从后端服务器动态获取，前端不再硬编码
 * meta.titles 为面包屑层级数组，TagsView 取最后一项作为标签标题
 */
import Layout from '@/Layout/index.vue'
import { ROUTE_PATHS } from './pathConstants'

export const constantRoutes = [
  {
    path: ROUTE_PATHS.LOGIN,
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { titles: ['login.title'] }
  },
  {
    path: ROUTE_PATHS.LICENSE_IMPORT,
    name: 'LicenseImport',
    component: () => import('@/views/license/LicenseImport.vue'),
    hidden: true,
    meta: { titles: ['license.importTitle'] }
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
    meta: { titles: ['errorPage.notFound'] }
  },
  {
    path: ROUTE_PATHS.FORBIDDEN,
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    hidden: true,
    meta: { titles: ['errorPage.forbiddenTitle'] }
  },
  {
    path: ROUTE_PATHS.REDIRECT,
    name: 'Redirect',
    component: () => import('@/views/redirect/index.vue'),
    hidden: true,
    meta: { titles: ['redirect'] }
  },
  {
    path: ROUTE_PATHS.ROOT,
    component: Layout,
    name: 'Layout',
    children: [
      // 个人中心（隐藏路由，不显示在菜单中，但可通过路由访问）
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        hidden: true,
        meta: { titles: ['layout.profile'] }
      },
      // 通知中心（隐藏路由，不显示在菜单中，但可通过通知铃铛跳转）
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        hidden: true,
        meta: { titles: ['layout.notificationCenter'] }
      }
    ]
  }
  // 注意：404 兜底路由不在此静态定义，改为在动态路由加载完成后通过 addRoute 动态添加，
  // 否则刷新页面时 404 会比动态路由先匹配，导致业务页面刷新跳 404
]
