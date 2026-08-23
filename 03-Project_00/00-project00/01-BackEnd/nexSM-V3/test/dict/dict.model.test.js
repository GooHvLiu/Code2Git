/**
 * 数据字典模块 - 数据模型层单元测试
 * 
 * @author nexCM Team
 * @date 2026-08-22
 */

jest.mock('../../db/index', () => ({
  query: jest.fn()
}))

const { DictTypeModel, DictItemModel } = require('../../src/modules/dict/dict.model')

describe('字典类型数据模型', () => {
  let dictTypeModel

  beforeEach(() => {
    jest.clearAllMocks()
    dictTypeModel = new DictTypeModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(dictTypeModel).toHaveProperty('tableName', 'nex_dict_type')
    expect(dictTypeModel).toHaveProperty('allowFields')
    expect(dictTypeModel.allowFields).toContain('dict_name')
    expect(dictTypeModel.allowFields).toContain('dict_code')
  })

  test('filterFields 应该只保留白名单内的字段', () => {
    const rawData = {
      dict_name: '用户状态',
      dict_code: 'user_status',
      invalidField: 'should be removed',
      id: 999
    }
    const result = dictTypeModel.filterFields(rawData)
    expect(result).toHaveProperty('dict_name')
    expect(result).toHaveProperty('dict_code')
    expect(result).not.toHaveProperty('invalidField')
    expect(result).not.toHaveProperty('id')
  })
})

describe('字典项数据模型', () => {
  let dictItemModel

  beforeEach(() => {
    jest.clearAllMocks()
    dictItemModel = new DictItemModel()
  })

  test('应该正确继承 BaseModel', () => {
    expect(dictItemModel).toHaveProperty('tableName', 'nex_dict_item')
    expect(dictItemModel).toHaveProperty('allowFields')
    expect(dictItemModel.allowFields).toContain('label')
    expect(dictItemModel.allowFields).toContain('value')
    expect(dictItemModel.allowFields).toContain('type_id')
  })
})
