/**
 * ==========================================
 * 超级管理员校验中间件
 * ==========================================
 * 用于超级面板专用接口的权限校验
 * 仅数据库中 is_super_admin=1 的角色可访问
 * 不硬编码角色编码，依据数据库字段判断
 *
 * 使用方式：
 *   const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware')
 *   router.use(requireSuperAdmin)
 */
const { checkIsSuperAdmin } = require('../utils/roleContext')
const { BusinessError } = require('./error.middleware')
const { ERROR_CODE } = require('../constants/errorCode')

/**
 * 超级管理员校验中间件
 * 仅超级管理员可访问，否则返回 403
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express 中间件 next 函数
 * @returns {Promise<void>}
 */
async function requireSuperAdmin(req, res, next) {
  try {
    // 未登录用户（理论上 requireAuth 已经拦截了，这里是双重保险）
    if (!req.user || !req.user.id) {
      throw new BusinessError(ERROR_CODE.UNAUTHORIZED, null)
    }

    // 数据库标记为超级管理员的角色直接放行
    const isSuper = await checkIsSuperAdmin(req.user)
    if (!isSuper) {
      throw new BusinessError(ERROR_CODE.PERMISSION_DENIED, null, {
        message: '仅超级管理员可访问此功能'
      })
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  requireSuperAdmin,
}
