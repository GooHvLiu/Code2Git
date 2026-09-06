/**
 * ==========================================
 * 权限模块 - 控制器层
 * ==========================================
 * 负责参数接收、调用 Service 层、返回统一响应
 * 权限配置接口仅管理员可访问（由权限中间件控制）
 */
const permissionService = require('./permission.service')
const { getLangFromRequest } = require('../../utils/i18n')
const { triggerNotification } = require('../../utils/notification')
const audit = require('../../utils/audit')

class PermissionController {
  /**
   * 获取当前登录用户的权限码列表
   * 前端登录后调用，获取该用户拥有的所有权限码，存在本地用于按钮/参数权限判断
   * @param {Object} req - Express 请求对象
   * @param {Object} req.user - 当前登录用户信息（由 auth 中间件注入）
   * @param {number} req.user.id - 用户ID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getUserPermissions(req, res, next) {
    try {
      const userId = req.user.id
      const permissions = await permissionService.getUserPermissions(userId)
      const permissionVersion = await permissionService.getUserPermissionVersion(userId)
      res.success({ permissions, permissionVersion })
    } catch (err) {
      next(err)
    }
  }

  /**
   * 获取所有权限列表（树形结构）
   * 用于权限配置界面展示，包含菜单、按钮、参数
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getAllPermissions(req, res, next) {
    try {
      const lang = getLangFromRequest(req)
      const permissions = await permissionService.getAllPermissions()
      res.success({ permissions, lang })
    } catch (err) {
      next(err)
    }
  }

  /**
   * 获取角色已分配的菜单ID列表
   * 用于权限配置界面回显已勾选的权限
   * @param {Object} req - Express 请求对象
   * @param {Object} req.params - 路由参数
   * @param {number} req.params.roleId - 角色ID
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async getRoleMenuIds(req, res, next) {
    try {
      const roleId = parseInt(req.params.roleId)
      const menuIds = await permissionService.getRoleMenuIds(roleId)
      res.success({ roleId, menuIds })
    } catch (err) {
      next(err)
    }
  }

  /**
   * 保存角色权限分配（全量覆盖）
   * 保存后自动更新该角色下所有用户的权限版本号，并清除权限缓存
   * @param {Object} req - Express 请求对象
   * @param {Object} req.body - 请求体
   * @param {number} req.body.roleId - 角色ID
   * @param {string} req.body.roleCode - 角色编码
   * @param {Array<number>} req.body.menuIds - 菜单ID数组（包含菜单、按钮、参数）
   * @param {Object} res - Express 响应对象
   * @param {Function} next - Express 中间件 next 函数
   * @returns {Promise<void>}
   */
  async saveRolePermissions(req, res, next) {
    try {
      const { roleId, roleCode, menuIds } = req.body
      const result = await permissionService.saveRolePermissions(roleId, menuIds, roleCode)

      // 记录审计日志：权限配置变更
      audit.log(req, {
        action: audit.ACTION.PERMISSION_CHANGE,
        target: `角色ID:${roleId}, 角色编码:${roleCode}`,
        newValue: `权限数量:${menuIds.length}`,
        result: 'success',
        reason: '管理员配置角色权限'
      }).catch(err => {
        console.error('[权限配置变更] 记录审计日志失败:', err)
      })

      // 触发通知：权限配置变更（通知管理员）
      triggerNotification('permission.change', {
        roleId: roleId,
        roleCode: roleCode,
        permissionCount: menuIds.length,
        operator: req.user?.username || '未知用户'
      }, req.user?.id).catch(err => {
        console.error('[权限配置变更] 触发通知失败:', err)
      })
      res.success({ success: result })
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new PermissionController()



