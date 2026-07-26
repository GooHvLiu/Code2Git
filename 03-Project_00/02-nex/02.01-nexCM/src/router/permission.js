// 全局路由守卫、专门处理登录权限鉴权、登录拦截、token 校验逻辑
import router from "./index";
import store from "@/store/index";
import {
  requestGetUserRouterMenuApi
} from "@/common/request/index.api.js";

// 白名单：不需要登录就能访问的页面，没有 token 时，仅允许直接访问 /login；其他页面强制跳登录 与 axios 的白名单完全不一样
const whiteList = ["/login"];

// 全局前置路由守卫
router.beforeEach(async(to, from, next) => {
  // 前端存储token的key保持一致
  const token = localStorage.getItem("nexCM-authorization-token");

  // 情况1：有token（已登录）
  if (token) {
    // 如果已经登录，还要去登录页 → 直接跳首页，防止重复进入登录页
    if (to.path === "/login") {
      next("/");

    } else {
      next();
      // 如果不是去登录页面，那么直接去判断获取菜单
      if(store.state.userMenu.userMenu.length===0){
        // 每次访问，服务器都会通过token获取到对应的id
        let Routermenus=await requestGetUserRouterMenuApi();
        console.log("获取到的用户菜单为：",Routermenus);
        
      }
    }
  } else {
    // 情况2：没有token（未登录）
    if (whiteList.includes(to.path)) {
      // 在白名单，直接放行（访问登录页）
      next();
    } else {
      // 没有登录，访问主页等受保护页面 → 强制跳转登录
      next("/login");
    }
  }
});
