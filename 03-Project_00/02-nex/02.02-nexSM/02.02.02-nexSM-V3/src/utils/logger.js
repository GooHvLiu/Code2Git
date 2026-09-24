/**
 * ============================================================
 * 结构化日志模块（winston 封装）
 * ------------------------------------------------------------
 * 功能描述：
 *   - 基于 winston 提供统一的日志实例，替代散落各处的 console.log。
 *   - 开发环境：控制台输出彩色可读日志，格式 `${timestamp} [${level}] ${message}`。
 *   - 生产环境：以 JSON 格式写入文件，便于后续日志采集（ELK/Loki 等）。
 *       · logs/error.log    仅 error 级别
 *       · logs/combined.log  全部级别
 *   - 日志级别：开发环境 debug，生产环境 info。
 * 导出：logger.info / logger.debug / logger.warn / logger.error
 * ------------------------------------------------------------
 * 作者：GooHv
 * 创建日期：2026-09-24
 * ============================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');

// 确保日志目录存在（logs/）
const LOG_DIR = path.join(__dirname, '../../logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const isProduction = process.env.NODE_ENV === 'production';

// 控制台格式：开发环境彩色、易读；生产环境控制台也输出 JSON（便于容器采集）
const consoleFormat = isProduction
  ? winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  : winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}] ${message}`;
      })
    );

// 文件格式：统一 JSON（含时间、级别、堆栈），不做颜色处理
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({ format: consoleFormat })
];

// 文件输出：始终写入（开发/生产均落盘，便于排查与采集）
// error.log 仅记录 error 级别；combined.log 记录全部级别
transports.push(
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 单文件 10MB
    maxFiles: 10
  }),
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'combined.log'),
    format: fileFormat,
    maxsize: 10 * 1024 * 1024,
    maxFiles: 10
  })
);

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  // 忽略特定过于嘈杂的日志（按需扩展）
  transports
});

module.exports = logger;
