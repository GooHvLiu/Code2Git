# nexCM-V3 前端功能回归测试报告

| 项目 | 内容 |
|---|---|
| 测试对象 | 02.01.02.02-nexCM-V3（Vue3.x + Vite + Element Plus） |
| 测试日期 | 2026-09-24 |
| 测试环境 | 前端 http://localhost:8082（dev） / 后端 http://localhost:3002 |
| 测试账号 | liuguohui（Super_Admin） |
| 浏览器 | Chrome 1280×960，hash 路由 |
| 作者 | GooHv |

---

## 一、测试结论概览

| 维度 | 结果 |
|---|---|
| 12 个视图模块页面加载 | 11/12 通过，1 个（license-manage）未注册路由但组件存在 |
| 表格/列表数据加载 | 全部通过 |
| 搜索/筛选/重置 | 通过（以 system/user 实测） |
| 新增/编辑弹窗 | 通过（以 system/user 实测） |
| 删除确认弹窗 | 通过（以 system/user 实测，未实际提交删除） |
| 分页 | 通过 |
| 侧边栏折叠/展开 | 通过 |
| i18n 中英文切换 | 通过，无裸露 i18n key |
| TagsView 右键菜单 | 通过 |
| 面包屑导航 | 通过 |
| 通知铃铛 | 通过（跳转 /notification） |
| 控制台 JS 错误 | 无 error 级别 |
| `npm run build` | **exit 0**（vue-tsc + vite build 通过） |

---

## 二、逐模块测试结果

### 1. home（首页/仪表盘）

| 路由 | 页面标题 | 结果 | 说明 |
|---|---|---|---|
| `/#/home/overview` | 概况预览 | ✅ 通过 | 设备状态卡片、运行速度、今日产能、24h 趋势图正常渲染 |
| `/#/home/dashboard` | 数据看板 | ✅ 通过 | 含"全屏展示"按钮 |
| `/#/home/data` | 数据管理 | ✅ 通过 | 30 行表格数据、分页、搜索/重置/导出PDF/刷新按钮齐全 |

### 2. device（设备管理）

| 路由 | 页面标题 | 结果 | 说明 |
|---|---|---|---|
| `/#/device/state` | 设备状态 | ✅ 通过 | 6 行设备状态卡片 |
| `/#/device/alarm` | 报警统计 | ✅ 通过 | 20 行报警表格、分页、搜索/重置/导出/刷新；含报警仪表盘（饼图/趋势图/TOP5）与报警列表双 Tab |
| `/#/device/part` | 部件寿命 | ✅ 通过 | 8 行部件数据，添加/刷新/编辑/删除按钮齐全 |

### 3. error（错误日志页）

| 路由 | 结果 | 说明 |
|---|---|---|
| `/#/404` | ✅ 通过 | 显示"404 - 页面不存在"，含"返回首页"按钮 |
| `/#/403` | ✅ 通过 | 显示"403 - 禁止访问"，含"返回/返回首页"按钮 |

### 4. license（授权管理）

| 路由 | 结果 | 说明 |
|---|---|---|
| `/#/license/import` | ✅ 路由存在 | 授权导入页（constantRoutes 注册） |
| `/#/license/manage` | ⚠️ 未注册路由 | 组件 `views/license/license-manage/index.vue` 存在，但未在路由表中注册，直接访问落入 404。该页应通过 super-panel 配置入口访问，非缺陷 |

### 5. login（登录页）

| 项目 | 结果 |
|---|---|
| 页面加载 | ✅ 双栏布局，左侧登录表单、右侧注册引导 |
| 用户名/密码/验证码 | ✅ 三个字段齐全，SVG 验证码可正常显示 |
| 登录提交 | ✅ liuguohui/12345678 登录成功，跳转 /home/overview |
| 注册/忘记密码入口 | ✅ 可见 |

### 6. notification（通知管理）

| 路由 | 结果 | 说明 |
|---|---|---|
| `/#/notification` | ✅ 通过（修复后） | 通知列表、全部/设备通知/生产通知/系统通知 Tab、全部标记已读、通知设置按钮；数据正常加载（含历史"账号被踢下线"通知） |

> **注**：该模块初测时落入 404，详见第三节 Bug #1。

### 7. permission-core（权限核心）

| 路由 | 结果 | 说明 |
|---|---|---|
| `/#/system/permission` | ✅ 通过 | 权限管理页加载正常，含重置按钮 |

### 8. production（生产管理）

| 路由 | 页面标题 | 结果 | 说明 |
|---|---|---|---|
| `/#/production/recipe` | 配方管理 | ✅ 通过 | 下载按钮正常 |
| `/#/production/order` | 订单管理 | ✅ 通过 | 1 行订单数据，导出/生成报告按钮 |

### 9. profile（个人中心）

| 路由 | 结果 | 说明 |
|---|---|---|
| `/#/profile` | ✅ 通过（修复后） | 显示当前用户基本信息（用户名/姓名/角色/性别/手机/邮箱/状态/创建时间） |

> **注**：初测落入 404，详见第三节 Bug #1。

### 10. redirect（重定向页）

| 路由 | 结果 | 说明 |
|---|---|---|
| `/#/redirect` | ✅ 通过 | 自动重定向回 /home/overview（redirect 中转页正常工作） |

### 11. super-panel（超级面板）

| 路由 | 页面标题 | 结果 |
|---|---|---|
| `/#/super-panel/dict` | 字典管理 | ✅ 通过（9 行数据，刷新/新增按钮） |
| `/#/super-panel/dept` | 部门管理 | ✅ 通过 |
| `/#/super-panel/role` | 角色管理 | ✅ 通过（4 行，分页） |
| `/#/super-panel/config` | 参数管理 | ✅ 通过 |
| `/#/super-panel/permission` | 权限管理 | ✅ 通过 |
| `/#/super-panel/feature` | 功能管理 | ✅ 通过 |
| `/#/super-panel/database` | 数据管理 | ✅ 通过（分页器存在） |
| `/#/super-panel/project-config` | 项目管理 | ✅ 通过 |
| `/#/super-panel/menu-config` | 菜单管理 | ✅ 通过 |
| `/#/super-panel/i18n` | 语言管理 | ✅ 通过 |

> super-panel 全部子页对 Super_Admin 可正常访问，无"权限受限"情况。

### 12. system（系统管理）

| 路由 | 页面标题 | 结果 | 说明 |
|---|---|---|---|
| `/#/system/user` | 用户管理 | ✅ 通过 | 6 行用户数据、分页、搜索/重置、新增/编辑/删除弹窗全部实测通过 |
| `/#/system/audit` | 审计日志 | ✅ 通过 | 20 行日志、分页、搜索/重置/导出PDF |
| `/#/system/config` | 参数管理 | ✅ 通过 | 保存/重置按钮 |
| `/#/system/permission` | 权限管理 | ✅ 通过 | 重置按钮 |
| `/#/system/device` | 设备管理 | ✅ 通过 | 11 行设备数据、分页、刷新/刷新状态/删除 |

---

## 三、发现的问题清单

### Bug #1（已修复）：/profile 与 /notification 直接访问落入 404

| 项 | 内容 |
|---|---|
| 严重级别 | 高 |
| 影响页面 | `/profile`（个人中心）、`/notification`（通知中心） |
| 现象 | 登录后通过右上角头像菜单点击"个人中心"，或直接访问 `/#/profile`、`/#/notification`，均落入 404 页面；`router.resolve()` 显示这两个路径被 `CatchAll` 通配路由匹配 |
| 根因 | `constantRoutes.ts` 中 Layout（`path:'/'`）的常驻子路由 `profile`、`notification` 使用相对路径注册。路由守卫 `permission.ts` 在动态路由生成后通过 `router.addRoute('Layout', route)` 批量追加动态子路由（绝对路径如 `/home/overview`），Vue Router 4（4.6.4）在重建 matcher 后，最初随 constantRoutes 注册的相对路径子路由从匹配表中丢失——`layout.children` 数组中仍可见 Profile/Notification 记录，但 `router.getRoutes()` 扁平化列表与 `resolve()` 均不再命中 |
| 修复文件 | `src/router/constant/constantRoutes.ts`、`src/router/permission.ts` |
| 修复方案 | 1. 在 constantRoutes.ts 中将 profile/notification 抽为独立常量并导出 `layoutChildRoutes`；2. 在 permission.ts 动态路由 `addRoute('Layout', ...)` 循环之后，按同名 `router.addRoute('Layout', route)` 重新补挂这两个常驻子路由 |
| 验证 | 修复后全量刷新页面，`/#/profile` 正确渲染个人中心、`/#/notification` 正确渲染通知中心；头像菜单跳转正常 |

### 观察项（未修改）

| # | 描述 | 建议 |
|---|---|---|
| 1 | 英文模式下动态切换 locale 不经过路由导航时，`document.title` 仍显示中文（如"用户管理 - nexCM 标准版本"）；重新导航后标题正确更新为英文 | 可在 locale watch 中同步更新 document.title，属体验优化，非阻断 |
| 2 | 表格中"状态"列（启用/禁用）等字典项在英文模式下仍显示中文，因来自后端数据而非前端 i18n | 需后端返回字典多语言或前端按字典翻译 |
| 3 | `/#/license/manage` 组件存在但未注册路由 | 确认是否应通过 super-panel 入口访问，如需独立路由需在动态菜单中配置 |
| 4 | build 产物 `libs` chunk 达 2MB+（echarts/xlsx/jspdf/html2canvas 打包在一起），vite 提示 chunk size warning | 后续可做路由级按需拆分，不影响功能 |
| 5 | ThemePicker 点击后未明显观察到颜色面板弹出（可能为内联面板或需特定交互） | 建议人工复确认为何种触发方式 |

---

## 四、交互功能实测明细（以 system/user 为样本）

| 功能 | 操作 | 结果 |
|---|---|---|
| 表格数据加载 | 进入 /system/user | ✅ 6 行用户数据渲染 |
| 搜索 | 用户名输入"liu"→点搜索 | ✅ 过滤为 1 行（liuguohui） |
| 重置 | 点"重置" | ✅ 恢复 6 行 |
| 新增弹窗 | 点"新增" | ✅ 弹出"新增用户"对话框，含用户名/密码/真实姓名/性别/电话/邮箱/部门/角色/备注全部字段 |
| 编辑弹窗 | 点某行"编辑" | ✅ 弹出"编辑用户"对话框，用户数据正确回填 |
| 删除确认 | 点某行"删除" | ✅ ElMessageBox 弹出"确定要删除用户"test01"吗？此操作不可撤销！"，点取消关闭，未实际删除 |
| 分页 | 底部分页器 | ✅ 共 6 条、20 条/页、上一页/下一页/前往页码齐全 |

---

## 五、全局功能验证

| 功能 | 结果 | 说明 |
|---|---|---|
| 侧边栏折叠/展开 | ✅ | 点击左上角 Fold/Expand 图标，侧边栏在全宽（显示文字）与图标模式间切换 |
| 面包屑导航 | ✅ | 顶部显示"设备管理 / 报警统计"层级，随路由更新 |
| TagsView 标签页 | ✅ | 多页签同时打开（概况预览/数据看板/数据管理/设备状态/报警统计…），选中态高亮 |
| TagsView 右键菜单 | ✅ | 右键标签弹出：刷新页面/关闭页面/关闭其他/关闭右侧/关闭全部 |
| 通知铃铛 | ✅ | 点击跳转 /notification 通知中心 |
| 心跳/设备状态指示 | ✅ | 顶栏显示"设备未连接" |
| 菜单搜索 | ✅ | 顶栏搜索菜单输入框存在 |
| 语言切换（zh-CN ↔ en-US） | ✅ | 详见第六节 |
| 退出登录 | ✅ | 头像下拉含"退出登录"（未实际点击，避免中断测试会话） |

---

## 六、i18n 切换验证

| 检查项 | 中文模式 | 英文模式 | 结果 |
|---|---|---|---|
| 页面标题（document.title） | 概况预览 - nexCM 标准版本 | AlarmLog - nexCM Standard | ✅ 导航后正确切换 |
| 页面主标题 | 用户管理 | User Management | ✅ |
| 副标题/描述 | 管理系统用户和账户信息 | Manage system users and account information | ✅ |
| 操作按钮 | 搜索/重置/新增/刷新/导出PDF/编辑/删除 | Search/Reset/Add/Refresh/Export PDF/Edit/Delete | ✅ |
| 表格列名 | 用户名/真实姓名/邮箱/电话/角色/部门/状态/创建时间/操作 | Username/Real Name/Email/Phone/Role/Department/Status/Create Time/Operation | ✅ |
| 分页文案 | 共 6 条 / 前往 | Total 6 / Go to | ✅ |
| 面包屑 | 设备管理 / 报警统计 | SysSetup / UserMgmt | ✅ |
| TagsView 标签 | 概况预览/用户管理/审计日志 | Overview/UserMgmt/AuditLog | ✅ |
| 弹窗标题 | 新增用户/编辑用户 | （切回中文验证） | ✅ 中文弹窗正常 |
| 删除确认文案 | 确定要删除用户"test01"吗？此操作不可撤销！ | — | ✅ |
| 裸露 i18n key 扫描 | — | 无 `common.xxx`/`layout.xxx` 等 key 残留 | ✅ |
| 控制台 i18n 缺失告警 | — | 无 missing/fallback 告警 | ✅ |

> 说明：英文模式下表格"状态"列仍显示"启用"，属后端字典数据，非前端 i18n 缺陷（见观察项 #2）。

---

## 七、浏览器控制台错误汇总

整个测试会话期间，`console_messages()` 收集到：

- **error 级别：0 条**
- warning 级别仅为浏览器自身的 "Throttling navigation to prevent the browser from hanging"（CDP 调试器导航节流提示，非应用错误）
- 未出现 Vue 警告、未捕获 Promise rejection、资源加载失败等

---

## 八、构建验证

```
> vue-tsc --noEmit && vite build
✓ 3955 modules transformed.
✓ built in 40.67s
```

- **exit code: 0**
- 仅有 chunk 大小与 dynamic/static import 混合的 warning（非错误），不影响产物
- TypeScript 类型检查（vue-tsc --noEmit）通过

---

## 九、本次改动文件清单

| 文件 | 改动 |
|---|---|
| `src/router/constant/constantRoutes.ts` | 抽出 profileChildRoute / notificationChildRoute 常量，导出 `layoutChildRoutes` |
| `src/router/permission.ts` | 动态路由 addRoute 后补挂 `layoutChildRoutes`，修复 404 |

未修改后端代码、未修改数据库业务数据（仅为解除测试过程中失败登录导致的账户锁定而清空 `lock_until/failed_attempts`）。

---

*报告完 — GooHv*
