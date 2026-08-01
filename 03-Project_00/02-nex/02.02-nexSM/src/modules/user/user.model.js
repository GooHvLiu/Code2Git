/**
 * 用户模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel');

// 数据表名称
const TABLE_NAME = 'nex_user';

// 允许操作的字段白名单（安全防护，防止超量赋值）
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
  'login_data',
  'remark',
  'status',
  'is_delete',
  'remark',
  'create_by',
  'update_time',
  'update_by'
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
      last_login_time: new Date(),
      last_login_ip: ip
    });
  }
}

module.exports = new UserModel();
