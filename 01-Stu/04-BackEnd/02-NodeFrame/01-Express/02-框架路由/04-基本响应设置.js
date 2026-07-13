/*
 * 项目：04-基本相应设置.js
 *
 */
// 1. 导入express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3.1 创建get路由 127.0.0.1:3000
app.get("/response", (req, res) => {
  /* //原生响应
  res.statusCode = 404;
  res.statusMessage = " running now.";
  res.setHeader("xxx", "yyy");
  res.write("hello,frame rounter");
  res.end("response..."); */

  //express响应
  res.status(500);
  res.set("aaa", "bbb");
  //中文不会乱码，因为express会自动加上字符集设置
  res.send("你好，我是express的响应体");

  /* //以上信息也可以写为如下模式
  res.status(500).set("aaa", "bbb").send("你好，我是express的响应体"); */
});

// 4. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
