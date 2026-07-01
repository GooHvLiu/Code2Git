/*
 * 项目：05-其他响应设置.js
 *
 */
// 1. 导入express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3.1 创建get路由 127.0.0.1:3000
app.get("/redirect", (req, res) => {
  //跳转响应
  res.redirect("http://www.baidu.com/");
});
app.get("/download", (req, res) => {
  //下载响应
  res.download(__dirname + "/03-路由参数.js");
});
app.get("/json", (req, res) => {
  //JSON 响应
  res.json({
    name: "尚硅谷",
    slogon: "天下没有难学的技术",
  });
});
app.get("/html", (req, res) => {
  //HTML响应
  res.sendFile(__dirname + "/05-其他响应设置-test.html");
});

// 4. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
