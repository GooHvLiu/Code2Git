/**
 * 通知中心模块 - 控制器层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../src/modules/notification/notification.service', () => ({
  getNotificationList: jest.fn(),
  getUnreadCount: jest.fn(),
  getNotificationById: jest.fn(),
  createNotification: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  deleteNotification: jest.fn()
}))

const notificationController = require('../../src/modules/notification/notification.controller')
const notificationService = require('../../src/modules/notification/notification.service')

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

describe('通知控制器 - 通知列表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回当前用户的分页通知列表', async () => {
    const req = mockRequest({ user: { id: 1 }, query: { page: 1, pageSize: 10 } })
    const res = mockResponse()
    notificationService.getNotificationList.mockResolvedValue({ list: [], total: 0 })

    await notificationController.getNotificationList(req, res, mockNext)

    expect(notificationService.getNotificationList).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('应该返回未读通知数量', async () => {
    const req = mockRequest({ user: { id: 1 } })
    const res = mockResponse()
    notificationService.getUnreadCount.mockResolvedValue(5)

    await notificationController.getUnreadCount(req, res, mockNext)

    expect(notificationService.getUnreadCount).toHaveBeenCalledWith(1)
    expect(res.success).toHaveBeenCalledWith(5)
  })
})

describe('通知控制器 - 通知详情查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回通知详情', async () => {
    const req = mockRequest({ user: { id: 1 }, params: { id: 1 } })
    const res = mockResponse()
    notificationService.getNotificationById.mockResolvedValue({ id: 1, title: '测试通知' })

    await notificationController.getNotificationById(req, res, mockNext)

    expect(notificationService.getNotificationById).toHaveBeenCalledWith(1, 1)
    expect(res.success).toHaveBeenCalled()
  })
})

describe('通知控制器 - 通知管理操作', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('创建通知成功时应该返回创建成功', async () => {
    const req = mockRequest({ body: { user_id: 1, title: '测试', content: '内容' } })
    const res = mockResponse()
    notificationService.createNotification.mockResolvedValue({ insertId: 1 })

    await notificationController.createNotification(req, res, mockNext)

    expect(notificationService.createNotification).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('标记通知为已读', async () => {
    const req = mockRequest({ user: { id: 1 }, params: { id: 1 } })
    const res = mockResponse()
    notificationService.markAsRead.mockResolvedValue({ affectedRows: 1 })

    await notificationController.markAsRead(req, res, mockNext)

    expect(notificationService.markAsRead).toHaveBeenCalledWith(1, 1)
    expect(res.success).toHaveBeenCalled()
  })

  test('标记所有通知为已读', async () => {
    const req = mockRequest({ user: { id: 1 } })
    const res = mockResponse()
    notificationService.markAllAsRead.mockResolvedValue({ affectedRows: 5 })

    await notificationController.markAllAsRead(req, res, mockNext)

    expect(notificationService.markAllAsRead).toHaveBeenCalledWith(1)
    expect(res.success).toHaveBeenCalled()
  })

  test('删除通知成功时应该返回删除成功', async () => {
    const req = mockRequest({ user: { id: 1 }, params: { id: 1 } })
    const res = mockResponse()
    notificationService.deleteNotification.mockResolvedValue({ affectedRows: 1 })

    await notificationController.deleteNotification(req, res, mockNext)

    expect(notificationService.deleteNotification).toHaveBeenCalledWith(1, 1)
    expect(res.success).toHaveBeenCalled()
  })
})
