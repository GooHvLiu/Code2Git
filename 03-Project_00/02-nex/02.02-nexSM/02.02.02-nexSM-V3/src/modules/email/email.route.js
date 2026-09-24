/**
 * 邮箱配置路由
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const emailController = require('./email.controller');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');

// 所有接口需要登录
router.use(requireAuth);

/**
 * @openapi
 * /email/providers:
 *   get:
 *     tags: [邮箱服务]
 *     summary: 获取支持的邮箱服务商列表
 *     responses:
 *       200:
 *         description: 服务商列表
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
 *                           code: { type: string, example: 'smtp' }
 *                           name: { type: string, example: 'SMTP' }
 */
// 获取支持的服务商列表
router.get('/providers', emailController.getProviders);

/**
 * @openapi
 * /email/all:
 *   get:
 *     tags: [邮箱服务]
 *     summary: 获取所有启用的邮箱配置（下拉选择用）
 *     responses:
 *       200:
 *         description: 启用配置列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { $ref: '#/components/schemas/EmailConfig' } }
 */
// 获取所有启用的配置（下拉选择用）
router.get('/all', emailController.getAllEnabled);

/**
 * @openapi
 * /email/list:
 *   get:
 *     tags: [邮箱服务]
 *     summary: 分页获取邮箱配置列表
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 分页配置列表
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/EmailConfig' } }
 */
// 获取配置列表（分页）
router.get('/list', emailController.getList);

/**
 * @openapi
 * /email/log/list:
 *   get:
 *     tags: [邮箱服务]
 *     summary: 分页获取邮件发送日志
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 发送日志分页
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/PageResult' }
 */
// 获取发送日志列表（分页）- 必须放在 /:id 前面
router.get('/log/list', emailController.getLogList);

/**
 * @openapi
 * /email/{id}:
 *   get:
 *     tags: [邮箱服务]
 *     summary: 获取邮箱配置详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 配置详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/EmailConfig' }
 */
// 获取单个配置详情
router.get('/:id', emailController.getDetail);

// 以下接口需要管理员权限
router.use(requireRole('administrator'));

/**
 * @openapi
 * /email:
 *   post:
 *     tags: [邮箱服务]
 *     summary: 新增邮箱配置（管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [provider, host, port, username]
 *             properties:
 *               provider: { type: string, example: 'smtp' }
 *               host: { type: string, example: 'smtp.exmail.qq.com' }
 *               port: { type: integer, example: 465 }
 *               secure: { type: boolean, example: true }
 *               username: { type: string, example: 'no-reply@nexsm.com' }
 *               password: { type: string, example: '授权码' }
 *               fromName: { type: string, example: 'nexSM' }
 *               status: { type: integer, enum: [0, 1] }
 *           example:
 *             provider: 'smtp'
 *             host: 'smtp.exmail.qq.com'
 *             port: 465
 *             secure: true
 *             username: 'no-reply@nexsm.com'
 *             password: 'your-smtp-auth-code'
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 新增配置
router.post('/', emailController.create);

/**
 * @openapi
 * /email/{id}:
 *   put:
 *     tags: [邮箱服务]
 *     summary: 更新邮箱配置（管理员）
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
 *             description: 同新增，字段可选
 *           example: { host: 'smtp.163.com', port: 465 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 更新配置
router.put('/:id', emailController.update);

/**
 * @openapi
 * /email/{id}:
 *   delete:
 *     tags: [邮箱服务]
 *     summary: 删除邮箱配置（管理员）
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
// 删除配置
router.delete('/:id', emailController.delete);

/**
 * @openapi
 * /email/{id}/default:
 *   put:
 *     tags: [邮箱服务]
 *     summary: 设为默认邮箱配置（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 设置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 设为默认
router.put('/:id/default', emailController.setDefault);

/**
 * @openapi
 * /email/{id}/status:
 *   put:
 *     tags: [邮箱服务]
 *     summary: 启用/禁用邮箱配置（管理员）
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
 *               status: { type: integer, enum: [0, 1] }
 *           example: { status: 0 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 启用/禁用
router.put('/:id/status', emailController.updateStatus);

/**
 * @openapi
 * /email/test:
 *   post:
 *     tags: [邮箱服务]
 *     summary: 发送测试邮件（管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, to]
 *             properties:
 *               id: { type: integer, description: 邮箱配置ID }
 *               to: { type: string, description: 收件人地址 }
 *           example: { id: 1, to: 'test@nexsm.com' }
 *     responses:
 *       200:
 *         description: 发送成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 发送测试邮件
router.post('/test', emailController.sendTestEmail);

/**
 * @openapi
 * /email/verify:
 *   post:
 *     tags: [邮箱服务]
 *     summary: 验证 SMTP 连接（管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               host: { type: string }
 *               port: { type: integer }
 *               secure: { type: boolean }
 *               username: { type: string }
 *               password: { type: string }
 *           example: { host: 'smtp.exmail.qq.com', port: 465, secure: true, username: 'no-reply@nexsm.com', password: 'xxx' }
 *     responses:
 *       200:
 *         description: 连接结果
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 验证SMTP连接
router.post('/verify', emailController.verifyConnection);

/**
 * @openapi
 * /email/log/{id}:
 *   get:
 *     tags: [邮箱服务]
 *     summary: 获取邮件日志详情（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 日志详情
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 获取日志详情
router.get('/log/:id', emailController.getLogDetail);

/**
 * @openapi
 * /email/log/{id}:
 *   delete:
 *     tags: [邮箱服务]
 *     summary: 删除邮件日志（管理员）
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
// 删除日志
router.delete('/log/:id', emailController.deleteLog);

/**
 * @openapi
 * /email/log/batch-delete:
 *   post:
 *     tags: [邮箱服务]
 *     summary: 批量删除邮件日志（管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: integer } }
 *           example: { ids: [1, 2, 3] }
 *     responses:
 *       200:
 *         description: 批量删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 */
// 批量删除日志
router.post('/log/batch-delete', emailController.batchDeleteLogs);

module.exports = router;
