// 1. 同步加载基础依赖
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { toNodeHandler } = require("better-auth/node");

// 2. 加载业务路由
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// 3. 创建并立即导出 Express 实例（确保 bin/www 能同步拿到）
const app = express();
module.exports = app;

// 4. 视图引擎配置
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 5. 全局中间件（按执行顺序排列）
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 6. ⭐ Auth 委托中间件（替代原来的占位中间件）
let authHandler = null; // null 表示未就绪

app.all("/api/auth/*", (req, res, next) => {
  console.log(
    `🔍 Auth middleware hit: ${req.method} ${req.originalUrl}, handler=${!!authHandler}`,
  );
  if (!authHandler) {
    return res.status(503).json({
      error: "Service Unavailable",
      message: "Authentication service is initializing, please retry later.",
    });
  }
  // 委托给真实的 Better Auth handler
  return authHandler(req, res, next);
});

// 7. 业务路由
app.use("/index", indexRouter);
app.use("/users", usersRouter);

// 8. 404 与错误处理（必须放在所有路由之后）
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// 9. 异步初始化 Auth（简化为赋值，不再操作 _router）
(async () => {
  try {
    const { initAuth } = require("./src/utils/auth.js");
    const authInstance = await initAuth();

    // ✅ 只需一行：将真实 handler 赋给引用变量
    authHandler = toNodeHandler(authInstance);

    console.log("✅ Better-Auth 初始化完成，路由已就绪");
  } catch (err) {
    console.error("❌ Auth 初始化失败:", err);
    process.exit(1);
  }
})();

// 10. 优雅退出钩子
const { closeDb } = require("./src/models/db");

async function gracefulShutdown(signal) {
  console.log(`\n📴 Received ${signal}, closing database...`);
  try {
    await closeDb();
    console.log("✅ Database connection closed");
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
  }
  process.exit(0);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
