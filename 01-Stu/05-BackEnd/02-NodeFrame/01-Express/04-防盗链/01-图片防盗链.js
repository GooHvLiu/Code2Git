/*
 * 项目：01-图片防盗链.js
 */
// 1. 导入 express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3. 声明中间件
app.use((req, res, next) => {
  //检测请求头中的 referer 是否为 127.0.0.1
  //获取 referer
  let referer = req.get("referer");
  if (referer) {
    //实例化
    let url = new URL(referer);
    //获取 hostname
    let hostname = url.hostname;
    //判断
    if (hostname !== "127.0.0.1") {
      //响应 404
      res.status(404).send("<h1>404 Not Found</h1>");
      return;
    }
  }
  next();
});

// 4. 静态资源中间件设置
app.use(express.static(__dirname + "../03-中间件/public"));

// 5. 监听端口, 启动服务
app.listen(3000, () => {
  console.log("服务已经启动, 端口 3000 正在监听中....");
});
