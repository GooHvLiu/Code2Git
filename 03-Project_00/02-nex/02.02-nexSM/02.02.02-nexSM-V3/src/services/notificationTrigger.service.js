/**
 * ==========================================
 * 通知触发服务
 * ==========================================
 * 统一的通知触发入口，各业务模块通过此服务触发通知
 * 自动根据通知规则配置，确定通知对象和内容
 *
 * 使用方式：
 * const { triggerNotification } = require('../../services/notificationTrigger.service')
 * await triggerNotification('user.register', { username: 'zhangsan' }, operatorId)
 */

const notificationService = require('../modules/notification/notification.service')
const notificationRules = require('../config/notificationRules.config')
const userModel = require('../modules/user/user.model')
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
  console.log(`[通知触发服务] 根据角色查询用户, 角色: ${JSON.stringify(roles)}, 查询结果: ${JSON.stringify(rows)}`)
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
    console.error('[通知触发服务] 触发通知失败:', error)
    return {
      success: false,
      notifiedCount: 0,
      error: error.message
    }
  }
}

module.exports = {
  triggerNotification,
  getUserIdsByRoles
}
