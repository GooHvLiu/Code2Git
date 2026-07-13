/*
 * 项目：03-静态资源中间件.js
 *
 */
// 1. 导入express/path/fs模块
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3. 创建静态资源中间件,实际使用不需要增加public文件路径：127.0.0.1:3000/index.html
app.use(express.static(__dirname + "/public"));

// 4 创建get路由 127.0.0.1:3000
app.get("/admin", (req, res) => {
  //路由中间件
  res.send("后台首页");
});

// 4 创建get路由 127.0.0.1:3000
app.get("/setting", (req, res) => {
  //路由中间件
  res.send("后台设置");
});

// 5. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
