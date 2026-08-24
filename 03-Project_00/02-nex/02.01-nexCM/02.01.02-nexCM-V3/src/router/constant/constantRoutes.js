/**
 * ==========================================
 * 静态路由（无需权限，所有人可访问）
 * ==========================================
 * 登录页、404、主布局等基础路由
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
    meta: { titles: ['error.notFound'] }
  },
  {
    path: ROUTE_PATHS.FORBIDDEN,
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    hidden: true,
    meta: { titles: ['error.forbiddenTitle'] }
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
    redirect: ROUTE_PATHS.HOME,
    name: 'Layout',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: { render: h => h('router-view') },
        meta: { titles: ['layout.home'], icon: 'home' },
        redirect: ROUTE_PATHS.HOME_OVERVIEW,
        children: [
          {
            path: 'overview',
            name: 'HomeView',
            component: () => import('@/views/home/overview/index.vue'),
            meta: { titles: ['layout.home', 'layout.homeOverview'], affix: true }
          },
          {
            path: 'dashboard',
            name: 'DashView',
            component: () => import('@/views/home/dashboard/index.vue'),
            meta: { titles: ['layout.home', 'layout.homeDashboard'] }
          },
          {
            path: 'data',
            name: 'DataView',
            component: () => import('@/views/home/data/index.vue'),
            meta: { titles: ['layout.home', 'layout.homeData'] }
          },
        ]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        hidden: true,
        meta: { titles: ['layout.profile'] }
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        hidden: true,
        meta: { titles: ['layout.systemSettings', 'layout.userManagement'], roles: ['administrator'] }
      },
      {
        path: 'system/audit',
        name: 'SystemAudit',
        component: () => import('@/views/system/audit/index.vue'),
        hidden: true,
        meta: { titles: ['layout.systemSettings', 'layout.auditLog'] }
      },
      {
        path: 'system/config',
        name: 'SystemConfig',
        component: () => import('@/views/system/config/index.vue'),
        hidden: true,
        meta: { titles: ['layout.systemSettings', 'layout.systemConfig'] }
      },
      // ========== 系统设置（本地固定菜单，侧边栏最后一项） ==========
      {
        path: 'system/dict',
        name: 'SystemDict',
        component: () => import('@/views/system/dict/index.vue'),
        hidden: true,
        meta: { titles: ['layout.systemSettings', 'layout.dictManagement'], roles: ['administrator'] }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        hidden: true,
        meta: { titles: ['layout.systemSettings', 'layout.roleManagement'], roles: ['administrator'] }
      },
      {
        path: 'system/dept',
        name: 'SystemDept',
        component: () => import('@/views/system/dept/index.vue'),
        hidden: true,
        meta: { titles: ['layout.systemSettings', 'layout.deptManagement'], roles: ['administrator'] }
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        hidden: true,
        meta: { titles: ['layout.notificationCenter'] }
      }
    ]
  },
  // 404 兜底必须放最后
  { path: '*', redirect: ROUTE_PATHS.NOT_FOUND, hidden: true }
]
