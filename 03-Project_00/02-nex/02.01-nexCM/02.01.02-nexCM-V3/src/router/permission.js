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
import router from '@/router'
import store from '@/store'
import { ROUTE_WHITE_LIST } from '@/router/constant/constants'
import { ROUTE_PATHS } from '@/router/constant/pathConstants'
import { getToken } from '@/utils/auth'
import { cancelAllPending } from '@/utils/request'
import { getLicenseStatus } from '@/api'
import ws from '@/utils/websocket'
import i18n, { applySystemDefaultLanguage } from '@/i18n'
import { loadConfig } from '@/utils/config'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ROUTE_WHITE_LIST || [ROUTE_PATHS.LOGIN]
/**
 * 授权状态缓存
 * null = 未检查, true = 授权有效, false = 授权失效
 * 只在应用启动时检查一次，避免每次路由跳转都调用接口
 * 导入授权成功后需调用 resetLicenseCache() 重置
 */
let licenseCache = null

/**
 * 重置授权缓存（导入授权成功后调用）
 */
export function resetLicenseCache() {
  licenseCache = null
}

/**
 * 检查授权状态（带缓存）
 * @returns {Promise<boolean>} 是否授权有效
 */
async function checkLicense() {
  if (licenseCache !== null) {
    return licenseCache
  }
  try {
    const res = await getLicenseStatus()
    licenseCache = res.data?.valid === true
    return licenseCache
  } catch (e) {
    // 接口请求失败（如后端未启动），默认视为授权有效，避免无法使用
    licenseCache = true
    return true
  }
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // 路由切换时取消所有未完成的请求，避免数据错乱
  cancelAllPending()

  // 设置页面标题（取 titles 数组最后一项，i18n key 需翻译）
  const pageTitleKey = to.meta?.titles?.[to.meta.titles.length - 1]
  const pageTitle = pageTitleKey ? i18n.t(pageTitleKey) : ''
  const systemName = i18n.t('common.systemName')
  document.title = pageTitle ? `${pageTitle} - ${systemName}` : systemName

  // ========== 授权检查（优先于登录检查） ==========
  // 授权导入页本身放行
  if (to.path === ROUTE_PATHS.LICENSE_IMPORT) {
    return next()
  }

  // 检查授权状态，失效则跳授权导入页
  const valid = await checkLicense()
  if (!valid) {
    return next(ROUTE_PATHS.LICENSE_IMPORT)
  }


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

  // 角色校验：路由配置了 meta.roles 时，检查当前用户角色
  function checkRouteRoles(route) {
    const requiredRoles = route.meta?.roles
    if (!requiredRoles || requiredRoles.length === 0) return true
    const userRole = store.state.user.userInfo?.role
    return requiredRoles.includes(userRole)
  }

  // 已生成动态路由，直接放行（用 routesGenerated 标志，避免空菜单死循环）
  if (store.state.permission.routesGenerated) {
    if (!checkRouteRoles(to)) {
      return next(ROUTE_PATHS.FORBIDDEN)
    }
    return next()
  }

  // 首次进入：获取用户信息 + 动态路由
  try {
    // 1. 获取用户信息（含角色）
    await store.dispatch('user/getUserInfo')

    // 2. 加载系统配置（含默认语言等）
    try {
      const configs = await loadConfig()
      // 如果用户没有手动设置过语言，应用系统默认语言
      if (configs.defaultLanguage) {
        applySystemDefaultLanguage(configs.defaultLanguage)
      }
    } catch (configErr) {
      // eslint-disable-next-line no-console
      console.error('[路由守卫] 加载系统配置失败:', configErr)
    }

    // 3. 建立 WebSocket 连接（实时通知推送）
    const userId = store.state.user.userInfo?.id
    if (userId) {
      ws.connect(userId)
    }

    // 4. 获取菜单并生成动态路由
    const accessRoutes = await store.dispatch('permission/generateRoutes')
    accessRoutes.forEach(route => {
      router.addRoute('Layout', route)
    })

    // 3. addRoute 后必须 next({ ...to, replace: true }) 重新匹配
    // 角色校验：首次进入时也检查目标路由权限
    if (!checkRouteRoles(to)) {
      return next(ROUTE_PATHS.FORBIDDEN)
    }
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
