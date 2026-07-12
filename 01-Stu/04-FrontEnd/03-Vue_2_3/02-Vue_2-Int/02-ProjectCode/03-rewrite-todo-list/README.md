# 03.03 前端项目

## 学习项目

### todoList

#### 前置要求

* 安装 Node.js（推荐 v14 /v16 稳定版，完美兼容 Vue2 脚手架），下载地址：[https://nodejs.org/](https://link.wtturl.cn/?target=https%3A%2F%2Fnodejs.org%2F&scene=im&aid=582478&lang=zh)

* 安装完成后打开 cmd / 终端，验证环境

  ```bash
  # 查看node版本
  node -v
  # 查看npm版本
  npm -v
  ```

#### 装脚手架

```bash]
# 全局安装@vue/cli
npm install -g @vue/cli
# 国内下载慢，使用淘宝镜像加速
npm install -g @vue/cli --registry=https://registry.npmmirror.com
```

> 验证是否成功：vue -V # 输出版本号 4.x.x 代表安装完成

#### 创建项目

```bash
PS F:\CodingMan\Code2Git\01-Stu\04-FrontEnd\03-Vue_2_3\02-Vue_2-Int\02-ProjectCode> vue create 03-rewrite-todo-list
Vue CLI v5.0.9
? Please pick a preset: Default ([Vue 2] babel, eslint)
? Pick the package manager to use when installing dependencies: NPM
Vue CLI v5.0.9
✨  Creating project in F:\CodingMan\Code2Git\01-Stu\04-FrontEnd\03-Vue_2_3\02-Vue_2-Int\02-ProjectCode\03-rewrite-todo-list.
⚙️  Installing CLI plugins. This might take a while...
added 832 packages in 18s
110 packages are looking for funding
  run `npm fund` for details
🚀  Invoking generators...
📦  Installing additional dependencies...
added 85 packages in 3s
122 packages are looking for funding
  run `npm fund` for details
⚓  Running completion hooks...
📄  Generating README.md...
🎉  Successfully created project 03-rewrite-todo-list.
👉  Get started with the following commands:
 $ cd 03-rewrite-todo-list
 $ npm run serve
PS F:\CodingMan\Code2Git\01-Stu\04-FrontEnd\03-Vue_2_3\02-Vue_2-Int\02-ProjectCode> 
```

> 1) 使用vue create projectsName创建项目文件夹
> 2) 使用npm包管理工具进行管理
