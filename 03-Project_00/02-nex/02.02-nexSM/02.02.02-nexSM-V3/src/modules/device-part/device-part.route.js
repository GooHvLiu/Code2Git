/**
 * 部件寿命管理 - 路由配置
 * 作者: GooHv
 */

const express = require('express');
const router = express.Router();
const devicePartController = require('./device-part.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

// 所有路由都需要认证
router.use(requireAuth);

// ==================== 部件模板相关 ====================

/**
 * @openapi
 * /device-part/templates:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取所有部件模板
 *     responses:
 *       200:
 *         description: 模板列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/DevicePartTemplate' } }
 */
router.get('/templates', devicePartController.getTemplates);

/**
 * @openapi
 * /device-part/templates/admin:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取部件模板（管理页用）
 *     responses:
 *       200:
 *         description: 模板列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/DevicePartTemplate' } }
 */
router.get('/templates/admin', devicePartController.getTemplatesForAdmin);

/**
 * @openapi
 * /device-part/templates/base:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取所有基础模板（新增时选择源模板）
 *     responses:
 *       200:
 *         description: 基础模板列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/DevicePartTemplate' } }
 */
router.get('/templates/base', devicePartController.getBaseTemplates);

/**
 * @openapi
 * /device-part/templates/{id}:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取模板详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 模板详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/DevicePartTemplate' }
 */
router.get('/templates/:id', devicePartController.getTemplateDetail);

/**
 * @openapi
 * /device-part/templates/add:
 *   post:
 *     tags: [设备部件]
 *     summary: 新增部件模板
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: '灌装头模板' }
 *               code: { type: string, example: 'FILL_HEAD' }
 *               life_hours: { type: integer, example: 8000 }
 *               description: { type: string }
 *           example: { name: '灌装头模板', code: 'FILL_HEAD', life_hours: 8000 }
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/templates/add', devicePartController.addTemplate);

/**
 * @openapi
 * /device-part/templates/update/{id}:
 *   put:
 *     tags: [设备部件]
 *     summary: 编辑部件模板
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
 *               code: { type: string }
 *               life_hours: { type: integer }
 *               description: { type: string }
 *           example: { life_hours: 10000 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/templates/update/:id', devicePartController.updateTemplate);

/**
 * @openapi
 * /device-part/templates/delete/{id}:
 *   delete:
 *     tags: [设备部件]
 *     summary: 删除部件模板
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
router.delete('/templates/delete/:id', devicePartController.deleteTemplate);

// ==================== 部件实例相关 ====================

/**
 * @openapi
 * /device-part/list:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取所有部件实例
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 部件列表
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/DevicePart' } }
 */
router.get('/list', devicePartController.getPartList);

/**
 * @openapi
 * /device-part/{id}:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取部件详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 部件详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/DevicePart' }
 */
router.get('/:id', devicePartController.getPartDetail);

/**
 * @openapi
 * /device-part/add:
 *   post:
 *     tags: [设备部件]
 *     summary: 添加部件实例
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [template_id, name]
 *             properties:
 *               template_id: { type: integer }
 *               name: { type: string, example: '灌装头#1' }
 *               install_date: { type: string, format: 'date-time' }
 *           example: { template_id: 1, name: '灌装头#1' }
 *     responses:
 *       200:
 *         description: 添加成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/add', devicePartController.addPart);

/**
 * @openapi
 * /device-part/update/{id}:
 *   put:
 *     tags: [设备部件]
 *     summary: 更新部件实例
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
 *               status: { type: integer }
 *           example: { name: '灌装头#1A' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.put('/update/:id', devicePartController.updatePart);

/**
 * @openapi
 * /device-part/delete/{id}:
 *   delete:
 *     tags: [设备部件]
 *     summary: 删除部件实例
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
router.delete('/delete/:id', devicePartController.deletePart);

/**
 * @openapi
 * /device-part/replace/{id}:
 *   post:
 *     tags: [设备部件]
 *     summary: 部件更换录入
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
 *               reason: { type: string, example: '到期更换' }
 *               operator: { type: string, example: '张三' }
 *           example: { reason: '到期更换', operator: '张三' }
 *     responses:
 *       200:
 *         description: 更换记录成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/replace/:id', devicePartController.replacePart);

// ==================== 使用寿命统计相关 ====================

/**
 * @openapi
 * /device-part/update-life/{id}:
 *   post:
 *     tags: [设备部件]
 *     summary: 更新单个部件使用寿命
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
 *               usedLife: { type: number, example: 120.5 }
 *           example: { usedLife: 120.5 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/update-life/:id', devicePartController.updateUsedLife);

/**
 * @openapi
 * /device-part/batch-update-life:
 *   post:
 *     tags: [设备部件]
 *     summary: 批量更新所有部件使用寿命（从PLC数据）
 *     responses:
 *       200:
 *         description: 批量更新完成
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
router.post('/batch-update-life', devicePartController.batchUpdateUsedLife);

// ==================== 更换记录相关 ====================

/**
 * @openapi
 * /device-part/replace-records/list:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取部件更换记录列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 更换记录
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/PageResult' }
 */
router.get('/replace-records/list', devicePartController.getReplaceRecords);

// ==================== 预警相关 ====================

/**
 * @openapi
 * /device-part/warning-parts/list:
 *   get:
 *     tags: [设备部件]
 *     summary: 获取需要预警的部件列表
 *     responses:
 *       200:
 *         description: 预警部件列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/DevicePart' } }
 */
router.get('/warning-parts/list', devicePartController.getWarningParts);

module.exports = router;
