/**
 * ==========================================
 * Permission Store - 路由权限与菜单
 * ==========================================
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router/constant/constantRoutes'
import { requestGetUserMenuApi, getMenuVersionApi } from '@/api'
import { formatMenu } from '@/router/helper/menuHelper'
import { buildDynamicRoutes, filterRoutesByRoles } from '@/router/helper/routerHelper'
import { CODE_MENU_NOT_MODIFIED } from '@/utils/config/constants'
import i18n from '@/i18n'
import type { RawMenuItem, SidebarMenu } from '@/types/router'
import { useUserStore } from './user'

const MENU_VERSION_KEY = 'nex_menu_version'

function getMenuCacheKey(lang: string): string {
  return `nex_menu_cache_${lang}`
}

function extractMenu(res: { data?: unknown }): RawMenuItem[] {
  const data = res?.data as { menu?: RawMenuItem[] } | RawMenuItem[] | undefined
  if (Array.isArray(data)) return data
  return Array.isArray((data as { menu?: RawMenuItem[] })?.menu) ? (data as { menu: RawMenuItem[] }).menu : []
}

function getCachedMenu(lang: string): RawMenuItem[] | null {
  try {
    const raw = localStorage.getItem(getMenuCacheKey(lang))
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && !Array.isArray(parsed)) {
      localStorage.removeItem(getMenuCacheKey(lang))
      return null
    }
    return parsed as RawMenuItem[] | null
  } catch {
    localStorage.removeItem(getMenuCacheKey(lang))
    return null
  }
}

export const usePermissionStore = defineStore('permission', () => {
  const userMenu = ref<SidebarMenu[]>([])
  const routes = ref<RouteRecordRaw[]>([...constantRoutes])
  const menuVersion = ref<string | number | null>(null)
  const routesGenerated = ref(false)

  function setMenu(menu: SidebarMenu[]): void {
    userMenu.value = menu
  }

  function setMenuVersion(v: string | number | null): void {
    menuVersion.value = v
  }

  function setRoutes(r: RouteRecordRaw[]): void {
    routes.value = constantRoutes.concat(r)
  }

  function setRoutesGenerated(val: boolean): void {
    routesGenerated.value = val
  }

  async function generateRoutes(): Promise<RouteRecordRaw[]> {
    const lang = i18n.global.locale.value
    const cachedMenu = getCachedMenu(lang)
    const cachedVersion = localStorage.getItem(MENU_VERSION_KEY)
    let menuTree: RawMenuItem[] = []
    let newVersion: string | number | null = cachedVersion

    try {
      const versionRes = await getMenuVersionApi()
      const latestVersion = (versionRes.data as { version?: string | number })?.version || null
      if (
        cachedMenu &&
        cachedMenu.length > 0 &&
        cachedVersion &&
        latestVersion &&
        String(cachedVersion) === String(latestVersion)
      ) {
        menuTree = cachedMenu
        newVersion = latestVersion
      } else {
        const res = await requestGetUserMenuApi(
          cachedMenu && cachedMenu.length > 0 && latestVersion != null ? String(latestVersion) : null,
          lang
        )
        if (res.code === CODE_MENU_NOT_MODIFIED) {
          menuTree = cachedMenu || []
          newVersion = latestVersion
        } else {
          menuTree = extractMenu(res as { data?: unknown })
          newVersion = (res.data as { version?: string | number })?.version || latestVersion
          localStorage.setItem(getMenuCacheKey(lang), JSON.stringify(menuTree))
          localStorage.setItem(MENU_VERSION_KEY, String(newVersion))
        }
      }
    } catch {
      const res = await requestGetUserMenuApi(null, lang)
      menuTree = extractMenu(res as { data?: unknown })
      newVersion = (res.data as { version?: string | number })?.version || null
      if (menuTree.length) {
        localStorage.setItem(getMenuCacheKey(lang), JSON.stringify(menuTree))
        localStorage.setItem(MENU_VERSION_KEY, String(newVersion))
      }
    }

    const formattedMenu = formatMenu(menuTree)
    setMenu(formattedMenu)
    setMenuVersion(newVersion)
    const userStore = useUserStore()
    let built = buildDynamicRoutes(menuTree)
    built = filterRoutesByRoles(built, userStore.roles)
    setRoutes(built)
    setRoutesGenerated(true)
    return built
  }

  async function refreshMenu(): Promise<RouteRecordRaw[]> {
    Object.keys(localStorage)
      .filter(key => key.startsWith('nex_menu_cache_'))
      .forEach(key => localStorage.removeItem(key))
    localStorage.removeItem(MENU_VERSION_KEY)
    setRoutesGenerated(false)
    return generateRoutes()
  }

  return {
    userMenu,
    routes,
    menuVersion,
    routesGenerated,
    setMenu,
    setMenuVersion,
    setRoutes,
    setRoutesGenerated,
    generateRoutes,
    refreshMenu
  }
})
