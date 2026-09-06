/**
 * ==========================================
 * 审计日志工具（统一入口）
 * ==========================================
 * GMP 21CFR Part 11 电子记录合规
 *
 * 【设计原则】
 * 1. 业务模块只依赖本文件，不直接引用 audit.service
 * 2. 自动从 req 提取操作人信息（userId/userName/ip/userAgent）
 * 3. 操作类型使用统一常量，避免硬编码
 * 4. 配置化：通过 auditRules.config.js 管理哪些操作需要记录审计日志
 *
 * 【用法】
 * const audit = require('./audit')
 *
 * // 方式一：通用方法（推荐，使用配置化的操作类型）
 * await audit.log(req, {
 *   action: 'user.update',
 *   target: 'username',
 *   oldValue: '旧值',
 *   newValue: '新值',
 *   result: 'success',
 *   reason: '操作原因（GMP要求）'
 * })
 *
 * // 方式二：快捷方法
 * await audit.logUserCreate(req, target, oldValue, newValue)
 * await audit.logUserUpdate(req, target, oldValue, newValue)
 * await audit.logUserDelete(req, target, oldValue)
 * await audit.logPlcWrite(req, target, oldValue, newValue, reason)
 */

const auditService = require('../modules/audit/audit.service')
const auditRules = require('../config/auditRules.config')

/**
 * 操作类型常量（统一管理，避免硬编码）
 * 与 auditRules.config.js 中的 actionType 保持一致
 * 后续新增操作类型在此添加，同时在配置文件中添加对应规则
 */
const ACTION_TYPES = {
  // ==================== 用户管理 ====================
  USER_REGISTER: 'user.register',
  USER_LOGIN: 'user.login',
  USER_LOGIN_FAILED: 'user.loginFailed',
  USER_LOGOUT: 'user.logout',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_BATCH_DELETE: 'user.batchDelete',
  USER_STATUS_CHANGE: 'user.statusChange',
  USER_RESET_PASSWORD: 'user.resetPassword',
  USER_CHANGE_PASSWORD: 'user.changePassword',
  USER_ROLE_CHANGE: 'user.roleChange',

  // ==================== 权限管理 ====================
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  PERMISSION_CHANGE: 'permission.change',
  PERMISSION_CACHE_CLEAR: 'permission.cacheClear',

  // ==================== 系统配置 ====================
  CONFIG_SYSTEM_CHANGE: 'config.system.change',
  CONFIG_SECURITY_CHANGE: 'config.security.change',
  CONFIG_PLC_CHANGE: 'config.plc.change',
  CONFIG_EXPORT_CHANGE: 'config.export.change',
  CONFIG_CONNECTION_CHANGE: 'config.connection.change',
  CONFIG_DEVICE_CHANGE: 'config.device.change',
  CONFIG_ORDER_CHANGE: 'config.order.change',

  // ==================== 设备管理 ====================
  DEVICE_STATUS_CHANGE: 'device.statusChange',
  DEVICE_PARAM_CHANGE: 'device.paramChange',
  DEVICE_PART_CREATE: 'device.part.create',
  DEVICE_PART_UPDATE: 'device.part.update',
  DEVICE_PART_REPLACE: 'device.part.replace',
  DEVICE_PART_DELETE: 'device.part.delete',
  DEVICE_PART_TEMPLATE_CREATE: 'device.part.template.create',
  DEVICE_PART_TEMPLATE_UPDATE: 'device.part.template.update',
  DEVICE_PART_TEMPLATE_DELETE: 'device.part.template.delete',
  DEVICE_ALARM_HANDLE: 'device.alarm.handle',

  // ==================== 生产管理 ====================
  PRODUCTION_RECIPE_DOWNLOAD: 'production.recipe.download',
  PRODUCTION_ORDER_CREATE: 'production.order.create',
  PRODUCTION_ORDER_UPDATE: 'production.order.update',
  PRODUCTION_ORDER_DELETE: 'production.order.delete',
  PRODUCTION_ORDER_DOWNLOAD: 'production.order.download',

  // ==================== 数据管理 ====================
  DATA_EXPORT: 'data.export',
  DATA_VIEW_DETAIL: 'data.viewDetail',

  // ==================== PLC操作 ====================
  PLC_WRITE: 'plc.write',
  PLC_READ: 'plc.read',
  PLC_CONNECT: 'plc.connect',
  PLC_DISCONNECT: 'plc.disconnect',
  PLC_RECONNECT: 'plc.reconnect',

  // ==================== 审计自身 ====================
  AUDIT_VIEW: 'audit.view',
  AUDIT_VERIFY: 'audit.verify',
  AUDIT_EXPORT: 'audit.export',

  // ==================== 授权管理 ====================
  LICENSE_IMPORT: 'license.import',
  LICENSE_EXPIRE: 'license.expire',

  // ==================== 邮箱配置 ====================
  EMAIL_CONFIG_CHANGE: 'email.configChange',
  EMAIL_LOG_DELETE: 'email.logDelete'
}

/**
 * 从 req 中提取操作人信息
 * @param {Object} req Express 请求对象
 * @returns {Object} { userId, userName, ip, userAgent }
 */
function extractOperator(req) {
  if (!req) return { userId: 0, userName: '', ip: '', userAgent: '' }

  const user = req.user || {}
  return {
    userId: user.id || user.userId || 0,
    userName: user.username || user.userName || '',
    ip: req.ip ||
      (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) ||
      (req.connection && req.connection.remoteAddress) ||
      '',
    userAgent: (req.headers && req.headers['user-agent']) || ''
  }
}

/**
 * 记录审计日志（统一入口）
 *
 * 自动根据审计规则配置，判断是否需要记录日志
 *
 * @param {Object|Express.Request} operator - 操作人信息或 Express req 对象
 * @param {Object} log - 日志内容 { action, target, oldValue, newValue, result, reason }
 * @returns {Promise<Object|null>} 写入的日志记录，失败或未启用返回 null
 */
async function log(operator, log = {}) {
  try {
    // 检查审计功能是否启用
    if (!auditRules.enabled) {
      return null
    }

    // 检查该操作类型是否启用审计
    const action = log.action || ''
    if (action && !auditRules.isEnabled(action)) {
      return null
    }

    // 判断 operator 是 req 对象还是手动传入的操作人信息
    const isReq = operator && (operator.user !== undefined || operator.headers !== undefined)
    const op = isReq ? extractOperator(operator) : (operator || {})

    // 获取审计规则，自动填充一些字段
    const rule = action ? auditRules.getRule(action) : null

    const data = {
      userId: op.userId || 0,
      userName: op.userName || '',
      action: action,
      target: log.target || '',
      oldValue: log.oldValue !== undefined ? log.oldValue : '',
      newValue: log.newValue !== undefined ? log.newValue : '',
      result: log.result || 'success',
      reason: log.reason || '',
      ip: op.ip || '',
      userAgent: op.userAgent || '',
      // 扩展字段（用于后续统计和分析）
      module: rule ? rule.moduleKey : '',
      priority: rule ? rule.priority : 'normal'
    }

    return await auditService.create(data)
  } catch (err) {
    console.error('[审计日志] 写入失败:', err.message)
    // 审计日志写入失败不影响主业务，但记录错误
    return null
  }
}

// ==================== 快捷方法 ====================

/**
 * 记录用户注册
 */
async function logUserRegister(req, target, newValue) {
  return await log(req, {
    action: ACTION_TYPES.USER_REGISTER,
    target,
    newValue: newValue || ''
  })
}

/**
 * 记录新增用户
 */
async function logUserCreate(req, target, newValue) {
  return await log(req, {
    action: ACTION_TYPES.USER_CREATE,
    target,
    newValue: newValue || ''
  })
}

/**
 * 记录修改用户
 */
async function logUserUpdate(req, target, oldValue, newValue) {
  return await log(req, {
    action: ACTION_TYPES.USER_UPDATE,
    target,
    oldValue: oldValue || '',
    newValue: newValue || ''
  })
}

/**
 * 记录删除用户
 */
async function logUserDelete(req, target, oldValue) {
  return await log(req, {
    action: ACTION_TYPES.USER_DELETE,
    target,
    oldValue: oldValue || ''
  })
}

/**
 * 记录批量删除用户
 */
async function logUserBatchDelete(req, target, oldValue) {
  return await log(req, {
    action: ACTION_TYPES.USER_BATCH_DELETE,
    target,
    oldValue: oldValue || ''
  })
}

/**
 * 记录修改用户状态
 */
async function logUserStatusChange(req, target, oldValue, newValue) {
  return await log(req, {
    action: ACTION_TYPES.USER_STATUS_CHANGE,
    target,
    oldValue: oldValue || '',
    newValue: newValue || ''
  })
}

/**
 * 记录密码重置
 */
async function logPasswordReset(req, username, resetType) {
  return await log(req, {
    action: ACTION_TYPES.USER_RESET_PASSWORD,
    target: username || '',
    newValue: resetType || ''
  })
}

/**
 * 记录 PLC 参数写入
 */
async function logPlcWrite(req, target, oldValue, newValue, reason = '') {
  return await log(req, {
    action: ACTION_TYPES.PLC_WRITE,
    target,
    oldValue: oldValue !== undefined ? String(oldValue) : '',
    newValue: newValue !== undefined ? String(newValue) : '',
    reason
  })
}

/**
 * 记录数据导出
 */
async function logExport(req, target) {
  return await log(req, {
    action: ACTION_TYPES.DATA_EXPORT,
    target: target || ''
  })
}

// ==================== 工具方法 ====================

/**
 * 获取审计规则配置
 * @returns {Object} 审计规则配置
 */
function getAuditRules() {
  return auditRules
}

/**
 * 检查操作类型是否启用审计
 * @param {string} actionType - 操作类型
 * @returns {boolean} 是否启用
 */
function isActionEnabled(actionType) {
  return auditRules.isEnabled(actionType)
}

/**
 * 检查操作类型是否要求填写原因
 * @param {string} actionType - 操作类型
 * @returns {boolean} 是否要求
 */
function isReasonRequired(actionType) {
  return auditRules.requireReason(actionType)
}

module.exports = {
  // 核心方法
  log,
  extractOperator,

  // 操作类型常量
  ACTION: ACTION_TYPES,

  // 快捷方法
  logUserRegister,
  logUserCreate,
  logUserUpdate,
  logUserDelete,
  logUserBatchDelete,
  logUserStatusChange,
  logPasswordReset,
  logPlcWrite,
  logExport,

  // 工具方法
  getAuditRules,
  isActionEnabled,
  isReasonRequired
}
