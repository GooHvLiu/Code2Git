/**
 * ==========================================
 * 权限判断工具函数
 * ==========================================
 * 提供 JS 代码中的权限判断能力，与 v-permission 指令逻辑一致
 * 同时支持角色判断和权限码判断
 *
 * 超级管理员判断依据后端返回的 is_super_admin 数据库字段，不硬编码角色编码
 *
 * 用法：
 * import { checkPermission, hasRole, hasPermission, isSuperAdmin } from '@/utils/permission'
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
 * 判断当前用户是否为超级管理员（依据后端返回的 is_super_admin 数据库字段）
 * @returns {boolean}
 */
export function isSuperAdmin() {
  const userInfo = store.state.user?.userInfo || {}
  return Number(userInfo.is_super_admin) === 1
}

/**
 * 判断是否有指定角色
 * 超级管理员自动拥有所有角色
 * @param {string|string[]} role - 角色或角色数组
 * @returns {boolean}
 */
export function hasRole(role) {
  // 数据库标记为超级管理员的角色自动拥有所有角色
  if (isSuperAdmin()) {
    return true
  }
  const roles = getRoles()
  const roleList = Array.isArray(role) ? role : [role]
  return roleList.some(r => roles.includes(r))
}

/**
 * 判断是否有指定权限码
 * 超级管理员自动拥有所有权限
 * 优化逻辑：只要用户有某个页面的菜单权限（xxx:yyy:view），
 * 就自动认为他有这个页面下的所有按钮/参数权限（xxx:yyy:add/edit/delete/export等）
 * @param {string|string[]} permission - 权限码或权限码数组
 * @returns {boolean}
 */
export function hasPermission(permission) {
  // 数据库标记为超级管理员的角色自动拥有所有权限
  if (isSuperAdmin()) {
    return true
  }
  const permissions = getPermissions()
  const permList = Array.isArray(permission) ? permission : [permission]

  return permList.some(p => {
    // 1. 先判断用户是否直接有这个权限
    if (permissions.includes(p)) return true

    // 2. 如果是按钮/参数权限（格式：xxx:yyy:action，且 action 不是 view）
    //    则判断用户是否有对应的页面菜单权限（把 action 换成 view）
    const parts = p.split(':')
    if (parts.length >= 3) {
      const action = parts[parts.length - 1]
      // 常见的按钮/参数操作类型
      const buttonActions = ['add', 'edit', 'delete', 'export', 'permission',
                             'detail', 'verify', 'handle', 'operate', 'viewAll',
                             'download', 'print', 'kick', 'test', 'refresh',
                             'reset', 'save', 'unlock', 'import']
      if (buttonActions.includes(action)) {
        // 构造对应的页面菜单权限（把最后一段换成 view）
        const viewPermission = [...parts.slice(0, -1), 'view'].join(':')
        if (permissions.includes(viewPermission)) return true
      }
    }

    return false
  })
}

/**
 * 综合权限判断（角色或权限码任一匹配即可）
 * 超级管理员自动通过所有权限判断
 * @param {string|string[]} value - 角色或权限码，支持数组
 * @returns {boolean}
 */
export function checkPermission(value) {
  if (!value) return false
  // 超级管理员自动通过所有权限判断
  if (isSuperAdmin()) {
    return true
  }
  const list = Array.isArray(value) ? value : [value]
  return list.some(item => hasRole(item) || hasPermission(item))
}

/**
 * 获取当前用户的角色等级（数据库 role_level 字段，数字越小等级越高）
 * @returns {number} 角色等级，未获取到返回大数（最低权限）
 */
export function getRoleLevel() {
  const userInfo = store.state.user?.userInfo || {}
  return Number(userInfo.role_level) || 9999
}

/**
 * 安装为 Vue 插件，挂载到 Vue.prototype
 */
export default {
  install(Vue) {
    Vue.prototype.$hasRole = hasRole
    Vue.prototype.$hasPermission = hasPermission
    Vue.prototype.$checkPermission = checkPermission
    Vue.prototype.$isSuperAdmin = isSuperAdmin
  }
}
