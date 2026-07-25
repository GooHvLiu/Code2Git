const { execSql } = require("@MySQL/models/base/base/index.base.js");
class Menu4usersBase {
  constructor(dbName, tableName) {
    this.dbName = dbName;
    this.tableName = tableName;
  }

  /**
   findMenuListById 根据用户ID联查菜单原始扁平数据（多表JOIN）
   @param {number} id
   @returns {Array} 数据库原始菜单数组
   */
  async findMenuListById(id) {
    sql = `
    SELECT m.*
    FROM sys_menu m
    INNER JOIN sys_user_menu um ON m.id = um.menu_id
    WHERE um.user_id = ?
    ORDER BY m.sort ASC
  `;
    const [rows] = await execSql(sql, [this.dbName, this.tableName, id]);
    return rows;
  }

  /**
   buildMenuTree 原始扁平菜单 → 前端树形路由（纯数据格式化，放Model）
   @param {Array} menuList 数据库原始数据
   @returns {Array} 前端标准路由树
   */
  buildMenuTree(menuList) {
    const treeMap = {};
    const resultTree = [];
    menuList.forEach((row) => {
      const routeItem = {
        path: row.path,
        name: row.name,
        component: row.component,
        redirect: row.redirect,
        hidden: row.hidden === 1,
        alwaysShow: row.always_show === 1,
        meta: {
          title: row.title,
          icon: row.icon,
          noCache: row.no_cache === 1
        },
        children: []
      };
      treeMap[row.id] = routeItem;
    });
    menuList.forEach((row) => {
      const currentNode = treeMap[row.id];
      if (row.parent_id && treeMap[row.parent_id]) {
        treeMap[row.parent_id].children.push(currentNode);
      } else {
        resultTree.push(currentNode);
      }
    });
    return resultTree;
  }

  /**
   findUserMenuTree 封装完整获取树形菜单对外方法
   @param {number} userId
   @returns {Array} 直接返回树形结构
   */
  async findUserMenuTree(id) {
    const rawList = await this.findMenuListById(id);
    return this.buildMenuTree(rawList);
  }
}

module.exports = Menu4usersBase;
