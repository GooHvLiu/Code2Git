/**
 * JWT 鉴权中间件
 * 验证token有效性，解析用户信息挂载到 req.user
 * 支持单点登录：验证 token_version，旧 token 自动失效
 */
const { verifyToken } = require('../utils/jwt');
const { ERROR_CODE } = require('../constants/errorCode');
const userModel = require('../modules/user/user.model');
const cache = require('../utils/cache');
const { checkIsSuperAdmin } = require('../utils/roleContext');

// Token 版本号缓存前缀和过期时间（5分钟）
const TOKEN_VERSION_CACHE_PREFIX = 'token_version:';
const TOKEN_VERSION_CACHE_TTL = 5 * 60;

/**
 * 获取用户的 Token 版本号（带缓存）
 * @param {number} userId - 用户ID
 * @returns {Promise<number>} Token 版本号
 */
async function getUserTokenVersion(userId) {
  const cacheKey = TOKEN_VERSION_CACHE_PREFIX + userId;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }
  const version = await userModel.getTokenVersion(userId);
  cache.set(cacheKey, version, TOKEN_VERSION_CACHE_TTL);
  return version;
}

/**
 * 必须登录鉴权
 */
async function requireAuth(req, res, next) {

  const authHeader = req.headers.authorization;

  // 没有登陆，请先登录
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.error(ERROR_CODE.UNAUTHORIZED);
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  // 当前token无效
  if (!decoded) {
    return res.error(ERROR_CODE.TOKEN_INVALID);
  }

  // 检查是否过期（verifyToken 内部已处理，这里双重保险）
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return res.error(ERROR_CODE.TOKEN_EXPIRED);
  }

  // 单点登录：验证 token_version，旧 token 自动失效
  if (decoded.token_version !== undefined) {
    try {
      const currentVersion = await getUserTokenVersion(decoded.id);
      if (decoded.token_version !== currentVersion) {
        // Token 版本号不一致，说明已在其他设备登录，当前 token 已失效
        return res.error(ERROR_CODE.TOKEN_KICKED_OUT);
      }
    } catch (err) {
      console.error('[鉴权] 验证 token_version 失败:', err.message);
      // 验证失败不拦截，避免数据库故障导致无法使用
    }
  }

  // 挂载用户信息到请求对象
  req.user = decoded;
  next();
}

/**
 * 可选鉴权
 * 有token尝试解析、校验过期；无token直接放行
 * 解析失败 / 过期 → 不挂载 req.user
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    // 双重条件：解析成功 + 未过期
    if (decoded && !(decoded.exp && Date.now() >= decoded.exp * 1000)) {
      req.user = decoded;
    }
  }

  next();
}

/**
 * 角色权限校验
 * 数据库中 is_super_admin=1 的角色自动通过所有角色校验（不硬编码角色编码）
 * @param  {...string} roles 允许的角色编码列表
 */
function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.error(ERROR_CODE.PERMISSION_DENIED);
      }
      // 数据库标记为超级管理员的角色自动通过所有角色校验
      if (await checkIsSuperAdmin(req.user)) {
        return next();
      }
      if (!roles.includes(req.user.role)) {
        return res.error(ERROR_CODE.PERMISSION_DENIED);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole
};
