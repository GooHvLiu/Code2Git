/*
 * 项目：01-创建全局中间件.js
 *
 */
// 1. 导入express/path/fs模块
const { log } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");

// 2. 创建应用对象
const app = express();

// 3.1 创建全局中间件
function recordMiddleWare(req, res, next) {
  //获取url和ip
  let middleUrl = req.url;
  let middleIp = req.ip;

  //写入日志当中的字符串
  let logStr =
    "Current URL is :" + middleUrl + ";Current IP is :" + middleIp + "\n";
  console.log(logStr);

  //将获取到的信息导出到日志当中
  fs.appendFile(path.resolve(__dirname, "./access.log"), logStr, (err) => {
    if (err) {
      console.error("写入日志失败:", err);
    }
  });

  //通过next，继续让程序执行路由
  next();
}

// 3.2 使用中间件
app.use(recordMiddleWare);

// 4 创建get路由 127.0.0.1:3000
app.get("/redirect", (req, res) => {
  //跳转响应
  res.redirect("http://www.baidu.com/");
});

// 5. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
