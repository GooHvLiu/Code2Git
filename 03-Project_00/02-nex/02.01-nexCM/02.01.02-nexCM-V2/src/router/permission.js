/**
 * ==========================================
 * 全局路由守卫
 * ==========================================
 * 处理登录拦截、用户信息获取、动态路由挂载
 *
 * 流程：
 * 1. 无 Token → 白名单放行，其余跳登录
 * 2. 有 Token 访问登录页 → 跳首页
 * 3. 有 Token 且已生成路由 → 直接放行
 * 4. 有 Token 但未生成路由 → 获取用户信息 + 动态路由，重新匹配
 */
import router from '@/router/index'
import store from '@/store/index'
import { ROUTE_WHITE_LIST } from '@/router/constants'
import { ROUTE_PATHS } from '@/router/pathConstants'
import { getToken } from '@/utils/auth'
import { cancelAllPending } from '@/utils/request'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import config from '@/config'

NProgress.configure({ showSpinner: false })

const whiteList = ROUTE_WHITE_LIST || [ROUTE_PATHS.LOGIN]

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // 路由切换时取消所有未完成的请求，避免数据错乱
  cancelAllPending()

  // 设置页面标题（取 titles 数组最后一项）
  const pageTitle = to.meta?.titles?.[to.meta.titles.length - 1]
  document.title = pageTitle ? `${pageTitle} - ${config.SYSTEM_NAME}` : config.SYSTEM_NAME

  const hasToken = getToken()

  // 未登录
  if (!hasToken) {
    if (whiteList.includes(to.path)) {
      return next()
    }
    return next(`${ROUTE_PATHS.LOGIN}?redirect=${to.path}`)
  }

  // 已登录，访问登录页直接跳首页
  if (to.path === ROUTE_PATHS.LOGIN) {
    return next(ROUTE_PATHS.ROOT)
  }

  // 已生成动态路由，直接放行（用 routesGenerated 标志，避免空菜单死循环）
  if (store.state.permission.routesGenerated) {
    return next()
  }

  // 首次进入：获取用户信息 + 动态路由
  try {
    // 1. 获取用户信息（含角色）
    await store.dispatch('user/getUserInfo')

    // 2. 获取菜单并生成动态路由
    const accessRoutes = await store.dispatch('permission/generateRoutes')
    accessRoutes.forEach(route => {
      router.addRoute('Layout', route)
    })

    // 3. addRoute 后必须 next({ ...to, replace: true }) 重新匹配
    next({ ...to, replace: true })
  } catch (err) {
    // 获取失败，清除登录状态跳登录
    await store.dispatch('user/logout')
    next(`${ROUTE_PATHS.LOGIN}?redirect=${to.path}`)
  }
})

router.afterEach(() => {
  NProgress.done()
})
