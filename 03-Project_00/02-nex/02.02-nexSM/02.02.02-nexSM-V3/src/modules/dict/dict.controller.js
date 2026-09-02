/**
 * 数据字典模块 - 控制器层
 * 
 * 负责参数接收、调用 Service 层、返回统一响应
 * 包含字典类型和字典项两个子模块的接口
 * 继承 BaseController，以字典类型为主模型
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseController = require('../../controllers/BaseController')
const dictService = require('./dict.service')
const { getLangFromRequest } = require('../../utils/i18n')

class DictController extends BaseController {
  /**
   * 构造函数
   * 初始化 BaseController，传入字典 Service 实例
   */
  constructor() {
    super(dictService)
  }

  // ==================== 字典类型 ====================

  /**
   * 分页查询字典类型列表
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.query - 查询参数
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getTypeList(req, res) {
    const lang = getLangFromRequest(req)
    const result = await dictService.getTypeList(req.query, lang)
    res.success(result)
  }

  /**
   * 获取字典类型详情
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 字典类型 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getTypeById(req, res) {
    const lang = getLangFromRequest(req)
    const result = await dictService.getTypeById(req.params.id, lang)
    res.success(result)
  }

  /**
   * 创建字典类型
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {string} req.body.dict_name - 字典类型名称
   * @param {string} req.body.dict_code - 字典类型编码（唯一）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async createType(req, res) {
    const result = await dictService.createType(req.body)
    res.success(result)
  }

  /**
   * 更新字典类型
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 字典类型 ID
   * @param {Object} req.body - 请求体（更新数据）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async updateType(req, res) {
    await dictService.updateType(req.params.id, req.body)
    res.success(null)
  }

  /**
   * 删除字典类型
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 字典类型 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async deleteType(req, res) {
    await dictService.deleteType(req.params.id)
    res.success(null)
  }

  // ==================== 字典项 ====================

  /**
   * 分页查询字典项列表
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.query - 查询参数
   * @param {number} [req.query.type_id] - 字典类型 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getItemList(req, res) {
    const lang = getLangFromRequest(req)
    const result = await dictService.getItemList(req.query, lang)
    res.success(result)
  }

  /**
   * 根据字典类型编码获取字典项列表（前端 DictTag 组件用）
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {string} req.params.code - 字典类型编码
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getItemsByTypeCode(req, res) {
    const lang = getLangFromRequest(req)
    const { code } = req.params
    const result = await dictService.getItemsByTypeCode(code, lang)
    res.success(result)
  }

  /**
   * 批量获取多个字典类型的字典项
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {Array<string>} req.body.codes - 字典类型编码数组
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getItemsByTypeCodes(req, res) {
    const lang = getLangFromRequest(req)
    const { codes } = req.body
    const result = await dictService.getItemsByTypeCodes(codes, lang)
    res.success(result)
  }

  /**
   * 获取字典项详情
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 字典项 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getItemById(req, res) {
    const lang = getLangFromRequest(req)
    const result = await dictService.getItemById(req.params.id, lang)
    res.success(result)
  }

  /**
   * 创建字典项
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {number} req.body.type_id - 字典类型 ID
   * @param {string} req.body.label - 字典标签
   * @param {string} req.body.value - 字典值
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async createItem(req, res) {
    const result = await dictService.createItem(req.body)
    res.success(result)
  }

  /**
   * 更新字典项
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 字典项 ID
   * @param {Object} req.body - 请求体（更新数据）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async updateItem(req, res) {
    await dictService.updateItem(req.params.id, req.body)
    res.success(null)
  }

  /**
   * 删除字典项
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 字典项 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async deleteItem(req, res) {
    await dictService.deleteItem(req.params.id)
    res.success(null)
  }
}

module.exports = new DictController()
