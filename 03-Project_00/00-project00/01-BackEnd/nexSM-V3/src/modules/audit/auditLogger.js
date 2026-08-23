/**
 * ==========================================
 * 审计日志统一记录器（审计模块对外唯一入口）
 * ==========================================
 * GMP 21CFR Part 11 电子记录合规
 *
 * 【设计原则】
 * 1. 其他模块只依赖本文件，不直接引用 audit.service
 * 2. 审计模块内部（model/service/controller/route）可自由重构，不影响外部
 * 3. 自动从 req 提取操作人信息（userId/userName/ip/userAgent）
 * 4. 操作类型使用统一常量，避免硬编码
 *
 * 【用法】
 * const auditLogger = require('../audit/auditLogger')
 *
 * // 方式一：传入 req，自动提取操作人信息（推荐）
 * await auditLogger.log(req, {
 *   action: auditLogger.ACTION.USER_UPDATE,
 *   target: 'username',
 *   oldValue: '旧值',
 *   newValue: '新值',
 *   result: 'success',
 *   reason: '操作原因（GMP要求）'
 * })
 *
 * // 方式二：手动传入操作人信息
 * await auditLogger.log({
 *   userId: 1,
 *   userName: 'admin',
 *   ip: '127.0.0.1',
 *   userAgent: 'Mozilla/5.0...'
 * }, {
 *   action: 'PLC参数修改',
 *   target: 'fillVolume',
 *   oldValue: '100',
 *   newValue: '150'
 * })
 *
 * // 方式三：快捷方法（常用操作）
 * await auditLogger.logUserCreate(req, target, oldValue, newValue)
 * await auditLogger.logUserUpdate(req, target, oldValue, newValue)
 * await auditLogger.logUserDelete(req, target, oldValue)
 * await auditLogger.logPlcWrite(req, target, oldValue, newValue, reason)
 */

const auditService = require('./audit.service')

/**
 * 操作类型常量（统一管理，避免硬编码）
 * 后续新增操作类型在此添加
 */
const ACTION_TYPES = {
  // 用户相关
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGIN_FAILED: 'USER_LOGIN_FAILED',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_BATCH_DELETE: 'USER_BATCH_DELETE',
  USER_STATUS_CHANGE: 'USER_STATUS_CHANGE',
  USER_RESET_PASSWORD: 'USER_RESET_PASSWORD',

  // PLC 相关
  PLC_WRITE: 'PLC_WRITE',
  PLC_READ: 'PLC_READ',
  PLC_CONNECT: 'PLC_CONNECT',
  PLC_DISCONNECT: 'PLC_DISCONNECT',
  PLC_RECONNECT: 'PLC_RECONNECT',

  // 系统相关
  SYSTEM_CONFIG_CHANGE: 'SYSTEM_CONFIG_CHANGE',
  SYSTEM_EXPORT: 'SYSTEM_EXPORT',
  SYSTEM_IMPORT: 'SYSTEM_IMPORT',

  // 审计相关
  AUDIT_VERIFY: 'AUDIT_VERIFY'
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
 * @param {Object|Express.Request} operator - 操作人信息或 Express req 对象
 * @param {Object} log - 日志内容 { action, target, oldValue, newValue, result, reason }
 * @returns {Promise<Object|null>} 写入的日志记录，失败返回 null
 */
async function log(operator, log = {}) {
  // 判断 operator 是 req 对象还是手动传入的操作人信息
  const isReq = operator && (operator.user !== undefined || operator.headers !== undefined)
  const op = isReq ? extractOperator(operator) : (operator || {})

  const data = {
    userId: op.userId || 0,
    userName: op.userName || '',
    action: log.action || '',
    target: log.target || '',
    oldValue: log.oldValue !== undefined ? log.oldValue : '',
    newValue: log.newValue !== undefined ? log.newValue : '',
    result: log.result || 'success',
    reason: log.reason || '',
    ip: op.ip || '',
    userAgent: op.userAgent || ''
  }

  return await auditService.create(data)
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
    action: ACTION_TYPES.SYSTEM_EXPORT,
    target: target || ''
  })
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
  logPlcWrite,
  logExport
}
