const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 全局接口鉴权中间件
 * 校验请求头 Authorization: Bearer xxx Token
 * 未登录/过期直接返回401，校验通过挂载用户信息到req.user
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.json({
      code: 401,
      msg: "未登录，请先登录",
      data: null
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.json({
      code: 401,
      msg: "token失效，请重新登录",
      data: null
    });
  }
}

module.exports = authMiddleware;
