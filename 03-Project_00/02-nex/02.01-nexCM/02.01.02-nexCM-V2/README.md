# nexCM 管理系统

基于 Vue 2 + Element UI 的标准后台管理系统模板，开箱即用，适合快速搭建企业级中后台项目。

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 2.6.14 |
| UI 组件库 | Element UI | 2.15.14 |
| 状态管理 | Vuex | 3.6.2 |
| 路由 | Vue Router | 3.6.5 |
| HTTP 请求 | Axios | 1.19.0 |
| 国际化 | Vue I18n | 8.x |
| 样式 | Less + style-resources-loader | - |
| 构建工具 | Vue CLI 5 | - |

## 快速开始

### 环境要求

- Node.js >= 14
- npm >= 6

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run serve
```

默认访问地址：http://localhost:8082

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 目录结构

```
src/
├── api/                    # 接口层（按业务模块分文件）
│   ├── index.js            # API 统一出口
│   ├── login.js            # 登录/验证码/用户信息
│   ├── user.js             # 用户管理（示例模块）
│   ├── dict.js             # 数据字典
│   └── customer.js         # 预留示例
├── assets/                 # 静态资源
│   ├── icons/svg/          # SVG 图标（自动注册）
│   ├── images/             # 图片资源
│   └── styles/             # 全局样式
│       ├── variables.less  # Less 变量（颜色/间距/字号）
│       ├── mixin.less      # Less 混入
│       └── index.less      # 样式入口
├── components/             # 全局通用组件
│   ├── SearchForm/         # 搜索表单
│   ├── TableToolbar/       # 表格工具栏
│   ├── Pagination/         # 分页组件
│   ├── DictTag/            # 字典标签
│   ├── SvgIcon/            # SVG 图标
│   └── Breadcrumb/         # 面包屑
├── config/                 # 全局配置（所有不写死的都放这）
│   ├── index.js            # 聚合出口
│   ├── system.js           # 系统信息
│   ├── network.js          # 网络请求配置
│   ├── ui.js               # UI 配置（分页/侧边栏/动画）
│   └── messages.js         # 提示文案/校验文案/HTTP错误
├── directives/             # 自定义指令
│   ├── permission.js       # v-permission 权限控制
│   └── index.js            # 统一注册
├── filters/                # 全局过滤器
│   ├── date.filter.js      # 日期格式化
│   └── index.js            # 统一注册
├── i18n/                   # 国际化
│   ├── index.js            # i18n 实例
│   └── langs/
│       ├── zh-CN.js        # 中文
│       └── en-US.js        # 英文
├── Layout/                 # 布局组件
│   ├── index.vue           # 主布局
│   └── components/
│       ├── Sidebar/        # 侧边栏
│       ├── Navbar/         # 顶部导航
│       ├── TagsView/       # 标签页
│       └── AppMain/        # 内容区
├── mixins/                 # 公共混入
│   ├── resize.js           # 响应式检测
│   ├── table.js            # 表格通用逻辑
│   ├── dialog.js           # 弹窗通用逻辑
│   └── dict.js             # 字典数据加载
├── plugins/                # 插件
│   └── element.js          # Element UI 注册
├── router/                 # 路由
│   ├── index.js            # 路由实例
│   ├── constantRoutes.js   # 静态路由
│   ├── permission.js       # 路由守卫
│   ├── pathConstants.js    # 路径常量
│   ├── constants.js        # 路由常量
│   └── helper/             # 路由辅助
│       ├── menuHelper.js   # 菜单格式化
│       ├── routerHelper.js # 动态路由构建
│       └── componentsMap.js# 组件映射表
├── store/                  # Vuex 状态管理
│   ├── index.js
│   ├── getters.js
│   └── modules/
│       ├── app.js          # 侧边栏/设备
│       ├── user.js         # 用户信息/权限
│       ├── permission.js   # 路由权限
│       ├── tagsView.js     # 标签页
│       └── errorLog.js     # 错误日志
├── utils/                  # 工具函数
│   ├── request.js          # Axios 封装（含重试/取消）
│   ├── auth.js             # Token 存取
│   ├── storage.js          # 本地存储封装
│   ├── storageKey.js       # 存储 Key 常量
│   ├── validate.js         # 表单校验
│   ├── constants.js        # 业务码常量
│   ├── permission.js       # 权限判断工具
│   ├── dict.js             # 字典工具
│   ├── theme.js            # 主题切换
│   └── index.js            # 通用工具函数
├── views/                  # 页面
│   ├── login/              # 登录注册
│   ├── home/               # 首页
│   ├── profile/            # 个人中心
│   ├── error/404.vue       # 404
│   ├── redirect/           # 无刷新重载
│   └── system/user/        # 用户管理（示例模块）
├── settings.js             # 全局设置（UI开关）
├── App.vue
└── main.js
```

## 环境变量

### .env.development（开发环境）

```bash
# 接口基础路径（相对路径，走代理）
VUE_APP_BASE_API = '/prod-api/v2'
# 后端代理目标地址
VUE_APP_PROXY_TARGET = 'http://127.0.0.1:3002'
# 开发服务器端口
VUE_APP_PORT = 8082
# 页面标题
VUE_APP_TITLE = 'nexCM 管理系统'
```

### .env.production（生产环境）

```bash
# 接口基础路径（生产环境写后端完整地址）
VUE_APP_BASE_API = 'http://your-domain.com/api'
# 页面标题
VUE_APP_TITLE = 'nexCM 管理系统'
```

## 核心功能

### 1. 权限控制

- 路由级权限：动态路由，根据后端返回的菜单生成
- 按钮级权限：`v-permission` 指令，支持角色和权限码

```vue
<!-- 角色判断 -->
<el-button v-permission="['admin']">删除</el-button>
<!-- 权限码判断 -->
<el-button v-permission="'user:add'">新增</el-button>
<!-- JS 中判断 -->
if (this.$checkPermission(['admin', 'user:edit'])) { ... }
```

### 2. 标签页（TagsView）

- 多标签页切换，支持右键菜单（刷新/关闭/关闭其他/关闭左侧/关闭右侧/关闭全部）
- 状态持久化到 sessionStorage，刷新页面不丢失
- 配合 keep-alive 实现页面缓存

### 3. 请求封装

- 统一 Token 注入、业务码判断、错误提示
- 请求取消机制（路由切换自动取消未完成请求）
- 请求重试（网络错误和 5xx 自动重试 2 次）
- 白名单接口（无需 Token）

### 4. 国际化

- 支持中英文切换，语言偏好持久化
- 模板中 `{{ $t('common.confirm') }}`
- JS 中 `this.$t('common.confirm')`
- 切换语言：`this.$i18n.locale = 'en-US'`

### 5. 主题切换

- 基于 CSS 变量实现主题色切换
- `setThemeColor('#67c23a')` 切换主色调
- 主题偏好持久化到 localStorage

### 6. 数据字典

- 字典数据自动加载与缓存
- `DictTag` 组件渲染字典标签（带颜色）
- `dictMixin` 页面自动加载字典

### 7. 通用 Mixin

- `tableMixin`：表格搜索/分页/加载状态
- `dialogMixin`：弹窗显示/隐藏/表单重置/提交
- `dictMixin`：字典数据自动加载

## 新增业务模块步骤

以"订单管理"为例：

### 1. 新建 API 接口

```js
// src/api/order.js
import request from '@/utils/request'

export function requestGetOrderListApi(params) {
  return request({ url: '/order/list', method: 'get', params })
}
export function requestAddOrderApi(data) {
  return request({ url: '/order', method: 'post', data })
}
// ...
```

在 `src/api/index.js` 中添加：
```js
export * from './order'
```

### 2. 新建页面

```
src/views/order/
├── index.vue              # 列表页
└── components/
    └── OrderDialog.vue    # 新增/编辑弹窗
```

列表页参考 `src/views/system/user/index.vue` 的写法。

### 3. 后端配置菜单

在后端菜单管理中添加路由，前端动态路由会自动加载。

## 部署指南

### 1. 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 2. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /usr/share/nginx/html;
    index index.html;

    # 前端路由（hash 模式不需要此配置，history 模式需要）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 接口代理
    location /prod-api/ {
        proxy_pass http://backend-server:3002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 生产构建优化

已内置以下优化：
- 关闭 sourceMap
- 代码分包（vue/element-ui/其他第三方库单独打包）
- 去除 console.log 和 debugger
- 按需加载（路由懒加载）

## 常见问题

### Q: 如何修改系统名称？

修改 `.env.development` 和 `.env.production` 中的 `VUE_APP_TITLE`。

### Q: 如何修改主题色？

调用 `setThemeColor(color)` 函数，或修改 `src/settings.js` 中的 `themeColor`。

### Q: 如何添加新的语言包？

1. 在 `src/i18n/langs/` 下新建语言文件
2. 在 `src/i18n/index.js` 中引入并添加到 messages
3. 在 `LANGUAGES` 常量中添加选项

### Q: 如何关闭某个请求的重试？

在请求配置中添加 `retry: false`：
```js
request({ url: '/xxx', method: 'get', retry: false })
```

## License

MIT
