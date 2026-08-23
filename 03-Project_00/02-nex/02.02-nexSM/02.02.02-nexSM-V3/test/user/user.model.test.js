/**
 * 用户管理模块 - 数据模型层单元测试
 * 
 * 测试 src/modules/user/user.model.js 中的主要方法
 * 使用 mock 模拟数据库查询，无需真实数据库
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

// Mock 数据库查询
jest.mock('../../db/index', () => ({
  query: jest.fn()
}))

const { query } = require('../../db/index')
const UserModel = require('../../src/modules/user/user.model')

describe('用户数据模型', () => {
  let userModel

  beforeEach(() => {
    jest.clearAllMocks()
    userModel = new UserModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(userModel).toHaveProperty('tableName', 'nex_user')
    expect(userModel).toHaveProperty('allowFields')
    expect(userModel.allowFields).toContain('username')
    expect(userModel.allowFields).toContain('password')
    expect(userModel.allowFields).toContain('role')
  })

  test('getByUsername 应该调用 findOne 方法', async () => {
    // Arrange
    const mockUser = { id: 1, username: 'testuser' }
    query.mockResolvedValue([mockUser])

    // Act
    const result = await userModel.getByUsername('testuser')

    // Assert
    expect(query).toHaveBeenCalled()
    expect(result).toEqual(mockUser)
  })

  test('updateLoginInfo 应该调用 update 方法', async () => {
    // Arrange
    query.mockResolvedValue({ affectedRows: 1 })

    // Act
    const result = await userModel.updateLoginInfo(1, '127.0.0.1')

    // Assert
    expect(query).toHaveBeenCalled()
    expect(result).toHaveProperty('affectedRows', 1)
  })

  test('getByUsernameWithRole 应该关联查询角色表', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      username: 'testuser',
      role: 'admin',
      data_scope: 'all',
      role_name: { 'zh-CN': '管理员', 'en-US': 'Administrator' }
    }
    query.mockResolvedValue([mockUser])

    // Act
    const result = await userModel.getByUsernameWithRole('testuser', 'zh-CN')

    // Assert
    expect(query).toHaveBeenCalled()
    expect(result).toHaveProperty('username', 'testuser')
    expect(result).toHaveProperty('data_scope', 'all')
  })

  test('getByUsernameWithRole 用户不存在时应该返回 null', async () => {
    // Arrange
    query.mockResolvedValue([])

    // Act
    const result = await userModel.getByUsernameWithRole('nonexistent', 'zh-CN')

    // Assert
    expect(result).toBeNull()
  })

  test('filterFields 应该只保留白名单内的字段', () => {
    // Arrange
    const rawData = {
      username: 'testuser',
      password: '123456',
      role: 'admin',
      invalidField: 'should be removed',
      id: 999 // id 不在白名单中
    }

    // Act
    const result = userModel.filterFields(rawData)

    // Assert
    expect(result).toHaveProperty('username', 'testuser')
    expect(result).toHaveProperty('password', '123456')
    expect(result).toHaveProperty('role', 'admin')
    expect(result).not.toHaveProperty('invalidField')
    expect(result).not.toHaveProperty('id')
  })
})
