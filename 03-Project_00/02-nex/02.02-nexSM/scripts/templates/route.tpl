/**
 * {{name}} 模块 - 路由层
 * 自动生成，根据业务需求调整权限和路由
 */
const express = require('express');
const router = express.Router();
const {{name}}Controller = require('./{{name}}.controller');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');
const { USER_ROLE } = require('../../constants/statusCode');

// ==================== 需要登录的接口 ====================
router.use(requireAuth);

// 基础CRUD（RESTful风格）
router.get('/', {{name}}Controller.getList);
router.get('/:id', {{name}}Controller.getDetail);
router.post('/', {{name}}Controller.create);
router.put('/:id', {{name}}Controller.update);
router.delete('/:id', {{name}}Controller.delete);
router.delete('/batch', {{name}}Controller.batchDelete);

// ==================== 管理员权限接口 ====================
// router.use(requireRole(USER_ROLE.ADMIN));

// ==================== 自定义路由 ====================
// 在此处添加 {{name}} 模块专属路由

module.exports = router;
