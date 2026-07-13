const path = require("path");
var express = require("express");
const usersController = require("@MongoDB/controllers/users.controller.js");
var authRouter = express.Router();
const { getSafeRedirectUrl } = require("@middleware/urlHelper.js");

//GET IP:PORT/auth/reg 注册页面
authRouter.get("/reg", function (req, res, next) {
  res.render("reg");
});

//GET IP:PORT/auth/login 登录页面
authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

//POST IP:PORT/auth/reg 注册数据POST
authRouter.post("/reg", async function (req, res, next) {
  try {
    const registerDate = await usersController.registerData(req);
    if (registerDate.type === 1) {
      const safeUrl = getSafeRedirectUrl(
        process.env.LOGIN_REDIRECT_URL,
        "success",
      );
      res.render("success", {
        msg: "Register Success.",
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.REGISTER_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: registerDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(
      process.env.REGISTER_REDIRECT_URL,
      "error",
    );
    res.render("error", {
      msg: "Register Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});

//POST IP:PORT/auth/login 登录数据POST
authRouter.post("/login", async function (req, res, next) {
  try {
    const loginDate = await usersController.loginData(req);
    if (loginDate.type === 1) {
      res.redirect("/myAccounts");
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.LOGIN_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: loginDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(process.env.LOGIN_REDIRECT_URL, "error");
    res.render("error", {
      msg: "login Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});

//GET IP:PORT/auth/logout 登出页面
authRouter.get("/logout", async function (req, res, next) {
  try {
    const logoutDate = await usersController.logoutData(req);

    if (logoutDate.type === 1) {
      res.redirect("/myAccounts");
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.LOGIN_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: logoutDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(process.env.LOGIN_REDIRECT_URL, "error");
    res.render("error", {
      msg: "logout Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});

module.exports = authRouter;
