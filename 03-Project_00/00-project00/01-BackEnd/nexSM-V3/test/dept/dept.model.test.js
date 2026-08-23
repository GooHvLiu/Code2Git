/**
 * 部门管理模块 - 数据模型层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../db/index', () => ({
  query: jest.fn()
}))

const { DeptModel } = require('../../src/modules/dept/dept.model')

describe('部门数据模型', () => {
  let deptModel

  beforeEach(() => {
    jest.clearAllMocks()
    deptModel = new DeptModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(deptModel).toHaveProperty('tableName', 'nex_dept')
    expect(deptModel).toHaveProperty('allowFields')
    expect(deptModel.allowFields).toContain('dept_name')
    expect(deptModel.allowFields).toContain('parent_id')
    expect(deptModel.allowFields).toContain('order_num')
    expect(deptModel.allowFields).toContain('leader')
  })

  test('filterFields 应该只保留白名单内的字段', () => {
    const rawData = {
      dept_name: '技术部',
      parent_id: 100,
      invalidField: 'should be removed',
      id: 999
    }
    const result = deptModel.filterFields(rawData)
    expect(result).toHaveProperty('dept_name')
    expect(result).toHaveProperty('parent_id')
    expect(result).not.toHaveProperty('invalidField')
    expect(result).not.toHaveProperty('id')
  })
})
