/**
 * JWT 鉴权中间件
 * 验证token有效性，解析用户信息挂载到 req.user
 */
const { verifyToken } = require('../utils/jwt');
const { ERROR_CODE } = require('../constants/errorCode');

/**
 * 必须登录鉴权
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.error(ERROR_CODE.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.error(ERROR_CODE.TOKEN_INVALID);
  }

  // 检查是否过期（verifyToken 内部已处理，这里双重保险）
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return res.error(ERROR_CODE.TOKEN_EXPIRED);
  }

  // 挂载用户信息到请求对象
  req.user = decoded;
  next();
}

/**
 * 可选鉴权（有token就解析，没有也放行）
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}

/**
 * 角色权限校验
 * @param  {...number} roles 允许的角色列表
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.error(ERROR_CODE.PERMISSION_DENIED);
    }
    next();
  };
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole
};
