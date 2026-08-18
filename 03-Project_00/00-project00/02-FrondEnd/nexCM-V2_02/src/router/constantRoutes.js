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
        component: () => import('@/views/home/index.vue'),
        meta: { titles: ['layout.home'], icon: 'home', affix: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        hidden: true,
        meta: { titles: ['layout.profile'] }
      }
    ]
  },
  // 404 兜底必须放最后
  { path: '*', redirect: ROUTE_PATHS.NOT_FOUND, hidden: true }
]
