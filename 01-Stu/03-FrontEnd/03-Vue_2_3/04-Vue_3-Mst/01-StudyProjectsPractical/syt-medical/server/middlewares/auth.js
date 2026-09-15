/**
 * 简单的 Token 认证中间件（Mock 用，无 JWT）
 * 前端登录成功后会拿到 token，存在 localStorage
 * 后续请求通过 request.getToken() 放在 header 的 token 字段
 */

const { users } = require("../data/users");

// 内存中保存 token -> userId 映射
const tokenStore = new Map();

function generateToken(userId) {
  const token = `mock_token_${userId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  tokenStore.set(token, userId);
  return token;
}

function auth(req, res, next) {
  const token = req.headers.token || req.query.token;
  if (!token) {
    return res.json({ code: 208, message: "未登录", ok: false, data: null });
  }
  const userId = tokenStore.get(token);
  if (!userId) {
    return res.json({ code: 208, message: "登录已过期，请重新登录", ok: false, data: null });
  }
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.json({ code: 208, message: "用户不存在", ok: false, data: null });
  }
  req.userId = userId;
  req.currentUser = user;
  next();
}

module.exports = { auth, generateToken, tokenStore };
