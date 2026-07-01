/**
 * Token 登录鉴权中间件类
 * @class CheckTokenAuth
 * @description JWT Token 全局鉴权校验，区分页面/API请求，异常捕获+日志埋点
 * @author MyAccounts Backend
 */
const jwt = require("jsonwebtoken");

class CheckTokenAuth {
  // 业务配置抽离，统一管理路由、状态码、提示文案
  static LOGIN_REDIRECT_URL = process.env.LOGIN_REDIRECT_URL;
  static UNAUTH_CODE = Number(process.env.UNAUTH_CODE) || 401;
  static UNAUTH_MSG = process.env.UNAUTH_MSG || "登录凭证失效，请重新登录";
  static JWT_SECRET = process.env.JWT_SECRET;
  // Token 请求头标识标准 Bearer
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
      // 白名单放行登录、注册接口，阻断鉴权死循环
      const whiteList = [
        process.env.LOGIN_REDIRECT_URL,
        process.env.REGISTER_REDIRECT_URL,
      ];
      const purePath = req.originalUrl.split("?")[0];
      if (whiteList.includes(purePath)) {
        return next();
      }

      // 1. 获取 Authorization 请求头
      const authHeader = req.headers[CheckTokenAuth.AUTH_HEADER_KEY];
      if (!authHeader || !authHeader.startsWith(CheckTokenAuth.AUTH_PREFIX)) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - 未携带有效Token头`,
        );

        return this._handleUnauthorized(req, res);
      }

      // 2. 截取 Bearer 后的真实 token
      const token = authHeader.slice(CheckTokenAuth.AUTH_PREFIX.length).trim();
      if (!token.trim()) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - Token为空`,
        );
        return this._handleUnauthorized(req, res);
      }

      // 3. 校验并解析JWT
      const payload = jwt.verify(token, CheckTokenAuth.JWT_SECRET);
      // 将解析后的用户信息挂载到req.tokenUser，后续路由/控制器直接使用
      req.tokenUser = payload;

      // Token校验通过，放行业务逻辑
      return next();
    } catch (error) {
      // 细分JWT错误类型，打印精准日志
      let logMsg = "";
      if (error.name === "TokenExpiredError") {
        logMsg = "Token已过期";
      } else if (error.name === "JsonWebTokenError") {
        logMsg = "Token签名非法/篡改";
      } else if (error.name === "NotBeforeError") {
        logMsg = "Token未生效";
      } else {
        logMsg = `Token校验异常: ${error.message}`;
      }
      console.error(
        `[Token鉴权异常] ${req.method} ${req.originalUrl} - ${logMsg}`,
        error.stack,
      );
      return this._handleUnauthorized(req, res);
    }
  }

  /**
   * 统一处理未授权返回逻辑：区分前端AJAX接口 / 浏览器页面访问
   * @private
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  _handleUnauthorized(req, res) {
    // 判断是否为AJAX/接口请求：Accept携带application/json
    const isApiRequest = req.headers.accept?.includes("application/json");

    if (isApiRequest) {
      // API接口场景：返回标准401 JSON结构
      return res.status(CheckTokenAuth.UNAUTH_CODE).json({
        code: CheckTokenAuth.UNAUTH_CODE,
        msg: CheckTokenAuth.UNAUTH_MSG,
        redirect: CheckTokenAuth.LOGIN_REDIRECT_URL,
      });
    } else {
      // 浏览器页面访问：302重定向至登录页面
      return res.redirect(CheckTokenAuth.LOGIN_REDIRECT_URL);
    }
  }
}

// 实例化单例
const tokenAuthInstance = new CheckTokenAuth();

// 强制绑定this上下文，防止单独导出函数丢失实例指向
tokenAuthInstance.checkTokenAuth =
  tokenAuthInstance.checkTokenAuth.bind(tokenAuthInstance);

// 全局单例导出，项目统一复用
module.exports = tokenAuthInstance;
