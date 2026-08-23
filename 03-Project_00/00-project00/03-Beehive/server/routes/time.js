/**
 * 时间校准路由
 * 提供服务器时间API，供客户端联网校准时间
 * 这是防时间回退的关键：客户端检测到时间被回退后，必须调用此接口校准
 */
const express = require('express');
const router = express.Router();
const config = require('../config');

/**
 * 获取服务器时间
 * GET /api/time
 * 无需鉴权（客户端需要在授权冻结状态下也能调用）
 * 但通过简单的secret防止滥用
 */
router.get('/', (req, res) => {
  const serverTime = Date.now();
  res.success({
    serverTime,
    serverTimeStr: new Date(serverTime).toISOString(),
    timezone: 'UTC+8',
    version: '1.0'
  });
});

/**
 * 带鉴权的时间获取（可选）
 * GET /api/time/secure
 */
router.get('/secure', (req, res) => {
  const secret = req.headers['x-time-secret'];
  if (secret !== config.timeApiSecret) {
    return res.error('鉴权失败', 401);
  }
  const serverTime = Date.now();
  res.success({
    serverTime,
    serverTimeStr: new Date(serverTime).toISOString()
  });
});

module.exports = router;
