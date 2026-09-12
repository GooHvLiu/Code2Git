import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '基本概览', icon: 'Odometer' }
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('@/views/projects/index.vue'),
        meta: { title: '项目管理', icon: 'Folder' }
      },
      {
        path: 'modules',
        name: 'Modules',
        component: () => import('@/views/modules/index.vue'),
        meta: { title: '测试模块', icon: 'Grid' }
      },
      {
        path: 'modules/i18n-check',
        name: 'I18nCheck',
        component: () => import('@/views/modules/i18n-check/index.vue'),
        meta: { title: '国际化检测', icon: 'DocumentChecked', hidden: true }
      },
      {
        path: 'modules/run/:moduleType',
        name: 'ModuleRunner',
        component: () => import('@/views/modules/runner/index.vue'),
        meta: { title: '插件执行', hidden: true }
      },
      {
        path: 'plugins',
        name: 'Plugins',
        component: () => import('@/views/plugins/index.vue'),
        meta: { title: '插件管理', icon: 'Connection' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/index.vue'),
        meta: { title: '测试报告', icon: 'Tickets' }
      },
      {
        path: 'reports/:id',
        name: 'ReportDetail',
        component: () => import('@/views/reports/ReportDetail.vue'),
        meta: { title: '报告详情', icon: 'Document', hidden: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      },
      {
        path: 'docs',
        name: 'PluginDocs',
        component: () => import('@/views/plugins/docs.vue'),
        meta: { title: '开发指南', icon: 'Reading' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于平台', icon: 'InfoFilled' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
