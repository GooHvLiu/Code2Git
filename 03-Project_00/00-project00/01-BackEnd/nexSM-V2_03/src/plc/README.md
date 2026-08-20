# PLC 通讯模块使用说明

## 一、模块架构

```
src/plc/
├── index.js              # 入口，单例管理
├── config/
│   ├── plcSetting.js     # 全局配置（支持环境变量）
│   └── plcTagMap.js      # 点位映射表
├── protocols/
│   ├── BasePlc.js        # 协议抽象基类
│   └── ModbusTcpClient.js # Modbus TCP 实现
├── task/
│   └── PlcPollTask.js    # 轮询采集任务（含断线重连）
└── utils/
    ├── plcDataConvert.js # 数据类型转换
    └── plcLock.js        # 读写互斥锁
```

## 二、支持的数据类型

| 类型 | 说明 | 寄存器数 | 取值范围 |
|------|------|---------|---------|
| `uint16` | 无符号16位整数 | 1 | 0 ~ 65535 |
| `int16` | 有符号16位整数 | 1 | -32768 ~ 32767 |
| `uint32` | 无符号32位整数 | 2 | 0 ~ 4294967295 |
| `int32` | 有符号32位整数 | 2 | -2147483648 ~ 2147483647 |
| `float` | 32位浮点数 | 2 | IEEE 754 |
| `bool` | 布尔值 | 1 | true / false |
| `string` | 字符串 | N（length指定） | UTF-8 |

## 三、配置说明

### 3.1 环境变量配置（推荐）

在 `.env` 中添加：

```bash
# PLC 通讯配置
PLC_PROTOCOL=ModbusTcp    # 协议类型
PLC_HOST=192.168.1.100    # PLC IP 地址
PLC_PORT=502               # 端口
PLC_UNIT_ID=1              # Modbus 从站 ID
PLC_FAST_INTERVAL=200      # 高频轮询间隔(ms)
PLC_SLOW_INTERVAL=1000     # 低频轮询间隔(ms)
PLC_RECONNECT_DELAY=3000   # 断线重连等待(ms)
PLC_ENABLE_POLL=true       # 是否开启轮询
PLC_ENABLE_WRITE_AUDIT=true # 是否开启写审计
PLC_MAX_WRITE_RETRY=1      # 写失败重试次数
```

### 3.2 点位映射配置

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

## 四、API 接口

所有接口前缀：`/prod-api/v2/plc`，需要登录鉴权（Header 带 Token）。

### 4.1 获取连接状态

```
GET /plc/status
```

响应：
```json
{
  "code": 200,
  "data": {
    "connected": true,
    "protocol": "ModbusTcp",
    "host": "127.0.0.1",
    "port": 502,
    "unitId": 1
  }
}
```

### 4.2 读取单个点位

```
GET /plc/read-tag?tag=deviceRunStatus
```

响应：
```json
{
  "code": 200,
  "data": {
    "tag": "deviceRunStatus",
    "value": 1,
    "desc": "设备运行状态 0-停止 1-运行 2-故障"
  }
}
```

### 4.3 读取所有点位

```
GET /plc/read-all
```

响应：
```json
{
  "code": 200,
  "data": {
    "deviceRunStatus": 1,
    "temperature": 25.5,
    "fillVolume": 100.0
  }
}
```

### 4.4 写入点位

```
POST /plc/write-tag
Content-Type: application/json

{
  "tag": "fillVolume",
  "value": 150.5
}
```

响应：
```json
{
  "code": 200,
  "data": {
    "tag": "fillVolume",
    "desc": "灌装体积（mL）",
    "oldValue": 100.0,
    "newValue": 150.5,
    "readBackValue": 150.5,
    "verified": true
  }
}
```

## 五、代码中直接调用

```js
const { getPlcInstance, getTagConfig } = require('@/plc')

// 获取 PLC 实例
const plc = getPlcInstance()

// 读取点位
const tagConf = getTagConfig('temperature')
const value = await plc.readTag(tagConf)

// 写入点位
await plc.writeTag(tagConf, 25.5)

// 获取连接状态
const status = plc.getStatus()
```

## 六、测试步骤

### 6.1 无真实 PLC 时的测试（模拟测试）

**步骤1：安装 Modbus 模拟工具**

推荐工具：
- **Modbus Slave**（Windows，付费，有试用）
- **CAS Modbus Scanner**（免费）
- **Node.js 模拟**：使用 `modbus-serial` 自带的 server 功能

**步骤2：启动 Modbus TCP 从站模拟**

创建一个临时脚本 `modbus-server.js`：

```js
const ModbusRTU = require('modbus-serial')
const server = new ModbusRTU.ServerTCP({
  holdingRegisters: Buffer.alloc(100) // 100个保持寄存器
}, {
  host: '0.0.0.0',
  port: 502,
  debug: true
})
console.log('Modbus TCP Server 启动，端口 502')
```

运行：
```bash
node modbus-server.js
```

**步骤3：配置 .env 指向模拟服务器**

```bash
PLC_HOST=127.0.0.1
PLC_PORT=502
```

**步骤4：启动后端服务**

```bash
npm run dev
```

观察控制台输出：
- 成功：`✅ PLC模块初始化完成`
- 失败：`❌ PLC初始化失败：...`（检查模拟服务器是否启动）

**步骤5：用 Postman / Apifox 测试接口**

1. 先登录获取 Token：`POST /prod-api/v2/user/login`
2. 读取状态：`GET /prod-api/v2/plc/status`
3. 读取点位：`GET /prod-api/v2/plc/read-tag?tag=deviceRunStatus`
4. 写入点位：`POST /prod-api/v2/plc/write-tag` body: `{"tag":"fillVolume","value":150.5}`
5. 读取全部：`GET /prod-api/v2/plc/read-all`

### 6.2 有真实 PLC 时的测试

**步骤1：确认 PLC 网络连通**

```bash
ping 192.168.1.100  # 替换为实际PLC IP
```

**步骤2：确认 Modbus TCP 端口开放**

```bash
# Windows
Test-NetConnection -ComputerName 192.168.1.100 -Port 502
```

**步骤3：配置 .env**

```bash
PLC_HOST=192.168.1.100
PLC_PORT=502
PLC_UNIT_ID=1  # 确认PLC的从站地址
```

**步骤4：对照 PLC 手册配置点位映射**

编辑 `plcTagMap.js`，将 `address` 改为实际寄存器地址。

**步骤5：启动服务并测试**

同 6.1 步骤4-5。

### 6.3 断线重连测试

1. 启动服务，确认 PLC 连接成功
2. 断开 PLC 网络（或关闭模拟服务器）
3. 观察控制台：连续3次读取失败后触发重连
4. 恢复 PLC 网络
5. 观察控制台：重连成功日志

### 6.4 写入校验测试

1. 尝试写入超出范围的值（如 fillVolume 配置了 max=1000，写入 2000）
2. 预期返回错误：`值不能大于 1000`
3. 尝试写入只读点位（如 deviceRunStatus）
4. 预期返回错误：`点位 deviceRunStatus 只读，禁止写入`

## 七、扩展新协议

如需添加 S7、OPC UA 等协议：

1. 在 `protocols/` 下创建 `S7Client.js`，继承 `BasePlc`
2. 实现 `connect()`、`disconnect()`、`readTag()`、`writeTag()`、`getStatus()`
3. 在 `index.js` 的 `getPlcInstance()` 中添加 case 分支
4. 在 `.env` 中设置 `PLC_PROTOCOL=S7`

## 八、注意事项

1. **互斥锁**：同一时间只允许一个读写操作，避免 Modbus 并发冲突
2. **浮点数高低字**：默认交换高低字（`swap=true`），如数据异常可改为 `false`
3. **写入回读验证**：写入后自动回读，`verified` 字段表示是否一致
4. **GMP 审计**：写操作预留了审计埋点，接入审计日志系统后取消注释即可
5. **生产环境**：务必修改 `.env` 中的 PLC 配置，不要使用默认值
