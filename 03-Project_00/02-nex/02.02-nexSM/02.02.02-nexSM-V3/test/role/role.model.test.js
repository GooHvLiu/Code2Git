/**
 * 角色管理模块 - 数据模型层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../db/index', () => ({
  query: jest.fn()
}))

const { RoleModel, RoleMenuModel } = require('../../src/modules/role/role.model')

describe('角色数据模型', () => {
  let roleModel

  beforeEach(() => {
    jest.clearAllMocks()
    roleModel = new RoleModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(roleModel).toHaveProperty('tableName', 'nex_role')
    expect(roleModel).toHaveProperty('allowFields')
    expect(roleModel.allowFields).toContain('role_name')
    expect(roleModel.allowFields).toContain('role_code')
    expect(roleModel.allowFields).toContain('data_scope')
  })

  test('filterFields 应该只保留白名单内的字段', () => {
    const rawData = {
      role_name: '管理员',
      role_code: 'administrator',
      invalidField: 'should be removed',
      id: 999
    }
    const result = roleModel.filterFields(rawData)
    expect(result).toHaveProperty('role_name')
    expect(result).toHaveProperty('role_code')
    expect(result).not.toHaveProperty('invalidField')
    expect(result).not.toHaveProperty('id')
  })
})

describe('角色菜单关联数据模型', () => {
  let roleMenuModel

  beforeEach(() => {
    jest.clearAllMocks()
    roleMenuModel = new RoleMenuModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(roleMenuModel).toHaveProperty('tableName', 'nex_role_menu')
    expect(roleMenuModel).toHaveProperty('allowFields')
    expect(roleMenuModel.allowFields).toContain('role_id')
    expect(roleMenuModel.allowFields).toContain('menu_id')
  })
})
