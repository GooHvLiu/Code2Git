/**
 * ==========================================
 * permission.ts 单元测试
 * ==========================================
 * mock @/store/modules/user，隔离真实 store 依赖（user store 引入了 router/api/ws 等重链路）
 * 覆盖超级管理员短路、角色判断、权限点判断与 view 兜底、checkPermission
 * 作者：GooHv
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// 可变的用户状态，每个用例前重置
const mockState = {
  userInfo: {} as Record<string, unknown>,
  roles: [] as string[],
  permissions: [] as string[]
}

vi.mock('@/store/modules/user', () => ({
  useUserStore: () => mockState
}))

import { isSuperAdmin, hasRole, hasPermission, checkPermission, getRoleLevel } from './permission'

describe('isSuperAdmin', () => {
  beforeEach(() => {
    mockState.userInfo = {}
    mockState.roles = []
    mockState.permissions = []
  })

  it('is_super_admin=1 时为超级管理员', () => {
    mockState.userInfo = { is_super_admin: 1 }
    expect(isSuperAdmin()).toBe(true)
  })

  it('is_super_admin=0 或缺失时不是超管', () => {
    mockState.userInfo = { is_super_admin: 0 }
    expect(isSuperAdmin()).toBe(false)
    mockState.userInfo = {}
    expect(isSuperAdmin()).toBe(false)
  })
})

describe('hasRole', () => {
  beforeEach(() => {
    mockState.userInfo = {}
    mockState.roles = ['admin', 'editor']
    mockState.permissions = []
  })

  it('超管直接放行', () => {
    mockState.userInfo = { is_super_admin: 1 }
    expect(hasRole('nobody')).toBe(true)
  })

  it('命中单个角色返回 true', () => {
    expect(hasRole('editor')).toBe(true)
  })

  it('命中数组中任一角色返回 true', () => {
    expect(hasRole(['viewer', 'admin'])).toBe(true)
  })

  it('未命中返回 false', () => {
    expect(hasRole('superuser')).toBe(false)
    expect(hasRole(['viewer', 'guest'])).toBe(false)
  })
})

describe('hasPermission', () => {
  beforeEach(() => {
    mockState.userInfo = {}
    mockState.roles = []
    mockState.permissions = ['system:user:view', 'system:role:view']
  })

  it('超管直接放行', () => {
    mockState.userInfo = { is_super_admin: 1 }
    expect(hasPermission('system:user:delete')).toBe(true)
  })

  it('精确命中权限点', () => {
    expect(hasPermission('system:user:view')).toBe(true)
  })

  it('按钮级权限点由 view 权限兜底', () => {
    // 只有 system:user:view，访问 system:user:add 应通过 view 兜底放行
    expect(hasPermission('system:user:add')).toBe(true)
    // system:role:view 兜底 role 的按钮操作
    expect(hasPermission('system:role:edit')).toBe(true)
  })

  it('无任何匹配返回 false', () => {
    expect(hasPermission('device:alarm:view')).toBe(false)
    expect(hasPermission('system:user:unknown')).toBe(false)
  })
})

describe('checkPermission', () => {
  beforeEach(() => {
    mockState.userInfo = {}
    mockState.roles = ['admin']
    mockState.permissions = ['system:user:view']
  })

  it('空值返回 false', () => {
    expect(checkPermission('')).toBe(false)
    expect(checkPermission([])).toBe(false)
  })

  it('超管放行一切', () => {
    mockState.userInfo = { is_super_admin: 1 }
    expect(checkPermission('anything')).toBe(true)
  })

  it('命中角色即放行', () => {
    expect(checkPermission('admin')).toBe(true)
  })

  it('命中权限点即放行', () => {
    expect(checkPermission('system:user:view')).toBe(true)
  })

  it('都未命中返回 false', () => {
    expect(checkPermission(['guest', 'device:op:do'])).toBe(false)
  })
})

describe('getRoleLevel', () => {
  it('缺失 role_level 时返回 9999', () => {
    mockState.userInfo = {}
    expect(getRoleLevel()).toBe(9999)
  })

  it('存在 role_level 时返回该值', () => {
    mockState.userInfo = { role_level: 10 }
    expect(getRoleLevel()).toBe(10)
  })
})
