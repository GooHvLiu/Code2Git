const express = require('express');
const router = express.Router();
const CustomerController = require('./customer.controller.js');
const { requireAuth } = require('../../middleware/auth.middleware.js');

// 需要登录的接口
router.use(requireAuth);

// 需要鉴权 获取客户全部数据
router.get('/', CustomerController.getUserList);


/* 
// 用户管理CRUD（RESTful风格）
router.get('/', CustomerController.getUserList);
router.get('/:id', CustomerController.getUserDetail);
router.post('/', CustomerController.createUser);
router.put('/:id', CustomerController.updateUser);
router.delete('/:id', CustomerController.deleteUser);
router.delete('/batch', CustomerController.batchDeleteUsers);
router.patch('/:id/status', CustomerController.updateUserStatus);
 */

module.exports = router;
