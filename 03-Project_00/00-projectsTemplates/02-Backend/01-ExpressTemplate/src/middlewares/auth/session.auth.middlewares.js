/**
 * 登录鉴权中间件类
 * @class CheckLogin
 * @description 全局会话登录校验，区分页面/API请求，异常捕获+日志埋点
 */
class CheckSessionLogin {
  // 业务配置抽离，统一管理路由地址
  static LOGIN_REDIRECT_URL = process.env.LOGIN_REDIRECT_URL;
  static UNAUTH_CODE = Number(process.env.UNAUTH_CODE) || 401;
  static UNAUTH_MSG = process.env.UNAUTH_MSG || "登录失效，请重新登录";

  /**
   * 登录校验中间件函数
   * @param {import('express').Request} req 请求对象
   * @param {import('express').Response} res 响应对象
   * @param {import('express').NextFunction} next 放行函数
   * @returns {void}
   */
  checkSessionLogin(req, res, next) {
    try {
      // 白名单放行登录、注册接口，阻断鉴权死循环，从.env读取白名单字符串，切割为数组
      const whiteListStr = process.env.TOKEN_WHITE_LIST || "";
      // 分割、去空格、过滤空字符串
      const whiteList = whiteListStr
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const path = req.originalUrl.split("?")[0];
      if (whiteList.includes(path)) {
        return next();
      }
      // 兜底：session 对象不存在（存储服务断开）
      if (!req.session) {
        console.warn(
          `[鉴权拦截] ${req.method} ${req.originalUrl} - Session 对象丢失`,
        );
        return this._handleUnauthorized(req, res);
      }

      // 核心登录态判断：无登录用户名则拦截
      if (!req.session.username) {
        console.warn(
          `[鉴权拦截] ${req.method} ${req.originalUrl} - 未登录/会话过期`,
        );
        return this._handleUnauthorized(req, res);
      }

      // 登录校验通过，放行后续中间件/路由
      next();
    } catch (error) {
      // 捕获session读取、存储所有异常，防止服务崩溃
      console.error(
        `[鉴权异常] ${req.method} ${req.originalUrl}`,
        error.message,
      );
      // 统一返回未授权逻辑
      return this._handleUnauthorized(req, res);
    }
  }

  /**
   * 统一处理未登录响应：区分页面渲染 / 接口JSON返回
   * @private
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  _handleUnauthorized(req, res) {
    // 可选链防止 accept 不存在报错
    const isApiRequest = req.headers.accept?.includes("application/json");

    if (isApiRequest) {
      // 静态类名严格保持 CheckSessionLogin，和class定义一致
      return res.status(CheckSessionLogin.UNAUTH_CODE).json({
        code: CheckSessionLogin.UNAUTH_CODE,
        msg: CheckSessionLogin.UNAUTH_MSG,
        redirect: CheckSessionLogin.LOGIN_REDIRECT_URL,
      });
    } else {
      // 页面浏览器请求：302重定向登录页
      return res.redirect(CheckSessionLogin.LOGIN_REDIRECT_URL);
    }
  }
}
// 创建实例并绑定this上下文，解决单独提取方法后this丢失问题
const sessionAuthInstance = new CheckSessionLogin();

// 强制绑定实例上下文，无论函数单独提取使用，this永远指向当前实例
sessionAuthInstance.checkSessionLogin =
  sessionAuthInstance.checkSessionLogin.bind(sessionAuthInstance);

// 全局单例导出，项目全局复用同一个实例
module.exports = sessionAuthInstance;
