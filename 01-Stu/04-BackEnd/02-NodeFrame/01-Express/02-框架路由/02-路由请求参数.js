/*
 * 项目：02-请求参数.js
 *
 */
// 1. 导入express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3.1 创建get路由 127.0.0.1:3000
app.get("/request", (req, res) => {
  // 3.1 获取报文的方式与原生 HTTP 获取方式是兼容的，如下为获取报文相关数据
  console.log(req.method);
  console.log(req.url);
  console.log(req.httpVersion);
  console.log(req.headers);

  // 3.2 express 独有的获取报文的方式

  //获取查询字符串，『相对重要』
  console.log(req.query);
  // 获取指定的请求头
  console.log(req.get("host"));

  //如下为简单的响应
  res.send("我是首页.");
});

// 4. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
