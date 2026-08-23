/**
 * 用户模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel');
const { query } = require('../../db/index');
const { getLangValue, processLangFields } = require('../../utils/i18n');

// 数据表名称
const TABLE_NAME = 'nex_user';

// 允许操作的字段白名单（安全防护，防止超量赋值）
// 与数据库 nex_user 表字段对齐，id/create_time 等自增/自动字段不在这里
const ALLOW_FIELDS = [
  'username',
  'password',
  'role',
  'real_name',
  'sex',
  'phone',
  'email',
  'dept_id',
  'avatar',
  'login_ip',
  'login_date',
  'remark',
  'status',
  'is_delete',
  'create_by',
  'update_time',
  'update_by',
  'is_first_login',
  'first_login_at'
];

class UserModel extends BaseModel {
  constructor() {
    super(TABLE_NAME, ALLOW_FIELDS);
  }

  /**
   * 根据用户名查询用户
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  async getByUsername(username) {
    return await this.findOne({ username });
  }

  /**
   * 更新最后登录信息
   * @param {number} userId
   * @param {string} ip
   */
  async updateLoginInfo(userId, ip) {
    return await this.update(userId, {
      login_date: new Date(),
      login_ip: ip
    });
  }

  /**
   * 根据用户名查询用户（关联角色表获取 data_scope）
   * @param {string} username
   * @param {string} lang - 语言代码
   * @returns {Promise<Object|null>}
   */
  async getByUsernameWithRole(username, lang = 'zh-CN') {
    const sql = `
      SELECT u.*, r.data_scope, r.role_name
      FROM ${TABLE_NAME} u
      LEFT JOIN nex_role r ON u.role = r.role_code
      WHERE u.username = ? AND u.is_delete = 0
      LIMIT 1
    `;
    const rows = await query(sql, [username]);
    if (!rows[0]) return null;
    // 处理多语言 JSON 字段
    return {
      ...rows[0],
      role_name: getLangValue(rows[0].role_name, lang, rows[0].role)
    };
  }

  /**
   * 分页查询用户列表（关联部门表获取部门名称）
   * @param {Object} params - 查询参数
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {string} lang - 语言代码
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getUserListWithDept(params = {}, page = 1, pageSize = 10, lang = 'zh-CN') {
    const where = ['u.is_delete = 0'];
    const queryParams = [];

    if (params.username) {
      where.push('u.username LIKE ?');
      queryParams.push(`%${params.username}%`);
    }
    if (params.role) {
      where.push('u.role = ?');
      queryParams.push(params.role);
    }
    if (params.status !== '' && params.status !== undefined && params.status !== null) {
      where.push('u.status = ?');
      queryParams.push(params.status);
    }

    const whereSql = where.join(' AND ');
    // 确保 page 和 pageSize 是正整数，防止 SQL 注入
    const safePage = Math.max(1, parseInt(page) || 1);
    const safePageSize = Math.max(1, Math.min(100, parseInt(pageSize) || 10));
    const offset = (safePage - 1) * safePageSize;

    const countSql = `SELECT COUNT(*) as total FROM ${TABLE_NAME} u WHERE ${whereSql}`;
    const countResult = await query(countSql, queryParams);
    const total = countResult[0]?.total || 0;

    // LIMIT/OFFSET 直接拼接到 SQL（mysql2 execute 预编译模式对参数类型要求严格）
    const listSql = `
      SELECT u.*, d.dept_name, r.role_name
      FROM ${TABLE_NAME} u
      LEFT JOIN nex_dept d ON u.dept_id = d.id
      LEFT JOIN nex_role r ON u.role = r.role_code
      WHERE ${whereSql}
      ORDER BY u.id DESC
      LIMIT ${safePageSize} OFFSET ${offset}
    `;
    const list = await query(listSql, queryParams);

    // 处理多语言 JSON 字段
    const processedList = list.map(item => ({
      ...item,
      dept_name: getLangValue(item.dept_name, lang, '-'),
      role_name: getLangValue(item.role_name, lang, item.role)
    }));

    return { list: processedList, total };
  }

  /**
   * 根据ID查询用户（关联部门表获取部门名称）
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  /**
   * 根据ID查询用户（关联部门表获取部门名称）
   * @param {number} id
   * @param {string} lang - 语言代码
   * @returns {Promise<Object|null>}
   */
  async getByIdWithDept(id, lang = 'zh-CN') {
    const sql = `
      SELECT u.*, d.dept_name, r.role_name, r.data_scope
      FROM ${TABLE_NAME} u
      LEFT JOIN nex_dept d ON u.dept_id = d.id
      LEFT JOIN nex_role r ON u.role = r.role_code
      WHERE u.id = ? AND u.is_delete = 0
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    if (!rows[0]) return null;
    // 处理多语言 JSON 字段
    return {
      ...rows[0],
      dept_name: getLangValue(rows[0].dept_name, lang, '-'),
      role_name: getLangValue(rows[0].role_name, lang, rows[0].role)
    };
  }
}

module.exports = new UserModel();
