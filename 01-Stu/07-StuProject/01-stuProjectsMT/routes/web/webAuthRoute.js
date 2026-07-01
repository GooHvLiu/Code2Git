/**
 * 认证模块路由文件（登录/注册/登出）
 * 分层规范：路由仅负责地址匹配、页面渲染分发、请求转发，业务逻辑全部交给 usersController 控制器
 * 包含页面路由：注册页、登录页
 * 包含接口路由：提交注册、提交登录、退出登录
 * 全局注入环境变量 envData 到EJS模板，控制页面开关、跳转地址、心跳配置
 */
var express = require("express");
const usersController = require("@MongoDB/controllers/users.controller.js");
var authRouter = express.Router();

/**
 * 前端模板全局环境变量
 * 读取系统环境变量，无配置则使用默认值，统一注入所有auth页面EJS模板
 * 重复 HEARTBEAT_INTERVAL 属于冗余代码，可删除其中一行
 */
const envData = {
  APP_NAME: process.env.APP_NAME || "stuProjectsMT",
  LOGIN_REDIRECT_URL: process.env.LOGIN_REDIRECT_URL || "/auth/login",
  REGISTER_REDIRECT_URL: process.env.REGISTER_REDIRECT_URL || "/auth/reg",
  HEARTBEAT_REDIRECT_URL: process.env.HEARTBEAT_REDIRECT_URL || "/heartbeat",
  HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL || 30000,
  HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL || 30000,
  HEARTBEAT_TIMEOUT: process.env.HEARTBEAT_TIMEOUT || 10000,
  MAX_HEARTBEAT_FAIL: process.env.HEARTBEAT_MAX_FAILURE || 10,
  ENABLE_REGISTER: process.env.ENABLE_REGISTER === "true",
  ENABLE_FORGET_PWD: process.env.ENABLE_FORGET_PWD === "true",
  NODE_ENV: process.env.NODE_ENV,
  API_PREFIX: "/auth",
};

/**
 * 注册页面 GET 路由
 * 访问地址：GET /auth/reg
 * 功能：判断全局注册开关，关闭则拦截跳转登录页；开启则渲染注册模板
 */
authRouter.get("/reg", function (req, res, next) {
  if (process.env.ENABLE_REGISTER === "false") {
    req.flash("error", "目前禁止注册，请联系管理员。");
    return res.redirect("/auth/login");
  } else {
    res.render("reg.auth.ejs", {
      env: envData,
    });
  }
});

/**
 * 登录页面 GET 路由
 * 访问地址：GET /auth/login
 * 功能：渲染登录页面模板
 */
authRouter.get("/login", function (req, res, next) {
  res.render("login.auth.ejs", {
    env: envData,
  });
});

/**
 * 提交注册 POST 接口
 * 访问地址：POST /auth/reg
 * 功能：接收表单注册数据，转发控制器处理注册逻辑
 * 逻辑分支：
 *  1、type=1 注册成功 → 跳转登录页
 *  2、type≠1 注册失败 → flash存入错误提示，返回注册页
 *  3、全局异常捕获 → 页面提示服务异常，返回注册页
 */
authRouter.post("/reg", async function (req, res, next) {
  try {
    const registerDate = await usersController.registerData(req);
    if (registerDate.type === 1) {
      return res.redirect("/auth/login");
    } else {
      // 1. 把错误存入flash
      req.flash("error", registerDate.msg);
      // 账号/邮箱地址存在，无法注册
      // 2. 重定向到GET注册页面，不要直接render
      return res.redirect("/auth/reg");
    }
  } catch (err) {
    req.flash("error", "注册服务异常，请稍后重试");
    return res.redirect("/auth/reg");
  }
});

/**
 * 提交登录 POST 接口
 * 访问地址：POST /auth/login
 * 功能：接收账号密码表单，控制器校验登录、写入session会话
 * 逻辑分支：
 *  1、type=1 登录成功 → 跳转项目管理首页
 *  2、type≠1 账号密码错误 → flash存提示，返回登录页
 *  3、全局异常捕获 → 提示服务异常，返回登录页
 */
authRouter.post("/login", async function (req, res, next) {
  try {
    const loginDate = await usersController.loginData(req);
    if (loginDate.type === 1) {
      return res.redirect("/projects");
    } else {
      // 1. 把错误存入flash
      req.flash("error", loginDate.msg);
      // 2. 重定向到GET登录页面，不要直接render
      return res.redirect("/auth/login");
    }
  } catch (err) {
    req.flash("error", "登录服务异常，请稍后重试");
    return res.redirect("/auth/login");
  }
});

/**
 * 退出登录 GET 接口
 * 访问地址：GET /auth/logout
 * 功能：销毁当前用户session会话，清空登录状态，跳转登录页
 */
authRouter.get("/logout", async function (req, res, next) {
  try {
    await usersController.logoutData(req);
    // session销毁成功，跳登录页
    return res.redirect("/auth/login");
  } catch (err) {
    req.flash("error", "登出服务异常，请稍后重试");
    return res.redirect("/auth/login");
  }
});

module.exports = authRouter;
