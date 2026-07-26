const { execSql } = require("@models/base/main.base.js");

class Menu4usersBase {
  constructor(dbName, menu_bdTable, menu4user_bdTable) {
    this.dbName = dbName;
    this.menu_bdTable = menu_bdTable;
    this.menu4user_bdTable = menu4user_bdTable;
  }

  /**
   * findMenuListById 根据用户ID联查菜单原始扁平数据（多表JOIN）
   * @param {number} id 用户id
   * @returns {Array} 数据库原始菜单数组
   */

  async findMenuListById(id) {
    // [DBNAME, MENU_DBTABLE, DBNAME, DBTABLE, userId]
    const sql = `
    SELECT m.*
    FROM ?? .?? m
    INNER JOIN ?? .?? um ON m.id = um.menu_id
    WHERE um.user_id = ?
    ORDER BY m.sort ASC
  `;
    const rows = await execSql(sql, [
      this.dbName,
      this.menu_bdTable,
      this.dbName,
      this.menu4user_bdTable,
      id
    ]);
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
   *
   *{Array} 数据库原始菜单数组
   * @param {number} id 用户id
   * @return {Array} 数据库原始菜单数组
   */
  async findUserMenuTree(id) {
    try {
      const rawList = await this.findMenuListById(id);

      return this.buildMenuTree(rawList);
    } catch (error) {
      return error;
    }
  }
}

module.exports = Menu4usersBase;
