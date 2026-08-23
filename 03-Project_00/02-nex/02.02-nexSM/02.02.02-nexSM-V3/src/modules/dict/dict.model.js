/**
 * 数据字典模块 - 数据模型层
 * 包含字典类型表和字典项表的数据库操作
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

/**
 * 字典类型表 nex_dict_type
 * 用于管理字典分类，如：用户状态、性别、设备类型等
 */
class DictTypeModel extends BaseModel {
  constructor() {
    super('nex_dict_type', ['dict_name', 'dict_code', 'description', 'status', 'sort'], 'id')
  }

  /** 根据字典类型编码查询 */
  async getByCode(code) {
    const sql = `SELECT * FROM ${this.tableName} WHERE dict_code = ? AND status = 1 LIMIT 1`
    const rows = await query(sql, [code])
    return rows[0] || null
  }

  /** 查询所有启用的字典类型 */
  async getAllEnabled() {
    const sql = `SELECT * FROM ${this.tableName} WHERE status = 1 ORDER BY sort ASC, id ASC`
    return await query(sql)
  }
}

/**
 * 字典项表 nex_dict_item
 * 存储具体的字典键值对，如：1=男, 2=女
 */
class DictItemModel extends BaseModel {
  constructor() {
    super('nex_dict_item', ['type_id', 'label', 'value', 'css_class', 'list_class', 'is_default', 'status', 'sort', 'remark'], 'id')
  }

  /** 根据字典类型ID查询所有启用的字典项 */
  async getByTypeId(typeId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE type_id = ? AND status = 1 ORDER BY sort ASC, id ASC`
    return await query(sql, [typeId])
  }

  /** 根据字典类型编码查询所有启用的字典项（联表查询） */
  async getByTypeCode(typeCode) {
    const sql = `
      SELECT di.* 
      FROM ${this.tableName} di
      INNER JOIN nex_dict_type dt ON di.type_id = dt.id
      WHERE dt.dict_code = ? AND di.status = 1 AND dt.status = 1
      ORDER BY di.sort ASC, di.id ASC
    `
    return await query(sql, [typeCode])
  }

  /** 根据字典类型编码和值查询标签 */
  async getLabelByCodeAndValue(typeCode, value) {
    const sql = `
      SELECT di.label 
      FROM ${this.tableName} di
      INNER JOIN nex_dict_type dt ON di.type_id = dt.id
      WHERE dt.dict_code = ? AND di.value = ? AND di.status = 1 AND dt.status = 1
      LIMIT 1
    `
    const rows = await query(sql, [typeCode, value])
    return rows[0]?.label || null
  }
}

module.exports = {
  DictTypeModel: new DictTypeModel(),
  DictItemModel: new DictItemModel()
}
