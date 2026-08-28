/**
 * 用户管理模块 - 业务逻辑层
 * 
 * 处理用户的登录、注册、增删改查、密码重置、状态变更等业务逻辑
 * 包含登录失败锁定、电子签名密码验证、审计日志记录等特殊功能
 * 继承 BaseService，复用通用 CRUD 操作
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseService = require('../../services/BaseService')
const userModel = require('./user.model')
const { hashPassword, comparePassword } = require('../../utils/password')
const { generateToken } = require('../../utils/jwt')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')
const { USER_STATUS, USER_ROLE } = require('../../constants/statusCode')
const CaptchaService = require('../captcha/captcha.service')
const auditLogger = require('../audit/auditLogger')
const { triggerNotification } = require('../../services/notificationTrigger.service')
const permissionService = require('../permission/permission.service')

// 登录失败锁定配置
const MAX_LOGIN_ATTEMPTS = 5       // 最大失败次数
const LOCK_DURATION = 30 * 60 * 1000 // 锁定时长 30 分钟
// 内存存储登录失败次数（生产环境建议用 Redis）
const loginAttempts = new Map()

class UserService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，传入用户模型和配置
   */
  constructor() {
    super(userModel, {
      name: '用户',
      langFields: [] // 用户模块没有需要多语言处理的字段
    })
  }

  // ==================== 特殊功能方法 ====================

  /**
   * 用户登录
   * 
   * 包含账户锁定检查、密码校验、登录失败次数统计、Token 生成、登录信息更新、审计日志记录
   * 连续失败 5 次会锁定账户 30 分钟
   * 
   * @param {string} username - 用户名
   * @param {string} password - 密码（明文）
   * @param {string} ip - 登录 IP 地址
   * @param {string} [userAgent=''] - 浏览器 User-Agent
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { token, userInfo }
   * @throws {BusinessError} 用户不存在/账号禁用/密码错误/账户锁定
   * 
   * @example
   * const result = await userService.login('admin', '123456', '127.0.0.1', 'Mozilla/5.0')
   * console.log(result.token) // JWT Token
   * console.log(result.userInfo) // 用户信息（不含密码）
   */
  async login(username, password, ip, userAgent = '', lang = 'zh-CN') {
    // 0. 检查账户是否被锁定
    const lockKey = `lock:${username}`
    const locked = loginAttempts.get(lockKey)
    if (locked && locked.until > Date.now()) {
      const remainMin = Math.ceil((locked.until - Date.now()) / 60000)
      throw new BusinessError(ERROR_CODE.USER_LOCKED, `账户已锁定，请 ${remainMin} 分钟后再试`, { minutes: remainMin })
    }

    // 1. 查询用户（关联角色表获取 data_scope）
    const user = await userModel.getByUsernameWithRole(username, lang)
    if (!user) {
      // 记录登录失败审计
      await auditLogger.log({ userId: 0, userName: username, ip, userAgent }, {
        action: auditLogger.ACTION.USER_LOGIN_FAILED,
        target: '系统登录',
        result: 'failed',
        reason: '用户不存在'
      })
      throw new BusinessError(ERROR_CODE.USER_NOT_FOUND, '用户不存在')
    }

    // 2. 校验状态
    if (user.status === USER_STATUS.DISABLED) {
      await auditLogger.log({ userId: user.id, userName: user.username, ip, userAgent }, {
        action: auditLogger.ACTION.USER_LOGIN_FAILED,
        target: '系统登录',
        result: 'failed',
        reason: '账号已禁用'
      })
      throw new BusinessError(ERROR_CODE.USER_DISABLED, '账号已被禁用')
    }

    // 3. 校验密码
    const passwordValid = await comparePassword(password, user.password)
    if (!passwordValid) {
      // 记录失败次数
      const attemptKey = `attempt:${username}`
      const attempts = (loginAttempts.get(attemptKey) || 0) + 1
      loginAttempts.set(attemptKey, attempts)

      let reason = '密码错误'
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        // 锁定账户
        loginAttempts.set(lockKey, { until: Date.now() + LOCK_DURATION })
        loginAttempts.delete(attemptKey)
        reason = `密码错误 ${attempts} 次，账户已锁定 30 分钟`
      }

      await auditLogger.log({ userId: user.id, userName: user.username, ip, userAgent }, {
        action: auditLogger.ACTION.USER_LOGIN_FAILED,
        target: '系统登录',
        result: 'failed',
        reason
      })
      throw new BusinessError(ERROR_CODE.USER_PASSWORD_ERROR, reason, { reason: reason })
    }

    // 登录成功，清除失败记录
    loginAttempts.delete(`attempt:${username}`)
    loginAttempts.delete(`lock:${username}`)

    // 4. 生成token（包含 data_scope 和 dept_id，用于数据权限中间件）
    const token = generateToken({
      id: user.id,
      username: user.username,
      realName: user.real_name,
      role: user.role,
      data_scope: user.data_scope || 'self',
      dept_id: user.dept_id || null
    })

    // 5. 更新登录信息
    await userModel.updateLoginInfo(user.id, ip)

    // 6. 记录登录成功审计
    await auditLogger.log({ userId: user.id, userName: user.username, ip, userAgent }, {
      action: auditLogger.ACTION.USER_LOGIN,
      target: '系统登录',
      result: 'success'
    })

    // 7. 返回用户信息（去掉密码）
    const { password: _, ...userInfo } = user

    // 8. 查询用户权限码列表和权限版本号
    const permissions = await permissionService.getUserPermissions(user.id)
    const permissionVersion = await permissionService.getUserPermissionVersion(user.id)

    return {
      token,
      userInfo,
      permissions,
      permissionVersion
    }
  }

  /**
   * 用户注册（公开接口）
   * 
   * 校验验证码后创建用户，默认角色为 operator，状态启用
   * 
   * @param {Object} data - 注册数据
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码（明文）
   * @param {string} data.email - 邮箱
   * @param {string} [data.code] - 验证码
   * @param {string} [data.uuid] - 验证码 UUID
   * @returns {Promise<Object>} { id }
   * @throws {BusinessError} 验证码错误/用户名已存在
   */
  async register(data) {
    // 1. 校验验证码
    if (data.code && data.uuid) {
      const captchaResult = CaptchaService.verifyCaptcha(data.code, data.uuid)
      if (captchaResult.code !== ERROR_CODE.SUCCESS) {
        throw new BusinessError(captchaResult.code, captchaResult.msg)
      }
    }

    // 2. 调用 createUser（默认角色 operator，状态启用）
    const result = await this.createUser({
      username: data.username,
      password: data.password,
      email: data.email,
      role: USER_ROLE.OPERATOR,
      status: USER_STATUS.ENABLED
    })

    // 3. 触发通知：新用户注册（通知管理员）
    triggerNotification('user.register', { username: data.username }, result.id).catch(err => {
      console.error('[用户注册] 触发通知失败:', err)
    })

    return result
  }

  /**
   * 验证用户密码（用于电子签名/GMP 合规）
   * 
   * 在删除用户、修改关键参数等操作前，需要验证当前用户的密码
   * 
   * @param {number} userId - 用户 ID
   * @param {string} password - 明文密码
   * @returns {Promise<boolean>} 密码是否正确
   */
  async verifyPassword(userId, password) {
    const user = await userModel.getById(userId)
    if (!user || !user.password) {
      return false
    }
    return await comparePassword(password, user.password)
  }

  // ==================== 通用 CRUD 方法（保留原有方法名，内部调用父类方法） ====================

  /**
   * 分页查询用户列表（关联部门表获取部门名称）
   * 
   * 支持按用户名、角色、状态筛选，自动去掉密码字段
   * 
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {string} [params.username] - 用户名（模糊查询）
   * @param {string} [params.role] - 角色
   * @param {number} [params.status] - 状态 1启用 0禁用
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getUserList(params, lang = 'zh-CN') {
    const page = parseInt(params.page) || 1
    const pageSize = parseInt(params.pageSize) || 10

    const result = await userModel.getUserListWithDept(params, page, pageSize, lang)

    // 去掉密码字段，避免敏感信息泄露
    result.list = result.list.map(item => {
      const { password, ...rest } = item
      return rest
    })

    return result
  }

  /**
   * 获取单个用户详情（关联部门表获取部门名称）
   * 
   * 自动去掉密码字段
   * 
   * @param {number} id - 用户 ID
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} 用户信息（不含密码）
   * @throws {BusinessError} 用户不存在
   */
  async getUserById(id, lang = 'zh-CN') {
    const user = await userModel.getByIdWithDept(id, lang)
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_FOUND, '用户不存在')
    }
    const { password, ...userInfo } = user
    return userInfo
  }

  /**
   * 批量获取用户详情
   * 
   * @param {Array<number>} idArray - 用户 ID 数组
   * @returns {Promise<Array>} 用户信息数组（不含密码）
   */
  async getUserByIdArray(idArray) {
    // 批量查询 -> 用户数组
    const userList = await userModel.getByIdArray(idArray)
    // 校验：非数组 / 空数组 直接返回空数组
    if (!Array.isArray(userList) || userList.length === 0) return []
    // 剔除密码字段，返回干净数组
    const safeUserList = userList.map(user => {
      const { password, ...userInfo } = user
      return userInfo
    })
    return safeUserList
  }

  /**
   * 新增用户
   * 
   * 检查用户名是否已存在，加密密码，默认启用状态
   * 
   * @param {Object} data - 用户数据
   * @param {string} data.username - 用户名（唯一）
   * @param {string} data.password - 密码（明文，会自动加密）
   * @param {string} data.role - 角色
   * @param {string} [data.real_name] - 真实姓名
   * @param {number} [data.status=1] - 状态 1启用 0禁用
   * @returns {Promise<Object>} { id }
   * @throws {BusinessError} 用户名已存在
   */
  async createUser(data) {
    // 检查用户名是否存在
    const existUser = await userModel.getByUsername(data.username)
    if (existUser) {
      throw new BusinessError(ERROR_CODE.USER_USERNAME_EXISTS, '用户名已存在')
    }

    // 加密密码
    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    // 默认启用状态
    if (data.status === undefined) {
      data.status = USER_STATUS.ENABLED
    }

    const result = await userModel.create(data)
    return {
      id: result.insertId
    }
  }

  /**
   * 更新用户
   * 
   * 检查用户是否存在，如果修改密码需要重新加密
   * 
   * @param {number} id - 用户 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.password] - 新密码（明文，会自动加密）
   * @returns {Promise<void>}
   * @throws {BusinessError} 用户不存在
   */
  async updateUser(id, data) {
    // 检查用户是否存在
    const user = await userModel.getById(id)
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_FOUND, '用户不存在')
    }

    // 如果修改密码，需要加密
    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    await userModel.update(id, data)
  }

  /**
   * 删除用户
   * 
   * @param {number} id - 用户 ID
   * @returns {Promise<void>}
   * @throws {BusinessError} 用户不存在
   */
  async deleteUser(id) {
    const user = await userModel.getById(id)
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_FOUND, '用户不存在')
    }

    await userModel.delete(id)
  }

  /**
   * 批量删除用户
   * 
   * @param {Array<number>} ids - 用户 ID 数组
   * @returns {Promise<void>}
   * @throws {BusinessError} 请选择要删除的用户
   */
  async batchDeleteUsers(ids) {
    if (!ids || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_MISSING, '请选择要删除的用户')
    }
    await userModel.batchDelete(ids)
  }

  /**
   * 修改用户状态
   * 
   * @param {number} id - 用户 ID
   * @param {number} status - 状态 1启用 0禁用
   * @returns {Promise<void>}
   * @throws {BusinessError} 用户不存在
   */
  async updateUserStatus(id, status) {
    const user = await userModel.getById(id)
    if (!user) {
      throw new BusinessError(ERROR_CODE.USER_NOT_FOUND, '用户不存在')
    }

    await userModel.update(id, { status })
  }
}

module.exports = new UserService()
