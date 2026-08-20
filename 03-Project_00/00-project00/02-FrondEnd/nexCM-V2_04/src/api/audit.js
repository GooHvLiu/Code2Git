/**
 * ==========================================
 * 审计追踪接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/audit
 */
import request from '@/utils/request'

/**
 * 获取审计日志列表（分页）
 * 管理员可查看全部，普通用户只能查看自己的（后端控制）
 * @param {Object} params - { page, pageSize, userId, action, target, startTime, endTime }
 */
export function requestGetAuditListApi(params) {
  return request({ url: '/audit/list', method: 'get', params })
}

/**
 * 获取当前用户的审计日志
 * @param {Object} params - { page, pageSize, action, target, startTime, endTime }
 */
export function requestGetMyAuditListApi(params) {
  return request({ url: '/audit/my', method: 'get', params })
}
