/**
 * 审计日志模块 - 业务逻辑层
 * GMP 21CFR Part 11 电子记录合规
 */
const auditModel = require('./audit.model');

class AuditService {
  /**
   * 创建审计日志
   * @param {Object} log - 日志信息
   * @param {number} log.userId - 操作人ID
   * @param {string} log.userName - 操作人姓名
   * @param {string} log.action - 操作类型（如：PLC参数修改、用户登录、数据导出）
   * @param {string} log.target - 操作对象
   * @param {string} log.oldValue - 修改前值
   * @param {string} log.newValue - 修改后值
   * @param {string} log.result - 操作结果（success/failed）
   * @param {string} log.ip - 操作IP
   * @param {string} log.userAgent - 浏览器UA
   */
  async create(log) {
    try {
      // 转换为数据库字段名（下划线）
      const data = {
        user_id: log.userId,
        user_name: log.userName,
        action: log.action,
        target: log.target,
        old_value: log.oldValue,
        new_value: log.newValue,
        result: log.result,
        ip: log.ip,
        user_agent: log.userAgent,
        created_at: new Date()
      }
      const safeData = auditModel.filterFields(data)
      return await auditModel.create(safeData)
    } catch (err) {
      console.error('[审计日志] 写入失败:', err.message)
      // 审计日志写入失败不影响主业务
      return null
    }
  }

  /**
   * 分页查询审计日志
   */
  async query(params = {}) {
    return await auditModel.queryLogs(params);
  }

  /**
   * 查询指定用户的操作记录
   */
  async queryByUser(userId, params = {}) {
    return await auditModel.queryLogs({ ...params, userId });
  }

  /**
   * 查询指定操作类型的记录
   */
  async queryByAction(action, params = {}) {
    return await auditModel.queryLogs({ ...params, action });
  }
}

module.exports = new AuditService();
