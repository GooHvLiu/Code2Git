/**
 * 角色管理模块 - 业务逻辑层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('./role.model', () => ({
  RoleModel: {
    getPageList: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByCode: jest.fn(),
    getAllEnabled: jest.fn()
  },
  RoleMenuModel: {
    getMenuIdsByRoleId: jest.fn(),
    batchInsert: jest.fn(),
    deleteByRoleId: jest.fn()
  }
}))

jest.mock('../../utils/i18n', () => ({
  getLangValue: jest.fn((val) => typeof val === 'object' ? val['zh-CN'] : val),
  processLangFields: jest.fn((data) => data),
  buildLangObject: jest.fn((zh, en) => ({ 'zh-CN': zh, 'en-US': en || zh }))
}))

const roleService = require('./role.service')
const { RoleModel, RoleMenuModel } = require('./role.model')

describe('角色服务 - 角色列表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页角色列表', async () => {
    const mockResult = {
      list: [
        { id: 1, role_name: '管理员', role_code: 'administrator' },
        { id: 2, role_name: '工程师', role_code: 'engineer' }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    }
    RoleModel.getPageList.mockResolvedValue(mockResult)

    const result = await roleService.getRoleList({ page: 1, pageSize: 10 }, 'zh-CN')

    expect(result).toEqual(mockResult)
    expect(RoleModel.getPageList).toHaveBeenCalled()
  })

  test('应该返回所有启用的角色', async () => {
    const mockRoles = [
      { id: 1, role_name: '管理员', role_code: 'administrator', status: 1 }
    ]
    RoleModel.getAllEnabled.mockResolvedValue(mockRoles)

    const result = await roleService.getAllRoles('zh-CN')

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
  })
})

describe('角色服务 - 角色详情查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('角色不存在时应该抛出错误', async () => {
    RoleModel.getById.mockResolvedValue(null)

    await expect(roleService.getRoleById(999, 'zh-CN')).rejects.toThrow()
  })

  test('应该返回角色详情（含菜单权限）', async () => {
    const mockRole = { id: 1, role_name: '管理员', role_code: 'administrator' }
    const mockMenuIds = ['_001', '_002', '_003']
    RoleModel.getById.mockResolvedValue(mockRole)
    RoleMenuModel.getMenuIdsByRoleId.mockResolvedValue(mockMenuIds)

    const result = await roleService.getRoleById(1, 'zh-CN')

    expect(result).toHaveProperty('id', 1)
    expect(result).toHaveProperty('menuIds', mockMenuIds)
  })
})

describe('角色服务 - 角色创建', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('角色编码已存在时应该抛出错误', async () => {
    RoleModel.getByCode.mockResolvedValue({ id: 1, role_code: 'existing' })

    await expect(roleService.createRole({ role_code: 'existing', role_name: '测试' }))
      .rejects
      .toThrow()
  })

  test('创建角色成功时应该返回 insertId', async () => {
    RoleModel.getByCode.mockResolvedValue(null)
    RoleModel.create.mockResolvedValue({ insertId: 1 })
    RoleMenuModel.batchInsert.mockResolvedValue({ affectedRows: 3 })

    const result = await roleService.createRole({
      role_code: 'new_role',
      role_name: '新角色',
      menuIds: ['_001', '_002']
    })

    expect(result).toHaveProperty('insertId', 1)
    expect(RoleMenuModel.batchInsert).toHaveBeenCalledWith(1, ['_001', '_002'])
  })
})
