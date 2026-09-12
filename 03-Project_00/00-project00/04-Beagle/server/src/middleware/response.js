/**
 * 统一响应中间件
 * 给 res 挂载 success / error 方法
 */
function responseMiddleware(req, res, next) {
  res.success = function(data = null, message = 'success') {
    res.json({
      code: 200,
      message,
      data
    });
  };

  res.error = function(message = 'error', code = 500, data = null) {
    res.status(code).json({
      code,
      message,
      data
    });
  };

  next();
}

module.exports = responseMiddleware;
