/**
 * 用户管理模块 - 控制器层
 * 
 * 负责参数接收、调用 Service 层、返回统一响应
 * 参数校验全部由 validate 中间件在路由层完成，这里不做格式校验
 * 继承 BaseController，复用通用 CRUD 接口
 * 
 * 【审计日志】通过 auditLogger 统一记录，不直接引用 audit.service
 * 【GMP 合规】删除、批量删除等关键操作需要电子签名密码验证
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseController = require('../../controllers/BaseController')
const userService = require('./user.service')
const auditLogger = require('../audit/auditLogger')
const { getLangFromRequest } = require('../../utils/i18n')
const { triggerNotification } = require('../../services/notificationTrigger.service')

class UserController extends BaseController {
  /**
   * 构造函数
   * 初始化 BaseController，传入用户 Service 实例
   */
  constructor() {
    super(userService)
  }

  // ==================== 特殊功能接口 ====================

  /**
   * 用户登录
   * 
   * 验证用户名和密码，生成 JWT Token，记录登录审计日志
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {string} req.body.username - 用户名
   * @param {string} req.body.password - 密码（明文）
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body
      const ip = req.ip || req.connection.remoteAddress
      const userAgent = req.headers['user-agent'] || ''
      const lang = getLangFromRequest(req)
      const result = await userService.login(username, password, ip, userAgent, lang)
      res.success(result, '登录成功')
    } catch (err) {
      next(err)
    }
  }

  /**
   * 用户注册（公开接口）
   * 
   * 校验验证码后创建用户，默认角色为 operator，状态启用
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {string} req.body.username - 用户名
   * @param {string} req.body.password - 密码（明文）
   * @param {string} req.body.email - 邮箱
   * @param {string} [req.body.code] - 验证码
   * @param {string} [req.body.uuid] - 验证码 UUID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async register(req, res, next) {
    try {
      const result = await userService.register(req.body)
      // 记录注册审计
      await auditLogger.logUserRegister(req, '系统注册', `用户名: ${req.body.username || ''}`)
      res.success(result, '注册成功')
    } catch (err) {
      next(err)
    }
  }

  /**
   * 获取当前登录用户信息
   * 
   * 从 Token 中解析用户 ID，返回当前用户的详细信息
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息（由 auth 中间件注入）
   * @param {number} req.user.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getCurrentUser(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      const userInfo = await userService.getUserById(req.user.id, lang)
      res.success(userInfo)
    } catch (err) {
      next(err)
    }
  }

  // ==================== 通用 CRUD 接口（保留原有方法名，包含审计日志和电子签名） ====================

  /**
   * 分页查询用户列表（关联部门表）
   * 
   * 支持按用户名、角色、状态筛选，自动去掉密码字段
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.query - 查询参数
   * @param {number} [req.query.page=1] - 页码
   * @param {number} [req.query.pageSize=10] - 每页数量
   * @param {string} [req.query.username] - 用户名（模糊查询）
   * @param {string} [req.query.role] - 角色
   * @param {number} [req.query.status] - 状态 1启用 0禁用
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getUserList(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      const result = await userService.getUserList(req.query, lang)
      res.success(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 获取用户详情
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 用户 ID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getUserDetail(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      const userInfo = await userService.getUserById(req.params.id, lang)
      res.success(userInfo)
    } catch (err) {
      next(err)
    }
  }

  /**
   * 新增用户
   * 
   * 创建用户并记录审计日志，避免密码等敏感信息泄露
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {string} req.body.username - 用户名（唯一）
   * @param {string} req.body.password - 密码（明文，会自动加密）
   * @param {string} req.body.role - 角色
   * @param {string} [req.body.real_name] - 真实姓名
   * @param {number} [req.body.status=1] - 状态 1启用 0禁用
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async createUser(req, res, next) {
    try {
      const result = await userService.createUser(req.body)
      // 记录审计（易读文本格式，避免密码等敏感信息泄露）
      const statusText = req.body.status === 0 ? '禁用' : '启用'
      const newValueText = `用户名: ${req.body.username}, 角色: ${req.body.role}, 姓名: ${req.body.real_name || ''}, 状态: ${statusText}`
      await auditLogger.logUserCreate(req, req.body.username || '', newValueText)
      res.success(result, '新增用户成功')
    } catch (err) {
      next(err)
    }
  }

  /**
   * 更新用户
   * 
   * 更新用户信息并记录审计日志，包含修改前后的值对比
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 用户 ID
   * @param {Object} req.body - 请求体（更新数据）
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async updateUser(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      // 获取修改前的数据
      const oldUser = await userService.getUserById(req.params.id, lang).catch(() => null)
      await userService.updateUser(req.params.id, req.body)
      // 记录审计（易读文本格式）
      const oldStatusText = oldUser?.status === 0 ? '禁用' : '启用'
      const newStatusText = req.body.status !== undefined ? (req.body.status === 0 ? '禁用' : '启用') : '未变更'
      const oldValueText = oldUser ? `角色: ${oldUser.role}, 姓名: ${oldUser.real_name || ''}, 状态: ${oldStatusText}` : ''
      const newValueText = `角色: ${req.body.role || '未变更'}, 姓名: ${req.body.real_name || '未变更'}, 状态: ${newStatusText}`
      await auditLogger.logUserUpdate(req, oldUser?.username || req.params.id, oldValueText, newValueText)

      // 触发通知：用户信息修改（通知管理员）
      const isSelfUpdate = req.user.id === Number(req.params.id)
      const eventType = isSelfUpdate ? 'user.profile.update' : 'user.profile.update'
      triggerNotification(eventType, {
        username: oldUser?.username || req.params.id,
        operator: req.user.username
      }, req.user.id).catch(err => {
        console.error('[用户更新] 触发通知失败:', err)
      })

      res.success(null, '更新用户成功')
    } catch (err) {
      next(err)
    }
  }

  /**
   * 删除用户（GMP：需电子签名密码验证）
   * 
   * 删除用户前需要验证当前登录用户的密码（电子签名），符合 GMP 21CFR Part 11 要求
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 用户 ID
   * @param {Object} req.body - 请求体
   * @param {string} req.body.password - 当前用户密码（电子签名）
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 当前用户 ID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async deleteUser(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      // 电子签名：验证当前用户密码
      const { password } = req.body
      if (!password) {
        return res.error('电子签名：请输入密码确认')
      }
      const passwordValid = await userService.verifyPassword(req.user.id, password)
      if (!passwordValid) {
        return res.error('电子签名失败：密码错误')
      }

      const oldUser = await userService.getUserById(req.params.id, lang).catch(() => null)
      await userService.deleteUser(req.params.id)
      // 记录审计（易读文本格式，避免密码等敏感信息泄露）
      const statusText = oldUser?.status === 0 ? '禁用' : '启用'
      const oldValueText = oldUser ? `用户名: ${oldUser.username}, 角色: ${oldUser.role}, 姓名: ${oldUser.real_name || ''}, 状态: ${statusText}` : ''
      await auditLogger.logUserDelete(req, oldUser?.username || req.params.id, oldValueText)
      res.success(null, '删除用户成功')
    } catch (err) {
      next(err)
    }
  }

  /**
   * 批量删除用户（GMP：需电子签名密码验证）
   * 
   * 批量删除用户前需要验证当前登录用户的密码（电子签名），符合 GMP 21CFR Part 11 要求
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {Array<number>} req.body.ids - 用户 ID 数组
   * @param {string} req.body.password - 当前用户密码（电子签名）
   * @param {Object} req.user - 当前登录用户信息
   * @param {number} req.user.id - 当前用户 ID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async batchDeleteUsers(req, res, next) {
    try {
      // 电子签名：验证当前用户密码
      const { password } = req.body
      if (!password) {
        return res.error('电子签名：请输入密码确认')
      }
      const passwordValid = await userService.verifyPassword(req.user.id, password)
      if (!passwordValid) {
        return res.error('电子签名失败：密码错误')
      }

      await userService.batchDeleteUsers(req.body.ids)
      // 记录审计
      await auditLogger.logUserBatchDelete(req, `ID: ${(req.body.ids || []).join(', ')}`, '')
      res.success(null, '批量删除成功')
    } catch (err) {
      next(err)
    }
  }

  /**
   * 修改用户状态
   * 
   * 启用或禁用用户账号，并记录审计日志
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 用户 ID
   * @param {Object} req.body - 请求体
   * @param {number} req.body.status - 状态 1启用 0禁用
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async updateUserStatus(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      const oldUser = await userService.getUserById(req.params.id, lang).catch(() => null)
      await userService.updateUserStatus(req.params.id, req.body.status)
      // 记录审计
      await auditLogger.logUserStatusChange(
        req,
        oldUser?.username || req.params.id,
        oldUser?.status !== undefined ? String(oldUser.status) : '',
        String(req.body.status)
      )
      res.success(null, '状态修改成功')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new UserController()
