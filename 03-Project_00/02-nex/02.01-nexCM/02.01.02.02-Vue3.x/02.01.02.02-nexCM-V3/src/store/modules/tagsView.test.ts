/**
 * ==========================================
 * store/modules/tagsView.ts 单元测试
 * ==========================================
 * 使用 createPinia + setActivePinia；sessionStorage 用 jsdom 原生实现
 * 覆盖标签增删 / 关闭其他 / 关闭全部 / 缓存视图
 * 作者：GooHv
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTagsViewStore } from './tagsView'
import { HOME_TAG, ROUTE_PATHS } from '@/router/constant/pathConstants'
import type { RouteLocationNormalized } from 'vue-router'

/** 构造一个最小可用的路由对象 */
function makeRoute(path: string, extra: Partial<RouteLocationNormalized> = {}): RouteLocationNormalized {
  return {
    path,
    fullPath: path,
    name: path.replace(/\//g, '') || 'home',
    meta: {},
    query: {},
    params: {},
    hash: '',
    matched: [],
    redirectedFrom: undefined,
    ...extra
  } as unknown as RouteLocationNormalized
}

describe('useTagsViewStore', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('初始仅包含首页标签', () => {
    const store = useTagsViewStore()
    expect(store.visitedViews).toHaveLength(1)
    expect(store.visitedViews[0].path).toBe(HOME_TAG.path)
  })

  it('addView 新增普通标签', () => {
    const store = useTagsViewStore()
    const route = makeRoute('/user/list', {
      name: 'UserList',
      meta: { title: '用户管理' }
    })
    store.addView(route)
    expect(store.visitedViews).toHaveLength(2)
    expect(store.visitedViews[1].path).toBe('/user/list')
    expect(store.cachedViews).toContain('UserList')
  })

  it('addView 跳过 hidden 路由与非法路径', () => {
    const store = useTagsViewStore()
    store.addView(makeRoute('/hidden/page', { meta: { hidden: true, title: 'X' } }))
    store.addView(makeRoute(ROUTE_PATHS.LOGIN, { meta: { title: '登录' } }))
    expect(store.visitedViews).toHaveLength(1)
  })

  it('addView 重复路径不重复入列', () => {
    const store = useTagsViewStore()
    const route = makeRoute('/user/list', { name: 'UserList', meta: { title: '用户' } })
    store.addView(route)
    store.addView(route)
    expect(store.visitedViews).toHaveLength(2)
  })

  it('delView 删除指定标签', () => {
    const store = useTagsViewStore()
    store.addView(makeRoute('/user/list', { name: 'UserList', meta: { title: '用户' } }))
    store.addView(makeRoute('/role/list', { name: 'RoleList', meta: { title: '角色' } }))
    expect(store.visitedViews).toHaveLength(3)
    store.delView({ path: '/user/list', title: '用户', name: 'UserList' })
    expect(store.visitedViews).toHaveLength(2)
    expect(store.visitedViews.find(v => v.path === '/user/list')).toBeUndefined()
  })

  it('delOthersViews 仅保留目标与首页', () => {
    const store = useTagsViewStore()
    store.addView(makeRoute('/a', { name: 'A', meta: { title: 'A' } }))
    store.addView(makeRoute('/b', { name: 'B', meta: { title: 'B' } }))
    store.addView(makeRoute('/c', { name: 'C', meta: { title: 'C' } }))
    store.delOthersViews({ path: '/b', title: 'B', name: 'B' })
    const paths = store.visitedViews.map(v => v.path)
    expect(paths).toContain(HOME_TAG.path)
    expect(paths).toContain('/b')
    expect(paths).not.toContain('/a')
    expect(paths).not.toContain('/c')
  })

  it('delAllViews 恢复为仅首页', () => {
    const store = useTagsViewStore()
    store.addView(makeRoute('/a', { name: 'A', meta: { title: 'A' } }))
    store.addView(makeRoute('/b', { name: 'B', meta: { title: 'B' } }))
    store.delAllViews()
    expect(store.visitedViews).toHaveLength(1)
    expect(store.visitedViews[0].path).toBe(HOME_TAG.path)
  })
})
