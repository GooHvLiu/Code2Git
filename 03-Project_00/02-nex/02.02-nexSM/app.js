require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
var express = require("express");
const cors = require("cors");
var path = require("path");
const app = express();
const appConfig = require('./src/config/app.config.js');

// 中间件
const responseMiddleware = require('./src/middleware/response.middleware.js');
const loggerMiddleware = require('./src/middleware/logger.middleware.js');
const { errorHandler, notFoundHandler } = require('./src/middleware/error.middleware.js');

// 总路由
const router = require('@routes/router.js');
const testRouter = require("@routes/testRouter.js");


// 跨域
app.use(cors());

// 解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 统一响应格式
app.use(responseMiddleware);

// 请求日志
app.use(loggerMiddleware);

// 静态资源
app.use('/public', express.static(path.join(__dirname, './public')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// 使用路由
app.use("/", testRouter);
app.use(router);


// 404 处理
app.use(notFoundHandler);

// 全局错误处理（必须放在最后）
app.use(errorHandler);

// 启动服务
const PORT = appConfig.port;
const HOST = appConfig.host;

app.listen(PORT, HOST, () => {
  console.log('\n========================================');
  console.log(`🚀 服务启动成功`);
  console.log(`📍 地址: http://${HOST}:${PORT}`);
  console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================\n');
});

module.exports = app;
