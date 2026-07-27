// 全局路由守卫、专门处理登录权限鉴权、登录拦截、token 校验逻辑
import router from "./index";
import store from "@/store/index";
import {
  requestGetUserRouterMenuApi
} from "@/common/request/index.api.js";

// 白名单：不需要登录就能访问的页面，没有 token 时，仅允许直接访问 /login；其他页面强制跳登录 与 axios 的白名单完全不一样
const whiteList = ["/login"];

// 全局前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 前端存储 token 的 key 保持一致
  const token = localStorage.getItem("nexCM-authorization-token");

  // 情况 1：有 token（已登录）
  if (token) {

    // 如果已经登录，还要去登录页 → 直接跳首页，防止重复进入登录页
    if (to.path === "/login") {
      return next("/");
    } else {
      // 如果不是去登录页面，那么直接去判断获取菜单
      if (store.state.userMenu.userMenu.length === 0) {
        // 每次访问，服务器都会通过 token 获取到对应的 id
        let routerMenus = await requestGetUserRouterMenuApi();
        // console.log("获取到的用户菜单为：", routerMenus);
        // 从服务器获取的数据和Vuex中的数据结构不一致，需要进行处理
        let newRouterMenus = [{ title: "网站首页", path: "/" }]
        // 从服务器获取的数据中拼接成想要的数据
        let ret = routerMenus.data.map(item => {
          // 如果有子菜单
          if (item.children) {
            return {
              title: item.meta.title,
              path: item.path,
              children: item.children.map(childrenItem => {
                return {
                  title: childrenItem.meta.title,
                  path: item.path + "/" + childrenItem.path
                }
              })
            }
          }
          // 如果没有子菜单
          else {
            return {
              title: item.meta.title,
              path: item.path
            }
          }
        })
        // 通过 ES6 的展开运算符拼接成全新的数组
        newRouterMenus = [...newRouterMenus, ...ret]
        // console.log("全新的菜单：", newRouterMenus);

        // js原生中获取 store 里面数据的方法，...map是Vue组件方法
        store.commit("userMenu/getRouterMenus", newRouterMenus)
      }
      // 允许路由跳转到目标页面 to.path 但函数代码不会立刻终止
      next();
    }
  } else {
    // 情况 2：没有 token（未登录）
    if (whiteList.includes(to.path)) {
      // 在白名单，直接放行（访问登录页）
      next();
    } else {

      // 没有登录，访问主页等受保护页面 → 强制跳转登录
      next("/login");
    }
  }
});