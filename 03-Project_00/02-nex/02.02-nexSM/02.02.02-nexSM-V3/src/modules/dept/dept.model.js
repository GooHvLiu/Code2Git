/**
 * 部门管理模块 - 数据模型层
 * 树形结构，支持多级部门
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

class DeptModel extends BaseModel {
  constructor() {
    super('nex_dept', ['parent_id', 'dept_name', 'order_num', 'leader', 'phone', 'email', 'status'], 'id')
  }

  /** 查询所有部门（树形结构用） */
  async getAllDepts() {
    const sql = `SELECT * FROM ${this.tableName} WHERE status = 1 ORDER BY order_num ASC, id ASC`
    return await query(sql)
  }

  /** 根据父部门ID查询子部门 */
  async getByParentId(parentId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE parent_id = ? AND status = 1 ORDER BY order_num ASC, id ASC`
    return await query(sql, [parentId])
  }

  /** 查询某部门的所有子部门ID（递归） */
  async getChildDeptIds(deptId) {
    const allDepts = await this.getAllDepts()
    const childIds = []
    const findChildren = (parentId) => {
      allDepts.forEach(dept => {
        if (dept.parent_id === parentId) {
          childIds.push(dept.id)
          findChildren(dept.id)
        }
      })
    }
    findChildren(deptId)
    return childIds
  }
}

module.exports = new DeptModel()
