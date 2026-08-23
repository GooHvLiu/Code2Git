/**
 * 部门管理模块 - 控制器层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../src/modules/dept/dept.service', () => ({
  getDeptTree: jest.fn(),
  getDeptById: jest.fn(),
  createDept: jest.fn(),
  updateDept: jest.fn(),
  deleteDept: jest.fn()
}))

const deptController = require('../../src/modules/dept/dept.controller')
const deptService = require('../../src/modules/dept/dept.service')

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

describe('部门控制器 - 部门树查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回部门树形结构', async () => {
    const req = mockRequest()
    const res = mockResponse()
    const mockTree = [{ id: 100, dept_name: '总公司', children: [] }]
    deptService.getDeptTree.mockResolvedValue(mockTree)

    await deptController.getDeptTree(req, res, mockNext)

    expect(deptService.getDeptTree).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalledWith(mockTree)
  })
})

describe('部门控制器 - 部门详情查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回部门详情', async () => {
    const req = mockRequest({ params: { id: 101 } })
    const res = mockResponse()
    deptService.getDeptById.mockResolvedValue({ id: 101, dept_name: '技术部' })

    await deptController.getDeptById(req, res, mockNext)

    expect(deptService.getDeptById).toHaveBeenCalledWith(101, expect.any(String))
    expect(res.success).toHaveBeenCalled()
  })
})

describe('部门控制器 - 部门管理操作', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建部门成功时应该返回创建成功', async () => {
    const req = mockRequest({ body: { dept_name: '质量部', parent_id: 100 } })
    const res = mockResponse()
    deptService.createDept.mockResolvedValue({ insertId: 103 })

    await deptController.createDept(req, res, mockNext)

    expect(deptService.createDept).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('更新部门成功时应该返回更新成功', async () => {
    const req = mockRequest({ params: { id: 101 }, body: { dept_name: '研发部' } })
    const res = mockResponse()
    deptService.updateDept.mockResolvedValue({ affectedRows: 1 })

    await deptController.updateDept(req, res, mockNext)

    expect(deptService.updateDept).toHaveBeenCalledWith(101, expect.any(Object))
    expect(res.success).toHaveBeenCalled()
  })

  test('删除部门成功时应该返回删除成功', async () => {
    const req = mockRequest({ params: { id: 101 } })
    const res = mockResponse()
    deptService.deleteDept.mockResolvedValue({ affectedRows: 1 })

    await deptController.deleteDept(req, res, mockNext)

    expect(deptService.deleteDept).toHaveBeenCalledWith(101)
    expect(res.success).toHaveBeenCalled()
  })
})
