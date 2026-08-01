const express = require('express');
const router = express.Router();
const menuController = require('./menu.controller');
const { requireAuth } = require('../../middleware/auth.middleware');

// 需要登录的接口
router.use(requireAuth);

// 获取登录用户的菜单路由
router.get('/getRouters', menuController.getRouters);

module.exports = router;