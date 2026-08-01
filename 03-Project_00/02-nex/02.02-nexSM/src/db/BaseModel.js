/**
 * 通用基础模型类
 * 所有业务模型继承此类，封装通用CRUD操作
 * 包含字段白名单安全过滤，防止超量赋值
 */
const { query } = require('./index');
const appConfig = require('../config/app.config');

class BaseModel {
  /**
   * 构造函数
   * @param {string} tableName 数据表名称
   * @param {string[]} allowFields 允许操作的字段白名单
   * @param {string} primaryKey 主键字段名，默认id
   */
  constructor(tableName, allowFields, primaryKey = 'id') {
    this.tableName = tableName;
    this.allowFields = allowFields;
    this.primaryKey = primaryKey;
  }

  /**
   * 字段过滤：只保留白名单内的字段
   * 防止超量赋值安全漏洞
   * @param {Object} rawData 原始数据
   * @returns {Object} 过滤后安全数据
   */
  filterFields(rawData) {
    if (!rawData || typeof rawData !== 'object') return {};
    const result = {};
    for (const field of this.allowFields) {
      if (Reflect.has(rawData, field)) {
        result[field] = rawData[field];
      }
    }
    return result;
  }

  /**
   * 分页查询
   * @param {Object} params 查询参数
   * @param {Object} where 条件 { field: value }
   * @param {string} orderBy 排序字段
   * @param {string} orderDir 排序方向 ASC/DESC
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getPageList(params = {}, where = {}, orderBy = 'id', orderDir = 'ASC') {
    const page = Number(params.page) || appConfig.pagination.defaultPage;
    const pageSize = Math.min(
      Number(params.pageSize) || appConfig.pagination.defaultPageSize,
      appConfig.pagination.maxPageSize
    );
    const offset = (page - 1) * pageSize;

    // 构建where条件
    const whereConditions = [];
    const whereValues = [];
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined && value !== null && value !== '') {
        whereConditions.push(`${key} = ?`);
        whereValues.push(value);
      }
    }
    const whereSql = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 查询总数
    const countResult = await query(
      `SELECT COUNT(*) as total FROM ${this.tableName} ${whereSql}`,
      whereValues
    );
    const total = countResult[0].total;

    // 查询列表
    // 注意：LIMIT 和 OFFSET 直接拼接，避免 mysql2 预编译模式下的参数类型问题
    // 已通过 Number() 和 Math.min() 确保是合法数字，无注入风险
    const list = await query(
      `SELECT * FROM ${this.tableName} ${whereSql} ORDER BY ${orderBy} ${orderDir} LIMIT ${pageSize} OFFSET ${offset}`,
      whereValues
    );

    return {
      list,
      total,
      page,
      pageSize
    };
  }

  /**
   * 根据主键查询详情
   * @param {number|string} id 主键值
   * @returns {Promise<Object|null>} 查询结果
   */
  async getById(id) {
    const result = await query(
      `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ? LIMIT 1`,
      [id]
    );
    return result[0] || null;
  }

  /**
 * 根据主键批量查询详情
 * @param {Array} idArray 主键值数组
 * @returns {Promise<Object|null>} 查询结果数组
 */
  async getByIdArray(idArray) {
    // 校验：非数组 / 空数组 直接返回空数组
    if (!Array.isArray(idArray) || idArray.length === 0) return [];
    // 根据数组长度生成 ?,?,?
    const placeholders = idArray.map(() => '?').join(',');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} IN (${placeholders})`;
    const rows = await query(sql, idArray);
    return rows;
  }


  /**
   * 根据条件查询单条
   * @param {Object} where 查询条件
   * @returns {Promise<Object|null>}
   */
  async findOne(where = {}) {
    const conditions = [];
    const values = [];
    for (const [key, value] of Object.entries(where)) {
      conditions.push(`${key} = ?`);
      values.push(value);
    }
    const result = await query(
      `SELECT * FROM ${this.tableName} WHERE ${conditions.join(' AND ')} LIMIT 1`,
      values
    );
    return result[0] || null;
  }

  /**
   * 新增数据
   * @param {Object} data 新增数据
   * @returns {Promise<Object>} 新增结果 { insertId, affectedRows }
   */
  async create(data) {
    const safeData = this.filterFields(data);
    const fields = Object.keys(safeData);
    const values = Object.values(safeData);
    const placeholders = fields.map(() => '?').join(', ');

    const result = await query(
      `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
      values
    );
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  }

  /**
   * 根据主键更新数据
   * @param {number|string} id 主键值
   * @param {Object} data 更新数据
   * @returns {Promise<Object>} 更新结果 { affectedRows }
   */
  async update(id, data) {
    const safeData = this.filterFields(data);
    const fields = Object.keys(safeData);
    const values = Object.values(safeData);

    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    const setSql = fields.map(field => `${field} = ?`).join(', ');

    const result = await query(
      `UPDATE ${this.tableName} SET ${setSql} WHERE ${this.primaryKey} = ?`,
      [...values, id]
    );
    return {
      affectedRows: result.affectedRows
    };
  }

  /**
   * 根据主键删除数据
   * @param {number|string} id 主键值
   * @returns {Promise<Object>} 删除结果 { affectedRows }
   */
  async delete(id) {
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
      [id]
    );
    return {
      affectedRows: result.affectedRows
    };
  }

  /**
   * 批量删除
   * @param {Array} ids 主键数组
   * @returns {Promise<Object>}
   */
  async batchDelete(ids = []) {
    if (ids.length === 0) return { affectedRows: 0 };
    const placeholders = ids.map(() => '?').join(', ');
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} IN (${placeholders})`,
      ids
    );
    return {
      affectedRows: result.affectedRows
    };
  }

  /**
   * 查询所有数据（慎用，数据量大时用分页）
   * @param {Object} where 查询条件
   * @param {string} orderBy 排序
   * @param {string} orderDir 排序方向
   * @returns {Promise<Array>}
   */
  async findAll(where = {}, orderBy = 'created_at', orderDir = 'DESC') {
    const conditions = [];
    const values = [];
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    }
    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    return await query(
      `SELECT * FROM ${this.tableName} ${whereSql} ORDER BY ${orderBy} ${orderDir}`,
      values
    );
  }

  /**
   * 统计数量
   * @param {Object} where 查询条件
   * @returns {Promise<number>}
   */
  async count(where = {}) {
    const conditions = [];
    const values = [];
    for (const [key, value] of Object.entries(where)) {
      conditions.push(`${key} = ?`);
      values.push(value);
    }
    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT COUNT(*) as count FROM ${this.tableName} ${whereSql}`,
      values
    );
    return result[0].count;
  }
}

module.exports = BaseModel;
