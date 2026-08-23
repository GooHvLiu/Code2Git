/**
 * 统一响应格式中间件
 */
module.exports = (req, res, next) => {
  res.success = (data = null, msg = '操作成功', code = 200) => {
    res.json({ code, msg, data, timestamp: Date.now() });
  };
  res.error = (msg = '操作失败', code = 400, data = null) => {
    res.json({ code, msg, data, timestamp: Date.now() });
  };
  next();
};
