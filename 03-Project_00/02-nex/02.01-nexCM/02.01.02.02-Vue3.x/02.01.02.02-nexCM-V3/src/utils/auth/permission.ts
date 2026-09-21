/**
 * ==========================================
 * 权限判断工具函数
 * ==========================================
 * 与 v-permission 指令逻辑一致；超级管理员依据 is_super_admin 字段
 */
import { useUserStore } from '@/store/modules/user'

function getRoles(): string[] {
  return useUserStore().roles || []
}

function getPermissions(): string[] {
  return useUserStore().permissions || []
}

export function isSuperAdmin(): boolean {
  const userInfo = useUserStore().userInfo || {}
  return Number(userInfo.is_super_admin) === 1
}

export function hasRole(role: string | string[]): boolean {
  if (isSuperAdmin()) return true
  const roles = getRoles()
  const roleList = Array.isArray(role) ? role : [role]
  return roleList.some(r => roles.includes(r))
}

export function hasPermission(permission: string | string[]): boolean {
  if (isSuperAdmin()) return true
  const permissions = getPermissions()
  const permList = Array.isArray(permission) ? permission : [permission]
  return permList.some(p => {
    if (permissions.includes(p)) return true
    const parts = p.split(':')
    if (parts.length >= 3) {
      const action = parts[parts.length - 1]
      const buttonActions = ['add', 'edit', 'delete', 'export', 'permission',
        'detail', 'verify', 'handle', 'operate', 'viewAll',
        'download', 'print', 'kick', 'test', 'refresh',
        'reset', 'save', 'unlock', 'import']
      if (buttonActions.includes(action)) {
        const viewPermission = [...parts.slice(0, -1), 'view'].join(':')
        if (permissions.includes(viewPermission)) return true
      }
    }
    return false
  })
}

export function checkPermission(value: string | string[]): boolean {
  if (!value) return false
  if (isSuperAdmin()) return true
  const list = Array.isArray(value) ? value : [value]
  return list.some(item => hasRole(item) || hasPermission(item))
}

export function getRoleLevel(): number {
  const userInfo = useUserStore().userInfo || {}
  return Number(userInfo.role_level) || 9999
}
