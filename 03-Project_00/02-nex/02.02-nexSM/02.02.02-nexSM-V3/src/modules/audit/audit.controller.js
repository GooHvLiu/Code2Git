/**
 * 审计日志模块 - 控制器层
 * 
 * 负责参数接收、调用 Service 层、返回统一响应
 * 继承 BaseController，重写 update/delete 方法抛出错误（审计日志不允许修改和删除）
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseController = require('../../controllers/BaseController')
const auditService = require('./audit.service')
const { ERROR_CODE } = require('../../constants/errorCode')
const { triggerNotification } = require('../../utils/notification')

class AuditController extends BaseController {
  /**
   * 构造函数
   * 初始化 BaseController，传入审计日志 Service 实例
   */
  constructor() {
    super(auditService)
  }

  // ==================== 特殊功能接口 ====================

  /**
   * 分页查询审计日志
   * 
   * GET /prod-api/v2/audit/list
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.query - 查询参数
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getList(req, res, next) {
    try {
      const result = await auditService.query(req.query)

      // 触发通知：审计日志被查看（通知管理员）
      triggerNotification('audit.log.view', {
        username: req.user?.username || '未知用户',
        query: JSON.stringify(req.query)
      }, req.user?.id).catch(err => {
        console.error('[审计日志查看] 触发通知失败:', err)
      })
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 查询当前用户的操作记录
   * 
   * GET /prod-api/v2/audit/my
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 用户 ID
   * @param {Object} req.query - 查询参数
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getMyLogs(req, res, next) {
    try {
      const userId = req.user?.id || req.user?.userId
      const result = await auditService.queryByUser(userId, req.query)
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 校验哈希链完整性（管理员）
   * 
   * GET /prod-api/v2/audit/verify
   * 验证所有审计日志是否被篡改，符合 GMP 21CFR Part 11 要求
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async verifyIntegrity(req, res, next) {
    try {
      const result = await auditService.verifyIntegrity()
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  // ==================== 重写 BaseController 方法（审计日志不允许修改和删除） ====================

  /**
   * 创建审计日志（内部调用，不对外暴露接口）
   * 
   * 审计日志由各业务模块内部调用创建，不提供对外的创建接口
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async create(req, res) {
    res.error(ERROR_CODE.AUDIT_NOT_MODIFIABLE)
  }

  /**
   * 更新审计日志（不允许）
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async update(req, res) {
    res.error(ERROR_CODE.AUDIT_NOT_MODIFIABLE)
  }

  /**
   * 删除审计日志（不允许）
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async delete(req, res) {
    res.error(ERROR_CODE.AUDIT_NOT_DELETABLE)
  }
}

module.exports = new AuditController()
