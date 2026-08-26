/**
 * 角色管理模块 - 业务逻辑层
 * 
 * 处理角色的增删改查、角色菜单权限关联、多语言字段处理等业务逻辑
 * 继承 BaseService，复用通用 CRUD 操作
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
const BaseService = require('../../services/BaseService')
const { RoleModel, RoleMenuModel } = require('./role.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

class RoleService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，传入角色模型和配置
   * 配置多语言字段：role_name（角色名称）、description（角色描述）
   */
  constructor() {
    super(RoleModel, {
      name: '角色',
      langFields: ['role_name', 'description']
    })
  }

  // ==================== 特殊功能方法 ====================

  /**
   * 分页查询角色列表
   * 
   * 调用 BaseService 的 getList 方法，处理多语言字段
   * 
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {string} [params.role_name] - 角色名称（模糊查询）
   * @param {string} [params.status] - 状态
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getRoleList(params, lang = 'zh-CN') {
    return await this.getList(params, lang)
  }

  /**
   * 获取所有启用的角色（下拉选择用）
   * 
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Array>} 启用的角色列表
   */
  async getAllRoles(lang = 'zh-CN') {
    const roles = await RoleModel.getAllEnabled()
    return this.processLangFields(roles, lang)
  }

  /**
   * 获取角色详情（含菜单权限）
   * 
   * 查询角色基本信息和关联的菜单权限 ID 列表
   * 
   * @param {number} id - 角色 ID
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} 角色详情（含 menuIds 菜单权限 ID 列表）
   * @throws {BusinessError} 角色不存在
   */
  async getRoleById(id, lang = 'zh-CN') {
    const role = await RoleModel.getById(id)
    if (!role) {
      throw new BusinessError(ERROR_CODE.ROLE_NOT_FOUND, '角色不存在')
    }
    // 查询角色菜单权限
    const menuIds = await RoleMenuModel.getMenuIdsByRoleId(id)
    const result = this.processLangFields(role, lang)
    return { ...result, menuIds }
  }

  /**
   * 创建角色
   * 
   * 检查角色编码是否已存在，处理多语言字段，保存角色菜单权限关联
   * 
   * @param {Object} data - 角色数据
   * @param {string} data.role_name - 角色名称（支持多语言对象或字符串）
   * @param {string} data.role_code - 角色编码（唯一）
   * @param {string} [data.description] - 角色描述（支持多语言对象或字符串）
   * @param {string} [data.data_scope='self'] - 数据范围 all/dept/dept_and_child/self
   * @param {number} [data.status=1] - 状态 1启用 0禁用
   * @param {Array<string>} [data.menuIds] - 菜单权限 ID 列表
   * @returns {Promise<Object>} { insertId, affectedRows }
   * @throws {BusinessError} 角色编码已存在
   */
  async createRole(data) {
    // 检查编码是否已存在
    const exist = await RoleModel.getByCode(data.role_code)
    if (exist) {
      throw new BusinessError(ERROR_CODE.ROLE_CODE_EXISTS, '角色编码已存在')
    }
    // 处理多语言字段（字符串转 JSON 对象）
    const processedData = this.convertLangFieldsToJson(data)
    const result = await RoleModel.create(processedData)
    // 如果有菜单权限，保存关联
    if (data.menuIds && data.menuIds.length > 0) {
      await RoleMenuModel.batchInsert(result.insertId, data.menuIds)
    }
    return result
  }

  /**
   * 更新角色
   * 
   * 更新角色基本信息和菜单权限关联，处理多语言字段
   * 
   * @param {number} id - 角色 ID
   * @param {Object} data - 更新数据
   * @param {string} [data.role_name] - 角色名称（支持多语言对象或字符串）
   * @param {string} [data.description] - 角色描述（支持多语言对象或字符串）
   * @param {Array<string>} [data.menuIds] - 菜单权限 ID 列表（传了就更新）
   * @returns {Promise<void>}
   * @throws {BusinessError} 角色不存在
   */
  async updateRole(id, data) {
    await this.getRoleById(id)
    // 处理多语言字段（字符串转 JSON 对象）
    const processedData = this.convertLangFieldsToJson(data)
    // 更新角色基本信息
    const { menuIds, ...roleData } = processedData
    await RoleModel.update(id, roleData)
    // 如果传了菜单权限，更新关联
    if (menuIds !== undefined) {
      await RoleMenuModel.deleteByRoleId(id)
      if (menuIds.length > 0) {
        await RoleMenuModel.batchInsert(id, menuIds)
      }
    }
  }

  /**
   * 删除角色
   * 
   * 删除角色前先删除角色菜单权限关联，再删除角色本身
   * 
   * @param {number} id - 角色 ID
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 角色不存在
   */
  async deleteRole(id) {
    await this.getRoleById(id)
    // 删除角色菜单关联
    await RoleMenuModel.deleteByRoleId(id)
    // 删除角色
    return await RoleModel.delete(id)
  }
}

module.exports = new RoleService()
