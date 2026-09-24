/**
 * 角色管理模块 - 路由配置
 * 路由前缀：/prod-api/v2/role（自动加载）
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const roleController = require('./role.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

/**
 * @openapi
 * /role/all:
 *   get:
 *     tags: [角色管理]
 *     summary: 获取所有启用的角色（下拉选择用）
 *     responses:
 *       200:
 *         description: 角色列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/Role' } }
 */
// 获取所有启用的角色（下拉选择用）
router.get('/all', requireAuth, roleController.getAllRoles)

/**
 * @openapi
 * /role:
 *   get:
 *     tags: [角色管理]
 *     summary: 分页查询角色列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: roleName
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 分页角色列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PageResult'
 *                         - type: object
 *                           properties:
 *                             list: { type: array, items: { $ref: '#/components/schemas/Role' } }
 */
// 分页查询角色列表
router.get('/', requireAuth, roleController.getRoleList)

/**
 * @openapi
 * /role/{id}:
 *   get:
 *     tags: [角色管理]
 *     summary: 获取角色详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 角色详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Role' }
 *       404: { description: 角色不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
// 获取角色详情
router.get('/:id', requireAuth, roleController.getRoleById)

/**
 * @openapi
 * /role:
 *   post:
 *     tags: [角色管理]
 *     summary: 创建角色
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleName, roleCode]
 *             properties:
 *               roleName: { type: string, example: '工艺工程师' }
 *               roleCode: { type: string, example: 'engineer' }
 *               description: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { roleName: '工艺工程师', roleCode: 'engineer', status: 1 }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 创建角色
router.post('/', requireAuth, roleController.createRole)

/**
 * @openapi
 * /role/{id}:
 *   put:
 *     tags: [角色管理]
 *     summary: 更新角色
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName: { type: string }
 *               description: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { description: '负责灌装工艺参数调试' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 更新角色
router.put('/:id', requireAuth, roleController.updateRole)

/**
 * @openapi
 * /role/{id}:
 *   delete:
 *     tags: [角色管理]
 *     summary: 删除角色
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 删除角色
router.delete('/:id', requireAuth, roleController.deleteRole)

module.exports = router
