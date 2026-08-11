/**
 * ==========================================
 * 客户管理接口
 * ==========================================
 */
import request from '@/utils/request'

/**
 * 获取客户列表
 * @param {Object} params - 查询参数
 */
export function requestGetCustomerListApi(params) {
  return request({ url: '/customer', method: 'get', params })
}

/**
 * 新增客户
 * @param {Object} data - 客户数据
 */
export function requestAddCustomerApi(data) {
  return request({ url: '/customer', method: 'post', data })
}

/**
 * 更新客户信息
 * @param {number|string} id - 客户ID
 * @param {Object} data - 客户数据
 */
export function requestUpdateCustomerApi(id, data) {
  return request({ url: `/customer/${id}`, method: 'put', data })
}

/**
 * 删除客户
 * @param {number|string} id - 客户ID
 */
export function requestDeleteCustomerApi(id) {
  return request({ url: `/customer/${id}`, method: 'delete' })
}

/**
 * 导入客户
 * @param {FormData} data - 文件数据
 */
export function requestImportCustomerApi(data) {
  return request({ url: '/customer/import', method: 'post', data })
}

/**
 * 导出客户
 */
export function requestExportCustomerApi(params) {
  return request({ url: '/customer/export', method: 'get', params, responseType: 'blob' })
}
