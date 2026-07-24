/**
 * 全局异常捕获中间件
 */
function errorHandler(err, req, res, next) {
  console.error("全局错误捕获：", err.message);
  res.json({
    code: 500,
    msg: err.message || "服务器内部错误",
    data: null
  });
}

module.exports = errorHandler;
