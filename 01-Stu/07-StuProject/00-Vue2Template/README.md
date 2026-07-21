### 项目模板

#### 模板功能

##### 版本说明

###### <span style="color:grey;font-family:楷体" >_July 21, 2026_</span>

- <span style="color:orange;font-family:楷体" >前端Vue2.0框架；</span>
- <span style="color:orange;font-family:楷体" >文件夹可以设定别名;</span>
- <span style="color:orange;font-family:楷体" >前端路由标配和自动挂载UI组件库；</span>
- <span style="color:orange;font-family:楷体" >支持服务器端口/局域网内是否可以访问/自动打开浏览器设置修改；</span>

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

已经在`main.js`中挂载并应用前端路由vue-router：

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
    }
  ]
});
```

> 1. 临时使用路径为`path:"/test"`,名称为`name:"HelloWorld"`
>
> 2. 组件临时使用`HelloWorld.vue`；

##### UI组件库

本模板`main.js`默认引入`element-ui`组件库的`Button`，并挂载到`App.vue`组件上：

```js
// 引入对应按需使用的插件名称
import { Button } from "element-ui";
// 使用对应的 Button 插件
Vue.use(Button);
```

#### 模板使用

##### 项目名称

* 修改文件夹名称`Vue2Template`为项目名称`nexM`;
* 修改项目内文件`package.json`内的项目名称为`nexM`，共计1处；
* 修改项目内文件`package-lock.json`内的项目名称为`nexM`，共计2处；

##### 项目资源

* 修改`public/favicon.ico`为项目图标；
* 修改`public/index.html`内的图标引用和项目文件名称；

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
    }
  ]
});
```

> 主要涉及到：`name`,`path`,`component`和组件引入关联

##### 安装依赖

进入项目文件夹`nexM`，并执行`npm install`

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

