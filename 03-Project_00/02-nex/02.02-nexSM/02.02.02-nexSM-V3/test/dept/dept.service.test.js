/**
 * 部门管理模块 - 业务逻辑层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('./dept.model', () => ({
  DeptModel: {
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getPageList: jest.fn()
  }
}))

jest.mock('../../utils/i18n', () => ({
  getLangValue: jest.fn((val) => typeof val === 'object' ? val['zh-CN'] : val),
  processLangFields: jest.fn((data) => data),
  buildLangObject: jest.fn((zh, en) => ({ 'zh-CN': zh, 'en-US': en || zh }))
}))

const deptService = require('./dept.service')
const { DeptModel } = require('./dept.model')

describe('部门服务 - 部门树查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回部门树形结构', async () => {
    const mockDepts = [
      { id: 100, parent_id: 0, dept_name: '总公司', order_num: 0 },
      { id: 101, parent_id: 100, dept_name: '技术部', order_num: 1 },
      { id: 102, parent_id: 100, dept_name: '生产部', order_num: 2 }
    ]
    DeptModel.findAll.mockResolvedValue(mockDepts)

    const result = await deptService.getDeptTree('zh-CN')

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0]).toHaveProperty('children')
    expect(result[0].children.length).toBe(2)
  })

  test('空部门列表时应该返回空数组', async () => {
    DeptModel.findAll.mockResolvedValue([])

    const result = await deptService.getDeptTree('zh-CN')

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })
})

describe('部门服务 - 部门详情查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('部门不存在时应该抛出错误', async () => {
    DeptModel.getById.mockResolvedValue(null)

    await expect(deptService.getDeptById(999, 'zh-CN')).rejects.toThrow()
  })

  test('应该返回部门详情', async () => {
    const mockDept = { id: 101, dept_name: '技术部', parent_id: 100 }
    DeptModel.getById.mockResolvedValue(mockDept)

    const result = await deptService.getDeptById(101, 'zh-CN')

    expect(result).toHaveProperty('id', 101)
    expect(result).toHaveProperty('dept_name', '技术部')
  })
})

describe('部门服务 - 部门创建', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建部门成功时应该返回 insertId', async () => {
    DeptModel.create.mockResolvedValue({ insertId: 103, affectedRows: 1 })

    const result = await deptService.createDept({
      dept_name: '质量部',
      parent_id: 100,
      order_num: 3
    })

    expect(result).toHaveProperty('insertId', 103)
    expect(DeptModel.create).toHaveBeenCalled()
  })
})

describe('部门服务 - 部门删除', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('存在子部门时应该抛出错误', async () => {
    DeptModel.findAll.mockResolvedValue([{ id: 101, parent_id: 100 }])

    await expect(deptService.deleteDept(100)).rejects.toThrow()
  })

  test('删除部门成功时应该返回 affectedRows', async () => {
    DeptModel.findAll.mockResolvedValue([])
    DeptModel.delete.mockResolvedValue({ affectedRows: 1 })

    const result = await deptService.deleteDept(101)

    expect(result).toHaveProperty('affectedRows', 1)
  })
})
