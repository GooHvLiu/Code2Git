/*
 * 项目：homeRouter.js，前端路由
 */

// 1. 导入 express
const express = require("express");

// 2. 创建路由对象
const router = express.Router();

// 3.1 创建路由规则1
router.get("/home", (req, res) => {
  res.send("前台首页");
});

// 3.2 创建路由规则2
router.get("/search", (req, res) => {
  res.send("内容搜索");
});

// 4. 将js模块暴露
module.exports = router;
