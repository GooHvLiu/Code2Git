/**
 * 后端原始菜单 → 构建vue-router标准路由配置
 * @param {Array} serverMenuList 后端返回原始菜单数组
 * @returns {Array} 路由children数组
 */
export function buildDynamicRoutes(serverMenuList) {
  // 创建空数组用于通过 解构 叠加
  let routeMenuList = []
  // 一共多层数组，对数组进行遍历
  serverMenuList.forEach(item => {
    // 对每个数组中的 children 单位内容进行遍历
    let ret = item.children.map(childrenItem => {
      // 将拼接好的对象返回
      return {
        name: item.path + "_" + childrenItem.name,
        path: item.path + "/" + childrenItem.path,
        component: () => import(`@/pages${item.path}/User${childrenItem.name}.vue`)
      };
    })
    // 每次循环在 routeMenuList 基础上叠加
    routeMenuList = [...routeMenuList, ...ret]
    // 将解构完整的数组返回
    return routeMenuList;
  })
  // 将服务器数组通过循环解构返回给调用函数
  return routeMenuList;
}