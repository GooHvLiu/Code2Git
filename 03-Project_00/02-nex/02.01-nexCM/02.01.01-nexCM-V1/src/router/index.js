// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import UserLogin from "@pages/UserLogin/UserLogin.vue";
import MainLayout from "@pages/Layout/MainLayout.vue";

// 捕获路由跳转的NavigationDuplicated / Redirected 未捕获Promise错误
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    // 过滤这类导航重定向错误，不向外抛出
    if (err.name !== 'NavigationRedirectedError') return err
  })
}
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationRedirectedError') return err
  })
}

// 静态路由（所有人无需权限都能访问）
export const staticRoutes = [
  {
    name: "login",
    path: "/login",
    component: UserLogin,
    meta: {
      title: "登录页面"
    }
  },
  {
    name: "webMain",
    path: "/",
    component: MainLayout,
    redirect: "/home",
    meta: {
      title: "网站首页"
    }
  },
  {
    name: "errorpage",
    path: "*",
    component: () => import('@/pages/ErrorPage.vue'),
    meta: {
      title: "错误页面"
    }
  }
];
// 创建路由实例
const router = new VueRouter({
  mode: "hash",
  routes: staticRoutes
});

export default router;
