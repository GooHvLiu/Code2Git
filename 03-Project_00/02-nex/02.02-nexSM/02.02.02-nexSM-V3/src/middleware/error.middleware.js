/**
 * 全局错误处理中间件
 * 捕获所有异常，统一返回格式
 * 必须放在所有路由之后注册
 */
const { ERROR_CODE, ERROR_MESSAGE } = require('../constants/errorCode');

// 业务错误类
class BusinessError extends Error {
  /**
   * 构造函数
   * @param {string|number} code - 错误码
   * @param {string} message - 错误消息（调试用，中文）
   * @param {Object|null} data - 动态参数（前端国际化填充模板用）
   */
  constructor(code, message, data = null) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.data = data;
  }
}

/**
 * 全局错误处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.url}`, err.message);

  // 业务错误
  if (err instanceof BusinessError) {
    return res.json({
      code: err.code,
      msg: err.message,
      data: err.data,
      timestamp: Date.now()
    });
  }

  // 参数校验错误（express-validator等）
  if (err.name === 'ValidationError') {
    return res.json({
      code: ERROR_CODE.PARAM_ERROR,
      msg: err.message,
      data: null,
      timestamp: Date.now()
    });
  }

  // 数据库错误
  if (err.code && err.code.startsWith('ER_')) {
    console.error('数据库错误详情:', err);
    return res.json({
      code: ERROR_CODE.DATABASE_ERROR,
      msg: ERROR_MESSAGE[ERROR_CODE.DATABASE_ERROR],
      data: null,
      timestamp: Date.now()
    });
  }

  // 语法错误、类型错误等
  if (err instanceof SyntaxError || err instanceof TypeError) {
    console.error('代码错误详情:', err.stack);
    return res.json({
      code: ERROR_CODE.SYSTEM_ERROR,
      msg: ERROR_MESSAGE[ERROR_CODE.SYSTEM_ERROR],
      data: null,
      timestamp: Date.now()
    });
  }

  // 未知错误
  console.error('未知错误详情:', err.stack);
  return res.json({
    code: ERROR_CODE.UNKNOWN_ERROR,
    msg: ERROR_MESSAGE[ERROR_CODE.UNKNOWN_ERROR],
    data: null,
    timestamp: Date.now()
  });
}

/**
 * 404 处理中间件
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    code: ERROR_CODE.NOT_FOUND,
    msg: ERROR_MESSAGE[ERROR_CODE.NOT_FOUND],
    data: null,
    timestamp: Date.now()
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
  BusinessError
};
