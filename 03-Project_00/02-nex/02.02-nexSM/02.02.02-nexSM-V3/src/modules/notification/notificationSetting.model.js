/**
 * 用户通知设置模块 - 数据模型层
 * 
 * 存储每个用户的个性化通知设置：
 * - 通知类型开关（哪些类型的通知需要推送）
 * - 免打扰时间段
 * - 通知声音开关
 * - 弹窗提醒开关
 */
const BaseModel = require('../../db/BaseModel')
const { query } = require('../../db/index')

class NotificationSettingModel extends BaseModel {
  constructor() {
    super('nex_notification_setting', ['user_id', 'settings'], 'id')
  }

  /**
   * 确保表结构存在
   */
  async ensureTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        settings TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `
    await query(sql)
  }

  /**
   * 默认通知设置
   */
  getDefaultSettings() {
    return {
      // 通知类型开关
      typeEnabled: {
        system: true,      // 系统设置通知
        plc: true,         // 设备管理通知
        user: true,        // 用户管理通知
        audit: true,       // 审计追踪通知
        device: true,      // 设备参数通知
        connection: true   // 连接配置通知
      },
      // 免打扰时间段
      doNotDisturb: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      // 通知声音
      soundEnabled: true,
      // 弹窗提醒
      popupEnabled: true
    }
  }

  /**
   * 获取用户通知设置
   * @param {number} userId - 用户ID
   */
  async getByUserId(userId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ?`
    const rows = await query(sql, [userId])

    if (rows.length === 0) {
      // 不存在则创建默认设置
      const defaultSettings = this.getDefaultSettings()
      await this.create(userId, defaultSettings)
      return { user_id: userId, settings: defaultSettings }
    }

    const row = rows[0]
    let settings = this.getDefaultSettings()
    try {
      settings = { ...settings, ...JSON.parse(row.settings) }
    } catch (e) {
      // 解析失败，使用默认设置
    }

    return { ...row, settings }
  }

  /**
   * 创建用户通知设置
   * @param {number} userId - 用户ID
   * @param {Object} settings - 设置对象
   */
  async create(userId, settings) {
    const sql = `INSERT INTO ${this.tableName} (user_id, settings) VALUES (?, ?)`
    return await query(sql, [userId, JSON.stringify(settings)])
  }

  /**
   * 更新用户通知设置
   * @param {number} userId - 用户ID
   * @param {Object} settings - 设置对象（会与现有设置合并）
   */
  async update(userId, settings) {
    // 先获取现有设置
    const existing = await this.getByUserId(userId)
    const mergedSettings = { ...existing.settings, ...settings }

    const sql = `UPDATE ${this.tableName} SET settings = ? WHERE user_id = ?`
    return await query(sql, [JSON.stringify(mergedSettings), userId])
  }
}

module.exports = new NotificationSettingModel()
