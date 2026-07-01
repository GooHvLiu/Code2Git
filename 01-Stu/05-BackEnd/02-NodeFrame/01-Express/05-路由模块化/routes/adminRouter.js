/*
 * 项目：adminRouter.js，后端路由
 */

// 1. 导入 express
const express = require("express");

// 2. 创建路由对象
const router = express.Router();

// 3.1 设置后端路由规则1
router.get("/admin", (req, res) => {
  res.send("后台首页");
});

// 3.2 设置后端路由规则2
router.get("/setting", (req, res) => {
  res.send("设置页面");
});

// 4. 将js模块暴露
module.exports = router;
