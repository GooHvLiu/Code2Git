/*
 * 项目：01-路由模块化.js
 */

// 1. 导入 express/前端相关homeRouter/后端相关adminRouter
const express = require("express");
const homeRouter = require("./routes/homeRouter");
const adminRouter = require("./routes/adminRouter");

// 2. 创建应用对象
const app = express();

// 3. 设置
app.use(homeRouter);
app.use(adminRouter);

// 4. Not Found设置,使用正则表达式：/.*/
app.all(/.*/, (req, res) => {
  res.send("<h1>404 Not Found</h1>");
});

// 5. 监听端口, 启动服务
app.listen(3000, () => {
  console.log("Server is Started,3000 Ports is listened....");
});
