/**
 * 全局统一异常处理中间件
 * 适配前后端分离接口项目，统一返回JSON格式
 */

/**
 * @param {Error} err 错误对象
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function errorHandler(err, req, res, next) {
  console.error("【全局捕获异常】", "异常码：", err.code, "异常信息：", err.msg);

  // 如果响应头已经下发，不要再重复返回内容，防止报错
  if (res.headersSent) {
    return next(err);
  }
  return res.json({
    code: err.code,
    msg: err.msg || "服务器内部错误",
  });
}

module.exports = errorHandler;
