/**
 * 部门管理模块 - 路由配置
 * 路由前缀：/prod-api/v2/dept（自动加载）
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const deptController = require('./dept.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

/**
 * @openapi
 * /dept/tree:
 *   get:
 *     tags: [部门管理]
 *     summary: 获取部门树
 *     responses:
 *       200:
 *         description: 部门树
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Dept' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 获取部门树
router.get('/tree', requireAuth, deptController.getDeptTree)

/**
 * @openapi
 * /dept/{id}:
 *   get:
 *     tags: [部门管理]
 *     summary: 获取部门详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 部门详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Dept' }
 *       404: { description: 部门不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
// 获取部门详情
router.get('/:id', requireAuth, deptController.getDeptById)

/**
 * @openapi
 * /dept:
 *   post:
 *     tags: [部门管理]
 *     summary: 创建部门
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deptName]
 *             properties:
 *               parentId: { type: integer, example: 0 }
 *               deptName: { type: string, example: '研发部' }
 *               orderNum: { type: integer, example: 1 }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { parentId: 0, deptName: '研发部', orderNum: 1, status: 1 }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 创建部门
router.post('/', requireAuth, deptController.createDept)

/**
 * @openapi
 * /dept/{id}:
 *   put:
 *     tags: [部门管理]
 *     summary: 更新部门
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
 *               parentId: { type: integer }
 *               deptName: { type: string }
 *               orderNum: { type: integer }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { deptName: '研发中心', orderNum: 2 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 更新部门
router.put('/:id', requireAuth, deptController.updateDept)

/**
 * @openapi
 * /dept/{id}:
 *   delete:
 *     tags: [部门管理]
 *     summary: 删除部门
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
// 删除部门
router.delete('/:id', requireAuth, deptController.deleteDept)

module.exports = router
