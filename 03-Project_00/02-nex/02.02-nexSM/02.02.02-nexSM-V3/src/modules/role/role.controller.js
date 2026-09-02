/**
 * 角色管理模块 - 控制器层
 * 
 * 负责参数接收、调用 Service 层、返回统一响应
 * 继承 BaseController，复用通用 CRUD 接口
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseController = require('../../controllers/BaseController')
const roleService = require('./role.service')
const { getLangFromRequest } = require('../../utils/i18n')

class RoleController extends BaseController {
  /**
   * 构造函数
   * 初始化 BaseController，传入角色 Service 实例
   */
  constructor() {
    super(roleService)
  }

  // ==================== 特殊功能接口 ====================

  /**
   * 获取所有启用的角色（下拉选择用）
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getAllRoles(req, res) {
    const lang = getLangFromRequest(req)
    const result = await roleService.getAllRoles(lang)
    res.success(result)
  }

  // ==================== 通用 CRUD 接口（保留原有方法名） ====================

  /**
   * 分页查询角色列表
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.query - 查询参数
   * @param {number} [req.query.page=1] - 页码
   * @param {number} [req.query.pageSize=10] - 每页数量
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getRoleList(req, res) {
    const lang = getLangFromRequest(req)
    const result = await roleService.getRoleList(req.query, lang)
    res.success(result)
  }

  /**
   * 获取角色详情（含菜单权限）
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 角色 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async getRoleById(req, res) {
    const lang = getLangFromRequest(req)
    const result = await roleService.getRoleById(req.params.id, lang)
    res.success(result)
  }

  /**
   * 创建角色
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {string} req.body.role_name - 角色名称
   * @param {string} req.body.role_code - 角色编码（唯一）
   * @param {string} [req.body.description] - 角色描述
   * @param {Array<string>} [req.body.menuIds] - 菜单权限 ID 列表
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async createRole(req, res) {
    const result = await roleService.createRole(req.body)
    res.success(result)
  }

  /**
   * 更新角色
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 角色 ID
   * @param {Object} req.body - 请求体（更新数据）
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async updateRole(req, res) {
    await roleService.updateRole(req.params.id, req.body)
    res.success(null)
  }

  /**
   * 删除角色
   * 
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路径参数
   * @param {number} req.params.id - 角色 ID
   * @param {Object} res - Express 响应对象
   * @returns {Promise<void>}
   */
  async deleteRole(req, res) {
    await roleService.deleteRole(req.params.id)
    res.success(null)
  }
}

module.exports = new RoleController()
