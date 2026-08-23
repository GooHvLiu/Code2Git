/**
 * ==========================================
 * 动态路由构建工具
 * ==========================================
 * 后端原始菜单 → 递归构建动态路由（支持无限层级）
 *
 * 约定：
 * - 有 children 的是目录，不生成路由
 * - 无 children 的是页面
 * - 组件加载优先级：item.component（映射表） > @/views/{path}/index.vue（动态 import）
 * - meta.titles 为面包屑层级数组
 */
import componentsMap from './componentsMap'

/**
 * 递归构建动态路由
 * @param {Array} serverMenuList 后端返回的菜单数组
 * @returns {Array} 动态路由数组
 */
export function buildDynamicRoutes(serverMenuList) {
  const resultRoutes = []

  /**
   * 递归遍历菜单
   * @param {Array} list 当前菜单数组
   * @param {string} parentPath 父级路径
   * @param {string[]} titleStack 标题栈（收集各级标题）
   */
  function travelMenu(list, parentPath = '', titleStack = []) {
    if (!Array.isArray(list)) return

    list.forEach(item => {
      const currentStack = [...titleStack, item.meta?.title || '']
      const currentPath = parentPath ? `${parentPath}/${item.path}` : item.path

      // 无 children 代表是页面，生成路由
      if (!item.children || item.children.length === 0) {
        // 组件加载：优先从映射表查找，否则回退到动态 import
        let component
        if (item.component && componentsMap[item.component]) {
          component = componentsMap[item.component]
        } else {
          component = () => import(`@/views${currentPath}/index.vue`)
        }

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
        // 有子菜单，继续递归
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
