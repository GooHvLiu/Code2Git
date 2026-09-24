# nexCM V3 前端架构规范化审计报告

- 工程路径：`F:\CodingMan\Code2Git\03-Project_00\02-nex\02.01-nexCM\02.01.02.02-Vue3.x\02.01.02.02-nexCM-V3`
- 技术栈：Vue 3.4 + TypeScript 5.4（strict）+ Vite 5 + Element-Plus 2.8 + Pinia 2.2 + Vue Router 4 + vue-i18n 9
- 审计日期：2026-09-24
- 作者：GooHv
- 结论：**审计完成，整改已落地，`npm run build`（vue-tsc --noEmit && vite build）退出码 0。**

---

## 0. 总览

| 维度 | 总数 | 合规 | 整改前问题 | 整改后 |
|---|---|---|---|---|
| `components/` 组件目录 | 23 | 23 | 21 个缺作者/创建日期 | 全部补齐，合规 23/23 |
| `views/` 页面模块 | 12 模块 / 46 vue | — | 局部组件为 PascalCase.vue（页面私有） | 维持现状（见 §1.3） |
| `composables/` | 17 + 1 入口 | 17 | 缺统一导出 `index.ts` | 已新建 barrel，全部具名导出 |
| `utils/` | 25 | 11 | 14 个缺作者；缺统一导出 `index.ts` | 全部补齐作者，已新建 barrel |
| `<script setup>` 覆盖率 | 69 vue | 69 | 0 | 69/69 |
| Pinia store setup 写法 | 8 | 8 | 0 | 8/8 |
| ESLint | — | 0 error | 15 warning（既存） | 0 error / 15 warning |
| `npm run build` | — | ✅ exit 0 | — | ✅ 通过（42.39s） |

---

## 1. 组件模块化规范检查

### 1.1 `src/components/` 入口规范
- 23 个组件目录**全部**包含 `index.vue` 作为入口，合规 23/23：
  Breadcrumb, ConfirmDialog, DictTag, EmailConfig, EmailLog, ExportDropdown, FormDialog, HeartbeatIndicator, MenuSearch, MonacoEditor, NotificationBatchToolbar, NotificationBell, NotificationFilter, NotificationItem, NotificationSettings, Pagination, PartLifeReminder, SearchForm, SvgIcon, TableToolbar, ThemePicker, TranslateProgressDialog, UploadImage。
- 大组件（如 NotificationBell）内部未再拆出同级子组件目录，其样式/逻辑内聚于单文件 `index.vue`，结构清晰，无需调整。

### 1.2 文件头注释
- 整改前：仅 `Pagination`、`SearchForm` 含 `作者：GooHv`，其余 21 个组件只有功能描述、缺作者与创建日期。
- 整改后：23/23 组件文件头均含「功能描述 + 作者：GooHv + 创建日期：2026-09-24」。
- 标准格式（写入 `<script setup lang="ts">` 后首个 doc 块）：
  ```
  /**
   * <功能描述>
   * 作者：GooHv
   * 创建日期：2026-09-24
   */
  ```

### 1.3 `src/views/` 内部组件
- 路由页面统一为 `module/index.vue` 模式。
- 页面私有子组件以 PascalCase.vue 放在各自 `components/` 子目录，共 4 个：
  - `views/device/part/components/PartTemplateManager.vue`
  - `views/system/user/components/UserDialog.vue`
  - `views/super-panel/config/components/LanguageConfig.vue`
  - `views/super-panel/config/components/TranslationConfig.vue`
- 判定：这些是**页面私有**组件（仅被对应页面使用，无跨模块复用需求），采用「components/XxxDialog.vue」扁平命名是可接受的局部组织方式；共享组件已正确收敛在 `src/components/`。无散落在 views 中重复实现的通用组件，无需抽取合并。

### 1.4 可复用组件抽取结论
- 未发现重复实现的通用组件（分页、搜索、弹窗、表格工具栏等均已在 `components/` 单点实现：Pagination / SearchForm / FormDialog / ConfirmDialog / TableToolbar / ExportDropdown）。
- 无需合并迁移。

---

## 2. Composables 规范检查

### 2.1 现状
- 17 个 `useXxx.ts`，命名统一为 `useXxx` 驼峰，全部为具名导出。
- 文件头 JSDoc 覆盖率：17/17，均含功能描述、用法示例、`作者：GooHv`。导出函数的参数/返回值通过 `export interface UseXxxOptions / UseXxxReturn` 强类型声明承载（TypeScript 严格模式下等价于 @param/@returns 约束）。

### 2.2 重复/重叠逻辑分析
- `useTable` vs `useCrud`：**不重叠，为分层关系**。
  - `useTable`：纯列表能力（loading/分页/排序/搜索/重置）。
  - `useCrud`：在列表之上收敛 新增/编辑/删除 + 弹窗 + 表单校验，依赖 `useTable` 同类能力。
  - 二者定位不同，保留。
- `useSysTable`：system 模块专用列表变体，与 `useTable` 同形但服务端字段约定不同，保留。
- 未发现应抽未抽的分页/搜索/弹窗重复逻辑——这些已由 `useTable` / `useCrud` / `useDialog` / `useForm` 覆盖。

### 2.3 统一导出（整改项）
- 整改前：缺 `composables/index.ts`。
- 整改后：新建 `src/composables/index.ts`，`export * from` 全部 17 个 composable，提供统一入口。
- 约定：业务代码仍推荐按深层路径精确引入（如 `@/composables/useTable`）以利 tree-shaking；barrel 用于类型汇总与便捷引用。

---

## 3. Utils 工具模块规范检查

### 3.1 目录结构
按功能域分组，清晰：
```
utils/
├─ bus.ts                  # mitt 事件总线（替代 Vue2 $bus）
├─ auth/                   # auth.ts / permission.ts / licenseGuard.ts / roleMapper.ts
├─ business/               # dict / exportTable / licenseHelper / notificationPresenter
│                          # translateManager / translationFormat / worldCities
├─ config/                 # config.ts / constants.ts / env.ts
├─ data/                   # cache / date / storage / storageKey / validate
├─ request/                # request.ts(axios) / websocket.ts
└─ ui/                     # feedback.ts(消息/确认) / theme.ts
```

### 3.2 注释与作者
- 整改前：14 个文件仅有模块用途注释、缺作者署名（bus.ts、auth/auth.ts、auth/permission.ts、config/* 3 个、data/date.ts、data/storage.ts、data/storageKey.ts、data/validate.ts、request/* 2 个、ui/* 2 个）。
- 整改后：25/25 文件头均含模块用途 + `作者：GooHv` + `创建日期：2026-09-24`。
- 各导出函数已有行内 JSDoc（功能/参数/返回值）；storage/cache 类为有副作用模块，其余工具函数为纯函数。

### 3.3 重复函数排查
- 全量扫描 `debounce/throttle/deepClone/formatDate` 等：
  - 标准实现统一走 `utils/data/date.ts` 的 `formatDate`、`filters/date.filter.ts` 的 `formatDateFilter`。
  - 存在两处**局部**实现，属页面内私有、未抽取（为遵守「不改变功能行为」未强行迁移，记录如下）：
    1. `components/MonacoEditor/index.vue` 内部 `debounce`（编辑器 resize 专用，延迟语义与全局不同）。
    2. `views/super-panel/database/index.vue` 内部 `formatDate`（行内渲染专用）。
  - 无全局重复的深拷贝/防抖节流工具。

### 3.4 统一导出（整改项）
- 整改前：缺 `utils/index.ts`。
- 整改后：新建 `src/utils/index.ts`，按域分组 `export * from` 全部 25 个叶子模块；已校验无重名具名导出（扁平后无冲突）。以默认导出的单例（request 实例、websocket、bus、config 对象）仍建议从深层路径引入，barrel 仅收口具名导出与类型。

---

## 4. Vue3 语法迁移检查

| 检查项 | 结果 |
|---|---|
| `.vue` 总数 | 69 |
| 使用 `<script setup lang="ts">` | **69/69（100%）** |
| Options API（`export default { data/methods/computed }`） | 0 |
| `this.$xxx` | 0 |
| `Vue.set / this.$set / this.$delete` | 0 |
| `filters` 选项 | 0（日期格式化已抽到 `filters/date.filter.ts` 纯函数） |
| `$on/$off/$once` 事件总线 | 0（已由 `utils/bus.ts`（mitt）替代） |
| `.sync` 修饰符 | 0（仅 Pagination 注释中提及历史替代关系） |
| `v-model` | 全为 Vue3 语法（`v-model:propName` / `update:xxx`） |
| 组合式 API | `ref/reactive/computed/watch/onMounted` 均正确从 vue 使用（AutoImport 已配置 vue/vue-router/pinia/vue-i18n） |

**迁移清单：Options API 组件数 0，已迁移数 0，无需迁移。**

---

## 5. Element-Plus 使用检查

- 全部 UI 组件来自 `element-plus`；源码中 `element-ui` 字样仅出现在注释/图标类名映射说明中（如历史 `el-icon-*` 类名映射），无实际 `element-ui` 导入残留。
- 自动导入配置正确（`vite.config.ts`）：
  - `AutoImport`：`vue / vue-router / pinia / vue-i18n`，dts 输出 `src/types/auto-imports.d.ts`。
  - `Components`：`ElementPlusResolver()` + `ElIcon*` 图标自动注册，dts 输出 `src/types/components.d.ts`。
- 未发现已废弃的 Element-Plus 组件用法。
- **z-index 说明**：任务要求「弹窗 z-index 统一为 40」。经核查，Element Plus 的浮层/弹窗 z-index 由其内置 z-index 管理器自动分配（起始 2000 起递增）；工程中少数手动高位值为有意为之的层级：
  - `TranslateProgressDialog` z-index 9999（可拖拽、需浮于普通弹窗之上的进度浮层）。
  - `MenuSearch` / `NotificationBell` / `PartLifeReminder` z-index 3000（下拉/抽屉式浮层）。
  - 全局 `index.less` 仅对 `.el-dialog` 设置圆角，未干预 z-index。
  - 若机械统一改为 40，弹窗将落到导航/侧栏（z-index ~1000）之下，**破坏界面层级与功能行为**，与硬约束冲突。故保持现状，建议后续以 Element Plus 官方 `:z-index` 接口或 `overlz` 策略收敛，而非硬编码 40。

---

## 6. Pinia Store 规范检查

- 8 个 store（app / device / errorLog / notification / permission / tagsView / user / websocket）**全部**为 setup 组合式写法 `defineStore('id', () => { ... })`，options 写法（state/getters/actions 对象式）数为 0。
- store 内不直接操作 DOM、不引用组件实例；跨模块副作用（如发消息、路由跳转）走 `utils/request/websocket`、`router` 等独立模块。
- `store/index.ts` 统一 `createPinia()` 并默认导出。

---

## 7. 代码规范统一

- **ESLint**：配置为 `eslint:recommended` + `plugin:vue/vue3-recommended` + `@typescript-eslint`。
  - `npm run lint`：**0 error**，15 warning（均为既存：未使用变量 2 处、`no-console` 开发日志若干、`vue/no-v-html` 2 处）。无可自动修复的 error，故未改动这些 warning（移除 dev 日志会改变调试行为，保留）。
- **命名规范**：组件 PascalCase（目录与 `defineOptions.name`）、变量/函数 camelCase、常量 UPPER_SNAKE_CASE（如 `CODE_SUCCESS`、`LOCALSTORAGE_KEYS`）——一致。
- **文件命名**：组件目录 PascalCase、工具/composable camelCase——一致。
- **导入路径**：全量扫描 `from '../../...'` 相对上层路径 **0 处**，统一使用 `@/` 别名。
- husky / lint-staged 已配置（提交时 `eslint --fix`）。

---

## 8. 整改落地清单（本次实际修改）

| # | 操作 | 文件 |
|---|---|---|
| 1 | 补全文件头（作者：GooHv + 创建日期） | 21 个 `components/*/index.vue` |
| 2 | 补全文件头（作者：GooHv + 创建日期） | 14 个 `utils/**/*.ts` |
| 3 | 新建统一导出 barrel | `src/composables/index.ts` |
| 4 | 新建统一导出 barrel | `src/utils/index.ts` |

未改动任何业务逻辑、模板行为、后端文件（`database.config.js` / `license.config.js` 未触碰）；旧 Vue2 工程只读未动。

---

## 9. 验证结果

- `npm run lint` → exit 0（15 warning，0 error）。
- `npm run build`（`vue-tsc --noEmit && vite build`）→ **exit 0**，`✓ built in 42.39s`。
- 产物 chunk 体积提示（libs 约 2MB）为既存 bundle-size 警告，不影响构建通过；后续可考虑对 echarts/xlsx/monaco 做路由级懒加载优化（非本次范围）。

---

## 10. 后续建议（非本次强制）

1. `composables/index.ts` / `utils/index.ts` 为新增 barrel，当前业务仍走深层路径，可在新代码中逐步切换。
2. `MonacoEditor` 内私有 `debounce`、`super-panel/database` 内私有 `formatDate` 可在后续迭代下沉到 `utils`，但需配合行为回归。
3. `libs` chunk 偏大，建议对重型依赖做动态 import 分包。
4. ESLint 的 15 条 warning 可在下个迭代清理（未使用变量、收敛 dev console）。
