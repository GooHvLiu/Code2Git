/**
 * 数据字典模块 - 业务逻辑层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('./dict.model', () => ({
  DictTypeModel: {
    getPageList: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn()
  },
  DictItemModel: {
    getPageList: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByTypeId: jest.fn()
  }
}))

jest.mock('../../utils/i18n', () => ({
  getLangValue: jest.fn((val) => typeof val === 'object' ? val['zh-CN'] : val),
  processLangFields: jest.fn((data) => data),
  buildLangObject: jest.fn((zh, en) => ({ 'zh-CN': zh, 'en-US': en || zh }))
}))

const dictService = require('./dict.service')
const { DictTypeModel, DictItemModel } = require('./dict.model')

describe('字典服务 - 字典类型查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该返回分页字典类型列表', async () => {
    // Arrange
    const mockResult = {
      list: [
        { id: 1, dict_name: '用户状态', dict_code: 'user_status' },
        { id: 2, dict_name: '性别', dict_code: 'user_sex' }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    }
    DictTypeModel.getPageList.mockResolvedValue(mockResult)

    // Act
    const result = await dictService.getDictTypeList({ page: 1, pageSize: 10 }, 'zh-CN')

    // Assert
    expect(result).toEqual(mockResult)
    expect(DictTypeModel.getPageList).toHaveBeenCalled()
  })

  test('应该返回所有启用的字典类型', async () => {
    // Arrange
    const mockTypes = [
      { id: 1, dict_name: '用户状态', dict_code: 'user_status', status: 1 },
      { id: 2, dict_name: '性别', dict_code: 'user_sex', status: 1 }
    ]
    DictTypeModel.findAll.mockResolvedValue(mockTypes)

    // Act
    const result = await dictService.getAllDictTypes('zh-CN')

    // Assert
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
  })
})

describe('字典服务 - 字典项查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('应该根据类型ID返回字典项列表', async () => {
    // Arrange
    const mockItems = [
      { id: 1, type_id: 1, label: '启用', value: '1' },
      { id: 2, type_id: 1, label: '禁用', value: '0' }
    ]
    DictItemModel.findByTypeId.mockResolvedValue(mockItems)

    // Act
    const result = await dictService.getDictItemsByType('user_status', 'zh-CN')

    // Assert
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
  })
})

describe('字典服务 - 字典类型创建', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('字典编码已存在时应该抛出错误', async () => {
    // Arrange
    DictTypeModel.findOne.mockResolvedValue({ id: 1, dict_code: 'existing_code' })

    // Act & Assert
    await expect(dictService.createDictType({ dict_code: 'existing_code', dict_name: '测试' }))
      .rejects
      .toThrow()
  })

  test('创建字典类型成功时应该返回 insertId', async () => {
    // Arrange
    DictTypeModel.findOne.mockResolvedValue(null)
    DictTypeModel.create.mockResolvedValue({ insertId: 1, affectedRows: 1 })

    // Act
    const result = await dictService.createDictType({
      dict_code: 'new_code',
      dict_name: '新字典',
      description: '测试字典'
    })

    // Assert
    expect(result).toHaveProperty('insertId', 1)
    expect(DictTypeModel.create).toHaveBeenCalled()
  })
})
