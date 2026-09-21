# MAINTAINER MIGRATION RULES — Vue2.7 → Vue3 / TS 统一规范

> 后续组件 / 页面迁移者必读。同一类问题全项目统一解法，禁止一个页面一种风格。
> 作者：GooHv ｜ 风格：简约、大厂规范、标准化。

---

## 1. 模板语法机械规则

| Vue2 写法 | Vue3 写法 |
|---|---|
| `.sync`（如 `:visible.sync="dialog"`） | `v-model:visible="dialog"` |
| `slot-scope="scope"` / `slot-scope="{ row }"` | `#default="scope"` / `#default="{ row }"` |
| `slot="xxx"` 具名插槽 | `#xxx`（在 template 上） |
| `.native` 修饰符 | 删除（Vue3 组件根节点原生事件直接透传） |
| `this.$set(obj, key, val)` | 直接 `obj[key] = val`（Vue3 响应式，无需 $set） |
| `this.$delete(obj, key)` | `delete obj[key]` |
| `this.$listeners` / `$scopedSlots` / `$children` | `v-on="$attrs"` / 具名插槽对象 / 避免直接访问子组件 |
| `size="mini"` | `size="small"`（Element Plus 无 mini） |
| 过滤器 `{{ x | fmt }}` | 方法调用 `{{ fmt(x) }}`（纯函数导出，见 `@/filters/date.filter`） |

## 2. script 写法

- 一律 `<script setup lang="ts">`，**禁止 Options API**。
- 组件 props：`defineProps<Props>()` 泛型 + `withDefaults`；emits：`defineEmits<Emits>()`；暴露：`defineExpose(...)`。
- 模板内**禁止出现 `this`**。
- ref/reactive/computed/onMounted 等由 unplugin-auto-import 自动注入，无需手动 import（如需可显式 import 以利于类型）。
- 路由/状态取值：`useRoute()` / `useRouter()` / `useXxxStore()`，模板里用 store。

## 3. 命令式 API 统一收敛

- 消息：统一从 `@/utils/ui/feedback` import
  - `showSuccess / showError / showWarning / showInfo`
  - `confirmAction / confirmDelete / confirmBatch / confirmDanger / confirmLogout`
  - 或 `$msg.*` / `$confirm.*`
- **禁止**页面里直接 `import { ElMessage } from 'element-plus'` 散落调用。
- 权限：`hasRole / hasPermission / checkPermission / isSuperAdmin` 从 `@/utils/auth/permission`。
- 事件总线：`import bus from '@/utils/bus'`，`bus.on / bus.emit / bus.off`。

## 4. 图标组件化映射（element-ui → @element-plus/icons-vue）

字体图标 `el-icon-xxx` / `<i class="el-icon-xxx">` 统一替换为图标组件：

| 旧 class | 新组件 |
|---|---|
| el-icon-edit | `<el-icon><Edit /></el-icon>` |
| el-icon-delete | `<el-icon><Delete /></el-icon>` |
| el-icon-plus | `<el-icon><Plus /></el-icon>` |
| el-icon-search | `<el-icon><Search /></el-icon>` |
| el-icon-refresh | `<el-icon><Refresh /></el-icon>` |
| el-icon-upload | `<el-icon><Upload /></el-icon>` |
| el-icon-download | `<el-icon><Download /></el-icon>` |
| el-icon-close | `<el-icon><Close /></el-icon>` |
| el-icon-check | `<el-icon><Check /></el-icon>` |
| el-icon-arrow-down | `<el-icon><ArrowDown /></el-icon>` |
| el-icon-arrow-right | `<el-icon><ArrowRight /></el-icon>` |
| el-icon-user | `<el-icon><User /></el-icon>` |
| el-icon-lock | `<el-icon><Lock /></el-icon>` |
| el-icon-setting | `<el-icon><Setting /></el-icon>` |
| el-icon-menu | `<el-icon><Menu /></el-icon>` |
| el-icon-fold | `<el-icon><Fold /></el-icon>` |
| el-icon-expand | `<el-icon><Expand /></el-icon>` |

> 业务 svg（`icon="xxx"` 属性 / `<svg-icon icon-class="xxx" />`）保留 svg 雪碧图用法。
> Element Plus 图标已通过 unplugin-vue-components 自动注册，无需手动 import（模板中直接用 `<el-icon><Edit /></el-icon>`）。

## 5. 状态 / 路由

- Pinia store 用 setup 风格：`defineStore('x', () => { ... return state/action })`。
- 路由动态加载：后端菜单经 `buildDynamicRoutes` 构建，`addRoute('Layout', route)`；404 用 `/:pathMatch(.*)*`。
- 退出登录重置路由：调用 `resetRouter()`（遍历 removeRoute）。

## 6. 国际化（强约束）

- 文案一律 `$t('key')` / `t('key')`，**禁止硬编码中文/英文**。
- **不设 fallbackLocale、不做 `|| 中文` 兜底**；缺 key 直接显示 key。
- 新增 key 必须**同时**补 `src/i18n/modules/<域>/` 与 `src/i18n/modules-en-us/<域>/`，结构对齐。
- 开发期 `validateI18nConsistency` 会对缺 key 告警，迁移时必须清零告警。

## 7. 抽取 composable 的判断标准

满足任一即抽到 `src/composables/useXxx.ts`：
- 跨 ≥2 个页面重复出现；
- 与视图无关的通用逻辑（分页、字典、弹窗、CRUD、尺寸、会话、通知、授权、语言、表格）。

封装要求：
- JSDoc 注明用途、参数（interface/type）、返回类型、使用示例；
- 入参显式类型，返回显式类型；
- 不要为抽而抽（单次使用的逻辑就近内联）。

## 8. 类型规范

- 入参用 `interface`/`type`，避免 `any`；确需放宽用 `unknown` 收窄并注释原因。
- 公共类型集中在 `src/types/*.ts`，不重复定义。
- axios 返回统一 `Promise<ApiResponse<T>>`，api 层标注参数与响应类型。
- 组件 props/emits 用泛型 `defineProps<Props>()`。

## 9. 迁移后自检清单

- [ ] 模板无 `.sync`/`slot-scope`/`.native`/`$set`/`this.`
- [ ] `<script setup lang="ts">`，无 Options API
- [ ] 无硬编码文案，中英 key 都存在
- [ ] `npx eslint` 0 error
- [ ] `npm run type-check` 0 error
- [ ] 复用逻辑已抽 composable
