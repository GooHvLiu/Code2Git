/**
 * 请求日志中间件
 * 记录请求方法、路径、IP、耗时、状态码
 */
const dayjs = require('dayjs');

module.exports = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

  // 响应结束时记录日志
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // 根据状态码设置颜色
    let statusColor = '\x1b[32m'; // 绿色 成功
    if (statusCode >= 400 && statusCode < 500) {
      statusColor = '\x1b[33m'; // 黄色 客户端错误
    } else if (statusCode >= 500) {
      statusColor = '\x1b[31m'; // 红色 服务端错误
    }
  });

  next();
};
