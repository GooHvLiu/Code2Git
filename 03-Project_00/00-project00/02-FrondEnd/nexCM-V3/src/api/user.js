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
 * 重置用户密码
 * @param {number|string} id - 用户ID
 * @param {string} password - 新密码
 */
export function requestResetUserPwdApi(id, password) {
  return request({ url: `/user/${id}`, method: 'put', data: { id, password } })
}
