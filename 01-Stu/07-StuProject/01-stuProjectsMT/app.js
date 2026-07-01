// 引入资源库
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const errorHandler = require("@middleware/errorHandler.js");
var logger = require("morgan");
const cors = require("cors");

// 引入session依赖库，V5/v6新版标准写法
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

// 引入路由资源
const webProjectsRouter = require("@routes/web/webProjectsRoute.pm.js");
const webAuthRouter = require("@routes/web/webAuthRoute.js");

var app = express();

// 创建视图并使用相关件
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// 使用session中间件
app.use(
  session({
    //设置cookie的name，默认值是：connect.sid
    name: process.env.SESSION_NAME,
    //参与加密的字符串（又称签名），加盐
    secret: process.env.SESSION_SECRET,
    //是否为每次请求都设置一个cookie用来存储session的id
    saveUninitialized: false,
    //是否在每次请求时重新保存session，生命周期,生产环境建议改为 false，减少数据库频繁写入
    resave: true,
    //数据库的连接配置
    store: MongoStore.create({
      mongoUrl: `mongodb://${process.env.MONGODB_DBHOST}:${process.env.MONGODB_DBPORT}/${process.env.MONGODB_DBNAME}`,
    }),
    cookie: {
      // 防XSS，前端JS无法读取cookie，安全
      httpOnly: true,
      // 这一条 是控制 sessionID 的过期时间的,,1000 *300 = 300秒 =5min,目前注销，全部由记住我选项设定
      // maxAge: 1000 * 300,
    },
  }),
);
// 使用session-flash中间件， 存储错误，根治刷新仍然错误提示
app.use(flash());
// 前端发来请求后，服务器把flash消息注入locals，传递给模板渲染
app.use((req, res, next) => {
  res.locals.errMsg = req.flash("error")[0] || null;
  next();
});

// 创建路由 主页跳转
app.get("/", (req, res) => res.redirect("/projects"));
// 创建路由 注册与登录，登出
app.use("/auth", webAuthRouter);
// 创建路由 首页项目管理
app.use("/projects", webProjectsRouter);

//创建路由 心跳交互
app.get("/heartbeat", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
    message: "Heartbeat Success Received.",
  });
});
//创建路由 404异常
app.use(function (req, res, next) {
  next(createError(404));
});

//路由异常处理,特别是Schema 校验失败、唯一索引冲突
app.use(errorHandler);

// 引入数据库连接库
const dbConnect = require("@MongoDB/config/db.js");
const { error } = require("console");
// 异步自执行函数：等待数据库连接成功后再加载路由
(async () => {
  try {
    await dbConnect();
  } catch (error) {
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();

module.exports = app;
