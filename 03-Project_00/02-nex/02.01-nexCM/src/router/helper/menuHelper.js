/**
 * 后端原始菜单数组 → 转换为侧边栏可用菜单结构
 * @param {Array} serverMenuArr 后端返回 raw menu data
 * @returns {Array}
 */
export function formatMenu(serverMenuArr) {
  // 基础首页数据，无需从服务器获取
  const baseMenu = [{ title: "网站首页", path: "/", icon: "home" }];
  // 处理后端菜单数据，增加兜底防止children undefined
  const ret = serverMenuArr.map((item) => {
    // 如果有子菜单
    if (item.children && Array.isArray(item.children)) {
      return {
        title: item.meta.title,
        path: item.path,
        icon: item.meta.icon,
        children: item.children.map((childrenItem) => ({
          title: childrenItem.meta.title,
          path: `${item.path}/${childrenItem.path}`,
          icon: childrenItem.meta.icon,
        })),
      };
    }
    // 如果没有子菜单
    else {
      return {
        title: item.meta.title,
        path: item.path,
        icon: item.meta.icon,
      };
    }
  });
  // 通过 ES6 的展开运算符拼接成全新的数组，返回的就是真正能够展示看的菜单栏数组
  return [...baseMenu, ...ret];
}