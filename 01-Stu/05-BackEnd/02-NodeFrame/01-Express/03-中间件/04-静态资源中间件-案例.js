/*
 * 项目：04-静态资源中间件-案例.js
 * 需求：局域网内都可以访问到尚品汇
 * 注意事项：
 *  1. 通过静态资源中间件设置首页
 *  2. 但是在主页html中需要自动引入css和js文件，这样，可以通过几次的请求，将需要的文件都获取到
 *
 */
// 1. 导入express/path/fs模块
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3. 创建静态资源中间件,实际使用不需要增加public文件路径：127.0.0.1:3000/index.html
app.use(express.static(__dirname + "/尚品汇"));

// 5. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
