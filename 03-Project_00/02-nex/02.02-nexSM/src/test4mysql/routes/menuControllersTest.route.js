const express = require("express");
const MenuRouter = express.Router();
const { Menu4usersController } = require("@controllers/index.js");

// 完全测试公开接口
MenuRouter.get("/test/:id", (req, res, next) => {
  console.log("已进入menuControllersTest测试'/:id'");
  // 获取用户动态树形路由
  Menu4usersController.getUserRouters(req, res, next);
});

module.exports = MenuRouter;
