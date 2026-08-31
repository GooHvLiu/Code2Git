/**
 * 菜单模块 - 数据模型层
 * 负责：菜单数据查询 + 树形结构构建
 */
const { query } = require('../../db/index');
const { MENU_HIDDEN, MENU_ALWAYS_SHOW, MENU_NO_CACHE } = require('../../constants/statusCode');

// 数据表名称
const MENU_TABLE = 'nex_menu';

class MenuModel {
  /**
   * 根据用户ID联查菜单原始扁平数据（通过角色-菜单关联表）
   * 注意：title 字段统一返回 i18n key（如 'menu.home'），由前端负责翻译
   * @param {number} userId 用户ID
   * @param {string} lang 语言代码（保留参数兼容调用方，实际不使用，翻译由前端处理）
   * @returns {Promise<Array>} 数据库原始菜单数组
   */
  async findMenuListByUserId(userId, lang = 'zh-CN') {
    const sql = `
      SELECT DISTINCT m.*
      FROM ${MENU_TABLE} m
      INNER JOIN nex_role_menu rm ON m.id = rm.menu_id
      INNER JOIN nex_role r ON rm.role_id = r.id
      INNER JOIN nex_user u ON r.role_code = u.role
      WHERE u.id = ?
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
          noCache: row.no_cache === MENU_NO_CACHE.NO_CACHE,
          type: row.type  // 菜单类型：1=目录，2=菜单，3=按钮，4=参数
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
   * 获取菜单最新版本号（取最大 update_time）
   * @returns {Promise<string|null>} 版本号（时间字符串）
   */
  async getMenuVersion() {
    const sql = `SELECT MAX(update_time) as version FROM ${MENU_TABLE}`;
    const rows = await query(sql);
    return rows[0]?.version || null;
  }

  /**
   * 带版本号的菜单查询
   * @param {number} userId 用户ID
   * @param {string} version 前端缓存的版本号
   * @param {string} lang 语言代码
   * @returns {Promise<{tree: Array, version: string}|null>} 版本未变返回 null
   */
  async findUserMenuTreeWithVersion(userId, version, lang = 'zh-CN') {
    const currentVersion = await this.getMenuVersion();

    // 版本一致，返回 null 表示未变更
    if (version && currentVersion) {
      const cachedTime = new Date(version).getTime();
      const currentTime = new Date(currentVersion).getTime();
      if (cachedTime === currentTime) {
        return null;
      }
    }

    const rawList = await this.findMenuListByUserId(userId, lang);
    const tree = this.buildMenuTree(rawList);
    return { tree, version: currentVersion };
  }
}

module.exports = new MenuModel();