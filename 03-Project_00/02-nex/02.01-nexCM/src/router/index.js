// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import UserLogoin from "@pages/UserLogin/UserLogin.vue";
//创建并暴露一个路由器
export default new VueRouter({
  routes: [
    {
      name: "login",
      path: "/login",
      component: UserLogoin
    }
  ]
});
