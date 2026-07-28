/**
 * 后端原始菜单 → 递归构建动态路由（支持无限层级）
 * @param {Array} serverMenuList 后端返回原始菜单数组
 * @returns {Array} 路由children数组
 */
export function buildDynamicRoutes(serverMenuList) {
  // 创建空数组用于通过 解构 叠加
  let resultRoutes = []
  /**
   * 递归遍历菜单
   * @param {Array} list 当前菜单数组
   * @param {string} parentPath 父路径
   * @param {string[]} titleStack 标题栈【沿途收集各级标题】
   */
  function travelMenu(list, parentPath = '', titleStack = []) {
    if (!Array.isArray(list)) return;
    list.forEach(item => {
      // 把当前层级标题压入栈
      const currentStack = [...titleStack, item.meta?.title || ''];
      const currentPath = parentPath ? `${parentPath}/${item.path}` : item.path;
      // 判断是否是页面（存在子菜单说明是目录，不生成路由；无children代表页面）
      if (!item.children || item.children.length === 0) {
        resultRoutes.push({
          name: currentPath.replace(/\//g, '_'),
          path: currentPath,
          component: () => import(`@/pages${parentPath}/User${item.name}.vue`),
          meta: {
            titles: currentStack
          }
        });
      } else {
        // 有子目录，继续递归
        travelMenu(item.children, currentPath, currentStack);
      }
    });
  }
  travelMenu(serverMenuList);
  return resultRoutes;
}