/**
 * ==========================================
 * 消息通知工具（统一入口）
 * ==========================================
 * 统一的通知触发入口，各业务模块通过此工具触发通知
 * 自动根据通知规则配置，确定通知对象和内容
 *
 * 【设计原则】
 * 1. 业务模块只依赖本文件，不直接引用 notification.service
 * 2. 自动根据事件类型匹配通知规则，确定通知对象
 * 3. 使用国际化 key + 动态参数的方式，前端使用 $t(key, params) 渲染
 *
 * 【用法】
 * const { triggerNotification } = require('./notification')
 *
 * // 一行代码触发通知
 * await triggerNotification('user.register', { username: 'zhangsan' }, operatorId)
 *
 * // 事件类型在 notificationRules.config.js 中配置
 * // 通知角色也在配置文件中定义
 */

const notificationService = require('../modules/notification/notification.service')
const notificationRules = require('../config/notificationRules.config')
const { query } = require('../db/index')

/**
 * 根据角色获取用户ID列表
 * @param {Array<string>} roles - 角色列表
 * @returns {Promise<Array<number>>} 用户ID列表
 */
async function getUserIdsByRoles(roles) {
  if (!roles || roles.length === 0) return []

  const placeholders = roles.map(() => '?').join(',')
  // 注意：不限制 status，因为不同系统状态字段值可能不同（0/1/active/enabled等）
  const sql = `SELECT DISTINCT id, username, role, status FROM nex_user WHERE role IN (${placeholders})`
  const rows = await query(sql, roles)
  return rows.map(row => row.id)
}

/**
 * 触发通知
 *
 * 根据事件类型匹配通知规则，自动确定通知对象，渲染通知内容，
 * 然后批量发送通知给目标用户。
 *
 * @param {string} eventType - 事件类型（如 'user.register'）
 * @param {Object} variables - 模板变量（如 { username: 'zhangsan' }）
 * @param {number} [operatorId] - 操作人ID（用于排除操作人自己）
 * @returns {Promise<Object>} 触发结果 { success, notifiedCount, rule }
 */
async function triggerNotification(eventType, variables = {}, operatorId = null) {
  try {
    // 检查通知功能是否启用
    if (!notificationRules.enabled) {
      return { success: false, notifiedCount: 0, reason: 'notification disabled' }
    }

    // 获取通知规则
    const rule = notificationRules.getRule(eventType)
    if (!rule) {
      return { success: false, notifiedCount: 0, reason: 'no matching rule' }
    }

    // 不再渲染标题和内容，直接存储国际化 key 和动态参数
    // 前端使用 $t(titleKey, titleParams) 和 $t(contentKey, contentParams) 渲染
    const titleKey = rule.titleKey
    const contentKey = rule.contentKey
    const titleParams = JSON.stringify(variables)
    const contentParams = JSON.stringify(variables)

    // 获取需要通知的用户ID列表
    let userIds = await getUserIdsByRoles(rule.notifyRoles)

    // 注意：不排除操作人自己，操作人也需要收到通知作为操作记录
    // 如果需要排除操作人，可以在通知规则配置中设置 excludeOperator: true

    // 没有需要通知的用户
    if (userIds.length === 0) {
      return { success: true, notifiedCount: 0, rule }
    }

    // 批量发送通知
    await notificationService.sendBatchNotifications(userIds, {
      titleKey,
      titleParams,
      contentKey,
      contentParams,
      type: rule.type,
      priority: rule.priority,
      link: rule.link || ''
    })

    return {
      success: true,
      notifiedCount: userIds.length,
      rule
    }
  } catch (error) {
    console.error('[通知工具] 触发通知失败:', error)
    return {
      success: false,
      notifiedCount: 0,
      error: error.message
    }
  }
}

/**
 * 直接发送通知给指定用户（不经过规则匹配）
 * 适用于需要精确控制通知对象的场景
 *
 * @param {number} userId - 接收用户ID
 * @param {Object} params - 通知参数
 * @param {string} params.titleKey - 通知标题国际化key
 * @param {string} params.contentKey - 通知内容国际化key
 * @param {Object} [params.variables={}] - 模板变量
 * @param {string} [params.type='system'] - 通知类型 system/plc/user/audit
 * @param {string} [params.priority='normal'] - 优先级 high/normal/low
 * @param {string} [params.link=''] - 跳转链接
 * @returns {Promise<Object>}
 */
async function sendToUser(userId, params = {}) {
  const {
    titleKey,
    contentKey,
    variables = {},
    type = 'system',
    priority = 'normal',
    link = ''
  } = params

  return await notificationService.sendNotification({
    userId,
    titleKey,
    contentKey,
    titleParams: JSON.stringify(variables),
    contentParams: JSON.stringify(variables),
    type,
    priority,
    link
  })
}

/**
 * 批量发送通知给指定用户列表（不经过规则匹配）
 *
 * @param {Array<number>} userIds - 用户ID列表
 * @param {Object} params - 通知参数（同 sendToUser）
 * @returns {Promise<Array>}
 */
async function sendToUsers(userIds, params = {}) {
  const results = []
  for (const userId of userIds) {
    const result = await sendToUser(userId, params)
    results.push(result)
  }
  return results
}

module.exports = {
  triggerNotification,
  getUserIdsByRoles,
  sendToUser,
  sendToUsers
}
