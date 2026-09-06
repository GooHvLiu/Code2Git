/**
 * ==========================================
 * 功能配置相关接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/feature-config
 * 仅超级管理员可访问
 */
import request from '@/utils/request'

/**
 * 获取所有功能配置
 * @returns {Promise<{code:number, msg:string, data:{categories:Object, list:Array, stats:Array}}>}
 */
export function requestGetAllFeatureConfigApi() {
  return request({ url: '/feature-config', method: 'get' })
}

/**
 * 按分类获取功能配置
 * @param {string} category - 分类
 * @returns {Promise<{code:number, msg:string, data:{category:string, list:Array}}>}
 */
export function requestGetFeatureConfigByCategoryApi(category) {
  return request({ url: `/feature-config/category/${category}`, method: 'get' })
}

/**
 * 获取单个功能配置
 * @param {string} featureKey - 功能标识
 * @returns {Promise<{code:number, msg:string, data:Object}>}
 */
export function requestGetFeatureConfigApi(featureKey) {
  return request({ url: `/feature-config/${featureKey}`, method: 'get' })
}

/**
 * 更新单个功能配置
 * @param {string} featureKey - 功能标识
 * @param {string} value - 新值
 * @returns {Promise<{code:number, msg:string, data:Object}>}
 */
export function requestUpdateFeatureConfigApi(featureKey, value) {
  return request({ url: `/feature-config/${featureKey}`, method: 'put', data: { value } })
}

/**
 * 批量更新功能配置
 * @param {Array<{featureKey:string, value:string}>} updates - 更新列表
 * @returns {Promise<{code:number, msg:string, data:{successCount:number, failedCount:number, total:number}}>}
 */
export function requestBatchUpdateFeatureConfigApi(updates) {
  return request({ url: '/feature-config/batch-update', method: 'post', data: { updates } })
}

/**
 * 重置单个功能配置为默认值
 * @param {string} featureKey - 功能标识
 * @returns {Promise<{code:number, msg:string, data:Object}>}
 */
export function requestResetFeatureConfigApi(featureKey) {
  return request({ url: `/feature-config/${featureKey}/reset`, method: 'put' })
}

/**
 * 按分类重置为默认值
 * @param {string} category - 分类
 * @returns {Promise<{code:number, msg:string, data:{category:string, resetCount:number}}>}
 */
export function requestResetCategoryFeatureConfigApi(category) {
  return request({ url: `/feature-config/category/${category}/reset`, method: 'put' })
}

/**
 * 全部重置为默认值
 * @returns {Promise<{code:number, msg:string, data:{resetCount:number}}>}
 */
export function requestResetAllFeatureConfigApi() {
  return request({ url: '/feature-config/reset-all', method: 'put' })
}

/**
 * 检查功能是否启用
 * @param {string} featureKey - 功能标识
 * @returns {Promise<{code:number, msg:string, data:{featureKey:string, enabled:boolean}}>}
 */
export function requestCheckFeatureEnabledApi(featureKey) {
  return request({ url: `/feature-config/check/${featureKey}`, method: 'get' })
}
