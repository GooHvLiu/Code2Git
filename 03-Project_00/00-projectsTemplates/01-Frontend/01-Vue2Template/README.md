### 前端模板

#### 版本说明

##### <span style="color:grey;font-family:楷体" >_July 21, 2026_</span>

- <span style="color:orange;font-family:楷体" >前端 Vue2.0 框架；</span>
- <span style="color:orange;font-family:楷体" >文件夹可以设定别名;</span>
- <span style="color:orange;font-family:楷体" >配置状态管理Vuex;</span>
- <span style="color:orange;font-family:楷体" >项目样式可采用 less 书写;</span>
- <span style="color:orange;font-family:楷体" >标配`reset.css`重置样式;</span>
- <span style="color:orange;font-family:楷体" >前端路由标配和自动挂载 UI 组件库；</span>
- <span style="color:orange;font-family:楷体" >支持服务器端口/局域网内是否可以访问/自动打开浏览器设置修改；</span>

#### 模板功能

##### 重置样式

已经安装并在`main.js`文件内加载了`reset-css`依赖：

```bash
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\00-Vue2Template> npm i reset-css

added 1 package in 1s

122 packages are looking for funding
  run `npm fund` for details
```

```js
// 加载reset-css
import "reset-css";
```

> 在`main.js`文件内已经引入依赖包

##### 服务配置

已经在`vue.config.js`文件内创建相关配置，具备端口设定功能；

```js
  devServer: {
    // 端口设定
    port: 8082,
    // 启动自动打开浏览器
    open: true,
    // 允许局域网其他设备访问本机项目
    host: "0.0.0.0"
  },
```

##### 样式转换

通常喜欢使用 less 书写样式的情况下，模板自带`样式转换`，需要`less-loader`转换依赖：

```bash
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\00-Vue2Template> npm i less-loader

added 17 packages in 2s

127 packages are looking for funding
  run `npm fund` for details

PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\00-Vue2Template> npm install less -D

up to date in 1s

127 packages are looking for funding
run `npm fund` for details
```

##### 文件别名

已经在`vue.config.js`文件内引入`alias`命别名功能，可以根据实际情况更改：

```js
  configureWebpack: {
    resolve: {
      alias: {
        // 可以根据项目实际情况配置文件路径
        "@": path.resolve(__dirname, "src"),
        "@api": path.resolve(__dirname, "src/api"),
        "@common": path.resolve(__dirname, "src/common"),
        "@components": path.resolve(__dirname, "src/components"),
        "@filters": path.resolve(__dirname, "src/filters"),
        "@mock": path.resolve(__dirname, "src/mock"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@router": path.resolve(__dirname, "src/router"),
        "@store": path.resolve(__dirname, "src/store"),
        "@public": path.resolve(__dirname, "public")
      }
    }
  }
```

##### 前端路由

已经在`main.js`中挂载并应用前端路由 vue-router：

```js
//全局挂载路由
import VueRouter from "vue-router";

//引入路由配置
import router from "@router/index.js";
```

并且在`src/router/index.js`中创建路由配置：

```js
// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import HelloWorld from "@components/HelloWorld.vue";
//创建并暴露一个路由器
export default new VueRouter({
  routes: [
    {
      name: "HelloWorld",
      path: "/test",
      component: HelloWorld
    },
    {
      path: "/",
      redirect: "/test"
    }
  ]
});
```

> 1. 临时使用路径为`path:"/test"`,名称为`name:"HelloWorld"`
>
> 2. 组件临时使用`HelloWorld.vue`；
>
> 3. 重定向和主页路径需要调整；

##### 状态管理

本模板`main.js`默认引入`状态管理工具Vuex`：

```js
import "reset-css";
import Vue from "vue";
import App from "./App.vue";

// 全局挂载路由
import VueRouter from "vue-router";

// 引入store
import store from "./store";

// 引入对应按需使用的插件名称
import { Button } from "element-ui";

// 引入路由配置
import router from "@router/index.js";

Vue.config.productionTip = false;
// 使用对应的路由
Vue.use(VueRouter);

// 使用对应的 UI库 插件
Vue.use(Button);

new Vue({
  render: (h) => h(App),
  store,
  router,
  beforeCreate() {
    Vue.prototype.$bus = this;
  }
}).$mount("#app");
```

在`src/store/index.js`:

```js
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
});
```

##### UI组件库

本模板`main.js`默认引入`element-ui`组件库的`Button`，并挂载到`App.vue`组件上：

```js
// 引入对应按需使用的插件名称
import { Button } from "element-ui";
// 使用对应的 Button 插件
Vue.use(Button);
```

##### 网络请求

###### axios安装

```bash
PS F:\CodingMan\Code2Git\03-Project_00\00-projectsTemplates\01-Frontend\01-Vue2Template> npm i axios
128 packages are looking for funding
  run `npm fund` for details
```

###### axios引入

本案例已经引入`axios`请求库，并创建`/src/common/request`下三个示例供使用：

```文本
request/
├── index.js          # 【核心：axios实例 + 请求/响应拦截器】
├── login.api.js      # 【业务接口：登录相关所有请求】
└── index.api.js      # 【汇总导出：统一入口，集中导出所有接口】
```

`index.js`的源代码：

```js
/**
 * axios实例 + 请求/响应拦截器
 */
import axios from "axios";
// 引入对应按需使用的插件名称
import { Message } from "element-ui";
const server = axios.create({
  baseURL: "/prod-api",
  timeout: 100000
});

// 请求拦截器
server.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token，字段需要根据实际情况修改
    const token = localStorage.getItem("nexCM-authorization-token");
    if (token) {
      // 主流后台格式 Authorization: Bearer xxx
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
server.interceptors.response.use(
  (res) => {
    // 响应如果不是200，则拦截器进行阻拦，可以减少主代码中的所有判断条件
    let res_data = res.data;
    if (res_data.code !== 200) {
      //此条是利用element ui组件之后具备的错误报警
      Message.error(res_data.msg);
      // 所有接收到的响应首先判断是不是false，如果是false，则直接return
      return false;
    }
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default server;

```

> 1. 请求拦截器配置有获取token并发送的功能
> 2. 响应拦截器配置有对响应回来的`code`进行判断，在主体使用中通过如下代码应用：
>
> ```JS
> if (!res) {
>     // 处理code!=200的逻辑
>     return;
> }
> // 以下都是code=200的逻辑，无需再次判断
> ```

`login.api.js`的源代码：

```js
import server from "./index";

// ESModule 向服务器 异步 获取 数据请求 获取验证码接口
export async function requestCaptchaCode() {
  const res = await server.get("/captchaImage");
  return res;
}
```

`index.api.js`的源代码：

```js
export { requestCaptchaCode } from "./login.api.js";
```

#### 模板使用

##### 项目名称

- 修改文件夹名称`Vue2Template`为项目名称`nexCM`;
- 修改项目内文件`package.json`内的项目名称为`nexCM`，共计 1 处；
- 修改项目内文件`package-lock.json`内的项目名称为`nexCM`，共计 2 处；

##### 项目资源

- 修改`public/favicon.ico`为项目图标；
- 修改`public/index.html`内的图标引用和项目文件名称；

##### 前端路由

根据实际情况创建组件并编辑路由规则：

```js
// 该文件专门用于创建整个应用的路由器
import VueRouter from "vue-router";
//引入组件
import HelloWorld from "@components/HelloWorld.vue";
//创建并暴露一个路由器
export default new VueRouter({
  routes: [
    {
      name: "HelloWorld",
      path: "/test",
      component: HelloWorld
    },
    {
      path: "/",
      redirect: "/test"
    }
  ]
});
```

> 1. 主要涉及到：`name`,`path`,`component`和组件引入关联
> 2. 重定向和主页路由地址需要调整

##### 安装依赖

进入项目文件夹`nexCM`，并执行`npm install`

```bash
PS F:\CodingMan\Code2Git\01-Stu\07-StuProject\nexM> npm i
added 931 packages in 17s

122 packages are looking for funding
  run `npm fund` for details
```

> 执行后自动读取`package.json`里所有 dependencies/devDependencies，下载生成全新`node_modules`文件夹

##### 启动服务

```bash
npm run serve
```
