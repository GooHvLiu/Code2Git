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

## 项目开发

### 项目框架

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

