/**
 * ============================================================
 * 接口限流中间件（express-rate-limit）
 * ------------------------------------------------------------
 * 功能描述：
 *   - generalLimiter  通用限流：15 分钟窗口，单 IP 最多 1000 次请求（宽松，不影响正常使用）。
 *   - strictLimiter    严格限流：15 分钟窗口，单 IP 最多 10 次请求，
 *                      用于登录 / 注册 / 忘记密码 / 验证码等敏感接口，防暴力破解。
 *   - 触发限流时统一返回 { code: 429, msg: '请求过于频繁，请稍后再试' }。
 * 挂载位置（见 app.js）：
 *   - generalLimiter 挂载在所有路由之前。
 *   - strictLimiter  挂载在 /prod-api/v2/user/login、/register、/forgot-password/*、
 *                    /prod-api/v2/captcha/* 等敏感路径之前；/api-docs 不受严格限流影响。
 * ------------------------------------------------------------
 * 作者：GooHv
 * 创建日期：2026-09-24
 * ============================================================
 */

'use strict';

const rateLimit = require('express-rate-limit');

// 触发限流时的统一响应
function tooManyHandler(req, res) {
  res.status(429).json({
    code: 429,
    msg: '请求过于频繁，请稍后再试',
    data: null,
    timestamp: Date.now()
  });
}

/**
 * 通用限流：15 分钟 / 1000 次
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooManyHandler
});

/**
 * 严格限流：15 分钟 / 10 次（敏感接口）
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooManyHandler
});

module.exports = { generalLimiter, strictLimiter };
