# 学习项目-尚医通

## 技术选型

- Vue3 + 组合式API
- Vite 构建工具
- TypeScript
- vue-router
- Pinia状态管理
- element-plus
- Axios 网络交互
- 后端：node.js+express+虚拟数据

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

**缺少 `vite-env.d.ts`** — 没有它，TS 不认识 `.vue` 模块，创建`vite-env.d.ts`:

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

找到`tsconfig.app.json`配置文件，找到配置项`compilerOptions`添加配置，这一步的作用是让 IDE 可以对路径进行智能提示：

```json
"paths": {
      "@/*": ["./src/*"]
    },
```

> 选项`baseUrl`已弃用，直接**删除 baseUrl**，paths 的值前面加上`./`。

### 后端服务

通过` AI `生成与教学一致的后端服务。

#### 技术路线

* node.js
* express

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

> 服务跑在 **http://localhost:8201**，前端 Vite 代理我已经帮你配好了（`web/vite.config.ts`）

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

### 网络请求

本案例使用`axios`实现网络请求功能，工具封装在`src/utils/request/index.ts`中。

#### 安装依赖

通过如下方式安装`axios`依赖：

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm i axios

added 29 packages in 7s

34 packages are looking for funding
  run `npm fund` for details
```

#### 简易封装

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
const service: AxiosInstance = axios.create({
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
service.interceptors.response.use( ... );

export default service;
```

> 最简易的封装，请求拦截和响应拦截参考如下

###### 请求拦截

简易的请求拦截器，不包含任何其他功能代码，后续会继续增加：

```ts
/**
 * 请求拦截器
 */
service.interceptors.request.use(
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
service.interceptors.response.use(
  (response) => {
    console.log(response);

    const res = response.data;
    // 业务成功
    if (res.code === 200) {
      console.log("恭喜，响应拦截器已生效，响应码:200");

      return res;
    } else {
      console.log(res.message || "业务失败");
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

#### 项目路由

该项目使用`vue-router`的路由方案。

##### 依赖安装

```bash
PS F:\CodingMan\Code2Git\01-Stu\03-FrontEnd\03-Vue_2_3\04-Vue_3-Mst\01-StudyProjectsPractical\syt-medical\web> npm i vue-router

added 34 packages in 12s

24 packages are looking for funding
  run `npm fund` for details
```

##### 创建路由

在`src/router`下创建`index.ts`文件，并创建2组路由：

```ts
import { createRouter, createWebHistory } from "vue-router";

// createRouter方法，用于创建路由器实例，可以管理多个路由
export default createRouter({
  // 路由模式设置
  history: createWebHistory(),
  // 管理路由
  routes: [
    {
      path: "/home",
      component: () => import("@/pages/home/index.vue")
    },
    {
      path: "/hospital",
      component: () => import("@/pages/hospital/index.vue")
    },
    {
      path: "/",
      redirect: "/home"
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

> 为了保证每次都会跳会最上部，增加了滚动跳行为，确保每次都能回到最初的上面的位置

##### 全局注册

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

##### 首页使用

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

## 静态组件

### Home组件

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
    <!-- 医院卡片 5 行 2 列-->
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">航天中心医院</div>
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
                  <span>三级乙等</span>
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
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">北京大学国际医院</div>
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
                  <span>二级乙等</span>
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
                  <span>每天07:00放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">北京市隆福医院</div>
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
                  <span>三级甲等</span>
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
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">北京市顺义区医院</div>
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
                  <span>三级乙等</span>
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
                  <span>每天00:00放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">北京中医药大学房山医院</div>
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
                  <span>二级乙等</span>
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
                  <span>每天22:00放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">首都医科大学附属北京天坛医院</div>
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
                  <span>三级甲等</span>
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
                  <span>每天09:30放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">首都医科大学附属北京安贞医院</div>
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
                  <span>三级乙等</span>
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
                  <span>每天09:15放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">首都医科大学宣武医院</div>
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
                  <span>二级乙等</span>
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
                  <span>每天14:00放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">首都医科大学附属北京同仁医院</div>
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
                  <span>三级甲等</span>
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
                  <span>每天08:45放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="content">
            <div class="left">
              <div class="top">首都医科大学附属北京儿童医院</div>
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
                  <span>二级乙等</span>
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
                  <span>每天14:00放号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <img src="../../../assets/images/logo.png" alt="" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"> </script>

<style scoped lang="less">
.page-home-card {
  margin-top: 15px;
  .el-row {
    margin-bottom: 15px;
    .el-col {
      border-radius: 4px;
      .el-card {
        cursor: pointer;
      }
    }
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

## 类型推导

### 基本定义

在`src/types`下创建类型推导`hospital.ts`和聚合函数`index.ts`文件，用于所有`ts`文件的类型推导模板，可以很快速的实现导入及使用。

### 核心代码

#### 聚合函数

`src/types/index.ts`文件中通过聚合导出所需的类型，实现对类型的统一管理：

```ts
export * from "./hospital";
// 以后新增其他类型直接在这里导出，比如字典、登录用户
```

#### 已有医院

从后端获取的已有医院数据`src/types/hospital.ts`，实际需要的部分进行类型定义：

```ts
// 单条医院数据类型
export interface HospitalItem {
  id: number;
  hosname: string;
  hostypeString: string;
  bookingRule: {
    releaseTime: string;
  };
}

// 后端分页返回整体结构
export interface HospitalPageResponse {
  code: number;
  data: {
    content: HospitalItem[];
    totalElements: number;
  };
}
```



## 动态组件

在静态组件、网络请求均已具备的情况下，可以将请求的数据与页面进行关联，实现动态数据的效果展示与互动。

### Home组件

#### 医院组件







#### 分页组件





