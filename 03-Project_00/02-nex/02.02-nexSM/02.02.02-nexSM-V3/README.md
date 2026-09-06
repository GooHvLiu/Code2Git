# nexSM-V3 后端项目

## 📋 基本信息

| 项目 | 信息 |
|------|------|
| **项目名称** | nexSM-V3 后端服务系统 |
| **项目版本** | v1.0.0 |
| **项目描述** | 企业级 Express + MySQL MVC 架构后端服务 |
| **项目作者** | GooHv |
| **项目类型** | 企业级后端 API 服务 |
| **开源协议** | MIT |
| **入口文件** | app.js |
| **默认端口** | 3000 |

---

## 📖 项目简介

nexSM-V3 是一套面向医疗设备行业的企业级后端服务系统，专为移动式灌装加塞设备设计。系统采用 Express + MySQL 的 MVC 架构，提供用户认证、权限管理、设备管理、生产管理、系统配置、通知中心、审计追踪、PLC 通信等核心服务。

系统具有以下特点：
- **MVC 架构**：清晰的 Model-View-Controller 分层，代码结构清晰
- **RESTful API**：标准化的 RESTful 接口设计，易于前端对接
- **JWT 认证**：基于 JSON Web Token 的无状态认证机制
- **细粒度权限**：支持菜单、按钮、参数三级权限控制
- **审计追踪**：完整的操作审计日志，满足 FDA 21 CFR Part 11 合规要求
- **PLC 通信**：支持 Modbus RTU/TCP、OPC UA、S7 等多种 PLC 协议
- **实时通信**：基于 WebSocket 的实时数据推送
- **通知中心**：可配置的通知事件，支持邮件通知
- **数据校验**：基于 Joi 的参数校验，确保数据安全
- **模块化设计**：业务模块独立，易于扩展和维护

---

## 🛠️ 技术栈分析

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | >= 14.0.0 | JavaScript 运行时环境 |
| **Express** | 4.18.2 | 轻量级 Web 应用框架 |
| **MySQL2** | 3.6.5 | MySQL 数据库驱动（支持 Promise） |

### 认证与安全

| 技术 | 版本 | 用途 |
|------|------|------|
| **jsonwebtoken** | 9.0.3 | JWT Token 生成和验证 |
| **bcryptjs** | 2.4.3 | 密码加密和验证 |
| **cors** | 2.8.5 | 跨域资源共享 |
| **multer** | 1.4.5-lts.1 | 文件上传处理 |
| **svg-captcha** | 1.4.0 | 图形验证码生成 |

### 数据校验

| 技术 | 版本 | 用途 |
|------|------|------|
| **Joi** | 18.2.3 | 数据校验和模式定义 |

### PLC 通信

| 技术 | 版本 | 用途 |
|------|------|------|
| **modbus-serial** | 8.0.25 | Modbus RTU/TCP 协议通信 |
| **node-opcua** | 2.177.0 | OPC UA 协议通信 |
| **node-snap7** | 1.0.9 | Siemens S7 协议通信 |

### 实时通信

| 技术 | 版本 | 用途 |
|------|------|------|
| **ws** | 8.21.3 | WebSocket 实时通信 |

### 工具库

| 技术 | 版本 | 用途 |
|------|------|------|
| **Axios** | 1.19.0 | HTTP 请求库（调用外部接口） |
| **Day.js** | 1.11.23 | 轻量级日期处理库 |
| **Lodash** | 4.18.1 | 实用工具库 |
| **Node Cache** | 5.1.2 | 内存缓存 |
| **UUID** | 14.0.2 | 唯一标识符生成 |
| **Nodemailer** | 9.1.0 | 邮件发送 |
| **module-alias** | 2.3.4 | 模块路径别名 |
| **dotenv** | 16.3.1 | 环境变量加载 |
| **dotenv-expand** | 1000.0.0 | 环境变量展开 |

### API 文档

| 技术 | 版本 | 用途 |
|------|------|------|
| **swagger-jsdoc** | 6.3.0 | Swagger 文档生成 |
| **swagger-ui-express** | 5.0.1 | Swagger UI 展示 |

### 开发工具

| 技术 | 版本 | 用途 |
|------|------|------|
| **nodemon** | 3.0.2 | 开发时自动重启服务 |
| **jest** | 29.7.0 | 单元测试框架 |

---

## 🏗️ 项目架构

### 目录结构

```
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

### 架构设计

#### 1. MVC 分层架构

系统采用经典的 MVC（Model-View-Controller）分层架构：

```
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

#### 2. 中间件架构

系统使用 Express 中间件机制，实现横切关注点：

```
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

#### 3. 模块化设计

每个业务模块独立封装，包含完整的 MVC 结构：
- `*.controller.js` - 控制器，处理 HTTP 请求
- `*.service.js` - 服务层，实现业务逻辑
- `*.model.js` - 模型层，操作数据库
- `*.route.js` - 路由定义
- `*.validation.js` - 参数校验规则

模块之间通过服务层调用，降低耦合度。

#### 4. 统一响应格式

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

---

## 📦 项目依赖

### 核心依赖

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

### 开发依赖

```json
{
  "nodemon": "^3.0.2",
  "jest": "^29.7.0"
}
```

### 依赖安装

```bash
# 使用 npm 安装
npm install

# 使用 cnpm 安装（国内推荐）
cnpm install

# 使用 yarn 安装
yarn install
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- MySQL >= 5.7 或 >= 8.0
- PLC 设备（可选，用于设备通信测试）

### 安装步骤

#### 1. 克隆项目

```bash
git clone <仓库地址>
cd 02.02.02-nexSM-V3
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境变量

复制 `.env.example` 为 `.env`，并根据实际情况修改配置：

```bash
cp .env.example .env
```

环境变量说明：
```env
# 服务端口
PORT = 3000

# 环境模式
NODE_ENV = development

# 数据库配置
DB_HOST = 127.0.0.1
DB_PORT = 3306
DB_USER = root
DB_PASSWORD = 123456
DB_NAME = nexsm_v2_dev

# JWT 配置
JWT_SECRET = your_jwt_secret_key
JWT_EXPIRES_IN = 24h

# 邮件配置
EMAIL_HOST = smtp.example.com
EMAIL_PORT = 465
EMAIL_USER = your_email@example.com
EMAIL_PASSWORD = your_email_password
EMAIL_FROM = your_email@example.com

# PLC 配置
PLC_PROTOCOL = modbus
PLC_HOST = 127.0.0.1
PLC_PORT = 502
PLC_SLAVE_ID = 1

# 文件上传配置
UPLOAD_DIR = ./uploads
MAX_FILE_SIZE = 10485760

# 日志配置
LOG_LEVEL = info
LOG_DIR = ./logs
```

#### 4. 初始化数据库

```bash
# 执行数据库初始化脚本
mysql -u root -p < sql/init.sql

# 或使用数据库管理工具导入 sql/init.sql
```

#### 5. 启动开发服务器

```bash
npm run dev
```

启动成功后，服务运行在 `http://localhost:3000`

#### 6. 启动生产服务器

```bash
npm start
```

#### 7. 运行测试

```bash
npm test
```

#### 8. 代码生成

```bash
# 使用代码生成器生成模块代码
npm run gen
```

---

## 📱 项目功能

### 1. 用户认证模块

#### 功能介绍
用户认证模块提供用户登录、登出、Token 刷新、验证码等功能，是系统的安全入口，采用 JWT 无状态认证机制。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **用户登录** | 用户名密码登录，验证码验证，返回 JWT Token |
| **用户登出** | 清除登录状态，Token 失效 |
| **Token 刷新** | 刷新访问 Token，延长登录有效期 |
| **图形验证码** | 生成图形验证码，防止暴力破解 |
| **登录失败处理** | 连续失败锁定账号，失败次数可配置 |

#### 功能封装
- `src/modules/captcha/` - 验证码模块
- `src/modules/user/user.controller.js` - 用户控制器（登录、登出）
- `src/middleware/auth.middleware.js` - 认证中间件
- `src/utils/jwt.js` - JWT 工具函数
- `src/utils/password.js` - 密码加密工具

#### 功能使用
1. 调用 `/api/captcha` 获取图形验证码
2. 调用 `/api/user/login` 登录，传入用户名、密码、验证码
3. 登录成功后返回 JWT Token，前端存储 Token
4. 后续请求在 Header 中携带 `Authorization: Bearer <token>`
5. 调用 `/api/user/logout` 登出

#### 后续功能拓展
- 多因素认证（MFA）
- 单点登录（SSO）
- 第三方登录（微信、钉钉等）
- 登录日志和异常登录检测
- 账号锁定自动解锁

---

### 2. 用户管理模块

#### 功能介绍
用户管理模块提供用户的增删改查、用户状态管理、密码重置、角色分配等功能，是系统用户生命周期管理的核心模块。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **用户列表** | 分页查询用户列表，支持按用户名、状态、部门筛选 |
| **新增用户** | 创建新用户，分配角色，设置初始密码 |
| **编辑用户** | 修改用户基本信息，调整角色分配 |
| **删除用户** | 删除用户（软删除，保留历史数据） |
| **用户状态** | 启用/禁用用户账号 |
| **重置密码** | 重置用户密码，通过邮件发送新密码 |
| **用户详情** | 查看用户详细信息，包括登录记录 |

#### 功能封装
- `src/modules/user/user.controller.js` - 用户控制器
- `src/modules/user/user.service.js` - 用户服务层
- `src/modules/user/user.model.js` - 用户模型层
- `src/modules/user/user.route.js` - 用户路由
- `src/modules/user/user.validation.js` - 用户参数校验

#### 功能使用
1. 调用 `GET /api/user/list` 获取用户列表
2. 调用 `POST /api/user/add` 新增用户
3. 调用 `PUT /api/user/update/:id` 编辑用户
4. 调用 `DELETE /api/user/delete/:id` 删除用户
5. 调用 `PUT /api/user/status/:id` 修改用户状态
6. 调用 `POST /api/user/reset-password/:id` 重置密码

#### 后续功能拓展
- 用户批量导入/导出
- 用户头像上传和管理
- 用户登录日志查询
- 用户操作轨迹追踪
- 用户数据权限配置

---

### 3. 角色管理模块

#### 功能介绍
角色管理模块提供角色的增删改查、角色权限配置、数据权限设置等功能，是权限管理的核心模块，实现基于角色的访问控制（RBAC）。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **角色列表** | 查询角色列表，支持按角色名称、状态筛选 |
| **新增角色** | 创建新角色，设置角色名称、编码、描述 |
| **编辑角色** | 修改角色基本信息 |
| **删除角色** | 删除角色（需检查是否有关联用户） |
| **角色状态** | 启用/禁用角色 |
| **权限配置** | 为角色分配菜单、按钮、参数权限 |
| **数据权限** | 设置角色的数据权限范围（全部、本部门、本部门及以下、仅本人） |

#### 功能封装
- `src/modules/role/role.controller.js` - 角色控制器
- `src/modules/role/role.service.js` - 角色服务层
- `src/modules/role/role.model.js` - 角色模型层
- `src/modules/role/role.route.js` - 角色路由
- `src/modules/role/role.validation.js` - 角色参数校验

#### 功能使用
1. 调用 `GET /api/role/list` 获取角色列表
2. 调用 `POST /api/role/add` 新增角色
3. 调用 `PUT /api/role/update/:id` 编辑角色
4. 调用 `DELETE /api/role/delete/:id` 删除角色
5. 调用 `PUT /api/role/permission/:id` 配置角色权限
6. 调用 `PUT /api/role/data-scope/:id` 设置数据权限

#### 后续功能拓展
- 角色克隆功能
- 角色复制和批量权限复制
- 角色使用情况统计
- 角色权限对比功能
- 角色审批流程

---

### 4. 权限管理模块

#### 功能介绍
权限管理模块提供权限树配置、权限分配、权限刷新等功能，实现细粒度的权限控制，支持菜单、按钮、参数三级权限。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **权限树** | 树形结构展示所有权限节点（菜单、Tab、按钮、参数） |
| **权限分配** | 为角色分配权限，支持父子联动 |
| **权限筛选** | 按类型筛选权限（全部/菜单/按钮/参数） |
| **权限刷新** | 刷新权限缓存，使权限变更立即生效 |
| **权限重置** | 重置角色权限为默认配置 |

#### 功能封装
- `src/modules/permission/permission.controller.js` - 权限控制器
- `src/modules/permission/permission.service.js` - 权限服务层
- `src/modules/permission/permission.model.js` - 权限模型层
- `src/modules/permission/permission.route.js` - 权限路由
- `src/middleware/auth.middleware.js` - 权限校验中间件

#### 功能使用
1. 调用 `GET /api/permission/tree` 获取权限树
2. 调用 `GET /api/permission/role/:roleId` 获取角色已分配权限
3. 调用 `PUT /api/permission/assign/:roleId` 分配权限
4. 调用 `POST /api/permission/refresh` 刷新权限缓存
5. 调用 `POST /api/permission/reset/:roleId` 重置角色权限

#### 后续功能拓展
- 权限模板管理
- 权限变更历史记录
- 权限使用情况分析
- 权限导入/导出
- 权限审批流程

---

### 5. 菜单管理模块

#### 功能介绍
菜单管理模块提供菜单的增删改查、菜单树形结构管理、菜单权限配置等功能，实现系统导航菜单的动态配置。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **菜单列表** | 树形结构展示所有菜单 |
| **新增菜单** | 创建新菜单，设置菜单名称、路径、图标、排序 |
| **编辑菜单** | 修改菜单基本信息 |
| **删除菜单** | 删除菜单（需检查是否有子菜单） |
| **菜单排序** | 拖拽调整菜单排序 |
| **菜单权限** | 配置菜单关联的权限标识 |

#### 功能封装
- `src/modules/menu/menu.controller.js` - 菜单控制器
- `src/modules/menu/menu.service.js` - 菜单服务层
- `src/modules/menu/menu.model.js` - 菜单模型层
- `src/modules/menu/menu.route.js` - 菜单路由

#### 功能使用
1. 调用 `GET /api/menu/tree` 获取菜单树
2. 调用 `POST /api/menu/add` 新增菜单
3. 调用 `PUT /api/menu/update/:id` 编辑菜单
4. 调用 `DELETE /api/menu/delete/:id` 删除菜单
5. 调用 `PUT /api/menu/sort` 调整菜单排序

#### 后续功能拓展
- 菜单图标选择器
- 菜单可见性配置（按角色显示）
- 菜单缓存管理
- 菜单导入/导出
- 多语言菜单名称配置

---

### 6. 部门管理模块

#### 功能介绍
部门管理模块提供部门的增删改查、部门树形结构管理等功能，实现组织架构的管理。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **部门列表** | 树形结构展示所有部门 |
| **新增部门** | 创建新部门，设置部门名称、编码、负责人、排序 |
| **编辑部门** | 修改部门基本信息 |
| **删除部门** | 删除部门（需检查是否有关联用户） |
| **部门排序** | 拖拽调整部门排序 |

#### 功能封装
- `src/modules/dept/dept.controller.js` - 部门控制器
- `src/modules/dept/dept.service.js` - 部门服务层
- `src/modules/dept/dept.model.js` - 部门模型层
- `src/modules/dept/dept.route.js` - 部门路由

#### 功能使用
1. 调用 `GET /api/dept/tree` 获取部门树
2. 调用 `POST /api/dept/add` 新增部门
3. 调用 `PUT /api/dept/update/:id` 编辑部门
4. 调用 `DELETE /api/dept/delete/:id` 删除部门

#### 后续功能拓展
- 部门负责人管理
- 部门审批流程
- 部门成员管理
- 部门数据权限配置
- 部门导入/导出

---

### 7. 字典管理模块

#### 功能介绍
字典管理模块提供数据字典的增删改查、字典项管理等功能，实现系统常量数据的统一管理。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **字典类型列表** | 查询字典类型列表 |
| **新增字典类型** | 创建新字典类型，设置类型名称、编码、状态 |
| **编辑字典类型** | 修改字典类型信息 |
| **删除字典类型** | 删除字典类型（需检查是否有关联字典项） |
| **字典项列表** | 查询指定类型的字典项 |
| **字典项管理** | 新增、编辑、删除字典项 |

#### 功能封装
- `src/modules/dict/dict.controller.js` - 字典控制器
- `src/modules/dict/dict.service.js` - 字典服务层
- `src/modules/dict/dict.model.js` - 字典模型层
- `src/modules/dict/dict.route.js` - 字典路由
- `src/services/cacheService.js` - 字典缓存服务

#### 功能使用
1. 调用 `GET /api/dict/type/list` 获取字典类型列表
2. 调用 `POST /api/dict/type/add` 新增字典类型
3. 调用 `PUT /api/dict/type/update/:id` 编辑字典类型
4. 调用 `DELETE /api/dict/type/delete/:id` 删除字典类型
5. 调用 `GET /api/dict/item/list/:typeId` 获取字典项列表
6. 调用 `POST /api/dict/item/add` 新增字典项

#### 后续功能拓展
- 字典数据缓存刷新
- 字典数据导入/导出
- 字典数据版本管理
- 字典数据变更通知

---

### 8. 系统配置模块

#### 功能介绍
系统配置模块提供系统参数的配置和管理功能，支持多种配置分类，实现系统行为的灵活调整。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **系统设置** | 会话超时、默认分页大小、默认语言、日期格式、水印配置等 |
| **安全设置** | 登录失败阈值、锁定时长、密码策略等 |
| **PLC设置** | PLC协议、主机、端口、从站ID、轮询间隔等 |
| **导出设置** | PDF水印、导出格式等 |
| **连接设置** | 心跳间隔、设备状态检查间隔、离线阈值、维护检查间隔、部件寿命统计间隔等 |
| **设备设置** | 设备名称、编码、区域、安装日期、部件寿命提醒配置等 |
| **订单设置** | 无订单生产、订单切换确认、自动归档、操作员显示等 |
| **授权管理** | 授权信息查看、授权文件导入 |
| **邮箱配置** | SMTP服务器配置、发件人配置、测试邮件发送 |
| **邮箱日志** | 邮件发送记录、发送状态查看 |

#### 功能封装
- `src/modules/config/config.controller.js` - 配置控制器
- `src/modules/config/config.service.js` - 配置服务层
- `src/modules/config/config.model.js` - 配置模型层
- `src/modules/config/config.route.js` - 配置路由
- `src/modules/email/` - 邮箱管理模块
- `src/modules/license/` - 授权管理模块

#### 功能使用
1. 调用 `GET /api/config/list` 获取配置列表
2. 调用 `GET /api/config/:key` 获取指定配置
3. 调用 `PUT /api/config/update` 更新配置
4. 调用 `POST /api/config/refresh` 刷新配置缓存
5. 调用 `POST /api/email/test` 发送测试邮件
6. 调用 `POST /api/license/import` 导入授权文件

#### 后续功能拓展
- 配置版本管理和回滚
- 配置变更历史记录
- 配置导入/导出
- 配置审批流程
- 配置模板管理

---

### 9. 审计追踪模块

#### 功能介绍
审计追踪模块提供完整的操作审计日志记录和查询功能，实现对系统所有关键操作的可追溯性，满足 FDA 21 CFR Part 11、EU GMP Annex 11 等合规要求。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **审计日志列表** | 分页查询审计日志，支持按操作类型、操作人、时间范围筛选 |
| **操作详情** | 查看操作详细信息，包括操作内容、变更前后对比 |
| **日志导出** | 导出审计日志为 Excel/PDF |
| **操作类型管理** | 配置需要审计的操作类型 |
| **电子签名** | 关键操作二次身份验证，签名记录管理 |

#### 功能封装
- `src/modules/audit/audit.controller.js` - 审计控制器
- `src/modules/audit/audit.service.js` - 审计服务层
- `src/modules/audit/audit.model.js` - 审计模型层
- `src/modules/audit/audit.route.js` - 审计路由
- `src/middleware/audit.middleware.js` - 审计中间件
- `src/utils/audit.js` - 审计工具函数

#### 功能使用
1. 调用 `GET /api/audit/list` 获取审计日志列表
2. 调用 `GET /api/audit/:id` 获取审计日志详情
3. 调用 `GET /api/audit/export` 导出审计日志
4. 调用 `GET /api/audit/action-types` 获取操作类型列表
5. 关键操作自动记录审计日志（通过审计中间件）

#### 后续功能拓展
- 审计日志统计分析
- 实时操作监控
- 异常操作检测和告警
- 审计日志归档和清理
- 电子签名验证和验签
- 审计日志不可篡改存储（区块链）

---

### 10. 通知中心模块

#### 功能介绍
通知中心模块提供可配置的通知事件管理功能，支持多种通知方式（系统通知、邮件通知等），实现对系统关键事件的及时通知和提醒。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **通知列表** | 查询通知消息列表，未读/已读状态管理 |
| **通知详情** | 查看通知详细内容 |
| **通知配置** | 配置通知事件，启用/禁用通知，选择通知方式 |
| **邮件通知** | 邮件模板配置，邮件发送 |
| **通知推送** | WebSocket 实时推送通知 |

#### 功能封装
- `src/modules/notification/notification.controller.js` - 通知控制器
- `src/modules/notification/notification.service.js` - 通知服务层
- `src/modules/notification/notification.model.js` - 通知模型层
- `src/modules/notification/notification.route.js` - 通知路由
- `src/services/notificationService.js` - 通知公共服务
- `src/socket/notificationSocket.js` - 通知 WebSocket 推送

#### 功能使用
1. 调用 `GET /api/notification/list` 获取通知列表
2. 调用 `GET /api/notification/unread-count` 获取未读数量
3. 调用 `PUT /api/notification/read/:id` 标记通知为已读
4. 调用 `PUT /api/notification/read-all` 全部标记为已读
5. 调用 `GET /api/notification/config` 获取通知配置
6. 调用 `PUT /api/notification/config` 更新通知配置

#### 后续功能拓展
- 短信通知支持
- 微信/钉钉/企业微信通知支持
- 通知订阅管理
- 通知分级管理
- 通知定时推送和汇总
- 通知模板管理

---

### 11. 邮箱管理模块

#### 功能介绍
邮箱管理模块提供邮箱服务器配置、邮件发送、邮件发送日志等功能，支持系统通知邮件的发送和管理。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **邮箱配置** | SMTP服务器配置（主机、端口、用户名、密码、加密方式） |
| **发件人配置** | 发件人名称、邮箱地址配置 |
| **测试邮件** | 发送测试邮件，验证配置是否正确 |
| **邮件模板** | 邮件模板配置和管理 |
| **邮件日志** | 邮件发送记录、发送状态、失败原因查看 |
| **邮件重发** | 失败邮件重新发送 |

#### 功能封装
- `src/modules/email/email.controller.js` - 邮箱控制器
- `src/modules/email/email.service.js` - 邮箱服务层
- `src/modules/email/email.model.js` - 邮箱模型层
- `src/modules/email/email.route.js` - 邮箱路由
- `src/services/emailService.js` - 邮件发送公共服务

#### 功能使用
1. 调用 `GET /api/email/config` 获取邮箱配置
2. 调用 `PUT /api/email/config` 更新邮箱配置
3. 调用 `POST /api/email/test` 发送测试邮件
4. 调用 `GET /api/email/log/list` 获取邮件发送日志
5. 调用 `POST /api/email/resend/:id` 重发失败邮件

#### 后续功能拓展
- 多邮箱配置和轮询发送
- 邮件队列管理
- 邮件模板可视化编辑
- 邮件发送统计分析
- 邮件附件管理
- 邮件收件人管理

---

### 12. 授权管理模块

#### 功能介绍
授权管理模块提供软件授权管理功能，支持授权文件导入、授权信息查看、授权有效期管理，确保软件合法使用。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **授权信息** | 查看当前授权信息（授权类型、有效期、功能模块、设备数量等） |
| **授权导入** | 导入授权文件（.lic格式），更新授权信息 |
| **授权验证** | 启动时验证授权有效性，运行时定期检查 |
| **授权提醒** | 授权到期前自动提醒 |

#### 功能封装
- `src/modules/license/license.controller.js` - 授权控制器
- `src/modules/license/license.service.js` - 授权服务层
- `src/modules/license/license.model.js` - 授权模型层
- `src/modules/license/license.route.js` - 授权路由
- `src/middleware/license.middleware.js` - 授权验证中间件

#### 功能使用
1. 调用 `GET /api/license/info` 获取授权信息
2. 调用 `POST /api/license/import` 导入授权文件
3. 调用 `GET /api/license/verify` 验证授权有效性

#### 后续功能拓展
- 在线激活和自动续期
- 授权使用情况统计
- 多设备授权管理
- 授权日志和审计
- 授权试用管理

---

### 13. 部件寿命管理模块

#### 功能介绍
部件寿命管理模块提供部件寿命追踪、模板管理、寿命预警、更换记录等功能，实现对设备关键部件的全生命周期管理。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **部件列表** | 查看所有部件的寿命状态，支持按模板、状态筛选 |
| **新增部件** | 基于部件模板创建新部件，设置部件编码、规格型号、额定寿命 |
| **编辑部件** | 修改部件信息（被使用的部件和基础模板不可编辑） |
| **删除部件** | 删除部件（软删除，保留历史记录） |
| **部件更换** | 录入部件更换记录，更新部件编码和使用寿命 |
| **更换记录** | 查看部件更换历史记录 |
| **模板管理** | 管理部件模板（基础模板不可编辑/删除），新增模板基于基础模板 |
| **寿命统计** | 定时从 PLC 采集部件使用数据，计算使用寿命 |
| **寿命预警** | 部件寿命达到阈值时触发预警通知 |

#### 功能封装
- `src/modules/device-part/device-part.controller.js` - 部件寿命控制器
- `src/modules/device-part/device-part.service.js` - 部件寿命服务层
- `src/modules/device-part/device-part.model.js` - 部件寿命模型层
- `src/modules/device-part/device-part.route.js` - 部件寿命路由
- `src/modules/device-part/device-part.validation.js` - 参数校验
- `src/plc/tasks/MaintenanceTaskManager.js` - 寿命统计定时任务

#### 功能使用
1. 调用 `GET /api/device-part/list` 获取部件列表
2. 调用 `POST /api/device-part/add` 新增部件
3. 调用 `PUT /api/device-part/update/:id` 编辑部件
4. 调用 `DELETE /api/device-part/delete/:id` 删除部件
5. 调用 `POST /api/device-part/replace` 录入部件更换
6. 调用 `GET /api/device-part/replace-records` 获取更换记录
7. 调用 `GET /api/device-part/templates` 获取模板列表
8. 调用 `POST /api/device-part/templates/add` 新增模板

#### 后续功能拓展
- 部件寿命预测算法
- 部件库存管理
- 部件采购提醒
- 部件维护计划
- 部件故障分析
- 部件成本分析

---

### 14. PLC 通信模块

#### 功能介绍
PLC 通信模块提供与 PLC 设备的通信功能，支持 Modbus RTU/TCP、OPC UA、S7 等多种协议，实现实时数据采集和设备控制。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **连接管理** | PLC 连接建立、断开、重连、状态监控 |
| **数据采集** | 定时读取 PLC 寄存器数据，支持快速轮询和慢速轮询 |
| **数据写入** | 向 PLC 寄存器写入数据，实现设备控制 |
| **标签映射** | PLC 标签地址映射配置，支持批量读取 |
| **协议支持** | Modbus RTU/TCP、OPC UA、S7 等多种协议 |
| **实时推送** | WebSocket 实时推送 PLC 数据到前端 |
| **模拟数据** | 支持 PLC 模拟数据，便于开发测试 |

#### 功能封装
- `src/plc/index.js` - PLC 管理器
- `src/plc/modbus.js` - Modbus 协议实现
- `src/plc/opcua.js` - OPC UA 协议实现
- `src/plc/s7.js` - S7 协议实现
- `src/plc/tagMap.js` - PLC 标签映射配置
- `src/plc/tasks/PlcPollTask.js` - PLC 轮询任务
- `src/socket/deviceSocket.js` - 设备状态 WebSocket 推送

#### 功能使用
1. 系统启动时自动初始化 PLC 连接
2. 定时轮询采集 PLC 数据（快速轮询 200ms，慢速轮询 1000ms）
3. 采集的数据通过 WebSocket 实时推送到前端
4. 调用 `POST /api/plc/write` 向 PLC 写入数据
5. 调用 `GET /api/plc/status` 获取 PLC 连接状态
6. 调用 `GET /api/plc/data` 获取最新采集数据

#### 后续功能拓展
- 更多 PLC 协议支持（EtherNet/IP、Profinet 等）
- PLC 程序上传/下载
- PLC 数据历史存储和趋势分析
- PLC 报警和事件管理
- PLC 远程诊断
- PLC 模拟仿真器

---

### 15. 文件上传模块

#### 功能介绍
文件上传模块提供文件上传、下载、管理等功能，支持多种文件格式，实现系统文件的统一管理。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **文件上传** | 支持单文件、多文件上传，限制文件大小和类型 |
| **文件下载** | 文件下载，支持断点续传 |
| **文件删除** | 删除文件（软删除，可配置保留期） |
| **文件列表** | 查询已上传文件列表 |
| **图片处理** | 图片压缩、缩略图生成 |
| **授权文件** | 授权文件（.lic）专用上传和解析 |

#### 功能封装
- `src/modules/upload/upload.controller.js` - 上传控制器
- `src/modules/upload/upload.service.js` - 上传服务层
- `src/modules/upload/upload.model.js` - 上传模型层
- `src/modules/upload/upload.route.js` - 上传路由
- `src/middleware/upload.middleware.js` - 上传中间件

#### 功能使用
1. 调用 `POST /api/upload` 上传文件
2. 调用 `GET /api/upload/list` 获取文件列表
3. 调用 `GET /api/upload/download/:id` 下载文件
4. 调用 `DELETE /api/upload/delete/:id` 删除文件

#### 后续功能拓展
- 云存储支持（阿里云 OSS、腾讯云 COS、AWS S3 等）
- 文件分片上传
- 文件版本管理
- 文件预览（Office、PDF、图片等）
- 文件权限管理
- 文件病毒扫描

---

### 16. 在线管理模块

#### 功能介绍
在线管理模块提供在线用户和在线设备的管理功能，支持查看实时在线状态、强制下线用户、管理在线设备等。

#### 功能模块

| 子模块 | 功能说明 |
|--------|----------|
| **在线用户** | 查看当前在线用户列表，登录时间、IP地址、设备信息 |
| **强制下线** | 强制指定用户下线，Token 失效 |
| **在线设备** | 查看在线设备列表，设备状态、最后心跳时间 |
| **设备管理** | 删除离线设备，设备状态监控 |

#### 功能封装
- `src/modules/user/user.controller.js` - 在线用户相关接口
- `src/modules/plc/plc.controller.js` - 在线设备相关接口
- `src/services/cacheService.js` - 在线状态缓存
- `src/socket/` - WebSocket 连接管理

#### 功能使用
1. 调用 `GET /api/user/online` 获取在线用户列表
2. 调用 `POST /api/user/kick/:userId` 强制用户下线
3. 调用 `GET /api/plc/online-devices` 获取在线设备列表
4. 调用 `DELETE /api/plc/device/:id` 删除离线设备

#### 后续功能拓展
- 在线用户实时监控（WebSocket 推送）
- 用户登录设备管理
- 异常登录检测和告警
- 设备心跳异常告警
- 在线时长统计

---

## 🔧 配置说明

### 环境变量配置

项目使用 dotenv 加载环境变量，通过 `.env` 文件配置。

#### 完整配置示例

```env
# ==================== 服务配置 ====================
# 服务端口
PORT = 3000
# 环境模式（development / production / test）
NODE_ENV = development
# 服务前缀
API_PREFIX = /api

# ==================== 数据库配置 ====================
DB_HOST = 127.0.0.1
DB_PORT = 3306
DB_USER = root
DB_PASSWORD = 123456
DB_NAME = nexsm_v2_dev
# 连接池配置
DB_CONNECTION_LIMIT = 10
DB_QUEUE_LIMIT = 0

# ==================== JWT 配置 ====================
JWT_SECRET = your_jwt_secret_key_here
JWT_EXPIRES_IN = 24h
JWT_REFRESH_EXPIRES_IN = 7d

# ==================== 邮件配置 ====================
EMAIL_HOST = smtp.example.com
EMAIL_PORT = 465
EMAIL_SECURE = true
EMAIL_USER = your_email@example.com
EMAIL_PASSWORD = your_email_password
EMAIL_FROM = your_email@example.com
EMAIL_FROM_NAME = nexCM系统

# ==================== PLC 配置 ====================
PLC_PROTOCOL = modbus
PLC_HOST = 127.0.0.1
PLC_PORT = 502
PLC_SLAVE_ID = 1
PLC_POLL_FAST = 200
PLC_POLL_SLOW = 1000

# ==================== 文件上传配置 ====================
UPLOAD_DIR = ./uploads
MAX_FILE_SIZE = 10485760
ALLOWED_FILE_TYPES = jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,lic

# ==================== 日志配置 ====================
LOG_LEVEL = info
LOG_DIR = ./logs
LOG_MAX_FILES = 30
LOG_MAX_SIZE = 10m

# ==================== 缓存配置 ====================
CACHE_TTL = 3600
CACHE_CHECKPERIOD = 600

# ==================== 安全配置 ====================
LOGIN_FAILED_THRESHOLD = 5
LOCK_DURATION_MINUTES = 30
PASSWORD_MIN_LENGTH = 8
SESSION_TIMEOUT = 1800
```

### 模块别名配置

项目使用 module-alias 配置模块路径别名，在 package.json 中配置：

```json
{
  "_moduleAliases": {
    "@root": "./",
    "@bin": "./bin",
    "@public": "./public",
    "@routes": "./routes",
    "@src": "./src"
  }
}
```

使用示例：
```javascript
// 代替 ../../utils/logger
const logger = require('@src/utils/logger');

// 代替 ../../config
const config = require('@src/config');
```

### 数据库配置

数据库连接池配置在 `src/db/index.js` 中：

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'nexsm_v2_dev',
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: process.env.DB_QUEUE_LIMIT || 0,
  waitForConnections: true,
});

module.exports = pool;
```

---

## 📝 开发规范

### 代码规范

- 使用 2 空格缩进
- 使用单引号
- 语句末尾加分号
- 变量命名使用 camelCase
- 类名使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE
- 文件名使用 kebab-case
- 使用 async/await 处理异步操作
- 错误必须处理，不能静默忽略
- 禁止使用 console.log（生产环境）

### API 设计规范

- 使用 RESTful 风格
- 资源名使用复数形式（/users, /roles）
- 使用 HTTP 方法表示操作（GET 查询、POST 新增、PUT 更新、DELETE 删除）
- 接口路径统一前缀 /api
- 版本控制通过路径（/api/v2）
- 请求参数使用 Joi 校验
- 响应格式统一

### 数据库设计规范

- 表名使用小写蛇形命名（user_info, role_permission）
- 主键统一使用 id（自增或 UUID）
- 必须包含 created_at、updated_at 字段
- 软删除使用 is_deleted 字段
- 状态字段使用 tinyint（0/1）
- 外键关联明确
- 索引设计合理

### 模块开发规范

每个业务模块必须包含：
- `*.controller.js` - 控制器，处理 HTTP 请求
- `*.service.js` - 服务层，实现业务逻辑
- `*.model.js` - 模型层，操作数据库
- `*.route.js` - 路由定义
- `*.validation.js` - 参数校验规则（可选）

模块之间通过服务层调用，禁止跨模块直接操作数据库。

### Git 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型说明：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具相关

---

## 🐛 常见问题

### 1. 依赖安装失败

**问题**：`npm install` 失败或速度慢

**解决方案**：
```bash
# 使用国内镜像源
npm config set registry https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 2. 端口被占用

**问题**：启动时提示端口 3000 被占用

**解决方案**：
```bash
# 查看端口占用
netstat -ano | findstr 3000

# 结束占用进程
taskkill /F /PID <进程ID>

# 或修改端口号（.env）
PORT = 3001
```

### 3. 数据库连接失败

**问题**：启动时报数据库连接错误

**解决方案**：
1. 确认 MySQL 服务已启动
2. 检查 `.env` 中的数据库配置（主机、端口、用户名、密码、数据库名）
3. 确认数据库已创建（`CREATE DATABASE nexsm_v2_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`）
4. 确认数据库用户有足够权限
5. 检查防火墙是否允许 3306 端口

### 4. JWT 认证失败

**问题**：接口返回 401 未授权

**解决方案**：
1. 确认请求 Header 中携带了 `Authorization: Bearer <token>`
2. 确认 Token 未过期
3. 检查 `.env` 中的 `JWT_SECRET` 是否正确
4. 确认用户状态为启用
5. 检查用户权限是否包含该接口

### 5. PLC 连接失败

**问题**：PLC 连接状态显示断开

**解决方案**：
1. 确认 PLC 设备已上电并连接网络
2. 检查 `.env` 中的 PLC 配置（协议、主机、端口、从站ID）
3. 确认防火墙允许对应端口
4. 检查 PLC 通信参数是否一致
5. 使用 PLC 调试工具测试连接

### 6. 邮件发送失败

**问题**：测试邮件发送失败

**解决方案**：
1. 检查邮箱配置（SMTP服务器、端口、用户名、密码）
2. 确认邮箱开启了 SMTP 服务
3. 确认使用的是授权码而非登录密码（部分邮箱）
4. 检查网络是否能访问 SMTP 服务器
5. 查看邮件日志中的具体错误信息

---

## 📄 许可证

本项目采用 MIT 许可证。

---

## 📞 联系方式

- **项目作者**：GooHv
- **项目地址**：[仓库地址]
- **问题反馈**：[Issue 地址]

---

## 📅 更新日志

### v1.0.0 (2026-09-04)
- 初始版本发布
- 实现用户认证、用户管理、角色管理、权限管理等核心功能
- 实现菜单管理、部门管理、字典管理、系统配置等系统功能
- 实现审计追踪、通知中心、邮箱管理、授权管理等功能
- 实现部件寿命管理、PLC 通信、设备状态监控等设备功能
- 实现文件上传、在线管理等辅助功能
- 实现 JWT 认证、参数校验、错误处理等基础功能
- 实现 WebSocket 实时通信
- 支持 Modbus RTU/TCP、OPC UA、S7 等多种 PLC 协议
