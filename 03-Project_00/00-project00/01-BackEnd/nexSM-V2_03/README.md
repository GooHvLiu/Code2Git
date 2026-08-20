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

## 项目结构

```
src/
├── config/          # 配置文件
├── constants/       # 常量定义（错误码等）
├── db/              # 数据库连接
├── middleware/      # 中间件（认证、错误处理、响应格式等）
├── modules/         # 业务模块
│   ├── user/        # 用户管理
│   ├── plc/         # PLC 接口层
│   ├── customer/    # 客户管理
│   └── ...
├── plc/             # PLC 通讯核心模块
├── socket/          # WebSocket
└── utils/           # 工具函数
```

## 数据库表

- `nex_user` - 系统用户表
- `nex_menu` - 系统菜单表
- `nex_user_menu` - 用户菜单关联表
- `nex_audit_log` - 审计日志表（GMP 21CFR Part 11 电子记录）

## GMP 审计追踪

### 功能说明

符合 GMP 21CFR Part 11 电子记录要求，自动记录所有关键操作的审计日志，包括操作人、操作时间、操作对象、修改前后值、操作结果、IP 地址等。

### 自动记录的操作

- **PLC 参数修改**：写入 PLC 点位时自动记录（需开启 `PLC_ENABLE_WRITE_AUDIT=true`）

### 数据库表结构

`nex_audit_log` 表字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| user_id | int | 操作人ID |
| user_name | varchar(50) | 操作人姓名 |
| action | varchar(100) | 操作类型（PLC参数修改/用户登录/数据导出等） |
| target | varchar(200) | 操作对象 |
| old_value | text | 修改前值 |
| new_value | text | 修改后值 |
| result | varchar(20) | 操作结果 success/failed |
| ip | varchar(50) | 操作IP |
| user_agent | varchar(500) | 浏览器UA |
| created_at | datetime | 操作时间 |

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/prod-api/v2/audit/list` | GET | 分页查询审计日志，支持 `userId`/`action`/`target`/`startTime`/`endTime`/`page`/`pageSize` 筛选 |
| `/prod-api/v2/audit/my` | GET | 查询当前登录用户的操作记录 |

### 代码中调用

```js
const auditService = require('@/modules/audit/audit.service')

// 记录审计日志
await auditService.create({
  userId: 1,
  userName: 'admin',
  action: 'PLC参数修改',
  target: 'fillVolume (灌装体积)',
  oldValue: '100.0',
  newValue: '150.5',
  result: 'success',
  ip: '127.0.0.1',
  userAgent: 'Mozilla/5.0...'
})

// 分页查询
const result = await auditService.query({ page: 1, pageSize: 20, userId: 1 })
```

### 配置

```bash
# .env 中开启 PLC 写操作审计
PLC_ENABLE_WRITE_AUDIT=true
```

## 许可证

MIT
