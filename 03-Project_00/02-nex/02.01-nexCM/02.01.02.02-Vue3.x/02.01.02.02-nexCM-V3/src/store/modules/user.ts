/**
 * ==========================================
 * User Store - 用户信息与权限
 * ==========================================
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { requestGetUserInfoApi, requestGetMyPermissionsApi } from '@/api'
import { getToken, removeToken } from '@/utils/auth/auth'
import ws from '@/utils/request/websocket'
import { clearLoginStorage, getLocalStorage, setLocalStorage } from '@/utils/data/storage'
import { LOCALSTORAGE_KEYS } from '@/utils/data/storageKey'
import { resetRouter } from '@/router'
import type { UserInfo } from '@/types/user'
import { useTagsViewStore } from './tagsView'
import { usePermissionStore } from './permission'

function getDefaultUserInfo(): UserInfo {
  return {
    id: null,
    username: null,
    role: null,
    avatar: null,
    realName: null,
    real_name: null,
    sex: null,
    remark: null,
    phone: null,
    email: null,
    status: null,
    createTime: null,
    create_time: null,
    deptId: null,
    dept_id: null,
    loginIp: null,
    login_ip: null,
    loginDate: null,
    login_date: null
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const userInfo = ref<UserInfo>(getDefaultUserInfo())
  const roles = ref<string[]>([])
  const permissions = ref<string[]>(getLocalStorage<string[]>(LOCALSTORAGE_KEYS.PERMISSIONS) || [])
  const permissionVersion = ref<string | number | null>(
    getLocalStorage<string | number>(LOCALSTORAGE_KEYS.PERMISSION_VERSION) || null
  )

  function setToken(t: string): void {
    token.value = t
  }

  function setUserInfo(info: UserInfo): void {
    userInfo.value = info
  }

  function setRoles(r: string[]): void {
    roles.value = r
  }

  function setPermissions(p: string[]): void {
    permissions.value = p
    setLocalStorage(LOCALSTORAGE_KEYS.PERMISSIONS, p)
  }

  function setPermissionVersion(v: string | number | null): void {
    permissionVersion.value = v
    setLocalStorage(LOCALSTORAGE_KEYS.PERMISSION_VERSION, v)
  }

  async function getUserInfo(): Promise<void> {
    const res = await requestGetUserInfoApi()
    if (!res || !res.data) return
    const data = res.data as UserInfo
    const info: UserInfo = {
      ...data,
      realName: data.real_name || data.realName,
      createTime: data.create_time || data.createTime,
      deptId: data.dept_id || data.deptId,
      loginIp: data.login_ip || data.loginIp,
      loginDate: data.login_date || data.loginDate,
      isFirstLogin: Boolean(data.is_first_login || data.isFirstLogin),
      firstLoginAt: (data.first_login_at || data.firstLoginAt) as string | null
    }
    setUserInfo(info)
    const roleArr = data.role ? (Array.isArray(data.role) ? data.role : [data.role]) : []
    setRoles(roleArr)
    if (Array.isArray(data.permissions)) setPermissions(data.permissions as string[])
    if (data.permissionVersion) setPermissionVersion(data.permissionVersion as string | number)
  }

  async function refreshPermissions(): Promise<string[]> {
    try {
      const res = await requestGetMyPermissionsApi()
      if (res && res.data) {
        const data = res.data as { permissions?: string[]; permissionVersion?: string | number }
        const p = data.permissions || []
        setPermissions(p)
        setPermissionVersion(data.permissionVersion || null)
        return p
      }
      return []
    } catch (err) {
      console.error('[user] 刷新权限失败:', err)
      return []
    }
  }

  async function logout(): Promise<void> {
    try {
      ws.disconnect()
      removeToken()
      clearLoginStorage()
      token.value = ''
      userInfo.value = getDefaultUserInfo()
      roles.value = []
      permissions.value = []
      permissionVersion.value = null
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      Object.keys(localStorage)
        .filter(key => key.startsWith('nex_menu_'))
        .forEach(key => localStorage.removeItem(key))
      const permissionStore = usePermissionStore()
      permissionStore.setRoutesGenerated(false)
      permissionStore.setRoutes([])
      resetRouter()
    } catch (e) {
      // 忽略清理异常
    }
  }

  return {
    token,
    userInfo,
    roles,
    permissions,
    permissionVersion,
    setToken,
    setUserInfo,
    setRoles,
    setPermissions,
    setPermissionVersion,
    getUserInfo,
    refreshPermissions,
    logout
  }
})
