/**
 * ============================================================
 * 请求日志中间件
 * ------------------------------------------------------------
 * 功能描述：记录每个 HTTP 请求的方法、URL、状态码、响应耗时(ms)、客户端 IP。
 *           请求结束时（res 'finish' 事件）以结构化字段写入 winston，
 *           生产环境为 JSON，便于后续日志采集与分析。
 * ------------------------------------------------------------
 * 作者：GooHv
 * 创建日期：2026-09-24
 * ============================================================
 */

'use strict';

const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // 响应结束时记录日志（不阻断请求）
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // 结构化字段，日志级别按状态码区分
    const logMeta = {
      method,
      url: originalUrl,
      status: statusCode,
      responseTime: duration,
      ip
    };

    if (statusCode >= 500) {
      logger.error('HTTP ' + method + ' ' + originalUrl, logMeta);
    } else if (statusCode >= 400) {
      logger.warn('HTTP ' + method + ' ' + originalUrl, logMeta);
    } else {
      logger.info('HTTP ' + method + ' ' + originalUrl, logMeta);
    }
  });

  next();
};
