/**
 * 通知中心模块 - 数据模型层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../db/index', () => ({
  query: jest.fn()
}))

const { NotificationModel } = require('../../src/modules/notification/notification.model')

describe('通知数据模型', () => {
  let notificationModel

  beforeEach(() => {
    jest.clearAllMocks()
    notificationModel = new NotificationModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(notificationModel).toHaveProperty('tableName', 'nex_notification')
    expect(notificationModel).toHaveProperty('allowFields')
    expect(notificationModel.allowFields).toContain('user_id')
    expect(notificationModel.allowFields).toContain('title')
    expect(notificationModel.allowFields).toContain('content')
    expect(notificationModel.allowFields).toContain('type')
    expect(notificationModel.allowFields).toContain('priority')
    expect(notificationModel.allowFields).toContain('is_read')
  })

  test('filterFields 应该只保留白名单内的字段', () => {
    const rawData = {
      user_id: 1,
      title: '系统通知',
      content: '测试内容',
      invalidField: 'should be removed',
      id: 999
    }
    const result = notificationModel.filterFields(rawData)
    expect(result).toHaveProperty('user_id')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('content')
    expect(result).not.toHaveProperty('invalidField')
    expect(result).not.toHaveProperty('id')
  })
})
