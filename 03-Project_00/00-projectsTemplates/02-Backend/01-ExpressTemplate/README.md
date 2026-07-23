### 后端模板

#### 版本说明

##### <span style="color:grey;font-family:楷体" >_July 22, 2026_</span>

- <span style="color:orange;font-family:楷体" >基于node.js Express框架；</span>
- <span style="color:orange;font-family:楷体" >文件夹可以设定别名;</span>
- <span style="color:orange;font-family:楷体" >标配大量常用依赖包;</span>

#### 模板功能

##### 依赖支持

###### 框架模板

已经通过`generator`应用生成器工具 `express-generator` 可以快速创建一个应用的骨架，首先全局安装应用生成器工具 `express-generator` ：

```cmd
F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i -g express express-generator
npm warn deprecated mkdirp@0.5.1: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)

changed 77 packages in 1s

25 packages are looking for funding
  run `npm fund` for details
```

###### 创建项目

已经通过`express -e`命令生成新项目文件夹，系统会基于`express-generator`工具自动将基本依赖包安装好：

```bash
F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> express -e 02.02-nexSM

  warning: option `--ejs' has been renamed to `--view=ejs'


   create : 02.02-nexSM\
   create : 02.02-nexSM\public\
   create : 02.02-nexSM\public\javascripts\
   create : 02.02-nexSM\public\images\
   create : 02.02-nexSM\public\stylesheets\
   create : 02.02-nexSM\public\stylesheets\style.css
   create : 02.02-nexSM\routes\
   create : 02.02-nexSM\routes\index.js
   create : 02.02-nexSM\routes\users.js
   create : 02.02-nexSM\views\
   create : 02.02-nexSM\views\error.ejs
   create : 02.02-nexSM\views\index.ejs
   create : 02.02-nexSM\app.js
   create : 02.02-nexSM\package.json
   create : 02.02-nexSM\bin\
   create : 02.02-nexSM\bin\www

   change directory:
     > cd 02.02-nexSM

   install dependencies:
     > npm install

   run the app:
     > SET DEBUG=02.02-nexsm:* & npm start
```

> 项目名称更改为`express-generator`

###### 解决跨域

- cors解决浏览器跨域请求问题
- cors允许前端应用从不同域名访问你的 API

```bash
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i cors

added 56 packages in 2s

1 package is looking for funding
  run `npm fund` for details
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

###### 自动构建

`nodemon`包适用于`node.js`环境下修改代码自动更新，无需手动再次启动服务

```js
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i nodemon

added 28 packages in 2s

6 packages are looking for funding
  run `npm fund` for details
```

> - 修改`package.json`,实现修改后自动重新服务
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
MONGODB_DBNAME=YourDataBaseName
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
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i dotenv

added 1 package in 815ms

7 packages are looking for funding
  run `npm fund` for details
```

> 安装好后，就可以通过创建.env文件，并在www或其他服务文件下导入即可使用。
>
> dotenv 默认不支持变量引用，若想使用变量引用，需要安装变量增强工具包
>
> > SERVER_IP=http://${LOCAL_IP}:${PORT}
> >
> > LOCAL_IP=192.168.10.148
> >
> > process.env.SERVER_IP // "http://${LOCAL_IP}:${PORT}" (字面量，不会解析)

###### 变量增强

dotenv 默认不支持变量引用，若想使用变量引用，需要安装变量增强工具包dotenv-expand，具体安装方式如下：

```bash
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i dotenv-expand

added 1 package in 972ms

8 packages are looking for funding
  run `npm fund` for details
```

###### 文件操作

因为涉及到对env文件的写入操作，所以需要fs依赖的安装。

```bash
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i fs

added 1 package in 877ms

8 packages are looking for funding
  run `npm fund` for details
```

###### 数据库包

该项目统一使用MongoDB进行数据管理。

MongoDB需要使用mongoose包进行管理

```cmd
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i mongoose

added 19 packages in 3s

9 packages are looking for funding
  run `npm fund` for details
```

###### 加解密包

密码保存/密码对比需要进行加密和解密工作，此项目使用bcryptjs包：

```js
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i bcryptjs

added 1 package in 987ms

9 packages are looking for funding
  run `npm fund` for details
```

###### 路径混乱

moduleAliases是第三方库，可以配置package.json后实现路径引用问题，具体安装方式如下：

```bash
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i module-alias

added 1 package in 820ms

9 packages are looking for funding
  run `npm fund` for details
```

> - 路径映射
>   - package.json配置如下：
>
> ```json
> "_moduleAliases": {
>     "@bin": "./bin",
>     "@public": "./public",
>     "@routes": "./routes",
>     "@views": "./views",
>     "@src": "./src"
>   }
> ```
>
> - 引用路径
>   - 在`www`文件顶部按照如下方式使用：
>
> ```js
> const expend = require("@middleware/listenExpend.js");
> ```

###### 端口释放

日常开发会出现端口被占用的情况，处理起来比较麻烦，可以通过如下依赖包快速释放端口：

```bash
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT> npm i -g kill-port

changed 3 packages in 882ms
```

> - 手动清理
>   - 在项目中可以通过`kill-port 3000`释放端口
> - 自动清理
>   - 启动脚本增加自动清理，package.json 配置：
>
> ```json
> "scripts": {
>   "dev": "kill-port 3000 && node app.js"
> }
> ```
>
> > node app.js可以替换为实际的启动文件

###### JWT鉴权

该模板引入JWT鉴权，依赖包如下：

```bash
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend\01-ExpressTemplate> npm i jsonwebtoken

added 121 packages in 2s

9 packages are looking for funding
  run `npm fund` for details
```

> `app.vue`中引入JWT鉴权，可以不用在单独的路由中使用，全局鉴权：
>
> ```js
> const tokenAuth = require("@middleware/login.token.auth.help");
> // 注意：静态资源、跨域、body-parser之后，所有路由之前注册
> app.use(tokenAuth.checkTokenAuth);
> ```

##### 架构增强

架构增强主要是针对`bin/www`和根目录文件执行的，最终封装为类进行引入使用。拷贝`01-stuProjectsMT/middleware`到该项目根目录下。

###### 新建脚本

拷贝`01-stuProjectsMT/.env.example`到该项目根目录下并定制化修改，核心参数如下：

```env
# ============================================
# 服务器配置
# process.env.LISTEN_AREA: 用于设定是否在本地使用还是局域网内使用
# ============================================
PORT=1234
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# ============================================
# 局域网IP
# 自动获取的局域网IP（由 setup-env.js 自动更新）
# ============================================
LOCAL_IP=172.23.64.1

# ============================================
# MONGODB数据库配置
# ============================================
MONGODB_DBHOST=${LOCAL_IP}
MONGODB_DBPORT=27017
MONGODB_DBNAME=stuProjects4mt
MONGODB_USERCOLLECTION=users
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_POOL_SIZE=10
MONGODB_TIMEOUT=5000
EXIT_ON_DB_ERROR=true

# ============================================
# 登录鉴权、跳转相关
# ============================================
REDIRECT_WAITTIME=3000
LOGIN_REDIRECT_URL =/auth/login
REGISTER_REDIRECT_URL=/auth/reg
PROJECTSLIST_REDIRECT_URL=/myProjects
UNAUTH_CODE = 401
UNAUTH_MSG = 登录已失效，请重新登录

# ============================================
# JWT 配置
# JWT_EXPIRES 合法过期时间：s秒 m分 h时 d天
# ============================================
JWT_SECRET=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwianRpIjoiODAwN2QwOGItMzMzYi00MmFjLTgyYzktOTY2MDliNDU1NWNmIn0.MgSCWHLfQfq2tV8DR1nvk0QZsERX-gbSXTrxMKQFERI9iwPHCWVZ4TdAeG_X8ghJFYsxZ3DvrP87GID1VvDgARre2PMNRR2LN0wcwvz0tOXSpKl9mlYu2Le_4RE8NiAQidz_KW4zLb1hn4zT3pz4xO7tUzEKP-JUNzxJdgVCW1flH_ms9l9pDJcBIHtah-Qag2NyO8kQ-fPXHIS0fWmjUyNGfyNKjcITOkojRsmS_eCM9xPtocLjHkKS2xHb50Q71rJWtO0JjF8JNwj9e85k68ptt8im51va1CjtplEiV28yLrgDm4HhyW2OyPqhyvDS2_Z8XMRQNTj7OzjJ3FEN7A
JWT_REFRESH_SECRET=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJEaW5vQ2hpZXNhLmdpdGh1Yi5pbyIsInN1YiI6InNoZW5pcXVhIiwiYXVkIjoibmF0YWxpYSIsImlhdCI6MTc4MjEyNzQxOCwiZXhwIjoxNzgyMTI4MDE4LCJwcm9wWCI6MTcxNTd9.HwKE8r18zYjZvBHLA-MHhSwfZ228rLT0wZ105Gz1_tM3OKrwqNOX36BjQlo4fTVFH18AKBM4CT6WZB5GTW5cVC8mq39ireJiGXqmLxzJTQsZ9x71QTDqlEQBKnMM3chC93TQth7WVGpU05U8s7b75MB1RyPGuGi3eF5i7UERe9ENsPDrj5hvx9tkLzLItBlSLxYuM-5XXYEjVynT5XmZfH5WTUg42a68xzCLPScjlG_8au-72Fwaz4nnNCPVTwX9es1_3x4Hv5MZvWBCgFkiy7YVUidJckQx23Nf5QANWinC3lPrZ3LQHMQlRKkZW1KLRY2UUwmqMiIf4iyFraSk_Q
JWT_EXPIRES=2h
JWT_AUTH_HEADER_KEY=authorization
JWT_AUTH_PREFIX=Bearer

# ============================================
# CORS 配置
# ============================================
CORS_ORIGINS=["http://localhost:3000","http://localhost:8080"]


```

###### 变量加载

在www启动文件内引用变量加载和变量增强依赖包，后续文件直接可以调用环境变量设置内的值。

```js
require("dotenv-expand").expand(require("dotenv").config());
```

###### 自动构建

将在根目录创建modemon.json用于确定追踪文件夹清单：

```json
{
  "watch": ["src", "routes", "bin", "middleware", "public", "views"],
  "ignore": ["ldb.json", "src/**/**/*.json"],
  "exec": "node ./bin/www"
}
```

###### 配置路径

为了解决路径混乱问题，在package.json下配置如下路径：

```json
"_moduleAliases": {
    "@bin": "./bin",
    "@middleware": "./middleware",
    "@public": "./public",
    "@routes": "./routes",
    "@views": "./views",
    "@src": "./src"
  }
```

> - www启动文件下，引用依赖包，后续都可以直接使用：
>
> ```js
> require("module-alias/register");
> ```

###### 配置脚本

在项目启动前进行对网络的检查与显示，并对env文件的写入动作，实现服务器启动即显示相关信息。修改package.json文件，将middleware/dotenvInit.js在项目www启动前启动，使用npm命令，仅启动一次即可：

```json
"scripts": {
    "init": "npm run kPort && node ./middleware/dotenvInit.js",
    "start": "npm run init && nodemon ./bin/www"
  }
```

###### 端口释放

在项目启动前对需要的端口进行释放操作，并进一步优化start命令：

```json
"scripts": {
    "kPort": "kill-port 3000",
    "init": "npm run kPort && node ./middleware/dotenvInit.js",
    "start": "npm run init && nodemon ./bin/www"
  },
```

###### 增强监听

其中包括：优雅关闭服务器、调试及提示信息、请求超时配置、服务器错误增强，将其在www文件下引用并使用：

```js
const expend = require("@middleware/listenExpend.js");
......
function onError(error) {
  //新增：错误提示增强
  expend.serverOnError(error, port);
}
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  // 新增：优雅关闭处理
  expend.setupGracefulShutdown(server);
  //新增：调试及提示窗口
  expend.debugMsg(addr);
  //新增: 请求超时
  expend.serverSetTimeOut(server);
}
```

###### 解决跨域

在app.js中引入跨域解决依赖包：

```js
const cors = require("cors");
app.use(cors());
```

###### 上线服务

重新设计端口号，与其他服务不同即可，修改www文件如下所示。

```js
var port = normalizePort(process.env.PORT || "1234");
server.listen(port, "0.0.0.0");
```

###### 多余文件

将routes/users.js删除，只保留index.js用于后续操作，更改app.js对users.js的引用和使用：

```js
//删除以下两行
app.use("/users", usersRouter);
var usersRouter = require("./routes/users");
```

> 将public下更改为js和css文件，并删除其文件夹内部文件，将创建favicon.ico文件。

###### 项目启动

正式启动项目，项目展示信息如下：

```bash'
F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm start

> stuprojectsmt@0.0.0 start
> npm run init && nodemon ./bin/www


> stuprojectsmt@0.0.0 init
> npm run kPort && node ./middleware/dotenvInit.js


> stuprojectsmt@0.0.0 kPort
> kill-port 3000

Process on port 3000 killed
🔧 开始配置环境变量...
🌐 检测到局域网IP: 172.23.64.1
✅ .env 文件已更新: F:\CodingMan\Code2Git\01-Stu\07-StuProject\01-stuProjectsMT\.env
✅ 环境变量配置完成！
💡 LOCAL_IP = 172.23.64.1
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\* routes\**\* bin\**\* middleware\**\* public\**\* views\**\*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www ./bin/www`
◇ injected env (26) from .env // tip: ⌘ custom filepath { path: '/custom/path/.env' }

==================================================
🚀 Server Startup Successful!
==================================================
📡 Environment: development
📡 Ports: 1234
📡 Process ID: 29024
📡 SERVER IP: 172.23.64.1

📍 Access Address:
   • Local Address:    http://localhost:1234
   • Local IP:    http://172.23.64.1:1234
GET / 200 8.391 ms - 207
GET /stylesheets/style.css 200 2.351 ms - 111
```

#### 模板使用

##### 项目名称

- 修改文件夹名称`express-template`为项目名称`nexSM`;
- 修改项目内文件`package.json`内的项目名称为`nexSM`，共计1处；
- 修改项目内文件`package-lock.json`内的项目名称为`nexCM`，共计2处；

##### 项目资源

- 修改`public/favicon.ico`为项目图标；
- 修改或删除`route/index.js`的名称和内容为项目内容；
- 修改或删除`views/index.ejs`的名字和内容为项目内容；

##### 安装依赖

进入项目文件夹`nexSM`，并执行`npm install`

```bash
F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\02-Backend> npm i
added 931 packages in 17s

122 packages are looking for funding
  run `npm fund` for details
```

> 执行后自动读取`package.json`里所有 dependencies/devDependencies，下载生成全新`node_modules`文件夹

##### 启动服务

```bash
npm start
```
