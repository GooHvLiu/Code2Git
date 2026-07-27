// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import UserLogin from "@pages/UserLogin/UserLogin.vue";
import MainLayout from "@pages/Layout/MainLayout.vue";

// 静态路由（所有人无需权限都能访问）
export const staticRoutes = [
  {
    name: "login",
    path: "/login",
    component: UserLogin,
    meta: {
      title: "登录页"
    }
  },
  {
    name: "mainlayout",
    path: "/",
    component: MainLayout,
    redirect: "/home",
    meta: {
      title: "布局框架"
    },
    // children: [
    //   {
    //     name: 'home',
    //     path: '/home',
    //     component: () => import('@/pages/UserHome.vue')
    //   },
    //   {
    //     name: 'businessAppointment',
    //     path: '/business/appointment',
    //     component: () => import('@/pages/business/UserAppointment.vue')
    //   },
    //   {
    //     name: 'businessService',
    //     path: '/business/service',
    //     component: () => import('@/pages/business/UserService.vue')
    //   },
    //   {
    //     name: 'businessStatement',
    //     path: '/business/statement',
    //     component: () => import('@/pages/business/UserStatement.vue')
    //   },
    //   {
    //     name: 'customerCustomer',
    //     path: '/customer/customer',
    //     component: () => import('@/pages/customer/UserCustomer.vue')
    //   },
    //   {
    //     name: 'customerVisit',
    //     path: '/customer/visit',
    //     component: () => import('@/pages/customer/UserVisit.vue')
    //   },
    //   {
    //     name: 'flowApprove',
    //     path: '/flow/approve',
    //     component: () => import('@/pages/flow/UserApprove.vue')
    //   },
    //   {
    //     name: 'flowDefinition',
    //     path: '/flow/definition',
    //     component: () => import('@/pages/flow/UserDefinition.vue')
    //   },
    // ]
  }
];
// 创建路由实例
const router = new VueRouter({
  mode: "hash",
  routes: staticRoutes
});

export default router;
