/**
 * 用户在线设备模块 - 数据模型层
 *
 * 用于客户端授权（限制在线人数）和设备管理
 * 记录用户的在线设备信息，支持查询在线设备数、记录设备信息、更新设备状态等
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

// 数据表名称
const TABLE_NAME = 'nex_user_device'

// 允许操作的字段白名单
const ALLOW_FIELDS = [
  'user_id',
  'device_id',
  'device_name',
  'ip',
  'user_agent',
  'login_time',
  'last_active_time',
  'status'
]

class UserDeviceModel extends BaseModel {
  constructor() {
    super(TABLE_NAME, ALLOW_FIELDS)
  }

  /**
   * 确保表结构存在
   */
  async ensureTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        device_id VARCHAR(100) NOT NULL,
        device_name VARCHAR(255) DEFAULT '',
        ip VARCHAR(50) DEFAULT '',
        user_agent TEXT,
        login_time DATETIME DEFAULT NULL,
        last_active_time DATETIME DEFAULT NULL,
        status TINYINT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_device_id (device_id),
        INDEX idx_status (status),
        UNIQUE KEY uk_user_device (user_id, device_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `
    await query(sql)
  }

  /**
   * 查询用户的在线设备数
   * @param {number} userId - 用户ID
   * @returns {Promise<number>} 在线设备数
   */
  async getOnlineDeviceCount(userId) {
    const sql = `SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE user_id = ? AND status = 1`
    const rows = await query(sql, [userId])
    return rows[0]?.count || 0
  }

  /**
   * 查询整个系统的在线设备总数（所有用户）
   * @returns {Promise<number>} 在线设备总数
   */
  async getTotalOnlineDeviceCount() {
    const sql = `SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE status = 1`
    const rows = await query(sql)
    return rows[0]?.count || 0
  }

  /**
   * 查询排除指定用户后的在线设备总数
   * 用于登录时检查设备数限制（当前用户的旧设备马上会被踢掉，所以排除）
   * @param {number} excludeUserId - 要排除的用户ID
   * @returns {Promise<number>} 在线设备总数（排除指定用户）
   */
  async getTotalOnlineDeviceCountExcludeUser(excludeUserId) {
    const sql = `SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE status = 1 AND user_id != ?`
    const rows = await query(sql, [excludeUserId])
    return rows[0]?.count || 0
  }

  /**
   * 查询用户的在线设备列表
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 在线设备列表
   */
  async getOnlineDevices(userId) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE user_id = ? AND status = 1 ORDER BY last_active_time DESC`
    return await query(sql, [userId])
  }

  /**
   * 查询所有用户的设备列表（管理员）
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=20] - 每页数量
   * @param {number} [params.userId] - 用户ID筛选
   * @param {string} [params.keyword] - 搜索关键词（设备名称、IP、用户名、真实姓名）
   * @param {number} [params.status] - 状态筛选（1=在线，0=离线，不传=全部）
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getAllOnlineDevices(params = {}) {
    const page = Number(params.page) || 1
    const pageSize = Number(params.pageSize) || 20
    const offset = (page - 1) * pageSize
    let where = 'WHERE 1=1'
    const queryParams = []

    // 状态筛选（1=在线，0=离线，不传=全部）
    if (params.status !== undefined && params.status !== '' && params.status !== null) {
      where += ' AND d.status = ?'
      queryParams.push(Number(params.status))
    }

    // 用户ID筛选
    if (params.userId) {
      where += ' AND d.user_id = ?'
      queryParams.push(params.userId)
    }

    // 关键词搜索（设备名称、IP、用户名、真实姓名）
    if (params.keyword) {
      where += ' AND (d.device_name LIKE ? OR d.ip LIKE ? OR u.username LIKE ? OR u.real_name LIKE ?)'
      const keyword = `%${params.keyword}%`
      queryParams.push(keyword, keyword, keyword, keyword)
    }

    const countSql = `SELECT COUNT(*) as total FROM ${TABLE_NAME} d LEFT JOIN nex_user u ON d.user_id = u.id ${where}`
    const countResult = await query(countSql, queryParams)

    const listSql = `
      SELECT d.*, u.username, u.real_name, u.role
      FROM ${TABLE_NAME} d
      LEFT JOIN nex_user u ON d.user_id = u.id
      ${where}
      ORDER BY d.last_active_time DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `
    const list = await query(listSql, queryParams)

    return {
      list,
      total: countResult[0]?.total || 0,
      page,
      pageSize
    }
  }

  /**
   * 根据用户ID和设备ID查询设备记录
   * @param {number} userId - 用户ID
   * @param {string} deviceId - 设备ID
   * @returns {Promise<Object|null>} 设备记录
   */
  async getByUserIdAndDeviceId(userId, deviceId) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE user_id = ? AND device_id = ?`
    const rows = await query(sql, [userId, deviceId])
    return rows[0] || null
  }

  /**
   * 记录或更新设备信息（登录时调用）
   * 如果设备记录不存在，创建新记录；如果存在，更新状态为在线
   * @param {Object} deviceInfo - 设备信息
   * @param {number} deviceInfo.userId - 用户ID
   * @param {string} deviceInfo.deviceId - 设备ID
   * @param {string} [deviceInfo.deviceName] - 设备名称
   * @param {string} [deviceInfo.ip] - 登录IP
   * @param {string} [deviceInfo.userAgent] - User-Agent
   * @returns {Promise<Object>} 设备记录
   */
  async upsertDevice(deviceInfo) {
    const { userId, deviceId, deviceName = '', ip = '', userAgent = '' } = deviceInfo
    const now = new Date()

    // 先查询是否存在
    const existing = await this.getByUserIdAndDeviceId(userId, deviceId)

    if (existing) {
      // 更新现有记录时，不覆盖 device_name 和 user_agent（只在第一次创建时保存）
      await this.update(existing.id, {
        ip: ip,
        login_time: now,
        last_active_time: now,
        status: 1
      })
      return await this.getById(existing.id)
    } else {
      // 创建新记录
      const result = await this.create({
        user_id: userId,
        device_id: deviceId,
        device_name: deviceName,
        ip: ip,
        user_agent: userAgent,
        login_time: now,
        last_active_time: now,
        status: 1
      })
      return await this.getById(result.insertId)
    }
  }

  /**
   * 更新设备最后活跃时间（心跳时调用）
   * @param {number} userId - 用户ID
   * @param {string} deviceId - 设备ID
   * @returns {Promise<void>}
   */
  async updateLastActiveTime(userId, deviceId) {
    const sql = `UPDATE ${TABLE_NAME} SET last_active_time = NOW() WHERE user_id = ? AND device_id = ?`
    await query(sql, [userId, deviceId])
  }

  /**
   * 设置设备离线（WebSocket断开时调用）
   * @param {number} userId - 用户ID
   * @param {string} deviceId - 设备ID
   * @returns {Promise<void>}
   */
  async setDeviceOffline(userId, deviceId) {
    const sql = `UPDATE ${TABLE_NAME} SET status = 0 WHERE user_id = ? AND device_id = ?`
    await query(sql, [userId, deviceId])
  }

  /**
   * 把设备设置为离线
   * @param {number} [userId] - 用户ID（可选，不传则清理所有用户的设备）
   * @returns {Promise<void>}
   */
  async setAllDevicesOffline(userId) {
    if (userId) {
      const sql = `UPDATE ${TABLE_NAME} SET status = 0 WHERE user_id = ?`
      await query(sql, [userId])
    } else {
      const sql = `UPDATE ${TABLE_NAME} SET status = 0`
      await query(sql)
    }
  }

  /**
   * 根据最后活跃时间阈值，把超时的设备设置为离线
   * @param {number} thresholdMs - 离线阈值（毫秒），超过此时间未活跃则视为离线
   * @returns {Promise<number>} 被设置为离线的设备数
   */
  async markOfflineDevicesByThreshold(thresholdMs) {
    const seconds = Math.floor(thresholdMs / 1000)
    const sql = `UPDATE ${TABLE_NAME} SET status = 0 WHERE status = 1 AND last_active_time < DATE_SUB(NOW(), INTERVAL ? SECOND)`
    const result = await query(sql, [seconds])
    return result.affectedRows || 0
  }

  /**
   * 获取设备状态统计
   * @returns {Promise<Object>} { total, online, offline, onlineUsers }
   */
  async getDeviceStatusSummary() {
    const sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as online,
        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as offline,
        COUNT(DISTINCT CASE WHEN status = 1 THEN user_id END) as onlineUsers
      FROM ${TABLE_NAME}
    `
    const rows = await query(sql)
    const row = rows[0] || {}
    return {
      total: row.total || 0,
      online: row.online || 0,
      offline: row.offline || 0,
      onlineUsers: row.onlineUsers || 0
    }
  }

  /**
   * 踢掉指定设备（管理员操作）
   * @param {number} id - 设备记录ID
   * @returns {Promise<void>}
   */
  async kickDevice(id) {
    const sql = `UPDATE ${TABLE_NAME} SET status = 0 WHERE id = ?`
    await query(sql, [id])
  }

  /**
   * 清理超时离线的设备记录（可选，定期清理）
   * @param {number} days - 保留天数，默认7天
   * @returns {Promise<number>} 删除的记录数
   */
  async cleanOfflineDevices(days = 7) {
    const sql = `DELETE FROM ${TABLE_NAME} WHERE status = 0 AND last_active_time < DATE_SUB(NOW(), INTERVAL ? DAY)`
    const result = await query(sql, [days])
    return result.affectedRows || 0
  }
}

module.exports = new UserDeviceModel()
