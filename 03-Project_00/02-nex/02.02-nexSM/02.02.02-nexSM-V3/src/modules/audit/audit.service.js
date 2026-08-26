/**
 * 审计日志模块 - 业务逻辑层
 *
 * GMP 21CFR Part 11 电子记录合规
 * 特性：哈希链防篡改、只增不改不删
 * 继承 BaseService，重写 update/delete 方法抛出错误（审计日志不允许修改和删除）
 *
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-26
 */
const BaseService = require('../../services/BaseService')
const auditModel = require('./audit.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class AuditService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，传入审计日志模型和配置
   * 审计日志没有多语言字段
   */
  constructor() {
    super(auditModel, {
      name: '审计日志',
      langFields: []
    })
  }

  // ==================== 特殊功能方法 ====================

  /**
   * 创建审计日志（自动计算哈希链）
   *
   * 审计日志写入失败不影响主业务，但会记录错误
   *
   * @param {Object} log - 日志信息
   * @param {number} [log.userId=0] - 操作人 ID
   * @param {string} [log.userName=''] - 操作人姓名
   * @param {string} [log.action=''] - 操作类型
   * @param {string} [log.target=''] - 操作对象
   * @param {string} [log.oldValue=''] - 修改前值
   * @param {string} [log.newValue=''] - 修改后值
   * @param {string} [log.result='success'] - 操作结果
   * @param {string} [log.reason=''] - 操作原因
   * @param {string} [log.ip=''] - 操作 IP
   * @param {string} [log.userAgent=''] - 浏览器 UA
   * @returns {Promise<Object|null>} 创建结果，失败返回 null
   */
  async create(log) {
    try {
      const data = {
        user_id: log.userId || 0,
        user_name: log.userName || '',
        action: log.action || '',
        target: log.target || '',
        old_value: log.oldValue !== undefined ? log.oldValue : '',
        new_value: log.newValue !== undefined ? log.newValue : '',
        result: log.result || 'success',
        reason: log.reason || '',
        ip: log.ip || '',
        user_agent: log.userAgent || '',
        created_at: new Date()
      }
      return await auditModel.insertWithHash(data)
    } catch (err) {
      console.error('[审计日志] 写入失败:', err.message)
      // 审计日志写入失败不影响主业务，但记录错误
      return null
    }
  }

  /**
   * 分页查询审计日志
   *
   * @param {Object} [params={}] - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {string} [params.userName] - 操作人姓名（模糊查询）
   * @param {string} [params.action] - 操作类型
   * @param {string} [params.target] - 操作对象（模糊查询）
   * @param {string} [params.startTime] - 开始时间
   * @param {string} [params.endTime] - 结束时间
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async query(params = {}) {
    return await auditModel.queryLogs(params)
  }

  /**
   * 查询指定用户的操作记录
   *
   * @param {number} userId - 用户 ID
   * @param {Object} [params={}] - 查询参数
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async queryByUser(userId, params = {}) {
    return await auditModel.queryLogs({ ...params, userId })
  }

  /**
   * 查询指定操作类型的记录
   *
   * @param {string} action - 操作类型
   * @param {Object} [params={}] - 查询参数
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async queryByAction(action, params = {}) {
    return await auditModel.queryLogs({ ...params, action })
  }

  /**
   * 校验哈希链完整性（GMP 合规要求）
   *
   * 验证所有审计日志是否被篡改，返回校验结果和被篡改的记录列表
   *
   * @returns {Promise<Object>} { valid, totalCount, tamperedCount, tamperedRecords }
   */
  async verifyIntegrity() {
    return await auditModel.verifyHashChain()
  }

  // ==================== 重写 BaseService 方法（审计日志不允许修改和删除） ====================

  /**
   * 更新审计日志（不允许）
   *
   * 审计日志只增不改不删，符合 GMP 21CFR Part 11 要求
   *
   * @throws {BusinessError} 审计日志不允许修改
   */
  async update() {
    throw new BusinessError(ERROR_CODE.AUDIT_NOT_MODIFIABLE, '审计日志不允许修改')
  }

  /**
   * 删除审计日志（不允许）
   *
   * 审计日志只增不改不删，符合 GMP 21CFR Part 11 要求
   *
   * @throws {BusinessError} 审计日志不允许删除
   */
  async delete() {
    throw new BusinessError(ERROR_CODE.AUDIT_NOT_DELETABLE, '审计日志不允许删除')
  }

  /**
   * 批量删除审计日志（不允许）
   *
   * 审计日志只增不改不删，符合 GMP 21CFR Part 11 要求
   *
   * @throws {BusinessError} 审计日志不允许删除
   */
  async batchDelete() {
    throw new BusinessError(ERROR_CODE.AUDIT_NOT_DELETABLE, '审计日志不允许删除')
  }
}

module.exports = new AuditService()
