/**
 * 用户模块 - 路由层
 */
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { requireAuth, optionalAuth } = require('../../middleware/auth.middleware');
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

// 获取当前登录用户信息
router.get('/info', userController.getCurrentUser);

// 用户管理CRUD（RESTful风格）
router.get('/', validate(queryUserListSchema, 'query'), userController.getUserList);
router.get('/:id', validate(idParamSchema, 'params'), userController.getUserDetail);
router.post('/', validate(createUserSchema, 'body'), userController.createUser);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema, 'body'), userController.updateUser);
router.delete('/:id', validate(idParamSchema, 'params'), userController.deleteUser);
router.delete('/batch', validate(batchDeleteSchema, 'body'), userController.batchDeleteUsers);
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateStatusSchema, 'body'), userController.updateUserStatus);

module.exports = router;
