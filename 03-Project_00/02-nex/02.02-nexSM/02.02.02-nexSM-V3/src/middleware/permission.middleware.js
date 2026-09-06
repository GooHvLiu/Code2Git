/**
 * ==========================================
 * 权限校验中间件
 * ==========================================
 * 用于接口级别的权限校验，在路由配置中声明每个接口需要的权限码
 * 无权限时返回 403 错误
 *
 * 超级管理员判断依据数据库 nex_role.is_super_admin 字段，不硬编码角色编码
 *
 * 使用方式：
 *   const { requirePermission } = require('../../middleware/permission.middleware')
 *   router.post('/create', requirePermission('menu.system.user.add'), userController.createUser)
 */
const permissionService = require('../modules/permission/permission.service')
const { BusinessError } = require('./error.middleware')
const { ERROR_CODE } = require('../constants/errorCode')
const { checkIsSuperAdmin } = require('../utils/roleContext')

/**
 * 权限校验中间件工厂函数
 * @param {string|Array<string>} permissionCodes - 需要的权限码（单个或数组）
 * @param {Object} [options] - 配置选项
 * @param {string} [options.mode='any'] - 校验模式：'any'（拥有任意一个即可）或 'all'（必须拥有全部）
 * @returns {Function} Express 中间件
 */
function requirePermission(permissionCodes, options = {}) {
  const { mode = 'any' } = options

  return async (req, res, next) => {
    try {
      // 未登录用户（理论上 requireAuth 已经拦截了，这里是双重保险）
      if (!req.user || !req.user.id) {
        throw new BusinessError(ERROR_CODE.UNAUTHORIZED, null)
      }

      // 数据库标记为超级管理员的角色直接放行，拥有所有权限
      if (await checkIsSuperAdmin(req.user)) {
        return next()
      }

      const userId = req.user.id
      const codes = Array.isArray(permissionCodes) ? permissionCodes : [permissionCodes]

      // 权限码为空，直接放行
      if (codes.length === 0) {
        return next()
      }

      // 获取用户权限码列表
      const userPermissions = await permissionService.getUserPermissions(userId)

      // 校验权限
      let hasPermission = false
      if (mode === 'all') {
        // 必须拥有全部权限
        hasPermission = codes.every(code => userPermissions.includes(code))
      } else {
        // 拥有任意一个权限即可
        hasPermission = codes.some(code => userPermissions.includes(code))
      }

      if (!hasPermission) {
        throw new BusinessError(ERROR_CODE.PERMISSION_DENIED, null)
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

/**
 * 可选权限校验中间件（不拦截，只把是否有权限注入到 req 中）
 * 用于需要根据权限动态返回数据的场景
 * @param {string|Array<string>} permissionCodes - 需要的权限码
 * @param {string} [fieldName='hasPermission'] - 注入到 req 中的字段名
 * @returns {Function} Express 中间件
 */
function optionalPermission(permissionCodes, fieldName = 'hasPermission') {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        req[fieldName] = false
        return next()
      }

      // 数据库标记为超级管理员的角色默认拥有所有权限
      if (await checkIsSuperAdmin(req.user)) {
        req[fieldName] = true
        return next()
      }

      const userId = req.user.id
      const codes = Array.isArray(permissionCodes) ? permissionCodes : [permissionCodes]

      if (codes.length === 0) {
        req[fieldName] = true
        return next()
      }

      const userPermissions = await permissionService.getUserPermissions(userId)
      req[fieldName] = codes.some(code => userPermissions.includes(code))

      next()
    } catch (err) {
      // 可选权限校验失败不拦截，默认无权限
      req[fieldName] = false
      next()
    }
  }
}

module.exports = {
  requirePermission,
  optionalPermission,
}
