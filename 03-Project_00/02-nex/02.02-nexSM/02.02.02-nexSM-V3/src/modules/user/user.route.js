/**
 * 用户模块 - 路由层
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const userDeviceController = require('./user-device.controller');
const { requireAuth, optionalAuth, requireRole } = require('../../middleware/auth.middleware');
const { USER_ROLE } = require('../../constants/statusCode');
const validate = require('../../middleware/validate.middleware');
const {
  loginSchema,
  registerSchema,
  createUserSchema,
  updateUserSchema,
  idParamSchema,
  batchDeleteSchema,
  updateStatusSchema,
  queryUserListSchema
} = require('./user.schema');

/**
 * @openapi
 * /user/token-valid:
 *   get:
 *     tags: [用户管理]
 *     summary: 校验 token 是否有效
 *     description: 携带 token 时校验其合法性；无 token 也可调用(返回 valid=false)。前端刷新页面时用来判断登录态。
 *         公开接口，不强制认证。
 *     security: []
 *     responses:
 *       200:
 *         description: 校验结果
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         valid: { type: boolean, example: true }
 */
// token验证有效性接口，公开接口
router.get('/token-valid', optionalAuth, (req, res) => {
  /**
   * req.user 存在 = token合法、未过期
   * req.user undefined = 无token / token篡改 / token过期
   */
  res.success({ valid: !!req.user });
});

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags: [用户管理]
 *     summary: 用户登录
 *     description: 账号密码登录，返回 JWT token。可携带图形验证码(uuid+code)。
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, minLength: 2, maxLength: 50, example: admin }
 *               password: { type: string, minLength: 6, maxLength: 32, example: '123456' }
 *               uuid: { type: string, description: 验证码uuid, example: 'a1b2c3' }
 *               code: { type: string, description: 验证码字符, example: 'ab12' }
 *               deviceId: { type: string, description: 设备唯一标识 }
 *               deviceName: { type: string, description: 设备名称 }
 *           example:
 *             username: admin
 *             password: '123456'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/LoginResult' }
 *       400: { description: 参数错误或账号密码错误, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 *       401: { description: 认证失败, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 登录接口（公开）
router.post('/login', validate(loginSchema, 'body'), userController.login);

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags: [用户管理]
 *     summary: 用户注册
 *     description: 公开自助注册接口，需邮箱 + 验证码。
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, email]
 *             properties:
 *               username: { type: string, minLength: 2, maxLength: 50, example: 'newuser' }
 *               password: { type: string, minLength: 6, maxLength: 32, example: '123456' }
 *               email: { type: string, format: email, example: 'user@nexsm.com' }
 *               uuid: { type: string, description: 验证码uuid }
 *               code: { type: string, description: 验证码 }
 *           example:
 *             username: newuser
 *             password: '123456'
 *             email: 'user@nexsm.com'
 *     responses:
 *       200:
 *         description: 注册成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       400: { description: 参数错误, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 */
// 注册接口（公开）
router.post('/register', validate(registerSchema, 'body'), userController.register);

/**
 * @openapi
 * /user/forgot-password/send-code:
 *   post:
 *     tags: [用户管理]
 *     summary: 忘记密码-发送重置验证码
 *     description: 向用户绑定邮箱发送密码重置验证码。公开接口。
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: 'admin@nexsm.com' }
 *           example: { email: 'admin@nexsm.com' }
 *     responses:
 *       200:
 *         description: 发送成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       404: { description: 邮箱未注册, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
// 忘记密码-发送验证码（公开）
router.post('/forgot-password/send-code', userController.sendResetCode);

/**
 * @openapi
 * /user/forgot-password/reset:
 *   post:
 *     tags: [用户管理]
 *     summary: 忘记密码-通过验证码重置密码
 *     description: 使用邮箱收到的验证码设置新密码。公开接口。
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code, password]
 *             properties:
 *               email: { type: string, format: email, example: 'admin@nexsm.com' }
 *               code: { type: string, description: 邮箱验证码, example: '123456' }
 *               password: { type: string, minLength: 6, example: 'newpass123' }
 *           example:
 *             email: 'admin@nexsm.com'
 *             code: '123456'
 *             password: 'newpass123'
 *     responses:
 *       200:
 *         description: 重置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       400: { description: 验证码错误或过期, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 */
// 忘记密码-重置密码（公开）
router.post('/forgot-password/reset', userController.resetPasswordByCode);

// 需要登录的接口
router.use(requireAuth);

/**
 * @openapi
 * /user/info:
 *   get:
 *     tags: [用户管理]
 *     summary: 获取当前登录用户信息
 *     description: 返回当前 token 对应用户资料、角色与权限。
 *     responses:
 *       200:
 *         description: 当前用户信息
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/User' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 获取当前登录用户信息（所有登录用户可访问）
router.get('/info', userController.getCurrentUser);

// ==================== 设备管理路由（所有登录用户可访问） ====================
// 注意：必须放在 /:id 通配符路由之前，否则会被错误匹配

/**
 * @openapi
 * /user/device/count:
 *   get:
 *     tags: [用户管理]
 *     summary: 获取系统在线设备总数
 *     responses:
 *       200:
 *         description: 在线设备数
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         count: { type: integer, example: 3 }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 获取系统在线设备总数（所有登录用户可访问）
router.get('/device/count', userDeviceController.getOnlineCount);

/**
 * @openapi
 * /user/device/my:
 *   get:
 *     tags: [用户管理]
 *     summary: 查询当前用户的在线设备列表
 *     responses:
 *       200:
 *         description: 当前用户在线设备列表
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
 *                           id: { type: integer, example: 1 }
 *                           deviceId: { type: string, example: 'pc-001' }
 *                           deviceName: { type: string, example: 'Chrome on Windows' }
 *                           loginTime: { type: string, format: 'date-time' }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 */
// 查询当前用户的在线设备列表（所有登录用户可访问）
router.get('/device/my', userDeviceController.getMyDevices);

// 用户管理CRUD（仅管理员可访问）
router.use(requireRole(USER_ROLE.ADMINISTRATOR));

/**
 * @openapi
 * /user:
 *   get:
 *     tags: [用户管理]
 *     summary: 分页查询用户列表（管理员）
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10, maximum: 100 }
 *         description: 每页条数
 *       - in: query
 *         name: username
 *         schema: { type: string }
 *         description: 用户名模糊搜索
 *       - in: query
 *         name: status
 *         schema: { type: integer, enum: [0, 1] }
 *         description: 状态筛选
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *         description: 角色编码筛选
 *     responses:
 *       200:
 *         description: 分页用户列表
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
 *                             list: { type: array, items: { $ref: '#/components/schemas/User' } }
 *       401: { description: 未登录, content: { application/json: { schema: { $ref: '#/components/schemas/Unauthorized' } } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 用户列表
router.get('/', validate(queryUserListSchema, 'query'), userController.getUserList);

/**
 * @openapi
 * /user/device:
 *   get:
 *     tags: [用户管理]
 *     summary: 获取所有用户在线设备（管理员）
 *     responses:
 *       200:
 *         description: 全量在线设备列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { type: array, items: { type: object } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 设备管理接口（仅管理员可访问）
// 注意：/device 必须放在 /:id 之前，否则会被通配符匹配
router.get('/device', userDeviceController.getAllDevices);

/**
 * @openapi
 * /user/device/refresh-status:
 *   post:
 *     tags: [用户管理]
 *     summary: 刷新设备在线状态（管理员）
 *     responses:
 *       200:
 *         description: 刷新完成
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.post('/device/refresh-status', userDeviceController.refreshDeviceStatus);

/**
 * @openapi
 * /user/device/{id}/kick:
 *   post:
 *     tags: [用户管理]
 *     summary: 踢下线指定设备会话（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 设备记录ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 *       404: { description: 设备不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
router.post('/device/:id/kick', validate(idParamSchema, 'params'), userDeviceController.kickDevice);

/**
 * @openapi
 * /user/device/{id}:
 *   delete:
 *     tags: [用户管理]
 *     summary: 删除设备记录（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 设备记录ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.delete('/device/:id', validate(idParamSchema, 'params'), userDeviceController.deleteDevice);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags: [用户管理]
 *     summary: 获取用户详情（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户详情
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/User' }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 *       404: { description: 用户不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
// 用户详情及其他操作
router.get('/:id', validate(idParamSchema, 'params'), userController.getUserDetail);

/**
 * @openapi
 * /user:
 *   post:
 *     tags: [用户管理]
 *     summary: 新增用户（管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, minLength: 2, maxLength: 50 }
 *               password: { type: string, minLength: 6, maxLength: 32 }
 *               role: { type: string, example: 'operator' }
 *               real_name: { type: string }
 *               sex: { type: integer, enum: [0, 1, 2] }
 *               phone: { type: string }
 *               email: { type: string, format: email }
 *               dept_id: { type: integer }
 *               remark: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *           example:
 *             username: 'zhangsan'
 *             password: '123456'
 *             real_name: '张三'
 *             role: 'operator'
 *             phone: '13800000000'
 *             email: 'zhangsan@nexsm.com'
 *             status: 1
 *     responses:
 *       200:
 *         description: 创建成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       400: { description: 参数错误/用户名已存在, content: { application/json: { schema: { $ref: '#/components/schemas/BadRequest' } } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.post('/', validate(createUserSchema, 'body'), userController.createUser);

/**
 * @openapi
 * /user/{id}:
 *   put:
 *     tags: [用户管理]
 *     summary: 更新用户（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 所有字段可选，至少传一个
 *             properties:
 *               username: { type: string, minLength: 2, maxLength: 50 }
 *               password: { type: string, minLength: 6, maxLength: 32 }
 *               role: { type: string }
 *               real_name: { type: string }
 *               sex: { type: integer, enum: [0, 1, 2] }
 *               phone: { type: string }
 *               email: { type: string, format: email }
 *               dept_id: { type: integer }
 *               remark: { type: string }
 *               status: { type: integer, enum: [0, 1] }
 *           example: { real_name: '张三丰', phone: '13900000000' }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 *       404: { description: 用户不存在, content: { application/json: { schema: { $ref: '#/components/schemas/NotFound' } } } }
 */
router.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema, 'body'), userController.updateUser);

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags: [用户管理]
 *     summary: 删除用户（管理员，软删除）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.delete('/:id', validate(idParamSchema, 'params'), userController.deleteUser);

/**
 * @openapi
 * /user/batch:
 *   delete:
 *     tags: [用户管理]
 *     summary: 批量删除用户（管理员）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: integer }, minItems: 1 }
 *           example: { ids: [2, 3, 4] }
 *     responses:
 *       200:
 *         description: 批量删除成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.delete('/batch', validate(batchDeleteSchema, 'body'), userController.batchDeleteUsers);

/**
 * @openapi
 * /user/{id}/status:
 *   patch:
 *     tags: [用户管理]
 *     summary: 启用/禁用用户（管理员）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: integer, enum: [0, 1], description: '1启用 0禁用' }
 *           example: { status: 0 }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateStatusSchema, 'body'), userController.updateUserStatus);

/**
 * @openapi
 * /user/{id}/reset-password:
 *   post:
 *     tags: [用户管理]
 *     summary: 管理员重置用户密码
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 用户ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password: { type: string, minLength: 6, example: 'newpass123' }
 *           example: { password: 'newpass123' }
 *     responses:
 *       200:
 *         description: 重置成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 管理员重置用户密码
router.post('/:id/reset-password', userController.resetPassword);

/**
 * @openapi
 * /user/{id}/unlock:
 *   post:
 *     tags: [用户管理]
 *     summary: 管理员解锁用户（解除登录锁定）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 解锁成功
 *         content: { application/json: { schema: { $ref: '#/components/schemas/ApiResponse' } } }
 *       403: { description: 非管理员, content: { application/json: { schema: { $ref: '#/components/schemas/Forbidden' } } } }
 */
// 管理员解锁用户
router.post('/:id/unlock', validate(idParamSchema, 'params'), userController.unlockUser);

module.exports = router;
