/**
 * 数据字典模块 - 业务逻辑层
 *
 * 处理数据字典的增删改查，包含字典类型和字典项两个子模块
 * 支持根据字典类型编码获取字典项（前端 DictTag 组件用）
 * 继承 BaseService，以字典类型（DictTypeModel）为主模型
 * 字典名称和标签均为常规字符串，国际化由前端处理
 *
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-09-05
 */
const BaseService = require('../../services/BaseService')
const { DictTypeModel, DictItemModel } = require('./dict.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class DictService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，以字典类型模型为主模型
   */
  constructor() {
    super(DictTypeModel, {
      name: '字典类型'
    })
  }

  // ==================== 字典类型 ====================

  /**
   * 分页查询字典类型列表
   *
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getTypeList(params) {
    return await DictTypeModel.getPageList(params, {})
  }

  /**
   * 获取字典类型详情
   *
   * @param {number} id - 字典类型 ID
   * @returns {Promise<Object>} 字典类型详情
   * @throws {BusinessError} 字典类型不存在
   */
  async getTypeById(id) {
    const dictType = await DictTypeModel.getById(id)
    if (!dictType) {
      throw new BusinessError(ERROR_CODE.DICT_TYPE_NOT_FOUND, null, { name: '字典类型' })
    }
    return dictType
  }

  /**
   * 创建字典类型
   *
   * 检查编码是否已存在
   *
   * @param {Object} data - 字典类型数据
   * @param {string} data.dict_name - 字典类型名称
   * @param {string} data.dict_code - 字典类型编码（唯一）
   * @param {string} [data.description] - 描述
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
    return await DictTypeModel.create(data)
  }

  /**
   * 更新字典类型
   *
   * @param {number} id - 字典类型 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.dict_name] - 字典类型名称
   * @param {string} [data.description] - 描述
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 字典类型不存在
   */
  async updateType(id, data) {
    await this.getTypeById(id)
    return await DictTypeModel.update(id, data)
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
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getItemList(params) {
    const where = {}
    if (params.type_id) {
      where.type_id = params.type_id
    }
    return await DictItemModel.getPageList(params, where)
  }

  /**
   * 根据字典类型编码获取字典项列表（前端 DictTag 组件用）
   *
   * @param {string} typeCode - 字典类型编码
   * @returns {Promise<Array>} 字典项列表
   */
  async getItemsByTypeCode(typeCode) {
    return await DictItemModel.getByTypeCode(typeCode)
  }

  /**
   * 批量获取多个字典类型的字典项（前端一次性加载）
   *
   * @param {Array<string>} typeCodes - 字典类型编码数组
   * @returns {Promise<Object>} { [typeCode]: 字典项列表 }
   */
  async getItemsByTypeCodes(typeCodes) {
    const result = {}
    for (const code of typeCodes) {
      result[code] = await this.getItemsByTypeCode(code)
    }
    return result
  }

  /**
   * 获取字典项详情
   *
   * @param {number} id - 字典项 ID
   * @returns {Promise<Object>} 字典项详情
   * @throws {BusinessError} 字典项不存在
   */
  async getItemById(id) {
    const item = await DictItemModel.getById(id)
    if (!item) {
      throw new BusinessError(ERROR_CODE.DICT_ITEM_NOT_FOUND, null, { name: '字典项' })
    }
    return item
  }

  /**
   * 创建字典项
   *
   * 检查同一类型下值是否重复
   *
   * @param {Object} data - 字典项数据
   * @param {number} data.type_id - 字典类型 ID
   * @param {string} data.label - 字典标签
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
    return await DictItemModel.create(data)
  }

  /**
   * 更新字典项
   *
   * @param {number} id - 字典项 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.label] - 字典标签
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 字典项不存在
   */
  async updateItem(id, data) {
    await this.getItemById(id)
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
