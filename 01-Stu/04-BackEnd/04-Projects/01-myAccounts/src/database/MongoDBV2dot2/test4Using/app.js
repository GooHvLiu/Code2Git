// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const cors = require("cors");
const connectDB = require("@MongoDB/config/db.js");
const router = require("@MongoDB/routes/user.route.js");
const errorHandler = require("@MongoDB/middleware/error.middleware.js");

// 连接数据库
connectDB();

const app = express();

// 全局中间件
app.use(cors());
app.use(express.json()); // 解析json请求体

// 挂载路由
app.use("/", router);

// 全局错误处理（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务启动成功，端口：${PORT}`);
});
