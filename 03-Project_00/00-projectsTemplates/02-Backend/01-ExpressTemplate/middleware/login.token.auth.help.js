/**
 * Token 登录鉴权中间件类
 * @class CheckTokenAuth
 * @description JWT Token 全局鉴权校验，适配Vue SPA单页项目，统一JSON返回、日志埋点、环境变量驱动
 * @author MyAccounts Backend
 */
const jwt = require("jsonwebtoken");

class CheckTokenAuth {
  // 业务配置抽离，统一管理路由、状态码、提示文案
  static UNAUTH_CODE = Number(process.env.UNAUTH_CODE) || 401;
  static UNAUTH_MSG = process.env.UNAUTH_MSG || "登录凭证失效，请重新登录";
  static JWT_SECRET = process.env.JWT_SECRET || "nexCM-dev-secret-key-2026";
  // Token 请求头标识
  static AUTH_HEADER_KEY = process.env.JWT_AUTH_HEADER_KEY || "authorization";
  static AUTH_PREFIX = process.env.JWT_AUTH_PREFIX || "Bearer ";

  /**
   * Token 鉴权中间件主函数
   * @param {import('express').Request} req 请求对象
   * @param {import('express').Response} res 响应对象
   * @param {import('express').NextFunction} next 放行函数
   * @returns {void}
   */
  checkTokenAuth(req, res, next) {
    
    try {
      // 白名单放行登录、验证码接口，从.env读取白名单字符串，切割为数组
      const whiteListStr = process.env.TOKEN_WHITE_LIST || "";
      const whiteList = whiteListStr
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      // 去除url查询参数，只匹配路径
      const purePath = req.originalUrl.split("?")[0];
      if (whiteList.includes(purePath)) {
        return next();
      }

      // 1. 获取 Authorization 请求头
      const authHeader = req.headers[CheckTokenAuth.AUTH_HEADER_KEY];
      if (!authHeader || !authHeader.startsWith(CheckTokenAuth.AUTH_PREFIX)) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - 未携带有效Token头`
        );
        return this._handleUnauthorized(req, res);
      }

      // 2. 截取 Bearer 后面真实token
      const token = authHeader.slice(CheckTokenAuth.AUTH_PREFIX.length).trim();
      if (!token) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - Token为空`
        );
        return this._handleUnauthorized(req, res);
      }

      // 3. 校验解析JWT
      const payload = jwt.verify(token, CheckTokenAuth.JWT_SECRET);
      // 挂载解析后的用户信息，后续接口直接使用 req.tokenUser
      
      req.tokenUser = payload;

      return next();
    } catch (error) {
      // 细分错误类型打印日志
      let logMsg = "";
      if (error.name === "TokenExpiredError") {
        logMsg = "Token已过期";
      } else if (error.name === "JsonWebTokenError") {
        logMsg = "Token签名非法/被篡改";
      } else if (error.name === "NotBeforeError") {
        logMsg = "Token尚未生效";
      } else {
        logMsg = `Token校验异常: ${error.message}`;
      }
      console.error(
        `[Token鉴权异常] ${req.method} ${req.originalUrl} - ${logMsg}`
      );
      return this._handleUnauthorized(req, res);
    }
  }

  /**
   * 统一未授权返回
   * @private
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  _handleUnauthorized(req, res) {
    // SPA单页应用：全部统一返回标准JSON，前端axios拦截器捕获401跳转登录
    return res.json({
      code: CheckTokenAuth.UNAUTH_CODE,
      msg: CheckTokenAuth.UNAUTH_MSG,
      data: null
    });
  }
}

// 单例实例
const tokenAuthInstance = new CheckTokenAuth();
// 绑定this，防止中间件调用丢失上下文
tokenAuthInstance.checkTokenAuth = tokenAuthInstance.checkTokenAuth.bind(tokenAuthInstance);

module.exports = tokenAuthInstance;