/**
 * 审计追踪模块 - 数据模型层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../db/index', () => ({
  query: jest.fn()
}))

const { query } = require('../../db/index')
const AuditModel = require('../../src/modules/audit/audit.model')

describe('审计数据模型', () => {
  let auditModel

  beforeEach(() => {
    jest.clearAllMocks()
    auditModel = new AuditModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(auditModel).toHaveProperty('tableName', 'nex_audit_log')
    expect(auditModel).toHaveProperty('allowFields')
    expect(auditModel.allowFields).toContain('user_id')
    expect(auditModel.allowFields).toContain('action')
    expect(auditModel.allowFields).toContain('result')
  })

  test('getLastRecord 应该返回最后一条记录', async () => {
    // Arrange
    const mockRecord = { id: 10, current_hash: 'hash10', prev_hash: 'hash9' }
    query.mockResolvedValue([mockRecord])

    // Act
    const result = await auditModel.getLastRecord()

    // Assert
    expect(query).toHaveBeenCalled()
    expect(result).toEqual(mockRecord)
  })

  test('getLastRecord 没有记录时应该返回 null', async () => {
    // Arrange
    query.mockResolvedValue([])

    // Act
    const result = await auditModel.getLastRecord()

    // Assert
    expect(result).toBeNull()
  })

  test('filterFields 应该只保留白名单内的字段', () => {
    // Arrange
    const rawData = {
      user_id: 1,
      user_name: 'admin',
      action: 'USER_LOGIN',
      invalidField: 'should be removed',
      id: 999
    }

    // Act
    const result = auditModel.filterFields(rawData)

    // Assert
    expect(result).toHaveProperty('user_id', 1)
    expect(result).toHaveProperty('action', 'USER_LOGIN')
    expect(result).not.toHaveProperty('invalidField')
    expect(result).not.toHaveProperty('id')
  })
})
