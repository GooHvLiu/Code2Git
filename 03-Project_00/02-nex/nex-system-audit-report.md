# nex 前后端系统全量审计与大厂规范化整改报告

> 审计日期：2026-09-24
> 作者：GooHv
> 审计范围：前端 nexCM-V3（Vue3.4 + TS + Vite5 + Element-Plus2.8 + Pinia）+ 后端 nexSM-V3（Express4 + MySQL2 + JWT + Joi）
> 旧 Vue2 工程为只读对照，未修改

---

## 一、总体结论

| 维度 | 结果 |
|---|---|
| 前端 `npm run build`（vue-tsc + vite build） | ✅ exit 0，40.67s |
| 前端 ESLint | ✅ 0 error（15 条既存 warning） |
| 前端 12 个视图模块功能回归 | ✅ 全部可访问、无白屏、无 JS 报错 |
| i18n 中英 key 对称性 | ✅ 各 2731 key，缺失/多余/空值全 0 |
| 后端 OpenAPI 端点覆盖率 | ✅ 193/193 = 100% |
| OpenAPI 在线文档可访问 | ✅ http://localhost:3002/api-docs，0 JS 报错 |
| Vue3 `<script setup>` 覆盖率 | ✅ 69/69 = 100% |
| Pinia setup 写法覆盖率 | ✅ 8/8 = 100% |
| 组件文件夹/index.vue 规范 | ✅ 23/23 = 100% |
| 导入路径 `@/` 别名覆盖率 | ✅ 100%，无 `../../` |

**本次实际修复 1 个高严重级 Bug**：`/profile` 与 `/notification` 直接访问落入 404（Vue Router 4 动态路由重建 matcher 后常驻相对路径子路由丢失），已通过补挂修复。

---

## 二、逐项审计结果（对应用户 9 点要求）

### 1. 国际化配置覆盖所有，配置在前端统一处理

**现状与整改：**
- i18n 入口 `src/i18n/index.ts` 已配置 `legacy: false`（组合式）、`fallbackLocale: false`（严格不兜底，缺 key 直接显示 key）。
- 中文目录 `src/i18n/modules/`、英文目录 `src/i18n/modules-en-us/`，每层 index 聚合、叶子 `export default {}`。
- 中英各 **2731 个 leaf key**，缺失 0、多余 0、空值 0。
- 扫描并修复了 8 个文件中的硬编码中文：
  - `utils/ui/feedback.ts`（删除/批量/退出确认文案）
  - `utils/request/request.ts`（请求取消原因）
  - `utils/business/exportTable.ts`（导出全流程提示与表头）
  - `utils/business/licenseHelper.ts`（授权类型、到期倒计时）
  - `store/modules/errorLog.ts`、`websocket.ts`（未知错误兜底）
  - `composables/useDialog.ts`（新增/编辑标题默认值）
  - `views/system/config/index.vue`（加载中/失败/配置不完整整组状态面板）
- 全局 0 处 `t(key, '默认值')` 兜底调用，0 处 `defaultMessages` 配置。
- 无日文语言包/选项，仅将表单占位符示例 `ja-JP/ko-KR` 改为 `zh-CN/en-US`。
- 后端响应 `msg` 不直接透传展示，拦截器统一用 `common.error.{code}` 映射前端文案。
- 834 个"疑似未用"key 全部保留——均为 `common.dict.*`、`layout.menu.*`、`notification.*`、`common.error.*` 等动态拼接命名空间，静态扫描无法命中。

**新增可复用脚本：**
- `scripts/i18n-symmetry.mjs`：esbuild 打包对比中英 key 树
- `scripts/scan-hardcoded.mjs`：扫描硬编码中文
- `scripts/scan-unused-keys.mjs`：扫描未引用 key

### 2. 抽离标准常用工具模块，增加详细备注

**现状与整改：**
- `src/utils/` 已按功能域分 6 个子目录 + 1 个总线文件：
  - `auth/`（auth.ts / permission.ts / licenseGuard.ts / roleMapper.ts）
  - `business/`（dict / exportTable / licenseHelper / notificationPresenter / translateManager / translationFormat / worldCities）
  - `config/`（config.ts / constants.ts / env.ts）
  - `data/`（cache / date / storage / storageKey / validate）
  - `request/`（request.ts axios 实例 / websocket.ts）
  - `ui/`（feedback.ts 消息确认 / theme.ts）
  - `bus.ts`（mitt 事件总线，替代 Vue2 `$bus`）
- 25 个 utils 文件全部补齐文件头注释（模块用途 + 作者：GooHv + 创建日期），各导出函数已有行内 JSDoc。
- 新建 `src/utils/index.ts` 统一导出 barrel（按域分组，已校验无重名冲突）。
- `src/composables/` 17 个 `useXxx.ts` 全部含 JSDoc（功能描述 + 用法示例 + 作者），参数/返回值通过 TypeScript 强类型 interface 承载。
- 新建 `src/composables/index.ts` 统一导出 17 个 composable。
- `useTable`（纯列表能力）与 `useCrud`（列表+增删改+弹窗+校验）为分层关系，不重叠；`useSysTable` 为 system 模块专用变体。

### 3. 后端使用详细 Open API，可在线查看，每个端口备注清楚，UI 美观

**现状与整改：**
- Swagger 配置 `src/config/swagger.config.js` 从 113 行扩展为完整配置：
  - 21 个 components.schemas（User / Role / Menu / Notification / Dict / DevicePart / EmailConfig + 通用 ApiResponse / PageResult / 错误响应等）
  - 23 个 tag 及业务排序
  - 完整错误码说明
  - apis glob 覆盖所有路由文件
- **22 个业务模块 + 健康检查，共 193 个端点全部添加 `@openapi` JSDoc 注释**，覆盖率 100%：
  - 每个端点含 summary / description / tags / parameters（含 description+schema）/ requestBody（含 example）/ responses（200 + 400/401/403/404）/ security
- UI 美化：
  - 品牌标题「nexSM 管理平台 API 文档」、自定义蓝色 N favicon
  - 专业蓝色主题 + 方法色块（GET 蓝 / POST 绿 / PUT 琥珀 / DELETE 红 / PATCH 紫）
  - explorer 搜索框、filter 标签过滤、docExpansion:none 默认折叠、showRequestHeaders
  - tagsSorter 按业务顺序排序、operationsSorter 按方法排序
- **在线验证通过**：`node app.js` 启动无报错，`http://localhost:3002/api-docs` 返回 200，浏览器控制台 0 条 JS 报错（修复了一处 tagsSorter 闭包引用 Node 常量导致的运行时错误）。
- 截图存于 `backend/public/swagger-screenshots/`（首页 / 端点详情 / 响应示例共 3 张）。

**分模块端点覆盖：**

| 模块 | 端点数 | 覆盖率 |
|---|---|---|
| 用户管理 /user | 21 | 100% |
| 国际化管理 /i18n-manager | 17 | 100% |
| 设备部件 /device-part | 17 | 100% |
| 通知中心 /notification | 15 | 100% |
| 邮箱服务 /email | 15 | 100% |
| 菜单管理 /menu | 14 | 100% |
| 数据字典 /dict | 12 | 100% |
| 数据库管理 /db-manager | 11 | 100% |
| 文件管理 /file-manager | 10 | 100% |
| 功能配置 /feature-config | 9 | 100% |
| 客户管理 /customer | 7 | 100% |
| 文件上传 /upload | 6 | 100% |
| 角色管理 /role | 6 | 100% |
| PLC 通讯 /plc | 5 | 100% |
| 授权管理 /license | 5 | 100% |
| 部门管理 /dept | 5 | 100% |
| 翻译服务 /translation | 5 | 100% |
| 权限管理 /permission | 4 | 100% |
| 系统配置 /config | 3 | 100% |
| 审计追踪 /audit | 3 | 100% |
| 项目配置 /project-config | 1 | 100% |
| 验证码 /captcha | 1 | 100% |
| 健康检查 | 1 | 100% |

### 4. 前端所有功能模块使用 OK

**功能回归测试结果（12 个视图模块，真实浏览器实测）：**

| 模块 | 子页面 | 结果 |
|---|---|---|
| home | overview / dashboard / data | ✅ 设备卡片、趋势图、表格、导出全部正常 |
| device | state / alarm / part | ✅ 状态卡片、报警仪表盘+列表双 Tab、部件寿命管理 |
| error | 404 / 403 | ✅ 错误页正常 |
| license | import | ✅ 授权导入页正常（license-manage 组件存在但未注册路由，应通过 super-panel 入口） |
| login | — | ✅ 双栏布局、SVG 验证码、登录成功 |
| notification | — | ✅ 通知列表、Tab 筛选、批量已读、设置（修复后） |
| permission-core | — | ✅ 权限管理页正常 |
| production | recipe / order | ✅ 配方管理、订单管理 |
| profile | — | ✅ 个人信息展示（修复后） |
| redirect | — | ✅ 自动重定向正常 |
| super-panel | dict/dept/role/config/permission/feature/database/project-config/menu-config/i18n | ✅ 10 个子页全部可访问 |
| system | user/audit/config/permission/device | ✅ 用户管理实测搜索/新增/编辑/删除/分页全通过 |

**全局功能：** 侧边栏折叠 ✅、面包屑 ✅、TagsView 右键菜单 ✅、通知铃铛 ✅、心跳指示 ✅、菜单搜索 ✅、中英文切换 ✅、退出登录入口 ✅。

**i18n 切换实测：** 中英文切换后按钮、列名、面包屑、TagsView、弹窗标题全部正确翻译，无裸露 i18n key，控制台无 missing/fallback 告警。

**控制台：** 0 条 error 级别 JS 错误。

### 5. 架构采用 Vue3 语法 + Express 后端 + Element-Plus，全部修正

**前端 Vue3 语法：**
- 69/69 个 `.vue` 文件全部使用 `<script setup lang="ts">`，0 个 Options API。
- 0 处 `this.$xxx`、0 处 `Vue.set/this.$set`、0 个 `filters` 选项、0 处 `$on/$off` 事件总线（已由 mitt 替代）、0 处 `.sync` 修饰符。
- `v-model` 全为 Vue3 语法（`v-model:propName` / `update:xxx`）。
- 组合式 API（ref/reactive/computed/watch/onMounted）均正确从 vue 使用（AutoImport 已配置）。

**Element-Plus：**
- 全部 UI 组件来自 `element-plus`，无 `element-ui` 导入残留。
- 自动导入配置正确：AutoImport（vue/vue-router/pinia/vue-i18n）+ Components（ElementPlusResolver + ElIcon 图标自动注册）。
- Element-Plus 语言由 App.vue 中 ElConfigProvider 与 i18n locale 联动。

**后端 Express：**
- Express 4 + MVC 架构（routes → controllers → services → db），结构清晰。
- 统一响应中间件 `res.success(data, msg)` / `res.error(code, msg)`。
- Joi 参数校验、JWT 认证、CORS、请求日志、错误处理中间件齐全。

### 6. 按照大厂规范操作和执行

**已落实的规范：**
- **代码规范**：ESLint（eslint:recommended + vue3-recommended + @typescript-eslint），0 error；husky + lint-staged 提交钩子已配置。
- **命名规范**：组件 PascalCase、变量/函数 camelCase、常量 UPPER_SNAKE_CASE，全站统一。
- **文件命名**：组件目录 PascalCase、工具/composable camelCase。
- **导入路径**：100% 使用 `@/` 别名，0 处 `../../` 相对上层路径。
- **注释规范**：组件/composable/utils 全部含文件头注释（功能描述 + 作者 + 日期），导出函数含 JSDoc。
- **状态管理**：Pinia setup 组合式写法，store 不操作 DOM、不引用组件实例。
- **分层架构**：api 层 / composables 逻辑层 / components 组件层 / views 页面层 / store 状态层 / utils 工具层，职责清晰。

### 7. 组件模块化（文件夹/index.vue，子组件文件夹内 index.vue，可复用抽离）

**现状：**
- `src/components/` 下 23 个组件目录**全部**包含 `index.vue` 作为入口：
  Breadcrumb / ConfirmDialog / DictTag / EmailConfig / EmailLog / ExportDropdown / FormDialog / HeartbeatIndicator / MenuSearch / MonacoEditor / NotificationBatchToolbar / NotificationBell / NotificationFilter / NotificationItem / NotificationSettings / Pagination / PartLifeReminder / SearchForm / SvgIcon / TableToolbar / ThemePicker / TranslateProgressDialog / UploadImage。
- 大组件（如 NotificationBell）逻辑内聚于单文件，结构清晰。
- `src/views/` 页面私有子组件以 `components/XxxDialog.vue` 扁平组织（4 个：PartTemplateManager / UserDialog / LanguageConfig / TranslationConfig），均为页面私有、无跨模块复用需求，属可接受的局部组织方式。
- **未发现重复实现的通用组件**——分页/搜索/弹窗/表格工具栏/导出下拉均已在 `src/components/` 单点实现，无需合并迁移。

### 8. 状态管理使用 Vue3 推荐的方式

**现状：**
- 8 个 store（app / device / errorLog / notification / permission / tagsView / user / websocket）**全部**使用 Pinia setup 组合式写法：
  ```ts
  export const useAppStore = defineStore('app', () => {
    const sidebar = ref(...)
    function toggleSideBar() { ... }
    return { sidebar, toggleSideBar }
  })
  ```
- 0 个 options API 写法（state/getters/actions 对象式）。
- `store/index.ts` 统一 `createPinia()` 并默认导出。
- store 内不直接操作 DOM，跨模块副作用走独立模块（websocket、router）。

### 9. 大厂实战角度的意见与建议

详见下方第四节。

---

## 三、本次整改落地清单

### 前端修改

| # | 操作 | 文件数 | 说明 |
|---|---|---|---|
| 1 | 硬编码中文 → i18n key | 8 个文件 | feedback/request/exportTable/licenseHelper/errorLog/websocket/useDialog/system.config |
| 2 | 新增 i18n key（中英对称） | ~25 个 key | common.* / superPanel.license.* / system.config.* |
| 3 | 补全组件文件头注释 | 21 个 components/*/index.vue | 功能描述 + 作者 + 创建日期 |
| 4 | 补全 utils 文件头注释 | 14 个 utils/**/*.ts | 作者 + 创建日期 |
| 5 | 新建统一导出 barrel | 2 个文件 | composables/index.ts、utils/index.ts |
| 6 | 修复路由 404 Bug | 2 个文件 | constantRoutes.ts 抽出 layoutChildRoutes、permission.ts 补挂 |
| 7 | 新增 i18n 审计脚本 | 3 个文件 | scripts/i18n-symmetry.mjs / scan-hardcoded.mjs / scan-unused-keys.mjs |

### 后端修改

| # | 操作 | 文件数 | 说明 |
|---|---|---|---|
| 1 | 扩展 swagger.config.js | 1 个文件 | 21 schemas / 23 tags / UI 选项 / apis glob |
| 2 | app.js 接入 UI 选项 | 1 个文件 | swaggerUi.setup(specs, uiOptions) |
| 3 | 逐端点添加 @openapi 注释 | 23 个路由文件 | 193 个端点全覆盖 |

### 生成的审计报告

| 报告 | 路径 |
|---|---|
| i18n 审计报告 | 前端工程根目录 / i18n-audit-report.md |
| 架构审计报告 | 前端工程根目录 / architecture-audit-report.md |
| 功能回归报告 | 前端工程根目录 / functional-regression-report.md |
| OpenAPI 覆盖清单 | 后端工程根目录 / openapi-coverage.md |
| Swagger 截图 | 后端 / public/swagger-screenshots/（3 张） |

---

## 四、大厂实战建议（第 9 点）

### 4.1 构建与性能优化

1. **Bundle 分包**：当前 `libs` chunk 达 2MB+（echarts / xlsx / jspdf / html2canvas / monaco-editor 打包在一起）。建议在 `vite.config.ts` 配置 `build.rollupOptions.output.manualChunks`，将重型依赖拆为独立 chunk：
   ```js
   manualChunks: {
     echarts: ['echarts'],
     monaco: ['monaco-editor'],
     xlsx: ['xlsx'],
     pdf: ['jspdf', 'html2canvas']
   }
   ```
   同时对这些重型组件使用 `defineAsyncComponent` 做路由级懒加载。

2. **首屏加载**：考虑添加 `vite-plugin-compression` 做 gzip/br 预压缩，配合 Nginx 静态资源压缩。

3. **路由懒加载**：确认所有路由组件均使用 `() => import('...')` 动态导入，避免全量打包。

### 4.2 代码质量保障

1. **TypeScript 严格度**：当前已开启 strict，建议进一步在 CI 中加入 `vue-tsc --noEmit` 作为合并门禁。
2. **ESLint warning 清理**：15 条既存 warning（未使用变量 2 处、dev console 若干、vue/no-v-html 2 处）建议下个迭代清理，逐步将 `no-console` 设为 error（生产构建剔除 console）。
3. **单元测试**：建议引入 Vitest + @vue/test-utils，对 composables（useTable/useCrud/useDialog）和 utils 纯函数做单元测试，目标覆盖率 70%+。
4. **Prettier**：当前未见 Prettier 配置，建议添加 `.prettierrc` 并集成到 lint-staged，统一格式化。
5. **Commit 规范**：husky + lint-staged 已配置，建议增加 commitlint 约束 Conventional Commits 格式（feat/fix/docs/style/refactor/test/chore）。

### 4.3 架构演进

1. **API 层类型化**：当前 `src/api/` 各模块的请求/响应类型建议与后端 OpenAPI schemas 对齐，可考虑使用 `openapi-typescript` 自动生成 TypeScript 类型，避免前后端类型漂移。
2. **Composable 下沉**：`MonacoEditor` 内私有 `debounce`、`super-panel/database` 内私有 `formatDate` 可在后续迭代下沉到 `utils/`，但需配合行为回归测试。
3. **z-index 治理**：当前手动高位 z-index（9999/3000）用于特殊浮层，建议后续通过 Element Plus 官方 `:z-index` prop 或全局 CSS 变量收敛，避免硬编码。
4. **错误边界**：建议添加 Vue3 的 `onErrorCaptured` 全局错误边界组件，捕获渲染错误并展示友好降级 UI，而非白屏。

### 4.4 后端工程化

1. **环境配置**：`.env` 中包含 JWT_SECRET、GitHub Token 等敏感信息，建议：
   - 将 `.env` 加入 `.gitignore`，提供 `.env.example` 模板
   - JWT_SECRET 建议使用 RS256 非对称加密（当前已有 RSA 公钥基础设施，可复用）
   - 生产环境通过环境变量或密钥管理服务注入，不硬编码

2. **日志系统**：当前 `logger.middleware.js` 为基础实现，建议集成 `winston` 或 `pino`，支持日志分级、文件轮转、结构化 JSON 日志，便于 ELK/Loki 采集。

3. **API 版本管理**：当前路由前缀 `/prod-api/v2` 硬编码，建议通过 `app.config.js` 配置化，便于后续 v3 迭代时多版本共存。

4. **数据库迁移**：当前 `test/sql/init.sql` 仅为备份，建议引入 `sequelize-cli` 或 `db-migrate` 做版本化数据库迁移，避免手动改表结构。

5. **接口限流**：建议添加 `express-rate-limit` 对登录、验证码等敏感接口做限流，防暴力破解。

6. **参数校验统一**：Joi 校验已在用，建议将校验 schema 抽到独立文件并复用于 Swagger 参数定义，减少重复维护。

### 4.5 安全加固

1. **Helmet**：建议添加 `helmet` 中间件设置安全响应头（CSP / X-Frame-Options / HSTS 等）。
2. **SQL 注入**：当前使用 mysql2 预编译语句，确认所有动态查询均使用参数化查询，禁止字符串拼接 SQL。
3. **XSS 防护**：前端有 2 处 `v-html`（ESLint warning），建议确认渲染内容已做 DOMPurify 消毒，或改为文本渲染。
4. **文件上传**：multer 已配置大小限制，建议增加文件类型白名单校验和上传后病毒扫描（生产环境）。

### 4.6 监控与运维

1. **健康检查**：已有 testRouter 健康检查端点，建议扩展为 `/health` 返回数据库连接状态、磁盘空间、内存使用率等详细信息。
2. **进程管理**：生产环境建议使用 `pm2` 或 `systemd` 管理 Node 进程，配置自动重启、日志切割、集群模式。
3. **APM 监控**：建议集成 Sentry（前端错误追踪）+ 阿里云 ARMS / Prometheus（后端指标），实现全链路可观测。

### 4.7 i18n 持续维护

1. **CI 集成**：将 `scripts/i18n-symmetry.mjs` 加入 CI 流水线，PR 合并前自动校验中英 key 对称性，防止新增 key 只加一边。
2. **后端字典多语言**：当前表格中"状态"列等字典数据英文模式仍显示中文（后端返回中文），建议后端字典表增加 `value_en` 字段，或前端按字典 code 映射 i18n key。
3. **document.title 同步**：英文模式下动态切换 locale 不经导航时 document.title 不更新，建议在 locale watch 中同步设置。

---

## 五、已知观察项（非阻断，记录待后续处理）

| # | 描述 | 建议处理方式 |
|---|---|---|
| 1 | 英文模式下动态切换 locale 不经导航时 document.title 不实时更新 | locale watch 中同步更新 document.title |
| 2 | 表格"状态"列等字典数据英文模式仍显示中文（后端数据） | 后端字典多语言或前端字典翻译 |
| 3 | `/#/license/manage` 组件存在但未注册路由 | 确认是否应通过 super-panel 入口或独立路由 |
| 4 | build 产物 libs chunk 2MB+ | manualChunks 分包 + 懒加载 |
| 5 | ThemePicker 交互需人工确认 | 确认触发方式与预期行为 |
| 6 | `src/api/i18n-manager.ts` 注释存在历史 GBK→UTF-8 乱码（仅注释） | 后续顺手修复注释编码 |
| 7 | ESLint 15 条 warning | 下个迭代清理 |

---

## 六、验证记录

| 验证项 | 命令/方式 | 结果 |
|---|---|---|
| 前端类型检查 + 构建 | `npm run build`（vue-tsc --noEmit && vite build） | exit 0，40.67s，3955 modules |
| 前端 Lint | `npm run lint` | 0 error，15 warning |
| i18n 对称性 | `node scripts/i18n-symmetry.mjs` | 中英各 2731 key，缺失/多余/空值全 0 |
| 后端服务启动 | `node app.js` | 无报错，Swagger 文档已启用 |
| OpenAPI 在线访问 | 浏览器打开 http://localhost:3002/api-docs | 200，0 JS 报错，193 端点完整 |
| 前端功能回归 | 浏览器自动化逐模块测试 | 12 模块全部通过，1 Bug 已修复 |
| i18n 切换 | 中英文切换实测 | 无裸露 key，无 missing 告警 |

---

*报告完 — GooHv — 2026-09-24*
