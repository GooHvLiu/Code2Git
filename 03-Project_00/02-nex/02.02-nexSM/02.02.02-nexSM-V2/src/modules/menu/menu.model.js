/**
 * 菜单模块 - 数据模型层
 * 负责：菜单数据查询 + 树形结构构建
 */
const { query } = require('../../db/index');
const { MENU_HIDDEN, MENU_ALWAYS_SHOW, MENU_NO_CACHE } = require('../../constants/statusCode');

// 数据表名称
const MENU_TABLE = 'nex_menu';
const USER_MENU_TABLE = 'nex_user_menu';

class MenuModel {
  /**
   * 根据用户ID联查菜单原始扁平数据（多表JOIN）
   * @param {number} userId 用户ID
   * @returns {Promise<Array>} 数据库原始菜单数组
   */
  async findMenuListByUserId(userId) {
    const sql = `
      SELECT m.*
      FROM ${MENU_TABLE} m
      INNER JOIN ${USER_MENU_TABLE} um ON m.id = um.menu_id
      WHERE um.user_id = ?
      ORDER BY m.sort ASC
    `;
    const rows = await query(sql, [userId]);
    return rows;
  }

  /**
   * 原始扁平菜单 → 前端树形路由
   * @param {Array} menuList 数据库原始数据
   * @returns {Array} 前端标准路由树
   */
  buildMenuTree(menuList) {
    const treeMap = {};
    const resultTree = [];

    // 第一遍：构建节点映射
    menuList.forEach((row) => {
      const routeItem = {
        path: row.path,
        name: row.name,
        component: row.component,
        redirect: row.redirect,
        hidden: row.hidden === MENU_HIDDEN.HIDDEN,
        alwaysShow: row.always_show === MENU_ALWAYS_SHOW.YES,
        meta: {
          title: row.title,
          icon: row.icon,
          noCache: row.no_cache === MENU_NO_CACHE.NO_CACHE
        },
        children: []
      };
      treeMap[row.id] = routeItem;
    });

    // 第二遍：组装父子关系
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
   * 获取用户菜单树（对外统一方法）
   * @param {number} userId 用户ID
   * @returns {Promise<Array>} 树形菜单数组
   */
  async findUserMenuTree(userId) {
    const rawList = await this.findMenuListByUserId(userId);
    return this.buildMenuTree(rawList);
  }
}

module.exports = new MenuModel();