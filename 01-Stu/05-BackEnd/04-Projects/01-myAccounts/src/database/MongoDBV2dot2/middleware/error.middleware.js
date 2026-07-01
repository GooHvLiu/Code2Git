const { fail } = require("@MongoDB/utils/response.js");

const errorHandler = (err, req, res, next) => {
  console.error("全局错误：", err);
  // mongo唯一键冲突
  if (err.code === 11000) {
    return fail(res, "数据重复，用户名/邮箱已存在", 400);
  }
  return fail(res, err.message || "服务器异常", 500);
};

module.exports = errorHandler;
