/*
 * 项目：05-body-parser获取请求体数据.js
 * 需求，按照要求搭建HTTP服务：
 *  1）GET
         /1ogin显示表单网页;
    2）POST /login
         获取表单中的用户名和密码;
 */
// 1. 引入express和body-parser,使用说明：https://npmmirror.com/package/body-parser
const express = require("express");
const bodyParser = require("body-parser");

// 2. 创建应用对象
const app = express();

// 3.1 创建get路由规则
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/05-body-parser获取请求体数据_form.html");
});

// 3.2 创建post路由规则，引用body-parser的bodyParser.urlencoded()方法读取post请求体内容
app.post("/login", bodyParser.urlencoded(), (req, res) => {
  console.log(req.body);
});

// 4. 设置启动监控端口
app.listen(3000, () => {
  console.log("Server is running...");
});
