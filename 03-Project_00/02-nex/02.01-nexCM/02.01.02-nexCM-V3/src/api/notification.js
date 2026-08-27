/**
 * ==========================================
 * 通知中心接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/notification
 *
 * 功能模块：
 * 1. 基础查询（列表、详情、未读数量、类型统计）
 * 2. 标记已读（单个、全部、批量）
 * 3. 删除操作（单个、批量、全部）
 * 4. 通知归档（归档、恢复）
 * 5. 用户通知设置（获取、更新）
 */
import request from '@/utils/request'

// ==================== 基础查询 ====================

/** 获取未读通知数量 */
export function requestGetUnreadCountApi() {
  return request({ url: '/notification/unread-count', method: 'get' })
}

/** 获取各类型通知数量统计 */
export function requestGetTypeStatsApi() {
  return request({ url: '/notification/type-stats', method: 'get' })
}

/**
 * 获取通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {number} params.isRead - 是否已读（0/1，空表示全部）
 * @param {string} params.type - 通知类型
 * @param {string} params.priority - 优先级
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @param {number} params.isArchived - 是否归档（0/1，默认0）
 * @param {string} params.keyword - 搜索关键词
 */
export function requestGetNotificationListApi(params) {
  return request({ url: '/notification/', method: 'get', params })
}

/** 获取通知详情 */
export function requestGetNotificationApi(id) {
  return request({ url: `/notification/${id}`, method: 'get' })
}

// ==================== 标记已读 ====================

/** 标记为已读 */
export function requestMarkAsReadApi(id) {
  return request({ url: `/notification/${id}/read`, method: 'put' })
}

/** 全部标记为已读 */
export function requestMarkAllAsReadApi() {
  return request({ url: '/notification/read-all', method: 'put' })
}

/**
 * 批量标记为已读
 * @param {Array<number>} ids - 通知ID数组
 */
export function requestBatchMarkAsReadApi(ids) {
  return request({ url: '/notification/batch-read', method: 'put', data: { ids } })
}

// ==================== 删除操作 ====================

/** 删除通知 */
export function requestDeleteNotificationApi(id) {
  return request({ url: `/notification/${id}`, method: 'delete' })
}

/**
 * 批量删除通知
 * @param {Array<number>} ids - 通知ID数组
 */
export function requestBatchDeleteApi(ids) {
  return request({ url: '/notification/batch', method: 'delete', data: { ids } })
}

/**
 * 全部删除（清空所有通知）
 * @param {boolean} includeArchived - 是否包含已归档的通知
 */
export function requestDeleteAllApi(includeArchived = false) {
  return request({ url: '/notification/all', method: 'delete', data: { includeArchived } })
}

// ==================== 通知归档 ====================

/**
 * 归档通知
 * @param {Array<number>} ids - 通知ID数组
 */
export function requestArchiveApi(ids) {
  return request({ url: '/notification/archive', method: 'put', data: { ids } })
}

/**
 * 恢复已归档的通知
 * @param {Array<number>} ids - 通知ID数组
 */
export function requestUnarchiveApi(ids) {
  return request({ url: '/notification/unarchive', method: 'put', data: { ids } })
}

// ==================== 用户通知设置 ====================

/** 获取用户通知设置 */
export function requestGetNotificationSettingsApi() {
  return request({ url: '/notification/settings/get', method: 'get' })
}

/**
 * 更新用户通知设置
 * @param {Object} settings - 设置对象
 * @param {Object} settings.typeEnabled - 通知类型开关
 * @param {Object} settings.doNotDisturb - 免打扰时间段
 * @param {boolean} settings.soundEnabled - 通知声音开关
 * @param {boolean} settings.popupEnabled - 弹窗提醒开关
 */
export function requestUpdateNotificationSettingsApi(settings) {
  return request({ url: '/notification/settings/update', method: 'put', data: settings })
}
