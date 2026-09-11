const express = require('express');
const router = express.Router();
const CaptchaController = require('./captcha.controller')

// 路由 验证码 获取
router.get("/captcha-image", CaptchaController.generateCaptcha);

module.exports = router;