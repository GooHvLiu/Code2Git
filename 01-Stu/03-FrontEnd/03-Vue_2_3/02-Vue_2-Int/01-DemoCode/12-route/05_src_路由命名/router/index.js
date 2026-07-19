// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import UserAbout from "../pages/UserAbout";
import UserHome from "../pages/UserHome";
import HomeNews from "../pages/HomeNews";
import HomeMessages from "../pages/HomeMessages";
import HomeMessagesDetail from "../pages/HomeMessagesDetail";

//创建并暴露一个路由器
export default new VueRouter({
  routes: [
    {
      name: "guanyu",
      path: "/about",
      component: UserAbout
    },
    {
      path: "/home",
      component: UserHome,
      children: [
        {
          path: "news",
          component: HomeNews
        },
        {
          path: "messages",
          component: HomeMessages,
          children: [
            {
              name: "xiangqing",
              path: "detail",
              component: HomeMessagesDetail
            }
          ]
        }
      ]
    }
  ]
});
