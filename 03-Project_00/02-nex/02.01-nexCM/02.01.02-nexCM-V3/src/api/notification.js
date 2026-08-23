/**
 * ==========================================
 * 通知中心接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/notification
 */
import request from '@/utils/request'

/** 获取未读通知数量 */
export function requestGetUnreadCountApi() {
  return request({ url: '/notification/unread-count', method: 'get' })
}

/** 获取通知列表 */
export function requestGetNotificationListApi(params) {
  return request({ url: '/notification/', method: 'get', params })
}

/** 获取通知详情 */
export function requestGetNotificationApi(id) {
  return request({ url: `/notification/${id}`, method: 'get' })
}

/** 标记为已读 */
export function requestMarkAsReadApi(id) {
  return request({ url: `/notification/${id}/read`, method: 'put' })
}

/** 全部标记为已读 */
export function requestMarkAllAsReadApi() {
  return request({ url: '/notification/read-all', method: 'put' })
}

/** 删除通知 */
export function requestDeleteNotificationApi(id) {
  return request({ url: `/notification/${id}`, method: 'delete' })
}
