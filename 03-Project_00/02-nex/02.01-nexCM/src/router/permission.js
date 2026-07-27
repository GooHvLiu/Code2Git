// 全局路由守卫、专门处理登录权限鉴权、登录拦截、token 校验逻辑
import router from "./index";
import store from "@/store/index";
import {
  requestGetUserRouterMenuApi
} from "@/common/request/index.api.js";

// 白名单：不需要登录就能访问的页面，没有 token 时，仅允许直接访问 /login；其他页面强制跳登录 与 axios 的白名单完全不一样
const whiteList = ["/login"];
// 请求锁：防止多次并发请求菜单接口
let fetchMenuLoading = false;

// 全局前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 前端存储 token 的 key 保持一致
  const token = localStorage.getItem("nexCM-authorization-token");

  // 情况 1：有 token（已登录）
  if (token) {

    // 如果已经登录，还要去登录页 → 直接跳首页，防止重复进入登录页
    if (to.path === "/login") {
      return next("/");
    }
    // 如果不是去登录页面，那么直接去判断获取菜单
    if (store.state.userMenu.userMenu.length === 0 && !fetchMenuLoading) {
      fetchMenuLoading = true;
      try {
        // 发起请求（axios拦截器自动处理40001/40003：清token+跳转登录）
        const routerMenus = await requestGetUserRouterMenuApi();
        // 后端成功返回 code:200，取出data数组
        const rawMenuList = routerMenus.data || [];

        // 从服务器获取的数据和Vuex中的数据结构不一致，需要进行处理
        let newRouterMenus = [{ title: "网站首页", path: "/", icon: 'home' }]
        // 处理后端菜单数据，增加兜底防止children undefined
        const ret = rawMenuList.map(item => {
          // 如果有子菜单
          if (item.children && Array.isArray(item.children)) {
            return {
              title: item.meta.title,
              path: item.path,
              icon: item.meta.icon,
              children: item.children.map(childrenItem => {
                return {
                  title: childrenItem.meta.title,
                  path: `${item.path}/${childrenItem.path}`,
                  icon: childrenItem.meta.icon,
                }
              })
            }
          }
          // 如果没有子菜单
          else {
            return {
              title: item.meta.title,
              path: item.path,
              icon: item.meta.icon
            }
          }
        })
        // 通过 ES6 的展开运算符拼接成全新的数组
        newRouterMenus = [...newRouterMenus, ...ret]

        // js原生中修改 mutation 的方法，...map是Vue组件方法
        store.commit("userMenu/getRouterMenus", newRouterMenus)
      } catch (err) {
        /**
         * axios拦截器已经捕获 40001 / 40003 自动清除token、跳转登录
         * 进入catch代表接口业务异常（账号禁用、密码错误等，无需额外处理，直接放行路由，拦截器已经完成跳转）
         */
        console.error("获取用户菜单失败：", err);
      } finally {
        // 无论成功失败，释放请求锁
        fetchMenuLoading = false;
      }
      // 菜单加载完成后，再放行路由
      return next();
    }
    // 菜单已经存在，直接放行
    return next();

  } else {
    // 情况 2：没有 token（未登录）
    if (whiteList.includes(to.path)) {
      // 在白名单，直接放行（访问登录页）
      return next();
    } else {

      // 没有登录，访问主页等受保护页面 → 强制跳转登录
      return next("/login");
    }
  }
});