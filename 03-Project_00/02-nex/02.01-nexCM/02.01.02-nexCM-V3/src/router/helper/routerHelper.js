/**
 * ==========================================
 * 动态路由构建工具
 * ==========================================
 * 后端原始菜单 → 递归构建动态路由（支持无限层级）
 *
 * 约定：
 * - 有 children 的是目录，不生成路由
 * - 无 children 的是页面
 * - 组件加载唯一途径：后端数据库的 component 字段
 * - 如果 component 字段为 null 或空，不生成路由，并在控制台打印警告
 * - meta.titles 为面包屑层级数组
 */

// 使用 require.context 预加载所有视图组件，避免动态 import 路径解析问题
const modules = require.context('@/views', true, /\.vue$/)
const componentMap = {}
modules.keys().forEach(key => {
  // 去掉开头的 './' 和结尾的 '.vue'
  const componentPath = key.replace(/^\.\//, '').replace(/\.vue$/, '')
  componentMap[componentPath] = modules(key)
})

/**
 * 递归构建动态路由
 * @param {Array} serverMenuList 后端返回的菜单数组
 * @returns {Array} 动态路由数组
 */
export function buildDynamicRoutes(serverMenuList) {
  const resultRoutes = []

  /**
   * 判断节点是否为可路由菜单（目录或菜单，非按钮/参数）
   * @param {Object} item 菜单节点
   * @returns {boolean}
   */
  function isRoutableMenu(item) {
    // type 可能在顶层，也可能在 meta 里
    const type = item.type ?? item.meta?.type
    // 未设置 type 时默认可路由（兼容旧数据）
    if (type === undefined || type === null) return true
    // 只处理 menu（目录/菜单），过滤 button（按钮）和 param（参数）
    return type === 'menu'
  }

  /**
   * 获取第一个叶子节点的完整路径（用于父菜单重定向）
   * @param {Object} menu 菜单节点
   * @param {string} parentPath 父级路径
   * @returns {string} 第一个叶子节点的完整路径
   */
  function getFirstLeafPath(menu, parentPath = '') {
    const currentPath = parentPath ? `${parentPath}/${menu.path}` : menu.path
    if (!menu.children || menu.children.length === 0) {
      return currentPath
    }
    // 只在可路由的子菜单中找第一个叶子节点
    const routableChildren = menu.children.filter(isRoutableMenu)
    if (routableChildren.length === 0) {
      return currentPath
    }
    return getFirstLeafPath(routableChildren[0], currentPath)
  }

  /**
   * 递归遍历菜单
   * @param {Array} list 当前菜单数组
   * @param {string} parentPath 父级路径
   * @param {string[]} titleStack 标题栈（收集各级标题）
   */
  function travelMenu(list, parentPath = '', titleStack = []) {
    if (!Array.isArray(list)) return

    // 先过滤掉按钮和参数权限
    const routableList = list.filter(isRoutableMenu)

    routableList.forEach(item => {
      const currentStack = [...titleStack, item.meta?.title || '']
      const currentPath = parentPath ? `${parentPath}/${item.path}` : item.path

      // 关键：先过滤掉按钮和参数，只保留可路由的子菜单
      const routableChildren = (item.children || []).filter(isRoutableMenu)

      // 过滤后无子菜单 → 当作页面路由
      if (routableChildren.length === 0) {
        // 组件加载唯一途径：后端数据库的 component 字段
        const componentPath = item.component

        // 如果 component 字段为 null 或空，不生成路由，并在控制台打印警告
        if (!componentPath || componentPath.trim() === '') {
          // eslint-disable-next-line no-console
          console.warn(`[路由构建] 菜单 "${item.meta?.title || currentPath}" 的 component 字段为空，跳过该路由`)
          return
        }

        // 从预加载的组件映射表中查找组件
        const componentModule = componentMap[componentPath]
        if (!componentModule) {
          // eslint-disable-next-line no-console
          console.error(`[路由构建] 菜单 "${item.meta?.title || currentPath}" 的组件路径 "${componentPath}" 不存在，请检查数据库配置`)
          return
        }

        // 使用预加载的组件
        const component = componentModule.default || componentModule

        resultRoutes.push({
          name: currentPath.replace(/\//g, '_'),
          path: currentPath,
          component,
          meta: {
            titles: currentStack,
            // 透传后端配置的 noCache（是否不缓存）
            noCache: item.meta?.noCache || false
          }
        })
      } else {
        // 有可路由子菜单 → 生成父路由（重定向到第一个子页面），再递归处理子菜单
        const firstLeafPath = getFirstLeafPath(item, parentPath)
        resultRoutes.push({
          name: currentPath.replace(/\//g, '_'),
          path: currentPath,
          redirect: firstLeafPath,
          meta: {
            titles: currentStack,
            noCache: item.meta?.noCache || false
          }
        })
        // 递归处理子菜单
        travelMenu(item.children, currentPath, currentStack)
      }
    })
  }

  travelMenu(serverMenuList)
  return resultRoutes
}

/**
 * 根据用户角色过滤路由
 * 后端菜单返回 meta.roles 时，只保留用户拥有的角色对应的路由
 * 未配置 meta.roles 的路由默认所有人可见
 *
 * @param {Array} routes 动态路由数组
 * @param {Array} userRoles 当前用户角色列表，如 ['admin', 'engineer']
 * @returns {Array} 过滤后的路由数组
 */
export function filterRoutesByRoles(routes, userRoles) {
  if (!Array.isArray(routes) || routes.length === 0) return []
  // 未传入角色或角色为空，不过滤
  if (!Array.isArray(userRoles) || userRoles.length === 0) return routes

  return routes.filter(route => {
    const routeRoles = route.meta?.roles
    // 未配置角色限制，所有人可见
    if (!routeRoles || routeRoles.length === 0) return true
    // 检查用户角色是否有交集
    return routeRoles.some(role => userRoles.includes(role))
  })
}
