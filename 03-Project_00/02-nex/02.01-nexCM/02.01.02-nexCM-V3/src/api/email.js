/**
 * ==========================================
 * 邮箱配置接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/email
 */
import request from '@/utils/request'

/**
 * 获取邮箱配置列表（分页）
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.pageSize 每页数量
 * @param {string} params.keyword 搜索关键词
 * @param {number} params.status 状态筛选
 * @returns {Promise<Object>} { list, total }
 */
export function requestGetEmailConfigListApi(params) {
  return request({ url: '/email/list', method: 'get', params })
}

/**
 * 获取所有启用的邮箱配置（下拉选择用）
 * @returns {Promise<Array>} 配置列表
 */
export function requestGetAllEmailConfigsApi() {
  return request({ url: '/email/all', method: 'get' })
}

/**
 * 获取单个配置详情
 * @param {number} id 配置ID
 * @returns {Promise<Object>} 配置详情
 */
export function requestGetEmailConfigDetailApi(id) {
  return request({ url: `/email/${id}`, method: 'get' })
}

/**
 * 新增邮箱配置
 * @param {Object} data 配置数据
 * @returns {Promise<Object>} { id }
 */
export function requestCreateEmailConfigApi(data) {
  return request({ url: '/email/', method: 'post', data })
}

/**
 * 更新邮箱配置
 * @param {number} id 配置ID
 * @param {Object} data 更新数据
 * @returns {Promise<Object>}
 */
export function requestUpdateEmailConfigApi(id, data) {
  return request({ url: `/email/${id}`, method: 'put', data })
}

/**
 * 删除邮箱配置
 * @param {number} id 配置ID
 * @returns {Promise<Object>}
 */
export function requestDeleteEmailConfigApi(id) {
  return request({ url: `/email/${id}`, method: 'delete' })
}

/**
 * 设为默认配置
 * @param {number} id 配置ID
 * @returns {Promise<Object>}
 */
export function requestSetDefaultEmailConfigApi(id) {
  return request({ url: `/email/${id}/default`, method: 'put' })
}

/**
 * 启用/禁用配置
 * @param {number} id 配置ID
 * @param {number} status 状态 0-禁用 1-启用
 * @returns {Promise<Object>}
 */
export function requestUpdateEmailConfigStatusApi(id, status) {
  return request({ url: `/email/${id}/status`, method: 'put', data: { status } })
}

/**
 * 发送测试邮件
 * @param {Object} data 测试数据
 * @param {number} data.configId 配置ID
 * @param {string} data.toEmail 测试收件人邮箱
 * @returns {Promise<Object>}
 */
export function requestSendTestEmailApi(data) {
  return request({ url: '/email/test', method: 'post', data })
}

/**
 * 验证SMTP连接
 * @param {Object} data 邮箱配置
 * @returns {Promise<Object>}
 */
export function requestVerifySmtpConnectionApi(data) {
  return request({ url: '/email/verify', method: 'post', data })
}

/**
 * 获取支持的服务商列表
 * @returns {Promise<Array>} 服务商列表
 */
export function requestGetEmailProvidersApi() {
  return request({ url: '/email/providers', method: 'get' })
}

// ==================== 邮件发送日志 ====================

/**
 * 获取发送日志列表（分页）
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.pageSize 每页数量
 * @param {string} params.keyword 搜索关键词（收件人/主题/配置名）
 * @param {number} params.status 状态筛选 0发送中 1成功 2失败
 * @param {number} params.configId 配置ID筛选
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @returns {Promise<Object>} { list, total }
 */
export function requestGetEmailLogListApi(params) {
  return request({ url: '/email/log/list', method: 'get', params })
}

/**
 * 获取日志详情
 * @param {number} id 日志ID
 * @returns {Promise<Object>} 日志详情（含content）
 */
export function requestGetEmailLogDetailApi(id) {
  return request({ url: `/email/log/${id}`, method: 'get' })
}

/**
 * 删除日志
 * @param {number} id 日志ID
 * @returns {Promise<Object>}
 */
export function requestDeleteEmailLogApi(id) {
  return request({ url: `/email/log/${id}`, method: 'delete' })
}

/**
 * 批量删除日志
 * @param {Array<number>} ids 日志ID数组
 * @returns {Promise<Object>} { count }
 */
export function requestBatchDeleteEmailLogsApi(ids) {
  return request({ url: '/email/log/batch-delete', method: 'post', data: { ids } })
}
