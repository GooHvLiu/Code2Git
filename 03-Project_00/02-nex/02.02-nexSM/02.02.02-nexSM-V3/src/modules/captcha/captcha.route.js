/**
 * 验证码模块 - 路由
 * 作者: GooHv
 */
const express = require('express');
const router = express.Router();
const CaptchaController = require('./captcha.controller')

/**
 * @openapi
 * /captcha/captcha-image:
 *   get:
 *     tags: [验证码]
 *     summary: 生成图形验证码
 *     description: 返回 SVG/Base64 图形验证码图片与 uuid，登录或注册时随请求一并提交。
 *     security: []
 *     responses:
 *       200:
 *         description: 验证码图片
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
 *                         uuid: { type: string, example: 'a1b2c3d4' }
 *                         img: { type: string, description: 'Base64/SVG 图片字符串' }
 *                         expire: { type: integer, example: 120 }
 */
// 路由 验证码 获取
router.get("/captcha-image", CaptchaController.generateCaptcha);

module.exports = router;
