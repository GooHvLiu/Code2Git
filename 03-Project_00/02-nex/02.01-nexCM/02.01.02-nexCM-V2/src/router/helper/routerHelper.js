/**
 * ==========================================
 * 动态路由构建工具
 * ==========================================
 * 后端原始菜单 → 递归构建动态路由（支持无限层级）
 *
 * 约定：
 * - 有 children 的是目录，不生成路由
 * - 无 children 的是页面，组件路径为 @/views/{parentPath}/{name}/index.vue
 * - meta.titles 为面包屑层级数组
 */

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
        resultRoutes.push({
          name: currentPath.replace(/\//g, '_'),
          path: currentPath,
          component: () => import(`@/views${currentPath}/index.vue`),
          meta: {
            titles: currentStack
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
