const BusinessError = require("@utils/businessError.utils.js");
/**
 * Token 登录鉴权中间件类
 * @class CheckTokenAuth
 * @description JWT Token 全局鉴权校验，适配Vue SPA单页项目，统一JSON返回、日志埋点、环境变量驱动
 * @author 
 */
const jwt = require("jsonwebtoken");

class CheckTokenAuth {
  // 构造函数：初始化一次性读取环境变量/缓存配置，避免每次请求重复读取、【Bearer 】不要手动加空格，做拼接、业务错误码、解析白名单
  constructor() {
    this.UNAUTH_CODE = Number(process.env.UNAUTH_CODE) || 401;
    this.UNAUTH_MSG = process.env.UNAUTH_MSG || "登录凭证失效，请重新登录";
    this.JWT_SECRET = process.env.JWT_SECRET || "nexCM-dev-secret-key-2026";
    this.AUTH_HEADER_KEY = process.env.JWT_AUTH_HEADER_KEY || "authorization";
    this.AUTH_PREFIX = process.env.JWT_AUTH_PREFIX || "Bearer";
    this.AUTH_PREFIX_FULL = `${this.AUTH_PREFIX} `;
    this.ERR_CODE_NO_TOKEN = 40001;
    this.ERR_CODE_TOKEN_INVALID = 40002;
    this.ERR_CODE_TOKEN_EXPIRED = 40003;
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

        // 抛出业务异常，交给全局errorHandler统一返回
        throw new BusinessError("缺少登录凭证，请重新登录", this.ERR_CODE_NO_TOKEN);
      }

      // 2. 截取 Bearer 后面真实token
      const token = authHeader.slice(fullPrefix.length).trim();
      if (!token) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - Token为空`
        );
        throw new BusinessError("登录凭证不能为空", this.ERR_CODE_NO_TOKEN);
      }

      // 3. 校验解析JWT 挂载解析后的用户信息，后续接口直接使用 req.tokenUser
      const payload = jwt.verify(token, this.JWT_SECRET);
      req.tokenUser = payload;

      // 4. 放行
      return next();
    } catch (error) {
      // 细分错误类型打印日志 已经是我们主动抛出的业务异常，直接向外传递
      if (error instanceof BusinessError) {
        return next(error);
      }

      // 统一抛业务异常，交给全局中间件处理
      let errMsg = "";
      let errCode;
      if (error.name === "TokenExpiredError") {
        errMsg = "登录凭证已过期，请重新登录";
        errCode = this.ERR_CODE_TOKEN_EXPIRED;
      } else if (error.name === "JsonWebTokenError") {
        errMsg = "登录凭证非法或被篡改";
        errCode = this.ERR_CODE_TOKEN_INVALID;
      } else if (error.name === "NotBeforeError") {
        errMsg = "登录凭证尚未生效";
        errCode = this.ERR_CODE_TOKEN_INVALID;
      } else {
        errMsg = `Token校验异常: ${error.message}`;
        errCode = this.ERR_CODE_TOKEN_INVALID;
      }
      console.error(`[Token鉴权异常] ${req.method} ${req.originalUrl} - ${errMsg}`);
      const businessErr = new BusinessError(errMsg, errCode);
      return next(businessErr);
    }
  }
}

// 单例实例
const tokenAuthInstance = new CheckTokenAuth();
// 绑定this，防止中间件调用丢失上下文
tokenAuthInstance.checkTokenAuth = tokenAuthInstance.checkTokenAuth.bind(tokenAuthInstance);

module.exports = tokenAuthInstance;