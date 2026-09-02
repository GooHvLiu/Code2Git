/**
 * 数据字典模块 - 业务逻辑层
 *
 * 处理数据字典的增删改查，包含字典类型和字典项两个子模块
 * 支持根据字典类型编码获取字典项（前端 DictTag 组件用）
 * 继承 BaseService，以字典类型（DictTypeModel）为主模型
 *
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-26
 */
const BaseService = require('../../services/BaseService')
const { DictTypeModel, DictItemModel } = require('./dict.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')
const { processLangFields } = require('../../utils/i18n')

class DictService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，以字典类型模型为主模型
   * 配置多语言字段：dict_name（字典类型名称）、description（描述）
   */
  constructor() {
    super(DictTypeModel, {
      name: '字典类型',
      langFields: ['dict_name', 'description']
    })
  }

  // ==================== 字典类型 ====================

  /**
   * 分页查询字典类型列表
   *
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getTypeList(params, lang = 'zh-CN') {
    const result = await DictTypeModel.getPageList(params, {})
    result.list = processLangFields(result.list, ['dict_name', 'description'], lang)
    return result
  }

  /**
   * 获取字典类型详情
   *
   * @param {number} id - 字典类型 ID
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} 字典类型详情
   * @throws {BusinessError} 字典类型不存在
   */
  async getTypeById(id, lang = 'zh-CN') {
    const dictType = await DictTypeModel.getById(id)
    if (!dictType) {
      throw new BusinessError(ERROR_CODE.DICT_TYPE_NOT_FOUND, null, { name: '字典类型' })
    }
    return processLangFields(dictType, ['dict_name', 'description'], lang)
  }

  /**
   * 创建字典类型
   *
   * 检查编码是否已存在，处理多语言字段
   *
   * @param {Object} data - 字典类型数据
   * @param {string} data.dict_name - 字典类型名称（支持多语言对象或字符串）
   * @param {string} data.dict_code - 字典类型编码（唯一）
   * @param {string} [data.description] - 描述（支持多语言对象或字符串）
   * @param {number} [data.status=1] - 状态 1启用 0禁用
   * @param {number} [data.sort=0] - 排序号
   * @returns {Promise<Object>} { insertId, affectedRows }
   * @throws {BusinessError} 字典类型编码已存在
   */
  async createType(data) {
    // 检查编码是否已存在
    const exist = await DictTypeModel.getByCode(data.dict_code)
    if (exist) {
      throw new BusinessError(ERROR_CODE.DICT_TYPE_CODE_EXISTS, null)
    }
    // 处理多语言字段（字符串转 JSON 对象）
    const processedData = this.convertLangFieldsToJson(data)
    return await DictTypeModel.create(processedData)
  }

  /**
   * 更新字典类型
   *
   * 处理多语言字段
   *
   * @param {number} id - 字典类型 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.dict_name] - 字典类型名称（支持多语言对象或字符串）
   * @param {string} [data.description] - 描述（支持多语言对象或字符串）
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 字典类型不存在
   */
  async updateType(id, data) {
    await this.getTypeById(id)
    // 处理多语言字段（字符串转 JSON 对象）
    const processedData = this.convertLangFieldsToJson(data)
    return await DictTypeModel.update(id, processedData)
  }

  /**
   * 删除字典类型（同时删除关联的字典项）
   *
   * 删除字典类型前先删除所有关联的字典项
   *
   * @param {number} id - 字典类型 ID
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 字典类型不存在
   */
  async deleteType(id) {
    await this.getTypeById(id)
    // 删除字典项（查出所有ID后批量删除）
    const items = await DictItemModel.findAll({ type_id: id })
    if (items.length > 0) {
      const ids = items.map(item => item.id)
      await DictItemModel.batchDelete(ids)
    }
    // 删除字典类型
    return await DictTypeModel.delete(id)
  }

  // ==================== 字典项 ====================

  /**
   * 分页查询字典项列表
   *
   * 支持按字典类型 ID 筛选
   *
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {number} [params.type_id] - 字典类型 ID
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getItemList(params, lang = 'zh-CN') {
    const where = {}
    if (params.type_id) {
      where.type_id = params.type_id
    }
    const result = await DictItemModel.getPageList(params, where)
    result.list = processLangFields(result.list, ['label'], lang)
    return result
  }

  /**
   * 根据字典类型编码获取字典项列表（前端 DictTag 组件用）
   *
   * @param {string} typeCode - 字典类型编码
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Array>} 字典项列表
   */
  async getItemsByTypeCode(typeCode, lang = 'zh-CN') {
    const items = await DictItemModel.getByTypeCode(typeCode)
    return processLangFields(items, ['label'], lang)
  }

  /**
   * 批量获取多个字典类型的字典项（前端一次性加载）
   *
   * @param {Array<string>} typeCodes - 字典类型编码数组
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { [typeCode]: 字典项列表 }
   */
  async getItemsByTypeCodes(typeCodes, lang = 'zh-CN') {
    const result = {}
    for (const code of typeCodes) {
      result[code] = await this.getItemsByTypeCode(code, lang)
    }
    return result
  }

  /**
   * 获取字典项详情
   *
   * @param {number} id - 字典项 ID
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} 字典项详情
   * @throws {BusinessError} 字典项不存在
   */
  async getItemById(id, lang = 'zh-CN') {
    const item = await DictItemModel.getById(id)
    if (!item) {
      throw new BusinessError(ERROR_CODE.DICT_ITEM_NOT_FOUND, null, { name: '字典项' })
    }
    return processLangFields(item, ['label'], lang)
  }

  /**
   * 创建字典项
   *
   * 检查同一类型下值是否重复，处理多语言字段
   *
   * @param {Object} data - 字典项数据
   * @param {number} data.type_id - 字典类型 ID
   * @param {string} data.label - 字典标签（支持多语言对象或字符串）
   * @param {string} data.value - 字典值
   * @param {string} [data.css_class] - CSS 样式类
   * @param {string} [data.list_class] - 列表样式类
   * @param {number} [data.is_default=0] - 是否默认 1是 0否
   * @param {number} [data.status=1] - 状态 1启用 0禁用
   * @param {number} [data.sort=0] - 排序号
   * @returns {Promise<Object>} { insertId, affectedRows }
   * @throws {BusinessError} 同一字典类型下值不能重复
   */
  async createItem(data) {
    // 检查同一类型下值是否重复
    const exist = await DictItemModel.findOne({ type_id: data.type_id, value: data.value })
    if (exist) {
      throw new BusinessError(ERROR_CODE.DICT_ITEM_VALUE_DUPLICATE, null)
    }
    // 处理多语言字段（字符串转 JSON 对象）
    if (typeof data.label === 'string') {
      data.label = { 'zh-CN': data.label, 'en-US': data.label }
    }
    return await DictItemModel.create(data)
  }

  /**
   * 更新字典项
   *
   * 处理多语言字段
   *
   * @param {number} id - 字典项 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.label] - 字典标签（支持多语言对象或字符串）
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 字典项不存在
   */
  async updateItem(id, data) {
    await this.getItemById(id)
    // 处理多语言字段（字符串转 JSON 对象）
    if (data.label && typeof data.label === 'string') {
      data.label = { 'zh-CN': data.label, 'en-US': data.label }
    }
    return await DictItemModel.update(id, data)
  }

  /**
   * 删除字典项
   *
   * @param {number} id - 字典项 ID
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 字典项不存在
   */
  async deleteItem(id) {
    await this.getItemById(id)
    return await DictItemModel.delete(id)
  }
}

module.exports = new DictService()
