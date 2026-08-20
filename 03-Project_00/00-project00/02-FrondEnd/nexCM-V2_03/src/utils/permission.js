/**
 * ==========================================
 * 权限判断工具函数
 * ==========================================
 * 提供 JS 代码中的权限判断能力，与 v-permission 指令逻辑一致
 * 同时支持角色判断和权限码判断
 *
 * 用法：
 * import { checkPermission, hasRole, hasPermission } from '@/utils/permission'
 *
 * // 判断是否有权限（角色或权限码任一匹配即可）
 * if (checkPermission(['admin', 'user:add'])) { ... }
 *
 * // 仅判断角色
 * if (hasRole('admin')) { ... }
 *
 * // 仅判断权限码
 * if (hasPermission('user:edit')) { ... }
 */
import store from '@/store'

/**
 * 获取当前用户的角色列表
 */
function getRoles() {
  return store.getters.roles || []
}

/**
 * 获取当前用户的权限码列表
 */
function getPermissions() {
  return store.getters.permissions || []
}

/**
 * 判断是否有指定角色
 * @param {string|string[]} role - 角色或角色数组
 * @returns {boolean}
 */
export function hasRole(role) {
  const roles = getRoles()
  const roleList = Array.isArray(role) ? role : [role]
  return roleList.some(r => roles.includes(r))
}

/**
 * 判断是否有指定权限码
 * @param {string|string[]} permission - 权限码或权限码数组
 * @returns {boolean}
 */
export function hasPermission(permission) {
  const permissions = getPermissions()
  const permList = Array.isArray(permission) ? permission : [permission]
  return permList.some(p => permissions.includes(p))
}

/**
 * 综合权限判断（角色或权限码任一匹配即可）
 * 与 v-permission 指令逻辑一致
 * @param {string|string[]} value - 角色或权限码，支持数组
 * @returns {boolean}
 */
export function checkPermission(value) {
  if (!value) return false
  const list = Array.isArray(value) ? value : [value]
  return list.some(item => hasRole(item) || hasPermission(item))
}

/**
 * 安装为 Vue 插件，挂载到 Vue.prototype
 * 组件中可直接使用 this.$hasRole() / this.$hasPermission() / this.$checkPermission()
 */
export default {
  install(Vue) {
    Vue.prototype.$hasRole = hasRole
    Vue.prototype.$hasPermission = hasPermission
    Vue.prototype.$checkPermission = checkPermission
  }
}
