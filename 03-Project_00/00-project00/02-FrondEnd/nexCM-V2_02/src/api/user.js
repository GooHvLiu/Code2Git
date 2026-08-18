/**
 * ==========================================
 * 用户管理接口（示例模块）
 * ==========================================
 * 标准 RESTful 写法示例，业务模块照此格式编写
 */
import request from '@/utils/request'

/**
 * 获取用户列表（分页）
 * @param {Object} params - { pageNum, pageSize, username, status }
 */
export function requestGetUserListApi(params) {
  return request({ url: '/system/user/list', method: 'get', params })
}

/**
 * 获取用户详情
 * @param {number|string} id - 用户ID
 */
export function requestGetUserDetailApi(id) {
  return request({ url: `/system/user/${id}`, method: 'get' })
}

/**
 * 新增用户
 * @param {Object} data - 用户信息
 */
export function requestAddUserApi(data) {
  return request({ url: '/system/user', method: 'post', data })
}

/**
 * 修改用户
 * @param {Object} data - 用户信息（含 id）
 */
export function requestUpdateUserApi(data) {
  return request({ url: '/system/user', method: 'put', data })
}

/**
 * 删除用户
 * @param {number|string} id - 用户ID
 */
export function requestDeleteUserApi(id) {
  return request({ url: `/system/user/${id}`, method: 'delete' })
}

/**
 * 批量删除用户
 * @param {Array} ids - 用户ID数组
 */
export function requestBatchDeleteUserApi(ids) {
  return request({ url: '/system/user/batch', method: 'delete', data: { ids } })
}

/**
 * 导出用户列表
 * @param {Object} params - 筛选条件
 */
export function requestExportUserApi(params) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 重置用户密码
 * @param {number|string} id - 用户ID
 * @param {string} password - 新密码
 */
export function requestResetUserPwdApi(id, password) {
  return request({ url: '/system/user/resetPwd', method: 'put', data: { id, password } })
}
