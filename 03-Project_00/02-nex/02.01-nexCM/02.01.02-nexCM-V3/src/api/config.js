/**
 * ==========================================
 * 系统配置接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/config
 */
import request from '@/utils/request'

/**
 * 获取所有配置
 * @returns {Promise<Object>} 配置对象 { key: value }
 */
export function requestGetAllConfigsApi() {
  return request({ url: '/config/', method: 'get' })
}

/**
 * 根据分类获取配置
 * @param {string} category 配置分类：system/security/plc/export/connection
 * @returns {Promise<Object>} 配置对象 { key: value }
 */
export function requestGetConfigsByCategoryApi(category) {
  return request({ url: `/config/category/${category}`, method: 'get' })
}

/**
 * 批量更新配置
 * @param {Object} configs 配置对象 { key: value }
 * @returns {Promise<Object>} 更新后的配置对象
 */
export function requestUpdateConfigsApi(configs) {
  return request({ url: '/config/', method: 'put', data: configs })
}

/**
 * 重置所有配置为默认值
 * @returns {Promise<Object>} 重置后的配置对象
 */
export function requestResetConfigsApi() {
  return request({ url: '/config/reset', method: 'post' })
}
