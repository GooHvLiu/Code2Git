# nexCM V3 — Vue3 + Vite + TypeScript 迁移工程

> 作者：GooHv ｜ 由 Vue 2.7（Vue CLI）工程**旁路全量迁移**而来，源工程保持只读零改动。
> 本工程为迁移最终联调收口版：全量 `vue-tsc` / `eslint` / `vite build` / `vite dev` 门禁已通过。

---

## 1. 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vue 3.4（Composition API + `<script setup lang="ts">`） |
| 构建 | Vite 5 |
| 语言 | **TypeScript（strict / noImplicitAny / strictNullChecks）** |
| UI | Element Plus 2.x + @element-plus/icons-vue（unplugin 按需自动注册） |
| 状态 | Pinia 2（setup store 风格） |
| 路由 | Vue Router 4（hash 模式） |
| 国际化 | vue-i18n 9（`legacy: false`，仅 zh-CN / en-US） |
| 请求 | axios 1 + WebSocket（mitt 事件总线） |
| 图表/导出 | ECharts 6 / xlsx 0.18 / jspdf / html2canvas |
| 编辑器 | monaco-editor 0.34 |

后端（Express + MySQL，零改动）dev 端口 **3002**；本工程 dev 端口 **8082**，代理 `/prod-api`→`http://127.0.0.1:3002`、`/ws-api`（`ws:true`）。

## 2. 环境、安装与启动

```bash
# Node >= 18，npm >= 9
npm install

npm run dev        # 启动 dev，http://localhost:8082
npm run build      # 生产构建 = vue-tsc --noEmit && vite build
npm run type-check # 全工程类型检查
npm run lint       # eslint src --ext .ts,.vue
```

## 3. 目录结构（src）

```
src/
├─ api/                 # 20 个接口模块
├─ components/          # 23 个全局/通用组件（Pagination/SvgIcon/DictTag/SearchForm/TableToolbar/UploadImage 等）
├─ composables/         # 17 个 useXxx（见第 5 节）
├─ directives/          # permission / watermark
├─ layout/              # AppMain / Navbar / Sidebar / TagsView
├─ views/               # 38 个页面（system / super-panel / device / production / home / license / login / notification / error / profile）
├─ store/modules/       # 8 个 Pinia：app / user / permission / tagsView / errorLog / websocket / device / notification
├─ router/              # router4 + permission 守卫 + 动态路由
├─ i18n/                # modules(zh) / modules-en-us，按业务域分文件
├─ plugins/             # element 按需、components 全局注册
├─ utils/               # auth / request / business / ui / config / feedback
└─ main.ts
```

## 4. 相对 Vue2 的主要迁移内容

- `new Vue()` → `createApp()`；`Vue.use/prototype.$xxx` → `app.use()` / `app.config.globalProperties` / 直接 import 纯函数。
- Vuex 8 module → **Pinia** setup store（user / permission / tagsView 为路由与布局强依赖，优先迁完）。
- `.sync`(64 处) → `v-model`；`slot-scope` → `#default` / `v-slot`；`.native` 全部移除；`$set/$delete` → 直接赋值。
- 命令式 `this.$message/$confirm/$notify` → `ElMessage / ElMessageBox` 具名导入。
- element-ui 字体图标 `el-icon-xxx` → `@element-plus/icons-vue` 图标组件。
- Vue CLI `vue.config.js` 特色等价迁移：主题变量 JS↔Less 共享、`additionalData` 全局注入 less、svg-sprite → `vite-plugin-svg-icons`、Monaco 语言分包、`@→src` alias。
- 路由 reset：`router.matcher` 重置 → 遍历 `removeRoute` 后 `addRoute`；通配 `*` → `/:pathMatch(.*)*`；`scrollBehavior` 改 `{top:0}`。
- `babel-plugin-component` 按需 → `unplugin-auto-import` + `unplugin-vue-components`。
- 环境变量 `VUE_APP_*` → `import.meta.env.VITE_*`（经 `@/utils/config/config` 兼容封装）。

## 5. composables（useXxx）完整清单

### 5.1 底层通用（本轮去 `@ts-nocheck`、补 interface / 泛型 / 显式返回类型）

| 文件 | 用途 |
|---|---|
| `useTable<T,F>` | 通用分页表格：loading/分页/sort/reset/getList，`tableData` 用 `shallowRef<T[]>`，`beforeFetch` 钩子。 |
| `useCrud<T,F>` | 在 useTable 之上封装增删改查：createApi/updateApi/deleteApi/afterFetch 泛型化。 |
| `useForm<F>` | 表单 ref、reset、校验、`form` 经 `as Ref<F>` 断言。 |
| `useDialog` | 弹窗 visible / open / close / loading 统一封装。 |
| `useDict` | 字典加载、缓存、i18n 标签映射。 |
| `useI18n` | `legacy:false` 下用 `i18n.global.t.bind(i18n.global)` 暴露 t/te/rt。 |
| `useResize` | 监听窗口宽度，`useAppStore().toggleDevice()/closeSideBar()`。 |
| `useSessionTimeout` | 会话超时计时与活动监听，超时 `useUserStore().logout()`。 |
| `useNotification` | 通知未读数、轮次、WebSocket 回调收窄（替代原 `store.commit`）。 |
| `useLicense` | 许可证查询/下载/复制/倒计时，依赖 `utils/business/licenseHelper`（本轮新建并补类型）。 |

### 5.2 system shard 外层类型化包装

| 文件 | 用途 |
|---|---|
| `useSysTable` | 在 useTable 之上加 system 域查询参数/列约定的强类型包装。 |
| `useSysDict` | system 域字典类型化包装。 |

### 5.3 业务域抽取

| 文件 | 用途 |
|---|---|
| `useDevDashboard` | 设备看板：世界地图/设备状态/产量趋势/实时数据聚合。 |
| `useDevAlarm` | 设备报警列表/详情/处理/统计。 |
| `useProdRecipe` | 生产配方 CRUD 与版本管理。 |
| `useProdOrder` | 生产工单查询/状态流转。 |
| `useSpConfigFileEditor` | super-panel 配置文件编辑器：语法校验/版本历史/备份/保存。 |

> 抽取原则：跨页面重复 ≥2 次或明显通用的逻辑才下沉；均带 JSDoc、入参/返回说明。`src/utils/business/worldCities.ts` 为大型静态数据文件，刻意保留 `@ts-nocheck`。

## 6. i18n 补全 / 差异清单

**强约束**：`legacy:false`、**不设 fallbackLocale、缺 key 直接显示 key**（预期行为，便于暴露问题）；仅 zh-CN / en-US 两套；`i18n/index.ts` 内置 `validateI18nConsistency` 在 dev 运行时校验中英对称。

本轮补全：
- `system.audit.page.resultSuccess / resultFailed`（audit 导出列 formatter）中英两份。
- `superPanel.license.manage.{machineBinding,machineId,copy}` 新建专属命名空间；`views/license/license-manage` 中原借用的近似 key 改指到此。
- `layout.home.dashboard.*` 与 `layout.home.data.*` 新增（home 两页面硬编码中文全部抽 key，含 ECharts tooltip、星期数组、状态映射），中英逐键对齐。

**静态 diff 统计**（Node 脚本对比 `t('...')` 调用 vs `i18n/modules*` 实际 key）：

- zh keys **2394** = en keys **2394**，中英完全对称（zh-only / en-only 均为 0）。
- 调用 key 1564；脚本报"调用了但两份都不存在"341 个，经核实：
  - 约 280 个 `superPanel.menuConfig.*` 系**文件名别名误报**（文件 `menu-config.ts`，调用驼峰 `menuConfig`），key 实际存在；
  - 其余为跨 shard 既有项（`login.*` 疑似缺 `layout.` 前缀、`notification/heartbeat/common` 零散 key），以 dev 运行时 `validateI18nConsistency` 实际 warn 为准，不据静态脚本盲目批量补 key。

## 7. 全量门禁结果（真实执行）

| 门禁 | 结果 |
|---|---|
| `npx vue-tsc --noEmit` | **0 error**（全工程） |
| `npm run lint` | **0 error**，14 warning（均为合理 `console.warn` 与 2 处 `v-html`） |
| `npm run build`（vue-tsc && vite build） | **通过**，3927 modules，gzip 产物正常 |
| `npm run dev` | 2289ms 启动；`http://127.0.0.1:8082/` → 200，`/src/main.ts` → 200，无 Vite 编译错误 |

本轮为打通门禁就地修复的跨 shard 类型问题：DictTag tag type 联合收窄、UploadImage `before-upload` 改用 `UploadRawFile`、super-panel/config 的 switch 字段补显式类型、menu-config 的 `getMenuTypeTagType` 去掉非法空串、switch `@change` 回调签名放宽、i18n 页 dropdown `@command` 回调补 `: string`、preview.vue 废弃 `<el-submenu>` → `<el-sub-menu>`、useLicense/useSessionTimeout 规避 ESLint 不识别的 DOM 全局类型名。

## 8. 已知遗留与后续待办

- 生产 chunk 提示：`index-*.js` 约 3.6MB、`libs` 约 2MB（含 ECharts/Monaco 全量语言）。后续可按路由与 Monaco 语言做更细 `manualChunks` / 动态拆分。
- i18n 静态 diff 中 `login.*` 前缀、`notification/heartbeat/common` 零散 key 需在 dev 浏览器控制台以 `validateI18nConsistency` warn 为准逐个确认真缺或别名。
- 14 个 lint warning（no-console / v-html）为有意保留，后续可统一收敛日志封装与 `v-html` 转义。
- `src/utils/business/worldCities.ts` 保留 `@ts-nocheck`（大型静态数据）。
- 运行时关键链路（登录、动态路由/按钮权限、布局菜单、中英切换、CRUD 弹窗、WebSocket 在线状态）需在连通后端 3002 后端到端回归。

## 9. 逐模块迁移进度

| 模块 | 状态 |
|---|---|
| 地基（main/router4/Pinia/i18n9/axios/样式主题/svg/Monaco/指令） | ✅ 完成 |
| 通用组件 23 个（Pagination/SvgIcon/DictTag/SearchForm/TableToolbar/UploadImage/ExportDropdown/NotificationItem/TranslateProgressDialog 等） | ✅ 完成 |
| Pinia 8 store | ✅ 完成 |
| composables 17 个 | ✅ 完成（0 @ts-nocheck，worldCities 除外） |
| login / layout / home / error / profile | ✅ 完成 |
| device（dashboard/alarm/part/state） | ✅ 完成 |
| production（order/recipe） | ✅ 完成 |
| notification（center/events） | ✅ 完成 |
| license（manage/import） | ✅ 完成 |
| system（user/role/dept/dict/config/audit/permission/errorLog） | ✅ 完成 |
| super-panel（menu-config/project-config/database/i18n/license/config/role/dept/dict/feature） | ✅ 完成 |

---

*迁移规则详见 `MAINTAINER_MIGRATION_RULES.md`。源工程只读，严禁改动。*
