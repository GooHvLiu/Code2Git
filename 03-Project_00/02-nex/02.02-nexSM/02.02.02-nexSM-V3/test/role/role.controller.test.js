/**
 * 角色管理模块 - 控制器层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../src/modules/role/role.service', () => ({
  getRoleList: jest.fn(),
  getAllRoles: jest.fn(),
  getRoleById: jest.fn(),
  createRole: jest.fn(),
  updateRole: jest.fn(),
  deleteRole: jest.fn()
}))

const roleController = require('../../src/modules/role/role.controller')
const roleService = require('../../src/modules/role/role.service')

const mockRequest = (options = {}) => ({
  body: options.body || {},
  query: options.query || {},
  params: options.params || {},
  ...options
})

const mockResponse = () => {
  const res = {}
  res.success = jest.fn().mockReturnValue(res)
  return res
}

const mockNext = jest.fn()

describe('角色控制器 - 角色列表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页角色列表', async () => {
    const req = mockRequest({ query: { page: 1, pageSize: 10 } })
    const res = mockResponse()
    roleService.getRoleList.mockResolvedValue({ list: [], total: 0 })

    await roleController.getRoleList(req, res, mockNext)

    expect(roleService.getRoleList).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('应该返回所有启用的角色（下拉选择用）', async () => {
    const req = mockRequest()
    const res = mockResponse()
    roleService.getAllRoles.mockResolvedValue([])

    await roleController.getAllRoles(req, res, mockNext)

    expect(roleService.getAllRoles).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })
})

describe('角色控制器 - 角色详情查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回角色详情', async () => {
    const req = mockRequest({ params: { id: 1 } })
    const res = mockResponse()
    roleService.getRoleById.mockResolvedValue({ id: 1, role_name: '管理员' })

    await roleController.getRoleById(req, res, mockNext)

    expect(roleService.getRoleById).toHaveBeenCalledWith(1, expect.any(String))
    expect(res.success).toHaveBeenCalled()
  })
})

describe('角色控制器 - 角色管理操作', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建角色成功时应该返回创建成功', async () => {
    const req = mockRequest({ body: { role_code: 'test', role_name: '测试' } })
    const res = mockResponse()
    roleService.createRole.mockResolvedValue({ insertId: 1 })

    await roleController.createRole(req, res, mockNext)

    expect(roleService.createRole).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('更新角色成功时应该返回更新成功', async () => {
    const req = mockRequest({ params: { id: 1 }, body: { role_name: '新名称' } })
    const res = mockResponse()
    roleService.updateRole.mockResolvedValue({ affectedRows: 1 })

    await roleController.updateRole(req, res, mockNext)

    expect(roleService.updateRole).toHaveBeenCalledWith(1, expect.any(Object))
    expect(res.success).toHaveBeenCalled()
  })

  test('删除角色成功时应该返回删除成功', async () => {
    const req = mockRequest({ params: { id: 1 } })
    const res = mockResponse()
    roleService.deleteRole.mockResolvedValue({ affectedRows: 1 })

    await roleController.deleteRole(req, res, mockNext)

    expect(roleService.deleteRole).toHaveBeenCalledWith(1)
    expect(res.success).toHaveBeenCalled()
  })
})
