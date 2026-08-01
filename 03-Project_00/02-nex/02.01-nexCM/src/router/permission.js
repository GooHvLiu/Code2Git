// 全局路由守卫、专门处理登录权限鉴权、登录拦截、token 校验逻辑
import router from "./index";
import store from "@/store/index";
import {
  requestGetUserRouterMenuApi
} from "@/common/request/index.js";
import { ROUTE_WHITE_LIST } from "./constants";
import { formatMenu } from "./helper/menuHelper";
import { buildDynamicRoutes } from "./helper/routerHelper";
import { LOCALSTORAGE_KEYS } from "@/common/constants/storageKey.js";
import { getLocalStorage } from "@/common/utils/index.js";

// 请求锁：防止多次并发请求菜单接口
let fetchMenuLoading = false;
// 标记：是否已经追加过动态路由，避免重复addRoutes
let hasAddDynamicRoute = false;

// 全局前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 前端存储 token 的 key 保持一致
  const token = getLocalStorage(LOCALSTORAGE_KEYS.TOKEN);

  // 情况 1：有 token（已登录）
  if (token) {
    // 如果已经登录，还要去登录页 → 直接跳首页，防止重复进入登录页
    if (to.path === "/login") {
      return next("/");
    }
    // 如果Vuex菜单为空，拉取菜单
    if (store.state.userMenu.userMenu.length === 0 && !fetchMenuLoading && !hasAddDynamicRoute) {
      fetchMenuLoading = true
      try {
        // 发起请求（axios拦截器自动处理40001/40003：清token+跳转登录）,后端成功返回 code:200，取出data数组
        const serverRes = await requestGetUserRouterMenuApi();
        const rawArr = serverRes.data || [];
        // 1. 调用外部函数格式化菜单 js原生中修改 mutation 的方法，...map是Vue组件方法
        const newMenuList = formatMenu(rawArr);
        store.commit("userMenu/getRouterMenus", newMenuList)

        // 2. 根据后端原始菜单生成【动态路由数组】
        const oldRoute = [
          {
            name: "home",
            path: "/home",
            meta: { titles: ["网站首页"] },
            component: () => import("@pages/UserHome.vue"),
          },
          {
            name: "profile",
            path: "/profile",
            meta: { titles: ["个人中心"] },
            component: () => import("@pages/UserProfile.vue"),
          }
        ];
        let dynamicRoutes = buildDynamicRoutes(rawArr);
        // 数组解析
        dynamicRoutes = [...oldRoute, ...dynamicRoutes]
        // console.log("@dynamicRoutes@:", dynamicRoutes);

        // 挂载动态路由
        dynamicRoutes.forEach(item => {
          router.addRoute("webMain", item)
        })
        // 标记路由已挂载
        hasAddDynamicRoute = true;
        //addRoutes之后必须使用 next({ path: to.path, replace: true }) 解决初次进入页面路由404、路由不匹配问题
        return next({ path: to.path, replace: true });
      } catch (err) {
        /**
         * axios拦截器已经捕获 40001 / 40003 自动清除token、跳转登录
         * 进入catch代表接口业务异常（账号禁用、密码错误等，无需额外处理，直接放行路由，拦截器已经完成跳转）
         */
        console.log("获取用户菜单失败：", err);
        // 请求菜单接口失败，直接放行
        return next();
      } finally {
        // 无论成功失败，释放请求锁
        fetchMenuLoading = false;
      }
    }
    else {
      // 菜单已存在/路由已挂载，直接放行
      return next();
    }
  } else {
    // 情况 2：没有 token（未登录）
    if (ROUTE_WHITE_LIST.includes(to.path)) {
      // 在白名单，直接放行（访问登录页）
      return next();
    } else {

      // 没有登录，访问主页等受保护页面 → 强制跳转登录
      return next("/login");
    }
  }
});
// 退出登录时调用，重置标记，下次登录重新拉取菜单+挂载路由
export function resetRouteState() {
  hasAddDynamicRoute = false;
}