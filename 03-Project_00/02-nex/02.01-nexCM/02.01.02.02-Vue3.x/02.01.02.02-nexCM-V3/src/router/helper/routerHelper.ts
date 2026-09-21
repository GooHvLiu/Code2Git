/**
 * ==========================================
 * 动态路由构建工具
 * ==========================================
 * Vite 用 import.meta.glob 替代 webpack 的 require.context
 */
import type { RouteRecordRaw } from 'vue-router'
import type { RawMenuItem } from '@/types/router'

// 预加载所有 views 下的 .vue 组件（Eager 同步加载，与原 require.context 行为一致）
const modules = import.meta.glob('@/views/**/*.vue', { eager: true })
const componentMap: Record<string, unknown> = {}
Object.keys(modules).forEach(key => {
  // '@/views/system/user/index.vue' → 'system/user/index'
  const componentPath = key.replace(/^\/src\/views\//, '').replace(/\.vue$/, '')
  componentMap[componentPath] = (modules[key] as { default?: unknown }).default || modules[key]
})

function isRoutableMenu(item: RawMenuItem): boolean {
  const type = item.type ?? item.meta?.type
  if (type === undefined || type === null) return true
  return type === 'menu'
}

function getFirstLeafPath(menu: RawMenuItem, parentPath = ''): string {
  const currentPath = parentPath ? `${parentPath}/${menu.path}` : menu.path
  if (!menu.children || menu.children.length === 0) return currentPath
  const routableChildren = menu.children.filter(isRoutableMenu)
  if (routableChildren.length === 0) return currentPath
  return getFirstLeafPath(routableChildren[0], currentPath)
}

export function buildDynamicRoutes(serverMenuList: RawMenuItem[] | undefined): RouteRecordRaw[] {
  const resultRoutes: RouteRecordRaw[] = []
  const list = serverMenuList || []

  function travelMenu(list: RawMenuItem[], parentPath = '', titleStack: string[] = []): void {
    if (!Array.isArray(list)) return
    const routableList = list.filter(isRoutableMenu)
    routableList.forEach(item => {
      const currentStack = [...titleStack, item.meta?.title || '']
      const currentPath = parentPath ? `${parentPath}/${item.path}` : item.path
      const routableChildren = (item.children || []).filter(isRoutableMenu)

      if (routableChildren.length === 0) {
        const componentPath = item.component
        if (!componentPath || componentPath.trim() === '') {
          console.warn(`[路由构建] 菜单 "${item.meta?.title || currentPath}" 的 component 字段为空，跳过`)
          return
        }
        const componentModule = componentMap[componentPath]
        if (!componentModule) {
          console.error(`[路由构建] 组件路径 "${componentPath}" 不存在，请检查数据库配置`)
          return
        }
        resultRoutes.push({
          name: currentPath.replace(/\//g, '_'),
          path: currentPath,
          component: componentModule,
          meta: { titles: currentStack, noCache: item.meta?.noCache || false }
        } as RouteRecordRaw)
      } else {
        const firstLeafPath = getFirstLeafPath(item, parentPath)
        resultRoutes.push({
          name: currentPath.replace(/\//g, '_'),
          path: currentPath,
          redirect: firstLeafPath,
          meta: { titles: currentStack, noCache: item.meta?.noCache || false }
        } as RouteRecordRaw)
        travelMenu(item.children || [], currentPath, currentStack)
      }
    })
  }

  travelMenu(list)
  return resultRoutes
}

export function filterRoutesByRoles(routes: RouteRecordRaw[], userRoles: string[]): RouteRecordRaw[] {
  if (!Array.isArray(routes) || routes.length === 0) return []
  if (!Array.isArray(userRoles) || userRoles.length === 0) return routes
  return routes.filter(route => {
    const routeRoles = route.meta?.roles as string[] | undefined
    if (!routeRoles || routeRoles.length === 0) return true
    return routeRoles.some(role => userRoles.includes(role))
  })
}
