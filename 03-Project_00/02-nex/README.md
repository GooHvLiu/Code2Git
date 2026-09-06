# nex 平台

## 基本信息

### 项目信息

|   项目概要   | 基本信息                        |
| :----------: | ------------------------------- |
| **项目名称** | nexCM 设备管理系统              |
| **项目版本** | v0.9.0                          |
| **项目描述** | 桌面式灌装加塞设备管理系统      |
| **后端端口** | 3000                            |
| **技术实现** | Vue3+Element UI+Express + MySQL |
| **项目作者** | GooHv                           |
| **Node版本** | >= 14.0.0                       |
| **NPM版本**  | >= 6.0.0                        |

### 项目简介

nexCM 是一套面向医疗设备行业的企业级设备综合管理系统，目前以桌面式灌装加塞设备设计为案例。系统采用前后端分离架构，前端基于 Vue 2 + Element UI 技术栈，提供基础数据及看板、设备管理、生产管理、系统管理、超级面板、通知中心、审计追踪等核心功能模块。

系统具有以下特点：

- **MVC 架构**：清晰的 Model-View-Controller 分层，代码结构清晰
- **RESTful API**：标准化的 RESTful 接口设计，易于前端对接
- **JWT 认证**：基于 JSON Web Token 的无状态认证机制
- **细粒度权限**：支持菜单、按钮、参数三级权限控制
- **数据校验**：基于 Joi 的参数校验，确保数据安全
- **模块化设计**：业务模块独立，易于扩展和维护

## 技术框架

### 后端框架

#### 核心框架

|    技术     |   版本    | 用途                             |
| :---------: | :-------: | -------------------------------- |
| **Node.js** | >= 14.0.0 | JavaScript 运行时环境            |
| **Express** |  4.18.2   | 轻量级 Web 应用框架              |
| **MySQL2**  |   3.6.5   | MySQL 数据库驱动（支持 Promise） |

#### 认证安全

| 技术             | 版本        | 用途                 |
| ---------------- | ----------- | -------------------- |
| **jsonwebtoken** | 9.0.3       | JWT Token 生成和验证 |
| **bcryptjs**     | 2.4.3       | 密码加密和验证       |
| **cors**         | 2.8.5       | 跨域资源共享         |
| **multer**       | 1.4.5-lts.1 | 文件上传处理         |
| **svg-captcha**  | 1.4.0       | 图形验证码生成       |

#### 数据校验

| 技术    | 版本   | 用途               |
| ------- | ------ | ------------------ |
| **Joi** | 18.2.3 | 数据校验和模式定义 |

#### PLC 通信

| 技术              | 版本    | 用途                    |
| ----------------- | ------- | ----------------------- |
| **modbus-serial** | 8.0.25  | Modbus RTU/TCP 协议通信 |
| **node-opcua**    | 2.177.0 | OPC UA 协议通信         |
| **node-snap7**    | 1.0.9   | Siemens S7 协议通信     |

#### 实时通信

| 技术   | 版本   | 用途               |
| ------ | ------ | ------------------ |
| **ws** | 8.21.3 | WebSocket 实时通信 |

#### 工具封装

| 技术              | 版本     | 用途                        |
| ----------------- | -------- | --------------------------- |
| **Axios**         | 1.19.0   | HTTP 请求库（调用外部接口） |
| **Day.js**        | 1.11.23  | 轻量级日期处理库            |
| **Lodash**        | 4.18.1   | 实用工具库                  |
| **Node Cache**    | 5.1.2    | 内存缓存                    |
| **UUID**          | 14.0.2   | 唯一标识符生成              |
| **Nodemailer**    | 9.1.0    | 邮件发送                    |
| **module-alias**  | 2.3.4    | 模块路径别名                |
| **dotenv**        | 16.3.1   | 环境变量加载                |
| **dotenv-expand** | 1000.0.0 | 环境变量展开                |

#### API 文档

| 技术                   | 版本  | 用途             |
| ---------------------- | ----- | ---------------- |
| **swagger-jsdoc**      | 6.3.0 | Swagger 文档生成 |
| **swagger-ui-express** | 5.0.1 | Swagger UI 展示  |

#### 开发工具

| 技术        | 版本   | 用途               |
| ----------- | ------ | ------------------ |
| **nodemon** | 3.0.2  | 开发时自动重启服务 |
| **jest**    | 29.7.0 | 单元测试框架       |

### 前端框架

#### 核心框架

|      技术      |  版本  | 用途                             |
| :------------: | :----: | -------------------------------- |
|    **Vue**     | 2.7.16 | 渐进式 JavaScript 框架，核心框架 |
| **Vue Router** | 3.6.5  | 官方路由管理器，页面路由         |
|    **Vuex**    | 3.6.2  | 官方状态管理模式，全局状态管理   |
|  **Vue I18n**  | 8.28.2 | 国际化插件，多语言支持           |

#### UI 组件库

| 技术                       | 版本    | 用途                      |
| -------------------------- | ------- | ------------------------- |
| **Element UI**             | 2.15.14 | 基于 Vue 2 的桌面端组件库 |
| **@morev/vue-transitions** | 2.3.6   | Vue 过渡动画组件          |
| **NProgress**              | 0.2.0   | 页面加载进度条            |
| **reset-css**              | 5.0.2   | CSS 重置样式              |

#### 数据可视

| 技术        | 版本  | 用途             |
| ----------- | ----- | ---------------- |
| **ECharts** | 6.1.0 | 数据可视化图表库 |

#### 工具封装

| 技术       | 版本    | 用途                                   |
| ---------- | ------- | -------------------------------------- |
| **Axios**  | 1.19.0  | HTTP 请求库，API 调用                  |
| **Day.js** | 1.11.21 | 轻量级日期处理库                       |
| **Lodash** | -       | 实用工具库（通过后端依赖，前端可使用） |

#### 文件处理

| 技术               | 版本   | 用途                       |
| ------------------ | ------ | -------------------------- |
| **jsPDF**          | 4.2.1  | PDF 生成库，导出 PDF       |
| **html2canvas**    | 1.4.1  | HTML 转 Canvas，截图       |
| **SheetJS (xlsx)** | 0.18.5 | Excel 文件处理，导出 Excel |

#### 开发工具

| 技术                       | 版本    | 用途                |
| -------------------------- | ------- | ------------------- |
| **@vue/cli-service**       | 5.0.0   | Vue CLI 构建服务    |
| **@vue/cli-plugin-babel**  | 5.0.0   | Babel 转码插件      |
| **@vue/cli-plugin-eslint** | 5.0.0   | ESLint 代码检查插件 |
| **Babel**                  | 7.12.16 | JavaScript 编译器   |
| **ESLint**                 | 7.32.0  | 代码质量检查工具    |
| **eslint-plugin-vue**      | 8.0.3   | Vue 代码检查插件    |
| **Husky**                  | 8.0.3   | Git 钩子工具        |
| **lint-staged**            | 13.2.3  | 暂存文件代码检查    |
| **less-loader**            | 13.0.0  | Less 样式预处理器   |
| **svg-sprite-loader**      | 6.0.11  | SVG 雪碧图加载器    |
| **style-resources-loader** | 1.5.0   | 样式资源自动注入    |
| **vue-template-compiler**  | 2.7.16  | Vue 模板编译器      |

## 项目架构

### 后端架构

#### 目录架构

```text
nexSM-V3/
├── src/
│   ├── config/                 # 配置文件
│   │   ├── index.js            # 全局配置
│   │   ├── database.js         # 数据库配置
│   │   ├── jwt.js              # JWT 配置
│   │   ├── email.js            # 邮件配置
│   │   ├── plc.js              # PLC 配置
│   │   └── ...                 # 其他配置
│   ├── constants/              # 常量定义
│   │   ├── errorCode.js        # 错误码定义
│   │   ├── statusCode.js       # 状态码定义
│   │   └── ...                 # 其他常量
│   ├── controllers/            # 控制器层（公共控制器）
│   │   ├── baseController.js   # 基础控制器
│   │   └── ...                 # 其他公共控制器
│   ├── db/                     # 数据库层
│   │   ├── index.js            # 数据库连接池
│   │   └── ...                 # 其他数据库相关
│   ├── middleware/             # 中间件
│   │   ├── auth.middleware.js  # 认证中间件
│   │   ├── error.middleware.js # 错误处理中间件
│   │   ├── audit.middleware.js # 审计日志中间件
│   │   ├── validate.middleware.js # 参数校验中间件
│   │   ├── dotenvInit.middleware.js # 环境变量初始化
│   │   └── ...                 # 其他中间件
│   ├── modules/                # 业务模块
│   │   ├── user/               # 用户管理模块
│   │   │   ├── user.controller.js # 控制器
│   │   │   ├── user.service.js    # 服务层
│   │   │   ├── user.model.js      # 模型层
│   │   │   ├── user.route.js      # 路由
│   │   │   └── user.validation.js # 参数校验
│   │   ├── role/               # 角色管理模块
│   │   ├── permission/         # 权限管理模块
│   │   ├── menu/               # 菜单管理模块
│   │   ├── dept/               # 部门管理模块
│   │   ├── dict/               # 字典管理模块
│   │   ├── config/             # 系统配置模块
│   │   ├── audit/              # 审计追踪模块
│   │   ├── notification/       # 通知中心模块
│   │   ├── email/              # 邮箱管理模块
│   │   ├── license/            # 授权管理模块
│   │   ├── device-part/        # 部件寿命管理模块
│   │   ├── plc/                # PLC 管理模块
│   │   ├── captcha/            # 验证码模块
│   │   ├── upload/             # 文件上传模块
│   │   ├── customer/           # 客户管理模块
│   │   └── ...                 # 其他业务模块
│   ├── plc/                    # PLC 通信层
│   │   ├── index.js            # PLC 管理器
│   │   ├── modbus.js           # Modbus 协议实现
│   │   ├── opcua.js            # OPC UA 协议实现
│   │   ├── s7.js               # S7 协议实现
│   │   ├── tagMap.js           # PLC 标签映射
│   │   └── ...                 # 其他 PLC 相关
│   ├── services/               # 公共服务层
│   │   ├── emailService.js     # 邮件服务
│   │   ├── notificationService.js # 通知服务
│   │   ├── auditService.js     # 审计服务
│   │   ├── cacheService.js     # 缓存服务
│   │   └── ...                 # 其他公共服务
│   ├── socket/                 # WebSocket 层
│   │   ├── index.js            # WebSocket 管理器
│   │   ├── deviceSocket.js     # 设备状态推送
│   │   ├── notificationSocket.js # 通知推送
│   │   └── ...                 # 其他 WebSocket 相关
│   └── utils/                  # 工具函数
│       ├── logger.js           # 日志工具
│       ├── response.js         # 响应封装
│       ├── jwt.js              # JWT 工具
│       ├── password.js         # 密码工具
│       ├── date.js             # 日期工具
│       ├── file.js             # 文件工具
│       ├── audit.js            # 审计工具
│       └── ...                 # 其他工具
├── routes/                     # 路由配置
│   └── index.js                # 路由入口
├── scripts/                    # 脚本文件
│   ├── generate.js             # 代码生成器
│   └── ...                     # 其他脚本
├── sql/                        # SQL 脚本
│   ├── init.sql                # 数据库初始化脚本
│   ├── upgrade.sql             # 数据库升级脚本
│   └── ...                     # 其他 SQL
├── test/                       # 测试文件
│   ├── unit/                   # 单元测试
│   └── integration/            # 集成测试
├── public/                     # 静态资源
├── uploads/                    # 上传文件目录
├── logs/                       # 日志目录
├── data/                       # 数据目录
├── beehive/                    # Beehive 相关
├── docs/                       # 文档
├── .env                        # 环境变量
├── .env.example                # 环境变量示例
├── app.js                      # 应用入口
├── package.json                # 项目配置
└── package-lock.json           # 依赖锁定
```

#### 架构设计

##### 分层架构

系统采用经典的 MVC（Model-View-Controller）分层架构：

```text
┌─────────────────────────────────────────────────────┐
│                    路由层 (Routes)                    │
│  路由定义、路由分组、路由中间件挂载                   │
├─────────────────────────────────────────────────────┤
│                  控制器层 (Controller)                │
│  请求处理、参数校验、响应返回、调用服务层            │
├─────────────────────────────────────────────────────┤
│                   服务层 (Service)                    │
│  业务逻辑处理、数据组装、调用模型层、事务管理        │
├─────────────────────────────────────────────────────┤
│                    模型层 (Model)                     │
│  数据库操作、SQL 执行、数据查询和修改                │
├─────────────────────────────────────────────────────┤
│                    数据库 (MySQL)                     │
│  数据持久化存储                                       │
└─────────────────────────────────────────────────────┘
```

##### 中间件架构

系统使用 Express 中间件机制，实现横切关注点：

```text
请求 → 认证中间件 → 权限中间件 → 参数校验中间件 → 审计中间件 → 控制器 → 响应
         ↓              ↓              ↓                ↓
      验证Token     检查权限       校验参数          记录操作日志
```

主要中间件：

- **认证中间件**：验证 JWT Token，获取用户信息
- **权限中间件**：检查用户是否有接口访问权限
- **参数校验中间件**：使用 Joi 校验请求参数
- **审计中间件**：自动记录操作审计日志
- **错误处理中间件**：统一处理异常和错误响应

##### 模块化设计

每个业务模块独立封装，包含完整的 MVC 结构：

- `*.controller.js` - 控制器，处理 HTTP 请求
- `*.service.js` - 服务层，实现业务逻辑
- `*.model.js` - 模型层，操作数据库
- `*.route.js` - 路由定义
- `*.validation.js` - 参数校验规则

模块之间通过服务层调用，降低耦合度。

##### 统一响应

所有接口返回统一的响应格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1693800000000
}
```

错误响应格式：

```json
{
  "code": "ERROR_CODE",
  "message": "错误描述",
  "data": {},
  "timestamp": 1693800000000
}
```

### 前端架构

#### 目录架构

```text
src/
├── api/                    # API 接口层
│   ├── user.js             # 用户管理接口
│   ├── role.js             # 角色管理接口
│   ├── permission.js       # 权限管理接口
│   ├── menu.js             # 菜单管理接口
│   ├── dept.js             # 部门管理接口
│   ├── dict.js             # 字典管理接口
│   ├── config.js           # 系统配置接口
│   ├── audit.js            # 审计日志接口
│   ├── notification.js     # 通知中心接口
│   ├── email.js            # 邮箱管理接口
│   ├── license.js          # 授权管理接口
│   ├── devicePart.js       # 部件寿命管理接口
│   ├── plc.js              # PLC 管理接口
│   ├── upload.js           # 文件上传接口
│   └── ...                 # 其他业务接口
├── assets/                 # 静态资源
│   ├── images/             # 图片资源
│   ├── icons/              # SVG 图标
│   ├── styles/             # 全局样式
│   └── fonts/              # 字体资源
├── components/             # 全局公共组件
│   ├── Breadcrumb/         # 面包屑导航
│   ├── Hamburger/          # 汉堡菜单
│   ├── SvgIcon/            # SVG 图标组件
│   ├── Pagination/         # 分页组件
│   ├── SearchForm/         # 搜索表单组件
│   ├── DictTag/            # 字典标签组件
│   ├── RightToolbar/       # 右侧工具栏
│   ├── Editor/             # 富文本编辑器
│   └── ...                 # 其他公共组件
├── composables/            # 组合式函数（Vue 2.7 Composition API）
│   ├── useI18n.js          # 国际化组合函数
│   ├── usePermission.js    # 权限判断组合函数
│   ├── useDict.js          # 字典数据组合函数
│   └── ...                 # 其他组合函数
├── config/                 # 配置文件
│   ├── index.js            # 全局配置
│   ├── net.config.js       # 网络配置
│   └── ...                 # 其他配置
├── directives/             # 自定义指令
│   ├── permission.js       # 权限指令（v-permission）
│   ├── hasRole.js          # 角色指令（v-hasRole）
│   └── ...                 # 其他指令
├── filters/                # 全局过滤器
│   ├── index.js            # 过滤器注册
│   ├── date.js             # 日期格式化过滤器
│   └── ...                 # 其他过滤器
├── i18n/                   # 国际化配置
│   ├── index.js            # 国际化入口
│   └── langs/              # 语言包
│       ├── zh-CN.js        # 中文语言包
│       └── en-US.js        # 英文语言包
├── Layout/                 # 布局组件
│   ├── index.vue           # 布局入口
│   ├── components/         # 布局子组件
│   │   ├── Sidebar/        # 侧边栏
│   │   ├── Navbar/         # 顶部导航栏
│   │   ├── AppMain/        # 主内容区
│   │   └── Settings/       # 设置面板
│   └── mixins/             # 布局混入
├── plugins/                # 插件配置
│   ├── axios.js            # Axios 插件配置
│   ├── element.js          # Element UI 插件配置
│   └── ...                 # 其他插件
├── router/                 # 路由配置
│   ├── index.js            # 路由入口
│   └── helper/             # 路由辅助
│       ├── routerHelper.js # 动态路由生成
│       └── ...             # 其他辅助
├── store/                  # Vuex 状态管理
│   ├── index.js            # Store 入口
│   ├── getters.js          # 全局 Getters
│   └── modules/            # 状态模块
│       ├── user.js         # 用户状态
│       ├── permission.js   # 权限状态
│       ├── app.js          # 应用状态
│       ├── settings.js     # 设置状态
│       ├── dict.js         # 字典状态
│       ├── notification.js # 通知状态
│       └── ...             # 其他状态模块
├── utils/                  # 工具函数
│   ├── request.js          # HTTP 请求封装
│   ├── auth.js             # 认证工具
│   ├── permission.js       # 权限工具
│   ├── date.js             # 日期工具
│   ├── validate.js         # 验证工具
│   ├── download.js         # 下载工具
│   ├── export.js           # 导出工具
│   └── ...                 # 其他工具
├── views/                  # 页面视图
│   ├── home/               # 首页
│   │   ├── overview/       # 概况预览
│   │   ├── dashboard/      # 数据看板
│   │   └── data/           # 数据管理
│   ├── device/             # 设备管理
│   │   ├── state/          # 设备状态
│   │   ├── alarm/          # 报警统计
│   │   └── part/           # 部件寿命
│   ├── production/         # 生产管理
│   │   ├── recipe/         # 配方管理
│   │   └── order/          # 生产订单
│   ├── system/             # 系统设置
│   │   ├── user/           # 用户管理
│   │   ├── role/           # 角色管理
│   │   ├── dept/           # 部门管理
│   │   ├── dict/           # 字典管理
│   │   ├── menu/           # 菜单管理
│   │   ├── permission/     # 权限配置
│   │   ├── config/         # 参数配置
│   │   ├── audit/          # 审计日志
│   │   └── online/         # 在线管理
│   ├── notification/       # 通知中心
│   ├── license/            # 授权管理
│   ├── profile/            # 个人中心
│   ├── login/              # 登录页
│   ├── error/              # 错误页面
│   └── redirect/           # 重定向页面
├── App.vue                 # 根组件
├── main.js                 # 入口文件
└── settings.js             # 全局设置
```

#### 架构设计

##### 分层架构

系统采用经典的前后端分离分层架构：

```text
┌─────────────────────────────────────────────────────┐
│                     视图层 (Views)                    │
│  页面组件、业务组件、布局组件、弹窗、表单等          │
├─────────────────────────────────────────────────────┤
│                     状态层 (Store)                    │
│  Vuex 全局状态管理：用户、权限、配置、字典等        │
├─────────────────────────────────────────────────────┤
│                     服务层 (API)                      │
│  API 接口封装、HTTP 请求拦截、响应处理              │
├─────────────────────────────────────────────────────┤
│                     工具层 (Utils)                    │
│  通用工具函数、认证、权限、日期、验证、导出等       │
├─────────────────────────────────────────────────────┤
│                     基础层 (Core)                     │
│  Vue 框架、路由、国际化、组件库、指令、过滤器       │
└─────────────────────────────────────────────────────┘
```

##### 路由设计

- **静态路由**：登录、错误页、重定向等不需要权限的页面
- **动态路由**：根据用户权限动态生成的业务页面路由
- **路由守卫**：全局前置守卫，验证登录状态和页面权限
- **路由缓存**：支持页面缓存（keep-alive），提升用户体验

##### 状态管理

采用 Vuex 模块化状态管理：

- **user 模块**：用户信息、登录状态、Token 管理
- **permission 模块**：权限列表、动态路由、按钮权限
- **app 模块**：应用配置、侧边栏状态、设备类型
- **settings 模块**：系统设置、主题、布局配置
- **dict 模块**：字典数据缓存
- **notification 模块**：通知状态、未读数量

##### 权限设计

三级权限控制体系：

1. **菜单权限**：控制侧边栏菜单的显示和隐藏
2. **按钮权限**：控制页面按钮的显示和隐藏（v-permission 指令）
3. **参数权限**：控制配置参数的查看和修改（细粒度控制）

## 项目依赖

### 后端依赖

#### 核心依赖

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^2.4.3",
  "joi": "^18.2.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "dayjs": "^1.11.23",
  "lodash": "^4.18.1",
  "ws": "^8.21.3",
  "nodemailer": "^9.1.0",
  "modbus-serial": "^8.0.25",
  "node-opcua": "^2.177.0",
  "node-snap7": "^1.0.9"
}
```

#### 开发依赖

```json
{
  "nodemon": "^3.0.2",
  "jest": "^29.7.0"
}
```

#### 依赖安装

```bash
# 使用 npm 安装
npm install

# 使用 cnpm 安装（国内推荐）
cnpm install

# 使用 yarn 安装
yarn install
```

### 前端依赖

#### 核心依赖

```json
{
  "vue": "^2.7.16",
  "vue-router": "^3.6.5",
  "vuex": "^3.6.2",
  "vue-i18n": "^8.28.2",
  "element-ui": "^2.15.14",
  "axios": "^1.19.0",
  "echarts": "^6.1.0",
  "dayjs": "^1.11.21"
}
```

#### 开发依赖

```json
{
  "@vue/cli-service": "~5.0.0",
  "@vue/cli-plugin-babel": "~5.0.0",
  "@vue/cli-plugin-eslint": "~5.0.0",
  "eslint": "^7.32.0",
  "eslint-plugin-vue": "^8.0.3",
  "husky": "^8.0.3",
  "lint-staged": "^13.2.3",
  "less-loader": "^13.0.0",
  "svg-sprite-loader": "^6.0.11"
}
```

#### 依赖安装

```bash
# 使用 npm 安装
npm install

# 使用 cnpm 安装（国内推荐）
cnpm install

# 使用 yarn 安装
yarn install
```

## 快速开始

### 后端开始

#### 环境要求

```bash
- Node.js >= 14.0.0
- npm >= 6.0.0
- MySQL >= 5.7 或 >= 8.0
- PLC 设备（可选，用于设备通信测试）
```

#### 安装步骤

##### 克隆项目

```bash
git clone <仓库地址>
cd 02.02.02-nexSM-V3
```

##### 安装依赖

```bash
npm install
```

##### 环境变量

复制 `.env.example` 为 `.env`，并根据实际情况修改配置：

```bash
cp .env.example .env
```

>  环境变量说明：
>
> ```text
> # 服务端口
> PORT = 3000
> 
> # 环境模式
> NODE_ENV = development
> 
> # 数据库配置
> DB_HOST = 127.0.0.1
> DB_PORT = 3306
> DB_USER = root
> DB_PASSWORD = 123456
> DB_NAME = nexsm_v2_dev
> 
> # JWT 配置
> JWT_SECRET = your_jwt_secret_key
> JWT_EXPIRES_IN = 24h
> 
> # 邮件配置
> EMAIL_HOST = smtp.example.com
> EMAIL_PORT = 465
> EMAIL_USER = your_email@example.com
> EMAIL_PASSWORD = your_email_password
> EMAIL_FROM = your_email@example.com
> 
> # PLC 配置
> PLC_PROTOCOL = modbus
> PLC_HOST = 127.0.0.1
> PLC_PORT = 502
> PLC_SLAVE_ID = 1
> 
> # 文件上传配置
> UPLOAD_DIR = ./uploads
> MAX_FILE_SIZE = 10485760
> 
> # 日志配置
> LOG_LEVEL = info
> LOG_DIR = ./logs
> ```

##### 初始数据

```bash
# 执行数据库初始化脚本
mysql -u root -p < sql/init.sql

# 或使用数据库管理工具导入 sql/init.sql
```

##### 启动开发

```bash
npm run dev
```

> 启动开发服务器成功后，服务运行在 `http://localhost:3000`

##### 启动生产

```bash
npm start
```

> 启动生产服务器

##### 运行测试

```bash
npm test
```

##### 代码生成

```bash
# 使用代码生成器生成模块代码
npm run gen
```

### 前端开始

#### 环境要求

```bash
- Node.js >= 14.0.0
- npm >= 6.0.0
- 后端服务已启动（默认端口 3000）
```

#### 安装步骤

##### 克隆项目

```bash
git clone <仓库地址>
cd 02.01.02-nexCM-V3
```

##### 安装依赖

```bash
npm install
```

##### 环境变量

复制 `.env.example` 为 `.env.development` 和 `.env.production`，并根据实际情况修改配置：

```bash
# 开发环境配置
cp .env.example .env.development

# 生产环境配置
cp .env.example .env.production
```

> 环境变量说明：
>
> ```text
> # 页面标题
> VUE_APP_TITLE = nexCM管理系统
> 
> # 后端接口地址
> VUE_APP_BASE_API = http://localhost:3000
> 
> # 端口号
> VUE_APP_PORT = 8082
> 
> # 是否开启 mock
> VUE_APP_MOCK = false
> ```

##### 开发服务

```bash
npm run serve
```

> 启动开发服务器成功后，访问 `http://localhost:8082`

##### 构建生产

```bash
npm run build
```

构建生产版本的产物在 `dist/` 目录下。

##### 代码检查

```bash
npm run lint
```

## 项目功能

### 功能展列

- **国际支持**：完整的中英文双语支持，前后端均使用国际化配置实现，可扩展多语言
- **注册登录：**完善的注册、登录、忘记密码及二维码功能
- **个人中心：**主页面具有用户头像、用户名称和个人数据中心展示
- **动态菜单：**后台配置菜单，前端动态展示，持久本地化
- **字段管理：**管理系统字典类型和字典项，支持多语言配置
- **部门管理：**管理组织部门结构，支持树形层级管理
- **角色管理：**管理系统角色，支持角色的新增、编辑和删除，目前基本角色为管理员、工程师和操作员
- **用户管理：**管理系统用户账户，支持角色分配、状态管理和密码重置
- **审计追踪**：记录系统所有操作日志，支持按用户、操作类型、时间范围等条件筛选
- **权限管理**：角色权限配置管理,细粒度的权限控制，支持菜单、按钮、参数三级权限
- **在线管理：**可对在线设备进行管理和剔除，确保有效利用授权数量
- **系统参数：**可对常用配置参数进行设置
- **安全配置：**可实现对现实界面进行水印设置
- **下载功能：**可对表类进行下载，如生产报表、故障报表、用户清单、审计日志等等
- **下载设置：**可增加下载水印，下载内默认包含导出人信息
- **通讯设置：**具备多种通讯方式的兼容，并可随时设置通讯相关参数
- **通知中心**：可配置的通知事件，支持邮件通知
- **设备监控**：实时 PLC 数据采集，设备状态监控
- **授权管理：**可对服务器、在线客户端数量进行管控
- 
- **寿命管理**：部件寿命追踪，模板化管理，定时预警
- **电子签名**：关键操作二次身份验证，确保操作不可否认，模块已有，待陆续更新
- **超级面板：**可逐步实现一键式布局各项配置功能

