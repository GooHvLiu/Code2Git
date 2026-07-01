### myAccounts

#### 项目需求

##### 基本需求

* 练习完善的后端express环境搭建与核心架构设计
* 架构完善与搭建
* 使用lowdb/MongoDB实现数据存储与响应
* 实现查询/插入/删除/更新等标准操作
* 实现API接口搭建与测试
* 通过会话控制（Cookie/Session/Taken）实现项目登录与注册
* 模拟项目上线

##### 掌握技能

* express基本使用与环境搭建
* 环境变量设置与调用
* lowdb的基本使用
* MongoDB的基本使用
* MD5加密基本使用
* API接口设置与测试
* Cookie/Session/Taken基本使用
* 项目上线基本流程操作

#### 架构搭建

##### 安装依赖

###### 框架模板

通过generator应用生成器工具 `express-generator` 可以快速创建一个应用的骨架，首先全局安装应用生成器工具 `express-generator` ：

```cmd
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects> npm i -g express express-generator
npm warn deprecated mkdirp@0.5.1: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)

added 67 packages, and changed 10 packages in 2s

24 packages are looking for funding
  run `npm fund` for details
```

###### 创建项目

通过express -e命令生成新项目文件夹，系统会基于express-generator工具自动将基本依赖包安装好：

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects> express -e 01-myAccounts

  warning: option `--ejs' has been renamed to `--view=ejs'


   create : 01-myAccounts\
   create : 01-myAccounts\public\
   create : 01-myAccounts\public\javascripts\
   create : 01-myAccounts\public\images\
   create : 01-myAccounts\public\stylesheets\
   create : 01-myAccounts\public\stylesheets\style.css
   create : 01-myAccounts\routes\
   create : 01-myAccounts\routes\index.js
   create : 01-myAccounts\views\
   create : 01-myAccounts\views\error.ejs
   create : 01-myAccounts\views\index.ejs
   create : 01-myAccounts\app.js
   create : 01-myAccounts\package.json
   create : 01-myAccounts\bin\
   create : 01-myAccounts\bin\www

   change directory:
     > cd 01-myAccounts

   install dependencies:
     > npm install

   run the app:
     > SET DEBUG=01-myaccounts:* & npm start

PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects> cd .\01-myAccounts\
```

###### 解决跨域

- cors解决浏览器跨域请求问题
- cors允许前端应用从不同域名访问你的 API

```bash
PS C:\Users\Administrator\Desktop\01-stuProjects> npm i cors
npm warn deprecated transformers@2.1.0: Deprecated, use jstransformer
npm warn deprecated constantinople@3.0.2: Please update to at least constantinople 3.1.1
npm warn deprecated jade@1.11.0: Jade has been renamed to pug, please install the latest version of pug instead of jade

added 58 packages, removed 23 packages, and changed 30 packages in 3s

2 packages are looking for funding
  run `npm fund` for details
PS C:\Users\Administrator\Desktop\01-stuProjects> 
```

> 在app.js中使用cors
>
> ```js
> ...
> var express = require("express");
> const cors = require("cors");
> ...
> //全域开启跨域
> app.use(cors());
> ...
> ```
>

###### 自动构建

nodemon包适用于node.js环境下修改代码自动更新，无需手动再次启动服务

```js
PS C:\Users\Administrator\Desktop\01-stuProjects> npm i nodemon

added 28 packages in 2s

7 packages are looking for funding
  run `npm fund` for details
PS C:\Users\Administrator\Desktop\01-stuProjects> 
```

> - 修改package.json,实现修改后自动重新服务
>
> ```json
> "start": "node ./bin/www"
> 修改为：
> "start": "nodemon ./bin/www"
> ```
>
> - 启动服务
>
> ```bash
> > npm start
> > 客户端打开http://127.0.0.1:3000
> ```
>

###### 变量加载

为了将基本变量统一进行管理，在项目根目录下创建.env文件用于项目变量的存储，env文件的内容基本如下：

```env
# ============================================
# 服务器配置
# process.env.LISTEN_AREA: 用于设定是否在本地使用还是局域网内使用
# ============================================
PORT=3000
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# ============================================
# 局域网IP
# 自动获取的局域网IP（由 setup-env.js 自动更新）
# ============================================
LOCAL_IP=172.29.32.1

# ============================================
# 数据库配置
# ============================================
MONGODB_DBHOST=${LOCAL_IP}
MONGODB_DBPORT=27017
MONGODB_DBNAME=expressTest4Demo
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_POOL_SIZE=10
MONGODB_TIMEOUT=5000
EXIT_ON_DB_ERROR=true

# ============================================
# CORS 配置
# ============================================
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

dotenv 是一个 Node.js 的 npm 包，它的唯一作用就是：把 .env 文件里的变量加载到 process.env 对象中，每个后端服务器都有自己的环境配置等信息，可以使用dotenv包进行管理和加载。

安装 dotenv非常简单，按照以下步骤操作即可。

```cmd
PS C:\Users\Administrator\Desktop\01-stuProjects> npm i dotenv

added 1 package in 1s

8 packages are looking for funding
  run `npm fund` for details
PS C:\Users\Administrator\Desktop\01-stuProjects> 
```

> 安装好后，就可以通过创建.env文件，并在www或其他服务文件下导入即可使用。
>
> dotenv 默认不支持变量引用，若想使用变量引用，需要安装变量增强工具包
>
> > SERVER_IP=http://${LOCAL_IP}:${PORT}
> >
> > LOCAL_IP=192.168.10.148
> >
> > process.env.SERVER_IP      // "http://${LOCAL_IP}:${PORT}"  (字面量，不会解析)

###### 变量增强

dotenv 默认不支持变量引用，若想使用变量引用，需要安装变量增强工具包dotenv-expand，具体安装方式如下：

```bash
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm i dotenv-expand      

added 1 package in 1s

10 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT>
```

> 具体使用方法见变量应用章节

###### 文件操作

因为涉及到对env文件的写入操作，所以需要fs依赖的安装。

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i fs

added 1 package in 926ms

9 packages are looking for funding
  run `npm fund` for details
```

###### 数据库包

该项目统一使用LowDB/MongoDB进行数据管理。

* LowDB数据库依赖包安装

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i lowdb@1.0.0

added 6 packages in 2s

9 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts>
```

> 目前使用不要使用最新版本，因为最新版本需要ES6语法，为了简单操作，可以选用1.0.0，具体下载、安装、使用网址如下：https://www.npmjs.com/package/lowdb/v/1.0.0

MongoDB需要使用mongoose包进行管理

```cmd
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm i mongoose

added 18 packages in 3s

9 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> 
```

###### 唯一标识

因为LowDB没有自建唯一ID，此处在使用LowDB时，需要使用nanoid进行ID的设置，需要进行安装：

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i nanoid

added 1 package in 846ms

10 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> 
```

###### 加解密包

密码保存/密码对比需要进行加密和解密工作，此项目使用bcryptjs包：

```js
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i bcryptjs

added 1 package in 791ms

10 packages are looking for funding
  run `npm fund` for details
```

###### 路径混乱

moduleAliases是第三方库，可以配置package.json后实现路径引用问题，具体安装方式如下：

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i module-alias

added 1 package in 802ms

10 packages are looking for funding
  run `npm fund` for details
```

> * 路径映射
>   * package.json配置如下：
>
> ```json
> "_moduleAliases": {
>     "@bin": "./bin",
>     "@middleware": "./middleware",
>     "@public": "./public",
>     "@routes": "./routes",
>     "@views": "./views",
>     "@MongoDB": "./src/database/MongoDBV2dot1"
>   }
> ```
>
> * 引用路径
>   * 按照如下方式使用：
>
> ```js
> const expend = require("@middleware/listenExpend.js");
> ```

###### 签发校验

`jsonwebtoken` 是 Node.js 最主流 JWT 签发 / 校验库，用于**无状态登录鉴权**，项目里登录生成 token、`authMiddleware` 校验 token 全依赖它。

```js
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i jsonwebtoken       

up to date in 646ms

10 packages are looking for funding
  run `npm fund` for details
```

###### 时间格式

**Day.js** 是一个**极简、快速、2KB**的 JavaScript 日期处理库，专为现代浏览器和 Node.js 环境设计。本案例针对于数据库存储的关于时间戳的转换为可视化的格式。

```bash
# npm
npm install dayjs
# 项目引入
const dayjs = require('dayjs');
```

核心使用语法及案例如下：

```js
// 1. 当前时间
const now = dayjs()

// 2. ISO/标准字符串
dayjs('2026-06-19')
dayjs('2026-06-19 20:30:15')
dayjs('2026-06-19T20:30:15+08:00')

// 3. 毫秒时间戳（13位）
dayjs(1781890215000)

// 4. 原生 Date 对象
dayjs(new Date())

// 5. 数组 [年,月(0开始),日,时,分,秒]
dayjs([2026, 5, 19]) // 6月19日（月份0=1月）

// 6. 以下为格式化常用语法
const d = dayjs('2026-06-19 08:05:09')
d.format() // 默认ISO：2026-06-19T08:05:09+08:00
d.format('YYYY-MM-DD') // 2026-06-19
d.format('YYYY年MM月DD日 HH:mm:ss') // 2026年06月19日 08:05:09
d.format('x') // 毫秒时间戳 1781890215000
d.format('X') // 秒级时间戳 1781890215
```

###### 会话控制

在express架构上使用session会话控制，需要安装两个依赖包，分别为express-session connect-mongo，安装方式如下：

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i express-session connect-mongo

added 14 packages in 2s

12 packages are looking for funding
  run `npm fund` for details
```

> 具体使用方式如下:
>
> ```js
> const session = require("express-session");
> //V5/v6新版标准写法
> const MongoStore = require("connect-mongo").default;
> ......
> // 4. 设置 session 的中间件
> app.use(
>   session({
>     //设置cookie的name，默认值是：connect.sid
>     name: "sid",
>     //参与加密的字符串（又称签名），加盐
>     secret: "atguigu",
>     //是否为每次请求都设置一个cookie用来存储session的id
>     saveUninitialized: false,
>     //是否在每次请求时重新保存session，生命周期,生产环境建议改为 false，减少数据库频繁写入
>     resave: true,
>     //数据库的连接配置
>     store: MongoStore.create({
>       mongoUrl: MONGOURL,
>     }),
>     cookie: {
>       // 开启后前端无法通过 JS 操作
>       httpOnly: true,
>       // 这一条 是控制 sessionID 的过期时间的,1000 *300 = 300秒 =5min
>       maxAge: 1000 * 300,
>     },
>   }),
> );
> 
> // 5.1 创建 session
> app.get("/login", (req, res) => {
>   //假定用户名和密码都是admin，浏览器访问：http://127.0.0.1:3000/login?username=admin&password=admin
>   if (req.query.username === "admin" && req.query.password === "admin") {
>     req.session.username = "zhangsan";
>     req.session.email = "zhangsan@qq.com";
>     res.send("登录成功");
>   } else {
>     res.send("登录失败");
>   }
> });
> 
> // 5.2 获取 session
> app.get("/cart", (req, res) => {
>   if (req.session.username) {
>     res.send(`购物车页面，欢迎您${req.session.username}`);
>   } else {
>     res.send(`${req.session.username}还没有登录`);
>   }
> });
> 
> // 5.3 销毁 session
> app.get("/logout", (req, res) => {
>   //销毁session
>   // res.send('设置session');
>   req.session.destroy((err) => {
>     if (err) return res.send("退出失败");
>     res.clearCookie("sid"); // 手动清除浏览器sid cookie，彻底失效
>     res.send("成功退出");
>   });
> });
> ```

###### 端口释放

日常开发会出现端口被占用的情况，处理起来比较麻烦，可以通过如下依赖包快速释放端口：

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-BackEnd\06-Projects\01-myAccounts> npm i -g kill-port

added 3 packages in 2s
```

> * 手动清理
>   * 在项目中可以通过`kill-port 3000`释放端口
>
> * 自动清理
>   * 启动脚本增加自动清理，package.json 配置：
>
> ```json
> "scripts": {
>   "dev": "kill-port 3000 && node app.js"
> }
> ```
>
> > node app.js可以替换为实际的启动文件

##### 局域上线

为了后续项目拓展性，在此时，即可将项目设置为局域网可访问模式，基本设置围绕以下几点：

* 监听端口为新创建，不与其他项目冲突
* 监听区域设置为0.0.0.0

###### 上线服务

重新设计端口号，与其他服务不同即可，修改www文件如下所示。

```js
//电脑设置设置参考Coding Note.md
...
/**
   * Get port from environment and store in Express.
   * 原来是：var port = normalizePort(process.env.PORT || "3000");
   * 现在是：var port = normalizePort(process.env.PORT || "1234");
   */

  var port = normalizePort(process.env.PORT || "1234");

  app.set("port", port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  /**
   * 原来为server.listen(port)，现更改为server.listen(port,'0.0.0.0').
   */
  server.listen(port, "0.0.0.0");
  server.on("error", onError);
  server.on("listening", onListening);
...
```

> 查询服务器IP地址方法：
>
> > - 按 Win + R，输入 cmd 打开命令提示符
> > - 输入命令：ipconfig
> > - 找到 IPv4 地址，通常是 192.168.x.x 格式，例如192.168.10.148
>
> > 防火墙设置端口方法：
>
> - 打开"控制面板" → "Windows Defender 防火墙"
> - 点击"高级设置"
> - 点击"入站规则" → "新建规则"
> - 选择"端口" → 下一步
> - 选择"TCP"，特定本地端口输入 1234 → 下一步
> - 选择"允许连接" → 下一步
> - 勾选"域"、"专用"、"公用" → 下一步
> - 输入规则名称（如"Node.js 1234"）→ 完成

截止到目前，通过npm start命令，项目可以通过IP+Port方式访问，整体架构已经搭建成功

###### 引用变量

通过环境变量设置以及引用，可以直接无需修改代码的技术上进行项目设置，对www文件进行如下设置：

```js
//通过使用dotenv-expand，实现对项目上线的基本设置
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
...
var port = normalizePort(process.env.PORT || "3000");
...
const LISTEN_AREA = process.env.LISTEN_AREA;
...
server.listen(port, LISTEN_AREA);
```

##### 增强方案

增强方案均是针对bin/www文件执行的，最终封装为类进行引入使用。

###### 显示脚本

在项目启动前进行对网络的检查与显示，并对env文件的写入动作，实现服务器启动即显示相关信息。

* 创建启动前置脚本setup-env.js文件

```js
#!/usr/bin/env node
/**
 * 启动前配置脚本
 * 1. 获取局域网IP
 * 2. 读取现有的 .env 文件
 * 3. 更新或添加 LOCAL_IP 环境变量
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
// 主函数
function setupEnv() {
  console.log("🔧 开始配置环境变量...");

  // 获取局域网IP
  const localIP = getLocalIP();
  console.log(`🌐 检测到局域网IP: ${localIP}`);

  // 读取现有 .env 文件
  const envContent = readEnvFile();

  // 更新 LOCAL_IP 环境变量
  const updatedContent = updateEnvContent(envContent, "LOCAL_IP", localIP);

  // 写入 .env 文件
  writeEnvFile(updatedContent);

  console.log("✅ 环境变量配置完成！");
  console.log(`💡 LOCAL_IP = ${localIP}`);
}

// 获取局域网IP地址
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let localIP = "127.0.0.1";

  Object.keys(interfaces).forEach((interfaceName) => {
    interfaces[interfaceName].forEach((info) => {
      // 只获取IPv4且非内部（非127.0.0.1）的IP
      if (info.family === "IPv4" && !info.internal) {
        localIP = info.address;
      }
    });
  });

  return localIP;
}

// 读取 .env 文件内容
function readEnvFile() {
  const envPath = path.join(__dirname, "../.env");
  //不使用try/catch方式，如果读取不到.env文件直接报错，不再继续执行下去
  return fs.readFileSync(envPath, "utf8");
}

// 更新或添加环境变量
function updateEnvContent(content, key, value) {
  const lines = content.split("\n");
  const keyPattern = new RegExp(`^${key}=`);
  let found = false;
  let updatedLines = [];

  lines.forEach((line) => {
    if (line.trim().startsWith("#") || line.trim() === "") {
      updatedLines.push(line);
      return;
    }

    if (keyPattern.test(line)) {
      updatedLines.push(`${key}=${value}`);
      found = true;
    } else {
      updatedLines.push(line);
    }
  });

  if (!found) {
    updatedLines.push(`${key}=${value}`);
  }

  return updatedLines.join("\n");
}

// 写入 .env 文件
function writeEnvFile(content) {
  const envPath = path.join(__dirname, "../.env");
  fs.writeFileSync(envPath, content, "utf8");
  console.log(`✅ .env 文件已更新: ${envPath}`);
}

// 执行配置
setupEnv();

```

###### 优雅关闭

在服务关闭的时候，提示是何种关闭事件及对应的处理，封装在www-expend.js/ExpendFUnction类中：

```js
/**
   * 新增，优雅关闭服务器
   */
  setupGracefulShutdown(server) {
    const signals = {
      SIGINT: "Terminal Interruption (Ctrl+C)",
      SIGTERM: "Termination Signal",
      SIGQUIT: "Exit Signal",
    };

    Object.keys(signals).forEach((signal) => {
      process.on(signal, () => {
        console.log(
          `\n ⚠️  ShutdownMsg:Get ${signals[signal]}, Shutting Down the Server...`,
        );

        // 停止接收新请求
        server.close(() => {
          console.log("\n ⚠️  ShutdownMsg:The HTTP Server Has Been Shut Down.");
        });

        // 设置超时，强制退出
        setTimeout(() => {
          console.error("\n ⚠️  ShutdownMsg:Close timeout, Force Exit");
          process.exit(1);
        }, 10000);

        // 拒绝新连接
        server.on("close", () => {
          console.log("\n ⚠️  ShutdownMsg:All Connections Have Been Closed.");
        });
      });
    });
  }
```

###### 调试信息

创建调试及提示信息打印到窗口，封装在www-expend.js/debugMsg类中：

```js
/**
   * 新增，调试及提示信息
   */
  debugMsg(addr) {
    // 使用彩色日志
    const colors = {
      reset: "\x1b[0m",
      green: "\x1b[32m",
      blue: "\x1b[34m",
      yellow: "\x1b[33m",
      red: "\x1b[31m",
      cyan: "\x1b[36m",
    };
    console.log("\n" + "=".repeat(50));
    console.log(`${colors.green}🚀 Server Startup Successful!${colors.reset}`);
    console.log("=".repeat(50));

    console.log(
      `${colors.blue}📡 Environment: ${colors.reset}${process.env.NODE_ENV || "development"}`,
    );
    console.log(`${colors.blue}📡 Ports: ${colors.reset}${addr.port}`);
    console.log(`${colors.blue}📡 Process ID: ${colors.reset}${process.pid}`);
    console.log(`${colors.blue}📡 SERVER IP: ${process.env.LOCAL_IP}`);

    console.log(`\n${colors.cyan}📍 Access Address:${colors.reset}`);
    console.log(
      `   • Local Address:    ${colors.yellow}http://localhost:${addr.port}${colors.reset}`,
    );
    console.log(
      `   • Local IP:    ${colors.yellow}${process.env.SERVER_IP}${colors.reset}`,
    );
  }
```

###### 请求超时

添加请求超时配置，防止请求挂起，封装在www-expend.js/serverSetTimeOut类中：

```js
  /**
   * 新增：添加请求超时配置，防止请求挂起
   */
  serverSetTimeOut(server) {
    server.setTimeout(120000); // 120秒
    server.keepAliveTimeout = 65000; // 65秒
    server.headersTimeout = 66000; // 66秒
  }
}
```

###### 错误日志

添加错误日志增强方案。

```js
/**
   * 新增：服务器错误增强,放在www/function onError(error){}内
   */
  serverOnError(server) {
    if (error.syscall !== "listen") {
      console.error("❌ 服务器错误:", error);
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    const colors = {
      red: "\x1b[31m",
      reset: "\x1b[0m",
    };

    switch (error.code) {
      case "EACCES":
        console.error(`${colors.red}${bind} 需要管理员权限${colors.reset}`);
        console.error("💡 解决方法: 使用 sudo 运行或更换端口");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${colors.red}${bind} 端口已被占用${colors.reset}`);
        console.error("💡 解决方法:");
        console.error(
          "   1. 查找占用进程: lsof -i :1234 (macOS/Linux) 或 netstat -ano | findstr :1234 (Windows)",
        );
        console.error(
          "   2. 杀死进程: kill -9 <PID> 或 taskkill /PID <PID> /F",
        );
        console.error("   3. 或者修改端口号");
        process.exit(1);
        break;
      case "EADDRNOTAVAIL":
        console.error(`${colors.red}${bind} 地址不可用${colors.reset}`);
        process.exit(1);
        break;
      default:
        console.error(`${colors.red}未知错误: ${error.message}${colors.reset}`);
        throw error;
    }
  }
```

###### 方案实施

* 显示脚本的功能模块实施方案：
  * 修改package.json文件，将setup-env.js在项目www启动前启动，使用npm命令，仅启动一次即可：

```json
"scripts": {
    "setup": "node ./bin/setup-env.js",
    "start": "npm run setup && nodemon ./bin/www",
    "prod": "npm run setup && NODE_ENV=production node ./bin/www"
  }
```

* 优雅关闭的功能模块实施方案：
  * 修改www/放在function onListening(){}内

```js
const expend = require("./www-expend.js");
...
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  // 新增：优雅关闭处理
  expend.setupGracefulShutdown(server);
}
```

* 调试信息的功能模块实施方案：
  * 修改www/放在function onListening(){}内

```js
const expend = require("./www-expend.js");
...
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  //新增：调试及提示窗口
  expend.debugMsg(addr);
  //新增: 请求超时
  expend.serverSetTimeOut(server);
}
```

* 请求超时的功能模块实施方案：
  * 修改www/放在function onListening(){}内

```js
const expend = require("./www-expend.js");
...
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  //新增: 请求超时
  expend.serverSetTimeOut(server);
}
```

* 错误日志的功能模块实施方案：
  * 修改www/放在function onError(error){}内

```js
const expend = require("./www-expend.js");
...
function onError(error) {
  expend.serverOnError(error);
}
```

#### 数据搭建

##### 数据库包

本项目使用MongoDB方案实现，直接引入MongoDB-V2.0标准模块使用即可，无需更多建表与操作js包。

##### 路径配置

为了彻底解决路径混乱的问题，本项目采用module-alias包方案，所以在根目录/package.json配置路径如下：

```json
  "_moduleAliases": {
    "@bin": "./bin",
    "@public": "./public",
    "@routes": "./routes",
    "@views": "./views",
    "@config": "./src/database/MongoDBV2dot1/config",
    "@controllers": "./src/database/MongoDBV2dot1/controllers",
    "@middleware": "./src/database/MongoDBV2dot1/middleware",
    "@models": "./src/database/MongoDBV2dot1/models",
    "@services": "./src/database/MongoDBV2dot1/services",
    "@utils": "./src/database/MongoDBV2dot1/utils"
  }
```

> mongoDB原生支持该包方案，项目文件对应核心文件修改引用和路径。
>
> www文件引入：require("module-alias/register");

##### 环境变量

由于引用MongoDB-V2.0包，需要将环境变量增加部分常量使用：

```env
# ============================================
# 服务器配置
# process.env.LISTEN_AREA: 用于设定是否在本地使用还是局域网内使用
# ============================================
PORT=3000
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# ============================================
# 局域网IP
# 自动获取的局域网IP（由 setup-env.js 自动更新）
# ============================================
LOCAL_IP=172.23.112.1

# ============================================
# MONGODB数据库配置
# ============================================
MONGODB_DBHOST=${LOCAL_IP}
MONGODB_DBPORT=27017
MONGODB_DBNAME=myaccounts
MONGODB_USERCOLLECTION=users
MONGODB_ACCOUNTSCOLLECTION=accounts
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_POOL_SIZE=10
MONGODB_TIMEOUT=5000
EXIT_ON_DB_ERROR=true

# ============================================
# LOWDB数据库配置
# ============================================
LOWDB_DBNAME=expressTest4Demo

# ============================================
# JWT 配置
# JWT_EXPIRES 合法过期时间：s秒 m分 h时 d天
# ============================================
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-too
JWT_EXPIRES=2h

# ============================================
# CORS 配置
# ============================================
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

##### 用户数据

由于该项目既有用户登录，还有记账数据，所以，数据结构存在两种：

###### 用户数据

修改MongoDB/models/Users.model.js内的数据结构是否满足需求，因为该数据库是基于该项目抽离出来的标准模组，所以，该数据库的数据结构原生支持，此处无需修改：

```js
// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "用户名不能为空"],
    unique: true,
    trim: true,
    minlength: [3, "用户名至少3个字符"],
    maxlength: [30, "用户名最多30个字符"],
    index: true, // 单字段索引，加速查询
  },
  password: {
    type: String,
    required: [true, "密码不能为空"],
    minlength: [6, "密码至少6个字符"],
    //select: false, // 默认不返回密码字段
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});
```

###### 创建用户

使用MongoDB-V2.0/test4Using/test4dbOperater.js优先创建如下用户用于测试使用：

```js
......
// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.2  调用创建一个用户方法
  await createUser();
}

// 创建单个用户
async function createUser() {
  const userObject = {
    username: `zhouba`,
    password: `zhouba123`,
    role: "user",
    lastLogin: Date.now(),
    loginCount: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: true,
  };
  console.log(await usersService.createUser(userObject));
}
......
```

##### 记账数据

###### 账目数据

修改MongoDB/models/Accounts.model.js内的数据结构:

```js
// 2. 创建文档的结构对象，设置集合中文档的属性以及属性值的类型
const usersSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true,
    index: true, // 单字段索引，加速查询
  },
  type: {
    type: Number,
    enum: [-1, 1],
    required: true,
    default: -1,
  },
  account: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});
```

###### 创建账目

使用MongoDB-V2.0/test4Using/test4dbOperater4Accounts.js优先创建如下用户用于测试使用：

```js
......
// 3. 进行services纯数据库操作工作
async function dbOperate() {
  // 3.2  调用创建一个用户方法
  await createAccount();
......
// 创建单个账目
async function createAccount() {
  const accountObject = {
    item: "给培训机构做宣传",
    type: 1,
    account: 132,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    remarks: "趁着暑假赚点钱买手机",
    isDeleted: false,
  };
  console.log(await accountsService.createAccount(accountObject));
}
```

##### 数据预览

```text
myaccounts
 ┣ accounts/                    # 账目数据库集合
 ┃ ┗ Documents 4                # 账目数据
 ┣ users/                       # 用户数据库集合
 ┃ ┗ Documents 6                # 用户数据
```

###### 账目数据

```json
{
  _id: ObjectId('6a351d0044b4afdf71670975'),
  item: '去麦当劳打工',
  type: NumberInt('1'),
  account: NumberInt('302'),
  createdAt: ISODate('2026-06-19T10:42:08.160Z'),
  updatedAt: ISODate('2026-06-19T10:42:08.160Z'),
  remarks: '趁着暑假赚点钱买手机',
  isDeleted: false,
  __v: NumberInt('0')
}
```

###### 用户数据

```json
{
  _id: ObjectId('6a3516ee86bef8667df42c7d'),
  username: 'zhangsan',
  password: '$2b$10$MSIjLHihAM5cfNmRT8XSSuYix0xeAz91mNDf7myl6ly0NqrZMaKiK',
  role: 'admin',
  lastLogin: ISODate('2026-06-19T10:16:14.499Z'),
  loginCount: NumberInt('1'),
  createdAt: ISODate('2026-06-19T10:16:14.499Z'),
  updatedAt: ISODate('2026-06-19T10:16:14.499Z'),
  isDeleted: true,
  __v: NumberInt('0')
}
```

#### 核心功能

##### 账单显示

###### 创建路由

删除routes/user.js文件、创建routes/web和routes/api文件夹，将index.js放入web路径下，修改app.js文件如下：

```js
......
var indexRouter = require("./routes/web/index");
app.use("/", indexRouter);
......
```

###### 修改路由

该项目会存在如下功能模块：

* Read     显示事项
* Create   增加事项

* Delete   删除事项
* Update  修改事项

```js
//使用RESTFUL风格创建对应路由，render后面的连接views后续可能会修改
//Read设置记账本列表路由
router.get(["/", "myAccounts"], function (req, res, next) {
  res.render("accountsList");
});

//Create创建账目路由
router.post("/create", function (req, res, next) {
  res.render("createAccount");
});

//Delete删除账目路由
router.get("/delete/:id", function (req, res, next) {
  res.render("DeleteAccount");
});

//Update更新账目路由
router.get("/update/:id", function (req, res, next) {
  res.render("Updateaccount");
});
```

###### 数据连接

在app.js文件内创建数据库连接，并将创建路由及相关操作都放在创建数据成功内实现，确保后续操作都在数据连接的基础上：

```js
......
// 5. 引入数据库连接库
const dbConnect = require("@config/db.js");
// 6. 异步自执行函数：等待数据库连接成功后再加载路由
(async () => {
  try {
    // 6.1 尝试连接数据库
    await dbConnect();
    // 6.2 连接数据库后，执行路由相关操作
    const indexRouter = require("@routes/web/index.js");
    app.use("/", indexRouter);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  } catch (error) {
    // 2.3 数据库如果连接失败做提示，并进行错误后操作,退出程序，不再提供服务
    console.log("主程序获取连接错误：" + error);
    process.exit(1);
  }
})();
......
```

###### 获取数据

在index.js的get(["/", "myAccounts"]...)路由中创建获取路由，为了实现分页效果，需要向数据库请求时，获取当前页面、每页条数、总页数、总数据量，具体代码如下：

```js
......
const accountsController = require("@controllers/accounts.controller.js");
......
//Read设置记账本列表路由
router.get(["/", "myAccounts"], async function (req, res, next) {
  try {
    const result = await accountsController.getAccountsListData(req);
    /* 
    // 1. 单条传送的示例
    res.render("accountsList", {
      accounts: result.list,
      dayjs: dayjs,
    }); */
    // 2. 全部传送的示例
    res.render("accountsList", {
      accounts: result.list,
      page: result.page, // 当前页码
      limit: result.limit, // 每页条数
      pages: result.pages, // 总页数
      total: result.total, // 总数据量
      dayjs: dayjs,
    });
  } catch (err) {
    next(err); // 异常交给全局错误中间件处理
  }
});
```

###### 分页显示

在accountsList.ejs文件中，增加分页显示代码：

```ejs
<!-- 分页区域 start -->
<div class="text-center">
  <nav>
    <ul class="pagination">
      <!-- 上一页 -->
      <% if(page > 1){ %>
        <li>
          <a href="?page=<%= page - 1 %>">上一页</a>
        </li>
      <% }else{ %>
        <li class="disabled"><span>上一页</span></li>
      <% } %>

      <!-- 循环输出所有页码 -->
      <% for(let i = 1; i <= pages; i++){ %>
        <li class="<%= i === page ? 'active' : '' %>">
          <a href="?page=<%= i %>"><%= i %></a>
        </li>
      <% } %>

      <!-- 下一页 -->
      <% if(page < pages){ %>
        <li>
          <a href="?page=<%= page + 1 %>">下一页</a>
        </li>
      <% }else{ %>
        <li class="disabled"><span>下一页</span></li>
      <% } %>
    </ul>
  </nav>
  <p>共 <%= total %> 条数据，每页 <%= limit %> 条，当前第 <%= page %> / <%= pages %> 页</p>
</div>
```

> 截止到目前，完善了Read功能，但还没有增加用户权限的功能，该功能会在后期进行增加

##### 创建账单

###### 创建页面

* views/下已创建createAccount.ejs，将对应所需文件放入public内，请注意路径引用问题，具体代码：

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.css"
      rel="stylesheet"
    />
    <style>
    label {
      font-weight: normal;
    }
    .panel-body .glyphicon-remove,
    .panel-body .glyphicon-pencil {
      display: none;
    }
    .panel-body:hover .glyphicon-remove,
    .panel-body:hover .glyphicon-pencil {
      display: inline-block;
    }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-lg-8 col-lg-offset-2">
          <div class="row">
            <h2 class="col-xs-6" style="margin-top: 10px;">记账本</h2>
            <div class="col-xs-6 text-right" style="margin-top: 10px;" >
              <a href="/create" class="btn btn-primary" >添加账单</a>
            </div>
          </div>
          <hr />
          <div class="accounts">
            <% accounts.forEach(item=>{ %>
            <div class="panel <%= item.type===-1 ? 'panel-danger':'panel-success' %>">
              <div class="panel-heading"><%= dayjs(item.updatedAt).format('YYYY-MM-DD') %></div>
              <div class="panel-body">
                <div class="col-xs-6"><%= item.item %></div>
                <div class="col-xs-2 text-center">
                  <span class="label <%= item.type===-1 ? 'label-warning':'label-success' %>"
                    ><%= item.type===-1 ? '支出':'收入' %></span
                  >
                </div>
                <div class="col-xs-2 text-right"><%= item.account %> 元</div>
                <div class="col-xs-2 text-right">
                  <!-- 修改按钮 -->
                  <a class="editBtn" href="/edit/<%= item._id %>" style="margin-right:25px;">
                    <span class="glyphicon glyphicon-pencil" aria-hidden="false"></span>
                  </a>
                <!-- 删除按钮 -->
                  <a class="delBtn" href="/delete/<%= item._id %>">
                    <span
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                  ></span>
                  </a>
                </div>
              </div>
            </div>
            <% }) %>
          </div>
        </div>
      </div>
    </div>
    <hr>
<!-- 分页区域 start -->
<div class="text-center">
  <nav>
    <ul class="pagination">
      <!-- 上一页 -->
      <% if(page > 1){ %>
        <li>
          <a href="?page=<%= page - 1 %>">上一页</a>
        </li>
      <% }else{ %>
        <li class="disabled"><span>上一页</span></li>
      <% } %>

      <!-- 循环输出所有页码 -->
      <% for(let i = 1; i <= pages; i++){ %>
        <li class="<%= i === page ? 'active' : '' %>">
          <a href="?page=<%= i %>"><%= i %></a>
        </li>
      <% } %>

      <!-- 下一页 -->
      <% if(page < pages){ %>
        <li>
          <a href="?page=<%= page + 1 %>">下一页</a>
        </li>
      <% }else{ %>
        <li class="disabled"><span>下一页</span></li>
      <% } %>
    </ul>
  </nav>
  <p>共 <%= total %> 条数据，每页 <%= limit %> 条，当前第 <%= page %> / <%= pages %> 页</p>
</div>
<!-- 分页区域 end -->
  </body>
  <script>
    //获取所有的Btn
    let delBtn=document.querySelectorAll('.delBtn');

    //绑定点击事件
    delBtn.forEach(item=>{
      item.addEventListener('click',function(e){
        if(confirm('您确定要删除么？')){
          return true;
        }else{
          //阻止默认行为
          e.preventDefault();
          
        }
      })
    })
  </script>
</html>

```

* views/下创建success.ejs文件，主要用于成功提示：

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>提醒</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.css"
      rel="stylesheet"
    />
    <style>
      .h-50 {
        height: 50px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="h-50"></div>
      <div class="alert alert-success" role="alert">
        <h1>:) <%= msg %></h1>
        <p><a href="<%= url %>">Click to Jump</a></p>
      </div>
    </div>
  </body>
</html>

```

* views/下创建error.ejs文件，主要用于失败提示：

```ejs
<h1><%= message %></h1>
<h2><%= error.status %></h2>
<pre><%= error.stack %></pre>
<p><a href="<%= url %>">Click to Jump</a></p>
```

###### 创建路由

在index.js文件中创建两个路由，分别为创建页面的路由和提交数据的路由，在数据获取与数据判断，数据展示上，进行了深度的优化，针对异步操作做了try catch判断，具体如下：

```js
//Create创建账目页面路由
router.get("/create", function (req, res, next) {
  res.render("createAccount");
});

// Create创建账目提交路由
router.post("/createAccount", async function (req, res, next) {
  try {
    const resData = await accountsController.createAccountData(req.body);

    // 判断业务状态码
    if (resData.type === 1) {
      // 成功：渲染成功页面，可携带创建后的账目数据
      res.render("success", {
        msg: "Create Account Success!",
        url: "/",
      });
    } else {
      // type=-1 创建失败，渲染失败提示页
      res.render("fail", {
        msg: resData.msg,
        url: "/createAccount",
      });
    }
  } catch (globalErr) {
    // 兜底捕获意外异常（controller内部理论不会走到这里）
    res.render("fail", {
      msg: "服务器异常，创建失败",
      url: "/",
    });
  }
});
```

> 截止到目前，完善了Read/Create功能。

##### 删除账单

###### 创建页面

在静态页面设计之初，就已经将删除button的跳转设置为如下：

```ejs
<div class="col-xs-2 text-right"><%= item.account %> 元</div>
    <div class="col-xs-2 text-right">
      <a class="delBtn" href="/delete/<%= item._id %>">
        <span
        class="glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
      </a>
    </div>
```

> 将点击删除的跳转连接带上对应的id。

###### 创建路由

基于跳转标签的设定进行路由的创建如下：

```js
//Delete删除账目路由
router.get("/delete/:id", async function (req, res, next) {
  try {
    const delData = await accountsController.deleteUserData(req);
    if (delData.type === 1) {
      res.render("success", {
        msg: "Delete Account Success!",
        url: "/",
      });
    } else {
      res.render("fail", {
        msg: delData.msg,
        url: "/",
      });
    }
  } catch (error) {
    res.render("fail", {
      msg: "删除失败",
      url: "/",
    });
  }
});
```

> 截至目前，完成Read/Create/Delete方法的实现

##### 修改账单

###### 创建页面

* views/下创建editAccount.ejs文件，主要用于数据的修改：

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>修改记录</title>
  <link href="/css/bootstrap.css" rel="stylesheet" />
  <link href="/css/bootstrap-datepicker.css" rel="stylesheet" />
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-lg-offset-2">
        <h2>修改记录</h2>
        <hr />
        <!-- 修改提交接口 /update/账单id -->
        <form method="post" action="/edit/<%= data._id %>">
          <div class="form-group">
            <label for="item">事项</label>
            <input name="item" type="text" class="form-control" id="item" value="<%= data.item %>" />
          </div>
          <div class="form-group">
            <label for="time">发生时间</label>
            <input name="time" type="text" class="form-control" id="time" value="<%= dayjs(data.updatedAt).format('YYYY-MM-DD') %>" />
          </div>
          <div class="form-group">
            <label for="type">类型</label>
            <select name="type" class="form-control" id="type">
              <option value="-1" <%= data.type === -1 ? 'selected' : '' %>>支出</option>
              <option value="1" <%= data.type === 1 ? 'selected' : '' %>>收入</option>
            </select>
          </div>
          <div class="form-group">
            <label for="account">金额</label>
            <input name="account" type="text" class="form-control" id="account" value="<%= data.account %>" />
          </div>
          <div class="form-group">
            <label for="remarks">备注</label>
            <textarea name="remarks" class="form-control" id="remarks"><%= data.remarks %></textarea>
          </div>
          <hr />
          <button type="submit" class="btn btn-primary btn-block">保存修改</button>
          <!-- 增加返回列表按钮，可选 -->
          <a href="/" class="btn btn-default btn-block" style="margin-top:10px;">返回账单列表</a>
        </form>
      </div>
    </div>
  </div>
  <script src="/js/jquery.min.js"></script>
  <script src="/js/bootstrap.min.js"></script>
  <script src="/js/bootstrap-datepicker.min.js"></script>
  <script src="/js/bootstrap-datepicker.zh-CN.min.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

###### 创建路由

需要创建两个路由，一个路由是编辑页面，一个是提交后的结果响应页面，index.js具体路由如下：

```js
//Update更新账目页面路由 req.parms.id
router.get("/edit/:id", async function (req, res, next) {
  try {
    const findByIdData = await accountsController.findAccountByIdData(
      req.params.id,
    );
    console.log(findByIdData);

    if (findByIdData.type === 1) {
      res.render("editAccount", {
        data: findByIdData.data,
        dayjs: dayjs,
      });
    }
  } catch (error) {
    res.render("fail", {
      msg: "Update Fail.",
      url: "/",
    });
  }
});

//Update更新账目提交路由 req.parms.id,req.body
router.post("/edit/:id", async function (req, res, next) {
  try {
    const UpdateByIdData = await accountsController.updateAccountByIdData(
      req.params.id,
      req.body,
    );
    if (UpdateByIdData.type === 1) {
      res.render("success", {
        msg: "Update Account Success!",
        url: "/",
      });
    }
  } catch (error) {
    res.render("fail", {
      msg: "Update Fail.",
      url: "/",
    });
  }
});
```

#### 基本功能

##### api接口

app.js文件引入api/myAccounts.js并同步更改路由名称，具体如下：

```js
// 6.2 连接数据库后，执行路由相关操作s
    const webMyAccountsRouter = require("@routes/web/myAccounts.js");
    const apiMyAccountsRouter = require("@routes/api/myAccounts.js");
    app.use("/", webMyAccountsRouter);
    app.use("/api", apiMyAccountsRouter);
```

> 对应web和api的文件名称和引用都已更改

###### 新增路由

新增如下路由，具体代码见路由详细描述：

```js
//ReadAll读取记账本列表路由  数据库直接返回前端需求 0000/1001/1002
router.get("/myAccounts", async function (req, res, next) {
});

// CreateOne创建账目提交路由  数据库直接返回前端需求  req.body 0000/1101/1102
router.post("/createAccount", async function (req, res, next) {
});

//DeleteOne删除账目路由  数据库直接返回前端需求   req.parms.id 0000/1201/1202
router.delete("/delete/:id", async function (req, res, next) {
});

//UpdateOne更新账目提交路由 req.parms.id,req.body 0000/1301/1302
router.patch("/edit/:id", async function (req, res, next) {
});

//ReadOne读取某一记账本的账目路由  数据库直接返回前端需求 0000/1401/1402
router.get("/account/:id", async function (req, res, next) {
});
```

###### 账单显示

账单显示对应ReadAll：

```js
//ReadAll读取记账本列表路由  数据库直接返回前端需求 0000/1001/1002
router.get("/myAccounts", async function (req, res, next) {
  try {
    await accountsController.getAccountsList(req, res);
  } catch (err) {
    res.json({
      code: "1002",
      msg: "程序异常报错",
      data: err,
    });
  }
});
```

> 使用Apipost测试：
>
> GET-172.20.240.1:3000/api/myAccounts

###### 创建账单

创建账单对应CreateOne：

```js
//CreateOne创建账目提交路由  数据库直接返回前端需求  req.body 0000/1101/1102
router.post("/createAccount", async function (req, res, next) {
  try {
    await accountsController.createAccount(req, res);
  } catch (err) {
    // 兜底捕获意外异常（controller内部理论不会走到这里）
    res.json({
      code: "1101",
      msg: "程序异常报错",
      data: globalErr,
    });
  }
});
```

> 使用Apipost测试：
>
> GET-172.20.240.1:3000/api/createAccount
>
> ```json
> {
>     "item":"又亏空了2",
>     "time":"2026-05-25",
>     "type":-1,
>     "account":185,
>     "remarks":"又打赌输光了"
> 
> }
> ```

###### 删除账单

删除账单对应DeleteOne：

```js
//DeleteOne删除账目路由  数据库直接返回前端需求   req.parms.id 0000/1201/1202
router.delete("/delete/:id", async function (req, res, next) {
  try {
    await accountsController.deleteAccount(req, res);
  } catch (error) {
    res.json({
      code: "1202",
      msg: "程序异常报错",
      data: error,
    });
  }
});
```

> 使用Apipost测试：
>
> GET-172.20.240.1:3000/api/delete/6a37d3ce09e444a41ce8f1e6

###### 修改账单

修改账单对应UpdateOne：

```js
//UpdateOne更新账目提交路由 req.parms.id,req.body 0000/1301/1302
router.patch("/edit/:id", async function (req, res, next) {
  try {
    await accountsController.updateAccountById(req, res);
  } catch (error) {
    res.json({
      code: "1202",
      msg: "程序异常报错",
      data: error,
    });
  }
});
```

> 使用Apipost测试：
>
> GET-172.20.240.1:3000/api/edit/6a37d3ce09e444a41ce8f1e6
>
> ```json
> {
>     "item":"给同事擦鞋",
>     "remarks": "给同事擦鞋赚钱"
> }
> ```

###### 单一账单

单一账单对应ReadOne：

```js
//ReadOne读取某一记账本的账目路由  数据库直接返回前端需求 0000/1401/1402
router.get("/account/:id", async function (req, res, next) {
  try {
    await accountsController.getOneAccountById(req, res);
  } catch (err) {
    res.json({
      code: "1002",
      msg: "程序异常报错",
      data: err,
    });
  }
});
```

> 使用Apipost测试：
>
> GET-172.20.240.1:3000/api/account/6a37c72e66038180ac8118d9

##### 注册用户

###### 创建页面

view/下创建注册页面，reg.ejs:

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>注册</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.css"
      rel="stylesheet"
    />
  </head>

  <body>
    <div class="container">
      <div class="row">
        <div
          class="col-xs-12 col-md-8 col-md-offset-2 col-lg-4 col-lg-offset-4"
        >
          <h2>注册</h2>
          <hr />
          <form method="post" action="/auth/reg">
            <div class="form-group">
              <label for="item">用户名</label>
              <input
                name="username"
                type="text"
                class="form-control"
                id="item"
              />
            </div>
            <div class="form-group">
              <label for="time">密码</label>
              <input
                name="password"
                type="password"
                class="form-control"
                id="time"
              />
            </div>
            <hr />
            <button type="submit" class="btn btn-primary btn-block">
              注册
            </button>
          </form>
        </div>
      </div>
    </div>
  </body>
</html>

```

###### 创建路由

路由需要创建2个，分别为注册页面和注册POST，routes/下创建auth.js文件，并在app中进行注册和使用如下：

```js
// 5. 提前加载所有路由、使用路由和捕获404
app.get("/", (req, res) => res.redirect("/reg"));
const webMyAccountsRouter = require("@routes/web/myAccounts.js");
const apiMyAccountsRouter = require("@routes/api/myAccounts.js");
const webAuthRouter = require("@routes/web/auth.js");
app.use("/myAccounts", webMyAccountsRouter);
app.use("/api", apiMyAccountsRouter);
app.use("/auth", webAuthRouter);
```

auth.js文件及路由设置如下：

```js
const path = require("path");
var express = require("express");
const usersController = require("@controllers/users.controller.js");
const { log } = require("console");
var authRouter = express.Router();

//GET IP:PORT/auth/reg 注册页面
authRouter.get("/reg", function (req, res, next) {
  res.render("reg");
});

//POST IP:PORT/auth/reg 注册数据POST
authRouter.post("/reg", async function (req, res, next) {
  const registerDate = await usersController.registerData(req);
  try {
    if (registerDate.type === 1) {
      res.render("success", {
        msg: "Register Success.",
        url: "/auth/login",
        waitTime: 3000,
      });
    } else {
      res.render("error", {
        message: registerDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: "/auth/reg",
        waitTime: 3000,
      });
    }
  } catch (err) {
    res.render("error", {
      message: "Register Fail.",
      error: err,
      url: "/auth/reg",
      waitTime: 3000,
    });
  }
});

module.exports = authRouter;
```

##### 登录用户

###### 创建页面

view/下创建登录页面，login.ejs:

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>登录</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.css"
      rel="stylesheet"
    />
  </head>

  <body>
    <div class="container">
      <div class="row">
        <div
          class="col-xs-12 col-md-8 col-md-offset-2 col-lg-4 col-lg-offset-4"
        >
          <h2>登录</h2>
          <hr />
          <form method="post" action="/auth/login">
            <div class="form-group">
              <label for="item">用户名</label>
              <input
                name="username"
                type="text"
                class="form-control"
                id="item"
              />
            </div>
            <div class="form-group">
              <label for="time">密码</label>
              <input
                name="password"
                type="password"
                class="form-control"
                id="time"
              />
            </div>
            <hr />
            <button type="submit" class="btn btn-primary btn-block">
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  </body>
</html>

```

###### 创建路由

路由需要创建2个，分别为登录页面和登录POST如下：

```js
//GET IP:PORT/auth/login 登录页面
authRouter.get("/login", function (req, res, next) {
  res.render("login");
});
//POST IP:PORT/auth/login 登录数据POST
authRouter.post("/login", async function (req, res, next) {
  const loginDate = await usersController.loginData(req);
  try {
    if (loginDate.type === 1) {
      res.render("success", {
        msg: "login Success.",
        url: "/myAccounts",
        waitTime: 3000,
      });
    } else {
      res.render("error", {
        message: loginDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: "/auth/login",
        waitTime: 3000,
      });
    }
  } catch (err) {
    res.render("error", {
      message: "login Fail.",
      error: err,
      url: "/auth/login",
      waitTime: 3000,
    });
  }
});
```

###### 优化提示

为了体验更加，将success.ejs和error.ejs做了定时跳转的功能，具体修改代码如下：

* success.ejs代码：

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- 自动跳转，毫秒转秒 -->
    <meta
      http-equiv="refresh"
      content="<%= waitTime / 1000 %>;url=<%= url %>"
    />
    <title>提醒</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.css"
      rel="stylesheet"
    />
    <style>
      .h-50 {
        height: 50px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="h-50"></div>
      <div class="alert alert-success" role="alert">
        <h1>:) <%= msg %></h1>
        <p>
          将在 <span id="count"><%= waitTime / 1000 %></span> 秒后自动跳转，<a
            href="<%= url %>"
            >Click to Jump</a
          >
        </p>
      </div>
    </div>

    <script>
      // 从模板传入毫秒，转成秒
      const totalMs = <%= waitTime %>;
      let count = totalMs / 1000;
      const countDom = document.getElementById("count");
      const targetUrl = "<%= url %>";
      const timer = setInterval(() => {
        count--;
        countDom.innerText = count;
        if (count <= 0) {
          clearInterval(timer);
          location.href = targetUrl;
        }
      }, 1000);
    </script>
  </body>
</html>

```

* error.ejs代码：

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- 兜底自动跳转 -->
  <meta http-equiv="refresh" content="<%= waitTime / 1000 %>;url=<%= url %>">
  <title>错误提示</title>
  <link
    href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.css"
    rel="stylesheet"
  />
  <style>
    .h-50 {
      height: 50px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="h-50"></div>
    <div class="alert alert-danger" role="alert">
      <h1><%= message %></h1>
      <% if (error.status) { %>
        <h2><%= error.status %></h2>
      <% } %>
      <% if (error.stack) { %>
        <pre><%= error.stack %></pre>
      <% } %>
      <p>将在 <span id="count"><%= waitTime / 1000 %></span> 秒后自动跳转，<a href="<%= url %>">Click to Jump</a></p>
    </div>
  </div>

  <script>
    const totalMs = <%= waitTime %>;
    let count = totalMs / 1000;
    const countDom = document.getElementById("count");
    const targetUrl = "<%= url %>";
    const timer = setInterval(() => {
      count--;
      countDom.innerText = count;
      if (count <= 0) {
        clearInterval(timer);
        location.href = targetUrl;
      }
    }, 1000);
  </script>
</body>
</html>
```

#### 会话控制

Session和Token目前生成与销毁，采用放入数据库MongoDB/contrler/下的模式实现。

##### Session

Seesion的实现该项目使用在web下进行。

###### 基本原理

session主要的目的就是为了在登录之后，在服务器端的session中间件将用户信息存储在数据库中，并将生成的唯一码返回给客户端，客户端保存在浏览器，下次登录该服务器时，会将该唯一码挂载到req中，服务器通过session中间件+数据库，将req中增加用户信息，路由就会获取到对应的用户信息。

###### 引入依赖

在app.js文件中引入对应的依赖包：

```js
// 1.2 引入session依赖库，V5/v6新版标准写法
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

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
```

###### 生成数据

在数据库users.controller.js的登录数据内实现生成session：

```js
  // 【API接口用】登录用户,返回JSON给前端ajax
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await usersService.findOne({ username });
      if (!user) return fail(res, "账号不存在");
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) return fail(res, "密码错误");

      // 生成token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "2h",
      });

      // 登录刷新session，生成全新sessionId（安全规范）
      await new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) reject(err);
          resolve();
        });
      });

      // 生成session,写入session的主要目的就是为了让浏览器具备这个参数，以后访问的时候携带者这些数据
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.role = user.role;

      return success(res, token, "登录成功");
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】登录用户,校验账号密码，返回token+用户信息
  async loginData(req) {
    try {
      const { username, password } = req.body;
      const user = await usersService.findOne({ username });

      if (!user)
        return {
          type: -1,
          msg: "账号不存在",
          error: "账号不存在",
        };
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return {
          type: -1,
          msg: "密码错误",
          error: "密码错误",
        };

      // 生成token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "2h",
      });

      // 登录刷新session，生成全新sessionId（安全规范）
      await new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) reject(err);
          resolve();
        });
      });
      // 生成session,写入session的主要目的就是为了让浏览器具备这个参数，以后访问的时候携带者这些数据
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.role = user.role;

      return {
        type: 1,
        msg: "登录成功",
        token: token,
        session: req.session,
        user: { id: user._id, username: user.username, role: user.role },
      };
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "登录失败，请检查填写数据",
        error: err,
      };
    }
  }
```

> session的引入放在项目的app.js项目文件内

###### 路由写入

```js
//POST IP:PORT/auth/login 登录数据POST
authRouter.post("/login", async function (req, res, next) {
  try {
    const loginDate = await usersController.loginData(req);
    if (loginDate.type === 1) {
      res.redirect("/myAccounts");
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.LOGIN_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: loginDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(process.env.LOGIN_REDIRECT_URL, "error");
    res.render("error", {
      msg: "login Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});
```

> 浏览器下次访问就会携带识别码，后端将用户信息挂载到req中，任意路由即可识别用户信息。

###### 登录校验

创建中间件文件middleware，并创建checkLoginMiddleware.js：

```js
/**
 * 登录鉴权中间件类
 * @class CheckLogin
 * @description 全局会话登录校验，区分页面/API请求，异常捕获+日志埋点
 */
class CheckLogin {
  // 业务配置抽离，统一管理路由地址
  static LOGIN_REDIRECT_URL = process.env.LOGIN_REDIRECT_URL;
  static UNAUTH_CODE = process.env.UNAUTH_CODE;
  static UNAUTH_MSG = process.env.UNAUTH_MSG;

  /**
   * 登录校验中间件函数
   * @param {import('express').Request} req 请求对象
   * @param {import('express').Response} res 响应对象
   * @param {import('express').NextFunction} next 放行函数
   * @returns {void}
   */
  checkLogin(req, res, next) {
    try {
      // 兜底：session 对象不存在（存储服务断开）
      if (!req.session) {
        console.warn(
          `[鉴权拦截] ${req.method} ${req.originalUrl} - Session 对象丢失`,
        );
        return this._handleUnauthorized(req, res);
      }

      // 核心登录态判断：无登录用户名则拦截
      if (!req.session.username) {
        console.warn(
          `[鉴权拦截] ${req.method} ${req.originalUrl} - 未登录/会话过期`,
        );
        return this._handleUnauthorized(req, res);
      }

      // 登录校验通过，放行后续中间件/路由
      next();
    } catch (error) {
      // 捕获session读取、存储所有异常，防止服务崩溃
      console.error(
        `[鉴权异常] ${req.method} ${req.originalUrl}`,
        error.message,
      );
      // 统一返回未授权逻辑
      return this._handleUnauthorized(req, res);
    }
  }

  /**
   * 统一处理未登录响应：区分页面渲染 / 接口JSON返回
   * @private
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  _handleUnauthorized(req, res) {
    // 判断是否为接口请求（前端AJAX/fetch携带Accept:application/json）
    const isApiRequest = req.headers.accept.includes("application/json");

    if (isApiRequest) {
      // 接口请求：返回标准401 JSON，前端拦截跳转登录
      return res.status(CheckLogin.UNAUTH_CODE).json({
        code: CheckLogin.UNAUTH_CODE,
        msg: CheckLogin.UNAUTH_MSG,
        redirect: CheckLogin.LOGIN_REDIRECT_URL,
      });
    } else {
      // 页面浏览器请求：302重定向登录页
      return res.redirect(CheckLogin.LOGIN_REDIRECT_URL);
    }
  }
}
// 创建实例并绑定this上下文，解决单独提取方法后this丢失问题
const checkLoginInstance = new CheckLogin();

// 强制绑定实例上下文，无论函数单独提取使用，this永远指向当前实例
checkLoginInstance.checkLogin =
  checkLoginInstance.checkLogin.bind(checkLoginInstance);

// 全局单例导出，项目全局复用同一个实例
module.exports = checkLoginInstance;

```

在web/myAccounts.js引入使用：

```js
const loginAuth =
  require("@middleware/checkLoginMiddleware.js").checkLogin;
......
//ReadAll设置记账本列表路由
myAccountsRouter.get("/", loginAuth, async function (req, res, next) {...}
//CreateOne创建账目页面路由
myAccountsRouter.get("/create", loginAuth, function (req, res, next) {...}
// CreateOne创建账目提交路由 req.body
myAccountsRouter.post( "/createAccount",loginAuth,async function (req, res, next) {...}
//DeleteOne删除账目路由 req.parms.id
myAccountsRouter.get("/delete/:id", loginAuth, async function (req, res, next) {...}
//UpdateOne更新账目页面路由 req.parms.id
myAccountsRouter.get("/edit/:id", loginAuth, async function (req, res, next) {...}
//UpdateOne更新账目提交路由 req.parms.id,req.body
myAccountsRouter.post("/edit/:id", loginAuth, async function (req, res, next) {...}

```

> 实现通过Session完成鉴权功能

###### 退出登录

退出登录的实质是对session进行销毁，在users.controller.js下增加登出方法，具体如下：

```js
  // 【API接口用】登出用户,注销session数据
  async logout(req, res) {
    try {
      const result = await new Promise((resolve, reject) => {
        //req.session.destroy(cb) 是回调式异步 API，不是 Promise，不能直接 await,回调内部的 return 仅仅退出回调函数，无法把数据返回给外层 logoutData
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve(success(res, null, "登出成功"));
        });
      });
      return result;
    } catch (err) {
      return fail(res, err);
    }
  }

  // 【页面模板渲染专用】登出用户,注销session数据
  async logoutData(req) {
    try {
      const result = await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve({
            type: 1,
            msg: "session已销毁",
            data: null,
          });
        });
      });
      return result;
    } catch (err) {
      return {
        type: -1,
        msg: err.message || "session销毁异常",
        error: err,
      };
    }
  }
```

在web/authRoutes.js下创建登出路由，具体如下：

```js
//GET IP:PORT/auth/logout 登出页面
authRouter.get("/logout", async function (req, res, next) {
  try {
    const logoutDate = await usersController.logoutData(req);

    if (logoutDate.type === 1) {
      res.redirect("/myAccounts");
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.LOGIN_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: logoutDate.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    const safeUrl = getSafeRedirectUrl(process.env.LOGIN_REDIRECT_URL, "error");
    res.render("error", {
      msg: "logout Fail.",
      url: safeUrl,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});
```

> 在accountsList.ejs的退出登录按钮的href设置为“auth/logout”，即可完成登出功能的实现

##### Token

Seesion的实现该项目使用在API下进行。在处理此章节时，已经完成对无限跳转问题的修复工作，若想优先查看无线跳转修复，请到功能拓展-防死循环章节。

###### 基本原理

Taken主要的目的就是为了在登录之后，通过加密手段，将用户名/密码/有效时间/密码字段通过某种技术手段生成加密字段，并保存在客户端处，下次请求会携带Taken进行校验，校验合格进行登录，校验失败返回异常。

###### 引入依赖

将jsonwebtoken引入到对应文件内，目前会话控制均放置到数据库中使用：

```js
const jwt = require("jsonwebtoken");
```

###### 生成数据

Token的生成是在MongoDB当中，/controllers/users.controlloers.js:

```js
// 【API接口用】登录用户,生成token,返回JSON给前端ajax
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await usersService.findOne({ username });
      if (!user) return fail(res, "账号不存在");
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) return fail(res, "密码错误");

      // 生成token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "2h",
      });
      return success(res, token, "登录成功");
    } catch (err) {
      return fail(res, err);
    }
  }
```

###### 路由写入

Token只在api当中进行测试，在登录路由里面不体现Token相关：

```js
//POST IP:PORT/auth/login 登录数据POST
authRouter.post("/login", async function (req, res, next) {
  try {
    await usersController.login(req, res);
  } catch (err) {
    res.json({
      code: "2202",
      msg: "登录异常出错",
      data: err,
    });
  }
});
```

###### 登录校验

创建token校验中间件middleware/login.token.auth.help.js：

```js
/**
 * Token 登录鉴权中间件类
 * @class CheckTokenAuth
 * @description JWT Token 全局鉴权校验，区分页面/API请求，异常捕获+日志埋点
 * @author MyAccounts Backend
 */
const jwt = require("jsonwebtoken");

class CheckTokenAuth {
  // 业务配置抽离，统一管理路由、状态码、提示文案
  static LOGIN_REDIRECT_URL = process.env.LOGIN_REDIRECT_URL;
  static UNAUTH_CODE = Number(process.env.UNAUTH_CODE) || 401;
  static UNAUTH_MSG = process.env.UNAUTH_MSG || "登录凭证失效，请重新登录";
  static JWT_SECRET = process.env.JWT_SECRET;
  // Token 请求头标识标准 Bearer
  static AUTH_HEADER_KEY = "authorization";
  static AUTH_PREFIX = "Bearer ";

  /**
   * Token 鉴权中间件主函数
   * @param {import('express').Request} req 请求对象
   * @param {import('express').Response} res 响应对象
   * @param {import('express').NextFunction} next 放行函数
   * @returns {void}
   */
  checkTokenAuth(req, res, next) {
    try {
      // 白名单放行登录、注册接口，阻断鉴权死循环
      const whiteList = [
        process.env.LOGIN_REDIRECT_URL,
        process.env.REGISTER_REDIRECT_URL,
      ];
      const purePath = req.originalUrl.split("?")[0];
      if (whiteList.includes(purePath)) {
        return next();
      }

      // 1. 获取 Authorization 请求头
      const authHeader = req.headers[CheckTokenAuth.AUTH_HEADER_KEY];
      console.log("authHeader:", authHeader);
      if (!authHeader || !authHeader.startsWith(CheckTokenAuth.AUTH_PREFIX)) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - 未携带有效Token头`,
        );

        return this._handleUnauthorized(req, res);
      }

      // 2. 截取 Bearer 后的真实 token
      const token = authHeader.slice(CheckTokenAuth.AUTH_PREFIX.length);
      if (!token.trim()) {
        console.warn(
          `[Token鉴权拦截] ${req.method} ${req.originalUrl} - Token为空`,
        );
        return this._handleUnauthorized(req, res);
      }

      // 3. 校验并解析JWT
      const payload = jwt.verify(token, CheckTokenAuth.JWT_SECRET);
      // 将解析后的用户信息挂载到req，后续路由/控制器直接使用
      req.tokenUser = payload;

      // Token校验通过，放行业务逻辑
      return next();
    } catch (error) {
      // 细分JWT错误类型，打印精准日志
      let logMsg = "";
      if (error.name === "TokenExpiredError") {
        logMsg = "Token已过期";
      } else if (error.name === "JsonWebTokenError") {
        logMsg = "Token签名非法/篡改";
      } else if (error.name === "NotBeforeError") {
        logMsg = "Token未生效";
      } else {
        logMsg = `Token校验异常: ${error.message}`;
      }
      console.error(
        `[Token鉴权异常] ${req.method} ${req.originalUrl} - ${logMsg}`,
        error.stack,
      );
      return this._handleUnauthorized(req, res);
    }
  }

  /**
   * 统一处理未授权返回逻辑：区分前端AJAX接口 / 浏览器页面访问
   * @private
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  _handleUnauthorized(req, res) {
    // 判断是否为AJAX/接口请求：Accept携带application/json
    const isApiRequest = req.headers.accept?.includes("application/json");

    if (isApiRequest) {
      // API接口场景：返回标准401 JSON结构
      return res.status(CheckTokenAuth.UNAUTH_CODE).json({
        code: CheckTokenAuth.UNAUTH_CODE,
        msg: CheckTokenAuth.UNAUTH_MSG,
        redirect: CheckTokenAuth.LOGIN_REDIRECT_URL,
      });
    } else {
      // 浏览器页面访问：302重定向至登录页面
      return res.redirect(CheckTokenAuth.LOGIN_REDIRECT_URL);
    }
  }
}

// 实例化单例
const tokenAuthInstance = new CheckTokenAuth();

// 强制绑定this上下文，防止单独导出函数丢失实例指向
tokenAuthInstance.checkTokenAuth =
  tokenAuthInstance.checkTokenAuth.bind(tokenAuthInstance);

// 全局单例导出，项目统一复用
module.exports = tokenAuthInstance;
```

> 同步已经session校验中间件进行更名，内容未变：login.session.auth.help.js

在routes/api/apiMainRoutes.js下引入校验文件并添加到对应路由路径下：
```js
const loginAuth =require("@middleware/login.token.auth.help.js").checkTokenAuth;

//ReadAll读取记账本列表路由  数据库直接返回前端需求 0000/1001/1002
router.get("/myAccounts", loginAuth, async function (req, res, next) {...});

//CreateOne创建账目提交路由  数据库直接返回前端需求  req.body 0000/1101/1102
router.post("/createAccount", loginAuth, async function (req, res, next) {...});

//DeleteOne删除账目路由  数据库直接返回前端需求   req.parms.id 0000/1201/1202
router.delete("/delete/:id", loginAuth, async function (req, res, next) {...});

//UpdateOne更新账目提交路由 req.parms.id,req.body 0000/1301/1302
router.patch("/edit/:id", loginAuth, async function (req, res, next) {...});

//ReadOne读取某一记账本的账目路由  数据库直接返回前端需求 0000/1401/1402
router.get("/account/:id", loginAuth, async function (req, res, next) {...});
```

###### 退出登录

退出登录的实质是对token进行销毁(版本升级)，在MongoDB的models/users.model.js增加字段：

```js
tokenVersion: {
    type: Number,
    default: 0,
  },
```

> 已存储的数据自行处理，或删除新建，或修改

在users.controller.js下增加登出方法，具体如下：

```js
  // 【API接口用】登出用户,token方案（废弃所有当前用户Token）
  async logout(req, res) {
    try {
      // 1. 取出请求头 Bearer Token，读取统一配置
      const headerKey = process.env.JWT_AUTH_HEADER_KEY || "authorization";
      const prefix = process.env.JWT_AUTH_PREFIX || "Bearer ";
      const authHeader = req.headers[headerKey];
      if (!authHeader || !authHeader.startsWith(prefix)) {
        throw new Error("未携带有效登录凭证，请重新登录");
      }
      const token = authHeader.slice("Bearer ".length).trim();

      // 2. 解析Token拿到用户ID与签发时的版本号
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = payload;

      // 3. 用户tokenVersion自增1，该用户所有旧Token全部失效
      await usersService.updateById(userId, {
        $inc: { tokenVersion: 1 },
      });

      // 4. 返回成功信息
      return success(res, null, "登出成功，登录凭证已失效");
    } catch (err) {
      return fail(res, err);
    }
  }

```

在api/authRoutes.js下创建登出路由，具体如下：

```js
const loginAuth =require("@middleware/login.token.auth.help.js").checkTokenAuth;

//GET IP:PORT/api-auth/logout 登出页面
authRouter.get("/logout", loginAuth, async function (req, res, next) {
  console.log("api登出");

  try {
    await usersController.logout(req, res);
  } catch (err) {
    res.json({
      code: "2203",
      msg: "登出异常出错",
      data: err,
    });
  }
});
```

#### 功能拓展

##### 防死循环

该内容基于Session章节结束后，发现可能存在无限跳转问题，基于该BUG进行修复。

* 基本思路：

  * 通过urlHelp.js中间件对跳转路径进行规范化，实现规范路径；

  * 通过urlHelp.js中间件追加循环跳转溯源标记参数redirectTrack；


middleware/urlHelper.js，内容如下：

```js
/**
 * 清洗跳转地址，去除空格、首尾引号、强制根路径，附加追踪参数
 * @param {string} rawUrl 原始环境变量url
 * @param {'success'|'error'} trackType 跳转来源标记：success=正常业务成功页 / error=错误/鉴权拦截页
 * @returns {string} 处理完成的纯路径+查询参数字符串（不含域名，适配EJS页面meta跳转）
 */
function getSafeRedirectUrl(rawUrl, trackType = "success") {
  // 1. 清洗原始地址：去除首尾空格、首尾单/双引号，解决.env变量带引号、多余空格问题
  let cleanUrl = rawUrl.trim().replace(/^['"]|['"]$/g, "");

  // 2. 强制路径以 / 开头，避免相对路径拼接错乱（当前页面为/xxx/delete时，不会拼接成/xxx/delete目标地址）
  if (!cleanUrl.startsWith("/")) cleanUrl = "/" + cleanUrl;

  // 3. 读取环境变量配置的服务域名，缺失则兜底本地默认地址,replace(/\/+$/, "") 自动清除域名末尾多余斜杠，防止生成 http://xxx:3000//myAccounts 双斜杠错误路径
  const baseOrigin = (process.env.SERVER_IP || "http://localhost:3000").replace(
    /\/+$/,
    "",
  );

  // 4. 使用URL标准构造器解析清洗后的路径，绑定服务域名作为基准源.作用：自动规范路径、统一管理查询参数，避免手动拼接字符串引发语法漏洞
  const urlObj = new URL(cleanUrl, baseOrigin);

  // 5. 追加循环跳转溯源标记参数redirectTrack.作用：前端error.ejs页面读取该参数，识别是否为错误页二次跳转，自动禁用自动倒计时，阻断无限重定向
  urlObj.searchParams.set("redirectTrack", trackType);

  // 5. 只返回【路径 + 查询参数】，剥离域名部分,原因：EJS页面meta自动跳转、a标签链接仅需要相对根路径，完整域名会造成重复拼接，导致跳转地址错乱
  return urlObj.pathname + urlObj.search;
}

module.exports = {
  getSafeRedirectUrl,
};
```

* 具体实现

在需要跳转的地方，将计划跳转地址通过urlHelper.js进行转换，具体实现案例：

```js
//DeleteOne删除账目路由 req.parms.id
myAccountsRouter.get("/delete/:id", loginAuth, async function (req, res, next) {
  try {
    const delData = await accountsController.deleteAccountData(req);
    console.log(process.env.ACCOUNTSLIST_REDIRECT_URL);

    if (delData.type === 1) {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "success",
      );
      res.render("success", {
        msg: "Delete Account Success!",
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    } else {
      const safeUrl = getSafeRedirectUrl(
        process.env.ACCOUNTSLIST_REDIRECT_URL,
        "error",
      );
      res.render("error", {
        msg: delData.msg,
        error: {
          status: null,
          stack: null,
        },
        url: safeUrl,
        waitTime: process.env.REDIRECT_WAITTIME,
      });
    }
  } catch (err) {
    res.render("error", {
      msg: "Delete Accounts Fail.",
      url: process.env.ACCOUNTSLIST_REDIRECT_URL,
      error: err,
      waitTime: process.env.REDIRECT_WAITTIME,
    });
  }
});
```

> 以delete为案例，实际，增删改查等均需要进行转换，同步将error.ejs进行了对应的简化：
>
> ```ejs
> <!DOCTYPE html>
> <html lang="zh-CN">
> <head>
> <meta charset="UTF-8">
> <meta name="viewport" content="width=device-width, initial-scale=1.0">
> <title>操作失败</title>
> <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
> <style>
> * {
>   margin: 0;
>   padding: 0;
> }
> body {
>   background-color: #f0f4f9;
>   min-height: 100vh;
>   display: flex;
>   align-items: center;
>   justify-content: center;
> }
> .card {
>   width: 700px;
>   background: #ffffff;
>   border-radius: 16px;
>   padding: 60px 50px;
>   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
> }
> .title {
>   color: #d9534f;
>   text-align: center;
>   margin-bottom: 30px;
>   font-size: 32px;
>   font-weight: 600;
> }
> .status-text {
>   text-align: center;
>   color: #666;
>   font-size: 18px;
>   margin-bottom: 25px;
> }
> .stack-box {
>   max-height: 220px;
>   overflow-y: auto;
>   background: #f7f8fa;
>   padding: 18px;
>   border-radius: 10px;
>   font-size: 14px;
>   color: #333;
>   margin-bottom: 40px;
> }
> .btn-wrap {
>   text-align: center;
> }
> .btn-danger {
>   padding: 12px 48px;
>   font-size: 18px;
>   border-radius: 8px;
> }
> </style>
> </head>
> <body>
> <div class="card">
>   <h6 class="title"><%= msg %></h6>
> 
>   <% if (error.status) { %>
>     <p class="status-text">状态码：<%= error.status %></p>
>   <% } %>
> 
>   <% if (error.stack) { %>
>     <pre class="stack-box"><%= error.stack %></pre>
>   <% } %>
> 
>   <div class="btn-wrap">
>     <a href="<%= url %>" class="btn btn-danger">前往首页</a>
>   </div>
> </div>
> </body>
> </html>
> ```
