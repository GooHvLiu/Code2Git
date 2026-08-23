/**
 * 数据字典模块 - 控制器层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../src/modules/dict/dict.service', () => ({
  getDictTypeList: jest.fn(),
  getAllDictTypes: jest.fn(),
  getDictTypeById: jest.fn(),
  createDictType: jest.fn(),
  updateDictType: jest.fn(),
  deleteDictType: jest.fn(),
  getDictItemsByType: jest.fn(),
  createDictItem: jest.fn(),
  updateDictItem: jest.fn(),
  deleteDictItem: jest.fn()
}))

const dictController = require('../../src/modules/dict/dict.controller')
const dictService = require('../../src/modules/dict/dict.service')

const mockRequest = (options = {}) => ({
  body: options.body || {},
  query: options.query || {},
  params: options.params || {},
  ...options
})

const mockResponse = () => {
  const res = {}
  res.success = jest.fn().mockReturnValue(res)
  return res
}

const mockNext = jest.fn()

describe('字典控制器 - 字典类型管理', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页字典类型列表', async () => {
    const req = mockRequest({ query: { page: 1, pageSize: 10 } })
    const res = mockResponse()
    dictService.getDictTypeList.mockResolvedValue({ list: [], total: 0 })

    await dictController.getDictTypeList(req, res, mockNext)

    expect(dictService.getDictTypeList).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('创建字典类型成功时应该返回创建成功', async () => {
    const req = mockRequest({ body: { dict_code: 'test', dict_name: '测试' } })
    const res = mockResponse()
    dictService.createDictType.mockResolvedValue({ insertId: 1 })

    await dictController.createDictType(req, res, mockNext)

    expect(dictService.createDictType).toHaveBeenCalled()
    expect(res.success).toHaveBeenCalled()
  })

  test('删除字典类型成功时应该返回删除成功', async () => {
    const req = mockRequest({ params: { id: 1 } })
    const res = mockResponse()
    dictService.deleteDictType.mockResolvedValue({ affectedRows: 1 })

    await dictController.deleteDictType(req, res, mockNext)

    expect(dictService.deleteDictType).toHaveBeenCalledWith(1)
    expect(res.success).toHaveBeenCalled()
  })
})

describe('字典控制器 - 字典项管理', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该根据字典编码返回字典项列表', async () => {
    const req = mockRequest({ params: { code: 'user_status' } })
    const res = mockResponse()
    dictService.getDictItemsByType.mockResolvedValue([])

    await dictController.getDictItems(req, res, mockNext)

    expect(dictService.getDictItemsByType).toHaveBeenCalledWith('user_status', expect.any(String))
    expect(res.success).toHaveBeenCalled()
  })
})
