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
  console.error("【全局捕获异常】", err);

  // 如果响应头已经下发，不要再重复返回内容，防止报错
  if (res.headersSent) {
    return next(err);
  }

  // 404 单独业务码区分
  if (err.status === 404) {
    return res.json({
      code: 404,
      msg: "接口地址不存在",
      data: null
    });
  }

  return res.json({
    code: 500,
    msg: err.message || "服务器内部错误",
    data: process.env.NODE_ENV === "development" ? err.stack : null
  });
}

module.exports = errorHandler;
