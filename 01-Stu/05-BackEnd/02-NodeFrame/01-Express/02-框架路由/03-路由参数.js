/*
 * 项目：03-路由参数.js
 *
 */
// 1. 导入express
const express = require("express");

// 2. 创建应用对象
const app = express();

// 3.1 创建get路由 127.0.0.1:3000
// / 表示路径分隔符
// : 表示参数标识符，表示后面是动态参数
// id 参数名称，可以在 req.params.id 中获取
// .html 固定后缀，必须匹配 .html
app.get("/:id.html", (req, res) => {
  res.send("商品详情, 商品 id 为" + req.params.id);
});

// 4. 监听端口
app.listen(3000, () => {
  console.log("Server is started,please go fishing.");
});
