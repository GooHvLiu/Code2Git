/**
 * 角色管理模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

class RoleModel extends BaseModel {
  constructor() {
    super('nex_role', ['role_name', 'role_code', 'description', 'status', 'sort', 'role_level', 'is_super_admin', 'is_builtin', 'is_hidden', 'visible_role_levels'], 'id')
  }

  /** 根据角色编码查询 */
  async getByCode(code) {
    const sql = `SELECT * FROM ${this.tableName} WHERE role_code = ? AND status = 1 LIMIT 1`
    const rows = await query(sql, [code])
    return rows[0] || null
  }

  /** 查询所有启用的角色 */
  async getAllEnabled() {
    const sql = `SELECT * FROM ${this.tableName} WHERE status = 1 ORDER BY sort ASC, id ASC`
    return await query(sql)
  }
}

class RoleMenuModel extends BaseModel {
  constructor() {
    super('nex_role_menu', ['role_id', 'menu_id'], 'id')
  }

  /** 根据角色ID查询菜单ID列表 */
  async getMenuIdsByRoleId(roleId) {
    const sql = `SELECT menu_id FROM ${this.tableName} WHERE role_id = ?`
    const rows = await query(sql, [roleId])
    return rows.map(row => row.menu_id)
  }

  /** 根据角色ID删除所有菜单关联 */
  async deleteByRoleId(roleId) {
    const sql = `DELETE FROM ${this.tableName} WHERE role_id = ?`
    return await query(sql, [roleId])
  }

  /** 批量插入角色菜单关联 */
  async batchInsert(roleId, menuIds) {
    if (!menuIds || menuIds.length === 0) return
    const values = menuIds.map(menuId => `(${roleId}, '${menuId}')`).join(',')
    const sql = `INSERT INTO ${this.tableName} (role_id, menu_id) VALUES ${values}`
    return await query(sql)
  }
}

module.exports = {
  RoleModel: new RoleModel(),
  RoleMenuModel: new RoleMenuModel()
}
