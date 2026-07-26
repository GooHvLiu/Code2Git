/**
 * Token 登录鉴权中间件类
 * @class CheckTokenAuth
 * @description JWT Token 全局鉴权校验，适配Vue SPA单页项目，统一JSON返回、日志埋点、环境变量驱动
 * @author 
 */
const jwt = require("jsonwebtoken");

class CheckTokenAuth {
  constructor() {
    // 构造函数：初始化一次性读取环境变量，缓存配置，避免每次请求重复读取
    this.UNAUTH_CODE = Number(process.env.UNAUTH_CODE) || 401;
    this.UNAUTH_MSG = process.env.UNAUTH_MSG || "登录凭证失效，请重新登录";
    this.JWT_SECRET = process.env.JWT_SECRET || "nexCM-dev-secret-key-2026";
    this.AUTH_HEADER_KEY = process.env.JWT_AUTH_HEADER_KEY || "authorization";
    this.AUTH_PREFIX = process.env.JWT_AUTH_PREFIX || "Bearer ";
    // 解析白名单
    const whiteListStr = process.env.TOKEN_WHITE_LIST || "";
    this.whiteList = whiteListStr
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  /**
   * Token 鉴权中间件主函数
   * @param {import('express').Request} req 请求对象
   * @param {import('express').Response} res 响应对象
   * @param {import('express').NextFunction} next 放行函数
   * @returns {void}
   */
  checkTokenAuth(req, res, next) {
    try {
      // 去除url查询参数，只匹配路径
      const purePath = req.originalUrl.split("?")[0];

      // 放行OPTIONS跨域预检请求
      if (req.method.toUpperCase() === "OPTIONS") {
        return next();
      }

      // 白名单路径直接放行
      if (this.whiteList.includes(purePath)) {
        return next();
      }

      // 1. 获取 Authorization 请求头
      const authHeader = req.headers[this.AUTH_HEADER_KEY];
      const fullPrefix = `${this.AUTH_PREFIX} `;
      if (!authHeader || !authHeader.startsWith(fullPrefix)) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - 未携带有效Token头`
        );
        return this._handleUnauthorized(req, res);
      }

      // 2. 截取 Bearer 后面真实token
      const token = authHeader.slice(fullPrefix.length).trim();
      if (!token) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - Token为空`
        );
        return this._handleUnauthorized(req, res);
      }

      // 3. 校验解析JWT
      const payload = jwt.verify(token, this.JWT_SECRET);

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
    // 防御：如果响应已经发送，禁止再次返回内容
    if (res.headersSent) return;
    // SPA单页应用：全部统一返回标准JSON，前端axios拦截器捕获401跳转登录
    return res.json({
      code: this.UNAUTH_CODE,
      msg: this.UNAUTH_MSG,
      data: null
    });
  }
}

// 单例实例
const tokenAuthInstance = new CheckTokenAuth();
// 绑定this，防止中间件调用丢失上下文
tokenAuthInstance.checkTokenAuth = tokenAuthInstance.checkTokenAuth.bind(tokenAuthInstance);

module.exports = tokenAuthInstance;