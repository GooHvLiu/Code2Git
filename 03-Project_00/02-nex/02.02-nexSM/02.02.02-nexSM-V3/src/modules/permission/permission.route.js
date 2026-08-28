/**
 * ==========================================
 * 权限模块 - 路由层
 * ==========================================
 * 路由前缀：/prod-api/v2/permission（自动加载）
 */
const express = require('express')
const router = express.Router()
const permissionController = require('./permission.controller')
const { requireAuth, requireRole } = require('../../middleware/auth.middleware')
const { USER_ROLE } = require('../../constants/statusCode')
const validate = require('../../middleware/validate.middleware')
const {
  saveRolePermissionsSchema,
  getRoleMenuIdsSchema,
  clearUserCacheSchema
} = require('./permission.schema')

// 需要登录的接口
router.use(requireAuth)

// 获取当前登录用户的权限码列表（所有登录用户可访问）
router.get('/my', permissionController.getUserPermissions)

// 权限配置相关接口（仅管理员可访问）
router.use(requireRole(USER_ROLE.ADMINISTRATOR))

// 获取所有权限列表（树形结构）
router.get('/all', permissionController.getAllPermissions)

// 获取角色已分配的菜单ID列表
router.get('/role/:roleId/menu-ids', validate(getRoleMenuIdsSchema, 'params'), permissionController.getRoleMenuIds)

// 保存角色权限分配（全量覆盖）
router.post('/role/save', validate(saveRolePermissionsSchema, 'body'), permissionController.saveRolePermissions)

// 清除指定用户的权限缓存
router.post('/cache/clear-user', validate(clearUserCacheSchema, 'body'), permissionController.clearUserCache)

// 清除所有用户的权限缓存
router.post('/cache/clear-all', permissionController.clearAllCache)

module.exports = router
