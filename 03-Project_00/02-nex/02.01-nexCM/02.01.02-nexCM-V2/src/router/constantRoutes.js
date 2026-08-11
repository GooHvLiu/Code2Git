/**
 * ==========================================
 * 静态路由（无需权限，所有人可访问）
 * ==========================================
 * 登录页、404、主布局等基础路由
 * meta.titles 为面包屑层级数组，TagsView 取最后一项作为标签标题
 */
import Layout from '@/Layout/index.vue'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { titles: ['登录'] }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
    meta: { titles: ['页面不存在'] }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Layout',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { titles: ['网站首页'], icon: 'home', affix: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        hidden: true,
        meta: { titles: ['个人中心'] }
      }
    ]
  },
  // 404 兜底必须放最后
  { path: '*', redirect: '/404', hidden: true }
]
