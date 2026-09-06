/**
 * 用户模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel');
const { query } = require('../../db/index');
const cache = require('../../utils/cache');

// Token 版本号缓存前缀（与 auth.middleware.js 保持一致）
const TOKEN_VERSION_CACHE_PREFIX = 'token_version:';

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
   * 原子递增 Token 版本号（用于单点登录踢人）
   * 每次登录时调用，旧 Token 中的 token_version 与数据库不一致即失效
   * @param {number} userId - 用户ID
   * @returns {Promise<number>} 递增后的新版本号
   */
  async incrementTokenVersion(userId) {
    const sql = `UPDATE ${TABLE_NAME} SET token_version = token_version + 1 WHERE id = ?`;
    await query(sql, [userId]);
    // 查询递增后的值
    const rows = await query(`SELECT token_version FROM ${TABLE_NAME} WHERE id = ?`, [userId]);
    const newVersion = rows[0]?.token_version || 0;
    // 清除缓存，确保下次请求从数据库获取最新版本号
    cache.del(TOKEN_VERSION_CACHE_PREFIX + userId);
    return newVersion;
  }

  /**
   * 获取用户的 Token 版本号
   * @param {number} userId - 用户ID
   * @returns {Promise<number>} Token 版本号
   */
  async getTokenVersion(userId) {
    const rows = await query(`SELECT token_version FROM ${TABLE_NAME} WHERE id = ?`, [userId]);
    return rows[0]?.token_version || 0;
  }

  /**
   * 获取所有管理员用户ID列表（用于推送安全通知）
   * @param {number} [excludeUserId] - 排除的用户ID（可选）
   * @returns {Promise<number[]>} 管理员用户ID数组
   */
  async getAdminUserIds(excludeUserId = null) {
    let sql = `SELECT id FROM ${TABLE_NAME} WHERE role = 'administrator' AND status = 1 AND is_delete = 0`;
    const params = [];
    if (excludeUserId) {
      sql += ' AND id != ?';
      params.push(excludeUserId);
    }
    const rows = await query(sql, params);
    return rows.map(r => r.id);
  }

  /**
   * 根据用户名查询用户（关联角色表获取 data_scope）
   * @param {string} username
   * @param {string} lang - 语言代码
   * @returns {Promise<Object|null>}
   */
  async getByUsernameWithRole(username) {
    const sql = `
      SELECT u.*, r.role_name
      FROM ${TABLE_NAME} u
      LEFT JOIN nex_role r ON u.role = r.role_code
      WHERE u.username = ? AND u.is_delete = 0
      LIMIT 1
    `;
    const rows = await query(sql, [username]);
    if (!rows[0]) return null;
    return rows[0];
  }

  /**
   * 分页查询用户列表（关联部门表获取部门名称）
   * @param {Object} params - 查询参数
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {Array<string>} [excludeRoles=[]] - 要排除的角色编码列表（用于隐藏超级管理员等角色）
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getUserListWithDept(params = {}, page = 1, pageSize = 10, excludeRoles = []) {
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

    // 排除指定角色的用户（用于隐藏超级管理员等角色）
    if (excludeRoles && excludeRoles.length > 0) {
      const placeholders = excludeRoles.map(() => '?').join(',');
      where.push(`u.role NOT IN (${placeholders})`);
      queryParams.push(...excludeRoles);
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

    return { list, total };
  }

  /**
   * 根据ID查询用户（关联部门表获取部门名称）
   * @param {number} id
   * @param {string} lang - 语言代码
   * @returns {Promise<Object|null>}
   */
  async getByIdWithDept(id) {
    const sql = `
      SELECT u.*, d.dept_name, r.role_name
      FROM ${TABLE_NAME} u
      LEFT JOIN nex_dept d ON u.dept_id = d.id
      LEFT JOIN nex_role r ON u.role = r.role_code
      WHERE u.id = ? AND u.is_delete = 0
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    if (!rows[0]) return null;
    return rows[0];
  }

  /**
   * 根据部门ID统计该部门下的用户数量（用于删除部门前的校验）
   * @param {number} deptId - 部门ID
   * @returns {Promise<number>} 用户数量
   */
  async countByDeptId(deptId) {
    const sql = `SELECT COUNT(*) as total FROM ${TABLE_NAME} WHERE dept_id = ? AND is_delete = 0`;
    const rows = await query(sql, [deptId]);
    return rows[0]?.total || 0;
  }

  /**
   * 更新用户锁定状态
   * @param {number} userId - 用户ID
   * @param {Date|null} lockUntil - 锁定到期时间，null表示解锁
   * @param {string|null} lockReason - 锁定原因
   * @returns {Promise<void>}
   */
  async updateLockStatus(userId, lockUntil, lockReason = null) {
    const sql = 'UPDATE ' + TABLE_NAME + ' SET lock_until = ?, lock_reason = ? WHERE id = ?';
    await query(sql, [lockUntil, lockReason, userId]);
  }

  /**
   * 原子递增用户登录失败次数
   * @param {number} userId - 用户ID
   * @returns {Promise<number>} 递增后的失败次数
   */
  async incrementFailedAttempts(userId) {
    const sql = 'UPDATE ' + TABLE_NAME + ' SET failed_attempts = failed_attempts + 1 WHERE id = ?';
    await query(sql, [userId]);
    const rows = await query('SELECT failed_attempts FROM ' + TABLE_NAME + ' WHERE id = ?', [userId]);
    return rows[0]?.failed_attempts || 0;
  }

  /**
   * 清除用户登录失败次数和锁定状态
   * @param {number} userId - 用户ID
   * @returns {Promise<void>}
   */
  async clearFailedAttemptsAndLock(userId) {
    const sql = 'UPDATE ' + TABLE_NAME + ' SET failed_attempts = 0, lock_until = NULL, lock_reason = NULL WHERE id = ?';
    await query(sql, [userId]);
  }

  /**
   * 解锁用户（管理员手动解锁）
   * @param {number} userId - 用户ID
   * @returns {Promise<void>}
   */
  async unlockUser(userId) {
    const sql = 'UPDATE ' + TABLE_NAME + ' SET failed_attempts = 0, lock_until = NULL, lock_reason = NULL WHERE id = ?';
    await query(sql, [userId]);
  }
}

module.exports = new UserModel();
