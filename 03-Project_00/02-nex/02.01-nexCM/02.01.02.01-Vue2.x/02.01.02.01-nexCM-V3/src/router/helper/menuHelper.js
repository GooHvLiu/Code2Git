/**
 * 后端原始菜单数组 → 递归转换为侧边栏可用菜单结构（支持无限层级）
 * 所有菜单（包括网站首页、系统设置）都从数据库获取，不再硬编码
 * 只渲染 type='menu'（目录/菜单），过滤掉 type='button'（按钮）和 type='param'（参数）
 * 使用 resolveMenuTitle 统一处理国际化（与侧边栏、面包屑、标签页保持一致）
 * @param {Array} serverMenuArr 后端返回 raw menu data
 * @returns {Array}
 */
import { resolveMenuTitle } from './menuTitle'

export function formatMenu(serverMenuArr) {
  /**
   * 判断节点是否为可见菜单（目录或菜单，非按钮/参数）
   * @param {Object} item 菜单节点
   * @returns {boolean}
   */
  function isVisibleMenu(item) {
    // type 可能在顶层，也可能在 meta 里
    const type = item.type ?? item.meta?.type
    // 未设置 type 时默认可见（兼容旧数据）
    if (type === undefined || type === null) return true
    // 只显示 menu（目录/菜单），过滤 button（按钮）和 param（参数）
    return type === 'menu'
  }

  /**
   * 递归转换菜单节点
   * @param {Array} list 待处理菜单数组
   * @param {string} parentPath 父级路径
   * @returns {Array}
   */
  function transformMenu(list, parentPath = '') {
    if (!Array.isArray(list)) return []

    return list
      .filter(isVisibleMenu)
      .map(item => {
        const currentPath = `${parentPath}/${item.path}`.replace(/\/+/g, '/')
        const menuNode = {
          title: resolveMenuTitle(item.meta?.title || ''),
          path: currentPath,
          icon: item.meta?.icon || ''
        }

        // 存在合法子菜单，递归处理
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          const children = transformMenu(item.children, currentPath)
          if (children.length > 0) {
            menuNode.children = children
          }
        }
        return menuNode
      })
  }

  // 转换后端菜单（所有菜单都从数据库获取）
  return transformMenu(serverMenuArr)
}

/**
 * 扁平化菜单树（用于菜单搜索）
 * 同时返回一级菜单和二级菜单：
 *   - 一级菜单（有子菜单）：有图标，path 指向第一个子菜单（避免点击 404）
 *   - 二级菜单（无子菜单）：无图标，path 为自身路径
 * @param {Array} menuTree 菜单树（formatMenu 的返回值）
 * @returns {Array} 扁平化后的菜单数组 [{ title, path, icon, parentTitle, isTopLevel }]
 */
export function flattenMenu(menuTree) {
  const result = []

  /** 获取第一个叶子节点的 path（用于一级菜单跳转） */
  function getFirstLeafPath(node) {
    if (!node.children || node.children.length === 0) return node.path
    return getFirstLeafPath(node.children[0])
  }

  function flatten(list, parentTitle = '') {
    if (!Array.isArray(list)) return
    list.forEach(item => {
      const hasChildren = item.children && item.children.length > 0

      if (hasChildren) {
        // 一级菜单：有图标，path 指向第一个子菜单
        result.push({
          title: item.title,
          path: getFirstLeafPath(item),
          icon: item.icon || '',
          parentTitle: '',
          isTopLevel: true
        })
        // 递归处理子菜单
        flatten(item.children, item.title)
      } else if (item.title && item.path) {
        // 二级菜单：无图标
        result.push({
          title: item.title,
          path: item.path,
          icon: '',
          parentTitle,
          isTopLevel: false
        })
      }
    })
  }

  flatten(menuTree)
  return result
}

export default {
  formatMenu,
  flattenMenu
}
