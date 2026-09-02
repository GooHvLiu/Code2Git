/**
 * 邮箱配置数据模型
 * 处理邮箱配置的数据库操作
 */
const { query } = require('../../db/index');
const { encrypt, decrypt } = require('./utils/crypto.util');

const TABLE_NAME = 'nex_email_config';

class EmailConfigModel {
  /**
   * 获取所有邮箱配置（分页）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词
   * @param {number} params.status - 状态筛选
   * @returns {Promise<Object>} { list, total }
   */
  async getList(params = {}) {
    const { page = 1, pageSize = 10, keyword = '', status } = params;
    const offset = (page - 1) * pageSize;

    let whereSql = 'WHERE is_delete = 0';
    const queryParams = [];

    if (keyword) {
      whereSql += ' AND (name LIKE ? OR username LIKE ?)';
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (status !== undefined && status !== null && status !== '') {
      whereSql += ' AND status = ?';
      queryParams.push(status);
    }

    // 查询总数
    const countResult = await query(`SELECT COUNT(*) as total FROM ${TABLE_NAME} ${whereSql}`, queryParams);
    const total = countResult[0]?.total || 0;

    // 查询列表
    const list = await query(
      `SELECT id, name, provider, host, port, secure, username, from_name, is_default, is_system, status, remark, create_by, create_time, update_time 
       FROM ${TABLE_NAME} 
       ${whereSql} 
       ORDER BY is_default DESC, create_time DESC 
       LIMIT ${parseInt(pageSize)} OFFSET ${parseInt(offset)}`,
      queryParams
    );

    return { list, total };
  }

  /**
   * 获取所有启用的邮箱配置（不分页，用于下拉选择）
   * @returns {Promise<Array>} 邮箱配置列表
   */
  async getAllEnabled() {
    const list = await query(
      `SELECT id, name, provider, host, port, secure, username, from_name, is_default, status 
       FROM ${TABLE_NAME} 
       WHERE status = 1 AND is_delete = 0 
       ORDER BY is_default DESC, create_time DESC`
    );
    return list;
  }

  /**
   * 根据ID获取邮箱配置
   * @param {number} id - 配置ID
   * @returns {Promise<Object|null>} 邮箱配置（含解密后的授权码）
   */
  async getById(id) {
    const result = await query(`SELECT * FROM ${TABLE_NAME} WHERE id = ? AND is_delete = 0`, [id]);
    if (result.length === 0) return null;
    const config = result[0];
    // 解密授权码
    if (config.password) {
      config.password = decrypt(config.password);
    }
    return config;
  }

  /**
   * 获取默认邮箱配置
   * @returns {Promise<Object|null>} 默认邮箱配置（含解密后的授权码）
   */
  async getDefault() {
    const result = await query(
      `SELECT * FROM ${TABLE_NAME} WHERE is_default = 1 AND status = 1 AND is_delete = 0 LIMIT 1`
    );
    if (result.length === 0) return null;
    const config = result[0];
    // 解密授权码
    if (config.password) {
      config.password = decrypt(config.password);
    }
    return config;
  }

  /**
   * 新增邮箱配置
   * @param {Object} data - 邮箱配置数据
   * @param {string} data.name - 配置名称
   * @param {string} data.provider - 服务商
   * @param {string} data.host - SMTP服务器
   * @param {number} data.port - 端口
   * @param {boolean} data.secure - 是否使用SSL
   * @param {string} data.username - 邮箱账号
   * @param {string} data.password - 授权码（明文，会自动加密）
   * @param {string} data.from_name - 发件人名称
   * @param {number} data.is_default - 是否为默认
   * @param {number} data.status - 状态
   * @param {string} data.remark - 备注
   * @param {string} data.create_by - 创建人
   * @returns {Promise<number>} 新增的配置ID
   */
  async create(data) {
    // 加密授权码
    const encryptedPassword = encrypt(data.password);

    // 如果设为默认，先取消其他默认
    if (data.is_default === 1) {
      await this.clearAllDefault();
    }

    const result = await query(
      `INSERT INTO ${TABLE_NAME} (name, provider, host, port, secure, username, password, from_name, is_default, status, remark, create_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.provider,
        data.host,
        data.port,
        data.secure ? 1 : 0,
        data.username,
        encryptedPassword,
        data.from_name || '',
        data.is_default || 0,
        data.status !== undefined ? data.status : 1,
        data.remark || '',
        data.create_by || ''
      ]
    );
    return result.insertId;
  }

  /**
   * 更新邮箱配置
   * @param {number} id - 配置ID
   * @param {Object} data - 更新数据
   * @returns {Promise<boolean>} 是否成功
   */
  async update(id, data) {
    const updateFields = [];
    const updateValues = [];

    const allowedFields = ['name', 'provider', 'host', 'port', 'secure', 'username', 'from_name', 'is_default', 'status', 'remark'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(field === 'secure' ? (data[field] ? 1 : 0) : data[field]);
      }
    }

    // 如果有密码，加密后更新
    if (data.password) {
      updateFields.push('password = ?');
      updateValues.push(encrypt(data.password));
    }

    if (updateFields.length === 0) {
      return false;
    }

    // 如果设为默认，先取消其他默认
    if (data.is_default === 1) {
      await this.clearAllDefault();
    }

    updateValues.push(id);
    await query(`UPDATE ${TABLE_NAME} SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
    return true;
  }

  /**
   * 删除邮箱配置（软删除）
   * @param {number} id - 配置ID
   * @returns {Promise<boolean>} 是否成功
   */
  async delete(id) {
    await query(`UPDATE ${TABLE_NAME} SET is_delete = 1 WHERE id = ?`, [id]);
    return true;
  }

  /**
   * 清除所有默认配置
   * @returns {Promise<void>}
   */
  async clearAllDefault() {
    await query(`UPDATE ${TABLE_NAME} SET is_default = 0 WHERE is_default = 1`);
  }

  /**
   * 设为默认配置
   * @param {number} id - 配置ID
   * @returns {Promise<boolean>} 是否成功
   */
  async setDefault(id) {
    await this.clearAllDefault();
    await query(`UPDATE ${TABLE_NAME} SET is_default = 1 WHERE id = ?`, [id]);
    return true;
  }

  /**
   * 检查配置名称是否存在
   * @param {string} name - 配置名称
   * @param {number} excludeId - 排除的ID（编辑时用）
   * @returns {Promise<boolean>} 是否存在
   */
  async existsByName(name, excludeId = null) {
    let sql = `SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE name = ? AND is_delete = 0`;
    const params = [name];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    const result = await query(sql, params);
    return result[0]?.count > 0;
  }
}

module.exports = new EmailConfigModel();
module.exports.EmailConfigModel = EmailConfigModel;
