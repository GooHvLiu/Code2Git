/**
 * ==========================================
 * 部门管理接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/dept
 */
import request from '@/utils/request'

/** 获取部门树 */
export function requestGetDeptTreeApi() {
  return request({ url: '/dept/tree', method: 'get' })
}

/** 获取部门详情 */
export function requestGetDeptApi(id) {
  return request({ url: `/dept/${id}`, method: 'get' })
}

/** 创建部门 */
export function requestCreateDeptApi(data) {
  return request({ url: '/dept/', method: 'post', data })
}

/** 更新部门 */
export function requestUpdateDeptApi(id, data) {
  return request({ url: `/dept/${id}`, method: 'put', data })
}

/** 删除部门 */
export function requestDeleteDeptApi(id) {
  return request({ url: `/dept/${id}`, method: 'delete' })
}
