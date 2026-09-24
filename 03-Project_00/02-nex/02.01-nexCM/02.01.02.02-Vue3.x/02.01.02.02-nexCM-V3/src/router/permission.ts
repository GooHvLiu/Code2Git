/**
 * ==========================================
 * 全局路由守卫
 * ==========================================
 * 登录拦截、用户信息获取、动态路由挂载
 */
import router from '@/router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { ROUTE_WHITE_LIST } from './constant/constants'
import { ROUTE_PATHS, CATCH_ALL_ROUTE_NAME } from './constant/pathConstants'
import { layoutChildRoutes } from './constant/constantRoutes'
import { getToken } from '@/utils/auth/auth'
import { cancelAllPending } from '@/utils/request/request'
import { checkLicense, resetLicenseCache } from '@/utils/auth/licenseGuard'
import ws from '@/utils/request/websocket'
import i18n, { applySystemDefaultLanguage } from '@/i18n'
import { resolveMenuTitle } from './helper/menuTitle'
import { loadConfig } from '@/utils/config/config'
import { isSuperAdmin } from '@/utils/auth/permission'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { RouteLocationNormalized } from 'vue-router'
import { watch } from 'vue'

NProgress.configure({ showSpinner: false })

const whiteList = ROUTE_WHITE_LIST || [ROUTE_PATHS.LOGIN]

// 授权校验与缓存统一收敛到 utils/auth/licenseGuard；透出 resetLicenseCache 兼容既有引用
export { resetLicenseCache }

/**
 * 按指定路由与 locale 重算并设置 document.title。
 * 路由守卫首屏/切路由时传入 to；locale 变化（无导航）时不传参，用当前路由。
 */
function updateDocumentTitle(route?: RouteLocationNormalized): void {
  const target = route || router.currentRoute.value
  const titles = target.meta?.titles as string[] | undefined
  const pageTitleKey = titles?.[titles.length - 1]
  const pageTitle = resolveMenuTitle(pageTitleKey as string)
  const systemName = i18n.global.t('common.systemName') as string
  document.title = pageTitle ? `${pageTitle} - ${systemName}` : systemName
}

/** locale 切换（不经导航）时同步标题 */
watch(
  () => (i18n.global.locale as { value: string }).value,
  () => {
    updateDocumentTitle()
  }
)

function checkRouteRoles(to: RouteLocationNormalized, roles: string[]): boolean {
  const requiredRoles = to.meta?.roles as string[] | undefined
  if (!requiredRoles || requiredRoles.length === 0) return true
  return requiredRoles.some(r => roles.includes(r))
}

function checkSuperPanelAccess(to: RouteLocationNormalized): boolean {
  if (to.path && to.path.startsWith('/super-panel')) return isSuperAdmin()
  return true
}

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  cancelAllPending()

  updateDocumentTitle(to)

  if (to.path === ROUTE_PATHS.LICENSE_IMPORT) return next()

  const valid = await checkLicense()
  if (!valid) return next(ROUTE_PATHS.LICENSE_IMPORT)

  const hasToken = getToken()
  if (!hasToken) {
    if (whiteList.includes(to.path)) return next()
    return next(`${ROUTE_PATHS.LOGIN}?redirect=${to.path}`)
  }

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (to.path === ROUTE_PATHS.LOGIN) return next(ROUTE_PATHS.ROOT)

  if (permissionStore.routesGenerated) {
    if (!checkRouteRoles(to, userStore.roles) || !checkSuperPanelAccess(to)) {
      return next(ROUTE_PATHS.FORBIDDEN)
    }
    if (to.path === ROUTE_PATHS.ROOT) return next(ROUTE_PATHS.HOME)
    return next()
  }

  try {
    await userStore.getUserInfo()

    try {
      const configs = await loadConfig()
      if (configs.defaultLanguage) applySystemDefaultLanguage(configs.defaultLanguage)
    } catch (configErr) {
      console.error('[路由守卫] 加载系统配置失败:', configErr)
    }

    const userId = userStore.userInfo?.id
    if (userId !== null && userId !== undefined) ws.connect(userId)

    const accessRoutes = await permissionStore.generateRoutes()
    accessRoutes.forEach(route => {
      router.addRoute('Layout', route)
    })

    // 补挂 Layout 常驻子路由（profile / notification）。
    // Vue Router 4 在批量 addRoute('Layout', ...) 重建 matcher 后，
    // 最初随 constantRoutes 注册的相对路径子路由会从匹配表丢失，需按同名重新补挂。
    layoutChildRoutes.forEach(route => {
      router.addRoute('Layout', route)
    })

    // 404 兜底（Router4 通配符写法）
    // 固定 name：同名 addRoute 会自动替换，避免重复注册；登出 resetRouter() 时也能按 name 移除。
    // 否则无名通配路由会残留，再次登录（页面未刷新）时抢先匹配重放导航，导致首屏误进 404。
    if (router.hasRoute(CATCH_ALL_ROUTE_NAME)) {
      router.removeRoute(CATCH_ALL_ROUTE_NAME)
    }
    router.addRoute({
      name: CATCH_ALL_ROUTE_NAME,
      path: '/:pathMatch(.*)*',
      redirect: ROUTE_PATHS.NOT_FOUND,
      meta: { hidden: true }
    })

    if (!checkRouteRoles(to, userStore.roles) || !checkSuperPanelAccess(to)) {
      return next(ROUTE_PATHS.FORBIDDEN)
    }
    if (to.path === ROUTE_PATHS.ROOT) return next(ROUTE_PATHS.HOME)
    // 按当前完整路径重新导航（而非展开可能已被通配路由匹配、携带 pathMatch 参数的旧 to），
    // 确保动态路由注册后按新路由表干净重解析，避免误落 404。
    next({ path: to.fullPath, replace: true })
  } catch (err) {
    await userStore.logout()
    next(`${ROUTE_PATHS.LOGIN}?redirect=${to.path}`)
  }
})

router.afterEach(() => {
  NProgress.done()
})
