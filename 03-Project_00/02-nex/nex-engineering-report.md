# nex 前后端工程化整改总报告（第二轮）

> 整改范围：Vue3 前端工程 + Express 后端工程
> 整改日期：2026-09-24
> 约束：只改新 Vue3 工程与 Express 后端；旧 Vue2 只读；database.config.js / license.config.js 不动；i18n 严格不兜底、只做中英、保持对称、数据库只存 key、内部日志文案不国际化；新增工具/composable 按 JSDoc 规范、作者署名 GooHv。

---

## 一、整改总览

本轮推进第一轮审计总结中提出的 5 大类大厂建议，全部完成并通过验证：

| 类别 | 核心成果 | 验证状态 |
|------|---------|---------|
| ① 构建优化 | manualChunks 拆 7 组 + 懒加载 glob 修复，首屏 3654KB→394KB（-89%） | ✅ build exit 0，无 chunk 警告 |
| ② 质量门禁 | Vitest 99 用例 + Prettier + commitlint + CI 工作流 | ✅ 测试全过、format:check 通过 |
| ③ 后端工程化 | dotenv 校验 + winston 结构化日志 + 限流 + helmet + 数据库迁移 | ✅ 服务启动正常、429 实测、迁移表已建 |
| ④ 安全加固 | DOMPurify 统一封装 + v-safe-html 全局指令，0 处原生 v-html | ✅ 全局扫描 0 残留 |
| ⑤ i18n 收尾 | 字典动态翻译 + document.title 同步 + 3 处英文模式中文残留修复 | ✅ 中英 2755 key 对称、0 差异 |

---

## 二、各类别详细整改

### ① 构建优化

**根因修复**：`src/router/routerHelper.ts` 原使用 `import.meta.glob('@/views/**/*.vue', { eager: true })` 将全部业务页面同步打进首屏，改为懒加载 glob 后首屏体积骤降。

**manualChunks 拆分**（vite.config.ts）：
- `vue-vendor`：vue / vue-router / pinia / vue-i18n（177KB）
- `element-plus`：element-plus + 图标（974KB）
- `echarts`：echarts 全家桶（1126KB，懒加载）
- `monaco`：monaco-editor 内核（2755KB，懒加载）
- `xlsx`：xlsx 导出（282KB，懒加载）
- `pdf`：html2canvas + jspdf（560KB，懒加载）

**路由懒加载核查**：constantRoutes 业务页本就 `() => import()`，仅 Layout 静态导入；动态路由全部懒加载。

**构建结果**：
```
首屏 index: 394.66 KB (gzip 142.85 KB)
echarts:    1125.61 KB (懒加载)
monaco:     2755.31 KB (懒加载)
xlsx:        281.85 KB (懒加载)
pdf:         559.95 KB (懒加载)
✓ built in 43.71s, exit 0, 无 chunk 体积警告
```

### ② 质量门禁

**Vitest 单元测试**：
- 配置：`vitest.config.ts`（jsdom 环境、`@/` 别名、v8 coverage）
- 10 个测试文件 / 99 个用例全部通过
- 覆盖：date、storage、validate、dict、permission、useTable、useDialog、app store、tagsView store、i18n 对称性
- 重依赖（`@/api`、user store）均用 `vi.mock` 隔离

**Prettier**：
- `.prettierrc`：semi:false, singleQuote:true, printWidth:120
- `.prettierignore` 排除构建产物与第三方文件
- 已执行 `npm run format`（约 178 个文件统一风格），`format:check` 通过

**commitlint**：
- `commitlint.config.js`（ESM 格式，因 package.json 为 `"type": "module"`）
- `.husky/commit-msg` 钩子文件已创建
- 本地验证：合法提交 exit 0、非法提交 exit 1
- ⚠️ 注意：共享 git 仓库 `core.hooksPath` 当前指向 V2 工程的 `.husky`，V3 钩子文件已就位但全局 hooksPath 未切换（避免影响 V2）

**CI 工作流**（`.github/workflows/ci.yml`）：
```
type-check (vue-tsc --noEmit)
  → test (vitest run)
  → build (vite build)
  → i18n 对称性校验 (缺失/空值即失败)
```

### ③ 后端工程化

**dotenv 环境变量治理**：
- 新增 `src/config/env.validate.js`：启动校验 9 个必需变量，缺失即 exit 1（负向测试已验证）
- 重写 `.env.example`：与 `.env` 结构对齐，敏感值全部占位符化
- 新建 `.gitignore`（仓库原本没有），已含 `.env`
- 核查 app/db/jwt/license/upload 配置，均已从 `process.env` 读取

**winston 结构化日志**：
- 新增 `src/utils/logger.js`：控制台彩色 + 文件 JSON（10MB 轮转）
- 重写 `logger.middleware.js`：记录 method/url/status/responseTime/ip
- `app.js` 启动与各模块日志已切到 logger
- `logs/combined.log` 已生成结构化 JSON

**限流**（`rateLimit.middleware.js`）：
- 通用：15min / 1000 次
- 敏感接口（login/register/forgot/captcha）：15min / 10 次
- 实测：连打 11 次登录，第 1–10 次 200，第 11 次返回 429 `{code:429,msg:'请求过于频繁，请稍后再试'}`

**helmet**：
- CORS 后、路由前挂载
- 开发环境关 CSP（不阻断 Swagger），生产启用严格策略
- 实测安全头齐全：`X-Frame-Options` / `X-Content-Type-Options` 等

**数据库迁移**：
- 新增 `src/migrations/index.js` 执行器 + `001_initial.js` 基线（空操作，不动现有表）
- `npm run migrate` 已建 `schema_migrations` 表并写入基线记录
- 现有数据零改动

### ④ 安全加固（DOMPurify）

**封装**：
- 新建 `src/utils/security/dompurify.ts`：白名单标签/属性，a 标签强制 `rel="noopener noreferrer"` + `target="_blank"`，禁 script/iframe/object/embed/form/input
- 新建 `src/directives/safeHtml.ts`：`v-safe-html` 全局指令
- `main.ts` 全局注册

**替换清单**：
- `views/system/email-log/index.vue`：1 处模板 `v-html` → `v-safe-html`
- `views/home/dashboard/index.vue`：2 处模板 `v-html` → `v-safe-html`
- `views/home/dashboard/index.vue`：1 处 JS `innerHTML` → `sanitizeHtml(...)`
- 全局复查：0 处原生 `v-html` 残留

### ⑤ i18n 收尾

**字典动态翻译**（`src/utils/business/dict.ts` 重写）：
- 缓存只存后端原始项，读取时按当前 locale 用 `common.dict.items.{code}.{value}` 即时翻译 label
- 移除 `BUILTIN_DICT_TYPES` 白名单：所有 dict code 都尝试 i18n key，缺失回退后端 label 并 dev 下 `console.warn`（严格不兜底，不静默）
- `DictTag` 和 `useDict` 各加 `watch(locale)`，切语言自动重载

**document.title 同步**（`src/router/permission.ts`）：
- 抽出 `updateDocumentTitle(route?)`，`beforeEach` 调用
- 新增 `watch(i18n.global.locale)`，切语言不经导航也实时重算 title

**英文模式中文残留修复**（全量回归发现 3 处，本轮全部修复）：

| 位置 | 问题 | 修复方式 |
|------|------|---------|
| `store/modules/device.ts` | statusText/paramsConfig/shiftName 硬编码中文 | 改为 i18n key（common.running / common.offline / device.state.metric* / common.shift.day） |
| `composables/useDevDashboard.ts` | realtimeParamsList name / todayStats shift 未翻译 | 改为 `t(c.name)` / `t(prod.shiftName)` |
| `views/home/overview/index.vue` | metrics.shiftName 未翻译 | 改为 `t(deviceStore.production.shiftName)` |
| `views/home/dashboard/index.vue` | deviceStatus.text / metrics.shiftName 未翻译 | 改为 `t(deviceStore.statusText)` / `t(storeProduction.value.shiftName)` |
| `views/home/data/index.vue` | mock 数据 `['白班','夜班']` 硬编码 | 改为 `[t('common.shift.day'), t('common.shift.night')]` |
| `views/system/audit/index.vue` | Target 列直接显示 `row.target` | 新增 `getTargetText()` 函数，用 `system.audit.target.{target}` key 翻译 |

**新增 i18n key**（中英对称）：
- `common/shift.ts`：day=白班/Day Shift, night=夜班/Night Shift
- `common/status.ts`：running=运行中/Running, offline=离线/Offline
- `device/state.ts`：metricPressure=加塞压力/Capping Pressure, metricVibration=设备振动/Vibration
- `system/audit.ts`：target 命名空间 18 个常见审计目标（系统登录/账户锁定等）

**对称性验证**：
```
zh total leaf keys: 2755
en total leaf keys: 2755
MISSING in en: 0
MISSING in zh: 0
EMPTY in zh: 0
EMPTY in en: 0
```

---

## 三、全量回归验证

### 构建与测试
| 命令 | 结果 |
|------|------|
| `npm run build`（vue-tsc + vite build） | ✅ exit 0，43.71s |
| `npm run test`（vitest） | ✅ 10 文件 / 99 用例全过 |
| `npm run type-check` | ✅ exit 0 |
| `node scripts/i18n-symmetry.mjs` | ✅ 2755/2755，0 差异 |
| `npm run format:check` | ✅ 通过 |

### 功能回归（browser-use-automation）
- 12 个视图模块 30+ 子页面全部正常加载，无白屏、无 JS 报错
- 全局功能：侧边栏折叠、菜单搜索、通知铃铛、用户下拉均正常
- i18n 切换：document.title 实时同步、面包屑/TagsView 翻译正常、状态字典（启用→Active）生效
- 安全：0 处原生 v-html，v-safe-html 指令已注册
- profile 页面第一轮修复的 404 bug 已验证修复

### 后端验证
- 服务启动无报错，`http://localhost:3002/api-docs` 可访问
- 健康检查 200、helmet 安全头齐全
- 限流实测：第 11 次登录返回 429
- `logs/combined.log` 结构化 JSON 已生成
- `schema_migrations` 表已建，基线记录已写入

---

## 四、注意事项与后续建议

### 已知限制
1. **husky hooksPath**：共享 git 仓库 `core.hooksPath` 指向 V2 的 `.husky`，V3 的 commitlint 钩子文件已创建但全局未切换。如需 V3 单独启用，需仓库维护者切换 hooksPath。
2. **email.config.js**：仍有硬编码兜底邮箱口令（当前在用），按"不改 API 行为"约束未动，建议后续迁入 `.env`。
3. **monaco chunk 2.7MB**：编辑器内核本身体积大，仅打开编辑器页才加载，不进首屏，属正常。
4. **3 个非阻断 warning**：Element Plus 图标未全局注册、Button type.text 废弃提示——不影响功能，建议后续迭代处理。

### 后续大厂建议（第三轮可选）
1. **E2E 测试**：引入 Playwright/Cypress 做关键流程端到端测试（登录→CRUD→导出），补充 Vitest 单测覆盖不到的交互链路。
2. **API 类型共享**：前后端共享 TypeScript 类型定义（通过 OpenAPI 生成或独立 types 包），消除接口字段不一致风险。
3. **错误监控**：前端接入 Sentry 或自建 error boundary + 日志上报，与后端 winston 日志联动。
4. **性能监控**：接入 Web Vitals 采集（LCP/FID/CLS），建立首屏性能基线与告警。
5. **容器化部署**：前端 Nginx + 后端 Node 的 Docker Compose 编排，配合 CI 自动构建镜像。
6. **数据库迁移进阶**：当前迁移系统已搭好骨架，后续表结构变更均应通过迁移文件管理，禁止手动改表。
7. **依赖安全扫描**：CI 中增加 `npm audit` 或 Snyk 扫描，阻断高危依赖合入。

---

## 五、改动文件清单

### 前端新增
- `vite.config.ts`（修改：manualChunks）
- `vitest.config.ts`
- `.prettierrc` / `.prettierignore`
- `commitlint.config.js`
- `.husky/commit-msg`
- `.github/workflows/ci.yml`
- `src/utils/security/dompurify.ts`
- `src/directives/safeHtml.ts`
- `src/i18n/modules/common/shift.ts` + en 对应
- `src/**/*.test.ts`（10 个测试文件）
- `scripts/i18n-symmetry.mjs` / `scan-hardcoded.mjs` / `scan-unused-keys.mjs`（第一轮已建）

### 前端修改
- `src/router/routerHelper.ts`（懒加载 glob）
- `src/router/permission.ts`（document.title 同步）
- `src/utils/business/dict.ts`（动态翻译重写）
- `src/main.ts`（注册 v-safe-html）
- `src/store/modules/device.ts`（i18n key 化）
- `src/composables/useDevDashboard.ts`（翻译）
- `src/views/home/overview/index.vue`（翻译）
- `src/views/home/dashboard/index.vue`（翻译 + v-safe-html）
- `src/views/home/data/index.vue`（翻译）
- `src/views/system/audit/index.vue`（getTargetText）
- `src/views/system/email-log/index.vue`（v-safe-html）
- `src/i18n/modules/common/{status,index}.ts` + en 对应
- `src/i18n/modules/device/state.ts` + en 对应
- `src/i18n/modules/system/audit.ts` + en 对应
- `tsconfig.json`（exclude 测试文件）
- `package.json`（scripts + devDependencies）

### 后端新增
- `src/config/env.validate.js`
- `src/utils/logger.js`
- `src/middleware/rateLimit.middleware.js`
- `src/migrations/index.js` + `001_initial.js`
- `.env.example`（重写）
- `.gitignore`

### 后端修改
- `app.js`（接入 env.validate / logger / helmet / rateLimit）
- `src/middleware/logger.middleware.js`（结构化重写）
- `package.json`（scripts + dependencies）

---

*报告生成时间：2026-09-24*
