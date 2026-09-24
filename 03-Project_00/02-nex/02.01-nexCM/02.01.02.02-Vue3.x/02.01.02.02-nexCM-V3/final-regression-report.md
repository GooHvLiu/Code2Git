# nexCM V3 全量功能回归测试报告

> **测试日期**：2026-09-24
> **测试环境**：前端 dev (8082) + 后端 (3002) + MySQL (nexsm_v2_dev)
> **测试账号**：liuguohui / 12345678 (Super_Admin)
> **作者**：GooHv

---

## 一、总体结论

| 维度 | 结果 |
|------|------|
| 12 视图模块加载 | **全部通过**（动态路由首次加载有 2-3s 延迟，属正常） |
| i18n 英文模式 | **基本通过**，存在 3 处字典翻译缺口（详见第三节） |
| 安全加固（v-html → v-safe-html） | **通过** |
| `npm run build` | **exit 0**，构建耗时 41.94s |
| `npm run test` | **99/99 全部通过**（10 个测试文件） |
| 首屏 chunk < 500KB | **通过**（index-BsqKMgWi.js = 393.60 kB / gzip 142.23 kB） |
| 全局功能（折叠/搜索/通知/面包屑/TagsView） | **全部通过** |
| 浏览器 JS 错误 | **0 个 error** |

---

## 二、逐模块测试结果

### 2.1 home 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /home/overview | 概况预览 - nexCM 标准版本 | ✅ 通过 | 4 张统计卡片 + 24h 趋势图 + 实时报警面板正常渲染 |
| /home/dashboard | 数据看板 - nexCM 标准版本 | ✅ 通过 | 内容丰富（860 字符），无报错 |
| /home/data | 数据管理 - nexCM 标准版本 | ✅ 通过 | 产量统计表格 30 条记录，分页正常，子 Tab 切换正常 |

### 2.2 device 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /device/state | 设备状态 - nexCM 标准版本 | ✅ 通过 | 设备实时状态面板 |
| /device/alarm | 报警统计 - nexCM 标准版本 | ✅ 通过 | 报警统计页面正常 |
| /device/part | 部件寿命 - nexCM 标准版本 | ✅ 通过 | 4 个部件卡片 + 备件管理表格 + 最近更换记录 |

### 2.3 error 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /error/404 | 404 - 页面不存在 - nexCM 标准版本 | ✅ 通过 | 404 页面正常 |
| /error/403 | 403 | ✅ 通过 | 有权限时重定向到首页（预期行为） |

### 2.4 license 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /license/import | 授权导入 - nexCM 标准版本 | ✅ 通过 | 授权导入页面正常 |

### 2.5 login 模块

| 路由 | 结果 | 说明 |
|------|------|------|
| /login | ✅ 通过 | 登录/注册双 Tab，SVG 验证码正常，登录跳转正常 |

### 2.6 notification 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /notification | 通知中心 - nexCM 标准版本 | ✅ 通过 | 通知列表 + 分类 Tab（全部/设备通知/生产通知/系统通知）+ 分页 |

### 2.7 permission-core 模块

| 路由 | 结果 | 说明 |
|------|------|------|
| /permission-core | ✅ 通过 | 非直接路由，访问时正确落到 404 页面 |

### 2.8 production 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /production/recipe | 配方管理 - nexCM 标准版本 | ✅ 通过 | 配方列表 + 详细参数面板（轴参数/速度参数/延迟参数） |
| /production/order | 订单管理 - nexCM 标准版本 | ✅ 通过 | 订单列表正常 |

### 2.9 profile 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /profile | 个人中心 - nexCM 标准版本 | ✅ 通过 | **上一轮修复的 404 bug 已验证修复**，显示用户完整信息 |

### 2.10 redirect 模块

| 路由 | 结果 | 说明 |
|------|------|------|
| /redirect | ✅ 通过 | 重定向组件正常工作 |

### 2.11 super-panel 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /super-panel/dict | 字典管理 - nexCM 标准版本 | ✅ 通过 | 字典列表正常 |
| /super-panel/dept | 部门管理 - nexCM 标准版本 | ✅ 通过 | 部门树正常 |
| /super-panel/role | 角色管理 - nexCM 标准版本 | ✅ 通过 | 4 个角色列表，状态列正常 |
| /super-panel/config | 参数管理 - nexCM 标准版本 | ✅ 通过 | 系统参数配置 |
| /super-panel/permission | 权限管理 - nexCM 标准版本 | ✅ 通过 | 权限列表正常 |
| /super-panel/feature | 功能管理 - nexCM 标准版本 | ✅ 通过 | 功能点管理（2229 字符内容） |
| /super-panel/database | 数据管理 - nexCM 标准版本 | ✅ 通过 | 数据库表管理（1003 字符） |
| /super-panel/project-config | 项目管理 - nexCM 标准版本 | ✅ 通过 | 项目配置（1162 字符） |
| /super-panel/menu-config | 菜单管理 - nexCM 标准版本 | ✅ 通过 | 菜单配置（2561 字符） |
| /super-panel/i18n | 语言管理 - nexCM 标准版本 | ✅ 通过 | 语言配置页面，空状态提示选择语言文件 |

### 2.12 system 模块

| 路由 | 页面标题 | 结果 | 说明 |
|------|----------|------|------|
| /system/user | 用户管理 - nexCM 标准版本 | ✅ 通过 | 6 条用户记录，新增弹窗正常打开（用户名/密码/性别/手机/邮箱/角色/部门/备注） |
| /system/audit | 审计日志 - nexCM 标准版本 | ✅ 通过 | 审计日志列表正常 |
| /system/config | 参数管理 - nexCM 标准版本 | ✅ 通过 | 系统参数配置 |
| /system/permission | 权限管理 - nexCM 标准版本 | ✅ 通过 | 权限列表正常 |
| /system/device | 设备管理 - nexCM 标准版本 | ✅ 通过 | 设备列表正常 |

---

## 三、i18n 英文模式验证

### 3.1 验证通过项

| 验证项 | 结果 | 说明 |
|--------|------|------|
| document.title 实时更新 | ✅ 通过 | 切换语言后 title 立即从 "用户管理 - nexCM 标准版本" 变为 "UserMgmt - nexCM Standard"，无需重新导航 |
| 面包屑翻译 | ✅ 通过 | "系统设置 / 用户管理" → "SysSetup / UserMgmt" |
| TagsView 标签翻译 | ✅ 通过 | 全部 Tab 标签同步翻译（概况预览→OverView, 数据看板→DashBoard 等） |
| 按钮/表单/表格表头翻译 | ✅ 通过 | 新增→Add, 搜索→Search, 重置→Reset, 编辑→Edit, 删除→Delete 等 |
| 状态字典翻译（用户页） | ✅ 通过 | "启用" → "Active"（绿色 Tag） |
| 角色字典翻译（角色页） | ✅ 通过 | "启用" → "Enable" |
| 无裸露 i18n key | ✅ 通过 | 未发现 `common.dict.items.xxx` 格式的裸露 key |
| 通知中心英文 | ✅ 通过 | 页面标题 "Notification Center" |

### 3.2 中文残留清单（需后续补充 i18n key）

| 页面 | 残留中文 | 期望值 | 原因分析 |
|------|----------|--------|----------|
| home/overview | "白班" | "Day Shift" | 班次字典值未配置英文翻译 |
| system/audit | "系统登录"、"账户锁定" | "System Login"、"Account Locked" | 审计日志 Target 列直接显示数据库原始值，未走字典翻译 |
| device/state | "运行中"、"白班"、"灌装机"、"生产车间"、"江苏无锡"、"中国"、"设备振动"、"灌装温度"、"灌装体积"、"加塞压力"、"真空度"、"运行速度"、"小时"、"分钟"、"瓶"、"区" | 对应英文 | 设备实时监控面板的参数标签为硬编码中文或设备点位数据未走 i18n |
| production/order | "卡式瓶"、"卡式瓶配方"、"卡式瓶灌装"、"张工"、"标准" | — | **业务数据**（产品名称/配方名称/操作员姓名），存储在数据库中为中文，属正常 |

> **说明**：production/order 中的中文为业务数据（产品名、人名），不是 i18n 缺陷。其余残留均为字典/硬编码翻译缺口，需在对应 i18n 语言文件中补充 key。

---

## 四、安全加固验证

| 验证项 | 结果 | 说明 |
|--------|------|------|
| 全局原生 v-html 使用 | ✅ 0 处 | 源码中唯一命中为 `safeHtml.ts` 注释中的说明文字 |
| v-safe-html 指令注册 | ✅ 已注册 | `main.ts` 中 `app.directive('safe-html', safeHtmlDirective)` |
| DOMPurify 消毒 | ✅ 已实现 | `src/utils/security/dompurify.ts` 封装，指令内自动调用 |
| 富文本页面渲染 | ✅ 正常 | dashboard 等页面内容正常渲染 |

---

## 五、构建 / 测试产物验证

### 5.1 构建结果

```
npm run build → exit 0
✓ built in 41.94s
```

**首屏 chunk 分析：**

| Chunk | 大小 | gzip | 说明 |
|-------|------|------|------|
| index-BsqKMgWi.js (主入口) | 393.60 kB | 142.23 kB | ✅ < 500KB |
| element-plus-C1q3BIId.js | 973.54 kB | 310.47 kB | 独立 chunk |
| echarts-GDH8hmo7.js | 1,125.61 kB | 378.65 kB | 独立 chunk（懒加载） |
| monaco-CCN0I2dx.js | 2,755.31 kB | 700.12 kB | 独立 chunk（懒加载） |
| xlsx-CXcLtcYO.js | 281.85 kB | 94.77 kB | 独立 chunk（懒加载） |
| pdf-Bgb4ZoN6.js | 559.95 kB | 166.35 kB | 独立 chunk（懒加载） |

✅ echarts / monaco / xlsx / pdf 均未打入首屏 chunk。

### 5.2 单元测试结果

```
Test Files  10 passed (10)
     Tests  99 passed (99)
  Duration  5.53s
```

| 测试文件 | 用例数 |
|----------|--------|
| permission.test.ts | 17 |
| date.test.ts | 17 |
| i18n-symmetry.test.ts | 5 |
| useDialog.test.ts | 7 |
| validate.test.ts | 14 |
| dict.test.ts | 9 |
| app.test.ts | 5 |
| storage.test.ts | 9 |
| useTable.test.ts | 9 |
| tagsView.test.ts | 7 |

---

## 六、全局功能测试

| 功能 | 结果 | 说明 |
|------|------|------|
| 侧边栏折叠/展开 | ✅ 通过 | 点击汉堡按钮正常折叠为图标模式，再点展开 |
| 面包屑导航 | ✅ 通过 | 随路由实时更新 |
| TagsView 标签栏 | ✅ 通过 | 多标签页打开正常，关闭按钮正常 |
| TagsView 右键菜单 | ✅ 通过 | 右键菜单组件已挂载（TagMenus.vue） |
| 通知铃铛 | ✅ 通过 | 点击展开通知下拉，显示最近通知 + "查看全部"链接 |
| 菜单搜索 | ✅ 通过 | 输入"用户"实时匹配"用户管理"、"系统设置" |
| 用户下拉菜单 | ✅ 通过 | 个人中心 / 退出登录 正常 |
| 语言切换 | ✅ 通过 | ThemePicker → 语言切换 → 中文/English 双向切换正常 |

---

## 七、浏览器控制台错误汇总

### Error 级别：0 个

### Warning 级别（非阻断性）：

| Warning | 严重度 | 说明 |
|---------|--------|------|
| `[Vue Router warn]: No match found for location with path "/xxx"` | 低 | 动态路由首次导航时的瞬时警告，路由加载后自动消失，不影响功能 |
| `[Vue warn]: Failed to resolve component: Refresh / Plus / QuestionFilled` | 低 | Element Plus 图标组件未全局注册，但页面图标渲染正常（可能通过模板内 import 或自动导入解决） |
| `ElementPlusError: [props] type.text is about to be deprecated` | 低 | Element Plus Button 的 `type="text"` 将在 3.0 废弃，建议迁移为 `link` 属性 |

---

## 八、发现的问题及修复清单

### 本次测试未修复任何代码（无需修复）

所有发现的问题均为 **i18n 翻译内容缺口**（需在语言 JSON 文件中补充 key）或 **非阻断性 warning**，不影响功能运行。

### 建议后续处理（非本次回归范围）：

1. **补充字典 i18n key**：为 `order_status`、审计日志 action target、班次等字典值在 `en-US` 语言文件中补充翻译
2. **device/state 页面参数标签**：将硬编码中文设备参数标签迁移为 i18n 引用
3. **Element Plus 图标全局注册**：消除 `Failed to resolve component` warning
4. **Button type.text 迁移**：将 `type="text"` 替换为 `link` 属性以兼容 Element Plus 3.0

---

## 九、改动文件记录

**无文件改动。** 本次回归测试未修改任何源代码。

---

*报告生成时间：2026-09-24 | GooHv*
