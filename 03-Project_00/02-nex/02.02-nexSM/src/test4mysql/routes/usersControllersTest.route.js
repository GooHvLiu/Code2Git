const express = require("express");
const UsersRouter = express.Router();
const { UsersController } = require("@controllers/index.js");
// 完全测试公开接口
UsersRouter.get("/test", (req, res, next) => {
  console.log("已进入usersControllersTest测试");

  /* // findAll 分页查询用户列表接口
  UsersController.getUserPage(req, res, next); */
  // findAll 不分页查询用户列表接口
  UsersController.getUserAll(req, res, next);
  /* // 新增用户接口
  UsersController.addUser(req, res, next); */
});

// 完全测试公开接口
UsersRouter.get("/test/:id", (req, res, next) => {
  console.log("已进入usersControllersTest测试'/:id'");
  /* // findOne 根据主键ID查询单条用户详情接口
  UsersController.getUserInfoById(req, res, next); */
  /* // 更新用户信息
  UsersController.editUser(req, res, next); */
  /* // 物理删除用户
  UsersController.removeUser(req, res, next); */
});

module.exports = UsersRouter;
