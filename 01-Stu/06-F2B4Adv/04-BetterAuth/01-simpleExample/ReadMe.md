### BetterAuth

#### 前期安装

##### 前端框架

express 本身是一个 npm 包，所以可以通过 npm 安装 :

```cmd
PS F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (01-stuprojects) simpleExample
version: (1.0.0) 
description: simpleExample.
entry point: (index.js) 
test command: 
git repository: 
keywords: 
author: GooHv
license: (ISC) 
type: (commonjs) 
About to write to F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample\package.json:

{
  "name": "stu_projects",
  "version": "1.0.0",
  "description": "simpleExample.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "GooHv",
  "license": "ISC",
  "type": "commonjs"
}


Is this OK? (yes) 
PS F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample> npm i express

added 66 packages in 1s

24 packages are looking for funding
  run `npm fund` for details
PS C:\Users\Administrator\Desktop\01-simpleExample> 
```

##### 模板生成

通过generator应用生成器工具 `express-generator` 可以快速创建一个应用的骨架。

你可以通过 `npx` （包含在 Node.js 8.2.0 及更高版本中）命令来运行 Express 应用程序生成器。

```cmd
PS F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample> npx express-generatonpx express-generator

  warning: the default view engine will not be jade in future releases
  warning: use `--view=jade' or `--help' for additional options

destination is not empty, continue? [y/N] y

   create : public\
   create : public\javascripts\
   create : public\images\
   create : public\stylesheets\
   create : public\stylesheets\style.css
   create : routes\
   create : routes\index.js
   create : routes\users.js
   create : views\
   create : views\error.jade
   create : views\index.jade
   create : views\layout.jade
   create : app.js
   create : package.json
   create : bin\
   create : bin\www

   install dependencies:
     > npm install

   run the app:
     > SET DEBUG=01-stuprojects:* & npm start

PS F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample> 
```

##### 认证依赖

```bash
PS F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample> npm install better-auth

added 22 packages in 11s

6 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\06-F2B_Advanced\03-BetterAuth\01-simpleExample>
```

##### 变量加载

dotenv 是一个 Node.js 的 npm 包，它的唯一作用就是：把 .env 文件里的变量加载到 process.env 对象中，每个后端服务器都有自己的环境配置等信息，可以使用dotenv包进行管理和加载。

安装 dotenv非常简单，按照以下步骤操作即可。

```cmd
PS C:\Users\Administrator\Desktop\01-stuProjects> npm i dotenv

added 1 package in 1s

8 packages are looking for funding
  run `npm fund` for details
PS C:\Users\Administrator\Desktop\01-stuProjects> 
```

> 安装好后，就可以通过创建.env文件，并在www或其他服务文件下导入即可使用，具体参考增强方案中的环境变量章节;
>
> dotenv 默认不支持变量引用，若想使用变量引用，需要安装变量增强工具包
>
> > SERVER_IP=http://${LOCAL_IP}:${PORT}
> >
> > LOCAL_IP=192.168.10.148
> >
> > process.env.SERVER_IP      // "http://${LOCAL_IP}:${PORT}"  (字面量，不会解析)

##### 变量增强

dotenv 默认不支持变量引用，若想使用变量引用，需要安装变量增强工具包dotenv-expand，具体安装方式如下：

```bash
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm i dotenv dotenv-expand      

added 1 package in 1s

10 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT>
```

> * 使用方法
>
> >     const dotenv = require("dotenv");
> >     const dotenvExpand = require("dotenv-expand");
> >     const myEnv = dotenv.config();
> >     dotenvExpand.expand(myEnv);
> >
>
> * 实现效果
>
> > SERVER_IP=http://${LOCAL_IP}:${PORT}
> >
> > LOCAL_IP=192.168.10.148
> >
> > process.env.MONGODB_DBHOST // "192.168.10.148:1234"             ✅ 正确解析

##### 数据库包

该项目统一使用MongoDB进行数据管理，需要使用mongoose包进行管理，安装方法如下：

```cmd
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm i mongoose

added 18 packages in 3s

9 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> 
```

##### 加密认证

该项目由于存在的登录数据加密需求，统一使用bcrypt包进行加密和验证，当前采用纯 JavaScript，无需编译的js文件方式，相比bcrypt 稍慢（约 30%）,安装方法如下：

```cmd
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm i bcryptjs

added 1 package in 1s

9 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm list bcrypt js
stu_projects_manager_tool@0.0.0 F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT
└── (empty)
```

> 实际生产环境，可考虑bcrypt 方式，具体查询相关资料。

#### 环境搭建

项目根目录下创建环境变量.env文件，并添加以下环境变量：

* Secret Key 秘密钥匙
* Set Base URL基础路径

```env
# 基础配置-服务器配置,process.env.LISTEN_AREA
PORT=3000
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# 基础配置-局域网IP
LOCAL_IP=127.0.0.1

# Better-Auth-秘密钥匙
BETTER_AUTH_SECRET=QyGWmEtofd1DlJyQCsZgvPDAybgRQWbX
BETTER_AUTH_URL=${SERVER_IP}


# MongoDB-数据库基础配置
MONGODB_DBHOST=mongodb://${LOCAL_IP}
MONGODB_DBPORT=27017
MONGODB_DBNAME=expressTest4Demo

# MongoDB-数据库地址
MONGODB_URI=${MONGODB_DBHOST}:${MONGODB_DBPORT}/${MONGODB_DBNAME}
```

#### 服务器实例

##### 创建文件

在以下几个任一位置创建名为 `auth.ts` 的文件：

- Project root 
- `lib/` 文件夹
-  `utils/` 文件夹

> 也可以把这些文件夹嵌套在 `src/`、`app/` 或 `server/` 文件夹下

##### 认证实例

在auth.ts文件里，导入 Better Auth 并创建你的认证实例。确保导出带有变量名 `auth` 的认证实例，或者作为默认导出。

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  //...
});
```

##### 创建数据

###### 数据客户端

* 配置环境变量

在.env文件中配置数据库连接地址配置项

```env
# 导入命令使用
# //process.env.LISTEN_AREA
#     const dotenv = require("dotenv");
#     const dotenvExpand = require("dotenv-expand");
#     const myEnv = dotenv.config();
#     dotenvExpand.expand(myEnv);


# 基础配置-服务器配置,process.env.LISTEN_AREA
PORT=3000
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# 基础配置-局域网IP
LOCAL_IP=172.29.32.1

# Better-Auth-秘密钥匙
BETTER_AUTH_SECRET=QyGWmEtofd1DlJyQCsZgvPDAybgRQWbX
BETTER_AUTH_URL=${SERVER_IP}


# MongoDB-数据库基础配置
MONGODB_DBHOST=mongodb://${LOCAL_IP}
MONGODB_DBPORT=27017
MONGODB_DBNAME=expressTest4Demo

# MongoDB-数据库地址
MONGODB_URI=${MONGODB_DBHOST}:${MONGODB_DBPORT}/${MONGODB_DBNAME}
```

> 如果你使用的是 MongoDB Atlas（云托管服务），连接字符串格式会是 mongodb+srv://...，确保你的 .gitignore 文件包含了 .env，这样它就不会被 Git 提交。

* 创建数据库连接服务

在确定dotnev和dotnev-expand依赖包已安装的情况下创建src/utils/auth.ts,内容如下；

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  //...
});
```

###### 配置数据库

数据库我们选用MongoDB，实际上BetterAuth支持sqlite/mysql/postgres等等数据库，使用MongoDB类型的ORM，可以使用内置适配器实现。

* 更新文件

​	更新auth.js文件，通过引入db.js文件创建数据库连接。

```ts
// 1. 引入依赖包和定义变量
const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { getDb } = require("../models/db");
let _auth = null;

// 2. 初始化Auth
async function initAuth() {
  if (_auth) return _auth;

  const db = await getDb();

  _auth = betterAuth({
    database: mongodbAdapter(db),
  });

  return _auth;
}

// 3，获取auth
function getAuth() {
  if (!_auth) {
    throw new Error("Auth 未初始化，请先调用 initAuth()");
  }
  return _auth;
}

module.exports = { initAuth, getAuth };

```

> 因为Better-Auth使用的是TypeScript，所以后缀是auth.ts，实际在生产环境前，应该要把ts文件转换为js文件，ts文件只是在开发阶段，目前为了便捷和快速，直接转换为js文件执行和演示;

* 初始化Auth

在app.js文件中异步初始化Auth，可以不阻塞 app 的创建与导出，在app.js的最后增加如下代码：

```js
......
// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// 5. 异步初始化 Auth（不阻塞 app 的创建与导出）
(async () => {
  try {
    const { initAuth } = require("./src/utils/auth.js");
    await initAuth();
    console.log("✅ Better-Auth 初始化完成");
  } catch (err) {
    console.error("❌ Auth 初始化失败:", err);
    // Auth 初始化失败可以选择退出，或者仅打印警告让服务继续启动
    process.exit(1);
  }
})();

// 6. 优雅退出钩子
const { closeDb } = require("./src/models/db");
process.on("SIGINT", async () => {
  await closeDb();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await closeDb();
  process.exit(0);
});
```

> npm start结果如下：
>
> ```bash
> 🔧 开始配置环境变量...
> 🌐 检测到局域网IP: 172.29.32.1
> ...
> ✅ MongoDB 已连接至数据库: expressTest4Demo
> ✅ Better-Auth 初始化完成
> ```

##### 创建库表

使用如下官方推荐命令生成所需的表单：

```bash
npx auth@latest generate
```

> npx auth generate 命令的设计初衷是为 SQL 数据库（如 PostgreSQL, MySQL, SQLite）自动生成建表迁移文件。而 MongoDB 是 NoSQL 文档数据库，没有固定的表结构（Schema），集合和索引是在运行时动态创建的，因此 CLI 无法也无需为 MongoDB 生成传统的 Schema 文件。

##### 认证方法

将官方推荐的代码加入到auth.js文件中：

```js
// 2. 初始化Auth
async function initAuth() {
  if (_auth) return _auth;

  const db = await getDb();

  _auth = betterAuth({
    database: mongodbAdapter(db),
    //认证方法
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      },
    },
  });
```

> 01-官方推荐的是ts写法，更改为js写法：
>
> ```ts
> import { betterAuth } from "better-auth";
> 
> export const auth = betterAuth({
>   //...other options
>   emailAndPassword: { 
>     enabled: true, 
>   }, 
>   socialProviders: { 
>     github: { 
>       clientId: process.env.GITHUB_CLIENT_ID as string, 
>       clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
>     }, 
>   }, 
> });
> ```
>
> 02-GITHUB_CLIENT_ID和GITHUB_CLIENT_SECRET需要更新到.env文件内：
>
> ```text
> // GitHub OAuth 应用的凭证，用于让你的网站支持“使用 GitHub 账号登录”功能
> //01.登录 GitHub，进入 Settings → Developer settings → OAuth Apps（或直接访问https://github.com/settings/developers ）
> //02.点击 New OAuth App，填写以下信息：
> ```
>
> | 配置项                     | 填写内容                                         | 说明                                   |
> | -------------------------- | ------------------------------------------------ | -------------------------------------- |
> | Application name           | 自定义名称                                       | 用户在授权页面看到的AppName            |
> | Homepage URL               | `http://localhost:3000`                          | 开发环境填本地地址，生产环境填实际域名 |
> | Authorization callback URL | `http://localhost:3000/api/auth/callback/github` | ⚠️ 必须与 Better Auth 的回调路径一致    |
>
> 03.点击 Register application 后，页面会显示 Client ID，直接复制填入 .env。
>
> 04.点击 Generate a new client secret，生成后立即复制填入 .env（Secret 只显示一次，关闭后无法再查看）。
>
> > 最终env示例
> >
> > GITHUB_CLIENT_ID=Ov23liXxxxxxxxxxxxxxxx
> > GITHUB_CLIENT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

##### 设置路由

在你框架指定的包通路由处理程序中创建一个新文件或路由。这条路由应该能处理 `/api/auth/*` 路径的请求（除非你配置了不同的基础路径）。

ExpressJS v5 中的实现：

```js
app.all('/api/auth/{*any}', toNodeHandler(auth));
```

> “any”这个名称是任意的，可以用你喜欢的任何标识符替换。

###### auth文件

```js
  _auth = betterAuth({
    database: mongodbAdapter(db),
    // 新增，必须与 app.all() 中的前缀完全一致,若修改，两边一起修改
    basePath: "/api/auth",
    //认证方法
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      },
    },
  });
```

###### app文件

```js
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

```

> 在浏览器输入http://localhost:3000/api/auth/get-session，可以得到🔍 Auth middleware hit: GET /api/auth/get-session, handler=true，说明已经实现。
>
> 以上完成服务器端的实例创建与验证。

#### 客户端实例

接下来实现客户端部分的实例，在src/utils/auth-client.js:

```js
const createAuthClient = require("better-auth/client");
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  //   baseURL: "http://localhost:3000",
  baseURL: process.env.BETTER_AUTH_URL,
});
export const { signIn, signUp, useSession } = createAuthClient();
```

> 官网原生为ts文件，基于项目需求，直接更改为js文件。
>
> 以上，完成客户端的实例创建。



























