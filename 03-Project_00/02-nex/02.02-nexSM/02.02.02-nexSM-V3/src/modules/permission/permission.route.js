/**
 * 权限模块 - 路由层
 * 路由前缀：/prod-api/v2/permission
 * 作者: GooHv
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
} = require('./permission.schema')

// 需要登录的接口
router.use(requireAuth)

/**
 * @openapi
 * /permission/my:
 *   get:
 *     tags: [权限管理]
 *     summary: 获取当前登录用户的权限码列表
 *     responses:
 *       200:
 *         description: 权限码列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { type: string, example: 'system:user:list' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 获取当前登录用户的权限码列表（所有登录用户可访问）
router.get('/my', permissionController.getUserPermissions)

// 权限配置相关接口（仅管理员可访问）
router.use(requireRole(USER_ROLE.ADMINISTRATOR))

/**
 * @openapi
 * /permission/all:
 *   get:
 *     tags: [权限管理]
 *     summary: 获取所有权限（树形结构，仅管理员）
 *     responses:
 *       200:
 *         description: 权限树
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Menu' }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.get('/all', permissionController.getAllPermissions)

/**
 * @openapi
 * /permission/role/{roleId}/menu-ids:
 *   get:
 *     tags: [权限管理]
 *     summary: 获取角色已分配的菜单ID列表（仅管理员）
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 菜单ID列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { type: integer, example: 1 }
 */
router.get('/role/:roleId/menu-ids', validate(getRoleMenuIdsSchema, 'params'), permissionController.getRoleMenuIds)

/**
 * @openapi
 * /permission/role/save:
 *   post:
 *     tags: [权限管理]
 *     summary: 保存角色权限分配（全量覆盖，仅管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId, menuIds]
 *             properties:
 *               roleId: { type: integer }
 *               menuIds: { type: array, items: { type: integer } }
 *           example: { roleId: 2, menuIds: [1, 2, 3, 5] }
 *     responses:
 *       200:
 *         description: 保存成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.post('/role/save', validate(saveRolePermissionsSchema, 'body'), permissionController.saveRolePermissions)

module.exports = router
