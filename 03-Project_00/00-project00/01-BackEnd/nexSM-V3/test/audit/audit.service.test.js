/**
 * 审计追踪模块 - 业务逻辑层单元测试
 * 
 * 测试 src/modules/audit/audit.service.js 中的主要方法
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('./audit.model', () => ({
  create: jest.fn(),
  getPageList: jest.fn(),
  getById: jest.fn(),
  getLastRecord: jest.fn(),
  count: jest.fn()
}))

jest.mock('../../utils/i18n', () => ({
  getLangValue: jest.fn((val) => typeof val === 'object' ? val['zh-CN'] : val),
  processLangFields: jest.fn((data) => data)
}))

const auditService = require('./audit.service')
const auditModel = require('./audit.model')

describe('审计服务 - 审计日志查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页审计日志列表', async () => {
    // Arrange
    const mockResult = {
      list: [
        { id: 1, user_name: 'admin', action: 'USER_LOGIN', result: 'success' },
        { id: 2, user_name: 'user1', action: 'PLC_WRITE', result: 'success' }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    }
    auditModel.getPageList.mockResolvedValue(mockResult)

    // Act
    const result = await auditService.getAuditList({ page: 1, pageSize: 10 }, 'zh-CN')

    // Assert
    expect(result).toEqual(mockResult)
    expect(auditModel.getPageList).toHaveBeenCalled()
  })

  test('应该支持按用户名筛选', async () => {
    // Arrange
    auditModel.getPageList.mockResolvedValue({ list: [], total: 0, page: 1, pageSize: 10 })

    // Act
    await auditService.getAuditList({ page: 1, pageSize: 10, userName: 'admin' }, 'zh-CN')

    // Assert
    expect(auditModel.getPageList).toHaveBeenCalled()
  })

  test('应该支持按操作类型筛选', async () => {
    // Arrange
    auditModel.getPageList.mockResolvedValue({ list: [], total: 0, page: 1, pageSize: 10 })

    // Act
    await auditService.getAuditList({ page: 1, pageSize: 10, action: 'PLC_WRITE' }, 'zh-CN')

    // Assert
    expect(auditModel.getPageList).toHaveBeenCalled()
  })
})

describe('审计服务 - 哈希链校验', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('哈希链完整时应该返回 valid: true', async () => {
    // Arrange
    const mockRecords = [
      { id: 1, current_hash: 'hash1', prev_hash: '' },
      { id: 2, current_hash: 'hash2', prev_hash: 'hash1' },
      { id: 3, current_hash: 'hash3', prev_hash: 'hash2' }
    ]
    auditModel.getPageList.mockResolvedValue({ list: mockRecords, total: 3 })

    // Act
    const result = await auditService.verifyHashChain()

    // Assert
    expect(result).toHaveProperty('valid')
    expect(result).toHaveProperty('total', 3)
  })
})

describe('审计服务 - 创建审计日志', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建审计日志时应该计算哈希值', async () => {
    // Arrange
    const logData = {
      user_id: 1,
      user_name: 'admin',
      action: 'USER_LOGIN',
      target: '系统登录',
      result: 'success',
      ip: '127.0.0.1'
    }
    auditModel.getLastRecord.mockResolvedValue(null)
    auditModel.create.mockResolvedValue({ insertId: 1 })

    // Act
    const result = await auditService.createAuditLog(logData)

    // Assert
    expect(auditModel.create).toHaveBeenCalled()
    expect(result).toHaveProperty('insertId')
  })

  test('创建审计日志时应该关联上一条记录的哈希', async () => {
    // Arrange
    const logData = {
      user_id: 1,
      user_name: 'admin',
      action: 'PLC_WRITE',
      target: 'fillVolume',
      result: 'success'
    }
    auditModel.getLastRecord.mockResolvedValue({ id: 1, current_hash: 'previoushash' })
    auditModel.create.mockResolvedValue({ insertId: 2 })

    // Act
    await auditService.createAuditLog(logData)

    // Assert
    expect(auditModel.create).toHaveBeenCalledWith(expect.objectContaining({
      prev_hash: 'previoushash'
    }))
  })
})
