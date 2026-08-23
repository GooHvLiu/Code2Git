/**
 * 审计追踪模块 - 控制器层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../src/modules/audit/audit.service', () => ({
  getAuditList: jest.fn(),
  getMyAuditList: jest.fn(),
  verifyHashChain: jest.fn()
}))

const auditController = require('../../src/modules/audit/audit.controller')
const auditService = require('../../src/modules/audit/audit.service')

const mockRequest = (options = {}) => ({
  body: options.body || {},
  query: options.query || {},
  params: options.params || {},
  user: options.user || { id: 1, username: 'admin' },
  ...options
})

const mockResponse = () => {
  const res = {}
  res.success = jest.fn().mockReturnValue(res)
  return res
}

const mockNext = jest.fn()

describe('审计控制器 - 审计日志列表', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页审计日志列表', async () => {
    // Arrange
    const req = mockRequest({ query: { page: 1, pageSize: 10 } })
    const res = mockResponse()
    const mockResult = { list: [], total: 0, page: 1, pageSize: 10 }
    auditService.getAuditList.mockResolvedValue(mockResult)

    // Act
    await auditController.getAuditList(req, res, mockNext)

    // Assert
    expect(auditService.getAuditList).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalledWith(mockResult)
  })

  test('应该支持按用户名、操作类型、操作对象筛选', async () => {
    // Arrange
    const req = mockRequest({
      query: { page: 1, pageSize: 10, userName: 'admin', action: 'PLC_WRITE', target: 'fillVolume' }
    })
    const res = mockResponse()
    auditService.getAuditList.mockResolvedValue({ list: [], total: 0 })

    // Act
    await auditController.getAuditList(req, res, mockNext)

    // Assert
    expect(auditService.getAuditList).toHaveBeenCalledWith(
      expect.objectContaining({ userName: 'admin', action: 'PLC_WRITE' }),
      expect.any(String)
    )
  })
})

describe('审计控制器 - 个人审计日志', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回当前用户的审计日志', async () => {
    // Arrange
    const req = mockRequest({ user: { id: 1, username: 'user1' }, query: { page: 1, pageSize: 10 } })
    const res = mockResponse()
    auditService.getMyAuditList.mockResolvedValue({ list: [], total: 0 })

    // Act
    await auditController.getMyAuditList(req, res, mockNext)

    // Assert
    expect(auditService.getMyAuditList).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })
})

describe('审计控制器 - 哈希链校验', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回哈希链校验结果', async () => {
    // Arrange
    const req = mockRequest()
    const res = mockResponse()
    auditService.verifyHashChain.mockResolvedValue({ valid: true, total: 10, brokenAt: null })

    // Act
    await auditController.verifyHashChain(req, res, mockNext)

    // Assert
    expect(auditService.verifyHashChain).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalledWith(expect.objectContaining({ valid: true }))
  })
})
