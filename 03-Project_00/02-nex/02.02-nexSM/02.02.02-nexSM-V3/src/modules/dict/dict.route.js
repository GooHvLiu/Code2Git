/**
 * 数据字典模块 - 路由配置
 * 路由前缀：/prod-api/v2/dict（自动加载）
 * 作者: GooHv
 */
const express = require('express')
const router = express.Router()
const dictController = require('./dict.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// ==================== 字典类型 ====================

/**
 * @openapi
 * /dict/type:
 *   get:
 *     tags: [数据字典]
 *     summary: 分页查询字典类型列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: dictName
 *         schema: { type: string }
 *       - in: query
 *         name: dictType
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 分页字典类型
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/DictType' } }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 分页查询字典类型列表
router.get('/type', requireAuth, dictController.getTypeList)

/**
 * @openapi
 * /dict/type/{id}:
 *   get:
 *     tags: [数据字典]
 *     summary: 获取字典类型详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 字典类型详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/DictType' }
 */
// 获取字典类型详情
router.get('/type/:id', requireAuth, dictController.getTypeById)

/**
 * @openapi
 * /dict/type:
 *   post:
 *     tags: [数据字典]
 *     summary: 创建字典类型
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dictName, dictType]
 *             properties:
 *               dictName: { type: string, example: '用户性别' }
 *               dictType: { type: string, example: 'sys_user_sex' }
 *               status: { type: integer, enum: [0, 1] }
 *               remark: { type: string }
 *           example: { dictName: '用户性别', dictType: 'sys_user_sex', status: 1 }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 创建字典类型
router.post('/type', requireAuth, dictController.createType)

/**
 * @openapi
 * /dict/type/{id}:
 *   put:
 *     tags: [数据字典]
 *     summary: 更新字典类型
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
 *               dictName: { type: string }
 *               dictType: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *               remark: { type: string }
 *           example: { dictName: '用户性别(新)' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 更新字典类型
router.put('/type/:id', requireAuth, dictController.updateType)

/**
 * @openapi
 * /dict/type/{id}:
 *   delete:
 *     tags: [数据字典]
 *     summary: 删除字典类型
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
// 删除字典类型
router.delete('/type/:id', requireAuth, dictController.deleteType)

// ==================== 字典项 ====================

/**
 * @openapi
 * /dict/item:
 *   get:
 *     tags: [数据字典]
 *     summary: 分页查询字典项列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: dictType
 *         schema: { type: string }
 *         description: 按字典类型编码筛选
 *     responses:
 *       200:
 *         description: 分页字典项
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/DictItem' } }
 */
// 分页查询字典项列表
router.get('/item', requireAuth, dictController.getItemList)

/**
 * @openapi
 * /dict/items/{code}:
 *   get:
 *     tags: [数据字典]
 *     summary: 按字典类型编码获取字典项（前端 DictTag 组件用）
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *         description: 字典类型编码，如 sys_user_sex
 *     responses:
 *       200:
 *         description: 字典项列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/DictItem' }
 */
// 根据字典类型编码获取字典项列表
router.get('/items/:code', requireAuth, dictController.getItemsByTypeCode)

/**
 * @openapi
 * /dict/items/batch:
 *   post:
 *     tags: [数据字典]
 *     summary: 批量获取多个字典类型的字典项
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codes]
 *             properties:
 *               codes: { type: array, items: { type: string } }
 *           example: { codes: ['sys_user_sex', 'sys_normal_disable'] }
 *     responses:
 *       200:
 *         description: 多字典项数据（key 为类型编码）
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 批量获取多个字典类型的字典项
router.post('/items/batch', requireAuth, dictController.getItemsByTypeCodes)

/**
 * @openapi
 * /dict/item/{id}:
 *   get:
 *     tags: [数据字典]
 *     summary: 获取字典项详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 字典项详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/DictItem' }
 */
// 获取字典项详情
router.get('/item/:id', requireAuth, dictController.getItemById)

/**
 * @openapi
 * /dict/item:
 *   post:
 *     tags: [数据字典]
 *     summary: 创建字典项
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dictType, label, value]
 *             properties:
 *               dictType: { type: string, example: 'sys_user_sex' }
 *               label: { type: string, example: '男' }
 *               value: { type: string, example: '1' }
 *               sort: { type: integer }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { dictType: 'sys_user_sex', label: '男', value: '1', sort: 1, status: 1 }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 创建字典项
router.post('/item', requireAuth, dictController.createItem)

/**
 * @openapi
 * /dict/item/{id}:
 *   put:
 *     tags: [数据字典]
 *     summary: 更新字典项
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
 *               label: { type: string }
 *               value: { type: string }
 *               sort: { type: integer }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { label: '男性', sort: 2 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 更新字典项
router.put('/item/:id', requireAuth, dictController.updateItem)

/**
 * @openapi
 * /dict/item/{id}:
 *   delete:
 *     tags: [数据字典]
 *     summary: 删除字典项
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
// 删除字典项
router.delete('/item/:id', requireAuth, dictController.deleteItem)

module.exports = router
