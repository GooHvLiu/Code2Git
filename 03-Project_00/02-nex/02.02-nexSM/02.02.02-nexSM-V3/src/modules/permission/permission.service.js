/**
 * ==========================================
 * 权限模块 - 业务逻辑层
 * ==========================================
 * 负责：权限码查询（带缓存）、角色权限分配、权限列表查询
 * 使用 node-cache 进程内缓存，减少数据库查询
 */
const permissionModel = require('./permission.model')
const cache = require('../../utils/cache')
const { BusinessError } = require('../../middleware/error.middleware')
const { ERROR_CODE } = require('../../constants/errorCode')

// 缓存 key 前缀
const CACHE_PREFIX = 'user_permissions:'
// 缓存过期时间（秒）- 30 分钟
const CACHE_TTL = 30 * 60

class PermissionService {
  /**
   * 获取用户权限码列表（带缓存）
   * @param {number} userId - 用户ID
   * @returns {Promise<Array<string>>} 权限码数组
   */
  /**
   * 获取用户权限码列表（带缓存）
   * @param {number} userId - 用户ID
   * @returns {Promise<Array<string>>} 权限码数组
   */
  async getUserPermissions(userId) {
    if (!userId) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }

    const cacheKey = CACHE_PREFIX + userId

    // 1. 先查缓存
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }

    // 2. 缓存未命中，查数据库
    const permissions = await permissionModel.getPermissionCodesByUserId(userId)

    // 3. 写入缓存
    cache.set(cacheKey, permissions, CACHE_TTL)

    return permissions
  }

  /**
   * 校验用户是否拥有指定权限
   * @param {number} userId - 用户ID
   * @param {string} permissionCode - 权限码
   * @returns {Promise<boolean>} 是否拥有权限
   */
  async hasPermission(userId, permissionCode) {
    if (!userId || !permissionCode) return false
    const permissions = await this.getUserPermissions(userId)
    return permissions.includes(permissionCode)
  }

  /**
   * 校验用户是否拥有指定权限中的任意一个
   * @param {number} userId - 用户ID
   * @param {Array<string>} permissionCodes - 权限码数组
   * @returns {Promise<boolean>} 是否拥有任意一个权限
   */
  async hasAnyPermission(userId, permissionCodes) {
    if (!userId || !Array.isArray(permissionCodes) || permissionCodes.length === 0) {
      return false
    }
    const permissions = await this.getUserPermissions(userId)
    return permissionCodes.some(code => permissions.includes(code))
  }

  /**
   * 获取角色权限码列表
   * @param {number} roleId - 角色ID
   * @returns {Promise<Array<string>>} 权限码数组
   */
  async getRolePermissions(roleId) {
    if (!roleId) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    return await permissionModel.getPermissionCodesByRoleId(roleId)
  }

  /**
   * 获取所有权限列表（树形结构，用于权限配置界面）
   * @returns {Promise<Array>} 权限列表（树形结构）
   */
  async getAllPermissions() {
    // 返回完整权限树（节点带 superOnly 标记），是否展示/禁用由前端按当前配置的角色决定
    return await permissionModel.getAllPermissions()
  }

  /**
   * 获取角色已分配的菜单ID列表
   * @param {number} roleId - 角色ID
   * @returns {Promise<Array<number>>} 菜单ID数组
   */
  async getRoleMenuIds(roleId) {
    if (!roleId) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    return await permissionModel.getRoleMenuIds(roleId)
  }

  /**
   * 保存角色权限分配（全量覆盖）
   * 保存后：更新该角色下所有用户的权限版本号 + 清除这些用户的权限缓存
   * @param {number} roleId - 角色ID
   * @param {Array<number>} menuIds - 菜单ID数组（包含菜单、按钮、参数）
   * @param {string} roleCode - 角色编码（用于更新用户权限版本号）
   * @returns {Promise<boolean>} 是否保存成功
   */
  async saveRolePermissions(roleId, menuIds, roleCode) {
    if (!roleId) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }
    if (!Array.isArray(menuIds)) {
      throw new BusinessError(ERROR_CODE.PARAM_ERROR, null)
    }

    // 1. 保存角色权限分配
    const result = await permissionModel.saveRolePermissions(roleId, menuIds)

    // 2. 更新该角色下所有用户的权限版本号
    if (roleCode) {
      await permissionModel.updatePermissionVersionByRoleCode(roleCode)
    }

    // 3. 清除所有用户的权限缓存（简单粗暴，因为不知道哪些用户属于该角色）
    // 生产环境可以优化为只清除该角色下用户的缓存
    cache.delByPrefix(CACHE_PREFIX)

    return result
  }

  /**
   * 清除指定用户的权限缓存
   * @param {number} userId - 用户ID
   * @returns {boolean} 是否清除成功
   */
  clearUserCache(userId) {
    if (!userId) return false
    const cacheKey = CACHE_PREFIX + userId
    return cache.del(cacheKey) > 0
  }

  /**
   * 清除所有用户的权限缓存
   * @returns {boolean} 是否清除成功
   */
  clearAllCache() {
    cache.delByPrefix(CACHE_PREFIX)
    return true
  }

  /**
   * 获取用户权限版本号
   * @param {number} userId - 用户ID
   * @returns {Promise<string|null>} 权限版本号
   */
  async getUserPermissionVersion(userId) {
    if (!userId) return null
    return await permissionModel.getUserPermissionVersion(userId)
  }
}

module.exports = new PermissionService()
