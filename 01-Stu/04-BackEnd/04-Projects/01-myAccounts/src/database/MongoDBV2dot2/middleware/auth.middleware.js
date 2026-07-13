const jwt = require("jsonwebtoken");
const { fail } = require("@MongoDB/utils/response.js");
const userService = require("@MongoDB/services/users.service.js");

const authMiddleware = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return fail(res, "未登录，请先登录", 401);

    // 解析token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findById(decode.userId);
    if (!user) return fail(res, "用户不存在", 401);

    // 挂载用户到请求对象，全局控制器可直接使用
    req.user = user;
    next();
  } catch (err) {
    return fail(res, "token失效，请重新登录", 401);
  }
};

// 管理员权限校验
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return fail(res, "无管理员权限", 403);
  }
  next();
};

module.exports = { authMiddleware, adminAuth };
