// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
const express = require("express");
const cors = require("cors");
// 全局仅引入一次，自动初始化连接池，无需重复导入
require("@models/base/main.base.js").pool;
const usersControllersTestRouter = require("./routes/usersControllersTest.route.js");
const menuControllersTestRouter = require("./routes/menuControllersTest.route.js");
// 引入全局错误处理模块
const errorHandler = require("@middlewares/error.middleware.js");

const app = express();

// 全局中间件
app.use(cors());
app.use(express.json()); // 解析json请求体

// 挂载路由
app.use("/users", usersControllersTestRouter);
app.use("/menus", menuControllersTestRouter);

// 全局错误处理（必须放在所有路由之后）
app.use(errorHandler);

// 启动服务
const PORT = process.env.PORT || 2341;
app.listen(PORT, () => {
  console.log(`服务启动成功，端口：${PORT}`);
});
