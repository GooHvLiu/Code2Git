/**
 * 部门管理模块 - 控制器层
 * 
 * 负责参数接收、调用 Service 层、返回统一响应
 * 继承 BaseController，复用通用 CRUD 接口
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseController = require('../../controllers/BaseController')
const deptService = require('./dept.service')
const { getLangFromRequest } = require('../../utils/i18n')

class DeptController extends BaseController {
  /**
   * 构造函数
   * 初始化 BaseController，传入部门 Service 实例
   */
  constructor() {
    super(deptService)
  }

  // ==================== 特殊功能接口 ====================

  /**
   * 获取部门树
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getDeptTree(req, res) {
    const lang = getLangFromRequest(req)
    const result = await deptService.getDeptTree(lang)
    res.success(result)
  }

  // ==================== 通用 CRUD 接口（保留原有方法名） ====================

  /**
   * 获取部门详情
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 部门 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getDeptById(req, res) {
    const lang = getLangFromRequest(req)
    const result = await deptService.getDeptById(req.params.id, lang)
    res.success(result)
  }

  /**
   * 创建部门
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {string} req.body.dept_name - 部门名称
   * @param {number} [req.body.parent_id=0] - 父部门 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async createDept(req, res) {
    const result = await deptService.createDept(req.body)
    res.success(result)
  }

  /**
   * 更新部门
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 部门 ID
   * @param {Object} req.body - 请求体（更新数据）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async updateDept(req, res) {
    await deptService.updateDept(req.params.id, req.body)
    res.success(null)
  }

  /**
   * 删除部门
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 部门 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async deleteDept(req, res) {
    await deptService.deleteDept(req.params.id)
    res.success(null)
  }
}

module.exports = new DeptController()
