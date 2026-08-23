# 通知中心模块测试说明

## 模块概述

本目录包含 src/modules/notification/ 目录下系统通知和实时推送模块的单元测试。

## 测试文件列表

| 文件名 | 测试目标 | 说明 |
|--------|----------|------|
| $(System.Collections.Hashtable.name).service.test.js | src/modules/notification/notification.service.js | 业务逻辑测试 |
| $(System.Collections.Hashtable.name).model.test.js | src/modules/notification/notification.model.js | 数据模型测试 |
| $(System.Collections.Hashtable.name).controller.test.js | src/modules/notification/notification.controller.js | 控制器测试 |

## 运行测试

```bash
# 运行所有模块测试
npm test -- test/notification

# 运行单个测试文件
npm test -- test/notification/notification.service.test.js

# 运行测试并显示覆盖率
npm test -- test/notification --coverage
```

## 添加新测试

1. 在本目录创建 xxx.test.js 文件
2. 使用 Jest 的 describe 和 	est 函数编写测试用例
3. 遵循 AAA 模式：Arrange（准备）→ Act（执行）→ Assert（断言）
4. 每个测试用例应该独立、可重复、无副作用

## 测试规范

- 测试文件名：xxx.test.js
- 测试用例描述：应该清晰说明测试的场景和预期结果
- 每个 describe 块测试一个函数或一个功能点
- 每个 	est 块测试一个具体的场景
- 使用 expect 进行断言，避免使用 console.log
- 涉及数据库的测试需要在 eforeAll 中初始化数据，在 fterAll 中清理数据

## 相关文档

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [代码注释规范](../../docs/CODE_COMMENT_STANDARD.md)
