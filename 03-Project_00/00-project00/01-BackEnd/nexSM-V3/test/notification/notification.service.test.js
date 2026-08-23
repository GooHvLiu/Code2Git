/**
 * 通知中心模块 - 业务逻辑层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('./notification.model', () => ({
  NotificationModel: {
    getPageList: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    countUnread: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn()
  }
}))

jest.mock('../../socket/wsManager', () => ({
  sendToUser: jest.fn(),
  broadcast: jest.fn()
}))

const notificationService = require('./notification.service')
const { NotificationModel } = require('./notification.model')
const wsManager = require('../../socket/wsManager')

describe('通知服务 - 通知列表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页通知列表', async () => {
    const mockResult = {
      list: [
        { id: 1, user_id: 1, title: '系统通知', content: '测试内容', is_read: 0 },
        { id: 2, user_id: 1, title: 'PLC告警', content: '温度过高', is_read: 1 }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    }
    NotificationModel.getPageList.mockResolvedValue(mockResult)

    const result = await notificationService.getNotificationList({ page: 1, pageSize: 10 }, 1)

    expect(result).toEqual(mockResult)
    expect(NotificationModel.getPageList).toHaveBeenCalled()
  })

  test('应该返回未读通知数量', async () => {
    NotificationModel.countUnread.mockResolvedValue(5)

    const result = await notificationService.getUnreadCount(1)

    expect(result).toBe(5)
    expect(NotificationModel.countUnread).toHaveBeenCalledWith(1)
  })
})

describe('通知服务 - 通知创建', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建通知成功时应该返回 insertId', async () => {
    NotificationModel.create.mockResolvedValue({ insertId: 1, affectedRows: 1 })
    wsManager.sendToUser.mockResolvedValue(true)

    const result = await notificationService.createNotification({
      user_id: 1,
      title: '系统通知',
      content: '测试内容',
      type: 'system',
      priority: 'normal'
    })

    expect(result).toHaveProperty('insertId', 1)
    expect(NotificationModel.create).toHaveBeenCalled()
  })

  test('创建通知时应该通过 WebSocket 推送给用户', async () => {
    NotificationModel.create.mockResolvedValue({ insertId: 1 })
    wsManager.sendToUser.mockResolvedValue(true)

    await notificationService.createNotification({
      user_id: 1,
      title: 'PLC告警',
      content: '温度过高',
      type: 'plc',
      priority: 'high'
    })

    expect(wsManager.sendToUser).toHaveBeenCalledWith(1, expect.any(Object))
  })
})

describe('通知服务 - 通知标记已读', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('标记单条通知为已读', async () => {
    NotificationModel.update.mockResolvedValue({ affectedRows: 1 })

    const result = await notificationService.markAsRead(1, 1)

    expect(result).toHaveProperty('affectedRows', 1)
    expect(NotificationModel.update).toHaveBeenCalled()
  })

  test('标记所有通知为已读', async () => {
    NotificationModel.markAllAsRead.mockResolvedValue({ affectedRows: 5 })

    const result = await notificationService.markAllAsRead(1)

    expect(result).toHaveProperty('affectedRows', 5)
    expect(NotificationModel.markAllAsRead).toHaveBeenCalledWith(1)
  })
})

describe('通知服务 - 批量创建通知', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该为多个用户创建通知', async () => {
    NotificationModel.create.mockResolvedValue({ insertId: 1 })
    wsManager.sendToUser.mockResolvedValue(true)

    const userIds = [1, 2, 3]
    const result = await notificationService.batchCreateNotification(userIds, {
      title: '系统公告',
      content: '系统将于今晚维护',
      type: 'system',
      priority: 'normal'
    })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(3)
    expect(NotificationModel.create).toHaveBeenCalledTimes(3)
  })
})
