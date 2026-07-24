// 全局路由守卫、专门处理登录权限鉴权、登录拦截、token 校验逻辑
import router from "./index";

// 白名单：不需要登录就能访问的页面，没有 token 时，仅允许直接访问 /login；其他页面强制跳登录 与 axios 的白名单完全不一样
const whiteList = ["/login"];

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 前端存储token的key保持一致
  const token = localStorage.getItem("nexCM-authorization-token");

  // 情况1：有token（已登录）
  if (token) {
    // 如果已经登录，还要去登录页 → 直接跳首页，防止重复进入登录页
    if (to.path === "/login") {
      next("/");
    } else {
      next();
      /*
      可以在这里：判断本地有没有用户信息
      如果没有用户信息 → 请求接口 /user/info 获取用户信息、权限、菜单
      保存到Vuex，再放行；
      如果token过期，后端接口返回401，清除token，跳登录
      */
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
