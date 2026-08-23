/**
 * 通用业务逻辑基类
 * 所有业务 Service 继承此类，封装通用 CRUD 操作
 * 子类可以重写方法以实现特殊业务逻辑
 */
const { BusinessError } = require('../middleware/error.middleware')
const { ERROR_CODE } = require('../constants/errorCode')

class BaseService {
  /**
   * 构造函数
   * @param {Object} model 数据模型实例（继承自 BaseModel）
   * @param {Object} options 配置选项
   * @param {string} options.name 模块名称，用于错误提示
   * @param {string[]} options.langFields 需要多语言处理的字段
   */
  constructor(model, options = {}) {
    this.model = model
    this.name = options.name || '数据'
    this.langFields = options.langFields || []
  }

  /**
   * 分页查询列表
   * @param {Object} params 查询参数（page, pageSize, 筛选条件）
   * @param {string} lang 语言
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getList(params = {}, lang = 'zh-CN') {
    const where = this.buildWhere(params)
    const orderBy = params.orderBy || 'id'
    const orderDir = params.orderDir || 'DESC'
    const result = await this.model.getPageList(params, where, orderBy, orderDir)
    result.list = this.processLangFields(result.list, lang)
    return result
  }

  /**
   * 获取所有数据（下拉选择用）
   * @param {string} lang 语言
   * @returns {Promise<Array>}
   */
  async getAll(lang = 'zh-CN') {
    const list = await this.model.findAll({}, 'id', 'ASC')
    return this.processLangFields(list, lang)
  }

  /**
   * 根据 ID 获取详情
   * @param {number|string} id 主键值
   * @param {string} lang 语言
   * @returns {Promise<Object>}
   */
  async getById(id, lang = 'zh-CN') {
    const data = await this.model.getById(id)
    if (!data) {
      throw new BusinessError(ERROR_CODE.NOT_FOUND, `${this.name}不存在`)
    }
    return this.processLangFields(data, lang)
  }

  /**
   * 创建数据
   * @param {Object} data 创建数据
   * @returns {Promise<Object>} { insertId, affectedRows }
   */
  async create(data) {
    const processedData = this.convertLangFieldsToJson(data)
    return await this.model.create(processedData)
  }

  /**
   * 更新数据
   * @param {number|string} id 主键值
   * @param {Object} data 更新数据
   * @returns {Promise<void>}
   */
  async update(id, data) {
    await this.getById(id)
    const processedData = this.convertLangFieldsToJson(data)
    await this.model.update(id, processedData)
  }

  /**
   * 删除数据
   * @param {number|string} id 主键值
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.getById(id)
    await this.model.delete(id)
  }

  /**
   * 批量删除
   * @param {Array} ids 主键数组
   * @returns {Promise<Object>} { affectedRows }
   */
  async batchDelete(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BusinessError(ERROR_CODE.PARAM_INVALID, '请选择要删除的数据')
    }
    return await this.model.batchDelete(ids)
  }

  /**
   * 构建查询条件（子类可重写）
   * @param {Object} params 查询参数
   * @returns {Object} where 条件
   */
  buildWhere(params = {}) {
    return {}
  }

  /**
   * 处理多语言字段（子类可重写）
   * @param {Object|Array} data 数据
   * @param {string} lang 语言
   * @returns {Object|Array} 处理后的数据
   */
  processLangFields(data, lang = 'zh-CN') {
    if (this.langFields.length === 0) return data
    const { processLangFields } = require('../utils/i18n')
    return processLangFields(data, this.langFields, lang)
  }

  /**
   * 将多语言字段从字符串转换为 JSON 格式
   * @param {Object} data 数据
   * @returns {Object} 处理后的数据
   */
  convertLangFieldsToJson(data) {
    if (this.langFields.length === 0) return data
    const { buildLangObject } = require('../utils/i18n')
    const result = { ...data }
    for (const field of this.langFields) {
      if (result[field] && typeof result[field] === 'string') {
        result[field] = buildLangObject(result[field], result[field])
      }
    }
    return result
  }
}

module.exports = BaseService
