/**
 * ==========================================
 * 数据字典接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/dict
 */
import request from '@/utils/request/request'

// ==================== 字典类型 ====================

/** 分页查询字典类型列表 */
export function requestGetDictTypeListApi(params: Record<string, unknown>) {
  return request({ url: '/dict/type', method: 'get', params })
}

/** 获取字典类型详情 */
export function requestGetDictTypeApi(id: string) {
  return request({ url: `/dict/type/${id}`, method: 'get' })
}

/** 创建字典类型 */
export function requestCreateDictTypeApi(data: Record<string, unknown>) {
  return request({ url: '/dict/type', method: 'post', data })
}

/** 更新字典类型 */
export function requestUpdateDictTypeApi(id: string, data: Record<string, unknown>) {
  return request({ url: `/dict/type/${id}`, method: 'put', data })
}

/** 删除字典类型 */
export function requestDeleteDictTypeApi(id: string) {
  return request({ url: `/dict/type/${id}`, method: 'delete' })
}

// ==================== 字典项 ====================

/** 分页查询字典项列表 */
export function requestGetDictItemListApi(params: Record<string, unknown>) {
  return request({ url: '/dict/item', method: 'get', params })
}

/** 根据字典类型编码获取字典项列表（DictTag 组件用） */
export function requestGetDictItemsByCodeApi(code: string) {
  return request({ url: `/dict/items/${code}`, method: 'get' })
}

/** 批量获取多个字典类型的字典项 */
export function requestGetDictItemsBatchApi(codes: (string | number)[]) {
  return request({ url: '/dict/items/batch', method: 'post', data: { codes } })
}

/** 获取字典项详情 */
export function requestGetDictItemApi(id: string) {
  return request({ url: `/dict/item/${id}`, method: 'get' })
}

/** 创建字典项 */
export function requestCreateDictItemApi(data: Record<string, unknown>) {
  return request({ url: '/dict/item', method: 'post', data })
}

/** 更新字典项 */
export function requestUpdateDictItemApi(id: string, data: Record<string, unknown>) {
  return request({ url: `/dict/item/${id}`, method: 'put', data })
}

/** 删除字典项 */
export function requestDeleteDictItemApi(id: string) {
  return request({ url: `/dict/item/${id}`, method: 'delete' })
}
