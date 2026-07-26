require("module-alias/register");
require("express-async-errors");
require("dotenv-expand").expand(require("dotenv").config());
var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
// 引入鉴权中间件
const tokenAuth = require("@middlewares/auth/token.auth.middlewares.js");

//  引入全局异常处理中间件
const errorHandler = require("@middlewares/enhance/errorHandle.js");

// MySQL数据库，自动初始化连接池，无需重复导入
require("@models/base/main.base.js").pool;

// 创建路由
app.use(tokenAuth.checkTokenAuth);
var indexRouter = require("./routes/index");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 使用路由
app.use("/", indexRouter);

// 当路由匹配不到时进入此 404 页面
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局异常处理
app.use(errorHandler);

module.exports = app;
