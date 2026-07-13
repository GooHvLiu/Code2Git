/*
 * 项目：01-简单路由演示.js
 *
 */
// 1. 导入express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3.1 创建get路由 127.0.0.1:3000
app.get("/home", (req, res) => {
  res.send("我是首页.");
});

app.get("/", (req, res) => {
  res.send("我才是首页");
});

// 3.2 创建post路由
app.post("login", (req, res) => {
  res.send("登录成功.");
});

// 3.3 匹配所有的请求
app.all("/search", (req, res) => {
  res.send("1 秒钟为您查询到10个亿的数据信息");
});

// 3.4 自定义 404 路由（必须放在最后），在 Express 5 或较新版本中，app.all("*") 的语法发生了变化，不再受支持
app.all(/.*/, (req, res) => {
  res.send("<h1> 404 Not Found </h1>");
});

// 4. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
