# 用户管理模块测试说明

## 模块概述

本目录包含 `src/modules/user/` 目录下用户管理模块的单元测试。

## 测试文件列表

| 文件名 | 测试目标 | 说明 |
|--------|----------|------|
| `user.service.test.js` | `src/modules/user/user.service.js` | 用户业务逻辑测试 |
| `user.model.test.js` | `src/modules/user/user.model.js` | 用户数据模型测试 |
| `user.controller.test.js` | `src/modules/user/user.controller.js` | 用户控制器测试 |

## 运行测试

```bash
# 运行所有用户模块测试
npm test -- test/user

# 运行单个测试文件
npm test -- test/user/user.service.test.js

# 运行测试并显示覆盖率
npm test -- test/user --coverage
```

## 测试覆盖范围

### user.service.test.js - 用户业务逻辑

- 用户列表查询（分页、筛选、排序）
- 用户详情查询
- 用户创建（含密码加密、重复用户名校验）
- 用户更新
- 用户删除（软删除）
- 用户状态变更
- 密码重置
- 批量删除

### user.model.test.js - 用户数据模型

- 分页查询
- 根据 ID 查询
- 根据用户名查询
- 创建用户
- 更新用户
- 软删除用户
- 批量删除

### user.controller.test.js - 用户控制器

- 请求参数解析
- 调用 Service 层
- 统一响应格式
- 错误处理

## 测试数据准备

测试使用独立的测试数据库，测试前自动初始化测试数据，测试后自动清理。

```bash
# 初始化测试数据库
mysql -u root -p test_db < test/sql/init_test.sql
```

## 添加新测试

1. 在本目录创建 `xxx.test.js` 文件
2. 使用 Jest 的 `describe` 和 `test` 函数编写测试用例
3. 遵循 AAA 模式：Arrange（准备）→ Act（执行）→ Assert（断言）
4. 每个测试用例应该独立、可重复、无副作用

## 测试规范

- 测试文件名：`xxx.test.js`
- 测试用例描述：应该清晰说明测试的场景和预期结果
- 每个 `describe` 块测试一个函数或一个功能点
- 每个 `test` 块测试一个具体的场景
- 使用 `expect` 进行断言，避免使用 `console.log`
- 涉及数据库的测试需要在 `beforeAll` 中初始化数据，在 `afterAll` 中清理数据

## 相关文档

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [代码注释规范](../../docs/CODE_COMMENT_STANDARD.md)
- [用户模块 README](../../src/modules/user/README.md)
