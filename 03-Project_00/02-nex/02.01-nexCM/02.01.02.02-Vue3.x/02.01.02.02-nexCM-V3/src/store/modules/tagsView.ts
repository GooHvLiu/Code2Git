/**
 * ==========================================
 * TagsView Store - 标签页状态
 * ==========================================
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { setSessionStorage, getSessionStorage } from '@/utils/data/storage'
import { SESSIONSTORAGE_KEYS } from '@/utils/data/storageKey'
import { HOME_TAG, ROUTE_PATHS } from '@/router/constant/pathConstants'

export interface VisitedView {
  name?: string | null
  path: string
  title: string
  fullPath?: string
}

function getHomeTag(): VisitedView {
  // 仅存 i18n key，显示层响应式翻译，切换语言后标签标题自动更新
  return { ...HOME_TAG, title: HOME_TAG.title }
}

function getValidVisitedViews(): VisitedView[] {
  const saved = getSessionStorage<VisitedView[]>(SESSIONSTORAGE_KEYS.TAG_LIST)
  if (!Array.isArray(saved)) return [getHomeTag()]
  const invalidPaths: string[] = [
    ROUTE_PATHS.LOGIN, ROUTE_PATHS.NOT_FOUND, ROUTE_PATHS.FORBIDDEN, ROUTE_PATHS.REDIRECT, ROUTE_PATHS.LICENSE_IMPORT
  ]
  const invalidTitles = ['欢迎登录', 'layout.login.title']
  const filtered = saved.filter(v => {
    if (invalidPaths.includes(v.path)) return false
    if (typeof v.title !== 'string') return false
    if (invalidTitles.some(t => v.title.includes(t))) return false
    return true
  })
  if (!filtered.some(v => v.path === HOME_TAG.path)) filtered.unshift(getHomeTag())
  return filtered
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<VisitedView[]>(getValidVisitedViews())
  const cachedViews = ref<string[]>([])

  function persist(): void {
    setSessionStorage(SESSIONSTORAGE_KEYS.TAG_LIST, visitedViews.value)
  }

  function addView(view: RouteLocationNormalized): void {
    const isHiddenRoute = view.meta?.hidden === true
    if (isHiddenRoute) return
    const invalidPaths: string[] = [
      ROUTE_PATHS.LOGIN, ROUTE_PATHS.NOT_FOUND, ROUTE_PATHS.FORBIDDEN, ROUTE_PATHS.REDIRECT, ROUTE_PATHS.LICENSE_IMPORT
    ]
    if (invalidPaths.includes(view.path)) return
    if (visitedViews.value.some(v => v.path === view.path)) {
      addCachedView(view)
      return
    }
    // 仅存储 i18n key（语言无关），显示层通过 t() 响应式翻译，切换语言后标签自动更新
    const rawTitle = view.meta?.titles?.[view.meta.titles.length - 1] || view.meta?.title || 'no-name'
    visitedViews.value.push({
      name: (view.name as string) || null,
      path: view.path,
      title: rawTitle as string,
      fullPath: view.fullPath
    })
    addCachedView(view)
    persist()
  }

  function addCachedView(view: RouteLocationNormalized): void {
    const name = (view.name as string) || ''
    if (!name || cachedViews.value.includes(name)) return
    if (!view.meta?.noCache) cachedViews.value.push(name)
  }

  function delView(view: VisitedView): VisitedView[] {
    visitedViews.value = visitedViews.value.filter(v => v.path !== view.path)
    delCachedView(view)
    persist()
    return visitedViews.value
  }

  function delCachedView(view: VisitedView): void {
    if (view.name) cachedViews.value = cachedViews.value.filter(name => name !== view.name)
  }

  function delOthersViews(view: VisitedView): VisitedView[] {
    visitedViews.value = visitedViews.value.filter(v => v.path === view.path || v.path === HOME_TAG.path)
    cachedViews.value = cachedViews.value.filter(name => name === view.name || name === 'Home')
    persist()
    return visitedViews.value
  }

  function delAllViews(): VisitedView[] {
    visitedViews.value = [getHomeTag()]
    cachedViews.value = ['Home']
    persist()
    return visitedViews.value
  }

  function delLeftViews(view: VisitedView): VisitedView[] {
    const targetIndex = visitedViews.value.findIndex(v => v.path === view.path)
    if (targetIndex <= 1) return visitedViews.value
    visitedViews.value = visitedViews.value.filter((v, index) => index === 0 || index >= targetIndex)
    persist()
    return visitedViews.value
  }

  function delRightViews(view: VisitedView): VisitedView[] {
    const targetIndex = visitedViews.value.findIndex(v => v.path === view.path)
    if (targetIndex === -1 || targetIndex === visitedViews.value.length - 1) return visitedViews.value
    visitedViews.value = visitedViews.value.slice(0, targetIndex + 1)
    persist()
    return visitedViews.value
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    delView,
    delOthersViews,
    delAllViews,
    delLeftViews,
    delRightViews
  }
})
