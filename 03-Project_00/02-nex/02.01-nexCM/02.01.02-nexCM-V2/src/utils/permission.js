/**
 * 权限判断
 * @param {Array} value 权限标识数组
 * @returns {Boolean}
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const permissionPermissions = value

    return permissions.some(role => {
      return permissionPermissions.includes(role)
    })
  } else {
    console.error("need permissions! Like v-permission=\"['user:add']\"")
    return false
  }
}

let store
export const usePermissionStore = _store => {
  store = _store
}
