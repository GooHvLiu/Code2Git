#### 项目模板-V1.1_02

##### 版本描述

* <span style="color:orange;font-weight:normal;font-family:'楷体">1.0_01版本更新了mySQL的基本使用。</span>
* <span style="color:orange;font-weight:normal;font-family:'楷体">1.1_01版本基于实际项目重大更新：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">整体架构重构：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">中间件增加鉴权模块：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">数据库模板增加菜单数据库和用户数据库及联动数据库：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">引用`_moduleAliases`模块后续项目通用路径：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">测试模板全部使用`wxpress`框架搭建全`controllers`测试：</span>

* <span style="color:orange;font-weight:normal;font-family:'楷体">1.1_02版本更新：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">取消专属MySQl文件夹，项目模板通用：</span>
  * <span style="color:orange;font-weight:normal;font-family:'楷体">优化中间件`middlewares`部分代码内容：</span>

##### 文件架构

```文本
mySQLV1dot1
 ┣ config/                                   # config全局配置文件夹
 ┃ ┗ db.config.js                            # MySQL数据库连接池配置
 ┣ controllers/                              # controllers 控制器层目录（接收请求、统一返回）
 ┃ ┣ auth/                                   # controllers/auth集合：权鉴 控制器层
 ┃   ┗ index.auth.js                         # controllers/auth导出集合
 ┃ ┣ menu4users/                             # controllers/menu4users目录
 ┃   ┗ index.menu4users.js                   # controllers/menu4users导出集合
 ┃ ┣ users/                                  # controllers/users目录
 ┃   ┗ index.users.js                        # controllers/users导出集合
 ┃ ┗ index.js                                # controllers导出集合
 ┣ middlewares/                              # middlewares 全局中间件
 ┃ ┣ auth/                                   # middlewares/auth目录
 ┃   ┗ auth.middleware.js                    # JWT 鉴权中间件
 ┃ ┣ enhance/                                # middlewares/enhance目录
 ┃   ┗ dotenvInit.js                         # 启动前配置脚本 获取局域网IP 写入现有的 .env 文件
 ┃   ┗ errorHandle.js                        # 全局统一异常处理中间件
 ┃   ┗ listenExpend.js                       # 优雅关闭服务器
 ┃   ┗ urlHelper.js                          # 清洗跳转地址，去除空格、首尾引号、强制根路径，附加追踪参数
 ┣ models/                                   # models 数据库底层模块
 ┃ ┣ base/                                   # models/base目录
 ┃   ┗ index.js                              # models/base导出集合
 ┃   ┗ main.base.js                          # models/base集合：核心 数据库底层模块
 ┃   ┗ users.base.js                         # models/base集合：用户基础实现 数据库底层模块
 ┃ ┣ menu4users/                             # models/users目录
 ┃   ┗ index.menu4users.js                   # models/menu4users集合:菜单获取 数据库底层模块
 ┃ ┣ users/                                  # models/users目录
 ┃   ┗ index.users.js                        # models/users集合:用户 数据库底层模块
 ┃ ┗ index.js                                # models 导出集合
 ┣ services/                                 # service 业务逻辑层
 ┃ ┣ auth/                                   # service/auth目录        
 ┃   ┗ index.auth.js                         # service/auth集合：权鉴接口控制器
 ┃ ┣ menu4users/                             # service/menu4users目录      
 ┃   ┗ index.menu4users.js                   # service/menu4users集合：菜单获取接口控制器
 ┃ ┣ users/                                  # service/users目录
 ┃   ┗ index.users.js                        # service/users集合：用户接口控制器
 ┃ ┗ index.js                                # service 导出集合
 ┣ test4mysql/                               # 本地测试目录（仅开发调试）
 ┃ ┣ node_modules                            # 测试依赖包
 ┃ ┣ routes                                  # 路由注册目录
 ┃ ┗ menuControllersTest.route.js            # 菜单获取接口路由配置
 ┃ ┗ usersControllersTest.route.js           # 用户接口路由配置
 ┃ ┣ .env                                    # 环境变量配置文件
 ┃ ┣ app.js                                  # 项目入口启动文件
 ┃ ┣ package-lock.json                       # 依赖版本锁定文件
 ┃ ┣ package.json                            # 项目依赖与脚本配置
 ┣ utils/                                    # 全局工具函数
 ┃ ┣ sql.util.js                             # SQL安全/分页工具
 ┃ ┗ validator.util.js                       # 参数校验工具
 ┗ ReadMe.md                                 # 项目说明文档
```

##### 使用说明

###### 安装依赖

```bash
npm i fs nodemon dotenv dotenv-expand mysql2 module-alias bcryptjs jsonwebtoken svg-captcha uuid
```

> 1. 查看所以依赖:`npm ls --depth=0`
> 2. express模板内使用，涉及依赖不含在内
> 3. npm uninstall ***
>
> 4. module-alias是为了解决路径引入错乱问题

###### 环境配置

在使用该模块前，需要优先配置好所需要的数据库账号、密码、名称、表名称、IP地址和端口号。在.env文件上至少具备如下属性：

```js
# ============================================
# 使用手册
# process.env.LISTEN_AREA: 用于设定是否在本地使用还是局域网内使用
# ${LOCAL_IP}: 用于调取变量
# ============================================

# ============================================
# 服务器配置
# PORT：设置服务器端口号
# LISTEN_AREA：设置后端监听区域
# NODE_ENV：设置当前阶段
# SERVER_IP设置后端服务器最终的IP地址（包括端口号）
# ============================================
PORT=3002
LISTEN_AREA=0.0.0.0
NODE_ENV=development
SERVER_IP=http://${LOCAL_IP}:${PORT}

# ============================================
# 局域网IP
# 自动获取的局域网IP（由 setup-env.js 自动更新）
# ============================================
LOCAL_IP=172.26.224.1

# ============================================
# MYSQL 多环境配置
# MYSQL_DEV_DBHOST：（开发环境）数据库主机IP地址
# MYSQL_DEV_DBPORT：（开发环境）数据库主机端口号
# MYSQL_DEV_USERNAME：（开发环境）登录数据库的用户名
# MYSQL_DEV_PASSWORD：（开发环境）登录数据库的密码
# MYSQL_DEV_DBNAME：（开发环境）数据库名称
# MYSQL_TEST_DBTABLE：（开发环境）表名称

# MYSQL_TEST_DBHOST：（测试环境）数据库主机IP地址
# MYSQL_TEST_DBPORT：（测试环境）数据库主机端口号
# MYSQL_TEST_USERNAME：（测试环境）登录数据库的用户名
# MYSQL_TEST_PASSWORD：（测试环境）登录数据库的密码
# MYSQL_TEST_DBNAME：（测试环境）数据库名称
# MYSQL_TEST_DBTABLE：（测试环境）表名称
# ============================================
MYSQL_DEV_DBHOST=127.0.0.1
MYSQL_DEV_DBPORT=3306
MYSQL_DEV_USERNAME=root
MYSQL_DEV_PASSWORD=123456
MYSQL_DEV_DBNAME=nexSM01
MYSQL_DEV_USER_DBTABLE=nex_user
MYSQL_DEV_MENU_DBTABLE=nex_menu
MYSQL_DEV_MENU4USER_DBTABLE=nex_user_menu

MYSQL_TEST_DBHOST=127.0.0.1
MYSQL_TEST_DBPORT=3306
MYSQL_TEST_USERNAME=root
MYSQL_TEST_PASSWORD=123456
MYSQL_TEST_DBNAME=nexSM01
MYSQL_TEST_USER_DBTABLE=nex_user
MYSQL_TEST_MENU_DBTABLE=nex_menu
MYSQL_TEST_MENU4USER_DBTABLE=nex_user_menu


# ============================================
# 登录鉴权、页面跳转相关
# ============================================
REDIRECT_WAITTIME=3000
LOGIN_REDIRECT_URL=/prod-api/login
CAPTCHACODE_URL=/prod-api/captchaImage
REGISTER_REDIRECT_URL=/prod-api/auth/reg
UNAUTH_CODE=401
UNAUTH_MSG=登录已失效，请重新登录

# ============================================
# 免鉴权通用接口（心跳、服务配置接口）
# ============================================
HEARTBEAT_REDIRECT_URL=/heartbeat
SERVER_INFO_REDIRECT_URL=/server-info

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
# Token鉴权全局白名单，逗号分隔，无需手动维护路径
# 自动读取上方已定义的页面/接口地址，新增只需要在上文添加变量
# ============================================
TOKEN_WHITE_LIST=${LOGIN_REDIRECT_URL},${CAPTCHACODE_URL},${HEARTBEAT_REDIRECT_URL},${SERVER_INFO_REDIRECT_URL}


# ============================================
# CORS 配置
# ============================================
CORS_ORIGINS=["http://localhost:3002","http://localhost:8080"]
```

###### 存放位置

请将整个文件放在项目目录，并解压为`/src`文件夹内。

###### 路径配置

因该模块将`controlloers`,`services`,鉴权、全局错误捕获、验证功能都集成进来了，所以，在设计之初就已经考虑到路径的问题，所以使用了`ModuleAliases`模块，并将本模板所需要的路径全部按照如下的方式已经配置到`test4mysql/package.json`内：

```json
  "_moduleAliases": {
    "@config": "../config",
    "@controllers": "../controllers",
    "@middlewares": "../middlewares",
    "@models": "../models",
    "@services": "../services",
    "@utils": "../utils",
    "@test4mysql": "./"
  }
```

> 在实际项目使用中，只需要修改、添加或删除对应的路径即可。

###### 引入应用

本例已加入使用，采用`express`框架，项目路径为`test4mysql`文件夹内，使用时，先通过`npm i`安装依赖，再通过`npm start`启动，该项目已引入`nodemon`模块并配置好监控文件，使用时，可根据自己的意愿修改：

```js
// 引入路径优化第三方库moudle-alias
require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());

const express = require("express");
const cors = require("cors");

// 全局仅引入一次，自动初始化连接池，无需重复导入
require("@models/base/main.base.js").pool;

// 引入全局错误处理模块
const errorHandler = require("@middlewares/error.middleware.js");

// 全局错误处理（必须放在所有路由之后）
app.use(errorHandler);
......
```

> 列出了主要模块，其他模块参考`express`使用即可
