var express = require("express");
var LoginRouter = express.Router();

// 引入 二维码相关的控制层/服务层 模块
const {Menu4UsersController, CaptchaController } = require("@controllers/index.js");
const { AuthController } = require("@controllers/index.js");
const { UsersService } = require("@services/index.js");

// 路由 验证码 获取
LoginRouter.get("/captchaImage", function (req, res, next) {
  //通过调用标准 二维码生成模块 发送数据
  CaptchaController.generateCaptcha(req, res, next);
});

// 路由 登录 校验 二维码 和 用户名和密码
LoginRouter.post("/login", async function (req, res, next) {
  // 获取二维码校验结果 结果只能是200 null
  const verifyData=CaptchaController.verifyCaptcha(req, res, next); 
  // 验证成功 通过引入的controllers/auth/index.auth.js进行处理
  if(verifyData.code===200){
    AuthController.login(req, res, next);
  }
});

// 路由 通过鉴权获取用户数据 （APP全局中间件已经拦截）
LoginRouter.get("/user/info",async function (req, res) {
  // req.tokenUser 已经被中间件挂载,直接使用 req.tokenUser
  const userId = req.tokenUser.id;
  // 调用service根据id查询数据库，拿到最新用户信息
  const userInfo = await UsersService.getUserInfoById(userId);
  res.json({
    code: 200,
    msg: "获取用户信息成功",
    data: {
      userId: userInfo.id,
      username: userInfo.username,
      nickname:userInfo.nickname
    }
  });
});

// 路由 获取登录用户的菜单 使用箭头函数，不会丢失this
LoginRouter.get("/getRouters", function (req, res,next) {
  // 通过 controllers 获取动态菜单
  return Menu4UsersController.getUserRouters(req, res, next);
  
});

module.exports = LoginRouter;
