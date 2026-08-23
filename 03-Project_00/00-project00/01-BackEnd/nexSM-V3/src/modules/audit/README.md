# 审计追踪模块（GMP 21CFR Part 11 合规）

## 模块简介

独立的审计日志模块，符合 GMP 21CFR Part 11 电子记录与电子签名要求。其他业务模块通过统一入口 `auditLogger` 记录日志，与模块内部实现完全解耦。

## 模块结构

```
src/modules/audit/
├── audit.model.js       # 数据模型层（哈希链计算、数据库操作）
├── audit.service.js     # 业务逻辑层（创建、查询、校验）
├── audit.controller.js  # 控制器层（API 接口）
├── audit.route.js       # 路由配置
├── auditLogger.js       # ★ 对外统一入口（其他模块只依赖此文件）
└── README.md            # 本文件
```

## 核心特性

| 特性 | 实现方式 | 说明 |
|------|---------|------|
| 哈希链防篡改 | SHA-256 哈希链，每条记录包含前一条的哈希 | 任何一条记录被修改，后续哈希链全部断裂 |
| 只增不改不删 | 数据库触发器禁止 UPDATE/DELETE | 审计日志一旦写入，无法修改或删除 |
| 操作人追踪 | 自动记录 userId、userName、ip、userAgent | 谁在什么时间什么地点做了什么 |
| 操作原因 | 关键操作必须填写 reason | GMP 要求"为什么做" |
| 统一入口 | `auditLogger.log()` 封装所有细节 | 其他模块无需关心内部实现 |

## 对外 API（auditLogger）

### 1. 核心方法：log()

记录审计日志的统一入口，支持两种调用方式。

**方式一：传入 Express req 对象（推荐，自动提取操作人信息）**

```javascript
const auditLogger = require('../audit/auditLogger')

await auditLogger.log(req, {
  action: auditLogger.ACTION.USER_UPDATE,  // 操作类型（使用常量）
  target: 'username',                        // 操作对象
  oldValue: '旧值',                          // 修改前的值（可选）
  newValue: '新值',                          // 修改后的值（可选）
  result: 'success',                         // 操作结果（可选，默认 success）
  reason: '操作原因（GMP要求）'              // 操作原因（可选）
})
```

**方式二：手动传入操作人信息**

```javascript
await auditLogger.log({
  userId: 1,
  userName: 'admin',
  ip: '127.0.0.1',
  userAgent: 'Mozilla/5.0...'
}, {
  action: 'PLC参数修改',
  target: 'fillVolume',
  oldValue: '100',
  newValue: '150',
  reason: '工艺调整'
})
```

### 2. 操作类型常量（ACTION）

统一管理，避免硬编码，后续新增在此添加：

```javascript
auditLogger.ACTION.USER_REGISTER       // 用户注册
auditLogger.ACTION.USER_LOGIN          // 用户登录
auditLogger.ACTION.USER_LOGIN_FAILED   // 用户登录失败
auditLogger.ACTION.USER_LOGOUT         // 用户登出
auditLogger.ACTION.USER_CREATE         // 新增用户
auditLogger.ACTION.USER_UPDATE         // 修改用户
auditLogger.ACTION.USER_DELETE         // 删除用户
auditLogger.ACTION.USER_BATCH_DELETE   // 批量删除用户
auditLogger.ACTION.USER_STATUS_CHANGE  // 修改用户状态
auditLogger.ACTION.USER_RESET_PASSWORD // 重置密码
auditLogger.ACTION.PLC_WRITE           // PLC参数修改
auditLogger.ACTION.PLC_READ            // PLC参数读取
auditLogger.ACTION.PLC_CONNECT         // PLC连接
auditLogger.ACTION.PLC_DISCONNECT      // PLC断开
auditLogger.ACTION.PLC_RECONNECT       // PLC重连
auditLogger.ACTION.SYSTEM_CONFIG_CHANGE // 系统配置修改
auditLogger.ACTION.SYSTEM_EXPORT       // 数据导出
auditLogger.ACTION.SYSTEM_IMPORT       // 数据导入
auditLogger.ACTION.AUDIT_VERIFY        // 审计哈希链校验
```

### 3. 快捷方法

常用操作的快捷封装，减少重复代码：

```javascript
// 用户相关
await auditLogger.logUserRegister(req, target, newValue)
await auditLogger.logUserCreate(req, target, newValue)
await auditLogger.logUserUpdate(req, target, oldValue, newValue)
await auditLogger.logUserDelete(req, target, oldValue)
await auditLogger.logUserBatchDelete(req, target, oldValue)
await auditLogger.logUserStatusChange(req, target, oldValue, newValue)

// PLC 相关
await auditLogger.logPlcWrite(req, target, oldValue, newValue, reason)

// 系统相关
await auditLogger.logExport(req, target)
```

### 4. 工具方法

```javascript
// 从 req 中提取操作人信息
const operator = auditLogger.extractOperator(req)
// 返回 { userId, userName, ip, userAgent }
```

## 数据库表结构

表名：`nex_audit_log`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键，自增 |
| user_id | int | 操作人ID |
| user_name | varchar(50) | 操作人用户名 |
| action | varchar(100) | 操作类型 |
| target | varchar(200) | 操作对象 |
| old_value | text | 修改前的值 |
| new_value | text | 修改后的值 |
| result | varchar(20) | 操作结果（success/failed/verify_failed） |
| reason | varchar(500) | 操作原因 |
| ip | varchar(50) | 操作IP |
| user_agent | varchar(500) | 浏览器UA |
| prev_hash | varchar(64) | 前一条记录哈希值 |
| current_hash | varchar(64) | 当前记录哈希值 |
| created_at | datetime | 操作时间 |

**数据库触发器（强制只增不改不删）：**
- `trg_audit_log_no_update`：禁止 UPDATE
- `trg_audit_log_no_delete`：禁止 DELETE

## API 接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /prod-api/v2/audit/list | 分页查询审计日志 | 登录 |
| GET | /prod-api/v2/audit/my | 查询当前用户的操作记录 | 登录 |
| GET | /prod-api/v2/audit/verify | 校验哈希链完整性 | 管理员 |

## 如何扩展

### 新增操作类型

1. 在 `auditLogger.js` 的 `ACTION_TYPES` 中添加常量
2. 业务模块中使用 `auditLogger.ACTION.XXX` 引用

### 新增日志字段

1. 在 `audit.model.js` 的 `ALLOW_FIELDS` 中添加字段
2. 在 `audit.service.js` 的 `create()` 方法中处理新字段
3. 数据库表添加对应字段
4. `auditLogger.log()` 的 log 参数中可直接传入新字段

### 替换存储方式（如改为 Elasticsearch）

1. 重写 `audit.model.js` 的数据操作方法
2. `audit.service.js` 和 `auditLogger.js` 无需修改
3. 所有业务模块无需修改

## 设计原则

1. **单一入口**：其他模块只依赖 `auditLogger.js`，不直接引用 `audit.service.js`
2. **内部封装**：哈希链计算、数据库操作、操作人提取全部封装在模块内部
3. **可扩展**：新增操作类型、字段、存储方式不影响外部调用
4. **容错性**：审计日志写入失败不影响主业务流程（catch 后返回 null）
