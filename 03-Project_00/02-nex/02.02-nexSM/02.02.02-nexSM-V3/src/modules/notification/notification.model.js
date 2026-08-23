/**
 * 通知中心模块 - 数据模型层
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

class NotificationModel extends BaseModel {
  constructor() {
    super('nex_notification', ['user_id', 'title', 'content', 'type', 'priority', 'link', 'is_read', 'read_time'], 'id')
  }

  /** 查询用户未读通知数量 */
  async getUnreadCount(userId) {
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE user_id = ? AND is_read = 0`
    const rows = await query(sql, [userId])
    return rows[0]?.count || 0
  }

  /** 查询用户通知列表 */
  async getByUserId(userId, params = {}) {
    const page = Number(params.page) || 1
    const pageSize = Number(params.pageSize) || 20
    const offset = (page - 1) * pageSize
    let where = 'WHERE user_id = ?'
    const queryParams = [userId]

    if (params.isRead !== undefined && params.isRead !== null && params.isRead !== '') {
      where += ' AND is_read = ?'
      queryParams.push(params.isRead)
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
    const sql = `UPDATE ${this.tableName} SET is_read = 1, read_time = NOW() WHERE user_id = ? AND is_read = 0`
    return await query(sql, [userId])
  }

  /** 删除通知 */
  async deleteByUser(id, userId) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ? AND user_id = ?`
    return await query(sql, [id, userId])
  }
}

module.exports = new NotificationModel()
