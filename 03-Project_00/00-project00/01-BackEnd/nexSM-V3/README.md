# nexSM-V2 后端服务

基于 Node.js + Express + MySQL 的工业设备管理系统后端服务，支持 PLC 通讯、用户管理、菜单权限、数据采集等功能。

## 技术栈

- **运行时**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **认证**: JWT
- **参数校验**: Joi
- **PLC 通讯**: modbus-serial (Modbus TCP) / nodes7 (西门子 S7) / node-opcua (OPC UA)

## 快速开始

### 环境要求

- Node.js >= 14
- MySQL >= 5.7

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env`，修改数据库和 PLC 配置：

```bash
cp .env.example .env
```

### 初始化数据库

```bash
mysql -u root -p your_database < init.sql
```

默认管理员账号：`admin / 123456`

### 启动服务

```bash
npm run dev
```

服务地址：`http://localhost:3002`

---

## PLC 通讯模块

工业级 PLC 通讯模块，支持多协议、多设备、批量采集、断线重连、数据持久化、告警规则等生产级特性。

### 模块架构

```
src/plc/
├── index.js                    # 入口（多设备+单设备兼容）
├── config/
│   ├── plcSetting.js           # 全局配置（支持环境变量）
│   └── plcTagMap.js            # 点位映射表
├── protocols/                  # 协议层（独立模块，可切换）
│   ├── BasePlc.js              # 协议抽象基类
│   ├── ModbusTcpClient.js      # Modbus TCP（批量读取优化）
│   ├── S7Client.js             # 西门子 S7
│   └── OpcUaClient.js          # OPC UA（含订阅模式）
├── manager/
│   └── PlcManager.js           # 多设备管理器
├── task/
│   └── PlcPollTask.js          # 轮询任务（多设备+批量+断线重连）
├── storage/
│   └── PlcDataStorage.js       # 数据持久化（JSONL+历史查询）
├── alarm/
│   └── PlcAlarmEngine.js       # 告警规则引擎
├── utils/
│   ├── plcDataConvert.js       # 数据转换（7种类型）
│   └── plcLock.js              # 读写互斥锁
└── README.md                    # 详细使用说明
```

### 核心特性

| 特性 | 说明 |
|------|------|
| **多协议支持** | Modbus TCP / 西门子 S7 / OPC UA，独立模块，切换只需改配置 |
| **多设备管理** | 同时管理多台 PLC，按设备名隔离，统一读写接口 |
| **批量读取优化** | 连续寄存器自动合并为一次请求，10个点位从10次请求降为1次 |
| **7种数据类型** | uint16 / int16 / uint32 / int32 / float / bool / string |
| **断线自动重连** | 连续3次失败自动重连，恢复后继续轮询 |
| **写入安全** | 类型校验 + 范围校验 + 回读验证 + 失败重试 |
| **数据持久化** | 内存缓冲 + 定时刷盘（JSONL），支持历史数据查询 |
| **告警引擎** | 阈值告警 / 变化告警 / 状态告警，支持回调推送 |
| **WebSocket推送** | 数据变化和告警实时推送到前端 |
| **GMP审计** | 写操作预留审计追踪埋点（21CFR Part11） |

### 支持的数据类型

| 类型 | 说明 | 寄存器数 | 取值范围 |
|------|------|---------|---------|
| `uint16` | 无符号16位整数 | 1 | 0 ~ 65535 |
| `int16` | 有符号16位整数 | 1 | -32768 ~ 32767 |
| `uint32` | 无符号32位整数 | 2 | 0 ~ 4294967295 |
| `int32` | 有符号32位整数 | 2 | -2147483648 ~ 2147483647 |
| `float` | 32位浮点数 | 2 | IEEE 754 |
| `bool` | 布尔值 | 1 | true / false |
| `string` | 字符串 | N（length指定） | UTF-8 |

### 配置说明

#### 环境变量配置（推荐）

在 `.env` 中添加：

```bash
# PLC 通讯配置
PLC_PROTOCOL=ModbusTcp      # 协议类型：ModbusTcp / S7 / OpcUa
PLC_HOST=192.168.1.100      # PLC IP 地址
PLC_PORT=502                 # 端口（Modbus:502, S7:102, OPC UA:4840）
PLC_UNIT_ID=1                # Modbus 从站 ID
PLC_RACK=0                   # S7 机架号
PLC_SLOT=1                   # S7 槽号
PLC_FAST_INTERVAL=200        # 高频轮询间隔(ms)
PLC_SLOW_INTERVAL=1000       # 低频轮询间隔(ms)
PLC_RECONNECT_DELAY=3000     # 断线重连等待(ms)
PLC_ENABLE_POLL=true         # 是否开启轮询
PLC_ENABLE_WRITE_AUDIT=true  # 是否开启写审计
PLC_MAX_WRITE_RETRY=1        # 写失败重试次数
```

#### 点位映射配置

编辑 `src/plc/config/plcTagMap.js`：

```js
{
  tag: 'fillVolume',        // 业务字段名（接口用这个，不暴露地址）
  address: 40100,           // Modbus 4x 保持寄存器地址
  type: 'float',             // 数据类型
  rate: 'slow',              // fast 高频 / slow 低频
  rw: 'write',               // read 只读 / write 可写
  desc: '灌装体积（mL）',    // 中文描述
  min: 0,                    // 可选：写入最小值
  max: 1000,                 // 可选：写入最大值
  length: 10                 // string 类型专用：寄存器数量
}
```

### 协议切换

#### 单设备模式（简单项目）

修改 `.env` 中的 `PLC_PROTOCOL`：

```bash
PLC_PROTOCOL=ModbusTcp   # 改为 S7 或 OpcUa
```

#### 多设备模式（大型项目）

在 `src/plc/config/plcSetting.js` 的 `devices` 中配置：

```js
devices: {
  fillMachine: {
    protocol: 'ModbusTcp',
    connection: { host: '192.168.1.10', port: 502, unitId: 1 },
    poll: { fastInterval: 200, slowInterval: 1000 }
  },
  cappingMachine: {
    protocol: 'S7',
    connection: { host: '192.168.1.20', port: 102, rack: 0, slot: 1 },
    poll: { fastInterval: 500, slowInterval: 2000 }
  },
  oven: {
    protocol: 'OpcUa',
    connection: { host: '192.168.1.30', port: 4840 },
    poll: { fastInterval: 1000, slowInterval: 5000 }
  }
}
```

### API 接口

所有接口前缀：`/prod-api/v2/plc`，需要登录鉴权（Header 带 Token）。

#### 获取连接状态

```
GET /plc/status?device=xxx
```

不传 `device` 返回所有设备状态。

#### 读取单个点位

```
GET /plc/read-tag?tag=deviceRunStatus&device=xxx
```

#### 读取所有点位

```
GET /plc/read-all?device=xxx
```

#### 写入点位

```
POST /plc/write-tag
Content-Type: application/json

{
  "tag": "fillVolume",
  "value": 150.5,
  "device": "xxx"
}
```

响应包含 `oldValue`、`newValue`、`readBackValue`、`verified`（回读验证结果）。

### 代码中直接调用

#### 多设备模式（推荐）

```js
const { manager } = require('@/plc')

// 注册设备
manager.registerDevice('fillMachine', config, tagMap)

// 连接所有设备
await manager.connectAll()

// 读取
const temp = await manager.readTag('fillMachine', 'temperature')
const all = await manager.readAllTags('fillMachine')

// 写入
await manager.writeTag('fillMachine', 'setVolume', 150.5)

// 状态
const status = manager.getAllStatus()
```

#### 单设备模式（兼容旧版）

```js
const { getPlcInstance, getTagConfig } = require('@/plc')

const plc = getPlcInstance()
await plc.connect()

const tagConf = getTagConfig('temperature')
const value = await plc.readTag(tagConf)
await plc.writeTag(tagConf, 25.5)
```

### 告警规则引擎

支持三种告警类型：

```js
const { alarm } = require('@/plc')

// 阈值告警
alarm.addRule({
  tag: 'temperature',
  type: 'threshold',
  operator: '>',
  threshold: 80,
  level: 'critical',
  message: '温度过高'
})

// 状态告警
alarm.addRule({
  tag: 'runStatus',
  type: 'status',
  value: 2,
  message: '设备故障'
})

// 变化告警
alarm.addRule({
  tag: 'mode',
  type: 'change',
  message: '模式变化'
})

// 设置告警回调
alarm.setAlarmCallback((alarm) => {
  console.log('告警触发:', alarm.message)
})
```

### 数据持久化

采集数据自动持久化到 JSONL 文件，支持历史查询：

```js
const { storage } = require('@/plc')

// 查询历史数据
const history = await storage.query(
  'fillMachine',      // 设备名
  'temperature',       // 点位名
  Date.now() - 3600000, // 开始时间（1小时前）
  Date.now(),          // 结束时间
  1000                 // 返回条数限制
)
```

数据文件位置：`data/plc/plc-data-YYYY-MM-DD.jsonl`

### 单元测试

测试文件位于 `test/plc/`，使用 Mock PLC 设备，无需真实硬件即可运行。

#### 运行所有测试

```bash
node test/plc/run.js
```

#### 运行指定模块

```bash
node test/plc/run.js modbus        # 只跑 Modbus
node test/plc/run.js s7 opcua      # 跑多个
```

#### 测试覆盖

| 测试文件 | 覆盖内容 |
|---------|---------|
| `basePlc.test.js` | 抽象方法、状态、批量读取 |
| `modbus.test.js` | 数据转换、地址计算、寄存器数量 |
| `s7.test.js` | 配置、地址格式、依赖检查 |
| `opcua.test.js` | 配置、NodeId格式、订阅接口 |
| `manager.test.js` | 注册/连接/读写/缓存/状态 |
| `alarm.test.js` | 阈值/状态/变化告警、去重、回调 |
| `storage.test.js` | 存储/刷盘/查询/定时 |

### 扩展新协议

1. 在 `src/plc/protocols/` 下创建 `XxxClient.js`，继承 `BasePlc`
2. 实现 `connect()`、`disconnect()`、`readTag()`、`writeTag()`
3. 可重写 `readTags()` 实现批量读取优化
4. 在 `src/plc/manager/PlcManager.js` 的 `PROTOCOL_MAP` 中注册
5. 在 `.env` 中设置 `PLC_PROTOCOL=Xxx`

### 依赖安装（按需）

| 协议 | 安装命令 | 说明 |
|------|---------|------|
| Modbus TCP | 已安装 `modbus-serial` | 默认支持 |
| 西门子 S7 | `npm install nodes7` | 用 S7 协议时安装 |
| OPC UA | `npm install node-opcua` | 用 OPC UA 时安装 |

未安装对应依赖时，代码会给出明确提示，不会导致崩溃。

### 注意事项

1. **互斥锁**：同一时间只允许一个读写操作，避免 Modbus 并发冲突
2. **浮点数高低字**：默认交换高低字（`swap=true`），如数据异常可改为 `false`
3. **写入回读验证**：写入后自动回读，`verified` 字段表示是否一致
4. **GMP 审计**：写操作预留了审计埋点，接入审计日志系统后取消注释即可
5. **生产环境**：务必修改 `.env` 中的 PLC 配置，不要使用默认值

---

## 通用基类（BaseService / BaseController）

### 功能说明

所有业务模块的 Service 和 Controller 都继承通用基类，自动拥有标准 CRUD 能力，减少重复代码，统一代码风格。新增模块时只需继承基类并实现特殊业务逻辑。

### 基类结构

```
src/
├── services/
│   └── BaseService.js       # 通用业务逻辑基类（CRUD + 多语言字段处理）
├── controllers/
│   └── BaseController.js    # 通用控制器基类（7个标准REST接口）
└── db/
    └── BaseModel.js         # 通用数据模型基类（已存在）
```

### BaseService 提供的通用方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `getList(params, lang)` | 分页查询列表 | params: 查询参数, lang: 语言 |
| `getAll(lang)` | 获取所有数据（下拉选择用） | lang: 语言 |
| `getById(id, lang)` | 根据 ID 获取详情 | id: 主键, lang: 语言 |
| `create(data)` | 创建数据 | data: 创建数据 |
| `update(id, data)` | 更新数据 | id: 主键, data: 更新数据 |
| `delete(id)` | 删除数据 | id: 主键 |
| `batchDelete(ids)` | 批量删除 | ids: 主键数组 |
| `buildWhere(params)` | 构建查询条件（子类可重写） | params: 查询参数 |
| `processLangFields(data, lang)` | 处理多语言字段 | data: 数据, lang: 语言 |
| `convertLangFieldsToJson(data)` | 字符串转 JSON 格式 | data: 数据 |

### BaseController 提供的通用接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| `getList` | GET | `/list` | 分页查询列表 |
| `getAll` | GET | `/all` | 获取所有数据 |
| `getById` | GET | `/:id` | 根据 ID 获取详情 |
| `create` | POST | `/` | 创建数据 |
| `update` | PUT | `/:id` | 更新数据 |
| `delete` | DELETE | `/:id` | 删除数据 |
| `batchDelete` | POST | `/batch-delete` | 批量删除 |

### 使用方式（新增模块示例）

#### 1. Service 层

```javascript
// src/modules/order/order.service.js
const BaseService = require('../../services/BaseService')
const orderModel = require('./order.model')

class OrderService extends BaseService {
  constructor() {
    super(orderModel, {
      name: '订单',
      langFields: ['order_name', 'description']  // 需要多语言处理的字段
    })
  }

  // 特殊业务逻辑（通用 CRUD 已由基类提供）
  async getOrderStatistics(params) {
    // ... 自定义方法
  }

  // 重写 buildWhere 实现自定义查询条件
  buildWhere(params = {}) {
    const where = {}
    if (params.status) where.status = params.status
    if (params.customer_id) where.customer_id = params.customer_id
    return where
  }
}

module.exports = new OrderService()
```

#### 2. Controller 层

```javascript
// src/modules/order/order.controller.js
const BaseController = require('../../controllers/BaseController')
const orderService = require('./order.service')

class OrderController extends BaseController {
  constructor() {
    super(orderService)
  }

  // 特殊接口（通用 CRUD 已由基类提供）
  async getStatistics(req, res) {
    const result = await orderService.getOrderStatistics(req.query)
    res.success(result)
  }
}

module.exports = new OrderController()
```

#### 3. 路由层

```javascript
// src/modules/order/order.route.js
const router = require('express').Router()
const orderController = require('./order.controller')
const { requireAuth } = require('../../middleware/auth.middleware')

// 通用 CRUD 路由（继承自 BaseController）
router.get('/list', requireAuth, orderController.getList)
router.get('/all', requireAuth, orderController.getAll)
router.get('/:id', requireAuth, orderController.getById)
router.post('/', requireAuth, orderController.create)
router.put('/:id', requireAuth, orderController.update)
router.delete('/:id', requireAuth, orderController.delete)
router.post('/batch-delete', requireAuth, orderController.batchDelete)

// 特殊接口
router.get('/statistics/list', requireAuth, orderController.getStatistics)

module.exports = router
```

### 已继承基类的模块

| 模块 | Service | Controller | 特殊处理 |
|------|---------|------------|----------|
| 用户管理 | ✅ UserService | ✅ UserController | 保留登录/注册/电子签名等特殊功能 |
| 角色管理 | ✅ RoleService | ✅ RoleController | 保留角色菜单权限关联 |
| 部门管理 | ✅ DeptService | ✅ DeptController | 保留部门树形结构构建 |
| 数据字典 | ✅ DictService | ✅ DictController | 以字典类型为主模型，保留字典项子模块 |
| 审计追踪 | ✅ AuditService | ✅ AuditController | 重写 update/delete 抛出错误（只增不改不删） |
| 通知中心 | ✅ NotificationService | ✅ NotificationController | 保留用户权限校验和 WebSocket 推送 |

### 多语言字段配置

在构造函数的 `super` 调用中配置 `langFields` 数组，基类会自动处理：
- 查询时：自动将 JSON 字段转换为对应语言的字符串
- 创建/更新时：自动将字符串转换为 JSON 格式 `{"zh-CN": "...", "en-US": "..."}`

```javascript
constructor() {
  super(model, {
    name: '模块名称',
    langFields: ['field1', 'field2']  // 需要多语言处理的字段名
  })
}
```

---

## 代码注释规范

### 规范文档

详细的代码注释规范请参考：`docs/CODE_COMMENT_STANDARD.md`

### 规范要点

1. **文件头部注释**：每个文件顶部包含模块名称、功能描述、作者、日期、最后修改时间
2. **类注释**：每个类包含类说明和使用示例
3. **方法注释**：JSDoc 格式，包含参数、返回值、异常、示例
4. **参数注释**：每个参数都有类型和说明，可选参数标注默认值
5. **返回值注释**：每个返回值都有类型和说明
6. **特殊功能标注**：GMP 合规、电子签名、哈希链等特殊功能都有明确标注
7. **TODO 注释**：使用 `TODO`、`FIXME`、`NOTE` 等关键字标记未完成的代码

### 示例

```javascript
/**
 * 用户管理模块 - 业务逻辑层
 * 
 * 处理用户的登录、注册、增删改查、密码重置、状态变更等业务逻辑
 * 包含登录失败锁定、电子签名密码验证、审计日志记录等特殊功能
 * 继承 BaseService，复用通用 CRUD 操作
 * 
 * @author nexCM Team
 * @date 2026-01-01
 * @lastModified 2026-08-22
 */
class UserService extends BaseService {
  /**
   * 用户登录
   * 
   * 包含账户锁定检查、密码校验、登录失败次数统计、Token 生成、登录信息更新、审计日志记录
   * 连续失败 5 次会锁定账户 30 分钟
   * 
   * @param {string} username - 用户名
   * @param {string} password - 密码（明文）
   * @param {string} ip - 登录 IP 地址
   * @param {string} [userAgent=''] - 浏览器 User-Agent
   * @param {string} [lang='zh-CN'] - 语言代码
   * @returns {Promise<Object>} { token, userInfo }
   * @throws {BusinessError} 用户不存在/账号禁用/密码错误/账户锁定
   * 
   * @example
   * const result = await userService.login('admin', '123456', '127.0.0.1', 'Mozilla/5.0')
   * console.log(result.token) // JWT Token
   */
  async login(username, password, ip, userAgent = '', lang = 'zh-CN') {
    // ... 实现
  }
}
```

---

## 单元测试

### 测试框架

- **框架**：Jest 29.7.0
- **目录**：`test/`
- **运行命令**：`npm test`

### 目录结构

```
test/
├── README.md              # 总测试说明文档
├── utils/                 # 工具函数测试
│   ├── README.md
│   └── i18n.test.js       # 多语言工具函数测试（20+ 用例）
├── user/                  # 用户管理模块测试
│   ├── README.md
│   ├── user.service.test.js
│   ├── user.model.test.js
│   └── user.controller.test.js
├── audit/                 # 审计追踪模块测试
│   ├── README.md
│   ├── audit.service.test.js
│   ├── audit.model.test.js
│   └── audit.controller.test.js
├── dict/                  # 数据字典模块测试
│   ├── README.md
│   ├── dict.service.test.js
│   ├── dict.model.test.js
│   └── dict.controller.test.js
├── role/                  # 角色管理模块测试
│   ├── README.md
│   ├── role.service.test.js
│   ├── role.model.test.js
│   └── role.controller.test.js
├── dept/                  # 部门管理模块测试
│   ├── README.md
│   ├── dept.service.test.js
│   ├── dept.model.test.js
│   └── dept.controller.test.js
├── notification/          # 通知中心模块测试
│   ├── README.md
│   ├── notification.service.test.js
│   ├── notification.model.test.js
│   └── notification.controller.test.js
├── plc/                   # PLC 模块测试（Mock 设备，无需真实硬件）
│   └── ...
└── sql/                   # SQL 相关测试
    └── ...
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行指定模块的测试
npm test -- test/user
npm test -- test/audit

# 运行单个测试文件
npm test -- test/utils/i18n.test.js

# 运行测试并显示覆盖率
npm test -- --coverage
```

### 测试规范

1. **Mock 方式**：所有测试采用 `jest.mock()` 方式，无需真实数据库即可运行
2. **三层测试**：每个模块包含 service（业务逻辑）、model（数据模型）、controller（控制器）三层测试
3. **README 说明**：每个模块目录下都有 README.md，说明测试覆盖范围和运行方式
4. **测试用例命名**：使用中文描述，清晰说明测试场景和预期结果

---

## 项目结构

```
src/
├── config/          # 配置文件
├── constants/       # 常量定义（错误码等）
├── controllers/     # 通用控制器基类（BaseController）
├── db/              # 数据库连接 + BaseModel 数据模型基类
├── docs/            # 文档（代码注释规范等）
├── middleware/      # 中间件（认证、错误处理、响应格式等）
├── modules/         # 业务模块（自动加载路由）
│   ├── user/        # 用户管理（model/service/controller/route/schema）
│   ├── audit/       # 审计追踪（GMP 21CFR Part 11，含 auditLogger 统一入口）
│   ├── plc/         # PLC 接口层（controller/route/service）
│   ├── dict/        # 数据字典管理（类型+项两级）
│   ├── role/        # 角色管理（含菜单权限关联）
│   ├── dept/        # 部门管理（树形结构）
│   ├── notification/# 通知中心（含 WebSocket 推送）
│   ├── customer/    # 客户管理
│   ├── menu/        # 菜单管理（含版本号缓存）
│   ├── captcha/     # 验证码
│   └── upload/      # 文件上传
├── plc/             # PLC 通讯核心模块（独立可切换协议）
├── services/        # 通用业务逻辑基类（BaseService）
├── socket/          # WebSocket
└── utils/           # 工具函数
test/                # 单元测试（按模块分目录）
docs/                # 项目文档
init.sql             # 数据库初始化脚本（客户版，只有表结构）
init_test.sql        # 数据库初始化脚本（测试版，含测试数据）
```

## 数据库表

- `nex_user` - 系统用户表
- `nex_menu` - 系统菜单表
- `nex_user_menu` - 用户菜单关联表
- `nex_audit_log` - 审计日志表（GMP 21CFR Part 11 电子记录）
- `nex_role` - 角色表（含数据范围配置）
- `nex_role_menu` - 角色菜单关联表
- `nex_dept` - 部门表（树形结构）
- `nex_dict_type` - 字典类型表
- `nex_dict_item` - 字典项表
- `nex_notification` - 通知表

## GMP 审计追踪（21CFR Part 11 合规）

### 功能说明

符合 GMP 21CFR Part 11 电子记录与电子签名要求，独立模块化设计，其他业务模块通过 `auditLogger` 统一入口记录日志，低耦合可扩展。

### 模块结构

```
src/modules/audit/
├── audit.model.js       # 数据模型（哈希链 SHA-256、数据库操作）
├── audit.service.js     # 业务逻辑（创建、查询、哈希链校验）
├── audit.controller.js  # 控制器（API 接口）
├── audit.route.js       # 路由（自动加载）
├── auditLogger.js       # ★ 对外统一入口（其他模块只依赖此文件）
└── README.md            # 模块详细文档
```

### 核心特性

| 特性 | 实现方式 | 说明 |
|------|---------|------|
| **哈希链防篡改** | SHA-256 哈希链，每条记录包含前一条的哈希 | 任何一条记录被修改，后续哈希链全部断裂 |
| **只增不改不删** | 数据库触发器禁止 UPDATE/DELETE | 审计日志一旦写入，无法修改或删除 |
| **统一入口** | `auditLogger.log()` 封装所有细节 | 其他模块无需关心内部实现 |
| **操作人追踪** | 自动从 req 提取 userId/userName/ip/userAgent | 谁在什么时间什么地点做了什么 |
| **操作原因** | 关键操作必须填写 reason | GMP 要求"为什么做" |

### 自动记录的操作

| 操作 | 记录内容 |
|------|---------|
| 用户登录成功/失败 | 用户名、IP、结果、失败原因（含锁定） |
| 用户注册 | 用户名、IP |
| 新增/修改/删除用户 | 操作人、目标用户、修改前后值、原因 |
| 批量删除用户 | 操作人、目标ID列表、原因 |
| 修改用户状态 | 操作人、目标用户、状态变化、原因 |
| PLC 参数修改 | 操作人、点位、修改前后值、回读验证、原因、电子签名 |

### 数据库表结构

`nex_audit_log` 表字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键自增 |
| user_id | int | 操作人ID |
| user_name | varchar(50) | 操作人姓名 |
| action | varchar(100) | 操作类型 |
| target | varchar(200) | 操作对象 |
| old_value | text | 修改前值 |
| new_value | text | 修改后值 |
| result | varchar(20) | 操作结果 success/failed/verify_failed |
| reason | varchar(500) | 操作原因（GMP要求，电子签名时必填） |
| ip | varchar(50) | 操作IP |
| user_agent | varchar(500) | 浏览器UA |
| prev_hash | varchar(64) | 前一条记录哈希值（哈希链，防篡改） |
| current_hash | varchar(64) | 当前记录哈希值（SHA-256） |
| created_at | datetime | 操作时间 |

**数据库触发器（GMP合规）**：
- `trg_audit_log_no_update`：禁止 UPDATE 操作
- `trg_audit_log_no_delete`：禁止 DELETE 操作

### API 接口

| 接口 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/prod-api/v2/audit/list` | GET | 分页查询全部审计日志，支持 `userName`/`action`/`target`/`startTime`/`endTime`/`page`/`pageSize` 筛选 | 管理员 |
| `/prod-api/v2/audit/my` | GET | 查询当前登录用户的操作记录 | 登录 |
| `/prod-api/v2/audit/verify` | GET | 校验哈希链完整性，返回 `{ valid, brokenAt, total }` | 管理员 |

### 代码中调用（推荐使用 auditLogger）

```js
const auditLogger = require('@/modules/audit/auditLogger')

// 方式一：传入 req，自动提取 userId/userName/ip/userAgent（推荐）
await auditLogger.log(req, {
  action: auditLogger.ACTION.PLC_WRITE,  // 使用预定义常量
  target: 'fillVolume (灌装体积)',
  oldValue: '100.0',
  newValue: '150.5',
  result: 'success',
  reason: '工艺调整'
})

// 方式二：手动传入操作人信息
await auditLogger.log({ userId: 1, userName: 'admin', ip: '127.0.0.1' }, {
  action: '自定义操作类型',
  target: '操作对象',
  result: 'success'
})

// 方式三：使用快捷方法
await auditLogger.logUserUpdate(req, target, oldValue, newValue)
await auditLogger.logPlcWrite(req, target, oldValue, newValue, reason)
await auditLogger.logExport(req, target)
```

**操作类型常量**（`auditLogger.ACTION`）：
- 用户相关：`USER_REGISTER` / `USER_LOGIN` / `USER_LOGIN_FAILED` / `USER_CREATE` / `USER_UPDATE` / `USER_DELETE` / `USER_BATCH_DELETE` / `USER_STATUS_CHANGE`
- PLC 相关：`PLC_WRITE` / `PLC_READ` / `PLC_CONNECT` / `PLC_DISCONNECT`
- 系统相关：`SYSTEM_CONFIG_CHANGE` / `SYSTEM_EXPORT` / `SYSTEM_IMPORT`
- 审计相关：`AUDIT_VERIFY`

**操作类型字典翻译**：
审计日志中的 `action` 字段存储的是英文编码（如 `PLC_WRITE`、`USER_CREATE`），前端展示时通过数据字典 `audit_action` 自动翻译为对应语言的中文/英文名称。
- 字典编码：`audit_action`
- 字典值：与 `auditLogger.ACTION` 常量一一对应
- 前端展示：通过 `DictTag` 组件或字典翻译函数自动转换

### 模块独立化设计原则

1. **单一入口**：其他模块只依赖 `auditLogger.js`，不直接引用 `audit.service.js`
2. **内部封装**：哈希链计算、数据库操作、操作人提取全部封装在模块内部
3. **可扩展**：新增操作类型、字段、存储方式不影响外部调用
4. **容错性**：审计日志写入失败不影响主业务流程（catch 后返回 null）

### 配置

```bash
# .env 中开启 PLC 写操作审计
PLC_ENABLE_WRITE_AUDIT=true
```

## 多语言数据存储方案（JSON 字段）

### 功能说明

采用 JSON 字段存储配置类数据的多语言内容，支持中英文切换，开发简单、数据集中、扩展性好，适合字典、角色、部门等配置类小表。

### 存储格式

所有需要翻译的字段都存储为 JSON 格式：

```json
{
  "zh-CN": "中文值",
  "en-US": "English Value"
}
```

### 已应用的表

| 表名 | 字段 | 说明 |
|------|------|------|
| `nex_dict_type` | `dict_name`, `description` | 字典类型名称和描述 |
| `nex_dict_item` | `label` | 字典项标签 |
| `nex_role` | `role_name`, `description` | 角色名称和描述 |
| `nex_dept` | `dept_name` | 部门名称 |

### 工具函数

`src/utils/i18n.js` 提供了多语言处理工具：

```javascript
const { getLangValue, processLangFields, getLangFromRequest, buildLangObject } = require('@/utils/i18n')

// 根据语言获取对应值
const value = getLangValue(jsonField, 'zh-CN')

// 处理查询结果中的多语言字段
const processed = processLangFields(result, ['dict_name', 'description'], 'zh-CN')

// 从请求中获取语言参数
const lang = getLangFromRequest(req)

// 构建多语言对象
const jsonField = buildLangObject('中文值', 'English Value')
```

### API 使用方式

所有查询接口都支持 `lang` 参数，指定返回的语言：

```bash
# 获取中文数据
GET /prod-api/v2/dict/list?lang=zh-CN

# 获取英文数据
GET /prod-api/v2/dict/list?lang=en-US
```

前端请求拦截器会自动带上当前语言参数，无需手动处理。

### 数据库初始化

项目提供两个版本的初始化 SQL：

| 文件名 | 说明 | 使用场景 |
|--------|------|----------|
| `init.sql` | 只有表结构，无数据 | 提供给客户，客户自行初始化数据 |
| `init_test.sql` | 包含测试数据 | 开发测试使用 |

```bash
# 客户版（只有表结构）
mysql -u root -p your_database < init.sql

# 测试版（包含测试数据）
mysql -u root -p your_database < init_test.sql
```

## 数据字典管理

### 功能说明

统一管理系统中的枚举值（如用户状态、性别、角色等），支持字典类型和字典项两级管理，前端 DictTag 组件可根据字典编码自动加载并渲染标签。

### 模块结构

```
src/modules/dict/
├── dict.model.js       # 数据模型（字典类型 + 字典项）
├── dict.service.js     # 业务逻辑
├── dict.controller.js  # 控制器
├── dict.route.js       # 路由（自动加载）
└── dict.schema.js      # Joi 参数校验
```

### 数据库表

- `nex_dict_type`：字典类型表（dict_name, dict_code, status, sort）
- `nex_dict_item`：字典项表（type_id, label, value, css_class, list_class, is_default, status, sort）

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/prod-api/v2/dict/type` | GET | 分页查询字典类型列表 |
| `/prod-api/v2/dict/type` | POST | 创建字典类型 |
| `/prod-api/v2/dict/type/:id` | PUT | 更新字典类型 |
| `/prod-api/v2/dict/type/:id` | DELETE | 删除字典类型（级联删除字典项） |
| `/prod-api/v2/dict/item` | GET | 分页查询字典项列表 |
| `/prod-api/v2/dict/items/:code` | GET | 根据字典类型编码获取字典项（前端用） |
| `/prod-api/v2/dict/items/batch` | POST | 批量获取多个字典类型的字典项 |
| `/prod-api/v2/dict/item` | POST | 创建字典项 |
| `/prod-api/v2/dict/item/:id` | PUT | 更新字典项 |
| `/prod-api/v2/dict/item/:id` | DELETE | 删除字典项 |

### 使用场景

- 用户状态、性别、角色等枚举值的统一管理
- 前端表格中使用 DictTag 组件自动渲染带颜色的标签
- 避免硬编码枚举值，支持动态配置

## 角色管理

### 功能说明

管理系统角色，支持角色的增删改查，以及角色与菜单权限的关联分配。每个角色可配置数据范围（全部/本部门/本部门及子部门/仅本人）。

### 模块结构

```
src/modules/role/
├── role.model.js       # 数据模型（角色表 + 角色菜单关联表）
├── role.service.js     # 业务逻辑
├── role.controller.js  # 控制器
├── role.route.js       # 路由（自动加载）
└── role.schema.js      # Joi 参数校验
```

### 数据库表

- `nex_role`：角色表（role_name, role_code, description, data_scope, status, sort）
- `nex_role_menu`：角色菜单关联表（role_id, menu_id）

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/prod-api/v2/role/all` | GET | 获取所有启用的角色（下拉选择用） |
| `/prod-api/v2/role/` | GET | 分页查询角色列表 |
| `/prod-api/v2/role/:id` | GET | 获取角色详情（含菜单权限） |
| `/prod-api/v2/role/` | POST | 创建角色（支持 menuIds 数组） |
| `/prod-api/v2/role/:id` | PUT | 更新角色（支持 menuIds 数组） |
| `/prod-api/v2/role/:id` | DELETE | 删除角色（级联删除菜单关联） |

### 数据范围说明

| data_scope | 说明 |
|------------|------|
| `all` | 全部数据 |
| `dept` | 本部门数据 |
| `dept_and_child` | 本部门及子部门数据 |
| `self` | 仅本人数据 |

### 使用场景

- 系统角色的动态配置，避免硬编码角色
- 角色与菜单权限的关联分配
- 配合行级数据权限中间件实现数据范围控制

## 部门管理

### 功能说明

管理组织架构，支持树形结构的部门管理，包括部门的增删改查，以及部门负责人、联系方式等信息。

### 模块结构

```
src/modules/dept/
├── dept.model.js       # 数据模型（树形结构）
├── dept.service.js     # 业务逻辑（构建树、递归查询子部门）
├── dept.controller.js  # 控制器
├── dept.route.js       # 路由（自动加载）
└── dept.schema.js      # Joi 参数校验
```

### 数据库表

- `nex_dept`：部门表（parent_id, dept_name, order_num, leader, phone, email, status）

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/prod-api/v2/dept/tree` | GET | 获取部门树 |
| `/prod-api/v2/dept/:id` | GET | 获取部门详情 |
| `/prod-api/v2/dept/` | POST | 创建部门 |
| `/prod-api/v2/dept/:id` | PUT | 更新部门 |
| `/prod-api/v2/dept/:id` | DELETE | 删除部门（有子部门时禁止删除） |

### 使用场景

- 企业组织架构管理
- 配合角色管理实现按部门的数据权限控制
- 用户所属部门的关联

## Swagger API 文档

### 功能说明

集成 Swagger UI，自动生成 API 接口文档，支持在线调试。仅在开发环境启用。

### 访问地址

```
http://localhost:3002/api-docs
```

### 配置

```js
// src/config/swagger.js - Swagger 配置
// 自动扫描 src/modules/*/*.route.js 和 *.controller.js 中的注释
```

### 使用方式

1. 启动服务后访问 `http://localhost:3002/api-docs`
2. 点击右上角 "Authorize" 按钮，输入 `Bearer <token>` 进行认证
3. 选择任意接口，点击 "Try it out" 进行在线调试

### 注意事项

- 生产环境自动禁用（`NODE_ENV=production`）
- 接口注释需按照 OpenAPI 3.0 规范编写

## WebSocket 实时推送

### 功能说明

通用 WebSocket 服务，支持按用户推送消息、广播消息、心跳检测、自动重连。可用于实时通知、PLC 数据推送、系统消息等场景。

### 模块结构

```
src/socket/
├── wsManager.js    # 通用 WebSocket 管理器（推荐）
└── plcSocket.js    # PLC 专用 WebSocket（历史保留）
```

### 服务端使用

```js
// app.js 中初始化（已自动完成）
const wsManager = require('./src/socket/wsManager')
wsManager.init(server)

// 业务代码中推送消息
const wsManager = require('@/socket/wsManager')

// 向指定用户推送
wsManager.sendToUser(userId, {
  type: 'notification',
  data: { title: '新通知', content: '...' }
})

// 广播消息
wsManager.broadcast({ type: 'system', data: {...} })

// 获取在线用户数
wsManager.getOnlineUserCount()
```

### 客户端使用

```js
// src/utils/websocket.js
import { websocket } from '@/utils/websocket'

// 连接
websocket.connect(userId)

// 订阅消息
websocket.on('notification', (data) => {
  console.log('收到通知:', data)
})

// 发送消息
websocket.send({ type: 'ping' })

// 断开连接
websocket.disconnect()
```

### 消息协议

```json
// 客户端认证
{ "type": "auth", "userId": 1 }

// 心跳
{ "type": "ping" }

// 服务端推送
{ "type": "notification", "data": {...} }
```

### 使用场景

- 实时通知推送
- PLC 数据实时更新
- 系统公告广播
- 在线状态管理

## 行级数据权限

### 功能说明

基于角色的数据范围控制，支持四种数据范围：全部数据、本部门数据、本部门及子部门数据、仅本人数据。通过中间件自动注入数据范围条件。

### 模块结构

```
src/middleware/
└── dataScope.middleware.js    # 数据权限中间件
```

### 使用方式

```js
// 方式一：路由中间件
const { dataScope } = require('@/middleware/dataScope.middleware')
router.get('/', requireAuth, dataScope('u'), controller.getList)

// 方式二：Service 中构建条件
const { buildDataScopeCondition } = require('@/middleware/dataScope.middleware')
const condition = buildDataScopeCondition(req, 'create_by', 'dept_id')
const sql = `SELECT * FROM table WHERE ${condition}`
```

### 数据范围说明

| 范围 | 说明 | SQL 条件 |
|------|------|---------|
| `all` | 全部数据 | `1=1` |
| `dept` | 本部门数据 | `dept_id = 用户部门ID` |
| `dept_and_child` | 本部门及子部门 | `dept_id IN (子部门ID列表)` |
| `self` | 仅本人数据 | `create_by = 当前用户名` |

### 使用场景

- 不同角色看到不同范围的数据
- 部门经理只能看到本部门数据
- 普通员工只能看到自己创建的数据

## 通知中心

### 功能说明

系统通知管理，支持通知的创建、查询、标记已读、删除，配合 WebSocket 实现实时推送。通知类型包括：系统通知、PLC 告警、用户相关、审计相关等。

### 模块结构

```
src/modules/notification/
├── notification.model.js       # 数据模型
├── notification.service.js     # 业务逻辑（含 WebSocket 推送）
├── notification.controller.js  # 控制器
└── notification.route.js       # 路由（自动加载）
```

### 数据库表

- `nex_notification`：通知表（user_id, title, content, type, priority, link, is_read, read_time, created_at）

### API 接口

| 接口 | 方法 | 说明 | 鉴权 |
|------|------|------|------|
| `/prod-api/v2/notification/unread-count` | GET | 获取未读通知数量 | 是 |
| `/prod-api/v2/notification/` | GET | 分页查询通知列表（支持 `isRead` 筛选） | 是 |
| `/prod-api/v2/notification/:id` | GET | 获取通知详情（自动标记已读） | 是 |
| `/prod-api/v2/notification/` | POST | **创建通知**（给指定用户或广播），自动保存数据库 + WebSocket 实时推送 | 是 |
| `/prod-api/v2/notification/:id/read` | PUT | 标记为已读 | 是 |
| `/prod-api/v2/notification/read-all` | PUT | 全部标记为已读 | 是 |
| `/prod-api/v2/notification/:id` | DELETE | 删除通知 | 是 |

#### 创建通知接口（业务逻辑中常用）

**请求方式**：`POST /prod-api/v2/notification/`

**请求体**：

```json
// 方式一：给指定用户发送
{
  "userId": 1,
  "title": "PLC 告警",
  "content": "设备温度过高，请及时处理",
  "type": "plc",
  "priority": "high",
  "link": "/plc/monitor"
}

// 方式二：广播给所有用户
{
  "broadcast": true,
  "title": "系统公告",
  "content": "系统将于今晚 22:00 进行维护",
  "type": "system",
  "priority": "normal"
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | Number | 否（broadcast 时不需要） | 接收通知的用户 ID |
| broadcast | Boolean | 否 | 是否广播给所有用户，默认 false |
| title | String | 是 | 通知标题 |
| content | String | 是 | 通知内容 |
| type | String | 否 | 通知类型：system / plc / user / audit，默认 system |
| priority | String | 否 | 优先级：normal / high / critical，默认 normal |
| link | String | 否 | 点击通知跳转的前端路由 |

**响应**：

```json
{
  "code": 200,
  "msg": "通知发送成功",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "PLC 告警",
    "content": "设备温度过高",
    "type": "plc",
    "priority": "high",
    "is_read": 0,
    "created_at": "2026-08-22 10:00:00"
  }
}
```

**说明**：创建通知后，系统会自动：
1. 保存到 `nex_notification` 数据库表
2. 通过 WebSocket 实时推送给目标用户（前端铃铛角标自动更新）
3. 广播时推送给所有在线用户

### 代码中发送通知（业务逻辑推荐用法）

在业务模块中直接调用 `notificationService.sendNotification()`，会自动保存数据库 + WebSocket 实时推送：

```js
const notificationService = require('@/modules/notification/notification.service')

// 方式一：给指定用户发送通知
await notificationService.sendNotification({
  userId: 1,
  title: 'PLC 告警',
  content: '设备温度过高，请及时处理',
  type: 'plc',
  priority: 'high',
  link: '/plc/monitor'  // 可选，点击通知跳转的前端路由
})

// 方式二：批量发送给多个用户
await notificationService.sendBatchNotifications([1, 2, 3], {
  title: '系统公告',
  content: '系统将于今晚 22:00 进行维护',
  type: 'system',
  priority: 'normal'
})

// 方式三：广播给所有用户
await notificationService.broadcastNotification({
  title: '紧急通知',
  content: '设备故障，请立即处理',
  type: 'plc',
  priority: 'critical'
})
```

#### 业务场景示例

**1. PLC 告警触发时通知管理员**

```js
// src/modules/plc/plc.service.js
const notificationService = require('@/modules/notification/notification.service')

async function handleAlarm(alarmData) {
  // ... 处理告警逻辑
  
  // 通知所有管理员
  await notificationService.broadcastNotification({
    title: `PLC告警: ${alarmData.tagName}`,
    content: `${alarmData.tagName} 当前值 ${alarmData.value}，超出阈值 ${alarmData.threshold}`,
    type: 'plc',
    priority: alarmData.level === 'critical' ? 'critical' : 'high',
    link: '/plc/monitor'
  })
}
```

**2. 用户注册成功后通知管理员审核**

```js
// src/modules/user/user.service.js
const notificationService = require('@/modules/notification/notification.service')

async function registerUser(userData) {
  const user = await createUser(userData)
  
  // 通知所有管理员有新用户注册
  await notificationService.broadcastNotification({
    title: '新用户注册',
    content: `用户 ${user.username} 已注册，请及时审核`,
    type: 'user',
    priority: 'normal',
    link: '/system/user'
  })
  
  return user
}
```

**3. 审批流程通知**

```js
// 提交审批后通知审批人
await notificationService.sendNotification({
  userId: approverId,
  title: '待审批提醒',
  content: `您有一条新的审批待处理：${approval.title}`,
  type: 'system',
  priority: 'normal',
  link: `/approval/detail/${approval.id}`
})
```

**4. 操作结果反馈**

```js
// 数据导出完成后通知用户
await notificationService.sendNotification({
  userId: req.user.id,
  title: '导出完成',
  content: '您请求的用户数据导出已完成，请点击查看',
  type: 'system',
  priority: 'normal',
  link: '/download/export'
})
```

### 通知类型与优先级

| type | 说明 | 适用场景 |
|------|------|---------|
| `system` | 系统通知 | 系统公告、维护通知、操作结果反馈 |
| `plc` | PLC 告警/状态 | 设备告警、参数异常、状态变化 |
| `user` | 用户相关 | 新用户注册、账号状态变更、权限变更 |
| `audit` | 审计相关 | 审计告警、合规提醒 |

| priority | 说明 | 前端表现 |
|----------|------|---------|
| `normal` | 普通 | 蓝色标识 |
| `high` | 高优先级 | 橙色标识 |
| `critical` | 紧急 | 红色标识，可能伴随弹窗提醒 |

### 使用场景

- **系统公告推送**：管理员发布系统公告，广播给所有用户
- **PLC 告警实时通知**：设备参数异常时，实时推送给管理员和工程师
- **操作结果反馈**：导出、批量操作等耗时任务完成后通知用户
- **审批流程通知**：提交审批后通知审批人，审批结果通知申请人
- **新用户注册提醒**：新用户注册后通知管理员审核
- **账号安全提醒**：异地登录、密码修改等安全事件通知

### 前端接收通知

前端登录后自动建立 WebSocket 连接，接收实时通知：

```js
// src/utils/websocket.js（已集成，无需额外配置）
import { websocket } from '@/utils/websocket'

// 登录后自动连接（permission.js 中已处理）
// 登出时自动断开（user store 中已处理）

// 订阅通知消息（NotificationBell 组件中已处理）
websocket.on('notification', (data) => {
  // data: { id, title, content, type, priority, link, created_at }
  console.log('收到通知:', data)
})
```

**前端组件**：
- `src/components/NotificationBell/index.vue` — Navbar 铃铛图标，显示未读角标，点击展开最近通知
- `src/views/notification/index.vue` — 通知中心完整页面，支持全部/未读/已读筛选

## 系统配置模块

### 功能说明
系统配置模块提供统一的配置管理，支持前后端配置持久化和实时生效。配置项按分类管理，包括系统设置、安全设置、设备连接、导出设置、连接设置等。

### 数据库表
`nex_system_config` — 系统配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| config_key | VARCHAR(100) | 配置键（唯一） |
| config_value | TEXT | 配置值 |
| config_type | VARCHAR(20) | 配置类型：string/number/boolean/json |
| description | VARCHAR(200) | 配置描述 |
| category | VARCHAR(50) | 配置分类：system/security/plc/export/connection |
| sort | INT | 排序号 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/prod-api/v2/config/` | 获取所有配置 |
| GET | `/prod-api/v2/config/category/:category` | 根据分类获取配置 |
| PUT | `/prod-api/v2/config/` | 批量更新配置 |
| POST | `/prod-api/v2/config/reset` | 重置所有配置为默认值 |

### 配置项清单

#### 系统设置 (system)
| 配置键 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| sessionTimeout | number | 30 | 会话超时时间（分钟） |
| defaultPageSize | number | 20 | 默认每页条数 |
| defaultLanguage | string | zh-CN | 默认语言 |
| dateFormat | string | YYYY-MM-DD | 日期显示格式 |

#### 安全设置 (security)
| 配置键 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| watermarkEnabled | boolean | false | 是否启用水印 |
| watermarkText | string | '' | 水印文字（为空时使用当前用户名） |

#### 设备连接设置 (plc)
| 配置键 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| plcProtocol | string | ModbusTcp | 通信协议 |
| plcHost | string | 127.0.0.1 | 设备IP地址 |
| plcPort | number | 502 | 设备端口 |
| plcUnitId | number | 1 | Modbus单元ID |
| pollFastInterval | number | 200 | 快速轮询间隔（ms） |
| pollSlowInterval | number | 1000 | 慢速轮询间隔（ms） |

#### 导出设置 (export)
| 配置键 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| pdfWatermarkEnabled | boolean | true | PDF导出水印开关 |
| pdfWatermarkText | string | '' | PDF水印文字（为空时使用当前用户名） |

#### 连接设置 (connection)
| 配置键 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| heartbeatInterval | number | 25000 | WebSocket心跳间隔（ms） |

### 后端使用方式

```javascript
const configService = require('./src/modules/config/config.service')

// 获取所有配置
const configs = await configService.getAllConfigs()

// 获取单个配置值
const heartbeatInterval = await configService.getConfigValue('heartbeatInterval', 25000)

// 根据分类获取配置
const systemConfigs = await configService.getConfigsByCategory('system')

// 批量更新配置
await configService.updateConfigs({
  heartbeatInterval: 30000,
  sessionTimeout: 60
})

// 重置所有配置
await configService.resetAllConfigs()
```

### 前端使用方式

```javascript
import { loadConfig, getConfig, applyConfig } from '@/utils/config'

// 应用启动时加载配置
await loadConfig()

// 获取配置值
const heartbeatInterval = getConfig('heartbeatInterval', 25000)

// 更新配置并实时生效
applyConfig({ heartbeatInterval: 30000 })
```

### 实时生效说明
配置保存后，以下配置项会实时生效：
- `heartbeatInterval` — WebSocket 心跳间隔
- `sessionTimeout` — 会话超时时间
- `defaultPageSize` — 默认每页条数

其他配置项（如 PLC 连接参数）需要重新连接设备后生效。

## 许可证

MIT
