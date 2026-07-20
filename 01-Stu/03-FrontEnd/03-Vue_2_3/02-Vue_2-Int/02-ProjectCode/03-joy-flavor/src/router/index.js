// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import UserMsite from "@pages/UserMsite/UserMsite.vue";
import UserOrder from "@pages/UserOrder/UserOrder.vue";
import UserProfile from "@pages/UserProfile/UserProfile.vue";
import UserSearch from "@pages/UserSearch/UserSearch.vue";

//创建并暴露一个路由器
export default new VueRouter({
  routes: [
    {
      name: "msite",
      path: "/msite",
      component: UserMsite
    },
    {
      name: "order",
      path: "/order",
      component: UserOrder
    },
    {
      name: "profile",
      path: "/profile",
      component: UserProfile
    },
    {
      name: "search",
      path: "/search",
      component: UserSearch
    },
    {
      path: "/",
      redirect: "/msite"
    }
  ]
});
