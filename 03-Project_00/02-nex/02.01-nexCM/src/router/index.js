// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import UserLogin from "@pages/UserLogin/UserLogin.vue";
import MainLayout from "@pages/Layout/MainLayout.vue";
//创建并暴露一个路由器
export default new VueRouter({
  mode: "hash",
  routes: [
    {
      name: "login",
      path: "/login",
      component: UserLogin
    },
    {
      name: "mainlayout",
      path: "/",
      component: MainLayout
    }
  ]
});
