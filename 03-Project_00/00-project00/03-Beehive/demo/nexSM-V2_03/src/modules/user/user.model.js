/**
 * 用户模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel');

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
}

module.exports = new UserModel();
