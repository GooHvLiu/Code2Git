/**
 * api/system/user.js - 系统管理相关接口
 * 包含用户、角色、菜单、审计日志
 */
import request from '@/utils/request'

// ========== 用户管理 ==========

/** 用户列表（分页） */
export function getUserList(params) {
  return request({ url: '/system/users', method: 'get', params })
}
/** 创建用户 */
export function createUser(data) {
  return request({ url: '/system/users', method: 'post', data })
}
/** 更新用户 */
export function updateUser(id, data) {
  return request({ url: `/system/users/${id}`, method: 'put', data })
}
/** 删除用户 */
export function deleteUser(id) {
  return request({ url: `/system/users/${id}`, method: 'delete' })
}

// ========== 角色管理 ==========

/** 角色列表 */
export function getRoleList(params) {
  return request({ url: '/system/roles', method: 'get', params })
}
/** 创建角色 */
export function createRole(data) {
  return request({ url: '/system/roles', method: 'post', data })
}
/** 更新角色 */
export function updateRole(id, data) {
  return request({ url: `/system/roles/${id}`, method: 'put', data })
}
/** 删除角色 */
export function deleteRole(id) {
  return request({ url: `/system/roles/${id}`, method: 'delete' })
}

// ========== 菜单管理 ==========

/** 获取菜单树 */
export function getMenuTree() {
  return request({ url: '/system/menus/tree', method: 'get' })
}

// ========== 审计日志 ==========

/** 查询审计日志（分页） */
export function getAuditLogs(params) {
  return request({ url: '/system/audit-logs', method: 'get', params })
}
