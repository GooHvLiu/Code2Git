/**
 * ==========================================
 * 用户管理接口
 * ==========================================
 * 标准 RESTful 写法，后端路由前缀 /prod-api/v2/user
 */
import request from '@/utils/request'

/**
 * 获取用户列表（分页）
 * @param {Object} params - { page, pageSize, username, status, role }
 */
export function requestGetUserListApi(params) {
  return request({ url: '/user/', method: 'get', params })
}

/**
 * 获取用户详情
 * @param {number|string} id - 用户ID
 */
export function requestGetUserDetailApi(id) {
  return request({ url: `/user/${id}`, method: 'get' })
}

/**
 * 新增用户
 * @param {Object} data - 用户信息
 */
export function requestAddUserApi(data) {
  return request({ url: '/user/', method: 'post', data })
}

/**
 * 修改用户
 * @param {Object} data - 用户信息（含 id，id 仅用于 URL，不放入请求体）
 */
export function requestUpdateUserApi(data) {
  const { id, ...body } = data
  return request({ url: `/user/${id}`, method: 'put', data: body })
}

/**
 * 删除用户（GMP：需电子签名密码验证）
 * @param {number|string} id - 用户ID
 * @param {string} password - 当前用户密码（电子签名）
 */
export function requestDeleteUserApi(id, password) {
  return request({ url: `/user/${id}`, method: 'delete', data: { password } })
}

/**
 * 批量删除用户（GMP：需电子签名密码验证）
 * @param {Array} ids - 用户ID数组
 * @param {string} password - 当前用户密码（电子签名）
 */
export function requestBatchDeleteUserApi(ids, password) {
  return request({ url: '/user/batch', method: 'delete', data: { ids, password } })
}

/**
 * 重置用户密码（管理员）
 * @param {number|string} id - 用户ID
 * @param {string} newPassword - 新密码
 */
export function requestResetUserPwdApi(id, newPassword) {
  return request({ url: `/user/${id}/reset-password`, method: 'post', data: { newPassword } })
}

/**
 * 解锁用户（管理员）
 * @param {number|string} id - 用户ID
 */
export function requestUnlockUserApi(id) {
  return request({ url: `/user/${id}/unlock`, method: 'post' })
}

/**
 * 发送忘记密码验证码
 * @param {Object} data - 请求数据
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱
 */
export function requestSendResetCodeApi(data) {
  return request({ url: '/user/forgot-password/send-code', method: 'post', data })
}

/**
 * 验证验证码并重置密码
 * @param {Object} data - 请求数据
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱
 * @param {string} data.code - 验证码
 * @param {string} data.newPassword - 新密码
 */
export function requestResetPasswordByCodeApi(data) {
  return request({ url: '/user/forgot-password/reset', method: 'post', data })
}
