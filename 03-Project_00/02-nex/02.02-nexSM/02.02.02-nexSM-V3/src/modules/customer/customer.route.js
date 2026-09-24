/**
 * 客户管理模块 - 路由层
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const CustomerController = require('./customer.controller.js');
const { requireAuth } = require('../../middleware/auth.middleware.js');
const validate = require('../../middleware/validate.middleware');
const {
  createCustomerSchema,
  updateCustomerSchema,
  idParamSchema,
  batchDeleteSchema,
  updateStatusSchema,
  queryCustomerListSchema
} = require('./customer.schema');

// 需要登录的接口
router.use(requireAuth);

/**
 * @openapi
 * /customer:
 *   get:
 *     tags: [客户管理]
 *     summary: 分页查询客户列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10, maximum: 100 }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: 客户名称模糊搜索
 *       - in: query
 *         name: status
 *         schema: { type: integer, enum: [0, 1] }
 *     responses:
 *       200:
 *         description: 分页客户列表
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/Customer' } }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
router.get('/', validate(queryCustomerListSchema, 'query'), CustomerController.getUserList);

/**
 * @openapi
 * /customer/{id}:
 *   get:
 *     tags: [客户管理]
 *     summary: 获取客户详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 客户详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Customer' }
 *       404: { description: 客户不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
router.get('/:id', validate(idParamSchema, 'params'), CustomerController.getUserDetail);

/**
 * @openapi
 * /customer:
 *   post:
 *     tags: [客户管理]
 *     summary: 新增客户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: '示例客户有限公司' }
 *               contact: { type: string }
 *               phone: { type: string }
 *               email: { type: string, format: email }
 *               address: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *               remark: { type: string }
 *           example:
 *             name: '示例客户有限公司'
 *             contact: '张三'
 *             phone: '13800000000'
 *             email: 'contact@example.com'
 *             address: '江苏省无锡市'
 *             status: 1
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       400: { description: 参数错误, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 */
router.post('/', validate(createCustomerSchema, 'body'), CustomerController.createUser);

/**
 * @openapi
 * /customer/{id}:
 *   put:
 *     tags: [客户管理]
 *     summary: 更新客户
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
 *               name: { type: string }
 *               contact: { type: string }
 *               phone: { type: string }
 *               email: { type: string, format: email }
 *               address: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *               remark: { type: string }
 *           example: { contact: '李四', phone: '13900000000' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       404: { description: 客户不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
router.put('/:id', validate(idParamSchema, 'params'), validate(updateCustomerSchema, 'body'), CustomerController.updateUser);

/**
 * @openapi
 * /customer/{id}:
 *   delete:
 *     tags: [客户管理]
 *     summary: 删除客户（软删除）
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
router.delete('/:id', validate(idParamSchema, 'params'), CustomerController.deleteUser);

/**
 * @openapi
 * /customer/batch:
 *   delete:
 *     tags: [客户管理]
 *     summary: 批量删除客户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: integer }, minItems: 1 }
 *           example: { ids: [1, 2] }
 *     responses:
 *       200:
 *         description: 批量删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/batch', validate(batchDeleteSchema, 'body'), CustomerController.batchDeleteUsers);

/**
 * @openapi
 * /customer/{id}/status:
 *   patch:
 *     tags: [客户管理]
 *     summary: 启用/禁用客户
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
 *             required: [status]
 *             properties:
 *               status: { type: integer, enum: [0, 1] }
 *           example: { status: 0 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateStatusSchema, 'body'), CustomerController.updateUserStatus);

module.exports = router;
