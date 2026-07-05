#### json-server使用教程

##### 基本介绍

`json-server` 是基于 Node.js 的**零代码本地 Mock 模拟接口工具**，仅依靠一个 JSON 文件，就能自动生成标准 RESTful 增删改查接口，无需编写后端代码、无需搭建数据库。

###### 核心优势

1. 零配置：仅需 JSON 数据文件，30 秒启动完整接口服务
2. 标准 REST 接口：自动支持 `GET/POST/PUT/PATCH/DELETE`
3. 内置查询能力：分页、筛选、排序、模糊搜索、多表关联
4. 持久化：POST/PUT/DELETE 操作自动修改 JSON 文件，数据永久保存
5. 热更新：监听 JSON 文件改动，无需重启服务
6. 轻量无依赖，前端开发、接口测试、项目演示通用

###### 适用场景

- 前后端分离开发：后端接口未完成，前端先行调试页面
- 本地测试、Demo 演示、自动化测试脚本
- 离线开发、无网络环境调试页面

###### 官方网址

地址：https://github.com/typicode/json-server

##### 安装说明

```bash
npm install json-server
```

##### 运行说明

###### 创建文件

创建db.json:

```json
{
  "$schema": "./node_modules/json-server/schema.json",
  "posts": [
    { "id": "1", "title": "a title", "views": 100 },
    { "id": "2", "title": "another title", "views": 200 }
  ],
  "comments": [
    { "id": "1", "text": "a comment about post 1", "postId": "1" },
    { "id": "2", "text": "another comment about post 1", "postId": "1" }
  ],
  "profile": {
    "name": "typicode"
  }
}
```

###### 启动项目

```bash
npx json-server db.json
```

> Index:
>
> http://localhost:3000/
>
> Endpoints:
>
> http://localhost:3000/posts
>
> http://localhost:3000/comments
>
> http://localhost:3000/profile

```bash
# --watch 监听文件变化，修改db.json自动刷新接口
# --port 指定端口，默认3000
json-server --watch db.json --port 3000
```

















