/**
 * 角色管理模块 - 业务逻辑层
 *
 * 处理角色的增删改查、角色菜单权限关联、多语言字段处理等业务逻辑
 * 继承 BaseService，复用通用 CRUD 操作
 *
 * 角色可见性、内置角色保护等均由数据库字段决定，不硬编码角色编码
 *
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-09-05
 */
const BaseService = require('../../services/BaseService')
const { RoleModel, RoleMenuModel } = require('./role.model')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')
const {
  getVisibleRolesForUser,
  getRoleContext,
  clearRoleCache,
} = require('../../utils/roleContext')

class RoleService extends BaseService {
  /**
   * 构造函数
   * 初始化 BaseService，传入角色模型和配置
   * role_name 和 description 已改为 VARCHAR 字符串，无需多语言字段处理
   */
  constructor() {
    super(RoleModel, {
      name: '角色'
    })
  }

  /**
   * 分页查询角色列表
   *
   * 根据当前登录用户的 visible_role_levels 字段过滤可见角色
   * 超级管理员可见所有角色
   *
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.pageSize=10] - 每页数量
   * @param {string} [params.role_name] - 角色名称（模糊查询）
   * @param {string} [params.status] - 状态
   * @param {string} [lang='zh-CN'] - 语言代码
   * @param {Object} [currentUser] - 当前登录用户（用于过滤可见角色）
   * @returns {Promise<Object>} { list, total, page, pageSize }
   */
  async getRoleList(params, lang = 'zh-CN', currentUser = null) {
    // 获取当前用户可见的角色编码列表（数据库字段驱动）
    const visibleRoles = await getVisibleRolesForUser(currentUser)
    const visibleCodes = visibleRoles.map(r => r.role_code)

    // 通过角色编码白名单过滤（BaseService 支持 role_code 数组过滤则用，否则内存过滤）
    const result = await this.getList(params, lang)
    const list = result.list.filter(role => visibleCodes.includes(role.role_code))
    return { ...result, list, total: list.length }
  }

  /**
   * 获取所有启用的角色（下拉选择用）
   *
   * 根据当前登录用户的 visible_role_levels 字段过滤可见角色
   * 超级管理员可见所有角色
   *
   * @param {string} [lang='zh-CN'] - 语言代码
   * @param {Object} [currentUser] - 当前登录用户（用于过滤可见角色）
   * @returns {Promise<Array>} 可见的启用角色列表
   */
  async getAllRoles(lang = 'zh-CN', currentUser = null) {
    // role_name 和 description 已改为 VARCHAR，无需多语言处理
    return await getVisibleRolesForUser(currentUser)
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
      throw new BusinessError(ERROR_CODE.ROLE_NOT_FOUND, null)
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
   * 新建角色默认非内置、非超级管理员，等级默认取当前最大等级+1
   *
   * @param {Object} data - 角色数据
   * @param {string} data.role_name - 角色名称（支持多语言对象或字符串）
   * @param {string} data.role_code - 角色编码（唯一）
   * @param {string} [data.description] - 角色描述
   * @param {number} [data.status=1] - 状态 1启用 0禁用
   * @param {Array<string>} [data.menuIds] - 菜单权限 ID 列表
   * @returns {Promise<Object>} { insertId, affectedRows }
   * @throws {BusinessError} 角色编码已存在
   */
  async createRole(data) {
    // 检查编码是否已存在
    const exist = await RoleModel.getByCode(data.role_code)
    if (exist) {
      throw new BusinessError(ERROR_CODE.ROLE_CODE_EXISTS, null)
    }
    // 新建角色强制为非内置、非超级管理员
    data.is_builtin = 0
    data.is_super_admin = 0
    // role_name 和 description 已改为 VARCHAR，直接保存
    const result = await RoleModel.create(data)
    // 如果有菜单权限，保存关联
    if (data.menuIds && data.menuIds.length > 0) {
      await RoleMenuModel.batchInsert(result.insertId, data.menuIds)
    }
    clearRoleCache()
    return result
  }

  /**
   * 更新角色
   *
   * 更新角色基本信息和菜单权限关联，处理多语言字段
   * 内置角色（is_builtin=1）不允许编辑
   *
   * @param {number} id - 角色 ID
   * @param {Object} data - 更新数据
   * @returns {Promise<void>}
   * @throws {BusinessError} 角色不存在 / 内置角色不允许编辑
   */
  async updateRole(id, data) {
    const role = await this.getRoleById(id)
    // 内置角色不允许编辑（数据库字段决定）
    if (Number(role.is_builtin) === 1) {
      throw new BusinessError(ERROR_CODE.ROLE_BASIC_CANNOT_EDIT, null)
    }
    // 不允许通过编辑修改超级管理员标记和内置标记
    delete data.is_super_admin
    delete data.is_builtin
    // role_name 和 description 已改为 VARCHAR，直接更新
    const { menuIds, ...roleData } = data
    await RoleModel.update(id, roleData)
    // 如果传了菜单权限，更新关联
    if (menuIds !== undefined) {
      await RoleMenuModel.deleteByRoleId(id)
      if (menuIds.length > 0) {
        await RoleMenuModel.batchInsert(id, menuIds)
      }
    }
    clearRoleCache()
  }

  /**
   * 删除角色
   *
   * 删除角色前先删除角色菜单权限关联，再删除角色本身
   * 内置角色（is_builtin=1）不允许删除
   *
   * @param {number} id - 角色 ID
   * @returns {Promise<Object>} { affectedRows }
   * @throws {BusinessError} 角色不存在 / 内置角色不允许删除
   */
  async deleteRole(id) {
    const role = await this.getRoleById(id)
    // 内置角色不允许删除（数据库字段决定）
    if (Number(role.is_builtin) === 1) {
      throw new BusinessError(ERROR_CODE.ROLE_BASIC_CANNOT_DELETE, null)
    }
    // 删除角色菜单关联
    await RoleMenuModel.deleteByRoleId(id)
    // 删除角色
    const result = await RoleModel.delete(id)
    clearRoleCache()
    return result
  }
}

module.exports = new RoleService()
