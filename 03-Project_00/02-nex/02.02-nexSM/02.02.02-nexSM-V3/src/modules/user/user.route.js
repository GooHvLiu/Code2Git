/**
 * 用户模块 - 路由层
 */
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const userDeviceController = require('./userDevice.controller');
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

// token验证有效性接口，公开接口
router.get('/tokenvalid', optionalAuth, (req, res) => {
  /**
   * req.user 存在 = token合法、未过期
   * req.user undefined = 无token / token篡改 / token过期
   */
  res.success({ valid: !!req.user });
});

// 登录接口（公开）
router.post('/login', validate(loginSchema, 'body'), userController.login);

// 注册接口（公开）
router.post('/register', validate(registerSchema, 'body'), userController.register);

// 需要登录的接口
router.use(requireAuth);

// 获取当前登录用户信息（所有登录用户可访问）
router.get('/info', userController.getCurrentUser);

// ==================== 设备管理路由（所有登录用户可访问） ====================
// 注意：必须放在 /:id 通配符路由之前，否则会被错误匹配

// 获取系统在线设备总数（所有登录用户可访问）
router.get('/device/count', userDeviceController.getOnlineCount);

// 查询当前用户的在线设备列表（所有登录用户可访问）
router.get('/device/my', userDeviceController.getMyDevices);

// 用户管理CRUD（仅管理员可访问）
router.use(requireRole(USER_ROLE.ADMINISTRATOR));

// 用户列表
router.get('/', validate(queryUserListSchema, 'query'), userController.getUserList);

// 设备管理接口（仅管理员可访问）
// 注意：/device 必须放在 /:id 之前，否则会被通配符匹配
router.get('/device', userDeviceController.getAllDevices);
router.post('/device/refresh-status', userDeviceController.refreshDeviceStatus);
router.post('/device/:id/kick', validate(idParamSchema, 'params'), userDeviceController.kickDevice);
router.delete('/device/:id', validate(idParamSchema, 'params'), userDeviceController.deleteDevice);

// 用户详情及其他操作
router.get('/:id', validate(idParamSchema, 'params'), userController.getUserDetail);
router.post('/', validate(createUserSchema, 'body'), userController.createUser);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema, 'body'), userController.updateUser);
router.delete('/:id', validate(idParamSchema, 'params'), userController.deleteUser);
router.delete('/batch', validate(batchDeleteSchema, 'body'), userController.batchDeleteUsers);
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateStatusSchema, 'body'), userController.updateUserStatus);

module.exports = router;
