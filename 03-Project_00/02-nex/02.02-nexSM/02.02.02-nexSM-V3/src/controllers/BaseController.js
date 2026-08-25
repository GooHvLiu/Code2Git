/**
 * 通用控制器基类
 * 所有业务 Controller 继承此类，封装通用 CRUD 接口
 * 子类可以重写方法以实现特殊业务逻辑
 *
 * 构造函数中自动包装所有异步方法，捕获错误并传递给 Express 的 next()
 * 避免未处理的 Promise rejection 导致进程崩溃
 */
const { getLangFromRequest } = require('../utils/i18n')
const { asyncHandler } = require('../utils/asyncHandler')

class BaseController {
  /**
   * 构造函数
   * @param {Object} service 业务逻辑实例（继承自 BaseService）
   */
  constructor(service) {
    this.service = service
    // 自动包装原型链上的所有异步方法（排除构造函数）
    const proto = Object.getPrototypeOf(this)
    const methodNames = Object.getOwnPropertyNames(proto).filter(
      name => name !== 'constructor' && typeof proto[name] === 'function'
    )
    methodNames.forEach(name => {
      const originalMethod = proto[name]
      this[name] = asyncHandler(originalMethod.bind(this))
    })
  }

  /**
   * 分页查询列表
   * GET /list
   */
  async getList(req, res) {
    const lang = getLangFromRequest(req)
    const result = await this.service.getList(req.query, lang)
    res.success(result)
  }

  /**
   * 获取所有数据（下拉选择用）
   * GET /all
   */
  async getAll(req, res) {
    const lang = getLangFromRequest(req)
    const result = await this.service.getAll(lang)
    res.success(result)
  }

  /**
   * 根据 ID 获取详情
   * GET /:id
   */
  async getById(req, res) {
    const lang = getLangFromRequest(req)
    const result = await this.service.getById(req.params.id, lang)
    res.success(result)
  }

  /**
   * 创建数据
   * POST /
   */
  async create(req, res) {
    const result = await this.service.create(req.body)
    res.success(result, '创建成功')
  }

  /**
   * 更新数据
   * PUT /:id
   */
  async update(req, res) {
    await this.service.update(req.params.id, req.body)
    res.success(null, '更新成功')
  }

  /**
   * 删除数据
   * DELETE /:id
   */
  async delete(req, res) {
    await this.service.delete(req.params.id)
    res.success(null, '删除成功')
  }

  /**
   * 批量删除
   * POST /batch-delete
   */
  async batchDelete(req, res) {
    const ids = req.body.ids || req.body
    const result = await this.service.batchDelete(ids)
    res.success(result, '批量删除成功')
  }
}

module.exports = BaseController
