/*
 * 项目：02-创建路由中间件.js
 * 要求：针对/admin/setting的请求，要求URL携带code=521参数，如未携带提示【暗号错误】
 *
 */
// 1. 导入express/path/fs模块
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3. 创建路由中间件
let fiveTwoOne = (req, res, next) => {
  //获取url并检验
  console.log(req.query.code);

  if (req.query.code === "521") {
    next();
  } else {
    res.send("暗号错误");
  }
  //通过next，继续让程序执行路由
};

// 4 创建get路由 127.0.0.1:3000
app.get("/admin", fiveTwoOne, (req, res) => {
  //路由中间件
  res.send("后台首页");
});

// 4 创建get路由 127.0.0.1:3000
app.get("/setting", fiveTwoOne, (req, res) => {
  //路由中间件
  res.send("后台设置");
});

// 5. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
