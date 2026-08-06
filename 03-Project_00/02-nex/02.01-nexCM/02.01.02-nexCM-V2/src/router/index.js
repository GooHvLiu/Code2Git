/**
 * router/index.js - 路由配置
 * 
 * 路由分为两类：
 * 1. constantRoutes：常量路由，不需要权限判断，所有人都能访问（登录、404、大屏等）
 * 2. asyncRoutes：动态路由，根据用户角色动态加载
 * 
 * 路由 meta 字段说明：
 * - title: 菜单和面包屑显示的标题
 * - icon: SVG 图标名称
 * - roles: 可访问的角色数组（如 ['admin', 'editor']）
 * - hidden: true 不在侧边栏显示
 * - affix: true 固定在标签页（如首页）
 * - noCache: true 不缓存页面
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

/**
 * 常量路由
 * 不需要权限，所有用户都能访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/kanban',
    component: () => import('@/views/kanban/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

/**
 * 动态路由
 * 需要根据用户角色动态加载
 */
export const asyncRoutes = [
  // ========== 生产管理 ==========
  {
    path: '/production',
    component: Layout,
    redirect: '/production/execute',
    name: 'Production',
    meta: { title: '生产管理', icon: 'form' },
    children: [
      {
        path: 'execute',
        name: 'ProductionExecute',
        component: () => import('@/views/production/execute/index'),
        meta: { title: '生产操作台', icon: 'form' }
      },
      {
        path: 'history',
        name: 'ProductionHistory',
        component: () => import('@/views/production/history/index'),
        meta: { title: '生产记录', icon: 'list' }
      }
    ]
  },

  // ========== 订单管理 ==========
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '订单管理', icon: 'documentation' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list/index'),
        meta: { title: '订单列表', icon: 'list' }
      },
      {
        path: 'create',
        name: 'OrderCreate',
        component: () => import('@/views/order/create/index'),
        meta: { title: '创建订单', icon: 'form' },
        hidden: true
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail/index'),
        meta: { title: '订单详情' },
        hidden: true
      }
    ]
  },

  // ========== 设备管理 ==========
  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'Device',
    meta: { title: '设备管理', icon: 'documentation' },
    children: [
      {
        path: 'list',
        name: 'DeviceList',
        component: () => import('@/views/device/list/index'),
        meta: { title: '设备列表', icon: 'list' }
      },
      {
        path: 'monitor',
        name: 'DeviceMonitor',
        component: () => import('@/views/device/monitor/index'),
        meta: { title: '设备监控', icon: 'dashboard' }
      }
    ]
  },

  // ========== 治具管理 ==========
  {
    path: '/fixture',
    component: Layout,
    redirect: '/fixture/list',
    name: 'Fixture',
    meta: { title: '治具管理', icon: 'documentation' },
    children: [
      {
        path: 'list',
        name: 'FixtureList',
        component: () => import('@/views/fixture/list/index'),
        meta: { title: '治具列表', icon: 'list' }
      },
      {
        path: 'register',
        name: 'FixtureRegister',
        component: () => import('@/views/fixture/register/index'),
        meta: { title: '治具注册', icon: 'form' }
      }
    ]
  },

  // ========== 工位管理 ==========
  {
    path: '/station',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Station',
        component: () => import('@/views/station/index'),
        meta: { title: '工位管理', icon: 'home' }
      }
    ]
  },

  // ========== 报表中心 ==========
  {
    path: '/report',
    component: Layout,
    redirect: '/report/production',
    name: 'Report',
    meta: { title: '报表中心', icon: 'dashboard' },
    children: [
      {
        path: 'production',
        name: 'ReportProduction',
        component: () => import('@/views/report/production/index'),
        meta: { title: '生产报表', icon: 'list' }
      },
      {
        path: 'defect',
        name: 'ReportDefect',
        component: () => import('@/views/report/defect/index'),
        meta: { title: '不良分析', icon: 'form' }
      },
      {
        path: 'oee',
        name: 'ReportOee',
        component: () => import('@/views/report/oee/index'),
        meta: { title: 'OEE统计', icon: 'dashboard' }
      }
    ]
  },

  // ========== 系统管理（仅管理员可见） ==========
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'user', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'list' }
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '菜单管理', icon: 'list' }
      },
      {
        path: 'dict',
        name: 'SystemDict',
        component: () => import('@/views/system/dict/index'),
        meta: { title: '数据字典', icon: 'form' }
      },
      {
        path: 'audit',
        name: 'SystemAudit',
        component: () => import('@/views/system/audit/index'),
        meta: { title: '审计日志', icon: 'documentation' }
      }
    ]
  },

  // 404 必须放最后
  { path: '*', redirect: '/404', hidden: true }
]

// 创建路由实例
const createRouter = () => new VueRouter({
  // mode: 'history', // 需要后端配合，开发环境用 hash
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

/**
 * 重置路由（登出时调用，清除动态添加的路由）
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
