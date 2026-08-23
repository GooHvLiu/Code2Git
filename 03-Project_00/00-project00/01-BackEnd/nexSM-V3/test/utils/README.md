# 工具函数模块测试说明

## 模块概述

本目录包含 `src/utils/` 目录下所有工具函数的单元测试。

## 测试文件列表

| 文件名 | 测试目标 | 说明 |
|--------|----------|------|
| `i18n.test.js` | `src/utils/i18n.js` | 多语言工具函数测试 |

## 运行测试

```bash
# 运行所有工具函数测试
npm test -- test/utils

# 运行单个测试文件
npm test -- test/utils/i18n.test.js

# 运行测试并显示覆盖率
npm test -- test/utils --coverage
```

## 测试覆盖范围

### i18n.test.js - 多语言工具函数

- `normalizeLang` - 语言标准化
  - 支持的语言：zh-CN, en-US
  - 简写支持：zh → zh-CN, en → en-US
  - 默认值：空值或不支持的语言 → zh-CN

- `buildLangObject` - 构建多语言对象
  - 正常构建中英文对象
  - 英文为空时使用中文值兜底

- `getLangValue` - 获取对应语言的值
  - 从 JSON 对象中获取指定语言的值
  - 字符串类型直接返回
  - null/undefined 返回空字符串
  - 指定语言不存在时返回中文值兜底

- `processLangFields` - 处理查询结果中的多语言字段
  - 处理单个对象
  - 处理对象数组
  - 非 JSON 字段保持不变

- `getLangFromRequest` - 从请求中获取语言参数
  - 从 query 参数获取
  - 从 body 参数获取
  - 从 headers 的 accept-language 获取
  - 默认值 zh-CN

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

## 相关文档

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [代码注释规范](../../docs/CODE_COMMENT_STANDARD.md)
