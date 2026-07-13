// 定义数据库连接地址
const MONGOURL = "mongodb://127.0.0.1:27017/expressTest4Demo";

// 1. 安装包V6.0 npm i express-session connect-mongo mongodb
// 2. 引入 依赖包
const express = require("express");
const session = require("express-session");
//V5/v6新版标准写法
const MongoStore = require("connect-mongo").default;

// 3. 创建app程序
const app = express();

// 4. 设置 session 的中间件
app.use(
  session({
    //设置cookie的name，默认值是：connect.sid
    name: "sid",
    //参与加密的字符串（又称签名），加盐
    secret: "atguigu",
    //是否为每次请求都设置一个cookie用来存储session的id
    saveUninitialized: false,
    //是否在每次请求时重新保存session，生命周期,生产环境建议改为 false，减少数据库频繁写入
    resave: true,
    //数据库的连接配置
    store: MongoStore.create({
      mongoUrl: MONGOURL,
    }),
    cookie: {
      // 开启后前端无法通过 JS 操作
      httpOnly: true,
      // 这一条 是控制 sessionID 的过期时间的,1000 *300 = 300秒 =5min
      maxAge: 1000 * 300,
    },
  }),
);

// 5.1 创建 session
app.get("/login", (req, res) => {
  //假定用户名和密码都是admin，浏览器访问：http://127.0.0.1:3000/login?username=admin&password=admin
  if (req.query.username === "admin" && req.query.password === "admin") {
    req.session.username = "zhangsan";
    req.session.email = "zhangsan@qq.com";
    res.send("登录成功");
  } else {
    res.send("登录失败");
  }
});

// 5.2 获取 session
app.get("/cart", (req, res) => {
  if (req.session.username) {
    res.send(`购物车页面，欢迎您${req.session.username}`);
  } else {
    res.send(`${req.session.username}还没有登录`);
  }
});

// 5.3 销毁 session
app.get("/logout", (req, res) => {
  //销毁session
  // res.send('设置session');
  req.session.destroy((err) => {
    if (err) return res.send("退出失败");
    res.clearCookie("sid"); // 手动清除浏览器sid cookie，彻底失效
    res.send("成功退出");
  });
});

// 6 创建监听窗口
app.listen(3000, () => {
  console.log("127.0.0.1服务已经启动, 端口 " + 3000 + " 监听中...");
});
