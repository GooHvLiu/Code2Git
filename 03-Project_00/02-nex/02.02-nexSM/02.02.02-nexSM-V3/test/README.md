# 单元测试说明文档

## 概述

本目录包含 nexSM-V2 后端项目的所有单元测试，按功能模块分文件夹组织。

## 目录结构

```
test/
├── README.md                    # 本文件，总测试说明
├── utils/                       # 工具函数模块测试
│   ├── README.md                # 工具函数测试说明
│   └── i18n.test.js             # 多语言工具函数测试
├── user/                        # 用户管理模块测试
│   └── README.md                # 用户模块测试说明
├── audit/                       # 审计追踪模块测试
│   └── README.md                # 审计模块测试说明
├── dict/                        # 数据字典模块测试
│   └── README.md                # 字典模块测试说明
├── role/                        # 角色管理模块测试
│   └── README.md                # 角色模块测试说明
├── dept/                        # 部门管理模块测试
│   └── README.md                # 部门模块测试说明
├── notification/                # 通知中心模块测试
│   └── README.md                # 通知模块测试说明
├── plc/                         # PLC 通讯模块测试（已有）
│   ├── README.md
│   └── *.test.js
└── sql/                         # SQL 相关文件（已有）
    ├── init.sql
    ├── init_test.sql
    └── init初始化使用说明.md
```

## 快速开始

### 环境准备

```bash
# 安装依赖
npm install

# 初始化测试数据库
mysql -u root -p test_db < test/sql/init_test.sql
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行指定模块的测试
npm test -- test/utils
npm test -- test/user

# 运行单个测试文件
npm test -- test/utils/i18n.test.js

# 运行测试并显示覆盖率
npm test -- --coverage

# 运行测试并生成覆盖率报告
npm test -- --coverage --coverageReporters=html
```

## 测试框架

- **测试框架**: Jest 29.7.0
- **断言库**: Jest 内置 expect
- **测试覆盖率**: Jest 内置 coverage

## 测试规范

### 命名规范

- 测试文件名：`xxx.test.js`
- 测试用例描述：应该清晰说明测试的场景和预期结果
- 每个 `describe` 块测试一个函数或一个功能点
- 每个 `test` 块测试一个具体的场景

### 编写规范

1. **AAA 模式**：每个测试用例遵循 Arrange（准备）→ Act（执行）→ Assert（断言）
2. **独立性**：每个测试用例应该独立、可重复、无副作用
3. **清晰性**：测试用例描述应该清晰说明测试的场景和预期结果
4. **覆盖性**：测试应该覆盖正常场景、边界场景和异常场景

### 示例

```javascript
describe('用户服务 - getUserList', () => {
  test('应该返回分页用户列表', async () => {
    // Arrange
    const params = { page: 1, pageSize: 10 }
    
    // Act
    const result = await userService.getUserList(params)
    
    // Assert
    expect(result).toHaveProperty('list')
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('page')
    expect(result).toHaveProperty('pageSize')
    expect(Array.isArray(result.list)).toBe(true)
  })
})
```

## 测试覆盖范围

### 已完成的测试

| 模块 | 测试文件 | 状态 |
|------|----------|------|
| 工具函数 | `utils/i18n.test.js` | ✅ 已完成 |
| PLC 通讯 | `plc/*.test.js` | ✅ 已完成（已有） |

### 待完成的测试

| 模块 | 测试文件 | 状态 |
|------|----------|------|
| 用户管理 | `user/*.test.js` | ⏳ 待添加 |
| 审计追踪 | `audit/*.test.js` | ⏳ 待添加 |
| 数据字典 | `dict/*.test.js` | ⏳ 待添加 |
| 角色管理 | `role/*.test.js` | ⏳ 待添加 |
| 部门管理 | `dept/*.test.js` | ⏳ 待添加 |
| 通知中心 | `notification/*.test.js` | ⏳ 待添加 |

## 添加新测试

1. 在对应模块目录下创建 `xxx.test.js` 文件
2. 使用 Jest 的 `describe` 和 `test` 函数编写测试用例
3. 遵循 AAA 模式和测试规范
4. 运行测试确保通过

## 相关文档

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [代码注释规范](../docs/CODE_COMMENT_STANDARD.md)
- [后端 README](../README.md)

---

**最后更新：2026-08-22**
