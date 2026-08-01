/**
 * 用户模块 - 路由层
 */
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const CaptchaService = require('../captcha/captcha.controller.js');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');
const { USER_ROLE } = require('../../constants/statusCode');

// 登录接口，公开接口
router.post('/login', CaptchaService.verifyCaptcha, userController.login);

// 需要登录的接口
router.use(requireAuth);

// 获取当前登录用户信息
router.get('/info', userController.getCurrentUser);

/* // 管理员权限接口
router.use(requireRole(USER_ROLE.ADMIN));

// 用户管理CRUD（RESTful风格）
router.get('/', userController.getUserList);
router.get('/:id', userController.getUserDetail);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.delete('/batch', userController.batchDeleteUsers);
router.patch('/:id/status', userController.updateUserStatus);
 */
module.exports = router;
