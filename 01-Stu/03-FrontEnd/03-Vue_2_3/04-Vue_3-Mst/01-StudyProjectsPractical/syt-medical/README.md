# 学习项目-尚医通

## 技术选型

|   分类    |        技术        |
| :-------: | :----------------: |
| 前端框架  | Vue3（组合式 API） |
| 构建工具  |        Vite        |
| 类型支持  |     TypeScript     |
|   路由    |     vue-router     |
| 状态管理  |       Pinia        |
| UI 组件库 |    element-plus    |
| 网络请求  |       Axios        |
|   后端    | Node.js + Express  |
| 接口文档  |      Open API      |
| 数据方案  |      虚拟数据      |

## 前置准备

### 项目创建

#### 命令工具

通过`npm create vite@latest`工具命令创建：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\01-syt-medical> npm create vite@latest
Need to install the following packages:
create-vite@9.2.1
Ok to proceed? (y) y

> npx
> create-vite

│
◇  Project name:
│  syt-medical
│
◇  Select a framework:
│  Vue
│
◇  Select a variant:
│  TypeScript
│
◇  Install with npm and start now?
│  Yes
│
◇  Scaffolding project in F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\01-syt-medical\syt-medical...
│
◇  Installing dependencies with npm...

added 48 packages in 9s

9 packages are looking for funding
  run `npm fund` for details
│
◇  Starting dev server...

> syt-medical@0.0.0 dev
> vite


  VITE v8.3.0  ready in 1753 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### TS / Vue

缺少 `vite-env.d.ts` — 没有它，TS 不认识 `.vue` 模块，创建`vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

### 整理代码

#### 主要页面

将无用代码`HelloWorld.vue`删除，调整`app.vue`文件:

```vue
<template>
  <div class="page-wrap"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less"></style>
```

#### 核心引入

将无用代码`main.ts`调整，调整对应代码`main.ts`文件:

```js
// Vue3 框架提供的方法 createApp 方法，可以用来创建应用实例方法
import { createApp } from "vue";
// 引入根组件App
import App from "./App.vue";
// 利用 createApp 方法创建应用实例
const app=createApp(App)
// 将应用实例挂载到挂载点上
app.mount("#app");
```

#### 展示页面

将`index.html`调整文字和图标：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>尚医通</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

#### 首启打开

设置`package.json`，实现启动服务后自动打开浏览器页面：

```json
{
  "name": "syt-medical",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --open",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.42"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "@vitejs/plugin-vue": "^6.0.8",
    "@vue/tsconfig": "^0.9.1",
    "typescript": "~6.0.2",
    "vite": "^8.3.0",
    "vue-tsc": "^3.3.11"
  }
}
```

> 核心代码：`"dev": "vite --open"`

### 引用路径

#### 设置别名

将`src`文件夹设置别名@，可以通过@直接访问到`src`路径，修改文件`vite.config.ts`：

```ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
```

> 核心代码：
>
> `import path from "path";`和`resolve: { alias: { "@": path.resolve(__dirname, "src") } }`

#### 智能提示

找到`tsconfig.app.json`配置文件，找到配置项`compilerOptions`添加配置，这一步的作用是让` IDE `可以对路径进行智能提示：

```json
"paths": {
      "@/*": ["./src/*"]
    },
```

> 选项`baseUrl`已弃用，直接**删除 baseUrl**，paths 的值前面加上`./`。

### 后端服务

通过` AI `生成与教学一致的后端服务。

#### 技术路线

* `node.js`
* `express`

#### 项目结构

```text
server/
├── app.js                  # 入口，端口 8201
├── package.json
├── README.md               # 详细接口文档
├── data/                   # 所有虚拟数据单独存放，可直接编辑增加
│   ├── hospitals.js        # 18 家医院（覆盖京沪苏粤川陕等）
│   ├── departments.js      # 科室树（大科室→子科室）
│   ├── schedules.js        # 医生排班（未来14天自动生成，量大）
│   ├── dicts.js            # 省市区/医院等级/证件类型等字典
│   ├── users.js            # 测试用户
│   ├── patients.js         # 就诊人
│   └── orders.js           # 订单
├── routes/                 # 路由
│   ├── hosp.js             # 医院/科室/排班/挂号
│   ├── user.js             # 登录/实名认证/就诊人CRUD
│   ├── msm.js              # 短信验证码
│   ├── order.js            # 订单
│   └── cmn.js              # 字典
├── middlewares/auth.js     # Token 认证
└── utils/response.js       # 统一响应格式
```

#### 启动方式

```bash
cd server
npm run dev
```

> 服务跑在 `http://localhost:8201`，前端 `Vite` 代理我已经帮你配好了（`web/vite.config.ts`）

#### 测试账号

- 手机号：`13800000001`，验证码：`111111`（已实名，有就诊人和订单数据）
- 任意手机号 + `111111` 都会自动注册新用户

#### 验证接口

- 医院分页列表（18 家）、医院详情、科室树、医生排班分页（单科室 36 条排班）
- 登录 / 获取用户信息 / 实名认证 / 退出
- 就诊人增删改查
- 字典查询（医院等级、省市区联动）
- 订单列表 / 详情 / 取消
- 预约挂号提交（自动扣号源、生成订单）

> 所有接口返回格式与尚医通官方一致：`{ code: 200, message: "成功", ok: true, data: ... }`。数据在内存中，重启恢复初始值，直接编辑 `data/` 下的文件就能加数据

#### OpenAPI

在后端集成`Swagger`，实现自动扫描API接口和便捷测试的功能。

##### 安装依赖

通过如下方式安装`swagger-ui-express swagger-jsdoc redoc-express`三个依赖包：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\server> npm 
i swagger-ui-express swagger-jsdoc redoc-express

added 43 packages in 5s

26 packages are looking for funding
  run `npm fund` for details
```

> - swagger-jsdoc：解析注释
> - swagger-ui-express：swagger 网页 UI
> - redoc-express：高颜值文档页面

##### 核心配置

在项目根目录创建`openAPI/swagger.js`用于生成`openAPI/data`下的配置文件：

```
const swaggerAutogen = require('swagger-autogen')({ openapi: "3.0.0" });

// 输出openapi文件，扫描入口app.js
const outputFile = './data/swagger-output.json';
const endpointsFiles = ['../app.js'];

// 文档基础信息
const doc = {
  info: {
    title: "尚医通 项目API文档",
    version: "1.0.0",
    description: "尚医通Mock后端接口文档，自动扫描路由生成，无需写注释",
  },
  servers: [
    {
      // 写入IP地址
      url: "http://localhost:8201",
      description: "本地开发环境"
    }
  ]
};

swaggerAutogen(outputFile, endpointsFiles, doc);

```

> 1. 为了生成`OpenAPI 3.0`版本：`const swaggerAutogen = require('swagger-autogen')({ openapi: "3.0.0" });`
> 2. 由于`swagger-autogen`无法自动识别 query 参数：`/api/hosp/list?page=1&limit=10` 的 page、limit 它识别不到，需要手动在 swagger-output.json 补充，或者写少量提示注释，同时，不能自动识别 post 的请求 `body `和返回 `data` 结构。只能拿到接口地址，字段描述需要手动补充。

##### 启动页面

在`app.js`中配置`swagger`设置：

```js
const express = require("express");

// 引入 Open API 需要的资源 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openAPI/data/swagger-output.json');

const cors = require("cors");

const app = express();
const PORT = 8201;

// ===== 中间件 =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 打印请求日志（学习用，方便看前端调了什么接口）
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// ========== 挂载swagger页面 ==========
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }'
}));

// ===== 路由 =====
// 医院模块
app.use("/api/hosp/hospital", require("./routes/hosp"));
// 用户/就诊人模块
app.use("/api/user", require("./routes/user"));
// 短信模块
app.use("/api/user/msm", require("./routes/msm"));
// 订单模块
app.use("/api/order/orderInfo", require("./routes/order"));
// 字典模块
app.use("/api/cmn/dict", require("./routes/cmn"));

// ===== 根路由 =====
app.get("/", (req, res) => {
  res.send(`
    <h1>尚医通 Mock 后端已启动</h1>
    <p>端口：${PORT}</p>
    <p>接口前缀：/api</p>
    <ul>
      <li>GET  /api/hosp/hospital/findHospitalPage/1/10 - 医院列表</li>
      <li>GET  /api/hosp/hospital/department/1000_0 - 科室列表</li>
      <li>POST /api/user/userInfo/login - 登录</li>
      <li>GET  /api/cmn/dict/findByDictCode/Hostype - 字典</li>
    </ul>
  `);
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: `接口不存在: ${req.method} ${req.url}`,
    ok: false,
    data: null,
  });
});

// ===== 错误处理 =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    code: 500,
    message: "服务器内部错误: " + err.message,
    ok: false,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log("========================================");
  console.log("  尚医通 Mock 后端启动成功！");
  console.log(`  地址: http://localhost:${PORT}`);
  console.log("========================================");
  console.log("");
  console.log("测试登录手机号：13800000001 或 13800000002");
  console.log("测试验证码：111111（任意手机号均可登录）");
  console.log("");
  console.log("记得在前端 vite.config.ts 中配置代理：");
  console.log("  server: { proxy: { '/api': 'http://localhost:8201' } }");
});
```

##### 测试页面

可以通过如下路径进行`web`端访问:

```bash
http://localhost:8201/api/api-docs
```

### 重置样式

#### 创建样式

`www.github.com`搜索`reset.less`样式，并放入`src/style/reset.less`内:

```less
/* http://meyerweb.com/eric/tools/css/reset/
   v5.0.2 | 20191019
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
	display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
	line-height: 1;
}
menu, ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
```

#### 引入样式

在`main.ts`中全局引入：

```js
// Vue3 框架提供的方法 createApp 方法，可以用来创建应用实例方法
import { createApp } from "vue";
// 引入样式重置文件 reset.less
import "@/style/reset.less";
// 引入根组件App
import App from "./App.vue";
// 利用 createApp 方法创建应用实例
const app=createApp(App)
// 将应用实例挂载到挂载点上
app.mount("#app");
```

#### 安装依赖

因系统使用`less`格式，所以，需要安装`less`依赖包：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm i less

added 23 packages in 2s

13 packages are looking for funding
  run `npm fund` for details
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> 
```

### 工具封装

#### 聚合导出

根目录创建聚合文件`index.ts`:

```ts
// Axios 网络请求聚合导出
export * from "./request/index";

// 导出验证工具所有方法
export * from "./verify";

// 导出所有本地存储 的方法
export * from "./localStorage";
```

#### 网络请求

本案例使用`axios`实现网络请求功能，工具封装在`src/utils/request/index.ts`中。

##### 安装依赖

通过如下方式安装`axios`依赖：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm i axios

added 29 packages in 7s

34 packages are looking for funding
  run `npm fund` for details
```

##### 封装目的

* 利用`axios`请求，实现请求拦截器/响应拦截器功能
* 利用`axios`请求，可以在请求拦截器中携带公共的参数：token
* 利用`axios`请求，可以通过响应拦截器实现简化服务器返回的数据，处理`http`网络错误

##### 封装实现

对`axios`进行二次封装，实现请求拦截和响应拦截。

```ts
/**
 * ==========================================
 * Axios 请求统一封装 TS版
 * ==========================================
 * 请求拦截器：Token注入、白名单放行
 * 响应拦截器：业务码判断、错误提示、Token过期跳转
 */
import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
/**
 * 创建 axios 实例
 */
export const request: AxiosInstance = axios.create({
  // 环境变量中的对应字段： VITE_APP_BASE_API = /api
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  // 环境变量中的对应字段： VITE_APP_TIME_OUT = 1000
  timeout: Number(import.meta.env.VITE_APP_TIME_OUT)
});

/**
 * 请求拦截器
 */
service.interceptors.request.use( ... );

/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
request.interceptors.response.use( ... );
```

> 最简易的封装，请求拦截和响应拦截参考如下

###### 请求拦截

简易的请求拦截器，不包含任何其他功能代码，后续会继续增加：

```ts
/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    console.log("恭喜，这只是提示您：请求拦截器已生效~");

    return requestConfig;
  },
  (error) => {
    // 请求发送失败 返回错误信息
    console.log("糟糕，请求拦截器发送失败~");

    return Promise.reject(error);
  }
);
```

###### 响应拦截

简易的响应拦截器，不包含任何其他功能代码，后续会继续增加：

```ts
/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
request.interceptors.response.use(
  (response) => {
    console.log("后端返回的数据@@:", response);
    const res = response;
    // 业务成功
    if (res.data.code === 200) {
      console.log("恭喜，响应拦截器已生效，响应码:200");

      return res;
    } else {
      console.log(res.data.message || "业务失败");
      return Promise.reject(res);
    }
  },
  (error: AxiosError) => {
    // 容错：没有response的情况（断网、跨域、超时）
    if (!error.response) {
      console.log("网络异常，请检查网络连接~");
      return Promise.reject(error);
    }
    // 处理 http 网络错误
    const status = error.response.status;
    let msg = "";
    switch (status) {
      case 401:
        msg = "请求参数有误~";
        break;
      case 404:
        msg = "请求失败：接口路径不存在";
        break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 505:
        msg = "服务器挂掉了~";
        break;
      default:
        msg = `HTTP错误：${status}`;
    }
    console.log(msg);
    return Promise.reject(error);
  }
);
```

##### 优化01段

后端返回数据统一格式为：

| 场景     | 返回                                                         |
| -------- | ------------------------------------------------------------ |
| 成功     | `{"code":200,"message":"...","ok":true,"data":{...}}`        |
| 业务失败 | `{"code":201,"message":"手机号不能为空","ok":false,"data":null}` |
| 未登录   | `{"code":208,"message":"未登录","ok":false,"data":null}`     |
| 404      | `{"code":404,"message":"...","ok":false,"data":null}`        |

前端请求响应拦截器，将`code===200`和`code!=200`的返回数据格式做统一处理，`src/utils/request/index.ts:`：

```ts
/**
 * ==========================================
 * Axios 请求统一封装 TS版
 * ==========================================
 * 请求拦截器：Token注入、白名单放行
 * 响应拦截器：业务码判断、错误提示、Token过期跳转
 */
import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
/**
 * 创建 axios 实例
 */
export const request: AxiosInstance = axios.create({
  // 环境变量中的对应字段： VITE_APP_BASE_API = /api
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  // 环境变量中的对应字段： VITE_APP_TIME_OUT = 1000
  timeout: Number(import.meta.env.VITE_APP_TIME_OUT)
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    console.log("恭喜，这只是提示您：请求拦截器已生效~");

    return requestConfig;
  },
  (error) => {
    // 请求发送失败 返回错误信息
    console.log("糟糕，请求拦截器发送失败~");

    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
request.interceptors.response.use(
  (response) => {
    console.log("后端返回的数据@@:", response);
    const res = response.data;
    // 业务成功
    if (res.code === 200) {
      // console.log("恭喜，响应拦截器已生效，响应码:200");
      return response;
    } else {
      // console.log(res.data.message || "业务失败");
      return Promise.reject(res);
    }
  },
  (error: AxiosError) => {
    // 容错：没有response的情况（断网、跨域、超时）
    if (!error.response) {
      // console.log("网络异常，请检查网络连接~");
      return Promise.reject({ code: 500, message: "网络异常，请检查网络连接", ok: false, data: null });
    }
    // 处理  HTTP 错误：也统一 reject 业务数据
    return Promise.reject(error.response.data);
  }
);
```

> 将网络请求失败和`code!=200`的返回数据进行格式化处理，统一返回数据格式

#### 验证封装

该模块封装常用的字段验证的相关工具。

##### 登录账号

校验登录模块的输入手机号输入框，验证其是否有输入，是否满足手机号码字段定义，以及验证码是否正确，`src/utils/verify.ts`核心代码如下:

```ts
/**
 * ==========================================
 * 校验工具 TS版
 * ==========================================
 * 登录输入：校验手机号格式是否正确
 */
// 校验 手机号码 的正则表达式
const regularPhoneNumber = /^1[3-9]\d{9}$/;
// 校验 六位纯数字验证码 的正则表达式
const regularCaptchaCode = /^\d{6}$/;
// 导出 手机号码 验证结果
export const verifyPhoneNumber = (phoneNumber: string | null | undefined): boolean => {
  // 先转字符串，防止不是字符串调用trim报错
  const str = String(phoneNumber ?? "").trim();
  // 验证手机号是否合法的结果
  if (!str) return false;
  return regularPhoneNumber.test(str);
};
// 导出 验证码 的验证结果
export const verifyCaptchCode = (captchCode: string | null | undefined): boolean => {
  // 先转字符串，防止不是字符串调用trim报错
  const str = String(captchCode ?? "").trim();
  // 验证 验证码 是否合法的结果
  if (!str) return false;
  return regularCaptchaCode.test(str);
};
```

#### 本地持久

将本地持久化存储封装为`src/utils/localStorage.ts`，用于本地的存储，读取，清楚等相关操作:

```ts
/**
 * ==========================================
 * 持久化存储、读取与清除工具 TS版
 * ==========================================
 */
// 引入用户数据
import type { ResLoginItem } from "@/types/userLogin/index";
// 引入本地存储用户数据 常量
import { USERINFO_LOCALSTORAGE } from "@/const/index";

// 用户信息的类
class UserInfoClass {
  /**
   * 本地化 存储用户信息
   * @param userInfo 登录返回的用户对象
   */
  setLocalStorage = (userInfo: ResLoginItem) => {
    // 将用户信息做本地持久化
    localStorage.setItem(USERINFO_LOCALSTORAGE, JSON.stringify(userInfo));
  };

  /**
   * 本地化 读取用户信息
   * @returns 存在则返回用户对象，不存在/解析失败返回 null
   */
  getLocalStorage = (): ResLoginItem | null => {
    const storageStr = localStorage.getItem(USERINFO_LOCALSTORAGE);
    // 没有数据直接返回 null
    if (!storageStr) return null;
    try {
      return JSON.parse(storageStr) as ResLoginItem;
    } catch (err) {
      // JSON损坏，清除脏数据，返回null，防止页面崩溃
      this.clearLocalStorage();
      return null;
    }
  };

  /**
   * 本地化 清除用户信息
   */
  clearLocalStorage = () => {
    // 将用户信息做本地持久化
    localStorage.removeItem(USERINFO_LOCALSTORAGE);
  };
}
export const userInfoMethods = new UserInfoClass();

```

#### 日期工具

使用轻量日期处理库文件`day.js`，安装依赖和使用如下。

##### 安装依赖

```bash
npm install dayjs
```

##### 工具函数

在`src/utils/dateFormatter.ts`下封装一个日期工具，引用`day.js`：

```ts
// utils/dateFormatter.ts
import dayjs from "dayjs";
import type { ConfigType, OpUnitType, QUnitType } from "dayjs"; // 改为 import type
import "dayjs/locale/zh-cn";

// 按需引入插件（如需要相对时间、时区等，取消注释即可）
// import relativeTime from 'dayjs/plugin/relativeTime';
// import timezone from 'dayjs/plugin/timezone';
// import utc from 'dayjs/plugin/utc';

// dayjs.extend(relativeTime);
// dayjs.extend(timezone);
// dayjs.extend(utc);

dayjs.locale("zh-cn");

/**
 * 日期格式化工具函数
 * @param date - 待格式化的日期，支持时间戳、日期字符串、Date 对象、dayjs 实例
 * @param format - 目标格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @param fallback - 日期无效或为空时的兜底返回值，默认 '—'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date?: ConfigType | null, format = "YYYY-MM-DD HH:mm:ss", fallback = "—"): string => {
  if (date === null || date === undefined || date === "") {
    return fallback;
  }

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return fallback;
  }

  return parsed.format(format);
};

/**
 * 获取当前日期，按指定格式返回
 * @param format - 目标格式，默认 'YYYY-MM-DD'
 * @returns 格式化后的当前日期字符串
 */
export const getCurrentDate = (format = "YYYY-MM-DD"): string => {
  return dayjs().format(format);
};

/**
 * 获取当前年月，格式如 "2026年10月"
 * @returns 当前年月字符串
 */
export const getCurrentYearMonth = (): string => {
  return dayjs().format("YYYY年MM月");
};

/**
 * 判断两个日期是否属于同一单位（默认按月比较）
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @param unit - 比较单位，默认 'month'
 * @returns 是否相同
 */
export const isSame = (date1: ConfigType, date2: ConfigType, unit: QUnitType | OpUnitType = "month"): boolean => {
  return dayjs(date1).isSame(dayjs(date2), unit as unknown as any);
};

/**
 * 判断两个日期是否属于同一个月
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @returns 是否同月
 */
export const isSameMonth = (date1: ConfigType, date2: ConfigType): boolean => {
  return isSame(date1, date2, "month");
};

/**
 * 计算两个日期之间的差值
 * @param date1 - 日期1
 * @param date2 - 日期2
 * @param unit - 差值单位，默认 'day'
 * @returns 差值（date1 - date2）
 */
export const getDateDiff = (date1: ConfigType, date2: ConfigType, unit: QUnitType | OpUnitType = "day"): number => {
  return dayjs(date1).diff(dayjs(date2), unit);
};

/**
 * 日期加减
 * @param date - 原始日期
 * @param amount - 加减数量，正数加，负数减
 * @param unit - 单位，默认 'day'
 * @param format - 返回格式，默认 'YYYY-MM-DD'
 * @returns 计算后的日期字符串
 */
export const addDate = (date: ConfigType, amount: number, unit: OpUnitType = "day", format = "YYYY-MM-DD"): string => {
  return dayjs(date)
    .add(amount, unit as unknown as any)
    .format(format);
};

/**
 * 解析日期为 dayjs 实例，无效时返回 null
 * @param date - 待解析的日期
 * @returns dayjs 实例或 null
 */
export const parseDate = (date?: ConfigType | null): dayjs.Dayjs | null => {
  if (date === null || date === undefined || date === "") {
    return null;
  }
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed : null;
};

```

#### 医生排班

将后端传过来的数据进行排班处理，排班封装为一个工具包，`src/utils/doctorSchedule.ts`:

```ts
/**
 * ==========================================
 * 该工具是对后端数据进行排版的工具包 TS版
 * ==========================================
 */
// 引入数据类型
import type { DoctorScheduleContent, DoctorsScheduleItems, ScheduleArr } from "@/types/doctorSchedule/index";
// 排班类定义
class Schedule {
  /**
   * 按排班日期分组，生成日期卡片数组
   * @param data 后端返回排班分页对象
   * @returns 日期卡片数组[{workDate, dayOfWeek, tipText}]
   */
  scheduleByWorkDate = (data: DoctorsScheduleItems): ScheduleArr => {
    // 提取排班列表
    const doctorsScheduleData: DoctorScheduleContent[] = data.content;
    // 通过 ts 的 Record 定义一个映射结构：key日期字符串，value当日排班数组
    const groupMap: Record<string, DoctorScheduleContent[]> = {};
    // 第一步 遍历后端返回的医生们的排班数据
    doctorsScheduleData.forEach((item) => {
      // 如果以医生排班数据中的workDate为键值没有查询到，则保存
      if (!groupMap[item.workDate]) {
        // 先创建一个空字段
        groupMap[item.workDate] = [];
      }
      // 将去重，按照工作时间排序的数据保存起来
      groupMap[item.workDate].push(item);
    });
    // 第二步 将对象转为数组 日期按从小到大的顺序排列
    const dateCardList: ScheduleArr = Object.keys(groupMap)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((workDate) => {
        const dayList = groupMap[workDate];
        // 取该日期第一条的星期
        const dayOfWeek = dayList[0].dayOfWeek;
        // 判断当天有没有可挂号号源：status=1 并且 availableNumber>0
        const hasAvailable = dayList.some((sch) => sch.status === 1 && sch.availableNumber > 0);
        // 按上午(0)下午(1)分组
        const morningList = dayList.filter((sch) => sch.workTime === 0);
        const afternoonList = dayList.filter((sch) => sch.workTime === 1);
        return {
          workDate,
          dayOfWeek,
          tipText: hasAvailable ? "可挂号" : "停止挂号",
          // 【可选扩展】把当天排班也一并返回，页面不用二次查找分组
          scheduleList: dayList,
          morningList,
          afternoonList
        };
      });
    return dateCardList;
  };
}

export const doctorsScheduleMethods = new Schedule();
```

### 解决跨域

`Vue3`官方推荐通过`proxy`的方式解决跨域问题，通过配置`vite.config.ts`文件解决跨域：

```ts
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import path from "path";

// defineConfig 采用函数写法，可以拿到 mode 和 command
export default defineConfig(({ mode }) => {
  // 在这里加载环境变量
  const env = loadEnv(mode, process.cwd(), "");
  console.log("当前mode：", mode);
  console.log("代理目标地址：", env.VITE_APP_PROXY_TARGET);

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src")
      }
    },
    server: {
      proxy: {
        // 匹配 /api 开头的请求
        "/api": {
          // env 文件中的字段：VITE_APP_PROXY_TARGET = http://127.0.0.1:8201
          target: env.VITE_APP_PROXY_TARGET,
          // 开启跨域
          changeOrigin: true
        }
      }
    }
  };
});
```

> 可彻底解决跨域问题

```ts
// 单条医院名称清单 数据类型
export interface HospitalItem {
  id: string;
  hosname: string;
  hoscode: string;
  hostype: string;
  provinceCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
  logoData: string;
  intro: string;
  route: string;
  status: number;
  bookingRule: {
    cycle: number;
    releaseTime: string;
    stopTime: string;
    quitDay: number;
    quitTime: string;
    rule: string[];
  };
  hostypeString: string;
  provinceString: string;
  cityString: string;
  districtString: string;
}

// 医院名称清单分页接口里 data 的结构
export interface HospitalPageResponse {
  totalElements: number;
  content: HospitalItem[];
  totalPages: number;
  size: number;
  number: number;
}

// 单条医院等级 数据类型
export interface HospitalLevelItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  parentId: number;
}

// 医院等级 分页接口里 data 的结构
export type HospitalLevelPageResponse = HospitalLevelItem[];

// 医院区域 数据类型
export interface HospitalRegionItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  parentId: number;
}

// 医院区域 分页接口里 data 的结构
export type HospitalRegionPageResponse = HospitalRegionItem[];

```

## 常量定义

常量数据以及后端网络请求常量会保存在`src/const`文件夹内。

### 聚合定义

在根目录下创建`index.ts`文件作为聚合文件，其他文件引入此文件即可：

```ts
// 导出 网络请求中 的参数变量
export * from "./reqParams";

// 导出 路由路径常量 的参数变量
export * from "./router";
```

### 请求常量

后端网络请求常量会保存在`src/const/reqParams/index.ts`文件内：

```ts
// 获取 医院等级 的参数
export const hospitalLevelDictCode = "Hostype";

// 当前城市 北京=110100
export const provinceCode = 110100;
```

### 路由常量

路由常量设定在此处，用于统一管理和维护，文件`src/const/router/index.ts`文件内：

```ts
// INDEX path 统一放在这里保存和管理
export const INDEX = {
  path: "/"
};

// HOME path 统一放在这里保存和管理
export const HOME = {
  path: "/home"
};

// HOSPITAL path 统一放在这里保存和管理
export const HOSPITAL = {
  // 首页路径
  path: "/hospital",
  // 菜单对应子路由路径
  CHILDREN: {
    // 预约挂号 子路由路径
    APPOINTMENT: {
      path: "appointment"
    },
    // 医院详情 子路由路径
    DETAL: {
      path: "detail"
    },
    // 预约须知 子路由路径
    NOTICE: {
      path: "notice"
    },
    // 停诊信息 子路由路径
    STOP_SERVICE: {
      path: "stopService"
    },
    // 查询与取消 子路由路径
    SEARCH_CANCEL: {
      path: "searchCancel"
    }
  }
};
```

### 存储常量

将本地化持久存储的常量字段存储到`src/const/localStorage/index.ts`文件中：

```ts
// 用户信息本地化存储
export const USERINFO_LOCALSTORAGE = "USERINFO";
```

### 颜色常量

#### 定义颜色

创建唯一颜色源 `src/assets/styles/color-sources/variables.less`，把全站颜色统一定义在 `:root` 上，语义化命名：

```css
/* src/assets/styles/color-sources/variables.less —— 全站唯一颜色源 Color Source */
/* ===== 品牌主色系（尚医通医疗蓝）===== */
@color-primary: #5566cc; /* 主品牌蓝 */
@color-primary-light: #5ba0eb; /* 主色浅 */
@color-primary-dark: #1f63ad; /* 主色深 */

/* ===== 语义状态色（与 Element Plus 对齐）===== */
@color-success: #67c23a;
@color-warning: #e6a23c;
@color-danger: #f56c6c;
@color-info: #909399;

/* ===== 文字色 ===== */
@color-text-primary: #303133; /* 主要文字 */
@color-text-regular: #606266; /* 常规文字 */
@color-text-secondary: #909399; /* 次要文字 */
@color-text-placeholder: #c0c4cc; /* 占位符 */

/* ===== 边框与分割线 ===== */
@color-border: #dcdfe6;
@color-border-light: #e4e7ed;

/* ===== 背景色 ===== */
@color-bg-page: #f0f2f5; /* 页面背景 */
@color-bg-container: #ffffff; /* 内容区背景 */
@color-bg-hover: #f5f7fa; /* 悬停背景 */

/* ===== 业务扩展色（尚医通医疗场景）===== */
@color-medical-emergency: #f56c6c; /* 急诊/危急 */
@color-medical-reserved: #2b85e4; /* 可预约 */
@color-medical-full: #909399; /* 已约满 */

```

#### 全局引入

在 `main.ts` 全局引入两个`css`文件供全员项目使用，如下为`main.ts`核心代码：

```ts
// src/main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/styles/color-sources/variables.css'

import App from './App.vue'
import router from './router'
import pinia from './stores'

createApp(App)
  .use(ElementPlus)
  .use(router)
  .use(pinia)
  .mount('#app')
```

#### 使用变量

##### 配置注入

本案例使用预处理器`Less`（若项目用 Less，变量也已全局注入），在 `vite.config.ts` 中配置全局注入后，所有 `<style lang="less">` 可直接使用 `@color-primary`，在`vite.config.ts`中：

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, isServing }) => {
  return {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/assets/styles/color-sources/variables.less";`
        }
      }
    }
  }
})
```

##### 组件应用

在实际项目中按照如下方式使用：

```vue
/* 组件内直接使用，无需再 import */
.appointment-banner {
  background: linear-gradient(135deg, @color-primary, @color-primary-dark);
  color: #fff;
}
```

## 标准框架

### 项目 框架

#### 页眉页尾

##### 创建页面

每个页面的顶部和下部采用通用组件`HospitalTop`和`HospitalBottom`，基于此分别创建组件`HospitalTop`和`HospitalBottom`，结构如下：

```文本
📦components
 ┣ 📂HospitalBottom
 ┃ ┗ 📜index.vue
 ┗ 📂HospitalTop
 ┃ ┗ 📜index.vue
```

##### 模板结构

```vue
<template>
  <div class="page-wrap">HospitalBottom</div>
</template>

<script setup lang="ts"> </script>

<style scoped lang="less"></style>
```

> `HospitalBottom` or `HospitalTop`

##### 全局注册

因为页眉页尾都需要使用这两个组件，所以需要在`main.ts`中全局注册使用，`main.ts`：

```ts
// Vue3 框架提供的方法 createApp 方法，可以用来创建应用实例方法
import { createApp } from "vue";
// 引入样式重置文件 reset.css
import "@/style/reset.less";
// 引入根组件App
import App from "./App.vue";
// 引入全局组件- HospitalTop 和 HospitalBottom，用于页面的顶部和底部
import HospitalTop from "@/components/HospitalTop/index.vue";
import HospitalBottom from "@/components/HospitalBottom/index.vue";
// 利用 createApp 方法创建应用实例
const app = createApp(App);
// 将 HospitalTop 和 HospitalBottom 注册为全局组件
app.component("HospitalTop", HospitalTop);
app.component("HospitalBottom", HospitalBottom);
// 将应用实例挂载到挂载点上
app.mount("#app");
```

##### 页眉初建

将页眉页面的布局确定，`src/components/HospitalTop/index.vue`简易结构搭建如下：

```vue
<template>
  <div class="page-top">
    <div class="content">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="logo" />
        <p>尚医通 - 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p>帮助中心</p>
        <p>注册/登录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-top {
  width: 100%;
  height: 70px;
  position: fixed;
  z-index: 9999;
  /* background-color: #fff; */
  display: flex;
  justify-content: center;
  .content {
    width: 1200px;
    height: 70px;
    /* background-color: red; */
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      img {
        width: 50px;
        height: 50px;
      }
      p {
        font-size: 1.5rem;
        color: #55a6fe;
        cursor: pointer;
      }
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      p {
        font-size: 1rem;
        color: #9e9e9e;
        cursor: pointer;
      }
    }
  }
}
</style>
```

##### 页脚初建

将页脚页面的布局确定，`src/components/HospitalBottom/index.vue`简易结构搭建如下：

```vue
<template>
  <div class="page-bottom">
    <div class="content">
      <div class="left">京ICP备 13018369号 电话挂号:010-56253825</div>
      <div class="right">
        <span>联系我们</span>
        <span>合作伙伴</span>
        <span>用户协议</span>
        <span>隐私协议</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-bottom {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  .content {
    width: 1200px;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #bfbcbf;
    .left {
      margin: 8px;
    }
    .right {
      span {
        margin: 8px;
      }
      :hover {
        cursor: pointer;
        color: orange;
      }
    }
  }
}
</style>
```

#### 主页搭建

将`src/app.vue`设计为如下结构：

```vue
<template>
  <div class="container">
    <!-- 顶部全局组件 -->
    <HospitalTop />
    <!-- 中间的内容区域 -->
    <div class="content">哈啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
    <!-- 底部区域 -->
    <div class="bottom">我是底部</div>

    <!-- 底部全局组件 -->
    <HospitalBottom />
  </div>
</template>

<script setup lang="ts"> </script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    width: 1200px;
    margin-top: 70px;
    min-height: 700px;
    background-color: red;
  }
  .bottom {
    width: 1200px;
    height: 70px;
    background-color: orchid;
  }
}
</style>
```

### Icon 图标

本项目的`Icon`图标 采用`element-plus`组件库内置图标库。

#### 安装依赖

通过一下命令安装`element-plus Icon `图标库：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm install @element-plus/icons-vue

up to date in 1s

28 packages are looking for funding
  run `npm fund` for details
```

#### 全局注册

在`main.ts`文件内，从 `@element-plus/icons-vue` 中导入所有图标并进行全局注册：

```ts
// 引入 element-plus Icon图标库
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 将 element-plus 内置Icon进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
```

> 在使用的组件中通过如下方式引入：`import { Search } from "@element-plus/icons-vue";`

### UI组件库

本项目的UI组件库采用`element-plus`组件库。

#### 安装依赖

通过以下命令安装 `element-plus`依赖：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm install element-plus

added 21 packages in 15s

28 packages are looking for funding
  run `npm fund` for details
```

#### 全局注册

在`main.ts`文件内引用并安装`element-plus`组件库：

```ts
// 引入 element-plus 组件库
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 使用 element-plus 插件，全局注册相关方法
app.use(ElementPlus);
```

## 微信扫码

### 后端开发

#### 依赖安装

```bash
npm install axios uuid
```

> 仅包含必要依赖，架构依赖不包含

#### 业务流程

```
┌──────────┐   ①请求二维码    ┌──────────┐   ②生成uuid会话+小程序码    ┌──────────┐
│  Web前端  │ ───────────────▶ │  后端服务  │ ──────────────────────────▶ │ 微信服务器 │
│ (浏览器)  │ ◀─────────────── │          │ ◀────────────────────────── │          │
└──────────┘  ③返回小程序码   └──────────┘      返回小程序码(scene=uuid) └──────────┘
      │                                                    ▲
      │ ④展示小程序码，开始轮询                               │ ⑥扫码打开
      ▼                                                    │
┌──────────┐   ⑤wx.login获取code    ┌──────────┐           │
│ 用户微信  │ ─────────────────────▶ │  小程序   │ ◀─────────┘
└──────────┘                        └──────────┘
                                        │ ⑦上报 code+uuid
                                        ▼
┌──────────┐   ⑧code换openid    ┌──────────┐
│ 后端服务  │ ──────────────────▶ │ 微信服务器 │  返回 openid
└──────────┘ ◀────────────────── └──────────┘
      │ ⑨把openid绑定到uuid会话(status=done)
      ▼
┌──────────┐   ⑩轮询到done    ┌──────────┐
│  Web前端  │ ◀─────────────── │ 后端服务  │  返回 token + 用户信息
└──────────┘  ⑪存token跳转     └──────────┘
```

> 1. Web 前端请求 `GET /api/qrcode` 获取登录二维码。
> 2. 后端生成唯一 `uuid` 登录会话（status=`pending`），调微信 `wxacode.getUnlimited` 生成**小程序码**（scene=uuid），返回 base64 图片。
> 3. Web 页面展示小程序码，开始轮询 `GET /api/scan/status?uuid=xxx`。
> 4. 用户用微信扫小程序码 → 打开小程序落地页，`scene` 参数带出 uuid。
> 5. 小程序执行 `wx.login()` 拿到临时 `code`。
> 6. 小程序把 `code + uuid` POST 给后端 `/api/wx/login`。
> 7. 后端调微信 `jscode2session` 接口，用 code 换取用户 `openid`。
> 8. 后端把 openid 绑定到该 uuid 会话，状态改为 `done`。
> 9. 后端建立/查找该用户，签发登录 token。
> 10. Web 轮询到 `status=done`，拿到 token 与用户信息。
> 11. Web 存 token 并跳转，登录完成。

#### 完整代码

##### 微信配置

在`server/config/wxConfig.js`创建如下内容：

```js
/** 微信小程序登录全局配置文件 */
module.exports = {
  WX_APPID: "wxfa5ada500340d816",
  WX_SECRET: "eda91d1b33fb14967cbd63799f5d272a",
  // 小程序扫码后打开的落地页路径（你后面在小程序里创建这个页面）
  QRCODE_PAGE: "pages/auth/login",
  // 二维码有效时长（秒）
  SESSION_TTL: 120,
};
```

##### 会话管理

在`server/wx/sessionStore.js`创建如下内容：

```js
/**
 * 扫码登录会话管理（内存版）
 * key: uuid
 * value: { status: pending|done|expired, openid, createdAt }
 */
const store = new Map();

/**
 * 创建扫码会话
 */
function createLoginSession(uuid) {
  const session = {
    status: "pending",
    openid: null,
    createdAt: Date.now(),
  };
  store.set(uuid, session);
  // 5分钟后自动清理
  setTimeout(() => {
    const s = store.get(uuid);
    if (s && s.status === "pending") {
      s.status = "expired";
    }
  }, 5 * 60 * 1000);
  return session;
}

/**
 * 获取会话
 */
function getLoginSession(uuid) {
  return store.get(uuid);
}

/**
 * 扫码成功，绑定 openid
 */
function bindOpenid(uuid, openid) {
  const session = store.get(uuid);
  if (session) {
    session.status = "done";
    session.openid = openid;
  }
  return session;
}

module.exports = { createLoginSession, getLoginSession, bindOpenid };
```

##### 接口封装

在`server/wx/wechat.js`创建如下内容：

```js
/**
 * 微信小程序接口封装
 */
const axios = require("axios");
const wxConfig = require("../config/wxConfig");

// access_token 缓存（2小时有效）
let cachedToken = { value: null, expire: 0 };

/**
 * 获取 access_token
 */
async function getAccessToken() {
  if (cachedToken.value && Date.now() < cachedToken.expire) {
    return cachedToken.value;
  }
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.WX_APPID}&secret=${wxConfig.WX_SECRET}`;
  const { data } = await axios.get(url);
  if (data.errcode) {
    throw new Error(`获取access_token失败: ${data.errcode} ${data.errmsg}`);
  }
  cachedToken.value = data.access_token;
  cachedToken.expire = Date.now() + (data.expires_in - 60) * 1000;
  return data.access_token;
}

/**
 * code 换 openid（小程序 wx.login 得到的 code）
 */
async function code2Session(code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.WX_APPID}&secret=${wxConfig.WX_SECRET}&js_code=${code}&grant_type=authorization_code`;
  const { data } = await axios.get(url);
  if (data.errcode) {
    throw new Error(`code2Session失败: ${data.errcode} ${data.errmsg}`);
  }
  return data; // { openid, session_key, unionid? }
}

/**
 * 生成不限制数量的小程序码（带 scene 参数）
 */
async function getWxACode(scene) {
  const token = await getAccessToken();
  const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`;
  const resp = await axios.post(
    url,
    {
      scene: scene, // 必填，≤32字符
      page: wxConfig.QRCODE_PAGE,
      width: 430,
      check_path: false,
      env_version: "release", // 开发阶段先写 "develop"
    },
    { responseType: "arraybuffer" }
  );
  // 出错时微信返回 JSON
  const ct = resp.headers["content-type"] || "";
  if (ct.includes("json")) {
    const err = JSON.parse(Buffer.from(resp.data).toString());
    throw new Error(`getWxACode失败: ${err.errcode} ${err.errmsg}`);
  }
  return Buffer.from(resp.data);
}

module.exports = { getAccessToken, code2Session, getWxACode };

```

> `env_version: "release", // 开发阶段先写 "develop"`
>
> 因为小程序还没正式发布，用 `release` 会报错。`develop` 表示开发版，可以在微信开发者工具中测试
>
> 目前微信用户使用的是 内存 Map 存微信用户 

##### 路由接口

存储方案选择`sqlite方式`，在`server/routes/wxLogin.js`创建如下内容：

```js
/**
 * 微信扫码登录路由
 * 前缀：/api/wx
 */
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const wechat = require("../wx/wechat");
const {
  createLoginSession,
  getLoginSession,
  bindOpenid,
} = require("../wx/sessionStore");
const { success, fail } = require("../utils/response");
const { generateToken } = require("../middlewares/auth");

// ========== 微信用户数据（SQLite存储） 开始 ==========
const db = require("../config/db-sqlite");
// ========== 微信用户数据（SQLite存储） 结束 ==========

/**
 * GET /api/wx/qrcode
 * Web端请求：获取扫码登录二维码
 */
router.get("/qrcode", async (req, res) => {
  try {
    // 去掉横杠，变成32位 否则会报错：40169
    const uuid = uuidv4().replace(/-/g, "");
    createLoginSession(uuid);
    const png = await wechat.getWxACode(uuid);
    return success(res, {
      uuid,
      qrDataUrl: `data:image/png;base64,${png.toString("base64")}`,
    });
  } catch (e) {
    return fail(res, "获取二维码失败: " + e.message);
  }
});

/**
 * POST /api/wx/login
 * 小程序端上报：wx.login 拿到的 code + 扫码带过来的 uuid
 * body: { code, uuid }
 */
router.post("/login", async (req, res) => {
  const { code, uuid, nickname } = req.body;
  if (!code || !uuid) {
    return fail(res, "参数缺失：code 和 uuid 不能为空");
  }

  const session = getLoginSession(uuid);
  if (!session) {
    return fail(res, "二维码已过期，请刷新页面");
  }

  try {
    // code 换 openid
    const { openid } = await wechat.code2Session(code);

    // 绑定 openid 到会话
    bindOpenid(uuid, openid);
    // ========== 查找或创建微信用户（SQLite存储） 开始 ==========
    let user = db.prepare("SELECT * FROM wx_user WHERE openid = ?").get(openid);;

    if (!user) {
      const result = db.prepare(
        "INSERT INTO wx_user (openid, nickname) VALUES (?, ?)"
      ).run(openid, nickname || "微信用户");
      user = {
        id: result.lastInsertRowid,
        openid,
        nickname: nickname || "微信用户",
      };
    } else if (nickname && !user.nickname) {
      db.prepare("UPDATE wx_user SET nickname = ? WHERE openid = ?").run(
        nickname,
        openid
      );
      user.nickname = nickname;
    }
    // ========== 查找或创建微信用户（SQLite存储） 结束 ==========

    return success(res, { userId: user.id }, "扫码确认成功");
  } catch (e) {
    return fail(res, "微信登录失败: " + e.message);
  }
});

/**
 * GET /api/wx/scan/status?uuid=xxx
 * Web端轮询：检查扫码状态
 */
router.get("/scan/status", async (req, res) => {
  const { uuid } = req.query;
  if (!uuid) {
    return fail(res, "uuid 不能为空");
  }

  const session = getLoginSession(uuid);
  if (!session || session.status === "expired") {
    return success(res, { status: "expired" });
  }

  if (session.status !== "done") {
    return success(res, { status: "pending" });
  }
  // ========== 扫码成功，返回用户信息（SQLite 存储） 开始 ==========
  const user = db
    .prepare("SELECT * FROM wx_user WHERE openid = ?")
    .get(session.openid);
  const token = generateToken(user.id);
  // ========== 扫码成功，返回用户信息（SQLite 存储） 结束 ==========

  return success(res, {
    status: "done",
    token,
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      openid: user.openid,
    },
  });

});

module.exports = router;
```

> 已包含`MySQL`、内存`Map`方案，已注释

##### 挂载路由

打开 `server/app.js`，在路由挂载部分加上这一行（放在其他路由旁边）：

```js
// 微信扫码登录模块
app.use("/api/wx", require("./routes/wxLogin"));
```

#### 测试接口

在浏览器或 Postman 中访问：

```bash
http://localhost:8201/api/wx/qrcode
```

> 成功后返回内容如下：
>
> ```json
> // 把 `qrDataUrl` 的值复制到浏览器地址栏（直接粘贴），应该能看到一张**小程序码图片**
> {
>   "code": 200,
>   "message": "成功",
>   "ok": true,
>   "data": {
>     "uuid": "xxxx-xxxx-xxxx",
>     "qrDataUrl": "data:image/png;base64,iVBORw0KGgo..."
>   }
> }
> ```

### 数据存储

#### SQLite存储

##### 安装依赖

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\server> npm install better-sqlite3

added 2 packages in 2s

34 packages are looking for funding
  run `npm fund` for details
```

##### 创建配置

新建 `server/config/db-sqlite.js`：

```js
const Database = require("better-sqlite3");
const path = require("path");

// 打开数据库文件（不存在会自动创建）
const db = new Database(path.join(__dirname, "../data/syt.db"));

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS wx_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openid TEXT UNIQUE NOT NULL,
    nickname TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("✅ SQLite 数据库连接成功");

module.exports = db;
```

##### 引入数据

打开 `server/app.js`，在顶部加一行：

```js
require("./config/db-sqlite");
```

> 剩下的都是挂载路由文件`routes/wzLogin.js`的变更

### 微信程序

#### 创建项目

1. 下载并安装微信开发者工具`https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html`
2. 打开微信开发者工具
3. 新建项目，AppID 填你注册的：`wxfa5ada500340d816`
4. 后端服务选择 `不使用云服务`，开发模式选择 `小程序` 初始化选择 `模板`
5. 模板选择选择 `不适用模板`

#### 落地页面

在项目中创建文件 `pages/auth/login.js`：

```json
// pages/auth/login.js
Page({
  data: {
    scene: "",
    status: "loading", // loading | needNickname | ok | err
    nickname: "",
    loginCode: "",
  },

  onLoad(options) {
    const scene = decodeURIComponent(options.scene || "");
    console.log("扫码带入的scene(uuid):", scene);
    this.setData({ scene });

    if (scene) {
      this.doLogin();
    } else {
      this.setData({ status: "err" });
    }
  },

  // 第一步：wx.login 拿 code
  doLogin() {
    wx.login({
      success: (loginRes) => {
        if (!loginRes.code) {
          this.setData({ status: "err" });
          return;
        }
        // 先存 code，等用户输入昵称后一起上报
        this.setData({
          loginCode: loginRes.code,
          status: "needNickname",
        });
      },
      fail: () => {
        this.setData({ status: "err" });
      },
    });
  },

  // 监听昵称输入
  onNicknameChange(e) {
    this.setData({ nickname: e.detail.value });
  },

  // 第二步：上报 code + uuid + nickname
  submitLogin() {
    if (!this.data.nickname) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }

    wx.request({
      url: "https://4d4ef6d6.r27.cpolar.top/api/wx/login",
      method: "POST",
      data: {
        code: this.data.loginCode,
        uuid: this.data.scene,
        nickname: this.data.nickname,
      },
      success: (res) => {
        if (res.data && res.data.ok) {
          this.setData({ status: "ok" });
        } else {
          wx.showToast({
            title: (res.data && res.data.message) || "登录失败",
            icon: "none",
          });
          this.setData({ status: "err" });
        }
      },
      fail: (err) => {
        wx.showModal({
          title: "请求失败",
          content: "errMsg: " + err.errMsg,
          showCancel: false,
        });
      },
    });
  },
});

```

> `https://4d4ef6d6.r27.cpolar.top/api/wx/login`实际为`cpolar`内网穿透的公网IP地址映射IP

#### 创建页面

在 `pages/auth/login.wxml`：

```xml
<view class="wrap">
  <!-- 加载中 -->
  <block wx:if="{{status === 'loading'}}">
    <text class="msg">正在确认微信身份…</text>
  </block>

  <!-- 输入昵称 -->
  <block wx:elif="{{status === 'needNickname'}}">
    <view class="info-box">
      <text class="title">欢迎使用尚医通</text>
      <input type="nickname" class="nickname-input" placeholder="请输入你的昵称" bind:change="onNicknameChange" />
      <button type="primary" bindtap="submitLogin">确认登录</button>
    </view>
  </block>

  <!-- 成功 -->
  <block wx:elif="{{status === 'ok'}}">
    <text class="ok">✓ 授权成功</text>
    <text class="sub">请返回电脑网页继续操作</text>
  </block>

  <!-- 失败 -->
  <block wx:else>
    <text class="err">登录失败或二维码已过期</text>
  </block>
</view>
```

#### 页面样式

在 `pages/auth/login.wxss`：

```wxss
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.msg { font-size: 32rpx; color: #666; }
.ok { font-size: 40rpx; color: #67c23a; font-weight: bold; }
.sub { font-size: 28rpx; color: #999; margin-top: 20rpx; }
.err { font-size: 32rpx; color: #f56c6c; }

```

#### 注册页面

打开 `app.json`，在 `pages` 数组中加上 `pages/auth/login`：

```json
{
  "pages": [
    "pages/auth/login",
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "扫码登录确认"
  }
}

```

#### 域名校验

关闭：微信开发者工具 → 项目设置 → 本地设置 → 勾选**「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」**

> 因为我们用的是 `http://localhost:8201`，不是 HTTPS，必须勾选这个才能调通

#### 上传程序

##### 上传代码

在微信开发者工具顶部工具栏，点击 **「工具-上传」** 按钮：

- 版本号：填 `1.0.0`
- 项目备注：随便填，比如 "首次上传"
- 点击确定

##### 确定成功

上传后，登录 [微信公众平台 mp.weixin.qq.com](https://mp.weixin.qq.com)：

- 管理 → 版本管理 → 开发版本
- 应该能看到你刚上传的 `1.0.0` 版本

### 内网穿透

#### 软件安装

`https://www.cpolar.com/download`安装`cpolar`，并通过邮箱进行注册登录账户。

#### 启动隧道

##### 启动命令

打开cpolar 默认安装目录，在 `cpolar.exe` 所在文件夹的地址栏输入 `cmd` 回车，打开命令行。

##### 配置Token

去 [cpolar 官网](https://dashboard.cpolar.com/auth) 复制 `authtoken`，并执行如下命令：

```bash
cpolar authtoken 你的authtoken
```

> 我的`token`为：`NDUyYjk1OGEtNTQwMS00OWQzLThlNjEtOTViYWIyOTU2MWNm`

##### 启动隧道

```bash
cpolar http 8201
```

> 启动成功后会显示类似这样的信息：`Forwarding   https://xxxx.cpolar.cn -> http://localhost:8201`
>
> 其中的`https://xxxx.cpolar.cn`就是内网穿透后的公网IP

#### 常规踩坑

##### 请求地址

把 `pages/auth/login.js` 里的请求地址改成 cpolar 给的公网地址：

```js
url: "https://4d4ef6d6.r27.cpolar.top/api/wx/login",
```

> cpolar 是 HTTPS 的，微信小程序直接能用，不需要勾选 "不校验合法域名"。

##### 服务域名

地址：`https://mp.weixin.qq.com/wxamp/home/guide?lang=zh_CN&token=915663012`

处理：管理/开发管理/服务器域名/`request`合法域名备案

## 前端路由

该项目使用`vue-router`的路由方案。

### 依赖安装

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm i vue-router

added 34 packages in 12s

24 packages are looking for funding
  run `npm fund` for details
```

### 创建路由

在`src/router`下创建`index.ts`文件，并创建2组路由：

```ts
import { createRouter, createWebHistory } from "vue-router";
// 导入路由常量管理文件
import { INDEX, HOME, HOSPITAL } from "@/const/index";

// createRouter方法，用于创建路由器实例，可以管理多个路由
export default createRouter({
  // 路由模式设置
  history: createWebHistory(),
  // 管理路由
  routes: [
    // Home页面路由
    {
      path: HOME.path,
      component: () => import("@/pages/home/index.vue")
    },
    // 医院详情 页面路由
    {
      path: HOSPITAL.path,
      component: () => import("@/pages/hospital/index.vue"),
      // 菜单对应子路由路径
      children: [
        // 预约挂号 子路由路径
        {
          path: HOSPITAL.CHILDREN.APPOINTMENT.path,
          component: () => import("@/pages/hospital/content/appointment/index.vue")
        },
        // 医院详情 子路由路径
        {
          path: HOSPITAL.CHILDREN.DETAL.path,
          component: () => import("@/pages/hospital/content/detail/index.vue")
        },
        // 预约须知 子路由路径
        {
          path: HOSPITAL.CHILDREN.NOTICE.path,
          component: () => import("@/pages/hospital/content/notice/index.vue")
        },
        // 停诊信息 子路由路径
        {
          path: HOSPITAL.CHILDREN.STOP_SERVICE.path,
          component: () => import("@/pages/hospital/content/stopService/index.vue")
        },
        // 查询与取消 子路由路径
        {
          path: HOSPITAL.CHILDREN.SEARCH_CANCEL.path,
          component: () => import("@/pages/hospital/content/searchCancel/index.vue")
        }
      ]
    },
    // 重定向 页面路由
    {
      path: INDEX.path,
      redirect: HOME.path
    }
  ],
  // 管理滚动行为 保证每次跳转，滚动条都回到最初的上面位置
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    };
  }
});
```

> 1. 为了保证每次都会跳会最上部，增加了滚动跳行为，确保每次都能回到最初的上面的位置

### 全局注册

在`naim.ts`文件中使用`router`插件，并全局注册相关方法

```ts
// Vue3 框架提供的方法 createApp 方法，可以用来创建应用实例方法
import { createApp } from "vue";
// 引入样式重置文件 reset.css
import "@/style/reset.less";
// 引入根组件App
import App from "./App.vue";
// 引入全局组件- HospitalTop 和 HospitalBottom，用于页面的顶部和底部
import HospitalTop from "@/components/HospitalTop/index.vue";
import HospitalBottom from "@/components/HospitalBottom/index.vue";
// 引入路由组件
import router from "./router/index.ts";
// 利用 createApp 方法创建应用实例
const app = createApp(App);
// 将 HospitalTop 和 HospitalBottom 注册为全局组件
app.component("HospitalTop", HospitalTop);
app.component("HospitalBottom", HospitalBottom);
// 使用 router 插件，全局注册相关方法
app.use(router);
// 将应用实例挂载到挂载点上
app.mount("#app");
```

### 首页使用

在`app.vue`文件中，在中间部位，使用使用路由显示页面：

```vue
<template>
  <div class="container">
    <!-- 顶部全局组件 -->
    <HospitalTop />
    <!-- 中间的内容区域 -->
    <div class="content">
      <!-- 以下为通过 router 跳转部分 -->
      <router-view></router-view>
    </div>
    <!-- 底部区域 -->
    <div class="bottom">我是底部</div>

    <!-- 底部全局组件 -->
    <HospitalBottom />
  </div>
</template>
```

> 只显示了结构部分的代码，其他部分不再展示

## 静态组件

### 主页组件

#### 轮播组件

在`src/pages/home/carousel`下创建`index.vue`组件：

```vue
<template>
  <div class="page-carousel">
    <el-carousel>
      <el-carousel-item v-for="item in 4" :key="item">
        <img src="../../../assets/images/web-banner-1.png" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts"> </style>

```

> 图标和UI库已安装

#### 搜索组件

在`src/pages/home/search`下创建`index.vue`组件：

```vue
<template>
  <div class="page-search">
    <div class="search-bar">
      <el-autocomplete clearable class="search-form" placeholder="请输入医院名称" size="large" />
      <el-button type="primary" :icon="Search" size="large">搜索</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
</script>

<style scoped lang="less">
.page-search {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .search-bar {
    width: 600px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
</style>
```

#### 集成01段

集成阶段，以上单模块集成到主程序中，即在`src/pages/home`下引用`carousel`组件和`search`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 轮播图 组件 -->
    <Carousel />
    <!-- 搜索框+搜索按钮 组件 -->
    <Search />
  </div>
</template>

<script setup lang="ts">
// 导入轮播图组件
import Carousel from "@/pages/home/carousel/index.vue";
// 导入搜索框+按钮组件
import Search from "@/pages/home/search/index.vue";
</script>
<style scoped lang="less"></style>
```

#### 等级组件

在`src/pages/home/level`下创建`index.vue`组件：

```vue
<template>
  <div class="page-home-level">
    <h1 class="hospital">医院</h1>
    <div class="level">
      <h1>等级：</h1>
      <ul class="level-list">
        <li class="active">全部</li>
        <li>三级甲等</li>
        <li>三级乙等</li>
        <li>二级甲等</li>
        <li>二级乙等</li>
        <li>一级</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts"> </script>

<style scoped lang="less">
.page-home-level {
  color: #a9a9a9;
  font-weight: 900;
  .hospital {
    margin: 10px 0;
  }
  .level {
    display: flex;
    margin-top: 15px;
    h1 {
      width: 60px;
    }
    .level-list {
      display: flex;
      li {
        margin-right: 15px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
```

#### 地区组件

在`src/pages/home/region`下创建`index.vue`组件：

```vue
<template>
  <div class="page-home-region">
    <div class="region">
      <h1>地区：</h1>
      <ul class="region-list">
        <li class="active">全部</li>
        <li>东城区</li>
        <li>西城区</li>
        <li>朝阳区</li>
        <li>丰台区</li>
        <li>石景山区</li>
        <li>海淀区</li>
        <li>门头沟区</li>
        <li>房山区</li>
        <li>通州区</li>
        <li>顺义区</li>
        <li>昌平区</li>
        <li>大兴区</li>
        <li>怀柔区</li>
        <li>平台区</li>
        <li>密云区</li>
        <li>延庆区</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts"> </script>

<style scoped lang="less">
.page-home-region {
  color: #a9a9a9;
  font-weight: 900;
  .region {
    display: flex;
    margin-top: 15px;
    h1 {
      margin-top: 10px;
      width: 69px;
    }
    .region-list {
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 15px;
        margin-top: 10px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
```

#### 卡片组件

在`src/pages/home/card`下创建`index.vue`组件：

```vue
<template>
  <div class="page-home-card">
    <!-- 医院卡片 -->
    <el-card shadow="hover">
      <div class="content">
        <div class="left">
          <div class="top">北京航空航天医院</div>
          <div class="bottom">
            <div class="left">
              <svg
                t="1789638754169"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1922"
                width="16"
                height="16"
              >
                <path
                  d="M986.776992 567.822977c14.823998-20.164492 26.251363-53.121973 26.251363-80.628234l-0.005126-0.396769c-0.793539-33.226095-16.845778-63.097593-45.19684-84.109961-27.883551-20.66276-65.458729-31.586731-108.666597-31.586731l-193.845887 0.035884c13.63369-47.042278 19.597532-100.589727 16.884737-153.311855-3.187482-61.967775-18.131433-117.13921-42.078049-155.35209-14.143236-22.563562-31.094614-39.332446-50.386623-49.84632-15.361225-8.370089-31.741542-12.615623-48.684719-12.615623-40.095228 0-69.546376 17.842315-85.168013 51.599486-12.649456 27.335045-12.649456 58.461442-12.649456 68.689272 0 87.236954-12.45671 124.689104-26.40925 158.056683-5.289232 9.781849-25.35735 33.24455-52.993818 54.16157-42.611175 32.246988-75.971578 39.017696-96.453895 39.017696l-144.089789 0c-28.828825 0-54.736732 10.680988-74.920703 30.886489-24.298274 24.323905-37.658223 60.185901-37.616188 100.983421l0.001025 0.760731 37.470604 403.396456c5.418413 73.995933 44.717026 114.76372 110.666847 114.797553 1.653718 0.015379 30.607623 0.277841 52.215658 0.277841 9.071356 0 21.437844-0.050237 28.841128-0.286043 23.031073-0.741251 40.783166-14.195523 55.04738-25.005692l3.624236-2.746628c3.47045-2.634876 7.958966-6.041761 10.787613-7.636014 2.294495 1.091884 5.393807 2.642053 8.07892 3.985122 7.318189 3.659094 17.340971 8.671511 28.261866 13.410187 26.117056 11.345346 63.949571 18.675838 96.383153 18.675838l301.476988 0c52.890268 0 94.037395-10.262689 122.299261-30.502023 28.652483-20.521276 43.815837-51.370857 43.850695-89.232079 0-13.623437-1.938736-24.567913-6.667159-35.454975 43.295013-16.846803 68.504728-49.618716 68.504728-90.56592 0-12.039436-3.257199-29.931988-10.07712-44.407402 8.743278-5.93206 17.574726-13.918707 25.344022-23.122319 17.040574-20.195249 26.414377-43.389335 26.394897-65.296741C1013.252884 612.426201 1004.16615 586.322473 986.776992 567.822977zM898.799812 682.726131l-22.270342 0 0.867356 65.362357 10.402122 4.070217 0.652055 0.250159c2.81942 1.074455 9.421989 3.590403 9.443519 23.428867-0.003076 3.403809-0.013328 13.764921-17.867946 22.567663-12.408524 6.119679-29.918659 9.630113-48.03984 9.630113l0 16.596644-16.480791-0.300396-0.890937 49.09174 13.114916 3.020368c2.600018 0.597717 8.008178 1.844413 7.987673 22.898816 0 14.763508-5.644991 25.403486-17.764396 33.482406-15.499633 10.33343-41.546972 15.794903-75.326699 15.794903l-312.100562 0c-11.539117 0-39.494435-7.971269-55.394938-15.796954-12.397246-6.097124-30.751157-16.439781-42.716775-23.214591L332.414226 434.134285c79.007324-27.16588 141.153491-95.435828 157.733731-127.879662l0.515698-1.108288c17.754144-42.137513 28.033236-86.674096 28.033236-189.634186 0-23.078234 4.3132-31.47908 6.883486-34.434857 1.481477-1.70293 3.771871-3.519661 12.246535-3.519661 8.443906 0 29.934038 13.505534 41.185061 31.451399 17.690579 28.219831 28.858557 74.782295 29.875599 124.554797 1.131869 55.389812-9.924358 110.039398-31.130497 153.878815l-0.776109 1.603481-13.6788 56.714427 297.271438-0.08612c50.690095 2.967055 78.121513 23.267904 78.325537 41.003593l-0.334229 11.623187c-0.401895 8.203999-3.941036 25.086686-11.083909 31.145876-7.190034 6.095073-12.738652 7.413537-14.117605 7.659595l-15.564223-0.656156-0.431628 53.90731-0.08407 14.5195 14.371865 2.050487c5.081107 0.725872 13.84489 2.935272 17.052877 5.179531 7.080332 4.975507 11.026495 15.99175 10.556934 29.444997-0.191721 5.263601-5.72291 15.899478-15.925109 26.043238C912.253059 678.62003 902.404569 682.726131 898.799812 682.726131zM258.021524 445.685705l0 486.712879c-3.860042 2.816344-7.481203 5.49223-10.454409 7.730337-5.671648 4.275266-10.423652 7.30281-12.769409 8.567961-5.534265 0.12508-14.388269 0.18762-26.391821 0.18762-19.246898 0-41.302964-0.160963-52.736481-0.256311l-0.996537-0.008202c-14.407749 0-28.619676-16.649956-32.557636-38.020134l-37.277858-417.166503c0.341406-25.792054 19.877423-46.025237 37.907358-48.16492L258.021524 445.685705z"
                  p-id="1923"
                  fill="#a9a9a9"
                ></path>
              </svg>
              <span>三甲乙等</span>
            </div>
            <div class="right">
              <svg
                t="1789638734903"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1734"
                id="mx_n_1789638734904"
                width="16"
                height="16"
              >
                <path
                  d="M506.592 951.68c-242.624 0-440-197.408-440-440 0-242.656 197.376-440 440-440s440 197.344 440 440c0 242.592-197.376 440-440 440m0-944C228.672 7.68 2.592 233.696 2.592 511.68c0 277.888 226.08 504 504 504 277.92 0 504-226.112 504-504 0-277.952-226.08-504-504-504"
                  fill="#a9a9a9"
                  p-id="1735"
                ></path>
                <path
                  d="M534.144 489.664V201.216c0.032-0.32 0.224-0.576 0.224-0.896a32.224 32.224 0 0 0-64.448-2.56c0 0.512 0.224 0.896 0.224 1.376v316c-0.544 2.56-1.376 5.056-1.248 7.776 0.64 16.288 13.376 28.736 29.152 30.272 0.992 0.128 1.824 0.64 2.88 0.704 0.224 0 0.416-0.128 0.672-0.128 0.256 0 0.448 0.128 0.704 0.128 0.32-0.032 0.576-0.224 0.896-0.224H823.68c0.48 0 0.864 0.224 1.344 0.224a32.256 32.256 0 0 0-2.528-64.448c-0.32 0-0.608 0.192-0.928 0.224h-287.36z"
                  fill="#a9a9a9"
                  p-id="1736"
                ></path>
              </svg>
              <span>每天08:00放号</span>
            </div>
          </div>
        </div>
        <div class="right">
          <img :src="hospitalItem.logoData" alt="医院logo" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-home-card {
  margin-top: 15px;
  .el-card {
    min-width: 450px;
    cursor: pointer;
  }
  .content {
    color: #a9a9a9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      .top {
        font-size: 1.2rem;
        font-weight: 900;
        margin: 15px 0;
      }
      .bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 15px 0;
        .left {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 100px;
          svg {
            margin-right: 5px;
          }
        }
        .right {
          display: flex;
          flex-direction: row;
          align-items: center;
          svg {
            margin-right: 5px;
          }
        }
      }
    }
    .right {
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>

```

#### 分页组件

在`src/pages/home/pagination`下创建`index.vue`组件：

```vue
<template>
  <div class="page-home-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper,->,total"
      :total="total"
      :hide-on-single-page="singlepage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";
import type { ComponentSize } from "element-plus";
const currentPage = ref(1);
const pageSize = ref(10);
const size = ref<ComponentSize>("large");
const background = ref(true);
const total = ref(200);
const singlepage = ref(true);
const disabled = ref(false);
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style scoped lang="less">
.page-home-pagination {
  .el-pagination {
    margin-bottom: 15px;
  }
}
</style>
```

#### 集成02段

集成阶段，以上单模块集成到主程序中，即在`src/pages/home`下引用`level`组件、`region`组件、`card`组件和`pagination`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 轮播图 组件 -->
    <Carousel />
    <!-- 搜索框+搜索按钮 组件 -->
    <Search />
    <!-- 医院等级 + 医院地区 + 医院卡片 + 分页器 组件 -->
    <el-row>
      <el-col :span="20">
        <!-- 医院等级 组件 -->
        <Level />
        <!-- 医院地区 组件 -->
        <Regin />
        <!-- 医院卡片 组件 -->
        <Card />
        <!-- 分页器 组件 -->
        <Pagination />
      </el-col>
      <el-col :span="4"> 第2列 </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入轮播图组件
import Carousel from "@/pages/home/carousel/index.vue";
// 导入搜索框+按钮组件
import Search from "@/pages/home/search/index.vue";
// 导入等级组件
import Level from "@/pages/home/level/index.vue";
// 导入地区组件
import Regin from "@/pages/home/region/index.vue";
// 导入医院卡片组件
import Card from "@/pages/home/card/index.vue";
// 导入分页器组件
import Pagination from "@/pages/home/pagination/index.vue";
</script>
<style scoped lang="less"></style>
```

#### 链接组件

此处的连接组件是指右侧的快速链接区域，目前实现的是静态结构和样式，在`src/pages/home/quickLink/index.vue`:

```vue
<template>
  <div class="right-adv">
    <div class="common-department">
      <div class="top">
        <div class="left">
          <el-icon><HomeFilled /></el-icon>
          <span>常见科室</span>
        </div>
        <div class="right">
          <span>全部</span>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>神经内容</li>
          <li>消化内科</li>
          <li>呼吸内科</li>
          <li>内科</li>
          <li>神经外科</li>
          <li>妇科</li>
          <li>产科</li>
          <li>儿科</li>
        </ul>
      </div>
    </div>
    <div class="web-notice">
      <div class="top">
        <div class="left">
          <el-icon><HelpFilled /></el-icon>
          <span>平台公告</span>
        </div>
        <div class="right">
          <span>全部</span>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>关于延长北京大学国际医院相关医疗知识储备的年限通知</li>
          <li>北京中医药大学东方医院部关于下发继续教育学习指标的通知</li>
          <li>武警总医院号源展厅更新通知的相关截止时间的通知</li>
        </ul>
      </div>
    </div>
    <div class="close-services-notice">
      <div class="top">
        <div class="left">
          <el-icon><Clock /></el-icon>
          <span>停诊公告</span>
        </div>
        <div class="right">
          <span>全部</span>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
      <div class="bottom">
        <ul>
          <li>中国人民解放军总医院第六住院部暂时关闭的原因及处理办法通知</li>
          <li>首都医科大学附属北京潞河池塘莲花区分院的主任工程师招聘事宜的通知</li>
          <li>中日友好医院中西医结合心理咨询及日方侵华罪名界定与赔款道歉的通知</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "QuickLink" });
</script>

<style scoped lang="less">
.right-adv {
  margin-left: 10px;
  color: #a1a1a1;
  .common-department {
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
      .right:hover,
      .left:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .bottom {
      ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        li:hover {
          color: orange;
          cursor: pointer;
        }
      }
    }
  }
  .web-notice {
    margin-top: 25px;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
      .right:hover,
      .left:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .bottom {
      ul {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        li {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li:hover {
          color: orange;
          cursor: pointer;
        }
      }
    }
  }
  .close-services-notice {
    margin-top: 25px;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .left {
        display: flex;
        span {
          margin-left: 5px;
        }
      }
      .right {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
      .right:hover,
      .left:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .bottom {
      ul {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        li {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        li:hover {
          color: orange;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
```

#### 集成03段

集成阶段，以上单模块集成到主程序中，即在`src/pages/home`下引用`quickLink`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 轮播图 组件 -->
    <Carousel />
    <!-- 搜索框+搜索按钮 组件 -->
    <Search />
    <!-- 医院等级 + 医院地区 + 医院卡片 + 分页器 组件 + 左侧和右侧 -->
    <el-row>
      <!-- 左侧部分内容 -->
      <el-col :span="20">
        <!-- 医院等级 组件 -->
        <Level @change-level="handleChangeLevel" />
        <!-- 医院地区 组件 -->
        <Regin @change-region="handleChangeRegion" />
        <!-- 医院卡片 组件 -->
        <div class="hospital-card">
          <Card class="card-item" v-for="item in hasHospitalArr" :key="item.id" :hospital-item="item" />
        </div>
        <!-- 分页器 组件 -->
        <Pagination
          :page-no="pageNo"
          :page-size="pageSize"
          :page-total="pageTotalData"
          @change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </el-col>
      <!-- 右侧部分内容 -->
      <el-col :span="4">
        <QuickLink />
      </el-col>
    </el-row>
  </div>
</template>
......
```

### 医院组件

#### 菜单组件

在`src/pages/hospital/menu`下创建`index.vue`组件：

```vue
<template>
  <div class="page-wrap">
    <el-menu :default-active="route.path" @select="handleSelect">
      <div class="menu-topTitle">
        <el-icon color="#58317B"><HomeFilled /></el-icon>
        <el-icon size="0.9rem"><DArrowRight /></el-icon>
        <span>医院信息</span>
      </div>
      <!-- 索引使用完整的路由路径，这样最方便，不用拼串，也可以直接跳转 -->
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.APPOINTMENT.path">
        <el-icon><Service /></el-icon>
        <span>预约挂号</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.paht + '/' + HOSPITAL.CHILDREN.DETAL.path">
        <el-icon><Finished /></el-icon>
        <span>医院详情</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.NOTICE.path">
        <el-icon><Bell /></el-icon>
        <span>预约须知</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.STOP_SERVICE.path">
        <el-icon><Timer /></el-icon>
        <span>停诊信息</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.SEARCH_CANCEL.path">
        <el-icon><Switch /></el-icon>
        <span>查询取消</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Menu" });
// 引入路由 path 常量
import { HOSPITAL } from "@/const/router/index";
// 导入路由组件
import { useRouter, useRoute } from "vue-router";
// 操作路由
const router = useRouter();
// 读取路由
const route = useRoute();

// 点击菜单触发函数
const handleSelect = (key: string) => {
  // console.log(key, keyPath);
  // 使用 router 进行跳转
  router.push({
    path: key,
    query:{hoscode:route.query.hoscode}
  });
};
</script>

<style scoped lang="less">
.page-wrap {
  .menu-topTitle {
  }
  .el-menu {
    min-width: 150px;
    .el-menu-item {
      margin-bottom: 10px;
    }
  }
}
</style>
```

#### 内容组件

在`src/pages/hospital/content`下创建多个内容子组件，分别为：

```text
src/pages/hospital/content/appointment/index.vue --- 挂号预约 组件
```

```text
src/pages/hospital/content/detail/index.vue --- 医院详情 组件
```

```text
src/pages/hospital/content/notice/index.vue --- 预约须知 组件
```

```text
src/pages/hospital/content/searchCancel/index.vue --- 查询/取消 组件
```

```text
src/pages/hospital/content/stopService/index.vue --- 停诊信息 组件
```

##### 科室预约

在`src/pages/hospital/content/appointment`下创建`index.vue`组件：

```vue
<template>
  <div class="page-wrap">预约挂号</div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Appointment" });
</script>
```

> 未进行内容创建，待后续补充

##### 医院详情

在`src/pages/hospital/content/detail`下创建`index.vue`组件：

```vue
<template>
  <div class="page-wrap">医院详情</div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Detail" });
</script>
```

> 未进行内容创建，待后续补充

##### 预约须知

在`src/pages/hospital/content/notice`下创建`index.vue`组件：

```vue
<template>
  <div class="page-wrap">预约须知</div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Notice" });
</script>
```

> 未进行内容创建，待后续补充

##### 停诊信息

在`src/pages/hospital/content/stopService`下创建`index.vue`组件：

```vue
<template>
  <div class="page-wrap">停诊信息</div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "StopService" });
</script>
```

> 未进行内容创建，待后续补充

##### 查询取消

在`src/pages/hospital/content/searchCancel`下创建`index.vue`组件：

```vue
<template>
  <div class="page-wrap">查询与取消</div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "SearchCancel" });
</script>
```

> 未进行内容创建，待后续补充

##### 集成01段

集成阶段，以上单模块集成到主程序中，即在`src/pages/hospital`下引用`router-view`并集成`Pinia`状态管理实现方法：

```vue
<template>
  <div class="page-wrap">
    <!-- 左侧为菜单栏 -->
    <div class="left-menu">
      <Menu />
    </div>
    <!-- 右侧为内容展示区 -->
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
// 定义组件名称
defineOptions({ name: "Hospital" });
// 引入 菜单 子组件
import Menu from "./menu/index.vue";
// 引入路由和路由器
import { useRoute } from "vue-router";
const route = useRoute();
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onMounted } from "vue";
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index.ts";
const useStore = useHospitalDetailStore();
// 生命周期
onMounted(() => {
  // 获取当前网址中的 query 中的  hoscode 参数
  const hoscode = route.query.hoscode as string;
  // 页面挂载后即可获取 Store 数据
  useStore.getHospitalDetailInfo(hoscode);
});
</script>

<style scoped lang="less">
.page-wrap {
  display: grid;
  grid-template-columns: 1.5fr 8.5fr;
  .left-menu {
  }
  .right-content {
    background-color: orange;
  }
}
</style>
```

##### 科室预约

完善`src/pages/hospital/content/appointment/index.vue`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 医院预约前，对医院的详细介绍 -->
    <div class="description">
      <!-- 医院名称及等级 -->
      <div class="top">
        <div class="left">{{ useStore.hospitalDetailInfo?.hosname }}</div>
        <div class="right">
          <el-icon color="orange"><Opportunity /></el-icon>
          <span>{{ useStore.hospitalDetailInfo?.hostypeString }}</span>
        </div>
      </div>
      <!-- 医院 Logo + 相关详细路线指南和预约规则 -->
      <div class="bottom">
        <div class="left">
          <img :src="useStore.hospitalDetailInfo?.logoData" alt="医院图标" />
        </div>
        <div class="right">
          <span class="title">挂号规则</span>
          <span class="content"
            >预约周期：{{ useStore.hospitalDetailInfo?.bookingRule.cycle }}天 放号时间：{{
              useStore.hospitalDetailInfo?.bookingRule.releaseTime
            }}
            停挂时间：{{ useStore.hospitalDetailInfo?.bookingRule.stopTime }}</span
          >
          <span class="content">具体地址：{{ useStore.hospitalDetailInfo?.address }}</span>
          <span class="content">规划路线：{{ useStore.hospitalDetailInfo?.route }}</span>
          <span class="content"
            >退号时间：就诊前一工作日{{ useStore.hospitalDetailInfo?.bookingRule.quitTime }}前取消</span
          >
          <span class="title">预约规则</span>
          <ul>
            <li v-for="(value, index) in useStore.hospitalDetailInfo?.bookingRule.rule" :key="index">{{ value }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="appointment">预约医院</div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Appointment" });

//引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  .description {
    color: #717171;
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      flex-direction: row;
      align-items: center;
      .left {
        color: #333;
        font-weight: 800;
        font-size: 1.35rem;
        margin-right: 5px;
      }
      .right {
        display: flex;
        align-items: center;
        span {
          margin-left: 5px;
        }
      }
    }
    .bottom {
      margin-top: 25px;
      display: grid;
      grid-template-columns: 10% 90%;
      .left {
        img {
          width: 80px;
          height: 80px;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        gap: 10px;
        .title {
          color: #333;
          font-weight: 800;
        }
        .content {
          line-height: 1.5rem;
          margin-left: 10px;
        }
        ul {
          li {
            margin-top: 10px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
```

##### 医院详情

完善`src/pages/hospital/content/detail/index.vue`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 医院名称及等级 -->
    <div class="top">
      <div class="left">{{ useStore.hospitalDetailInfo?.hosname }}</div>
      <div class="right">
        <el-icon color="orange"><Opportunity /></el-icon>
        <span>{{ useStore.hospitalDetailInfo?.hostypeString }}</span>
      </div>
    </div>
    <!-- 医院 Logo + 相关详细路线指南 -->
    <div class="middle">
      <div class="left">
        <img :src="useStore.hospitalDetailInfo?.logoData" alt="医院图标" />
      </div>
      <div class="right">
        <span class="content">具体地址：{{ useStore.hospitalDetailInfo?.address }}</span>
        <span class="content">规划路线：{{ useStore.hospitalDetailInfo?.route }}</span>
      </div>
    </div>
    <!-- 医院介绍 -->
    <div class="bottom">
      <span class="title">医院介绍</span>
      <span class="content">{{ useStore.hospitalDetailInfo?.intro }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Detail" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: #717171;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      color: #333;
      font-weight: 800;
      font-size: 1.35rem;
      margin-right: 5px;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
  .middle {
    margin-top: 25px;
    display: grid;
    grid-template-columns: 10% 90%;
    .left {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .title {
        color: #333;
        font-weight: 800;
      }
      .content {
        line-height: 1.5rem;
        margin-left: 10px;
      }
      ul {
        li {
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
  .bottom {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .title {
      color: #333;
      font-weight: 800;
    }
    .content {
      line-height: 1.5rem;
      margin-left: 10px;
    }
  }
}
</style>

```

##### 预约须知

完善`src/pages/hospital/content/notice/index.vue`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 预约须知的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}预约挂号须知</div>
    </div>
    <div class="content">
      <div class="tips-tip">为方便您早日就医康复，请您认真阅读预约挂号须知:</div>
      <div class="tips-title">一、预约实名制:</div>
      <div class="tips-content">
        统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证、护照）、性别、手机号码、社保卡号等基本信息。
      </div>
      <div class="tips-title">二、预约挂号:</div>
      <div class="tips-content">
        <div class="tips">按照北京市卫健委统一平台要求，预约挂号规则如下:</div>
        <div class="tips">在同一自然日，同一医院，同一科室，同一就诊单元，同一就诊人，可以预约最多1个号源;</div>
        <div class="tips">
          在同一自然周，同一就诊人，可以预约最多8个号源; 在同一自然月，同一就诊人，可以预约最多12个号源;
        </div>
        <div class="tips">在同一自然季度，同一就诊人，可以预约最多24个号源。</div>
      </div>
      <div class="tips-title">三、取消预约:</div>
      <div class="tips-content">
        已完成预约的号源，如需办理退号，至少在就诊前一工作日14:00前通过网站、微信公众号、114电话等平台预约渠道进行取消预约。
      </div>
      <div class="tips-title">四、爽约处理:</div>
      <div class="tips-content">
        <div class="tips">如预约成功后患者未能按时就诊且不办理取消预约号视为爽约，同一患者在自然年内爽约规则如下:</div>
        <div class="tips">累计爽约3次，自3次爽约日起，90天内不允许通过114平台进行预约挂号;</div>
        <div class="tips">累计爽约6次，自6次爽约日起，180天内不允许通过114平台进行预约挂号。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Notice" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: #717171;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .tips-title {
      font-weight: 800;
    }
    .tips-content {
      line-height: 1.8rem;
    }
  }
}
</style>
```

##### 停诊信息

完善`src/pages/hospital/content/stopService/index.vue`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 停诊信息的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}停诊信息</div>
    </div>
    <!-- 停诊信息的内容 -->
    <div class="content">
      <el-empty description="暂无信息" />
    </div>
  </div>
</template>
<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "StopService" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: #717171;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
}
</style>
```

##### 查询取消

完善`src/pages/hospital/content/searchCancel/index.vue`组件：

```vue
<template>
  <div class="page-wrap">
    <!-- 查询取消的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}查询取消信息</div>
    </div>
    <!-- 查询取消的内容 -->
    <div class="content">
      <el-empty description="暂无信息" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "SearchCancel" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: #717171;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
}
</style>

```

##### 集成02段

将以上片段集成到主页面，再次不再赘述，上述内容已全部覆盖。

#### 业务实现

##### 医生预约

在用户点击了科室预约内的具体科室和专科后，会跳转到具体科室内医生的排版情况，并展示，`src/pages/hospital/content`下的`/appointment/doctorDetail/vue`静态页面实现如下：

```vue
<template>
  <div class="page-wrap">
    <div class="top-content">
      <div class="hspInfo">
        <p class="hspName">北京人民医院</p>
        <svg
          t="1790926337417"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5986"
          width="16"
          height="16"
        >
          <path
            d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
            p-id="5987"
            fill="#515151"
          ></path>
        </svg>
        <p class="dptName">专科</p>
        <svg
          t="1790926255554"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4876"
          width="16"
          height="16"
        >
          <path
            d="M516.266667 430.933333c-46.634667 0-85.333333 38.698667-85.333334 85.333334 0 46.592 38.698667 85.333333 85.333334 85.333333 46.592 0 85.333333-38.741333 85.333333-85.333333 0-46.634667-38.741333-85.333333-85.333333-85.333334z"
            p-id="4877"
            fill="#515151"
          ></path>
        </svg>
        <p class="spcName">多发性硬化专科门诊</p>
      </div>
    </div>
    <div class="middle-content">
      <div class="currentDate">2026年10月</div>
      <div class="card-wrap">
        <div class="dataCard" v-for="(items, index) in 5" :key="index">
          <div class="itemData">2026-10-07 周六</div>
          <div class="itemNote">停止挂号</div>
        </div>
      </div>
      <div class="pagination-block">
        <el-pagination layout="prev, pager, next" :total="50" />
      </div>
    </div>
    <div class="bottom-content">
      <div class="morning-tickets">
        <div class="time-tickets">
          <svg
            t="1790928595007"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9613"
            width="20"
            height="20"
          >
            <path
              d="M512 423.253333c17.749333 0 32.085333-15.701333 32.085333-34.816V240.981333l-4.096-59.392 29.354667 33.450667 49.834667 49.834667c6.144 5.461333 13.653333 8.874667 21.845333 8.874666 15.701333 0 27.306667-10.922667 27.306667-26.624 0-8.192-2.730667-14.336-9.557334-21.162666L533.845333 112.64c-8.192-7.509333-14.336-10.24-21.845333-10.24-7.509333 0-12.970667 2.730667-21.845333 10.24L365.909333 226.645333c-6.826667 6.144-9.557333 12.288-9.557333 20.48 0 15.701333 10.922667 26.624 27.306667 26.624 7.509333 0 15.701333-3.413333 21.162666-8.874666l53.930667-53.248 25.258667-29.354667-4.778667 58.709333v146.773334c0 19.797333 15.701333 35.498667 32.768 35.498666z m206.165333 107.178667c12.970667 12.288 34.133333 12.288 48.469334-2.048l69.632-68.266667c15.018667-14.336 14.336-34.816 1.365333-47.104a33.655467 33.655467 0 0 0-47.786667 1.365334l-69.632 68.266666c-14.336 15.018667-14.336 36.181333-2.048 47.786667z m-412.330666 0c12.288-12.288 12.288-32.768-2.730667-47.786667l-69.632-68.266666c-15.018667-14.336-35.498667-13.653333-47.786667-1.365334-12.288 12.288-12.288 32.768 2.730667 47.104l69.632 68.266667c14.336 14.336 35.498667 15.018667 47.786667 2.048zM34.816 921.6h954.368c19.114667 0 34.816-14.336 34.816-32.085333 0-17.066667-15.701333-31.402667-34.816-31.402667h-300.373333c27.306667-36.181333 41.642667-79.872 41.642666-124.928 0-118.101333-99.669333-215.722667-218.453333-215.722667-119.466667 0-218.453333 97.621333-218.453333 215.722667 0 47.104 15.018667 89.429333 41.642666 124.928H34.816c-19.114667 0-34.816 14.336-34.816 31.402667 0 17.749333 15.701333 32.085333 34.816 32.085333z m322.901333-187.733333c0-83.285333 69.632-151.552 154.282667-151.552s154.282667 68.266667 154.282667 151.552c0 50.517333-25.941333 96.938667-68.266667 124.928H425.984c-42.325333-28.672-68.266667-75.093333-68.266667-124.928z m-271.018666 21.845333h98.304c20.48 0 36.181333-14.336 36.181333-32.085333-0.682667-17.749333-15.018667-32.085333-36.181333-32.085334H86.698667c-20.48 0-35.498667 14.336-35.498667 32.085334s15.018667 32.085333 35.498667 32.085333z m752.981333 0h98.304c20.48 0 35.498667-14.336 35.498667-32.085333s-15.018667-32.085333-35.498667-32.085334H839.68c-20.48 0-36.181333 14.336-36.181333 32.085334 0.682667 17.749333 15.018667 32.085333 36.181333 32.085333z"
              fill="#FF7F50"
              p-id="9614"
            ></path>
          </svg>
          <p>上午号源</p>
        </div>
        <div class="tickets-doctors">
          <div class="tickets-info" v-for="(items, index) in 2" :key="index">
            <div class="content">
              <div class="left">
                <div class="doctor">
                  <div class="title">副主任医师</div>
                  <svg
                    t="1790926337417"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5986"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
                      p-id="5987"
                      fill="#515151"
                    ></path>
                  </svg>
                  <div class="name">裴育</div>
                </div>
                <div class="info">
                  <p class="price">骨质疏松和骨代谢疾病、糖尿病、甲状腺疾病。</p>
                </div>
              </div>
              <div class="right">
                <div class="left">
                  <p class="price">￥ 100</p>
                </div>
                <div class="right">
                  <el-button type="primary">剩余6</el-button>
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider />
            </div>
          </div>
        </div>
      </div>
      <div class="afternoon-tickets">
        <div class="time-tickets">
          <svg
            t="1790928615849"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10784"
            width="20"
            height="20"
          >
            <path
              d="M981.333333 896a42.666667 42.666667 0 0 1 0 85.333333H42.666667a42.666667 42.666667 0 0 1 0-85.333333h938.666666z m-469.333333-384a256 256 0 0 1 255.829333 246.4L768 768a42.666667 42.666667 0 0 1-85.333333 0 170.112 170.112 0 0 0-50.005334-120.661333A170.112 170.112 0 0 0 512 597.333333a170.112 170.112 0 0 0-120.661333 50.005334 170.112 170.112 0 0 0-49.706667 110.634666L341.333333 768a42.666667 42.666667 0 0 1-85.333333 0 256 256 0 0 1 256-256z m-384 213.333333a42.666667 42.666667 0 0 1 0 85.333334H42.666667a42.666667 42.666667 0 0 1 0-85.333334h85.333333z m853.333333 0a42.666667 42.666667 0 0 1 0 85.333334h-85.333333a42.666667 42.666667 0 0 1 0-85.333334h85.333333zM210.304 405.973333l60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667 60.330667L149.973333 466.346667a42.666667 42.666667 0 1 1 60.330667-60.330667z m663.722667 0a42.666667 42.666667 0 0 1 0 60.330667l-60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667 0zM512 42.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v195.669334l108.202666-108.202667a42.666667 42.666667 0 0 1 60.330667 60.330667l-181.034667 181.034666-3.498666 3.114667-0.256 0.213333a42.624 42.624 0 0 1-1.92 1.450667l-1.621334 1.066667-0.512 0.341333a38.997333 38.997333 0 0 1-8.746666 4.096 42.538667 42.538667 0 0 1-1.152 0.384l-1.365334 0.384-1.194666 0.298667-1.28 0.256a42.752 42.752 0 0 1-1.109334 0.213333l-1.450666 0.256-1.066667 0.128-0.981333 0.128a42.88 42.88 0 0 1-1.493334 0.085333l-1.706666 0.085334h-1.664l-1.664-0.085334-1.493334-0.085333-0.981333-0.128a42.666667 42.666667 0 0 1-1.152-0.128l-1.365333-0.256a70.656 70.656 0 0 1-3.498667-0.768 42.581333 42.581333 0 0 1-2.602667-0.768l-0.768-0.256a40.362667 40.362667 0 0 1-6.4-2.944l-1.024-0.554667a42.368 42.368 0 0 1-0.554666-0.341333l-0.512-0.341333a46.08 46.08 0 0 1-1.962667-1.28l-1.792-1.408-0.042667-0.042667v0.042667l-0.341333-0.298667-0.554667-0.426667-2.602666-2.432L300.8 233.130667A42.666667 42.666667 0 0 1 361.130667 172.8L469.333333 281.002667 469.333333 85.333333a42.666667 42.666667 0 0 1 42.666667-42.666666z"
              fill="#FF7F50"
              p-id="10785"
            ></path>
          </svg>
          <p>下午号源</p>
        </div>
        <div class="tickets-doctors">
          <div class="tickets-info" v-for="(items, index) in 2" :key="index">
            <div class="content">
              <div class="left">
                <div class="doctor">
                  <div class="title">副主任医师</div>
                  <svg
                    t="1790926337417"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5986"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
                      p-id="5987"
                      fill="#515151"
                    ></path>
                  </svg>
                  <div class="name">裴育</div>
                </div>
                <div class="info">
                  <p class="price">骨质疏松和骨代谢疾病、糖尿病、甲状腺疾病。</p>
                </div>
              </div>
              <div class="right">
                <div class="left">
                  <p class="price">￥ 100</p>
                </div>
                <div class="right">
                  <el-button type="primary">剩余6</el-button>
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "DoctorDetail" });

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;
  .top-content {
    .hspInfo {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      svg {
        margin: 0 5px;
      }
      p:hover,
      svg:hover {
        cursor: pointer;
        color: @color-text-hoverMainColor;
      }
    }
  }
  .middle-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .currentDate {
      font-weight: 800;
      margin: 10px 0;
    }
    .card-wrap {
      display: flex;
      flex-direction: row;
      gap: 15px;
      width: 100%;
      .dataCard {
        /* 过渡：0.3秒完成变换，缓动曲线 */
        transition: transform 0.3s ease;
        transform-origin: center;
        flex: 1;
        border: 1px solid @color-text-placeholder;
        .itemData {
          text-align: center;
          font-weight: 800;
          background-color: @color-text-placeholder;
          padding: 8px;
          transition: background-color 0.3s ease;
        }
        .itemNote {
          padding: 15px 0;
          text-align: center;
        }
        &:hover {
          /* 放大5%，改成1.1就是放大10% */
          transform: scale(1.1);
          .itemData {
            background: @color-bg-cardhover;
          }
        }
      }
    }
    .pagination-block {
      margin: 10px 0;
    }
  }
  .bottom-content {
    .morning-tickets,
    .afternoon-tickets {
      display: flex;
      flex-direction: column;
      .time-tickets {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
        font-weight: 800;
        svg {
          margin-right: 6px;
        }
      }
      .tickets-doctors {
        display: flex;
        flex-direction: column;
        .tickets-info {
          display: flex;
          flex-direction: column;
          .content {
            display: flex;
            flex-direction: row;
            .left {
              flex: 10;
              display: flex;
              flex-direction: column;
              .doctor {
                flex: 10;
                display: flex;
                flex-direction: row;
                .title {
                  color: @color-important;
                  font-weight: 800;
                  margin-bottom: 10px;
                }
                svg {
                  margin: 0 6px;
                }
              }
            }
            .right {
              flex: 2;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>

```

### 登录组件

#### 组件路径

在`src/components`下创建`Login`文件夹，用于保管登录相关组件的文件。

#### 组件创建

经过分析，创建`FollowApp`组件、`InputDialog`组件、`ScanDialog`组件和聚合主组件`index.vue`。

##### 聚合组件

`index.vue`组件的核心代码如下：

```vue
<template>
  <div class="page-wrap">
    <!-- 登录界面主窗口 -->
    <el-dialog
      v-model="userStore_Login.userLoginVisible"
      title="用户登录 - 尚医通"
      width="700"
      transition="dialog-slide"
    >
      <!-- 内容组件 -->
      <div class="content">
        <!-- 内容组件中 左侧部分 -->
        <div class="left">
          <!-- 左侧部分的 输入手机号登录 组件 -->
          <div v-show="userStore_Login.userLoginMethods_Input" class="input">
            <InputDialog />
          </div>
          <!-- 左侧部分的 扫码登录 组件 -->
          <div v-show="!userStore_Login.userLoginMethods_Input" class="scan">
            <ScanDialog />
          </div>
        </div>
        <!-- 内容组件中 右侧部分 -->
        <div class="right">
          <FollowApp />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="userStore_Login.userLoginVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Login" });
// 引入登录窗口小组件
import FollowApp from "./FollowApp/index.vue";
import InputDialog from "./InputDialog/index.vue";
import ScanDialog from "./ScanDialog/index.vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  .content {
    display: grid;
    grid-template-columns: 50% 50%;
    .left {
      border: 1px solid #f1f1f1;
    }
  }
}

// 弹窗出现动画
/* Slide Animation */
.dialog-slide-enter-active,
.dialog-slide-leave-active,
.dialog-slide-enter-active .el-dialog,
.dialog-slide-leave-active .el-dialog {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.dialog-slide-enter-from,
.dialog-slide-leave-to {
  opacity: 0;
}
.dialog-slide-enter-from .el-dialog,
.dialog-slide-leave-to .el-dialog {
  transform: translateY(-100px);
  opacity: 0;
}
</style>

```

##### 输入组件

在`src/components/Login/InputDialog`下创建`index.vue`:

```vue
<template>
  <div class="page-wrap">
    <div class="input">
      <el-input v-model="InputPhoneNumber" style="width: 280px" prefix-icon="User" placeholder="请输入手机号码" />
      <el-input v-model="InputVerifyCode" style="width: 280px" prefix-icon="Lock" placeholder="请输入手机验证码" />
      <el-button>获取验证码</el-button>
      <div class="user-login-button">
        <el-button type="primary" target="_blank" style="width: 280px"> 用户登录 </el-button>
      </div>
    </div>
    <div class="scan">
      <p>微信扫码登录</p>
      <el-button type="danger" :icon="ChatDotRound" circle @click="handleChatClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "InputDialog" });
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入 Element-Plus 图标元素
import { ChatDotRound } from "@element-plus/icons-vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";

// 用户输入 手机号码 的变量存储
let InputPhoneNumber = ref<string>("");
// 用户输入 验证码 的变量存储
let InputVerifyCode = ref<string>("");
// 用户点击微信扫码登录 按钮
const handleChatClick = () => {
  userStore_Login.userLoginMethods_Input = false;
};
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    .el-input,
    .el-button {
      margin-left: 20px;
      margin-top: 20px;
      :deep(.el-input__inner) {
        padding-top: 3px;
      }
    }
  }
  .scan {
    p {
      margin-top: 15px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
}
</style>
```

##### 扫码组件

在`src/components/Login/ScanDialog`下创建`index.vue`:

```vue
<template>
  <div class="page-wrap">
    <div class="scan">
      <img src="../../../assets/login/followPic.png" alt="扫码登录" />
    </div>
    <div class="input">
      <p>输入手机号码登录</p>
      <el-button type="info" :icon="EditPen" circle @click="handleChatClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "ScanDialog" });
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入 Element-Plus 图标元素
import { EditPen } from "@element-plus/icons-vue";
// 用户点击微信扫码登录 按钮
const handleChatClick = () => {
  userStore_Login.userLoginMethods_Input = true;
};
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .scan {
    margin-top: 45px;
  }
  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin-top: 15px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
}
</style>
```

##### 提示组件

提示组件实际为`App`下载或微信关注二维码提示组件，在`src/components/Login/FollowApp`下创建`index.vue`:

```vue
<template>
  <div class="page-wrap">
    <div class="content">
      <div class="top">
        <div class="left">
          <img src="../../../assets/login/followPic.png" alt="微信扫一扫关注" />
          <div class="tips">
            <el-icon><ChatDotRound /></el-icon>
            <p>微信扫一扫关注</P>
            <p>“快速预约挂号”</P>
          </div>
        </div>
        <div class="right">
          <img src="../../../assets/login/appDown.png" alt="扫一扫下载" />
          <div class="tips">
            <el-icon><Iphone /></el-icon>
            <p>扫一扫下载</P>
            <p>“预约挂号”APP</P>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p>尚医通 官方指定平台</p>
        <p>快速挂号 安全放心</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "FollowApp" });

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: #717171;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .top {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 30px;
      .left,
      .left > .tips,
      .right,
      .right > .tips {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
    }
    .bottom {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        font-size: 1.5rem;
        margin: 10px 0;
      }
    }
  }
}
</style>

```

## 状态管理

本案例状态管理采用`pinia`状态管理工具，搭配`Vue3.x`使用。

### 前置准备

#### 安装依赖

通过如下命令安装`pinia`工具依赖包：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm i pinia

added 1 package in 861ms

35 packages are looking for funding
  run `npm fund` for details
```

#### 注册使用

在`src/main.ts`内进行注册与挂载：

```ts
......
// 引入 pinia 状态管理工具
import { createPinia } from "pinia";
......
// 将创建的 createrPinia 进行挂载
app.use(createPinia());
......
```

#### 聚合导出

`index.ts`用于聚合导出，用于对模组自身方法实现导出：

```ts
// 聚合导出文件，每个模块统一导出
// 医院详情 医院部门 下的聚合导出
export * from "./modules/hospital";

// 用户 下的聚合导出
export * from "./modules/user";
```

#### 初始架构

`src`路径下创建`stores/modules`以及`stores/index.ts`，其中`stores/index.ts`用于聚合导出文件，`stores/modules`下创建各类模块的状态管理文件，用于数据进行状态存储，其数据结构树状图如下所示：

```text
📦stores
 ┣ 📂modules
 ┗ 📜index.ts
```

> 当前路径仅应用于初始结构搭建

### 医院详情

`src/modules/hospital.ts`中关于 医院详情  ` hospitalDetail`详细实现方式如下：

```ts
// 本文件是 医院详情 / hospitalDetail 用于状态管理的文件
import { defineStore } from "pinia";
import { ref } from "vue";
// 引入 类型定义
import type { ResponseData } from "@/types/api";
import type { HospitalDetailItem } from "@/types/index";
// 引入网络请求标准API
import { reqHospitalDetailInfo } from "@/api/hospital/index";

// 创建医院详情状态存储
export const useHospitalDetailStore = defineStore("HospitalDetail", () => {
  // =============== State
  // 用于存储医院详细数据的 State 变量 hospitalDetailInfo
  let hospitalDetailInfo = ref<HospitalDetailItem | null>(null);

  // =============== Actions
  // 通过网络请求获取医院详细数据的 Actions 方法 getHospitalDetailInfo
  const getHospitalDetailInfo = async (hoscode: string) => {
    // 将获取的结果保存
    const result = (await reqHospitalDetailInfo(hoscode)) as ResponseData<HospitalDetailItem>;
    // 获取的结果数据 code 代码 ==200时再处理
    if (result.code == 200) {
      // 将实际获取数据保存到 State 变量中
      hospitalDetailInfo.value = result.data;
      console.log("Pinia获取到的医院详情数据：", hospitalDetailInfo.value);
    }
  };
  // =============== Getters
  return { hospitalDetailInfo, getHospitalDetailInfo };
});

```

### 医院科室

`src/modules/hospital.ts`中关于 医院部门  ` hospitalDepartment`详细实现方式如下：

```ts
// 本文件是 医院详情 / hospitalDetail ，医院部门 / hospitalDepartment 用于状态管理的文件
import { defineStore } from "pinia";
import { ref } from "vue";
// 引入 类型定义
import type { ResponseData } from "@/types/api";
import type { HospitalDetailItem, HospitalDepartmentPageResponse } from "@/types/index";
// 引入网络请求标准API
import { reqHospitalDetailInfo, reqHospitalDepartmentInfo } from "@/api/hospital/index";
......

// 创建 医院部门 的状态存储
export const useHospitalDepartmentStore = defineStore("HospitalDepartment", () => {
  // =============== State
  let hospitalDepartment = ref<HospitalDepartmentPageResponse | null>(null);

  // =============== Actions
  // 通过网络请求获取医院部门数据的 Actions 方法 getHospitalDepartment
  const getHospitalDepartment = async (hscode: string) => {
    // 将获取的结果保存
    const result = (await reqHospitalDepartmentInfo(hscode)) as ResponseData<HospitalDepartmentPageResponse>;
    // 获取的结果数据 code 代码 ==200时再处理
    if (result.code == 200) {
      // 将实际获取数据保存到 State 变量中
      hospitalDepartment.value = result.data;
      console.log("Pinia获取到的 医院部门 数据：", hospitalDepartment.value);
    }
  };

  // =============== Getters
  return { hospitalDepartment, getHospitalDepartment };
});
```

### 科室医生

`src/modules/hospital.ts`中关于 科室医生  ` HospitalDoctor`详细实现方式如下：

```ts
// 创建 科室 / 医生 / 就诊人 的状态存储
export const useHospitalDoctorStore = defineStore("HospitalDoctor", () => {
  // =============== State
  // 用于控制当前展示的是哪个页面：科室：dpt;医生：dct;就诊人选择：pat
  let appointmentOption = ref<string>("dpt");

  // =============== Actions

  // =============== Getters
  return { appointmentOption };
});
```

### 用户相关

`src/modules/user.ts`中关于用户相关的状态管理。

#### 窗口状态

`src/modules/user.ts`中关于登录相关的状态：

```ts
// 本文件是 用户 相关的 Pinia Store 存储相关
import { defineStore } from "pinia";
import { ref } from "vue";
// 引入 类型定义

// 引入网络请求标准API

// 创建 用户 状态存储
export const useUserStore = defineStore("UserStore", () => {
  // =============== State
  // 用于存储用户登录的 State 变量 userLoginVisible
  let userLoginVisible = ref(false);
  // 用于存储用户登录中输入手机号或扫码登录的 State 变量 userLoginMethods_Input=true 为输入手机号方式 userLoginMethods_Input=false 为微信扫码登录
  let userLoginMethods_Input = ref(true);
  // =============== Actions
  // 用于存储用户的 State 变量

  // =============== Getters
  return { userLoginVisible, userLoginMethods_Input };
});
```

#### 用户信息

如用户的相关登录信息通过`src/stores/modules/user.ts`进行存储和本地持久化存储：

```ts
// 本文件是 用户 相关的 Pinia Store 存储相关
import { defineStore } from "pinia";
import { ref, computed } from "vue";
// 引入用户数据 类型
import type { ResLoginItem } from "@/types/userLogin/index";

// 引入网络请求标准API

// 引入本地持久化存储工具
import { userInfoMethods } from "@/utils/index";

// 创建 用户 状态存储
export const useUserStore = defineStore("UserStore", () => {
  // =============== State
  // 用于存储用户登录的 State 变量 userLoginVisible
  const userLoginVisible = ref(false);
  // 用于存储用户登录中输入手机号或扫码登录的 State 变量 userLoginMethods_Input=true 为输入手机号方式 userLoginMethods_Input=false 为微信扫码登录
  const userLoginMethods_Input = ref(true);
  // 用于存储 用户信息 的 State 变量
  const userInfo = ref<ResLoginItem | null>(userInfoMethods.getLocalStorage());

  // =============== Actions
  /**
   * 设置用户信息：存入pinia + 持久化到localStorage
   * @param info 登录接口返回用户信息对象
   */
  const setUserInfo = (info: ResLoginItem) => {
    // 将传入的用户信息保存在 Pinia Store 变量内
    userInfo.value = info;
    // 将用户信息做本地化存储
    userInfoMethods.setLocalStorage(info);
    // 测试使用
    // console.log("当前 Pinia 存储的userInfo:", userInfo.value);
    // 返回code =200代码用于前端确认用户信息是否保存成功
  };
  /**
   * 清空用户信息（退出登录使用）
   */
  const clearUserInfo = () => {
    userInfo.value = null;
    userInfoMethods.clearLocalStorage();
  };

  // =============== Getters
  /** 是否登录，判断token是否存在 */
  const isLogin = computed(() => userInfo.value?.token);
  return { userLoginVisible, userLoginMethods_Input, userInfo, setUserInfo, clearUserInfo, isLogin };
});
```

## 网络请求

### 引用挂载

在`src/App.vue`中引入`axios`二次封装的工具`request`：

```vue
<script setup lang="ts">
// 引入 Axios 二次封装的工具request
import request from "@/utils/request";
// 引入 vue 中页面挂载方法
import { onMounted } from "vue";
// 生命周期
onMounted(() => {
  request
    .get("/hosp/hospital/findHospitalPage/1/10")
    .then((res) => {
      console.log("app组件展示获取的数据:", res);
    })
    .catch((err) => {
      console.error("请求失败：", err);
    });
});
</script>
```

### 路径管理

统一创建请求路径管理文件`src/api`，将需要的请求路径纳入其中，在其他项目文件中进行引入，后期若需要修改访问路径，请通过单一文件处理即可。

#### 主页组件

##### 基础封装

`src/api/home/index.ts`文件封装了关于`home`组件的数据请求，后续会陆续增加：

```ts
// 引入网络请求接口
import { request } from "@/utils";

// 通过 type 引入类型接口
import type {
  ResponseData,
  HospitalPageResponse,
  HospitalLevelPageResponse,
  HospitalRegionPageResponse
} from "@/types/index";

// 通过枚举管理首页 home 模块的接口地址
enum API {
  // 获取已有的医院数据接口地址
  HOSPITAL_URL = "/hosp/hospital/findHospitalPage/",
  HOSPITAL_Level_URL = "/cmn/dict/findByDictCode/",
  HOSPITAL_Region_URL = "/cmn/dict/findChildData/"
}
// 医院名称清单 数据
export const reqHospitalNameList = async (page: number, limit: number) => {
  const result = await request.get(API.HOSPITAL_URL + `${page}/${limit}`);
  return result.data as ResponseData<HospitalPageResponse>;
};

// 医院等级 数据
export const reqHospitalLevelList = async (dictCode: string) => {
  const result = await request.get(API.HOSPITAL_Level_URL + `${dictCode}`);
  return result.data as ResponseData<HospitalLevelPageResponse>;
};

// 医院区域数据
export const reqHospitalRegionList = async (dictCode: number) => {
  const result = await request.get(API.HOSPITAL_Region_URL + `${dictCode}`);
  return result.data as ResponseData<HospitalRegionPageResponse>;
};

```

##### 动态筛选

在动态展示数据之后，进行筛选功能开发时，需要将查询参数拓展，具体参考动态组件-Home组件-智能筛选单元，将查询语句参数增加：

```ts
// 引入网络请求接口
import { request } from "@/utils";

// 通过 type 引入类型接口
import type {
  ResponseData,
  HospitalPageResponse,
  HospitalLevelPageResponse,
  HospitalRegionPageResponse
} from "@/types/index";

// 通过枚举管理首页 home 模块的接口地址
enum API {
  // 获取已有的医院数据接口地址
  HOSPITAL_URL = "/hosp/hospital/findHospitalPage/",
  HOSPITAL_Level_URL = "/cmn/dict/findByDictCode/",
  HOSPITAL_Region_URL = "/cmn/dict/findChildData/"
}
// 医院名称清单 数据 hostype / districtCode 不传参默认为空
export const reqHospitalNameList = async (
  page: number,
  limit: number,
  hostype: string = "",
  districtCode: string = ""
) => {
  const result = await request.get(
    API.HOSPITAL_URL + `${page}/${limit}` + "?hostype=" + `${hostype}` + "&districtCode=" + `${districtCode}`
  );
  return result.data as ResponseData<HospitalPageResponse>;
};

// 医院等级 数据
export const reqHospitalLevelList = async (dictCode: string) => {
  const result = await request.get(API.HOSPITAL_Level_URL + `${dictCode}`);
  return result.data as ResponseData<HospitalLevelPageResponse>;
};

// 医院区域数据
export const reqHospitalRegionList = async (dictCode: number) => {
  const result = await request.get(API.HOSPITAL_Region_URL + `${dictCode}`);
  return result.data as ResponseData<HospitalRegionPageResponse>;
};
```

> 此时处于医院等级、地区智能筛选部分，未涉及搜索功能

#### 医院组件

##### 医院详情

`src/api/hospital/index.ts`文件封装了关于`hospital`组件的数据请求，目前支持医院详情数据的请求：

```ts
// 引入网络请求接口
import { request } from "@/utils";

// 通过 type 引入类型接口定义
import type { ResponseData } from "@/types/api";
import type { HospitalDetailItem } from "@/types/index";

// 通过枚举管理医院详情 HospitalDetail 模块的接口地址
enum API {
  // 获取 医院详情 的接口地址
  HOSPITAL_DETAIL_URL = "hosp/hospital/findHospitalDetail/"
}

// 医院详情 网络请求函数
export const reqHospitalDetailInfo = async (hoscode: string) => {
  const result = await request.get(API.HOSPITAL_DETAIL_URL + hoscode);
  return result.data as ResponseData<HospitalDetailItem>;
};
```

##### 部门科室

`src/api/hospital/index.ts`文件封装了关于`hospitalDepartment`组件的部门相关的数据请求：

```ts
// 引入网络请求接口
import { request } from "@/utils";

// 通过 type 引入类型接口定义
import type { ResponseData } from "@/types/api";
import type { HospitalDetailItem, HospitalDepartmentItem } from "@/types/index";

// 通过枚举管理医院详情 HospitalDetail 模块的接口地址
enum API {
  // 获取 医院详情 的接口地址
  HOSPITAL_DETAIL_URL = "hosp/hospital/findHospitalDetail/",
  // 获取 医院部门 的接口地址
  HOSPITAL_DEPARTMENT_URL = "hosp/hospital/department/"
}

// 医院详情 网络请求函数
export const reqHospitalDetailInfo = async (hoscode: string) => {
  const result = await request.get(API.HOSPITAL_DETAIL_URL + hoscode);
  return result.data as ResponseData<HospitalDetailItem>;
};

// 医院部门 网络请求函数
export const reqHospitalDepartmentInfo = async (hoscode: string) => {
  const result = await request.get(API.HOSPITAL_DEPARTMENT_URL + hoscode);
  return result.data as ResponseData<HospitalDepartmentItem>;
};
```

#### 科室医生

##### 医生排班

`src/api/doctorSchedule/index.ts`文件封装了关于`doctor`组件的数据请求：

```ts
// 引入网络请求接口
import { request } from "@/utils";
// 通过 type 引入类型接口
import type { ResponseData } from "@/types/index";
import type { DoctorsScheduleItems } from "@/types/index";

// 通过枚举管理获取 doctor 排版的接口地址
enum API {
  // 获取 doctor 排版 的接口地址
  DOCTOR_URL = "/hosp/hospital/doctor/"
}
// 网络请求，获取 doctor 排版的数据信息
export const reqDoctorSchedule = async (hoscode: string, spccode: string, page: number, limit: number) => {
  const result = await request.get(API.DOCTOR_URL + `${hoscode}/${spccode}/${page}/${limit}`);
  return result.data as ResponseData<DoctorsScheduleItems>;
};
```

#### 用户组件

##### 登录组件

在登录界面中，需要请求后端数据，涉及相关有：验证码获取，登录验证，注册验证，等等。在`src/api/user`下创建`index.ts`用于管理与用户相关的请求路径。

###### 验证获取

在`src/api/user/index.ts`下与验证码获取相关的代码如下：

```ts
// 引入网络请求接口
import { request } from "@/utils";

// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { CaptchaItem } from "@/types/userLogin/index";

// 通过枚举管理 用户 相关功能的后端获取地址
enum API {
  // Login 模块的验证码 后端获取地址
  CAPTCHA_URL = "/user/msm/send"
}

// 用户 登录 验证码获取
export const reqLoginCapcha = async (phoneNumber: string) => {
  const result = await request.post(API.CAPTCHA_URL, {
    phone: phoneNumber
  });
  return result.data as ResponseData<CaptchaItem>;
};
```

###### 输入登录

在`src/api/user/index.ts`下与登录后用户信息相关的数据获取代码如下：

```ts
......
// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { CaptchaItem, ReqLoginItem, ResLoginItem } from "@/types/userLogin/index";

// 通过枚举管理 用户 相关功能的后端获取地址
enum API {
  // Login 模块的验证码 后端获取地址
  CAPTCHA_URL = "/user/msm/send",
  LOGIN_URL = "/user/userInfo/login"
}
......
// 用户 登录 用户信息获取
export const reqLogin = async (reqObject: ReqLoginItem) => {
  const result = await request.post(API.LOGIN_URL, reqObject);
  return result.data as ResponseData<ResLoginItem>;
};
```

###### 微信登录

在`web/src/api/user/index.ts`，在文件末尾加上：

```ts
// 引入网络请求接口
import { request } from "@/utils";

// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { WxQrcodeItem, WxScanStatusItem } from "@/types/userLogin";

// 通过枚举管理 用户 相关功能的后端获取地址
enum API {
......
  // 获取微信小程序二维码
  WX_QRCODE_URL = "/wx/qrcode",
  // 轮询扫码状态
  WX_SCANSTATUS_URL = "/wx/scan/status"
}
......

// 获取小程序码
export const reqWxQrcode = async () => {
  const result = await request.get(API.WX_QRCODE_URL);
  return result.data as ResponseData<WxQrcodeItem>;
};

// 轮询扫码状态
export const reqWxScanStatus = async (uuid: string) => {
  const result = await request.get(API.WX_SCANSTATUS_URL, {
    params: { uuid }
  });
  return result.data as ResponseData<WxScanStatusItem>;
};

```

## 类型推导

### 基本定义

在`src/types`下创建类型推导`hospital.ts`和聚合函数`index.ts`文件，用于所有`ts`文件的类型推导模板，可以很快速的实现导入及使用。

### 聚合函数

`src/types/index.ts`文件中通过聚合导出所需的类型，实现对类型的统一管理：

```ts
// 后端基础响应数据类型，T 泛型
export * from "./api";
// 后端 Home / 关于医院清单获取相关的类型
export * from "./hospitalList/index";
// 后端 Hospital / 关于医院详情 HospitalDetail 获取相关的类型
export * from "./hospitalDetail/index";
// 后端 Hospital / 医院科室 HospitalDepartment 获取相关的类型
export * from "./hospitalDepartment/index";
// 后端 User / Login / CAPTCHA 获取相关的类型
export * from "./userLogin/index";
// 后端 Doctor 获取相关的类型
export * from "./doctorSchedule/index";
```

### 基本类型

后端返回的数据结构基本保持一致，在此基础上，封装一个标准类型，`src/types/api.ts`采用泛型：

```ts
// 基础后端统一返回结构，泛型 T 代表内部data里的业务数据类型， T 就是泛型参数，相当于占位符，代表未来要传入的业务类型
export interface ResponseData<T> {
  code: number;
  message: string;
  ok: boolean;
  data: T; // T 暂时不知道是什么类型，调用的时候再告诉TS T是谁
}
```

### 主页组件

#### 医院清单

从后端获取的已有医院清单`src/types/hospitalList/index.ts`，实际需要的部分进行类型定义：

```ts
// 单条医院名称清单 数据类型
export interface HospitalItem {
  id: string;
  hosname: string;
  hoscode: string;
  hostype: string;
  provinceCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
  logoData: string;
  intro: string;
  route: string;
  status: number;
  bookingRule: {
    cycle: number;
    releaseTime: string;
    stopTime: string;
    quitDay: number;
    quitTime: string;
    rule: string[];
  };
  hostypeString: string;
  provinceString: string;
  cityString: string;
  districtString: string;
}

// 医院名称清单分页接口里 data 的结构
export interface HospitalPageResponse {
  totalElements: number;
  content: HospitalItem[];
  totalPages: number;
  size: number;
  number: number;
}
```

#### 医院等级

从后端获取的已有医院等级`src/types/hospitalList/index.ts`，实际需要的部分进行类型定义：

```ts
// 单条医院等级 数据类型
export interface HospitalLevelItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  parentId: number;
}

// 医院等级 分页接口里 data 的结构
export type HospitalLevelPageResponse = HospitalLevelItem[];
```

#### 医院地区

从后端获取的已有医院地区`src/types/hospitalList/index.ts`，实际需要的部分进行类型定义：

```ts
// 医院区域 数据类型
export interface HospitalRegionItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  parentId: number;
}

// 医院区域 分页接口里 data 的结构
export type HospitalRegionPageResponse = HospitalRegionItem[];
```

#### 搜索医院

从后端获取 搜索医院名称 `src/types/hospitalList/index.ts`，实际需要的部分进行类型定义：

```ts
// 搜索 医院关键字 对应医院名称
export interface SearchHospitalKeyWord {
  id: string;
  hosname: string;
  hoscode: string;
}

// 搜索 医院关键字 接口里 data 的结构
export type SearchHospitalKeyWordPageResponse = SearchHospitalKeyWord[];
```

### 医院组件

#### 医院详情

从后端获取的已有医院详情`src/types/hospitalDetail/index.ts`，实际需要的部分进行类型定义：

```ts
// 单条医院详情 / bookingRule 的数据类型
export interface BookingRule {
  cycle: number;
  releaseTime: string;
  stopTime: string;
  quitDay: number;
  quitTime: string;
  rule: string[];
}
// 单条医院详情 的数据类型
export interface HospitalDetailItem {
  id: string;
  hosname: string;
  hoscode: string;
  hostype: string;
  provinceCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
  logoData: string;
  intro: string;
  route: string;
  status: number;
  bookingRule: BookingRule;
  hostypeString: string;
  provinceString: string;
  cityString: string;
  districtString: string;
}

```

#### 医院科室

从后端获取的医院部门`src/types/hospitalDepartment/index.ts`，实际需要的部分进行类型定义：

```ts
// 单条 医院部门 的数据类型
export interface HospitalDepartmentChildren {
  id: string;
  hoscode: string;
  depcode: string;
  depname: string;
  title: string;
}
// 多条 医院部门 的数据类型
export interface HospitalDepartmentItem {
  id: string;
  hoscode: string;
  depcode: string;
  depname: string;
  title: string;
  children: HospitalDepartmentChildren[];
}

// 多条 医院部门 的数据类型
export type HospitalDepartmentPageResponse = HospitalDepartmentItem[];
```

#### 科室医生

从后端获取的医院部门`src/types/hospitalDepartment/index.ts`，实际需要的部分进行类型定义：

```ts
// 科室医生 的数据类型
export interface AppointmentDoctorItem {
  appointmentDepartment: number;
  doctorDetail: number;
}
```

### 医生组件

#### 医生排班

从后端获取的医生排班`src/types/doctorSchedule/index.ts`，实际需要的部分进行类型定义：

```ts
// 单条 医生排班 的数据类型
export interface DoctorScheduleContent {
  id: string;
  hoscode: string;
  depcode: string;
  title: string;
  docname: string;
  skill: string;
  workDate: string;
  dayOfWeek: string;
  workTime: number;
  reservedNumber: number;
  availableNumber: number;
  amount: number;
  status: number;
}

// 所有 医生们排班 的数据类型
export interface DoctorsScheduleItems {
  totalElements: number;
  content: DoctorScheduleContent[];
  totalPages: number;
  size: number;
  number: number;
}

// 经过排班工具处理后的单日 单人 workDate 的排班数组
export interface Schedule {
  amount: number;
  availableNumber: number;
  dayOfWeek: string;
  depcode: string;
  docname: string;
  hoscode: string;
  id: string;
  reservedNumber: number;
  skill: string;
  status: number;
  title: string;
  workDate: string;
  workTime: number;
}

// 【单条日期卡片】一个日期对应的卡片对象
export interface ScheduleCard {
  dayOfWeek: string;
  scheduleList: Schedule[];
  morningList: Schedule[];
  afternoonList: Schedule[];
  tipText: string;
  workDate: string;
}

// scheduleArr：日期卡片组成的数组
export type ScheduleArr = ScheduleCard[];
```

### 用户组件

#### 登录组件

在`src/types`下创建`userLogin/index.ts`文件用于管理和维护关于登录相关数据的格式数据。

##### 验证数据

有关验证码获取相关代码，具体定义`src/types/userLogin/index.ts`如下：

```ts
// 登录窗口 验证码 数据类型
export interface CaptchaItem {
  phone: string;
  code: string;
}
```

##### 登录数据

分请求数据类型和响应数据类型，具体定义`src/types/userLogin/index.ts`如下：

```ts
// 登录 请求数据类型
export interface ReqLoginItem {
  phone: string;
  code: string;
}
// 登录 响应数据类型
export interface ResLoginItem {
  token: string;
  name: string;
}
```

##### 微信扫码

在 `web/src/types/userLogin/index.ts` 末尾加上：

```ts
// 获取小程序码 响应数据类型
export interface WxQrcodeItem {
  uuid: string;
  qrDataUrl: string; // base 32/64 图片
}

// 扫码用户信息
export interface WxUserItem {
  id: number;
  nickname: string;
  avatar: string;
  openid: string;
}

// 扫码状态轮询 响应数据类型
export interface WxScanStatusItem {
  status: "pending" | "done" | "expired";
  token?: string;
  user?: WxUserItem;
}
```

> 添加了`token`字段

## 动态组件

在静态组件、网络请求均已具备的情况下，可以将请求的数据与页面进行关联，实现动态数据的效果展示与互动：

* 网络请求实现 / 请求拦截器 / 响应拦截器，使用`src/utils/request/index.ts`进行请求相关操作；
* 网络请求数据获取，使用`src/api/home/index.ts`进行管理和数据获取；
* `home`组件在`mounted`时、点击分页器时进行数据请求操作；
* 通过父传子`props`和子传父`emits`实现数据交互，请注意，`props`中的数据在子组件中无法进行修改，如需调整数据，需要通过`watch`或`computed`实现；

### 主页组件

#### 医院组件

##### 父亲组件

在`home/index.vue`组件中通过如下实现数据显示与传递：

```vue
<!-- 医院卡片 组件 -->
        <div class="hospital-card">
          <Card class="card-item" v-for="item in hasHospitalArr" :key="item.id" :hospital-item="item" />
        </div>
......
<script setup lang="ts">
// 通过 type 引入类型接口
import type { HospitalItem, HospitalPageResponse } from "@/types/index";
// 导入医院卡片组件
import Card from "@/pages/home/card/index.vue";
// 导入 网络请求 API
import { reqHospital } from "@/api/home";
// 导入 onmounted()生命周期钩子
import { ref, onMounted } from "vue";
// 已有医院数组存储 通过使用自定义的接口定义，可以在 v-for 中使用内部的id变量
const hasHospitalArr = ref<HospitalItem[]>([]);

// 生命周期
onMounted(async () => {
  // 通过调用网络请求 API 接口获取已存在的医院数据
  getHospitalInfo();
  // console.log("获取到的医院数据：", hospHavedData);
});
// 获取已有医院的数据函数
const getHospitalInfo = async () => {
  const result = (await reqHospital(pageNo.value, pageSize.value)) as HospitalPageResponse;
  // 当从后台获取数据成功之后
  if (result.code === 200) {
    // 将获取到的医院数据给到 hasHospitalArr
    hasHospitalArr.value = result.data.content;
    // console.log("当前获取到的医院数据：", hasHospitalArr.value);

    // 将获取到的医院数据中的医院总数给到 pageTotalData
    pageTotalData.value = result.data.totalElements;
    console.log("当前获取到的医院数据：", pageTotalData.value);
  }
};
</script>
```

> * 通过生命周期钩子`mounted`实现数据请求0延时；
> * 通过封装的`Axios`进行数据获取；
> * 通过`props`实现数据的父传子展示；
> * 通过`v-for`命令实现子组件的数据数量按需渲染；

##### 儿子组件

医院卡片组件的实际实现逻辑如下：

```vue
<template>
  <div class="page-home-card">
    <!-- 医院卡片 -->
    <el-card shadow="hover">
      <div class="content">
        <div class="left">
          <div class="top">{{ hospitalItem.hosname }}</div>
          <div class="bottom">
            <div class="left">
              <svg
                t="1789638754169"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1922"
                width="16"
                height="16"
              >
                <path
                  d="M986.776992 567.822977c14.823998-20.164492 26.251363-53.121973 26.251363-80.628234l-0.005126-0.396769c-0.793539-33.226095-16.845778-63.097593-45.19684-84.109961-27.883551-20.66276-65.458729-31.586731-108.666597-31.586731l-193.845887 0.035884c13.63369-47.042278 19.597532-100.589727 16.884737-153.311855-3.187482-61.967775-18.131433-117.13921-42.078049-155.35209-14.143236-22.563562-31.094614-39.332446-50.386623-49.84632-15.361225-8.370089-31.741542-12.615623-48.684719-12.615623-40.095228 0-69.546376 17.842315-85.168013 51.599486-12.649456 27.335045-12.649456 58.461442-12.649456 68.689272 0 87.236954-12.45671 124.689104-26.40925 158.056683-5.289232 9.781849-25.35735 33.24455-52.993818 54.16157-42.611175 32.246988-75.971578 39.017696-96.453895 39.017696l-144.089789 0c-28.828825 0-54.736732 10.680988-74.920703 30.886489-24.298274 24.323905-37.658223 60.185901-37.616188 100.983421l0.001025 0.760731 37.470604 403.396456c5.418413 73.995933 44.717026 114.76372 110.666847 114.797553 1.653718 0.015379 30.607623 0.277841 52.215658 0.277841 9.071356 0 21.437844-0.050237 28.841128-0.286043 23.031073-0.741251 40.783166-14.195523 55.04738-25.005692l3.624236-2.746628c3.47045-2.634876 7.958966-6.041761 10.787613-7.636014 2.294495 1.091884 5.393807 2.642053 8.07892 3.985122 7.318189 3.659094 17.340971 8.671511 28.261866 13.410187 26.117056 11.345346 63.949571 18.675838 96.383153 18.675838l301.476988 0c52.890268 0 94.037395-10.262689 122.299261-30.502023 28.652483-20.521276 43.815837-51.370857 43.850695-89.232079 0-13.623437-1.938736-24.567913-6.667159-35.454975 43.295013-16.846803 68.504728-49.618716 68.504728-90.56592 0-12.039436-3.257199-29.931988-10.07712-44.407402 8.743278-5.93206 17.574726-13.918707 25.344022-23.122319 17.040574-20.195249 26.414377-43.389335 26.394897-65.296741C1013.252884 612.426201 1004.16615 586.322473 986.776992 567.822977zM898.799812 682.726131l-22.270342 0 0.867356 65.362357 10.402122 4.070217 0.652055 0.250159c2.81942 1.074455 9.421989 3.590403 9.443519 23.428867-0.003076 3.403809-0.013328 13.764921-17.867946 22.567663-12.408524 6.119679-29.918659 9.630113-48.03984 9.630113l0 16.596644-16.480791-0.300396-0.890937 49.09174 13.114916 3.020368c2.600018 0.597717 8.008178 1.844413 7.987673 22.898816 0 14.763508-5.644991 25.403486-17.764396 33.482406-15.499633 10.33343-41.546972 15.794903-75.326699 15.794903l-312.100562 0c-11.539117 0-39.494435-7.971269-55.394938-15.796954-12.397246-6.097124-30.751157-16.439781-42.716775-23.214591L332.414226 434.134285c79.007324-27.16588 141.153491-95.435828 157.733731-127.879662l0.515698-1.108288c17.754144-42.137513 28.033236-86.674096 28.033236-189.634186 0-23.078234 4.3132-31.47908 6.883486-34.434857 1.481477-1.70293 3.771871-3.519661 12.246535-3.519661 8.443906 0 29.934038 13.505534 41.185061 31.451399 17.690579 28.219831 28.858557 74.782295 29.875599 124.554797 1.131869 55.389812-9.924358 110.039398-31.130497 153.878815l-0.776109 1.603481-13.6788 56.714427 297.271438-0.08612c50.690095 2.967055 78.121513 23.267904 78.325537 41.003593l-0.334229 11.623187c-0.401895 8.203999-3.941036 25.086686-11.083909 31.145876-7.190034 6.095073-12.738652 7.413537-14.117605 7.659595l-15.564223-0.656156-0.431628 53.90731-0.08407 14.5195 14.371865 2.050487c5.081107 0.725872 13.84489 2.935272 17.052877 5.179531 7.080332 4.975507 11.026495 15.99175 10.556934 29.444997-0.191721 5.263601-5.72291 15.899478-15.925109 26.043238C912.253059 678.62003 902.404569 682.726131 898.799812 682.726131zM258.021524 445.685705l0 486.712879c-3.860042 2.816344-7.481203 5.49223-10.454409 7.730337-5.671648 4.275266-10.423652 7.30281-12.769409 8.567961-5.534265 0.12508-14.388269 0.18762-26.391821 0.18762-19.246898 0-41.302964-0.160963-52.736481-0.256311l-0.996537-0.008202c-14.407749 0-28.619676-16.649956-32.557636-38.020134l-37.277858-417.166503c0.341406-25.792054 19.877423-46.025237 37.907358-48.16492L258.021524 445.685705z"
                  p-id="1923"
                  fill="#a9a9a9"
                ></path>
              </svg>
              <span>{{ hospitalItem.hostypeString }}</span>
            </div>
            <div class="right">
              <svg
                t="1789638734903"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1734"
                id="mx_n_1789638734904"
                width="16"
                height="16"
              >
                <path
                  d="M506.592 951.68c-242.624 0-440-197.408-440-440 0-242.656 197.376-440 440-440s440 197.344 440 440c0 242.592-197.376 440-440 440m0-944C228.672 7.68 2.592 233.696 2.592 511.68c0 277.888 226.08 504 504 504 277.92 0 504-226.112 504-504 0-277.952-226.08-504-504-504"
                  fill="#a9a9a9"
                  p-id="1735"
                ></path>
                <path
                  d="M534.144 489.664V201.216c0.032-0.32 0.224-0.576 0.224-0.896a32.224 32.224 0 0 0-64.448-2.56c0 0.512 0.224 0.896 0.224 1.376v316c-0.544 2.56-1.376 5.056-1.248 7.776 0.64 16.288 13.376 28.736 29.152 30.272 0.992 0.128 1.824 0.64 2.88 0.704 0.224 0 0.416-0.128 0.672-0.128 0.256 0 0.448 0.128 0.704 0.128 0.32-0.032 0.576-0.224 0.896-0.224H823.68c0.48 0 0.864 0.224 1.344 0.224a32.256 32.256 0 0 0-2.528-64.448c-0.32 0-0.608 0.192-0.928 0.224h-287.36z"
                  fill="#a9a9a9"
                  p-id="1736"
                ></path>
              </svg>
              <span>每天{{ hospitalItem.bookingRule.releaseTime }}放号</span>
            </div>
          </div>
        </div>
        <div class="right">
          <img :src="hospitalItem.logoData" alt="医院logo" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 通过 type 引入类型接口
import type { HospitalItem } from "@/types/index";
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义示例
const props = defineProps<{
  hospitalItem: HospitalItem;
}>();

// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-home-card {
  margin-top: 15px;
  .el-card {
    min-width: 450px;
    cursor: pointer;
  }
  .content {
    color: #a9a9a9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      .top {
        font-size: 1.2rem;
        font-weight: 900;
        margin: 15px 0;
      }
      .bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 15px 0;
        .left {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 100px;
          svg {
            margin-right: 5px;
          }
        }
        .right {
          display: flex;
          flex-direction: row;
          align-items: center;
          svg {
            margin-right: 5px;
          }
        }
      }
    }
    .right {
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
```

#### 分页组件

##### 父亲组件

在`home/index.vue`组件中通过如下实现数据显示与传递：

```vue
<!-- 分页器 组件 -->
        <Pagination
          :page-no="pageNo"
          :page-size="pageSize"
          :page-total="pageTotalData"
          @change="handlePageChange"
          @size-change="handleSizeChange"
        />
......
<script setup lang="ts">
// 通过 type 引入类型接口
import type { HospitalItem, HospitalPageResponse } from "@/types/index";
// 导入分页器组件
import Pagination from "@/pages/home/pagination/index.vue";
// 导入 网络请求 API
import { reqHospital } from "@/api/home";
// 导入 onmounted()生命周期钩子
import { ref, onMounted } from "vue";
// 分页器当前页码
const pageNo = ref<number>(1);
// 分页器 1 页展示数量
const pageSize = ref<number>(10);
// 分页器 数据 总数量
const pageTotalData = ref<number>(0);
// 生命周期
onMounted(async () => {
  // 通过调用网络请求 API 接口获取已存在的医院数据
  getHospitalInfo();
  // console.log("获取到的医院数据：", hospHavedData);
});
// 获取已有医院的数据函数
const getHospitalInfo = async () => {
  const result = (await reqHospital(pageNo.value, pageSize.value)) as HospitalPageResponse;
  // 当从后台获取数据成功之后
  if (result.code === 200) {
    // 将获取到的医院数据给到 hasHospitalArr
    hasHospitalArr.value = result.data.content;
    // console.log("当前获取到的医院数据：", hasHospitalArr.value);

    // 将获取到的医院数据中的医院总数给到 pageTotalData
    pageTotalData.value = result.data.totalElements;
    console.log("当前获取到的医院数据：", pageTotalData.value);
  }
};
// 页码变更之后，子组件通过 emit 触发页码变更函数
const handlePageChange = (newPage: number) => {
  pageNo.value = newPage;
  // 重新网络请求数据更新
  getHospitalInfo();
};
// 每页显示数量变更之后，子组件通过 emit 触发每页显示数量变更函数
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  // 切换每页条数，重置为第一页
  pageNo.value = 1;
  // 重新网络请求数据更新
  getHospitalInfo();
};
</script>
```

> * 通过生命周期钩子`mounted`实现数据请求0延时；
> * 通过封装的`Axios`进行数据获取；
> * 通过`props`实现数据的父传子展示；

##### 儿子组件

分页器卡片组件的实际实现逻辑如下：

```vue
<template>
  <div class="page-home-pagination">
    <el-pagination
      :current-page="pageNo"
      :page-size="pageSize"
      :size="size"
      :disabled="disabled"
      :background="background"
      :page-sizes="[6, 8, 10]"
      layout="prev, pager, next, sizes,->,total"
      :total="pageTotal"
      :hide-on-single-page="singlepage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
// 通过 type 引入类型接口
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";
import type { ComponentSize } from "element-plus";
const size = ref<ComponentSize>("large");
const background = ref(true);
const singlepage = ref(true);
const disabled = ref(false);
// 每页条数切换
const handleSizeChange = (val: number) => {
  // 通知父组件修改pageSize
  emit("sizeChange", val);
};
// 页码切换
const handleCurrentChange = (val: number) => {
  // 通知父组件修改pageNo
  emit("change", val);
};

// Props定义示例 设定默认值
const props = withDefaults(
  defineProps<{
    pageNo: number;
    pageSize: number;
    pageTotal: number;
  }>(),
  {
    pageNo: 1,
    pageSize: 10,
    pageTotal: 0
  }
);
// 定义要抛出的事件
const emit = defineEmits(["change", "sizeChange"]);

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-home-pagination {
  margin-top: 15px;
  .el-pagination {
    margin-bottom: 15px;
  }
}
</style>			
```

> * 分页器组件通过`emit`将触发事件、对应数据传递给传递给父组件

#### 等级组件

##### 数据展示

`home`组件内的医院等级的获取放在`src/pages/home/level`组件内，并在本组件内实现数据的`v-for`渲染：

```vue
<template>
  <div class="page-home-level">
    <h1 class="hospital">医院</h1>
    <div class="level">
      <h1>等级：</h1>
      <ul class="level-list">
        <li class="active">全部</li>
        <li v-for="hospitalLevel in hospitalLevelArr" key="hospitalLevel.value">{{ hospitalLevel.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// 导入网络请求 API
import { reqHospitalLevelList } from "@/api/home";
// 导入类型定义
import type { ResponseData } from "@/types/api";
import type { HospitalLevelPageResponse } from "@/types/index";
// 引入网络请求后台网址参数常量
import { hospitalLevelDictCode } from "@/const/index";
// 响应式数据
let hospitalLevelArr = ref<HospitalLevelPageResponse>([]);
// 生命周期
onMounted(() => {
  // 通过网络请求获取医院等级数据
  getHospitalLevel();
});
// 获取医院等级 的函数
const getHospitalLevel = async () => {
  // 通过网络请求获取医院等级数据
  const result = (await reqHospitalLevelList(hospitalLevelDictCode)) as ResponseData<HospitalLevelPageResponse>;
  // 当获取的数据code为200时
  if (result.code === 200) {
    // 将后端获取到的数据给到hospitalLevel
    hospitalLevelArr.value = result.data;
    // console.log("当前获取的医院等级@@:", hospitalLevelArr.value);
  }
};
</script>
<style scoped lang="less">
.page-home-level {
  color: #a9a9a9;
  font-weight: 900;
  .hospital {
    margin: 10px 0;
  }
  .level {
    display: flex;
    margin-top: 15px;
    h1 {
      width: 60px;
    }
    .level-list {
      display: flex;
      li {
        margin-right: 15px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
```

##### 动态类名

###### 基本逻辑

创建一个字符串`activeString=‘0’`，在等级全部默认状态下进行判断` :class="{ active: activeString === '0' }" `，其他等级使用`:class="{ active: activeString == hospitalLevel.value }"`进行判断，点击事件触发`activeString.value = selectedItem;`：

* 初始状态，`activeString`为`0`，默认全部是被选中的；
* 渲染数据通过当前渲染对象数据中的唯一标识与`activeString`判断是否一致，一致挂载`active`类属性；
* 当点击事件触发之后，`activeString`被修改为对应渲染对象数据中的唯一标识；
* 数据变更，`vue3`进行重新渲染，基于第2条进行判断渲染；

###### 基本实现

`src/pages/home/level/index.vue`基于如下逻辑实现选中：

```vue
<template>
......
      <ul class="level-list">
        <li :class="{ active: activeString == '0' }" @click="activeString = '0'">全部</li>
        <li
          v-for="hospitalLevel in hospitalLevelArr"
          key="hospitalLevel.name"
          :class="{ active: activeString == hospitalLevel.value }"
          @click="changeActive(hospitalLevel.value)"
        >
          {{ hospitalLevel.name }}
        </li>
      </ul>
......
</template>
<script setup lang="ts">
......
let activeString = ref<string>("0");
......
// 点击后 更改 动态类名存储字符串内容
const changeActive = (selectedItem: string) => {
  // 将当前选中的 item 中的 value 存储在动态类名字符串变量，item.value 是唯一的
  activeString.value = selectedItem;
  // console.log("当前点击等级value@@:", activeString.value);
};
</script>

<style scoped lang="less">
......
    .level-list {
      display: flex;
      li {
        margin-right: 15px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
......
</style>
```

#### 地区组件

##### 数据展示

`home`组件内的医院等级的获取放在`src/pages/home/region`组件内，并在本组件内实现数据的`v-for`渲染：

```vue
<template>
  <div class="page-home-region">
    <div class="region">
      <h1>地区：</h1>
      <ul class="region-list">
        <li class="active">全部</li>
        <li v-for="regionItem in hospitalRegionArr" key="regionItem.id">{{ regionItem.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入生命周期函数onMounted
import { ref, onMounted } from "vue";
// 引入类型变量定义
import type { ResponseData } from "@/types/api";
import type { HospitalRegionPageResponse } from "@/types/hospital";
// 引入 网络请求 网址参数
import { provinceCode } from "@/const/index";
// 引入网络请求函数
import { reqHospitalRegionList } from "@/api/home/index";
// 响应式数据
const hospitalRegionArr = ref<HospitalRegionPageResponse>([]);
// 生命周期
onMounted(() => {
  getHospitalRegion();
});
// 获取医院区域数据的函数
const getHospitalRegion = async () => {
  const result = (await reqHospitalRegionList(provinceCode)) as ResponseData<HospitalRegionPageResponse>;
  // 当获取的数据code为200时
  if (result.code === 200) {
    // 将数据存入hospitalRegionArr
    hospitalRegionArr.value = result.data;
    // console.log("获取到的医院地区数据@@：", hospitalRegionArr.value);
  }
};
</script>
<style scoped lang="less">
.page-home-region {
  color: #a9a9a9;
  font-weight: 900;
  .region {
    display: flex;
    margin-top: 15px;
    h1 {
      margin-top: 10px;
      width: 69px;
    }
    .region-list {
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 15px;
        margin-top: 10px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
```

##### 动态类名

###### 基本逻辑

创建一个字符串`activeString=‘0’`，在等级全部默认状态下进行判断` :class="{ active: activeString === '0' }" `，其他等级使用`:class="{ active: activeString == hospitalRegion.value }"`进行判断，点击事件触发`activeString.value = selectedItem;`：

* 初始状态，`activeString`为`0`，默认全部是被选中的；
* 渲染数据通过当前渲染对象数据中的唯一标识与`activeString`判断是否一致，一致挂载`active`类属性；
* 当点击事件触发之后，`activeString`被修改为对应渲染对象数据中的唯一标识；
* 数据变更，`vue3`进行重新渲染，基于第2条进行判断渲染；

###### 基本实现

`src/pages/home/region/index.vue`基于如下逻辑实现选中：

```vue
<template>
......
      <ul class="region-list">
        <li :class="{ active: activeString === '0' }" @click="activeString = '0'">全部</li>
        <li
          v-for="hospitalRegion in hospitalRegionArr"
          key="hospitalRegion.id"
          :class="{ active: activeString == hospitalRegion.value }"
          @click="changeActive(hospitalRegion.value)"
        >
          {{ hospitalRegion.name }}
        </li>
      </ul>
......
</template>
<script setup lang="ts">
......
let activeString = ref<string>("0");
......
// 点击后 更改 动态类名存储字符串内容
const changeActive = (selectedItem: string) => {
  // 将当前选中的 item 中的 value 存储在动态类名字符串变量，item.value 是唯一的
  activeString.value = selectedItem;
  // console.log("当前点击等级value@@:", activeString.value);
};
</script>

<style scoped lang="less">
......
    .level-list {
      display: flex;
      li {
        margin-right: 15px;
        &.active {
          color: #5566cc;
        }
        &:hover {
          color: #5566cc;
          cursor: pointer;
        }
      }
    }
......
</style>
```

#### 智能筛选

##### 框架搭建

###### 后台参数

经过查询，后端服务器具备`page / limit / hosname / hostype / provinceCode / cityCode / districtCode`参数，除了`page / limit`是路径参数外，其他参数采用查询参数，为非必填项。

###### 查询参数

已在网络请求-路径管理-Home组件-动态筛选中更新最新代码，查询参数具有默认值，可自由搭配查询参数，再次不再重复介绍。

##### 主页组件

###### 等级组件

需要在`Level`组件触发点击事件时，将变量和事件通过`emit`传递给父亲`Home`组件：

```vue
<template>
  <div class="page-home-level">
    <h1 class="hospital">医院</h1>
    <div class="level">
      <h1>等级：</h1>
      <ul class="level-list">
        <li :class="{ active: activeString == '0' }" @click="handleSelected('0')">全部</li>
        <li
          v-for="hospitalLevel in hospitalLevelArr"
          key="hospitalLevel.name"
          :class="{ active: activeString == hospitalLevel.value }"
          @click="handleSelected(hospitalLevel.value)"
        >
          {{ hospitalLevel.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
......
// 定义子传父要抛出的事件
const emit = defineEmits(["changeLevel"]);
......
// 点击后 更改 动态类名存储字符串内容 + 触发点击事件传递给父组件进行重新加载医院清单数据
const handleSelected = (selectedItem: string) => {
  // 将当前选中的 item 中的 value 存储在动态类名字符串变量，item.value 是唯一的
  activeString.value = selectedItem;
  // console.log("当前点击等级value@@:", activeString.value);
  // 将目前已经被选中的等级字符串数据返回给父组件进行重新加载
  emit("changeLevel", selectedItem);
};
</script>
```

> 通过`emit`将数据传递给父组件，并触发父组件的`change-level`事件

###### 地区组件

需要在`Region`组件触发点击事件时，将变量和事件通过`emit`传递给父亲`Home`组件：

```vue
<template>
  <div class="page-home-region">
    <div class="region">
      <h1>地区：</h1>
      <ul class="region-list">
        <li :class="{ active: activeString === '0' }" @click="handleSelected('0')">全部</li>
        <li
          v-for="hospitalRegion in hospitalRegionArr"
          key="hospitalRegion.id"
          :class="{ active: activeString == hospitalRegion.value }"
          @click="handleSelected(hospitalRegion.value)"
        >
          {{ hospitalRegion.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
......
// 定义子传父要抛出的事件
const emit = defineEmits(["changeRegion"]);
......
// 点击后 更改 动态类名存储字符串内容
const handleSelected = (selectedItem: string) => {
  // 将当前选中的 item 中的 value 存储在动态类名字符串变量，item.value 是唯一的
  activeString.value = selectedItem;
  // console.log("当前点击地区value@@:", activeString.value);
  // 将目前已经被选中的地区字符串数据返回给父组件进行重新加载
  emit("changeRegion", selectedItem);
};
</script>
```

> 通过`emit`将数据传递给父组件，并触发父组件的`change-region`事件

###### 父亲组件

需要在`Home`组件中添加对应的触发事件和相关函数：

```vue
<template>
  <div class="page-wrap">
    ......
  <el-row>
      <el-col :span="20">
        <!-- 医院等级 组件 -->
        <Level @change-level="handleChangeLevel" />
        <!-- 医院地区 组件 -->
        <Regin @change-region="handleChangeRegion" />
        <!-- 医院卡片 组件 -->
        <div class="hospital-card">
          <Card class="card-item" v-for="item in hasHospitalArr" :key="item.id" :hospital-item="item" />
        </div>
        ......
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Home" });
// 通过 type 引入类型接口
import type { ResponseData } from "@/types/api";
import type { HospitalItem, HospitalPageResponse } from "@/types/index";
// 导入轮播图组件
import Carousel from "@/pages/home/carousel/index.vue";
// 导入搜索框+按钮组件
import Search from "@/pages/home/search/index.vue";
// 导入等级组件
import Level from "@/pages/home/level/index.vue";
// 导入地区组件
import Regin from "@/pages/home/region/index.vue";
// 导入医院卡片组件
import Card from "@/pages/home/card/index.vue";
// 导入分页器组件
import Pagination from "@/pages/home/pagination/index.vue";
// 导入 网络请求 API
import { reqHospitalNameList } from "@/api/home";
// 导入 onmounted()生命周期钩子
import { ref, onMounted } from "vue";
// import { ref, reactive, computed, watch, onMounted } from 'vue'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 已有医院数组存储 通过使用自定义的接口定义，可以在 v-for 中使用内部的id变量
const hasHospitalArr = ref<HospitalItem[]>([]);
// 分页器当前页码
const pageNo = ref<number>(1);
// 分页器 1 页展示数量
const pageSize = ref<number>(10);
// 分页器 数据 总数量
const pageTotalData = ref<number>(0);
// 医院 等级 字符串代码
const hospitalLevel = ref<string>("");
// 医院 地区 字符串代码
const hospitalRegion = ref<string>("");
......
// 获取已有医院的数据函数
const getHospitalInfo = async () => {
  const result = (await reqHospitalNameList(
    pageNo.value,
    pageSize.value,
    hospitalLevel.value,
    hospitalRegion.value
  )) as ResponseData<HospitalPageResponse>;
  // 当从后台获取数据成功之后
  if (result.code === 200) {
    // 将获取到的医院数据给到 hasHospitalArr
    hasHospitalArr.value = result.data.content;
    // console.log("当前获取到的医院数据：", hasHospitalArr.value);

    // 将获取到的医院数据中的医院总数给到 pageTotalData
    pageTotalData.value = result.data.totalElements;
    // console.log("当前获取到的医院数据：", pageTotalData.value);
  }
};
......
// 当用户点击医院等级后进行数据重新加载
const handleChangeLevel = (newLevel: string) => {
  // 如果用户点击的还是全部
  if (newLevel == "0") {
    // 判断当前显示是否是全部，如果不是全部，则显示全部
    if (hospitalLevel.value != "") {
      hospitalLevel.value = "";
      getHospitalInfo();
    }
  }
  // 如果用户点击的不是全部
  else {
    // 判断当前点击的与目前选中的是不是同一个，如果不是，则赋值并获取数据
    if (newLevel != hospitalLevel.value) {
      hospitalLevel.value = newLevel;
      getHospitalInfo();
    }
  }
};
// 当用户点击医院地区后进行数据重新加载
const handleChangeRegion = (newRegion: string) => {
  // 如果用户点击的还是全部
  if (newRegion == "0") {
    // 判断当前显示是否是全部，如果不是全部，则显示全部
    if (hospitalRegion.value != "") {
      hospitalRegion.value = "";
      getHospitalInfo();
    }
  }
  // 如果用户点击的不是全部
  else {
    // 判断当前点击的与目前选中的是不是同一个，如果不是，则赋值并获取数据
    if (newRegion != hospitalRegion.value) {
      hospitalRegion.value = newRegion;
      getHospitalInfo();
    }
  }
};
</script>
```

> 通过`emit`实现数据的子传父，并完成数据获取的重新渲染

#### 智能搜索

##### API 接口

`src/api/home/index.ts`创建API接口的网络请求地址：

```ts
// 引入网络请求接口
import request from "@/utils/request";
// 通过 type 引入类型接口
import type {
  ......
  SearchHospitalKeyWordPageResponse
} from "@/types/index";

// 通过枚举管理首页 home 模块的接口地址
enum API {
  ......
// 获取搜索框关键字 医院名查询 的接口地址
  SEARCH_HOSPITAL_KEYWORD_URL = "/hosp/hospital/findByHosname/"
}

// 搜索医院名称关键字
export const reqSearchHospitalKeyWord = async (hosname: string) => {
  const result = await request.get(API.SEARCH_HOSPITAL_KEYWORD_URL + `${hosname}`);
  return result.data as ResponseData<SearchHospitalKeyWordPageResponse>;
};
```

##### 改造组件

将通过`elment-plus`实现医院名称搜索功能：

```vue
<template>
  <div class="page-home-search">
    <div class="search-bar">
      <el-autocomplete
        v-model="searchKeyWord"
        :fetch-suggestions="keyWordSearch"
        :trigger-on-focus="false"
        clearable
        class="search-form"
        placeholder="请输入医院名称"
        @select="handleSelect"
        size="large"
      />
      <el-button type="primary" :icon="Search" size="large">搜索</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Search" });
import { Search } from "@element-plus/icons-vue";
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";
// 导入类型定义
import type { ResponseData } from "@/types/api";
import type { SearchHospitalKeyWordPageResponse } from "@/types/index";
// 导入网络请求函数
import { reqSearchHospitalKeyWord } from "@/api/home/index";
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOSPITAL } from "@/const/index";
// 用户输入的关键词
const searchKeyWord = ref<string>("");
// 用户输入关键字后进行后台数据获取
const keyWordSearch = async (keyWord: string, cb: any) => {
  // console.log("keyWord", keyWord);
  // 通过用户输入关键字后进行后台数据获取
  const result = (await reqSearchHospitalKeyWord(keyWord)) as ResponseData<SearchHospitalKeyWordPageResponse>;
  // 当返回数据的 code 为200时
  if (result.code == 200) {
    let showData = result.data.map((item) => {
      return {
        value: item.hosname,
        hoscode: item.hoscode
      };
    });
    // 搜索框下选内容的回调函数
    cb(showData);
  }
};
// 当用户选中搜索框下选项内容时被触发
const handleSelect = (item: Record<string, any>) => {
  // 通过路由跳转到医院详情页面 query: { hoscode }
  // console.log("点击的医院代码为：", item);
  router.push({ path: HOSPITAL.path + "/" + HOSPITAL.CHILDREN.DETAL.path, query: { hoscode: item.hoscode } });
};
</script>

<style scoped lang="less">
.page-home-search {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .search-bar {
    width: 600px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
</style>
```

#### 路由跳转

##### 实现逻辑

###### 引入路由

参考如下实现方式，引入`vue`的路由管理模块：

```ts
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
```

###### 引入常量

本案例的路由常量统一录入并管理，需要在需要的`vue组件`中引入相关的常量：

```ts
// 导入路由常量管理文件
import { HOSPITAL } from "@/const/index";
```

###### 跳转逻辑

通过路由自带的方法`push`实现：

```ts
// 通过路由跳转到医院详情页面 query: { hoscode }
  router.push({ path: HOSPITAL });
```

> 本案例采用对象方式实现调整，可实现路径`push`、参数`query`的设定

##### 检索跳转

###### 基本功能

此功能即为在搜索框只能搜索出模糊结果后，通过点击搜索结果进行跳转，目前只跳转到对应医院详情页面，待医院详情页面开发完毕后实现完整功能：

```vue
<template>
  <div class="page-home-search">
    <div class="search-bar">
      <el-autocomplete
        v-model="searchKeyWord"
        :fetch-suggestions="keyWordSearch"
        :trigger-on-focus="false"
        clearable
        class="search-form"
        placeholder="请输入医院名称"
        @select="handleSelect"
        size="large"
      />
      <el-button type="primary" :icon="Search" size="large">搜索</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
......
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOSPITAL } from "@/const/index";

// 当用户选中搜索框下选项内容时被触发
const handleSelect = (hoscode: string) => {
  // 通过路由跳转到医院详情页面 query: { hoscode }
  router.push({ path: HOSPITAL });
};
</script>
```

###### 跳转功能

经过使用`Pinia`状态管理功能后，可以实现跳转到医院详情页面：

```ts
......
// 当用户选中搜索框下选项内容时被触发
const handleSelect = (item: Record<string, any>) => {
  // 通过路由跳转到医院详情页面 query: { hoscode }
  // console.log("点击的医院代码为：", item);
  router.push({ path: HOSPITAL.path + "/" + HOSPITAL.CHILDREN.DETAL.path, query: { hoscode: item.hoscode } });
};
......			
```

> 通过传入`query`实现跳转到医院详情功能

##### 卡片跳转

###### 基本功能

此功能通过点击对应卡片进行跳转，目前只跳转到对应医院详情页面，待医院详情页面开发完毕后实现完整功能：

```vue
<template>
  <div class="page-home-card">
    <!-- 医院卡片 -->
    <el-card shadow="hover" @click="handleSelect(hospitalItem.hoscode)"></el-card>
   ......
  </div>
</template>

<script setup lang="ts">
......
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOSPITAL } from "@/const/index";
// 当用户点击时被触发
const handleSelect = (hoscode: string) => {
  // 通过路由跳转到医院详情页面
  router.push({ path: HOSPITAL });
};
</script>
```

###### 跳转功能

经过使用`Pinia`状态管理功能后，可以实现跳转到医院详情页面：

```ts
......
// 当用户点击时被触发
const handleSelect = (hoscode: string) => {
  // 通过路由跳转到医院详情页面
  router.push({ path: HOSPITAL.path + "/" + HOSPITAL.CHILDREN.DETAL.path, query: { hoscode: hoscode } });
  // console.log("点击的医院代码为：", hoscode);
};
......			
```

> 通过传入`query`实现跳转到医院详情功能

##### 头部跳转

此功能通过点击对应顶部的文字进行跳转，已经实现点击跳转到`home组件`的主页：

```vue
<template>
  <div class="page-top">
    <div class="content">
      <div class="left">
        <img src="../../assets/images/logo.png" alt="logo" />
        <p @click="handleSelect">尚医通 - 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p>帮助中心</p>
        <p>注册/登录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOME } from "@/const/index";
// 当用户点击时被触发
const handleSelect = () => {
  // 通过路由跳转到主页
  router.push({ path: HOME });
};
</script>
```

### 医院组件

在医院组件中，实际内部渲染的数据是通过`hoscode`传入的`query`，将后端获取的数据存储到`Pinia/Store`存储，供医院组件使用，医院相关的数据展示罗列到静态组件中，再次不多赘述。

#### 主页挂载

在主页面中将如下组件进行实际挂载，`src/pages/hospital/index.vue`实现如下：

```vue
<template>
  <div class="page-wrap">
    <!-- 左侧为菜单栏 -->
    <div class="left-menu">
      <Menu />
    </div>
    <!-- 右侧为内容展示区 -->
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称
defineOptions({ name: "Hospital" });
// 引入 菜单 子组件
import Menu from "./menu/index.vue";
// 引入路由和路由器
import { useRoute } from "vue-router";
const route = useRoute();

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onMounted } from "vue";
// 引入 Pinia Store
import { useHospitalDetailStore, useHospitalDepartmentStore } from "@/stores/index.ts";
// 获取医院详情的 Store
const useStore_HosDetail = useHospitalDetailStore();
// 获取医院部门的 Store
const useStore_HosDepartment = useHospitalDepartmentStore();
// 生命周期
onMounted(() => {
  // 获取当前网址中的 query 中的  hoscode 参数
  const hoscode = route.query.hoscode as string;
  // 页面挂载后即可获取 医院详情 Store 数据
  useStore_HosDetail.getHospitalDetailInfo(hoscode);
  // 页面挂载后即可获取 医院部门 Store 数据
  useStore_HosDepartment.getHospitalDepartment(hoscode);
});
</script>

<style scoped lang="less">
.page-wrap {
  display: grid;
  grid-template-columns: 1.5fr 8.5fr;
}
</style>
```

#### 导航组件

左侧的导航组件用于引导用户进行挂号操作，`src/pages/hospital/menu/index`实现如下：

```vue
<template>
  <div class="page-wrap">
    <el-menu :default-active="route.path" @select="handleSelect">
      <div class="menu-topTitle">
        <el-icon color="#58317B"><HomeFilled /></el-icon>
        <el-icon size="0.9rem"><DArrowRight /></el-icon>
        <span>医院信息</span>
      </div>
      <!-- 索引使用完整的路由路径，这样最方便，不用拼串，也可以直接跳转 -->
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.APPOINTMENT.path">
        <el-icon><Service /></el-icon>
        <span>预约挂号</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.DETAL.path">
        <el-icon><Finished /></el-icon>
        <span>医院详情</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.NOTICE.path">
        <el-icon><Bell /></el-icon>
        <span>预约须知</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.STOP_SERVICE.path">
        <el-icon><Timer /></el-icon>
        <span>停诊信息</span>
      </el-menu-item>
      <el-menu-item :index="HOSPITAL.path + '/' + HOSPITAL.CHILDREN.SEARCH_CANCEL.path">
        <el-icon><Switch /></el-icon>
        <span>查询取消</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Menu" });
// 引入路由 path 常量
import { HOSPITAL } from "@/const/router/index";

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// 导入路由组件
import { useRouter, useRoute } from "vue-router";
// 操作路由
const router = useRouter();
// 读取路由
const route = useRoute();

//引入 Pinia Store
import { useHospitalDoctorStore } from "@/stores/index";
const useDoctorStore = useHospitalDoctorStore();

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
// 点击菜单触发函数
const handleSelect = (key: string) => {
  // console.log(key, keyPath);
  // 控制进入预约挂号界面的初始化开发
  useDoctorStore.appointmentOption = "dct";
  // 使用 router 进行跳转
  router.push({
    path: key,
    query: {
      hoscode: route.query.hoscode,
      depcode: route.query.depcode,
      spccode: route.query.spccode
    }
  });
};
</script>

<style scoped lang="less">
.page-wrap {
  .menu-topTitle {
    margin-bottom: 10px;
  }
  .el-menu {
    min-width: 150px;
    .el-menu-item {
      margin-bottom: 10px;
    }
  }
}
</style>

```

> 通过`Pinia Store`实现页面的按需显示

#### 内容组件

##### 预约挂号

在内容组件的预约挂号页面`src/pages/hospital/content/appointment`的`index.vue`实现如下：

```vue
<template>
  <!-- 进入预约挂号--部门/科室 选择 -->
  <div v-if="useDoctorStore.appointmentOption == 'dpt'">
    <Home />
  </div>
  <!-- 进入预约挂号--医生 选择 -->
  <div v-if="useDoctorStore.appointmentOption == 'dct'">
    <DoctorSelect />
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Appointment" });

// 引入 医院科室 组件
import Home from "./home/index.vue";
import DoctorSelect from "./dctSelect/index.vue";
//引入 Pinia Store
import { useHospitalDoctorStore } from "@/stores/index";
const useDoctorStore = useHospitalDoctorStore();

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onMounted } from "vue";

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
onMounted(() => {
  // 进入此组件，即代表已进入部门页面
  useDoctorStore.appointmentOption = "dpt";
});
</script>

<style scoped lang="less"></style>

```

###### 预约主页

医院预约挂号的实现是通过类型定义、网络请求，数据展示实现的，在`src/pages/hospital/content/appointment/home`创建`index.vue`，核心实现如下：

```vue
<template>
  <div class="page-wrap">
    <!-- 医院预约前，对医院的详细介绍 -->
    <HospitalInfoShow />
    <!-- 医院科室 组件 -->
    <DepartmentSelect @handleSelectDep="handleClickDep" />
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Home" });

// 引入 医院信息展示 组件
import HospitalInfoShow from "./hspShow/index.vue";
// 引入 部门/科室 组件
import DepartmentSelect from "./dptSelect/index.vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'
// 导入路由组件
import { useRoute, useRouter } from "vue-router";
// 操作路由
const router = useRouter();
// 读取路由
const route = useRoute();

//引入 Pinia Store
import { useHospitalDoctorStore } from "@/stores/index";
const useDoctorStore = useHospitalDoctorStore();

// 引入类型定义
import type { HospitalDepartmentChildren } from "@/types/hospitalDepartment/index.ts";

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {});

// 当用户点击科室内的具体科室触发
const handleClickDep = (activeDep: any, childDep: HospitalDepartmentChildren) => {
  // console.log("当前路由：", route.path, "当前常量：", HOSPITAL.CHILDREN.APPOINTMENT.CHILDREN.APPOINTMENT_DETAIL.path); // /hospital/appointment   appointmentDetail

  // 路由跳转到具体 科室医生 预约网址
  router.push({
    path: route.path,
    query: {
      // 医院代号
      hoscode: activeDep.hoscode,
      // 科室代号
      depcode: activeDep.depcode,
      // 专科门诊代号
      spccode: childDep.depcode
    }
  });
  // 控制页面展示 选择科室内具体医生页面
  useDoctorStore.appointmentOption = "dct";
  // 测试数据
  // console.log("当前已选大科室：", activeDep, "；当前已选小科室", childDep);
};
</script>

<style scoped lang="less"></style>

```

###### 医院信息

将预约主页拆分为多个组件，其中如下为医院信息组件`appointment/home/hspShow`创建`index.vue`用于展示医院相关信息：

```vue
<template>
  <div class="page-wrap">
    <!-- 医院名称及等级 -->
    <div class="top">
      <div class="left">{{ useDetailStore.hospitalDetailInfo?.hosname }}</div>
      <div class="right">
        <el-icon color="orange"><Opportunity /></el-icon>
        <span>{{ useDetailStore.hospitalDetailInfo?.hostypeString }}</span>
      </div>
    </div>
    <!-- 医院 Logo + 相关详细路线指南和预约规则 -->
    <div class="bottom">
      <div class="left">
        <img :src="useDetailStore.hospitalDetailInfo?.logoData" alt="医院图标" />
      </div>
      <div class="right">
        <span class="title">挂号规则</span>
        <span class="content"
          >预约周期：{{ useDetailStore.hospitalDetailInfo?.bookingRule.cycle }}天 放号时间：{{
            useDetailStore.hospitalDetailInfo?.bookingRule.releaseTime
          }}
          停挂时间：{{ useDetailStore.hospitalDetailInfo?.bookingRule.stopTime }}</span
        >
        <span class="content">具体地址：{{ useDetailStore.hospitalDetailInfo?.address }}</span>
        <span class="content">规划路线：{{ useDetailStore.hospitalDetailInfo?.route }}</span>
        <span class="content"
          >退号时间：就诊前一工作日{{ useDetailStore.hospitalDetailInfo?.bookingRule.quitTime }}前取消</span
        >
        <span class="title">预约规则</span>
        <ul>
          <li v-for="(value, index) in useDetailStore.hospitalDetailInfo?.bookingRule.rule" :key="index">
            {{ value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "HospitalInfoShow" });
//引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useDetailStore = useHospitalDetailStore();
</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-primary;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      color: @color-text-primary;
      font-weight: 800;
      font-size: 1.35rem;
      margin-right: 5px;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
  .bottom {
    margin-top: 25px;
    display: grid;
    grid-template-columns: 10% 90%;
    .left {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .title {
        color: @color-text-primary;
        font-weight: 800;
      }
      .content {
        line-height: 1.5rem;
        margin-left: 10px;
      }
      ul {
        li {
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
```

###### 科室选择

将预约主页拆分为多个组件，其中如下为医院信息组件`appointment/home/dptSelect`创建`index.vue`用于展示部门选择信息：

```vue
<template>
  <div class="page-wrap">
    <el-row>
      <!-- 左侧部分 class='el-col-3' -->
      <el-col :span="3">
        <!-- 左侧的一级科室菜单 -->
        <el-menu
          text-color="#717171"
          :default-active="activeDepCode"
          active-text-color="black"
          @select="handleSelectLeftDepartment"
        >
          <!-- 子菜单科室名称 -->
          <el-menu-item v-for="deptArr in useStore_HosDepartment.hospitalDepartment" :index="deptArr.depcode">
            <span>{{ deptArr.depname }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <!-- 右侧部分 class='el-col-21' -->
      <el-col :span="21">
        <!-- 右侧的具体科室是通过当前是否有活跃一级科室决定的 -->
        <div v-if="activeDepCode" :key="activeDepCode">
          <!-- 展示当前选中的一级科室的名字 -->
          <h3 class="dept-title">{{ currentDept?.depname }}</h3>
          <!-- 渲染实际的子科室的名称 -->
          <div class="dept-child-list">
            <div
              class="dept-item"
              v-for="child in currentDept?.children"
              :key="child.depcode"
              @click="handleSelectRifhtDepartment(currentDept, child)"
            >
              {{ child.depname }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "DepartmentSelect" });
// 导入 医院部门的 Store
import { useHospitalDepartmentStore } from "@/stores";
const useStore_HosDepartment = useHospitalDepartmentStore();

// 引入 医院科室的类型定义
import type { HospitalDepartmentChildren } from "@/types/hospitalDepartment/index";
// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { computed, ref } from "vue";

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()
const emit = defineEmits<{
  handleSelectDep: [activeDep: any, childDep: any];
}>();

// 响应式数据
// const count = ref(0)
// const state = reactive({})
// 创建菜单中子菜单活跃挂载的类变量
let activeDepCode = ref<string>("");

// 计算属性
// const computedVal = computed(() => {})
// 通过 activeDepCode 是否有值计算当前被选中的一级科室 currentDept
const currentDept = computed(() => {
  return useStore_HosDepartment.hospitalDepartment?.find((item) => {
    return item.depcode === activeDepCode.value;
  });
});

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
// 当左侧 大部门大菜单 被选中
const handleSelectLeftDepartment = (key: string) => {
  // 用于菜单识别当前活跃子菜单标识
  activeDepCode.value = key;
};
// 当右侧 小部门菜单 被选中
const handleSelectRifhtDepartment = (activeDep: any, childDep: HospitalDepartmentChildren) => {
  // 测试数据
  // console.log("当前大科室：", activeDep, "；当前小科室", childDep);
  // 通过 emit 将触发事件传递给父组件
  emit("handleSelectDep", activeDep, childDep);
};
</script>

<style scoped lang="less">
.page-wrap {
  margin: 20px 0;
  color: @color-text-regular;
  .el-row {
    .el-col-3 {
      .el-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-menu-item {
          padding: 0 30px;
          &:hover {
            color: @color-text-primary;
          }
        }
      }
    }
    .el-col-21 {
      padding-left: 15px;
      h3 {
        @color-bg-page: #f8f8f8;
        line-height: 2.5rem;
        font-weight: 800;
      }
      .dept-child-list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        line-height: 2rem;
        div {
          margin: 10px 0;
          &:hover {
            color: @color-text-hoverMainColor;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

```

###### 预约医生

医院预约医生的实现是通过类型定义、网络请求，数据展示实现的，在`appointment/dctSelect`创建`index.vue`，核心实现如下：

```vue
<template>
  <div class="page-wrap">
    <div class="top-content">
      <div class="hspInfo">
        <p class="hspName">{{ hspDptDctInfo.hopName }}</p>
        <svg
          t="1790926337417"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5986"
          width="16"
          height="16"
        >
          <path
            d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
            p-id="5987"
            fill="#515151"
          ></path>
        </svg>
        <p class="dptName">{{ hspDptDctInfo.depName }}</p>
        <svg
          t="1790926255554"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4876"
          width="16"
          height="16"
        >
          <path
            d="M516.266667 430.933333c-46.634667 0-85.333333 38.698667-85.333334 85.333334 0 46.592 38.698667 85.333333 85.333334 85.333333 46.592 0 85.333333-38.741333 85.333333-85.333333 0-46.634667-38.741333-85.333333-85.333333-85.333334z"
            p-id="4877"
            fill="#515151"
          ></path>
        </svg>
        <p class="spcName">{{ hspDptDctInfo.spcName }}</p>
      </div>
    </div>
    <div class="middle-content">
      <div class="currentDate">{{ getCurrentYearMonth() }}</div>
      <div class="card-wrap">
        <div
          class="dataCard"
          v-for="cardItem in pageCardList"
          :key="cardItem.workDate"
          @click="selectCard = cardItem"
          :class="{ active: selectCard?.workDate === cardItem.workDate }"
        >
          <div class="itemData">{{ cardItem.workDate }} {{ cardItem.dayOfWeek }}</div>
          <div class="itemNote">{{ cardItem.tipText }}</div>
        </div>
      </div>
      <div class="pagination-block">
        <el-pagination
          layout="prev, pager, next"
          :current-page="paginationValue.currentPage"
          :page-sizes="paginationValue.limit"
          :total="paginationValue.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="bottom-content">
      <div class="morning-tickets" v-if="selectCard?.scheduleList?.filter((item) => item.workTime === 0).length">
        <div class="time-tickets">
          <svg
            t="1790928595007"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9613"
            width="20"
            height="20"
          >
            <path
              d="M512 423.253333c17.749333 0 32.085333-15.701333 32.085333-34.816V240.981333l-4.096-59.392 29.354667 33.450667 49.834667 49.834667c6.144 5.461333 13.653333 8.874667 21.845333 8.874666 15.701333 0 27.306667-10.922667 27.306667-26.624 0-8.192-2.730667-14.336-9.557334-21.162666L533.845333 112.64c-8.192-7.509333-14.336-10.24-21.845333-10.24-7.509333 0-12.970667 2.730667-21.845333 10.24L365.909333 226.645333c-6.826667 6.144-9.557333 12.288-9.557333 20.48 0 15.701333 10.922667 26.624 27.306667 26.624 7.509333 0 15.701333-3.413333 21.162666-8.874666l53.930667-53.248 25.258667-29.354667-4.778667 58.709333v146.773334c0 19.797333 15.701333 35.498667 32.768 35.498666z m206.165333 107.178667c12.970667 12.288 34.133333 12.288 48.469334-2.048l69.632-68.266667c15.018667-14.336 14.336-34.816 1.365333-47.104a33.655467 33.655467 0 0 0-47.786667 1.365334l-69.632 68.266666c-14.336 15.018667-14.336 36.181333-2.048 47.786667z m-412.330666 0c12.288-12.288 12.288-32.768-2.730667-47.786667l-69.632-68.266666c-15.018667-14.336-35.498667-13.653333-47.786667-1.365334-12.288 12.288-12.288 32.768 2.730667 47.104l69.632 68.266667c14.336 14.336 35.498667 15.018667 47.786667 2.048zM34.816 921.6h954.368c19.114667 0 34.816-14.336 34.816-32.085333 0-17.066667-15.701333-31.402667-34.816-31.402667h-300.373333c27.306667-36.181333 41.642667-79.872 41.642666-124.928 0-118.101333-99.669333-215.722667-218.453333-215.722667-119.466667 0-218.453333 97.621333-218.453333 215.722667 0 47.104 15.018667 89.429333 41.642666 124.928H34.816c-19.114667 0-34.816 14.336-34.816 31.402667 0 17.749333 15.701333 32.085333 34.816 32.085333z m322.901333-187.733333c0-83.285333 69.632-151.552 154.282667-151.552s154.282667 68.266667 154.282667 151.552c0 50.517333-25.941333 96.938667-68.266667 124.928H425.984c-42.325333-28.672-68.266667-75.093333-68.266667-124.928z m-271.018666 21.845333h98.304c20.48 0 36.181333-14.336 36.181333-32.085333-0.682667-17.749333-15.018667-32.085333-36.181333-32.085334H86.698667c-20.48 0-35.498667 14.336-35.498667 32.085334s15.018667 32.085333 35.498667 32.085333z m752.981333 0h98.304c20.48 0 35.498667-14.336 35.498667-32.085333s-15.018667-32.085333-35.498667-32.085334H839.68c-20.48 0-36.181333 14.336-36.181333 32.085334 0.682667 17.749333 15.018667 32.085333 36.181333 32.085333z"
              fill="#FF7F50"
              p-id="9614"
            ></path>
          </svg>
          <p>上午号源</p>
        </div>
        <div class="tickets-doctors">
          <div
            class="tickets-info"
            v-for="doctor in selectCard?.scheduleList.filter((item) => item.workTime === 0)"
            :key="doctor.id"
          >
            <div class="content">
              <div class="left">
                <div class="doctor">
                  <div class="title">{{ doctor.title }}</div>
                  <svg
                    t="1790926337417"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5986"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
                      p-id="5987"
                      fill="#515151"
                    ></path>
                  </svg>
                  <div class="name">{{ doctor.docname }}</div>
                </div>
                <div class="info">
                  <p class="price">{{ doctor.skill }}</p>
                </div>
              </div>
              <div class="right">
                <div class="left">
                  <p class="price">￥{{ doctor.amount }}</p>
                </div>
                <div class="right">
                  <el-button
                    :type="doctor.availableNumber <= 0 ? 'info' : 'primary'"
                    :disabled="doctor.availableNumber <= 0"
                    >剩余 {{ doctor.availableNumber }}</el-button
                  >
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider />
            </div>
          </div>
        </div>
      </div>
      <div class="afternoon-tickets" v-if="selectCard?.scheduleList?.filter((item) => item.workTime === 1).length">
        <div class="time-tickets">
          <svg
            t="1790928615849"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10784"
            width="20"
            height="20"
          >
            <path
              d="M981.333333 896a42.666667 42.666667 0 0 1 0 85.333333H42.666667a42.666667 42.666667 0 0 1 0-85.333333h938.666666z m-469.333333-384a256 256 0 0 1 255.829333 246.4L768 768a42.666667 42.666667 0 0 1-85.333333 0 170.112 170.112 0 0 0-50.005334-120.661333A170.112 170.112 0 0 0 512 597.333333a170.112 170.112 0 0 0-120.661333 50.005334 170.112 170.112 0 0 0-49.706667 110.634666L341.333333 768a42.666667 42.666667 0 0 1-85.333333 0 256 256 0 0 1 256-256z m-384 213.333333a42.666667 42.666667 0 0 1 0 85.333334H42.666667a42.666667 42.666667 0 0 1 0-85.333334h85.333333z m853.333333 0a42.666667 42.666667 0 0 1 0 85.333334h-85.333333a42.666667 42.666667 0 0 1 0-85.333334h85.333333zM210.304 405.973333l60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667 60.330667L149.973333 466.346667a42.666667 42.666667 0 1 1 60.330667-60.330667z m663.722667 0a42.666667 42.666667 0 0 1 0 60.330667l-60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667 0zM512 42.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v195.669334l108.202666-108.202667a42.666667 42.666667 0 0 1 60.330667 60.330667l-181.034667 181.034666-3.498666 3.114667-0.256 0.213333a42.624 42.624 0 0 1-1.92 1.450667l-1.621334 1.066667-0.512 0.341333a38.997333 38.997333 0 0 1-8.746666 4.096 42.538667 42.538667 0 0 1-1.152 0.384l-1.365334 0.384-1.194666 0.298667-1.28 0.256a42.752 42.752 0 0 1-1.109334 0.213333l-1.450666 0.256-1.066667 0.128-0.981333 0.128a42.88 42.88 0 0 1-1.493334 0.085333l-1.706666 0.085334h-1.664l-1.664-0.085334-1.493334-0.085333-0.981333-0.128a42.666667 42.666667 0 0 1-1.152-0.128l-1.365333-0.256a70.656 70.656 0 0 1-3.498667-0.768 42.581333 42.581333 0 0 1-2.602667-0.768l-0.768-0.256a40.362667 40.362667 0 0 1-6.4-2.944l-1.024-0.554667a42.368 42.368 0 0 1-0.554666-0.341333l-0.512-0.341333a46.08 46.08 0 0 1-1.962667-1.28l-1.792-1.408-0.042667-0.042667v0.042667l-0.341333-0.298667-0.554667-0.426667-2.602666-2.432L300.8 233.130667A42.666667 42.666667 0 0 1 361.130667 172.8L469.333333 281.002667 469.333333 85.333333a42.666667 42.666667 0 0 1 42.666667-42.666666z"
              fill="#FF7F50"
              p-id="10785"
            ></path>
          </svg>
          <p>下午号源</p>
        </div>
        <div class="tickets-doctors">
          <div
            class="tickets-info"
            v-for="doctor in selectCard?.scheduleList.filter((item) => item.workTime === 1)"
            :key="doctor.id"
          >
            <div class="content">
              <div class="left">
                <div class="doctor">
                  <div class="title">{{ doctor.title }}</div>
                  <svg
                    t="1790926337417"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5986"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
                      p-id="5987"
                      fill="#515151"
                    ></path>
                  </svg>
                  <div class="name">{{ doctor.docname }}</div>
                </div>
                <div class="info">
                  <p class="price">{{ doctor.skill }}</p>
                </div>
              </div>
              <div class="right">
                <div class="left">
                  <p class="price">￥{{ doctor.amount }}</p>
                </div>
                <div class="right">
                  <el-button
                    :type="doctor.availableNumber <= 0 ? 'info' : 'primary'"
                    :disabled="doctor.availableNumber <= 0"
                    >剩余 {{ doctor.availableNumber }}</el-button
                  >
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "DoctorSelect" });

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref, onMounted, reactive, computed, watch } from "vue";

// import { useRouter } from 'vue-router'
import { useRoute } from "vue-router";
const route = useRoute();

// 引入 网络请求
import { reqHospitalDetailInfo, reqHospitalDepartmentInfo } from "@/api/hospital/index";
import { reqDoctorSchedule } from "@/api/doctorSchedule/index";

// 引入医生排班生成工具
import { doctorsScheduleMethods } from "@/utils/doctorsSchedule";
// 引入日期处理工具
import { getCurrentYearMonth } from "@/utils/dateFormatter";

// 引入数据类型定义
import type { HospitalDetailItem } from "@/types/hospitalDetail/index";
import type { HospitalDepartmentPageResponse } from "@/types/hospitalDepartment/index";
import type { DoctorsScheduleItems, ScheduleCard, ScheduleArr } from "@/types/doctorSchedule/index";
import type { ResponseData } from "@/types/api";
// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 医院，科室，医生相关信息
let hspDptDctInfo = reactive({
  // 医院名称
  hopName: "",
  // 科室名称
  depName: "",
  // 专科名称
  spcName: ""
});

// 分页器相关参数
let paginationValue = reactive({
  // 当前页面 1
  currentPage: 1,
  // 每页展示5个日期卡片
  pageSize: 5,
  // 每页条数
  limit: [5],
  // 总页数
  total: 0
});

// 需要展示的数据数组 核心数据组
let scheduleArr = ref<ScheduleArr>([]);

// 选中卡片内的数据
let selectCard = ref<ScheduleCard>();

// 计算属性
// const computedVal = computed(() => {})
// slice 切片，取出当前页的 5 条卡片
const pageCardList = computed(() => {
  // 当前数组为空，则返回空数组
  if (!scheduleArr.value) return [];
  // 计算切片的起始下标
  const startIndex = (paginationValue.currentPage - 1) * paginationValue.pageSize;
  // 计算切片的结束下标
  const endIndex = startIndex + paginationValue.pageSize;
  // 返回切片数据
  return scheduleArr.value.slice(startIndex, endIndex);
});

// 监听 由于Vue是异步执行，所以，路由参数不能即可生成，所以在初始化时，可能无法一次性执行完，通过 watch 监控进行初始化
watch(
  () => [route.query.hoscode, route.query.depcode, route.query.spccode],
  () => {
    initData();
  }
);

// 生命周期
onMounted(() => {
  // 创建组件后立即执行数据初始化函数
  initData();
});
// 数据初始化 执行函数
const initData = () => {
  const routeQuery = {
    hoscode: route.query.hoscode as string,
    depcode: route.query.depcode as string,
    spccode: route.query.spccode as string
  };
  // 没有spccode不请求
  if (!routeQuery.spccode) return;

  // console.log("hoscode", routeQuery.hoscode, "depcode", routeQuery.depcode, "spccode", routeQuery.spccode);
  // 通过网络请求获取医院 科室 专科相关信息
  getHspDptDocInfo(routeQuery.hoscode, routeQuery.depcode, routeQuery.spccode);
  // 通过网络请求获取对应专科科室医生的排班情况
  getDoctorInfo(routeQuery.hoscode, routeQuery.spccode);
};
// 通过路由 query 查询医院相关信息
const getHspDptDocInfo = async (hoscode: string, depcode: string, spccode: string) => {
  // 通过网络请求获取医院名称
  const resultHsp: ResponseData<HospitalDetailItem> = await reqHospitalDetailInfo(hoscode);
  // 通过网络请求获取 科室 专科门诊名称
  const resultDepSec: ResponseData<HospitalDepartmentPageResponse> = await reqHospitalDepartmentInfo(hoscode);
  // 如果获取到的数据的code=200
  if (resultHsp.code == 200 && resultDepSec.code == 200) {
    // 获取医院名称
    hspDptDctInfo.hopName = resultHsp.data?.hosname;
    // 获取科室名称
    hspDptDctInfo.depName = resultDepSec.data.find((item) => item.depcode === depcode)?.depname ?? "";
    // 获取门诊名称 把所有一级的children合并成一个数组
    hspDptDctInfo.spcName =
      resultDepSec.data.flatMap((item) => item.children).find((child) => child.depcode === spccode)?.depname ?? "";
  }
};
// 获取医生的排班情况
const getDoctorInfo = async (hoscode: string, spccode: string) => {
  // 通过网络请求获取医生的排版情况
  const resultDct: ResponseData<DoctorsScheduleItems> = await reqDoctorSchedule(hoscode, spccode, 1, 80);
  // 如果获取到的数据的code=200
  if (resultDct.code == 200) {
    // 打印相关数据进行查看确认
    // console.log("处理前,排班数据：", resultDct.data);
    // 通过医生排班的处理工具处理后的数据
    scheduleArr.value = doctorsScheduleMethods.scheduleByWorkDate(resultDct.data);
    // console.log("处理后,排班数据：", scheduleArr.value);
    // 总卡片数量 = 处理完后的日期卡片数组长度
    paginationValue.total = scheduleArr.value.length;
    // 每次刷新数据重置页码到第一页
    paginationValue.currentPage = 1;
  }
};
// 分页器页码被改变
const handleCurrentChange = (val: number) => {
  // 将当前页码进行调整
  paginationValue.currentPage = val;
  // 通过网络请求获取对应专科科室医生的排班情况
};
</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;
  .top-content {
    .hspInfo {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      svg {
        margin: 0 5px;
      }
      p:hover,
      svg:hover {
        cursor: pointer;
        color: @color-text-hoverMainColor;
      }
    }
  }
  .middle-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .currentDate {
      font-weight: 800;
      margin: 10px 0;
    }
    .card-wrap {
      display: flex;
      flex-direction: row;
      gap: 15px;
      width: 100%;
      .dataCard {
        /* 过渡：0.3秒完成变换，缓动曲线 */
        transition: transform 0.3s ease;
        transform-origin: center;
        flex: 1;
        border: 1px solid @color-text-placeholder;
        .itemData {
          text-align: center;
          font-weight: 800;
          background-color: @color-text-placeholder;
          padding: 8px;
          transition: background-color 0.3s ease;
        }
        .itemNote {
          padding: 15px 0;
          text-align: center;
        }
        &:hover {
          /* 放大5%，改成1.1就是放大10% */
          transform: scale(1.1);
          .itemData {
            background: @color-bg-cardhover;
          }
        }
        &.active {
          .itemData {
            background-color: @color-bg-cardhover;
          }
        }
      }
    }
    .pagination-block {
      margin: 10px 0;
    }
  }
  .bottom-content {
    .morning-tickets,
    .afternoon-tickets {
      display: flex;
      flex-direction: column;
      .time-tickets {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
        font-weight: 800;
        svg {
          margin-right: 6px;
        }
      }
      .tickets-doctors {
        display: flex;
        flex-direction: column;
        .tickets-info {
          display: flex;
          flex-direction: column;
          .content {
            display: flex;
            flex-direction: row;
            .left {
              flex: 10;
              display: flex;
              flex-direction: column;
              .doctor {
                flex: 10;
                display: flex;
                flex-direction: row;
                .title {
                  color: @color-important;
                  font-weight: 800;
                  margin-bottom: 10px;
                }
                svg {
                  margin: 0 6px;
                }
              }
            }
            .right {
              flex: 2;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>

```

##### 医院详情

在内容组件的预约挂号页面`src/pages/hospital/content/detail`的`index.vue`实现如下：

```vue
<template>
  <div class="page-wrap-detail">
    <!-- 医院名称及等级 -->
    <div class="top">
      <div class="left">{{ useStore.hospitalDetailInfo?.hosname }}</div>
      <div class="right">
        <el-icon color="orange"><Opportunity /></el-icon>
        <span>{{ useStore.hospitalDetailInfo?.hostypeString }}</span>
      </div>
    </div>
    <!-- 医院 Logo + 相关详细路线指南 -->
    <div class="middle">
      <div class="left">
        <img :src="useStore.hospitalDetailInfo?.logoData" alt="医院图标" />
      </div>
      <div class="right">
        <span class="content">具体地址：{{ useStore.hospitalDetailInfo?.address }}</span>
        <span class="content">规划路线：{{ useStore.hospitalDetailInfo?.route }}</span>
      </div>
    </div>
    <!-- 医院介绍 -->
    <div class="bottom">
      <span class="title">医院介绍</span>
      <span class="content">{{ useStore.hospitalDetailInfo?.intro }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Detail" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();
</script>

<style scoped lang="less">
.page-wrap-detail {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      color: @color-text-primary;
      font-weight: 800;
      font-size: 1.35rem;
      margin-right: 5px;
    }
    .right {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
  .middle {
    margin-top: 25px;
    display: grid;
    grid-template-columns: 10% 90%;
    .left {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      gap: 10px;
      .title {
        color: @color-text-primary;
        font-weight: 800;
      }
      .content {
        line-height: 1.5rem;
        margin-left: 10px;
      }
      ul {
        li {
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
  .bottom {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .title {
      color: @color-text-primary;
      font-weight: 800;
    }
    .content {
      line-height: 1.5rem;
      margin-left: 10px;
    }
  }
}
</style>
```

##### 预约须知

在内容组件的预约挂号页面`src/pages/hospital/content/notice`的`index.vue`实现如下：

```vue
<template>
  <div class="page-wrap">
    <!-- 预约须知的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}预约挂号须知</div>
    </div>
    <!-- 预约须知的内容 -->
    <div class="content">
      <div class="tips-tip">为方便您早日就医康复，请您认真阅读预约挂号须知:</div>
      <div class="tips-title">一、预约实名制:</div>
      <div class="tips-content">
        统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证、护照）、性别、手机号码、社保卡号等基本信息。
      </div>
      <div class="tips-title">二、预约挂号:</div>
      <div class="tips-content">
        <div class="tips">按照北京市卫健委统一平台要求，预约挂号规则如下:</div>
        <div class="tips">在同一自然日，同一医院，同一科室，同一就诊单元，同一就诊人，可以预约最多1个号源;</div>
        <div class="tips">
          在同一自然周，同一就诊人，可以预约最多8个号源; 在同一自然月，同一就诊人，可以预约最多12个号源;
        </div>
        <div class="tips">在同一自然季度，同一就诊人，可以预约最多24个号源。</div>
      </div>
      <div class="tips-title">三、取消预约:</div>
      <div class="tips-content">
        已完成预约的号源，如需办理退号，至少在就诊前一工作日14:00前通过网站、微信公众号、114电话等平台预约渠道进行取消预约。
      </div>
      <div class="tips-title">四、爽约处理:</div>
      <div class="tips-content">
        <div class="tips">如预约成功后患者未能按时就诊且不办理取消预约号视为爽约，同一患者在自然年内爽约规则如下:</div>
        <div class="tips">累计爽约3次，自3次爽约日起，90天内不允许通过114平台进行预约挂号;</div>
        <div class="tips">累计爽约6次，自6次爽约日起，180天内不允许通过114平台进行预约挂号。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Notice" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();

</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    .tips-title {
      font-weight: 800;
    }
    .tips-content {
      line-height: 1.8rem;
    }
  }
}
</style>
```

##### 停诊信息

在内容组件的预约挂号页面`src/pages/hospital/content/stopService`的`index.vue`实现如下：

```vue
<template>
  <div class="page-wrap">
    <!-- 停诊信息的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}停诊信息</div>
    </div>
    <!-- 停诊信息的内容 -->
    <div class="content">
      <el-empty description="暂无信息" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "StopService" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();
</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
}
</style>
```

##### 查询取消

在内容组件的预约挂号页面`src/pages/hospital/content/searchCancel`的`index.vue`实现如下：

```vue
<template>
  <div class="page-wrap">
    <!-- 查询取消的标题 -->
    <div class="title">
      <div>{{ useStore.hospitalDetailInfo?.hosname }}查询取消信息</div>
    </div>
    <!-- 查询取消的内容 -->
    <div class="content">
      <el-empty description="暂无信息" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "SearchCancel" });
// 引入 Pinia Store
import { useHospitalDetailStore } from "@/stores/index";
const useStore = useHospitalDetailStore();
</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 1.35rem;
    margin-right: 5px;
  }
}
</style>
```

### 输入登录

登录组件是需要多个组件共享的，所以将登录组件注册为全局组件并通过状态管理进行显示或隐藏。

#### 全局注册

在`main.ts`中全局注册，核心代码如下：

```ts
......
// 引入根组件App
import App from "./App.vue";
// 引入全局组件- HospitalTop / HospitalBottom / Login，用于页面的顶部和底部
......
import Login from "@/components/Login/index.vue";
......
// 将 HospitalTop / HospitalBottom / Login 注册为全局组件
......
app.component("Login", Login);
```

#### 全局挂载

在`app.vue`中全局挂载，基本代码如下：

```vue
<template>
  <div class="container">
    <!-- 顶部全局组件 -->
    <HospitalTop />
    <!-- 中间的内容区域 -->
    <div class="content">
      <!-- 以下为通过 router 跳转部分 -->
      <router-view></router-view>
    </div>
    <!-- 底部全局组件 -->
    <HospitalBottom />
  </div>
  <!-- 全局登录组件 -->
  <Login />
</template>
......
```

#### 登录验证

在`src/componrnts/InputDialog/index.vue`中关于验证码获取与填写的核心代码如下：

```vue
<template>
  <div class="page-wrap">
    <div class="input">
      <el-input v-model="InputPhoneNumber" style="width: 280px" prefix-icon="User" placeholder="请输入手机号码" />
      <el-input v-model="InputVerifyCode" style="width: 280px" prefix-icon="Lock" placeholder="请输入手机验证码" />
      <el-button @click="handleGetCaptcha">获取验证码</el-button>
      <div class="user-login-button">
        <el-button type="primary" target="_blank" style="width: 280px" @click="handleUserLoginBtn">
          用户登录
        </el-button>
      </div>
    </div>
    <div class="scan">
      <p>微信扫码登录</p>
      <el-button type="danger" :icon="ChatDotRound" circle @click="handleChatClick" />
    </div>
  </div>
</template>
<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "InputDialog" });
import { ElMessage } from "element-plus";
// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { CaptchaItem } from "@/types/userLogin/index";
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入网络请求 验证码获取 API
import { reqLoginCapcha } from "@/api/user/index";
// 引入 Element-Plus 图标元素
import { ChatDotRound } from "@element-plus/icons-vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref,reactive } from "vue";

let disabled = ref<boolean>(false);
// 获取验证码按钮不可用倒计时
let captchaTimer = ref<number>(5);
// 表单内的数据变量
const ruleForm = reactive({
  phoneNumber: "",
  captchaCode: ""
});
// 点击 获取验证码 按钮
const handleGetCaptcha = async () => {
  if (verifyPhoneNumber(ruleForm.phoneNumber)) {
    try {
      const result = (await reqLoginCapcha(ruleForm.phoneNumber)) as ResponseData<CaptchaItem>;

      if (result.code == 200) {
        // 将获取到的 验证码 数据给到 InputVerifyCode
        ruleForm.captchaCode = result.data.code;
        ElMessage.success({
          message: "验证码发送成功",
          placement: "top",
          offset: 100
        });
        // 倒计时 5 秒 获取验证码按钮无法使用
        // 重置一下倒计时数值
        captchaTimer.value = 5;
        // 将获取 验证码 按钮的变量变为 true
        disabled.value = true;
        const timer = setInterval(() => {
          // 倒计时减一，直到为0时
          captchaTimer.value--;
          if (captchaTimer.value <= 0) {
            // 完成循环后清除定时器
            clearInterval(timer);
            // 重置一下倒计时数值
            captchaTimer.value = 5;
            // 将获取 验证码 按钮的变量变为 true
            disabled.value = false;
          }
        }, 1000);
      } else {
        ElMessage.success({
          message: result.message,
          placement: "top",
          offset: 100
        });
      }
    } catch (error: any) {
      // 响应拦截器 reject 后走到这里
      ElMessage.error({
        message: error.message || "获取验证码失败",
        placement: "top",
        offset: 100
      });
    }
  } else {
    ElMessage({
      message: "输入的手机号码格式不正确，请重新输入",
      placement: "top",
      offset: 100
    });
    ruleForm.phoneNumber = "";
  }
};
// 用户点击 登录按钮
const handleUserLoginBtn = async () => {};
</script>
......
```

> 暂未涉及前端的数据验证，此时后端具备验证功能，手机验证码采用后端返回的测试模式，非正常手机接收模式

#### 数据校验

当用户输入手机号码之后，虽然后端有数据校验，但是其前端任然需要进行校验，同时对验证码的录入也进行校验，`src/components/Login/InputDialog` 内的`index.vue`校验相关代码如下：

```vue
<script setup lang="ts">
......
let disabled = ref<boolean>(false);
// 获取验证码按钮不可用倒计时
let captchaTimer = ref<number>(5);
// 表单内的数据变量
const ruleForm = reactive({
  phoneNumber: "",
  captchaCode: ""
});

// 需要校验的表格别名
const ruleFormRef = ref<any>();
// 表单验证规则
const rules = {
  phoneNumber: [
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: any) => {
        if (!verifyPhoneNumber(value)) {
          return callback(new Error("手机号格式不正确"));
        }
        callback();
      }
    }
  ],
  captchaCode: [
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: any) => {
        // 使用引入的验证工具验证
        if (!verifyCaptchCode(value)) {
          return callback(new Error("验证码必须是6位数字"));
        }
        callback();
      }
    }
  ]
};

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
// 用户点击微信扫码登录 按钮
const handleChatClick = () => {
  userStore_Login.userLoginMethods_Input = false;
};
// 点击 获取验证码 按钮
const handleGetCaptcha = async () => {
  if (verifyPhoneNumber(ruleForm.phoneNumber)) {
    try {
      const result = (await reqLoginCapcha(ruleForm.phoneNumber)) as ResponseData<CaptchaItem>;

      if (result.code == 200) {
        // 将获取到的 验证码 数据给到 InputVerifyCode
        ruleForm.captchaCode = result.data.code;
        ElMessage.success({
          message: "验证码发送成功",
          placement: "top",
          offset: 100
        });
        // 倒计时 5 秒 获取验证码按钮无法使用
        // 重置一下倒计时数值
        captchaTimer.value = 5;
        // 将获取 验证码 按钮的变量变为 true
        disabled.value = true;
        const timer = setInterval(() => {
          // 倒计时减一，直到为0时
          captchaTimer.value--;
          if (captchaTimer.value <= 0) {
            // 完成循环后清除定时器
            clearInterval(timer);
            // 重置一下倒计时数值
            captchaTimer.value = 5;
            // 将获取 验证码 按钮的变量变为 true
            disabled.value = false;
          }
        }, 1000);
      } else {
        ElMessage.success({
          message: result.message,
          placement: "top",
          offset: 100
        });
      }
    } catch (error: any) {
      // 响应拦截器 reject 后走到这里
      ElMessage.error({
        message: error.message || "获取验证码失败",
        placement: "top",
        offset: 100
      });
    }
  } else {
    ElMessage({
      message: "输入的手机号码格式不正确，请重新输入",
      placement: "top",
      offset: 100
    });
    ruleForm.phoneNumber = "";
  }
};
// 用户点击 登录按钮
const handleUserLoginBtn = async () => {
  // 如果需要验证的值有空的 则返回
  if (!ruleFormRef.value) return;
  try {
    // 输入验证全部通过后再执行
    await ruleFormRef.value.validate();
    // 只有全部校验成功，才走到这里
    console.log("书写网络请求的地方");
  } catch (error) {
    // 校验失败会进这里，不会执行上面的log
    ElMessage({
      message: "表单校验不通过:" + error,
      placement: "top",
      offset: 100
    });
  }
};
// 触发校验重置和输入框内容清空
const resetVerify = () => {
  // 清空校验提示内容和输入框内容
  ruleFormRef.value.resetFields();
};
// 把方法暴露给父组件
defineExpose({
  resetVerify
});
</script>
......
```

#### 数据重置

因为数据输入组件是在`Login/InputDialog/index.vue`内，窗口关闭是在`Login/index.vue`组件内，数据和方法不在同一个组件内，需要实现父亲组件按钮控制子组件方法，此处采用`defineExpose`方法实现，即在子组件中暴露组件方法，父组件执行此方法。

##### 组件定义

在子组件中通过如下方式进行方法定义与方法暴露：

```vue
// 触发校验重置和输入框内容清空
const resetVerify = () => {
  // 清空校验提示内容和输入框内容
  ruleFormRef.value.resetFields();
};
// 把方法暴露给父组件
defineExpose({
  resetVerify
});
```

##### 组件执行

在父组件中通过按钮绑定事件、`ref`定义组件别名、事件执行等流程方式实现父组件执行子组件方法：

```vue
<template>
......
<el-dialog
      v-model="userStore_Login.userLoginVisible"
      title="用户登录 - 尚医通"
      width="700"
      transition="dialog-slide"
      :before-close="handleClose"
    >
......
<div class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
        </div>
......
< /template>
<script setup lang="ts">
import { ref } from "vue";
// 定义 inputDialoy ref 名称
const inputDialogRef = ref<InstanceType<typeof InputDialog>>();
// 用户点击关闭按钮时触发
const handleClose = () => {
  // 将 Pinia Store 中的变量值修改为 fasle ，即 不可见
  userStore_Login.userLoginVisible = false;
  // 通过子组件方法暴露的方式实现对子组件方法的控制执行
  if (inputDialogRef.value) {
    // 调用输入框组件的数据校验重置方法
    inputDialogRef.value.resetVerify();
  }
};
```

> 此方法实际上，就是通过将组件`ref`绑定一个别名， 探后通过`ref.value.xxx`访问到子组件对应的`xxx`方法

#### 用户登录

##### 登录组件

在`src/components/Login/InutDialog/index.vue`文件中实现用户的登录操作，并将数据进行`Pinia Store`和`localStorage`：

```ts
......
// 用户点击 登录按钮
const handleUserLoginBtn = async () => {
  // 如果需要验证的值有空的 则返回
  if (!ruleFormRef.value) return;
  try {
    // 输入验证全部通过后再执行
    await ruleFormRef.value.validate();
    // 只有全部校验成功，才走到这里
    const result = (await reqLogin({
      phone: ruleForm.phoneNumber,
      code: ruleForm.captchaCode
    })) as ResponseData<ResLoginItem>;
    // 当返回的 code=200
    if (result.code === 200) {
      // console.log("用户信息：", result.data);
      // 将用户信息存储到 Pinia Store 变量内
      userStore_Login.setUserInfo(result.data);
      // 修改登录窗口显示与否变量，将窗口关闭
      userStore_Login.userLoginVisible = false;
      // 登录后即可清空相关数据
      resetVerify();
    }
  } catch (error) {
    // 校验失败会进这里，不会执行上面的log
    ElMessage({
      message: "表单校验不通过:" + error,
      placement: "top",
      offset: 100
    });
  }
};
......
```

##### 页眉组件

在`src/components/HospitalTop/index.vue`下的注册/ 登录相关功能部件区，实现用户登录后，显示用户数据及子菜单功能：

```vue
<template>
......
      <div class="right">
        <p class="help-tips"><span>帮助中心</span></p>
        <p class="login-register" v-if="!userStore_Login.isLogin">
          <span @click="userRegister">注册</span> / <span @click="userLogin">登录</span>
        </p>
        <p class="user-info" v-if="userStore_Login.isLogin">
          <el-icon><User /></el-icon>
          <el-dropdown
            placement="bottom-end"
            @command="handleCommand"
            :popper-options="{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 25] // [水平偏移, 垂直偏移]，12px 向下偏移
                  }
                }
              ]
            }"
          >
            <span class="el-dropdown-link">
              <span>{{ userStore_Login.userInfo?.name }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>实名认证</el-dropdown-item>
                <el-dropdown-item>挂号订单</el-dropdown-item>
                <el-dropdown-item>就诊管理</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </p>
      </div>
    </div>
  </div>
</template>
......
```

> 主要是根据用户是否登录显示不同的效果，自动切换

#### 用户退出

在用户已登录状态下，用户资料有下拉菜单，可以执行用户退出功能，具体实现如下：

```js
<script setup lang="ts">
// import { ref, reactive, computed, watch, onMounted } from 'vue'
// 导入路由并创建路由
import { useRouter } from "vue-router";
const router = useRouter();
// 导入路由常量管理文件
import { HOME } from "@/const/index";
// 引入Pinia Store 用户
import { useUserStore } from "@/stores/index";
const userStore_Login = useUserStore();
// 引入 utils 工具箱
import { userInfoMethods } from "@/utils/localStorage";
......
// 点击用户下拉菜单时的方法
const handleCommand = (command: string | number | object) => {
  // 当用户点击的是退出登录按钮时
  if (command == "logout") {
    // 清空本地持久化存储
    userInfoMethods.clearLocalStorage();
    // 清除 Pinia Store 存储的 用户数据 信息
    userStore_Login.userInfo = {
      name: "",
      token: ""
    };
    // 跳转到主页 类似于刷新页面
    router.push(HOME.path);
  }
};
</script>
```

### 扫码登录

#### 登录界面

需要将`src/components/Login/index.vue`中关于登录界面的挂载增加【关闭销毁】和将【v-show】更改为【v-if】：

```vue
<template>
  <div class="page-wrap">
    <!-- 登录界面主窗口 -->
    <el-dialog
      v-model="userStore_Login.userLoginVisible"
      title="用户登录 - 尚医通"
      width="700"
      transition="dialog-slide"
      :before-close="handleClose"
      destroy-on-close
    >
      <!-- 内容组件 -->
      <div class="content">
        <!-- 内容组件中 左侧部分 -->
        <div class="left">
          <!-- 左侧部分的 输入手机号登录 组件 -->
          <div v-show="userStore_Login.userLoginMethods_Input" class="input">
            <InputDialog ref="inputDialogRef" />
          </div>
          <!-- 左侧部分的 扫码登录 组件 -->
          <div v-if="!userStore_Login.userLoginMethods_Input" class="scan">
            <ScanDialog />
          </div>
        </div>
        <!-- 内容组件中 右侧部分 -->
        <div class="right">
          <FollowApp />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "Login" });
// 引入登录窗口小组件
import FollowApp from "./FollowApp/index.vue";
import InputDialog from "./InputDialog/index.vue";
import ScanDialog from "./ScanDialog/index.vue";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref } from "vue";

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 定义 inputDialoy ref 名称
const inputDialogRef = ref<InstanceType<typeof InputDialog>>();

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})

// 用户点击关闭按钮时触发
const handleClose = () => {
  // 将 Pinia Store 中的变量值修改为 fasle ，即 不可见
  userStore_Login.userLoginVisible = false;
  // 通过子组件方法暴露的方式实现对子组件方法的控制执行
  if (inputDialogRef.value) {
    // 调用输入框组件的数据校验重置方法
    inputDialogRef.value.resetVerify();
  }
};
</script>

<style scoped lang="less">
.page-wrap {
  .content {
    display: grid;
    grid-template-columns: 50% 50%;
    .left {
      border: 1px solid #f1f1f1;
    }
  }
}

// 弹窗出现动画
/* Slide Animation */
.dialog-slide-enter-active,
.dialog-slide-leave-active,
.dialog-slide-enter-active .el-dialog,
.dialog-slide-leave-active .el-dialog {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.dialog-slide-enter-from,
.dialog-slide-leave-to {
  opacity: 0;
}
.dialog-slide-enter-from .el-dialog,
.dialog-slide-leave-to .el-dialog {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
```

#### 扫码界面

需要将`src/components/Login/ScanDialog/index.vue`中增加方法：

```vue
<template>
  <div class="page-wrap">
    <div class="scan">
      <img v-if="qrDataUrl" :src="qrDataUrl" alt="扫码登录" style="width: 200px; height: 200px" />
      <p class="tip">{{ tipText }}</p>
    </div>
    <div class="input">
      <p>输入手机号码登录</p>
      <el-button type="info" :icon="EditPen" circle @click="handleChatClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "ScanDialog" });
// 引入路由
import { useRouter } from "vue-router";
const router = useRouter();
// 引入 Pinia Store 存储 定义对应变量名称
import { useUserStore } from "@/stores/index";
// 登录界面显示 / 隐藏的相关变量控制
const userStore_Login = useUserStore();
// 引入 Element-Plus 图标元素
import { EditPen } from "@element-plus/icons-vue";
// 引入 网络请求
import { reqWxQrcode, reqWxScanStatus } from "@/api/user";

// import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ref, onMounted, onUnmounted } from "vue";
// 响应式数据
const qrDataUrl = ref("");
const tipText = ref("请用微信扫描二维码");
let pollTimer: ReturnType<typeof setInterval> | null = null;
// 用户点击微信扫码登录 按钮
const handleChatClick = () => {
  userStore_Login.userLoginMethods_Input = true;
};
// 获取二维码
async function getQrcode() {
  try {
    const res = await reqWxQrcode();
    if (res.code === 200) {
      qrDataUrl.value = res.data.qrDataUrl;
      startPolling(res.data.uuid);
    }
  } catch (e) {
    console.error("获取二维码失败", e);
  }
}

// 轮询扫码状态
function startPolling(uuid: string) {
  stopPolling();
  pollTimer = setInterval(async () => {
    try {
      const res = await reqWxScanStatus(uuid);
      if (res.data.status === "done" && res.data.user) {
        stopPolling();
        tipText.value = "扫码成功，正在跳转...";
        // 存用户信息到 Pinia + localStorage
        userStore_Login.setUserInfo({
          token: res.data.token!,
          name: res.data.user.nickname
        });
        // 登录成功后 显示几秒钟之后再退出
        setTimeout(() => {
          // 关闭登录弹窗
          userStore_Login.userLoginVisible = false;
          // 跳转主页
          router.push("/");
        }, 100);
      } else if (res.data.status === "expired") {
        stopPolling();
        tipText.value = "二维码已过期，请刷新";
      }
    } catch (e) {
      console.error("轮询失败", e);
    }
  }, 2500);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
onMounted(() => {
  getQrcode();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped lang="less">
.page-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .scan {
    margin-top: 45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    P {
      margin-top: 10px;
    }
  }
  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin-top: 15px;
    }
    .el-button {
      margin-top: 10px;
    }
  }
}
</style>
```



