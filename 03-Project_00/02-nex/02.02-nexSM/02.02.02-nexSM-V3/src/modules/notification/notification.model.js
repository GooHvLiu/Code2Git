/**
 * 通知中心模块 - 数据模型层
 * 
 * 支持功能：
 * - 通知列表查询（支持类型、优先级、时间范围、归档状态筛选）
 * - 未读数量统计
 * - 标记已读/全部已读/批量已读
 * - 删除/批量删除/全部删除
 * - 通知归档/恢复/归档列表
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

class NotificationModel extends BaseModel {
  constructor() {
    super('nex_notification', ['user_id', 'title', 'content', 'title_key', 'title_params', 'content_key', 'content_params', 'type', 'priority', 'link', 'is_read', 'read_time', 'is_archived'], 'id')
  }

  /**
   * 确保表结构存在（添加 is_archived 字段和国际化字段）
   */
  async ensureTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) DEFAULT NULL,
        content TEXT DEFAULT NULL,
        title_key VARCHAR(100) DEFAULT '',
        title_params TEXT,
        content_key VARCHAR(100) DEFAULT '',
        content_params TEXT,
        type VARCHAR(50) DEFAULT 'system',
        priority VARCHAR(20) DEFAULT 'normal',
        link VARCHAR(500) DEFAULT '',
        is_read TINYINT DEFAULT 0,
        read_time DATETIME NULL,
        is_archived TINYINT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_is_read (is_read),
        INDEX idx_is_archived (is_archived),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `
    await query(sql)

    // 检查并添加 is_archived 字段（兼容旧表）
    try {
      await query(`ALTER TABLE ${this.tableName} ADD COLUMN is_archived TINYINT DEFAULT 0 AFTER read_time`)
    } catch (e) {
      // 字段已存在，忽略
    }

    // 检查并添加国际化字段（兼容旧表）
    try {
      await query(`ALTER TABLE ${this.tableName} ADD COLUMN title_key VARCHAR(100) DEFAULT '' AFTER content`)
    } catch (e) {}
    try {
      await query(`ALTER TABLE ${this.tableName} ADD COLUMN title_params TEXT AFTER title_key`)
    } catch (e) {}
    try {
      await query(`ALTER TABLE ${this.tableName} ADD COLUMN content_key VARCHAR(100) DEFAULT '' AFTER title_params`)
    } catch (e) {}
    try {
      await query(`ALTER TABLE ${this.tableName} ADD COLUMN content_params TEXT AFTER content_key`)
    } catch (e) {}

    // 修改 title 和 content 字段，允许 NULL（兼容旧表）
    try {
      await query(`ALTER TABLE ${this.tableName} MODIFY COLUMN title VARCHAR(255) DEFAULT NULL`)
    } catch (e) {}
    try {
      await query(`ALTER TABLE ${this.tableName} MODIFY COLUMN content TEXT DEFAULT NULL`)
    } catch (e) {}
  }

  /** 查询用户未读通知数量 */
  async getUnreadCount(userId) {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = ? AND is_read = 0 AND is_archived = 0`
    const rows = await query(sql, [userId])
    return rows[0]?.count || 0
  }

  /**
   * 查询用户通知列表
   * @param {number} userId - 用户ID
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {number} params.isRead - 是否已读（0/1，空表示全部）
   * @param {string} params.type - 通知类型
   * @param {string} params.priority - 优先级
   * @param {string} params.startDate - 开始日期
   * @param {string} params.endDate - 结束日期
   * @param {number} params.isArchived - 是否归档（0/1，默认0）
   * @param {string} params.keyword - 搜索关键词
   */
  async getByUserId(userId, params = {}) {
    const page = Number(params.page) || 1
    const pageSize = Number(params.pageSize) || 20
    const offset = (page - 1) * pageSize
    let where = 'WHERE user_id = ?'
    const queryParams = [userId]

    // 已读状态筛选
    if (params.isRead !== undefined && params.isRead !== null && params.isRead !== '') {
      where += ' AND is_read = ?'
      queryParams.push(params.isRead)
    }

    // 类型筛选
    if (params.type) {
      where += ' AND type = ?'
      queryParams.push(params.type)
    }

    // 优先级筛选
    if (params.priority) {
      where += ' AND priority = ?'
      queryParams.push(params.priority)
    }

    // 时间范围筛选
    if (params.startDate) {
      where += ' AND created_at >= ?'
      queryParams.push(params.startDate + ' 00:00:00')
    }
    if (params.endDate) {
      where += ' AND created_at <= ?'
      queryParams.push(params.endDate + ' 23:59:59')
    }

    // 归档状态筛选（默认查询未归档）
    const isArchived = params.isArchived !== undefined ? Number(params.isArchived) : 0
    where += ' AND is_archived = ?'
    queryParams.push(isArchived)

    // 关键词搜索
    if (params.keyword) {
      where += ' AND (title LIKE ? OR content LIKE ?)'
      queryParams.push(`%${params.keyword}%`, `%${params.keyword}%`)
    }

    const countSql = `SELECT COUNT(*) as total FROM ${this.tableName} ${where}`
    const countResult = await query(countSql, queryParams)

    const listSql = `SELECT * FROM ${this.tableName} ${where} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`
    const list = await query(listSql, queryParams)

    return {
      list,
      total: countResult[0]?.total || 0,
      page,
      pageSize
    }
  }

  /** 标记通知为已读 */
  async markAsRead(id, userId) {
    const sql = `UPDATE ${this.tableName} SET is_read = 1, read_time = NOW() WHERE id = ? AND user_id = ?`
    return await query(sql, [id, userId])
  }

  /** 标记所有通知为已读 */
  async markAllAsRead(userId) {
    const sql = `UPDATE ${this.tableName} SET is_read = 1, read_time = NOW() WHERE user_id = ? AND is_read = 0 AND is_archived = 0`
    return await query(sql, [userId])
  }

  /**
   * 批量标记为已读
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   * @param {number} maxCount - 最大操作数量，默认100
   */
  async batchMarkAsRead(userId, ids, maxCount = 100) {
    if (!ids || ids.length === 0) return { affectedRows: 0 }
    if (ids.length > maxCount) {
      throw new Error(`单次批量操作不能超过${maxCount}条，当前${ids.length}条`)
    }
    const placeholders = ids.map(() => '?').join(',')
    const sql = `UPDATE ${this.tableName} SET is_read = 1, read_time = NOW() WHERE user_id = ? AND id IN (${placeholders})`
    return await query(sql, [userId, ...ids])
  }

  /** 删除通知 */
  async deleteByUser(id, userId) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ? AND user_id = ?`
    return await query(sql, [id, userId])
  }

  /**
   * 批量删除通知
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   * @param {number} maxCount - 最大操作数量，默认100
   */
  async batchDelete(userId, ids, maxCount = 100) {
    if (!ids || ids.length === 0) return { affectedRows: 0 }
    if (ids.length > maxCount) {
      throw new Error(`单次批量操作不能超过${maxCount}条，当前${ids.length}条`)
    }
    const placeholders = ids.map(() => '?').join(',')
    const sql = `DELETE FROM ${this.tableName} WHERE user_id = ? AND id IN (${placeholders})`
    return await query(sql, [userId, ...ids])
  }

  /**
   * 全部删除（清空用户所有通知）
   * @param {number} userId - 用户ID
   * @param {boolean} includeArchived - 是否包含已归档的通知
   */
  async deleteAll(userId, includeArchived = false) {
    let sql = `DELETE FROM ${this.tableName} WHERE user_id = ?`
    if (!includeArchived) {
      sql += ' AND is_archived = 0'
    }
    return await query(sql, [userId])
  }

  /**
   * 归档通知
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   * @param {number} maxCount - 最大操作数量，默认100
   */
  async archive(userId, ids, maxCount = 100) {
    if (!ids || ids.length === 0) return { affectedRows: 0 }
    if (ids.length > maxCount) {
      throw new Error(`单次批量操作不能超过${maxCount}条，当前${ids.length}条`)
    }
    const placeholders = ids.map(() => '?').join(',')
    const sql = `UPDATE ${this.tableName} SET is_archived = 1 WHERE user_id = ? AND id IN (${placeholders})`
    return await query(sql, [userId, ...ids])
  }

  /**
   * 恢复已归档的通知
   * @param {number} userId - 用户ID
   * @param {Array<number>} ids - 通知ID数组
   * @param {number} maxCount - 最大操作数量，默认100
   */
  async unarchive(userId, ids, maxCount = 100) {
    if (!ids || ids.length === 0) return { affectedRows: 0 }
    if (ids.length > maxCount) {
      throw new Error(`单次批量操作不能超过${maxCount}条，当前${ids.length}条`)
    }
    const placeholders = ids.map(() => '?').join(',')
    const sql = `UPDATE ${this.tableName} SET is_archived = 0 WHERE user_id = ? AND id IN (${placeholders})`
    return await query(sql, [userId, ...ids])
  }

  /**
   * 获取各类型通知数量统计
   * @param {number} userId - 用户ID
   */
  async getTypeStats(userId) {
    const sql = `
      SELECT type, COUNT(*) as count, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count
      FROM ${this.tableName}
      WHERE user_id = ? AND is_archived = 0
      GROUP BY type
    `
    return await query(sql, [userId])
  }
}

module.exports = new NotificationModel()
