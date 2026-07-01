/**
 * 项目管理模块路由文件
 * 分层规范：路由仅负责 路径匹配、权限中间件挂载、请求分发，无任何业务逻辑
 * 页面路由：渲染项目管理首页EJS页面，展示全部项目列表
 * 接口路由：启动/停止/重启子项目，业务逻辑统一交给 ProjectOperateService 处理
 * 全局依赖：会话登录鉴权中间件、项目控制器、项目启停业务服务、全局环境变量
 */ const express = require("express");

const webProjectsRouter = express.Router();
const {
  projectsController,
} = require("@MongoDB/controllers/index.controller.js");

const ProjectOperateService = require("@MongoDB/services/projects/projectOperate.service.js");

const sessionAuth =
  require("@middleware/login.session.auth.help.js").checkSessionLogin;

/**
 * 前端页面全局环境变量
 * 读取系统环境变量，无配置则使用默认值，注入EJS模板全局使用
 * 重复 HEARTBEAT_INTERVAL 为代码冗余，可删除其中一行
 */
const envData = {
  APP_NAME: process.env.APP_NAME || "stuProjectsMT",
  LOGOUT_REDIRECT_URL: process.env.LOGOUT_REDIRECT_URL || "/auth/logOUT",
  HEARTBEAT_REDIRECT_URL: process.env.HEARTBEAT_REDIRECT_URL || "/heartbeat",
  HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL || 30000,
  HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL || 30000,
  HEARTBEAT_TIMEOUT: process.env.HEARTBEAT_TIMEOUT || 10000,
  MAX_HEARTBEAT_FAIL: process.env.HEARTBEAT_MAX_FAILURE || 10,
  NODE_ENV: process.env.NODE_ENV,
};

/**
 * 项目管理主页路由
 * 访问地址：/ 或 /lists 均可匹配
 * 前置中间件：sessionAuth 登录鉴权
 * 逻辑：调用控制器获取项目列表数据，渲染 index.pm.ejs 管理页面
 * 模板注入变量：登录用户名、全部项目数组、全局环境配置env
 */
webProjectsRouter.get(
  ["/", "/lists"],
  sessionAuth,
  async function (req, res, next) {
    const renderData = await projectsController.getProjectsListData(req);

    res.render("index.pm.ejs", {
      user: req.session.username,
      projectsList: renderData.data,
      env: envData,
    });
  },
);

/**
 * 项目启动接口
 * POST /start/:id
 * 前置：登录鉴权
 * 职责：仅转发请求至业务服务，不写业务代码
 * @param {Request} req 请求对象，携带路径参数id
 * @param {Response} res 响应对象，由service统一返回成功/失败JSON
 */
webProjectsRouter.post("/start/:id", sessionAuth, async (req, res) => {
  return await ProjectOperateService.startProject(req, res);
});

/**
 * 项目停止接口
 * POST /stop/:id
 * 前置：登录鉴权
 * 转发至业务服务停止项目逻辑
 */
webProjectsRouter.post("/stop/:id", sessionAuth, async (req, res) => {
  return await ProjectOperateService.stopProject(req, res);
});

/**
 * 项目重启接口
 * POST /restart/:id
 * 前置：登录鉴权
 * 转发至业务服务，先停后启
 */
webProjectsRouter.post("/restart/:id", sessionAuth, async (req, res) => {
  return await ProjectOperateService.restartProject(req, res);
});

module.exports = webProjectsRouter;
