/**
 * 数据库管理路由（仅超级管理员）
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const dbManagerController = require('./db-manager.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireSuperAdmin } = require('../../middleware/superAdmin.middleware');

// 需要登录的接口
router.use(requireAuth);

// 所有数据库管理接口都需要超级管理员权限
router.use(requireSuperAdmin);

/**
 * @openapi
 * /db-manager/tables:
 *   get:
 *     tags: [数据库管理]
 *     summary: 获取所有数据表列表
 *     responses:
 *       200:
 *         description: 数据表列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           tableName: { type: string, example: 'nex_user' }
 *                           tableComment: { type: string, example: '用户表' }
 *                           rows: { type: integer, example: 42 }
 *       403: { description: 非超级管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 数据查看
router.get('/tables', dbManagerController.getAllTables);

/**
 * @openapi
 * /db-manager/tables/{tableName}/structure:
 *   get:
 *     tags: [数据库管理]
 *     summary: 获取数据表结构
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema: { type: string }
 *         description: 表名
 *     responses:
 *       200:
 *         description: 表字段结构
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field: { type: string, example: 'id' }
 *                           type: { type: string, example: 'int(11)' }
 *                           null: { type: string, example: 'NO' }
 *                           key: { type: string, example: 'PRI' }
 *                           default: { type: string, nullable: true }
 *                           comment: { type: string, example: '主键ID' }
 */
router.get('/tables/:tableName/structure', dbManagerController.getTableStructure);

/**
 * @openapi
 * /db-manager/tables/{tableName}/data:
 *   get:
 *     tags: [数据库管理]
 *     summary: 分页查询表数据
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: 表数据
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/PageResult' }
 */
router.get('/tables/:tableName/data', dbManagerController.getTableData);

/**
 * @openapi
 * /db-manager/tables/{tableName}/data:
 *   put:
 *     tags: [数据库管理]
 *     summary: 更新表数据（按主键）
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, row]
 *             properties:
 *               id: { type: integer, example: 1 }
 *               row:
 *                 type: object
 *                 additionalProperties: true
 *                 example: { status: 1, remark: 'updated' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 配置表编辑
router.put('/tables/:tableName/data', dbManagerController.updateTableData);

/**
 * @openapi
 * /db-manager/tables/{tableName}/data:
 *   post:
 *     tags: [数据库管理]
 *     summary: 插入表数据
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             description: 要插入的字段键值对
 *           example: { username: 'temp', status: 1 }
 *     responses:
 *       200:
 *         description: 插入成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/tables/:tableName/data', dbManagerController.insertTableData);

/**
 * @openapi
 * /db-manager/tables/{tableName}/data:
 *   delete:
 *     tags: [数据库管理]
 *     summary: 删除表数据（按主键）
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: integer } }
 *           example: { ids: [10, 11] }
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.delete('/tables/:tableName/data', dbManagerController.deleteTableData);

/**
 * @openapi
 * /db-manager/backup:
 *   post:
 *     tags: [数据库管理]
 *     summary: 创建数据库备份
 *     responses:
 *       200:
 *         description: 备份创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 版本备份
router.post('/backup', dbManagerController.createBackup);

/**
 * @openapi
 * /db-manager/backup:
 *   get:
 *     tags: [数据库管理]
 *     summary: 获取备份列表
 *     responses:
 *       200:
 *         description: 备份列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer }
 *                           fileName: { type: string }
 *                           size: { type: integer }
 *                           createTime: { type: string, format: 'date-time' }
 */
router.get('/backup', dbManagerController.getBackupList);

/**
 * @openapi
 * /db-manager/backup/{id}:
 *   get:
 *     tags: [数据库管理]
 *     summary: 获取备份详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 备份详情
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.get('/backup/:id', dbManagerController.getBackupById);

/**
 * @openapi
 * /db-manager/backup/{id}:
 *   delete:
 *     tags: [数据库管理]
 *     summary: 删除备份
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
router.delete('/backup/:id', dbManagerController.deleteBackup);

/**
 * @openapi
 * /db-manager/backup/{id}/restore:
 *   post:
 *     tags: [数据库管理]
 *     summary: 从备份回滚数据库
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 回滚成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 回滚
router.post('/backup/:id/restore', dbManagerController.restoreBackup);

module.exports = router;
