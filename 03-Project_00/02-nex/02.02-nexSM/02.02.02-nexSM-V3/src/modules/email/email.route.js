/**
 * 邮箱配置路由
 */
const express = require('express');
const router = express.Router();
const emailController = require('./email.controller');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');

// 所有接口需要登录
router.use(requireAuth);

// 获取支持的服务商列表
router.get('/providers', emailController.getProviders);

// 获取所有启用的配置（下拉选择用）
router.get('/all', emailController.getAllEnabled);

// 获取配置列表（分页）
router.get('/list', emailController.getList);

// 获取发送日志列表（分页）- 必须放在 /:id 前面
router.get('/log/list', emailController.getLogList);

// 获取单个配置详情
router.get('/:id', emailController.getDetail);

// 以下接口需要管理员权限
router.use(requireRole('administrator'));

// 新增配置
router.post('/', emailController.create);

// 更新配置
router.put('/:id', emailController.update);

// 删除配置
router.delete('/:id', emailController.delete);

// 设为默认
router.put('/:id/default', emailController.setDefault);

// 启用/禁用
router.put('/:id/status', emailController.updateStatus);

// 发送测试邮件
router.post('/test', emailController.sendTestEmail);

// 验证SMTP连接
router.post('/verify', emailController.verifyConnection);

// 获取日志详情
router.get('/log/:id', emailController.getLogDetail);

// 删除日志
router.delete('/log/:id', emailController.deleteLog);

// 批量删除日志
router.post('/log/batch-delete', emailController.batchDeleteLogs);

module.exports = router;
