/**
 * 用户管理模块 - 控制器层单元测试
 * 
 * 测试 src/modules/user/user.controller.js 中的主要方法
 * 使用 mock 模拟 service 层和请求响应对象
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

// Mock service 层
jest.mock('../../src/modules/user/user.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  getUserById: jest.fn(),
  getUserList: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  resetPassword: jest.fn(),
  updateUserStatus: jest.fn(),
  verifyPassword: jest.fn()
}))

jest.mock('../../src/modules/audit/auditLogger', () => ({
  logUserRegister: jest.fn(),
  logUserCreate: jest.fn(),
  logUserUpdate: jest.fn(),
  logUserDelete: jest.fn(),
  log: jest.fn()
}))

const userController = require('../../src/modules/user/user.controller')
const userService = require('../../src/modules/user/user.service')

// Mock 请求和响应对象
const mockRequest = (options = {}) => ({
  body: options.body || {},
  query: options.query || {},
  params: options.params || {},
  user: options.user || { id: 1, username: 'admin' },
  ip: options.ip || '127.0.0.1',
  headers: options.headers || {},
  connection: { remoteAddress: '127.0.0.1' },
  ...options
})

const mockResponse = () => {
  const res = {}
  res.success = jest.fn().mockReturnValue(res)
  res.error = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockNext = jest.fn()

describe('用户控制器 - 登录接口', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('登录成功时应该调用 res.success', async () => {
    // Arrange
    const req = mockRequest({
      body: { username: 'admin', password: '123456' }
    })
    const res = mockResponse()
    userService.login.mockResolvedValue({ token: 'mock-token', userInfo: { id: 1 } })

    // Act
    await userController.login(req, res, mockNext)

    // Assert
    expect(userService.login).toHaveBeenCalledWith('admin', '123456', '127.0.0.1', '', expect.any(String))
    expect(res.success).toHaveBeenCalledWith(expect.objectContaining({ token: 'mock-token' }), '登录成功')
  })

  test('登录失败时应该调用 next 传递错误', async () => {
    // Arrange
    const req = mockRequest({ body: { username: 'admin', password: 'wrong' } })
    const res = mockResponse()
    const mockError = new Error('密码错误')
    userService.login.mockRejectedValue(mockError)

    // Act
    await userController.login(req, res, mockNext)

    // Assert
    expect(mockNext).toHaveBeenCalledWith(mockError)
  })
})

describe('用户控制器 - 用户列表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页用户列表', async () => {
    // Arrange
    const req = mockRequest({ query: { page: 1, pageSize: 10 } })
    const res = mockResponse()
    const mockResult = { list: [], total: 0, page: 1, pageSize: 10 }
    userService.getUserList.mockResolvedValue(mockResult)

    // Act
    await userController.getUserList(req, res, mockNext)

    // Assert
    expect(userService.getUserList).toHaveBeenCalledWith(req.query, expect.any(String))
    expect(res.success).toHaveBeenCalledWith(mockResult)
  })
})

describe('用户控制器 - 获取当前用户信息', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回当前登录用户信息', async () => {
    // Arrange
    const req = mockRequest({ user: { id: 1, username: 'admin' } })
    const res = mockResponse()
    const mockUser = { id: 1, username: 'admin', role: 'administrator' }
    userService.getUserById.mockResolvedValue(mockUser)

    // Act
    await userController.getCurrentUser(req, res, mockNext)

    // Assert
    expect(userService.getUserById).toHaveBeenCalledWith(1, expect.any(String))
    expect(res.success).toHaveBeenCalledWith(mockUser)
  })
})

describe('用户控制器 - 创建用户', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建用户成功时应该返回创建成功', async () => {
    // Arrange
    const req = mockRequest({
      body: { username: 'newuser', password: '123456', role: 'operator' }
    })
    const res = mockResponse()
    userService.createUser.mockResolvedValue({ insertId: 1 })

    // Act
    await userController.createUser(req, res, mockNext)

    // Assert
    expect(userService.createUser).toHaveBeenCalledWith(req.body)
    expect(res.success).toHaveBeenCalled()
  })
})

describe('用户控制器 - 删除用户', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('删除用户成功时应该返回删除成功', async () => {
    // Arrange
    const req = mockRequest({
      params: { id: 1 },
      body: { password: '123456' },
      user: { id: 1, username: 'admin' }
    })
    const res = mockResponse()
    userService.verifyPassword.mockResolvedValue(true)
    userService.getUserById.mockResolvedValue({ id: 1, username: 'testuser', role: 'operator' })
    userService.deleteUser.mockResolvedValue({ affectedRows: 1 })

    // Act
    await userController.deleteUser(req, res, mockNext)

    // Assert
    expect(userService.verifyPassword).toHaveBeenCalled()
    expect(userService.deleteUser).toHaveBeenCalledWith(1)
  })

  test('没有输入密码时应该返回错误', async () => {
    // Arrange
    const req = mockRequest({
      params: { id: 1 },
      body: {},
      user: { id: 1, username: 'admin' }
    })
    const res = mockResponse()

    // Act
    await userController.deleteUser(req, res, mockNext)

    // Assert
    expect(res.error).toHaveBeenCalled()
  })
})
