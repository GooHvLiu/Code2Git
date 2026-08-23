import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 修复 vue-router 重复导航报错（点击当前路由时）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err;
  });
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: '基本概览', icon: 'el-icon-s-data' }
  },
  {
    path: '/license/gen',
    name: 'LicenseGen',
    component: () => import('@/views/LicenseGen.vue'),
    meta: { title: '生成授权', icon: 'el-icon-document-add' }
  },
  {
    path: '/license/list',
    name: 'LicenseList',
    component: () => import('@/views/LicenseList.vue'),
    meta: { title: '授权列表', icon: 'el-icon-document' }
  },
  {
    path: '/project',
    name: 'ProjectManage',
    component: () => import('@/views/ProjectManage.vue'),
    meta: { title: '项目管理', icon: 'el-icon-s-operation' }
  },
  {
    path: '/time-check',
    name: 'TimeCheck',
    component: () => import('@/views/TimeCheck.vue'),
    meta: { title: '时间校准', icon: 'el-icon-time' }
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;
