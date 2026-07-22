module.exports = function (err, req, res, next) {
  // Mongoose 字段校验失败
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({
      code: 400,
      msg: messages.join("，"),
      data: null,
    });
  }

  // 唯一索引重复（用户名/邮箱重复）
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      code: 400,
      msg: `${key === "username" ? "用户名" : "邮箱"}已被占用`,
      data: null,
    });
  }

  // 通用服务异常
  return res.status(500).json({
    code: 500,
    msg: "服务器异常",
    data: err.message,
  });
};
