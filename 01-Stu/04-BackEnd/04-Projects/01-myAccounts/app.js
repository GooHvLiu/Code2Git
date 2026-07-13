// 1.1 引入必要库文件
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const cors = require("cors");

// 1.2 引入URL工具
const { getSafeRedirectUrl } = require("@middleware/urlHelper.js");

// 1.3 引入session依赖库，V5/v6新版标准写法
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

// 2. 创建项目
const app = express();

// 3. 设置views文件路径和模板
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4.1 使用中间件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// 4.2 使用session中间件
app.use(
  session({
    //设置cookie的name，默认值是：connect.sid
    name: "myaccounts_app_sid",
    //参与加密的字符串（又称签名），加盐
    secret: process.env.JWT_SECRET,
    //是否为每次请求都设置一个cookie用来存储session的id
    saveUninitialized: false,
    //是否在每次请求时重新保存session，生命周期,生产环境建议改为 false，减少数据库频繁写入
    resave: true,
    //数据库的连接配置
    store: MongoStore.create({
      mongoUrl: `mongodb://${process.env.MONGODB_DBHOST}:${process.env.MONGODB_DBPORT}/${process.env.MONGODB_DBNAME}`,
    }),
    cookie: {
      // 开启后前端无法通过 JS 操作
      httpOnly: true,
      // 这一条 是控制 sessionID 的过期时间的,1000 *300 = 300秒 =5min
      maxAge: 1000 * 300,
    },
  }),
);

// 5. 提前加载所有路由、使用路由和捕获404
app.get("/", (req, res) => res.redirect("/auth/login"));
const webMyAccountsRouter = require("@routes/web/webMainRoutes.js");
const webAuthRouter = require("@routes/web/authRoutes.js");
const apiMyAccountsRouter = require("@routes/api/apiMainRoutes.js");
const apiAuthRouter = require("@routes/api/authRoutes.js");
app.use("/myAccounts", webMyAccountsRouter);
app.use("/auth", webAuthRouter);
app.use("/api", apiMyAccountsRouter);
app.use("/api-auth", apiAuthRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

// 6. 统一错误处理中间件
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  const safeUrl = getSafeRedirectUrl(
    process.env.ACCOUNTSLIST_REDIRECT_URL,
    "error",
  );
  res.render("error", {
    msg: err,
    url: safeUrl,
    waitTime: 3000,
  });
});

// 7. 引入数据库连接库
const dbConnect = require("@MongoDB/config/db.js");
// 8. 异步自执行函数：等待数据库连接成功后再加载路由
(async () => {
  try {
    await dbConnect();
  } catch (error) {
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

module.exports = app;
