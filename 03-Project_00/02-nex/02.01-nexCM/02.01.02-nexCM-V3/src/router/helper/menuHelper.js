import { HOME_TAG } from '@/router/constant/pathConstants'
import i18n from '@/i18n'
import { hasRole } from '@/utils/permission'

/**
 * 后端原始菜单数组 → 递归转换为侧边栏可用菜单结构（支持无限层级）
 * @param {Array} serverMenuArr 后端返回 raw menu data
 * @returns {Array}
 */
export function formatMenu(serverMenuArr) {
  // 基础首页数据，无需从服务器获取（标题国际化）
  const baseMenu = [
    {
      title: i18n.t('layout.home'),
      path: HOME_TAG.path,
      icon: HOME_TAG.icon,
      children: [
        { title: i18n.t('layout.homeOverview'), path: '/home/overview' },
        { title: i18n.t('layout.homeDashboard'), path: '/home/dashboard' },
        { title: i18n.t('layout.homeData'), path: '/home/data' },
      ]
    },
  ]

  /**
   * 递归转换菜单节点
   * @param {Array} list 待处理菜单数组
   * @param {string} parentPath 父级路径
   * @returns {Array}
   */
  function transformMenu(list, parentPath = '') {
    if (!Array.isArray(list)) return []

    return list.map(item => {
      const currentPath = `${parentPath}/${item.path}`.replace(/\/+/g, '/')
      const menuNode = {
        title: item.meta?.title || '',
        path: currentPath,
        icon: item.meta?.icon || ''
      }

      // 存在合法子菜单，递归处理
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        menuNode.children = transformMenu(item.children, currentPath)
      }
      return menuNode
    })
  }

  // 转换后端菜单
  const transformedMenu = transformMenu(serverMenuArr)

  // 系统设置子菜单（根据角色过滤）
  // 注意：通知中心已移至 Navbar 铃铛图标，不在侧边栏菜单中显示
  // 权限：数据字典/角色管理/部门管理/用户管理 仅管理员可见，审计追踪所有人可见
  // 二级菜单不显示图标
  const isAdmin = hasRole('administrator')
  const systemChildren = [
    // 仅管理员可见的菜单
    ...(isAdmin ? [
      { title: i18n.t('layout.dictManagement'), path: '/system/dict' },
      { title: i18n.t('layout.roleManagement'), path: '/system/role' },
      { title: i18n.t('layout.deptManagement'), path: '/system/dept' },
      { title: i18n.t('layout.userManagement'), path: '/system/user' }
    ] : []),
    // 审计追踪：所有人可见（非管理员只看自己的数据）
    { title: i18n.t('layout.auditLog'), path: '/system/audit' },
    // 参数配置：所有人可见
    { title: i18n.t('layout.systemConfig'), path: '/system/config' }
  ]

  // 系统设置菜单（国际化标题）
  const systemSettings = {
    title: i18n.t('layout.systemSettings'),
    path: '/system',
    icon: 'systemSetting',
    children: systemChildren
  }

  // 拼接：首页 + 业务菜单 + 系统设置
  return [...baseMenu, ...transformedMenu, systemSettings]
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
