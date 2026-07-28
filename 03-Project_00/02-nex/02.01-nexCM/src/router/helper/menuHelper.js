/**
 * 后端原始菜单数组 → 递归转换为侧边栏可用菜单结构（支持无限层级）
 * @param {Array} serverMenuArr 后端返回 raw menu data
 * @returns {Array}
 */
export function formatMenu(serverMenuArr) {
  console.log("@@服务器获取到的菜单@@", serverMenuArr);

  // 基础首页数据，无需从服务器获取
  const baseMenu = [{ title: "网站首页", path: "/", icon: "home" }];

  /**
   * 递归转换菜单节点
   * @param {Array} list 待处理菜单数组
   * @param {string} parentPath 父级路径
   * @returns {Array}
   */
  function transformMenu(list, parentPath = "") {
    if (!Array.isArray(list)) return [];

    return list.map((item) => {
      const currentPath = `${parentPath}/${item.path}`.replace(/\/+/g, "/");
      const menuNode = {
        title: item.meta?.title || "",
        path: currentPath,
        icon: item.meta?.icon || "",
      };

      // 存在合法子菜单，递归处理
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        menuNode.children = transformMenu(item.children, currentPath);
      }
      return menuNode;
    });
  }

  // 转换后端菜单
  const transformedMenu = transformMenu(serverMenuArr);

  // 拼接首页 + 业务菜单
  return [...baseMenu, ...transformedMenu];
}