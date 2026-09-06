/**
 * ==========================================
 * 权限模块 - 数据模型层
 * ==========================================
 * 负责：权限码查询、角色权限分配、权限列表查询
 * 权限码覆盖：菜单权限、按钮权限、参数权限
 */
const { query, transaction } = require('../../db/index')

// 数据表名称
const MENU_TABLE = 'nex_menu'
const ROLE_MENU_TABLE = 'nex_role_menu'
const ROLE_TABLE = 'nex_role'
const USER_TABLE = 'nex_user'

class PermissionModel {
  /**
   * 根据用户ID查询该用户拥有的所有权限码
   * 通过用户角色 → 角色-菜单关联 → 菜单表，聚合所有 permission_code
   * @param {number} userId - 用户ID
   * @returns {Promise<Array<string>>} 权限码数组
   */
  async getPermissionCodesByUserId(userId) {
    const sql = `
      SELECT DISTINCT m.permission_code
      FROM ${MENU_TABLE} m
      INNER JOIN ${ROLE_MENU_TABLE} rm ON m.id = rm.menu_id
      INNER JOIN ${ROLE_TABLE} r ON rm.role_id = r.id
      INNER JOIN ${USER_TABLE} u ON r.role_code = u.role
      WHERE u.id = ?
        AND m.permission_code IS NOT NULL
        AND m.permission_code != ''
    `
    const rows = await query(sql, [userId])
    return rows.map(row => row.permission_code)
  }

  /**
   * 根据角色ID查询该角色拥有的所有权限码
   * @param {number} roleId - 角色ID
   * @returns {Promise<Array<string>>} 权限码数组
   */
  async getPermissionCodesByRoleId(roleId) {
    const sql = `
      SELECT DISTINCT m.permission_code
      FROM ${MENU_TABLE} m
      INNER JOIN ${ROLE_MENU_TABLE} rm ON m.id = rm.menu_id
      WHERE rm.role_id = ?
        AND m.permission_code IS NOT NULL
        AND m.permission_code != ''
    `
    const rows = await query(sql, [roleId])
    return rows.map(row => row.permission_code)
  }

  /**
   * 获取所有权限列表（用于权限配置界面展示）
   * 按菜单层级组织，包含菜单、按钮、参数
   * title 字段统一返回 i18n key（如 'menu.home'、'common.add'），由前端负责翻译
   * @returns {Promise<Array>} 权限列表（树形结构）
   */
  async getAllPermissions() {
    // 始终返回完整权限树，并携带 superOnly 标记；
    // 是否展示/禁用由前端依据"当前正在配置的角色"决定（数据库字段驱动，不硬编码）
    const sql = `
      SELECT id, parent_id, title, permission_code, type, path, sort, super_only
      FROM ${MENU_TABLE} m
      WHERE permission_code IS NOT NULL
        AND permission_code != ''
      ORDER BY sort ASC
    `
    const rows = await query(sql)
    return this.buildPermissionTree(rows)
  }

  /**
   * 扁平权限列表 → 树形结构
   * @param {Array} list - 扁平数据
   * @returns {Array} 树形结构
   */
  buildPermissionTree(list) {
    const treeMap = {}
    const resultTree = []

    // 第一遍：构建节点映射
    list.forEach(row => {
      treeMap[row.id] = {
        id: row.id,
        parentId: row.parent_id,
        title: row.title,
        permissionCode: row.permission_code,
        type: row.type,
        path: row.path,
        sort: row.sort,
        superOnly: row.super_only === 1,
        children: []
      }
    })

    // 第二遍：组装父子关系
    list.forEach(row => {
      const currentNode = treeMap[row.id]
      if (row.parent_id && treeMap[row.parent_id]) {
        treeMap[row.parent_id].children.push(currentNode)
      } else {
        resultTree.push(currentNode)
      }
    })

    return resultTree
  }

  /**
   * 保存角色权限分配（全量覆盖）
   * 先删除该角色的所有权限关联，再批量插入新的权限关联
   * @param {number} roleId - 角色ID
   * @param {Array<number>} menuIds - 菜单ID数组（包含菜单、按钮、参数）
   * @returns {Promise<boolean>} 是否保存成功
   */
  /**
   * 保存角色权限分配（全量覆盖）
   * 使用数据库事务，确保删除和插入的原子性
   * @param {number} roleId - 角色ID
   * @param {Array<string>} menuIds - 菜单ID数组（包含菜单、按钮、参数）
   * @returns {Promise<boolean>} 是否保存成功
   */
  async saveRolePermissions(roleId, menuIds) {
    console.log('[权限保存] 开始保存，roleId:', roleId, 'menuIds数量:', menuIds ? menuIds.length : 0)
    console.log('[权限保存] menuIds内容:', JSON.stringify(menuIds))

    try {
      const result = await transaction(async (connection) => {
        // 1. 删除该角色的所有权限关联
        const deleteSql = `DELETE FROM ${ROLE_MENU_TABLE} WHERE role_id = ?`
        console.log('[权限保存] 执行删除SQL:', deleteSql, '参数:', [roleId])
        const [deleteResult] = await connection.execute(deleteSql, [roleId])
        console.log('[权限保存] 删除结果:', deleteResult.affectedRows, '行')

        // 2. 批量插入新的权限关联
        if (menuIds && menuIds.length > 0) {
          // 转义 menuId 中的单引号，防止 SQL 语法错误
          const escapedMenuIds = menuIds.map(menuId => {
            if (typeof menuId === 'string') {
              return menuId.replace(/\'/g, "\'\'")
            }
            return String(menuId)
          })

          // 批量插入，使用 INSERT INTO ... VALUES 语法
          const values = escapedMenuIds.map(menuId => `(${roleId}, '${menuId}')`).join(', ')
          const insertSql = `INSERT INTO ${ROLE_MENU_TABLE} (role_id, menu_id) VALUES ${values}`
          
          console.log('[权限保存] 执行插入SQL长度:', insertSql.length)
          console.log('[权限保存] 插入SQL前200字符:', insertSql.substring(0, 200))
          
          const [insertResult] = await connection.execute(insertSql)
          console.log('[权限保存] 插入结果:', insertResult.affectedRows, '行')
        } else {
          console.log('[权限保存] menuIds为空，跳过插入')
        }

        return true
      })
      
      console.log('[权限保存] 事务提交成功')
      return result
    } catch (error) {
      console.error('[权限保存失败] 错误信息:', error.message)
      console.error('[权限保存失败] 错误代码:', error.code)
      console.error('[权限保存失败] SQL状态:', error.sqlState)
      console.error('[权限保存失败] 错误堆栈:', error.stack ? error.stack.substring(0, 500) : '无')
      throw error
    }
  }

  /**
   * 根据角色ID获取已分配的菜单ID列表
   * @param {number} roleId - 角色ID
   * @returns {Promise<Array<number>>} 菜单ID数组
   */
  async getRoleMenuIds(roleId) {
    const sql = `
      SELECT menu_id
      FROM ${ROLE_MENU_TABLE}
      WHERE role_id = ?
    `
    const rows = await query(sql, [roleId])
    return rows.map(row => row.menu_id)
  }

  /**
   * 更新用户权限版本号
   * 权限变更时调用，使前端缓存失效
   * @param {number} userId - 用户ID
   * @returns {Promise<boolean>} 是否更新成功
   */
  async updateUserPermissionVersion(userId) {
    // 使用10位秒级时间戳作为权限版本号，兼容 int 类型字段（MySQL int 最大 2147483647）
    const now = String(Math.floor(Date.now() / 1000))
    const sql = `
      UPDATE ${USER_TABLE}
      SET permission_version = ?
      WHERE id = ?
    `
    const result = await query(sql, [now, userId])
    return result.affectedRows > 0
  }

  /**
   * 根据角色编码更新该角色下所有用户的权限版本号
   * @param {string} roleCode - 角色编码
   * @returns {Promise<boolean>} 是否更新成功
   */
  async updatePermissionVersionByRoleCode(roleCode) {
    // 使用10位秒级时间戳作为权限版本号，兼容 int 类型字段（MySQL int 最大 2147483647）
    const now = String(Math.floor(Date.now() / 1000))
    const sql = `
      UPDATE ${USER_TABLE}
      SET permission_version = ?
      WHERE role = ?
    `
    const result = await query(sql, [now, roleCode])
    return result.affectedRows > 0
  }

  /**
   * 获取用户权限版本号
   * @param {number} userId - 用户ID
   * @returns {Promise<string|null>} 权限版本号
   */
  async getUserPermissionVersion(userId) {
    const sql = `
      SELECT permission_version
      FROM ${USER_TABLE}
      WHERE id = ?
    `
    const rows = await query(sql, [userId])
    return rows[0]?.permission_version || null
  }
}

module.exports = new PermissionModel()
