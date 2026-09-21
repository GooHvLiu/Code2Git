/**
 * ==========================================
 * 后端菜单 → 侧边栏菜单结构
 * ==========================================
 */
import { resolveMenuTitle } from './menuTitle'
import type { RawMenuItem, SidebarMenu, FlatMenuItem } from '@/types/router'

function isVisibleMenu(item: RawMenuItem): boolean {
  const type = item.type ?? item.meta?.type
  if (type === undefined || type === null) return true
  return type === 'menu'
}

function transformMenu(list: RawMenuItem[], parentPath = ''): SidebarMenu[] {
  if (!Array.isArray(list)) return []
  return list
    .filter(isVisibleMenu)
    .map(item => {
      const currentPath = `${parentPath}/${item.path}`.replace(/\/+/g, '/')
      const menuNode: SidebarMenu = {
        title: resolveMenuTitle(item.meta?.title || ''),
        path: currentPath,
        icon: item.meta?.icon || ''
      }
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        const children = transformMenu(item.children, currentPath)
        if (children.length > 0) menuNode.children = children
      }
      return menuNode
    })
}

export function formatMenu(serverMenuArr: RawMenuItem[]): SidebarMenu[] {
  return transformMenu(serverMenuArr)
}

function getFirstLeafPath(node: SidebarMenu): string {
  if (!node.children || node.children.length === 0) return node.path
  return getFirstLeafPath(node.children[0])
}

export function flattenMenu(menuTree: SidebarMenu[]): FlatMenuItem[] {
  const result: FlatMenuItem[] = []
  function flatten(list: SidebarMenu[], parentTitle = ''): void {
    if (!Array.isArray(list)) return
    list.forEach(item => {
      const hasChildren = item.children && item.children.length > 0
      if (hasChildren) {
        result.push({ title: item.title, path: getFirstLeafPath(item), icon: item.icon, parentTitle: '', isTopLevel: true })
        flatten(item.children as SidebarMenu[], item.title)
      } else if (item.title && item.path) {
        result.push({ title: item.title, path: item.path, icon: '', parentTitle, isTopLevel: false })
      }
    })
  }
  flatten(menuTree)
  return result
}

export default { formatMenu, flattenMenu }
