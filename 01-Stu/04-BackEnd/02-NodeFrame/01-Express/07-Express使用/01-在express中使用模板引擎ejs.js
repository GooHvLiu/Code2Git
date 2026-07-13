/*
 * 项目：01-在express中使用模板引擎ejs.js
 * 前提：
 *      安装express，ejs
 */

// 1. 引入express、path
const express = require("express");
const path = require("path");

// 2. 创建应用对象
const app = express();

// 3. 设置应用对象的模板引擎,同类型的模板引擎有ejs，pug，twing
app.set("view engine", "ejs");

// 4. 设置模板存放地址，模板文件：具有模板语法内容
app.set("views", path.resolve(__dirname, "./views"));

// 5. 创建路由
app.get("/home", (req, res) => {
  /* // 5.1 render响应
    res.render('模板的文件名','数据') */
  // 5.1 render响应声明变量
  let title = "尚硅谷 - 让天下没有难学的技术。";
  res.render("home", { title });

  // 5.2 创建模板文件
});

app.listen(3000, () => {
  console.log("Server is started in ports 3000...");
});
