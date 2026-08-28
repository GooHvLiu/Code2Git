/**
 * ==========================================
 * 权限管理相关接口
 * ==========================================
 * 后端路由前缀 /prod-api/v2/permission
 */
import request from '@/utils/request'

/**
 * 获取当前登录用户的权限码列表 + 权限版本号
 * 用于前端按钮/参数权限判断
 * @returns {Promise<{code:number, msg:string, data:{permissions:string[], permissionVersion:string}}>}
 */
export function requestGetMyPermissionsApi() {
  return request({ url: '/permission/my', method: 'get' })
}

/**
 * 获取所有权限列表（树形结构）
 * 用于权限配置界面展示，包含菜单、按钮、参数
 * @returns {Promise<{code:number, msg:string, data:{permissions:Array, lang:string}}>}
 */
export function requestGetAllPermissionsApi() {
  return request({ url: '/permission/all', method: 'get' })
}

/**
 * 获取角色已分配的菜单ID列表
 * 用于权限配置界面回显已勾选的权限
 * @param {number} roleId - 角色ID
 * @returns {Promise<{code:number, msg:string, data:{roleId:number, menuIds:number[]}}>}
 */
export function requestGetRoleMenuIdsApi(roleId) {
  return request({ url: `/permission/role/${roleId}/menu-ids`, method: 'get' })
}

/**
 * 保存角色权限分配（全量覆盖）
 * 保存后自动更新该角色下所有用户的权限版本号，并清除权限缓存
 * @param {Object} data - { roleId, roleCode, menuIds }
 * @returns {Promise<{code:number, msg:string, data:{success:boolean}}>}
 */
export function requestSaveRolePermissionsApi(data) {
  return request({ url: '/permission/role/save', method: 'post', data })
}

/**
 * 清除指定用户的权限缓存
 * 管理员手动刷新用户权限时调用
 * @param {Object} data - { userId }
 * @returns {Promise<{code:number, msg:string, data:{success:boolean}}>}
 */
export function requestClearUserCacheApi(data) {
  return request({ url: '/permission/cache/clear-user', method: 'post', data })
}

/**
 * 清除所有用户的权限缓存
 * 系统级权限变更时调用
 * @returns {Promise<{code:number, msg:string, data:{success:boolean}}>}
 */
export function requestClearAllCacheApi() {
  return request({ url: '/permission/cache/clear-all', method: 'post' })
}
