/**
 * 用户管理模块 - 业务逻辑层单元测试
 * 
 * 测试 src/modules/user/user.service.js 中的主要方法
 * 使用 mock 模拟数据库操作，无需真实数据库
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

// Mock 依赖模块
jest.mock('./user.model', () => ({
  getByUsernameWithRole: jest.fn(),
  getByUsername: jest.fn(),
  getByIdWithDept: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateLoginInfo: jest.fn(),
  getPageList: jest.fn(),
  findOne: jest.fn()
}))

jest.mock('../../utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
}))

jest.mock('../../utils/jwt', () => ({
  generateToken: jest.fn()
}))

jest.mock('../audit/auditLogger', () => ({
  log: jest.fn(),
  logUserRegister: jest.fn(),
  logUserCreate: jest.fn(),
  logUserUpdate: jest.fn(),
  logUserDelete: jest.fn(),
  ACTION: {
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGIN_FAILED: 'USER_LOGIN_FAILED',
    USER_REGISTER: 'USER_REGISTER',
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE'
  }
}))

const userService = require('./user.service')
const userModel = require('./user.model')
const { hashPassword, comparePassword } = require('../../utils/password')
const { generateToken } = require('../../utils/jwt')
const auditLogger = require('../audit/auditLogger')

describe('用户服务 - 登录功能', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('用户不存在时应该抛出 USER_NOT_EXIST 错误', async () => {
    // Arrange
    userModel.getByUsernameWithRole.mockResolvedValue(null)

    // Act & Assert
    await expect(userService.login('testuser', '123456', '127.0.0.1'))
      .rejects
      .toMatchObject({ code: 20001 })
    
    expect(auditLogger.log).toHaveBeenCalled()
  })

  test('账号被禁用时应该抛出 USER_DISABLED 错误', async () => {
    // Arrange
    userModel.getByUsernameWithRole.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedpassword',
      status: 0,
      role: 'operator'
    })

    // Act & Assert
    await expect(userService.login('testuser', '123456', '127.0.0.1'))
      .rejects
      .toMatchObject({ code: 20004 })
  })

  test('密码错误时应该抛出 USER_PASSWORD_ERROR 错误', async () => {
    // Arrange
    userModel.getByUsernameWithRole.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashedpassword',
      status: 1,
      role: 'operator'
    })
    comparePassword.mockResolvedValue(false)

    // Act & Assert
    await expect(userService.login('testuser', 'wrongpassword', '127.0.0.1'))
      .rejects
      .toMatchObject({ code: 20003 })
  })

  test('登录成功时应该返回 token 和用户信息', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'hashedpassword',
      status: 1,
      role: 'operator',
      real_name: '测试用户',
      data_scope: 'self',
      dept_id: 100
    }
    userModel.getByUsernameWithRole.mockResolvedValue(mockUser)
    comparePassword.mockResolvedValue(true)
    generateToken.mockReturnValue('mock-jwt-token')
    userModel.updateLoginInfo.mockResolvedValue({ affectedRows: 1 })

    // Act
    const result = await userService.login('testuser', '123456', '127.0.0.1', 'TestUA')

    // Assert
    expect(result).toHaveProperty('token', 'mock-jwt-token')
    expect(result).toHaveProperty('userInfo')
    expect(result.userInfo).toHaveProperty('username', 'testuser')
    expect(generateToken).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      username: 'testuser',
      role: 'operator'
    }))
    expect(userModel.updateLoginInfo).toHaveBeenCalledWith(1, '127.0.0.1')
  })
})

describe('用户服务 - 用户列表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页用户列表', async () => {
    // Arrange
    const mockResult = {
      list: [
        { id: 1, username: 'user1', role: 'admin' },
        { id: 2, username: 'user2', role: 'operator' }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    }
    userModel.getPageList.mockResolvedValue(mockResult)

    // Act
    const result = await userService.getUserList({ page: 1, pageSize: 10 }, 'zh-CN')

    // Assert
    expect(result).toEqual(mockResult)
    expect(userModel.getPageList).toHaveBeenCalled()
  })
})

describe('用户服务 - 用户创建', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('用户名已存在时应该抛出 USER_ALREADY_EXIST 错误', async () => {
    // Arrange
    userModel.getByUsername.mockResolvedValue({ id: 1, username: 'existinguser' })

    // Act & Assert
    await expect(userService.createUser({ username: 'existinguser', password: '123456' }))
      .rejects
      .toMatchObject({ code: 20002 })
  })

  test('创建用户成功时应该返回 insertId', async () => {
    // Arrange
    userModel.getByUsername.mockResolvedValue(null)
    hashPassword.mockResolvedValue('hashedpassword')
    userModel.create.mockResolvedValue({ insertId: 1, affectedRows: 1 })

    // Act
    const result = await userService.createUser({
      username: 'newuser',
      password: '123456',
      role: 'operator',
      real_name: '新用户'
    })

    // Assert
    expect(result).toHaveProperty('insertId', 1)
    expect(hashPassword).toHaveBeenCalledWith('123456')
    expect(userModel.create).toHaveBeenCalled()
  })
})

describe('用户服务 - 密码重置', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('用户不存在时应该抛出错误', async () => {
    // Arrange
    userModel.getByIdWithDept.mockResolvedValue(null)

    // Act & Assert
    await expect(userService.resetPassword(999, 'newpassword'))
      .rejects
      .toThrow()
  })

  test('密码重置成功时应该调用 update 方法', async () => {
    // Arrange
    userModel.getByIdWithDept.mockResolvedValue({ id: 1, username: 'testuser' })
    hashPassword.mockResolvedValue('newhashedpassword')
    userModel.update.mockResolvedValue({ affectedRows: 1 })

    // Act
    await userService.resetPassword(1, 'newpassword')

    // Assert
    expect(hashPassword).toHaveBeenCalledWith('newpassword')
    expect(userModel.update).toHaveBeenCalledWith(1, expect.objectContaining({
      password: 'newhashedpassword'
    }))
  })
})
