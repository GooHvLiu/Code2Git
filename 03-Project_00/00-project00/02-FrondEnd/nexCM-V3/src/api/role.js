/**
 * ==========================================
 * 角色管理接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/role
 */
import request from '@/utils/request'

/** 获取所有启用的角色（下拉选择用） */
export function requestGetRoleAllApi() {
  return request({ url: '/role/all', method: 'get' })
}

/** 分页查询角色列表 */
export function requestGetRoleListApi(params) {
  return request({ url: '/role/', method: 'get', params })
}

/** 获取角色详情（含菜单权限） */
export function requestGetRoleApi(id) {
  return request({ url: `/role/${id}`, method: 'get' })
}

/** 创建角色 */
export function requestCreateRoleApi(data) {
  return request({ url: '/role/', method: 'post', data })
}

/** 更新角色 */
export function requestUpdateRoleApi(id, data) {
  return request({ url: `/role/${id}`, method: 'put', data })
}

/** 删除角色 */
export function requestDeleteRoleApi(id) {
  return request({ url: `/role/${id}`, method: 'delete' })
}
