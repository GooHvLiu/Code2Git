// 全局路由守卫、专门处理登录权限鉴权、登录拦截、token 校验逻辑
import router from "./index";
import store from "@/store/index";
import {
  requestGetUserRouterMenuApi
} from "@/common/request/index.js";
import { ROUTE_WHITE_LIST } from "./constants";
import { formatMenu } from "./helper/menuHelper";

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
    // 如果Vuex菜单为空，拉取菜单
    if (store.state.userMenu.userMenu.length === 0 && !fetchMenuLoading) {
      fetchMenuLoading = true;
      try {
        // 发起请求（axios拦截器自动处理40001/40003：清token+跳转登录）
        const serverRes = await requestGetUserRouterMenuApi();
        // 后端成功返回 code:200，取出data数组
        const rawArr = serverRes.data || [];
        // 调用外部函数格式化菜单
        const newMenuList = formatMenu(rawArr);
        // js原生中修改 mutation 的方法，...map是Vue组件方法
        store.commit("userMenu/getRouterMenus", newMenuList)
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
    if (ROUTE_WHITE_LIST.includes(to.path)) {
      // 在白名单，直接放行（访问登录页）
      return next();
    } else {

      // 没有登录，访问主页等受保护页面 → 强制跳转登录
      return next("/login");
    }
  }
});