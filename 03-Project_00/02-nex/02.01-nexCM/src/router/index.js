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
    meta: {
      title: "布局框架"
    }
  }
];
// 创建路由实例
const router = new VueRouter({
  mode: "hash",
  routes: staticRoutes
});

export default router;
