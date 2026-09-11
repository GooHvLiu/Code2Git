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

  // ==================== 菜单配置管理相关方法 ====================

  /**
   * 获取所有菜单列表（用于菜单配置页面）
   * @returns {Promise<Array>} 所有菜单数组
   */
  async getAllMenuList() {
    const sql = `SELECT * FROM ${MENU_TABLE} ORDER BY sort ASC`;
    const rows = await query(sql);
    return rows;
  }

  /**
   * 构建管理员菜单树（包含所有字段）
   * @param {Array} menuList 数据库原始数据
   * @returns {Array} 菜单树
   */
  buildAdminMenuTree(menuList) {
    const treeMap = {};
    const resultTree = [];

    menuList.forEach((row) => {
      const node = {
        id: row.id,
        parentId: row.parent_id,
        name: row.name,
        path: row.path,
        component: row.component,
        redirect: row.redirect,
        title: row.title,
        icon: row.icon,
        hidden: row.hidden,
        alwaysShow: row.always_show,
        noCache: row.no_cache,
        sort: row.sort,
        type: row.type || 2,
        updateTime: row.update_time,
        children: []
      };
      treeMap[row.id] = node;
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
   * 根据ID获取菜单
   * @param {string} id 菜单ID
   * @returns {Promise<Object|null>} 菜单信息
   */
  async getMenuById(id) {
    const sql = `SELECT * FROM ${MENU_TABLE} WHERE id = ?`;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  /**
   * 创建菜单
   * @param {Object} menuData 菜单数据
   * @returns {Promise<object>} 创建结果
   */
  async createMenu(menuData) {
    const sql = `
      INSERT INTO ${MENU_TABLE} 
      (id, parent_id, name, path, component, redirect, title, icon, hidden, always_show, no_cache, sort, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      menuData.id,
      menuData.parent_id || '',
      menuData.name,
      menuData.path,
      menuData.component || null,
      menuData.redirect || 'noRedirect',
      menuData.title,
      menuData.icon || null,
      menuData.hidden || 0,
      menuData.always_show || 0,
      menuData.no_cache || 0,
      menuData.sort || 0,
      menuData.type || 2
    ];
    const result = await query(sql, params);
    return result;
  }

  /**
   * 更新菜单
   * @param {string} id 菜单ID
   * @param {Object} menuData 菜单数据
   * @returns {Promise<object>} 更新结果
   */
  async updateMenu(id, menuData) {
    const sql = `
      UPDATE ${MENU_TABLE} SET
      parent_id = ?, name = ?, path = ?, component = ?, redirect = ?, 
      title = ?, icon = ?, hidden = ?, always_show = ?, 
      no_cache = ?, sort = ?, type = ?
      WHERE id = ?
    `;
    const params = [
      menuData.parent_id || '',
      menuData.name,
      menuData.path,
      menuData.component || null,
      menuData.redirect || 'noRedirect',
      menuData.title,
      menuData.icon || null,
      menuData.hidden || 0,
      menuData.always_show || 0,
      menuData.no_cache || 0,
      menuData.sort || 0,
      menuData.type || 2,
      id
    ];
    const result = await query(sql, params);
    return result;
  }

  /**
   * 获取所有子菜单ID（递归）
   * @param {string} parentId 父菜单ID
   * @returns {Promise<Array>} 所有子菜单ID数组
   */
  async getAllChildIds(parentId) {
    const allIds = [];
    const findChildren = async (pid) => {
      const sql = `SELECT id FROM ${MENU_TABLE} WHERE parent_id = ?`;
      const rows = await query(sql, [pid]);
      for (const row of rows) {
        allIds.push(row.id);
        await findChildren(row.id);
      }
    };
    await findChildren(parentId);
    return allIds;
  }

  /**
   * 删除菜单及子菜单
   * @param {string} id 菜单ID
   * @returns {Promise<object>} 删除结果
   */
  async deleteMenuAndChildren(id) {
    const childIds = await this.getAllChildIds(id);
    const allIds = [id, ...childIds];
    const placeholders = allIds.map(() => '?').join(',');
    const sql = `DELETE FROM ${MENU_TABLE} WHERE id IN (${placeholders})`;
    const result = await query(sql, allIds);
    const roleMenuSql = `DELETE FROM nex_role_menu WHERE menu_id IN (${placeholders})`;
    await query(roleMenuSql, allIds);
    return result;
  }

  /**
   * 更新菜单父级和排序（拖拽）
   * @param {string} id 菜单ID
   * @param {string} parentId 新的父菜单ID
   * @param {number} sort 新的排序号
   * @returns {Promise<object>} 更新结果
   */
  async updateMenuParentAndSort(id, parentId, sort) {
    const sql = `UPDATE ${MENU_TABLE} SET parent_id = ?, sort = ? WHERE id = ?`;
    const result = await query(sql, [parentId || '', sort, id]);
    return result;
  }

  /**
   * 获取父菜单下的最大排序号
   * @param {string} parentId 父菜单ID
   * @returns {Promise<number>} 最大排序号
   */
  async getMaxSortByParent(parentId) {
    const sql = `SELECT MAX(sort) as maxSort FROM ${MENU_TABLE} WHERE parent_id = ?`;
    const rows = await query(sql, [parentId || '']);
    return rows[0]?.maxSort || 0;
  }

  /**
   * 检查菜单name是否唯一
   * @param {string} name 菜单name
   * @param {string} excludeId 排除的菜单ID
   * @returns {Promise<boolean>} 是否唯一
   */
  async checkNameUnique(name, excludeId = null) {
    let sql = `SELECT COUNT(*) as count FROM ${MENU_TABLE} WHERE name = ?`;
    const params = [name];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    const rows = await query(sql, params);
    return rows[0]?.count === 0;
  }

  /**
   * 检查菜单path是否唯一
   * @param {string} path 菜单path
   * @param {string} excludeId 排除的菜单ID
   * @returns {Promise<boolean>} 是否唯一
   */
  async checkPathUnique(path, excludeId = null) {
    let sql = `SELECT COUNT(*) as count FROM ${MENU_TABLE} WHERE path = ?`;
    const params = [path];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    const rows = await query(sql, params);
    return rows[0]?.count === 0;
  }
}

module.exports = new MenuModel();
