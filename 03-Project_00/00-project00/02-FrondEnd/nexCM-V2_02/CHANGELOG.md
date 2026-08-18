# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [0.1.0] - 2026-08-12

### 新增
- 项目初始化：Vue 2.6 + Element UI 2.15 + Vuex + Vue Router 技术栈
- 登录/注册页：左右分屏滑动切换，覆盖层蓝色渐变
- 动态路由：后端菜单驱动，支持无限层级
- 权限控制：角色 + 权限码双维度，v-permission 指令
- TagsView 标签页：Vuex 状态管理，右键菜单，无刷新重载
- 全局请求封装：Token 注入、请求取消、自动重试、错误统一处理
- 国际化基础架构：vue-i18n，中文/英文语言包
- 主题切换：CSS 变量 + localStorage 持久化
- 数据字典：工具函数 + DictTag 组件 + dict Mixin
- 通用 Mixin：table / dialog / form / dict / resize
- 通用组件：Pagination / SearchForm / TableToolbar / DictTag / UploadImage / SvgIcon
- 业务示例：用户管理模块（列表 + 新增/编辑弹窗 + 导出）
- 全局 Loading：请求计数，避免并发闪烁
- Message 防重复：相同提示 3 秒内只弹一次
- 错误日志收集：Vuex errorLog 模块
- 生产构建优化：sourceMap 关闭、分包、去 console
- 代码规范：ESLint（单引号无分号）、.editorconfig、husky + lint-staged

### 配置
- config 拆分：system / network / ui / messages
- 环境变量：.env.development / .env.production / .env.example
- settings.js：全局 UI 开关（侧边栏 Logo、标签页、主题色等）

### 文档
- README.md：完整项目文档（技术栈、目录结构、环境变量、部署指南）
- 本 CHANGELOG.md

---

## 版本说明

### 版本号格式
`主版本号.次版本号.修订号`

- **主版本号**：不兼容的 API 改动
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 常用术语
- `新增` - 新功能
- `变更` - 对现有功能的调整
- `废弃` - 即将移除的功能
- `移除` - 已移除的功能
- `修复` - Bug 修复
- `性能` - 性能优化
- `安全` - 安全相关修复
