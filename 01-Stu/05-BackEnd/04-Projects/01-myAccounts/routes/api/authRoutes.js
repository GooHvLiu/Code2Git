const path = require("path");
var express = require("express");
const usersController = require("@MongoDB/controllers/users.controller.js");
const loginAuth =
  require("@middleware/login.token.auth.help.js").checkTokenAuth;
var authRouter = express.Router();

//POST IP:PORT/api-auth/reg 注册数据POST
authRouter.post("/reg", async function (req, res, next) {
  try {
    await usersController.register(req, res);
  } catch (err) {
    res.json({
      code: "2201",
      msg: "注册异常出错",
      data: err,
    });
  }
});

//POST IP:PORT/api-auth/login 登录数据POST
authRouter.post("/login", async function (req, res, next) {
  try {
    await usersController.login(req, res);
  } catch (err) {
    res.json({
      code: "2202",
      msg: "登录异常出错",
      data: err,
    });
  }
});

//GET IP:PORT/api-auth/logout 登出页面
authRouter.get("/logout", loginAuth, async function (req, res, next) {
  console.log("api登出");

  try {
    await usersController.logout(req, res);
  } catch (err) {
    res.json({
      code: "2203",
      msg: "登出异常出错",
      data: err,
    });
  }
});

module.exports = authRouter;
