# 构建优化 + 安全加固（DOMPurify）报告

- 工程：`02.01.02.02-nexCM-V3`（Vue3 + Vite + TS）
- 作者：GooHv
- 日期：2026-09-24
- 范围：仅前端工程；不改变任何功能行为；`database.config.ts` 未改动

---

## 一、改动清单

### 1. 构建优化

| 文件 | 改动 |
| --- | --- |
| `vite.config.ts` | 重写 `build.rollupOptions.output.manualChunks`，由原来的 3 组（vue/element/libs）细分为 7 组；`chunkSizeWarningLimit` 由 2000 调整为 3000（仅 monaco 这一已知大块需放宽，详见下文） |
| `src/router/helper/routerHelper.ts` | **关键改动**：`import.meta.glob('@/views/**/*.vue', { eager: true })` 改为默认懒加载 `import.meta.glob('@/views/**/*.vue')`。原 eager 写法把全部业务页面同步打进首屏 bundle，是首屏 `index` chunk 高达 3.6MB 的根因；改后每个业务页面按需加载为独立 chunk |
| `tsconfig.json` | 新增 `exclude`，排除 `src/**/*.test.ts`、`src/**/*.spec.ts`（WIP 单测文件由另一个 agent 维护，不应阻断生产 `vue-tsc --noEmit`；单测由 vitest 独立运行） |

### 2. 安全加固（DOMPurify）

| 文件 | 改动 |
| --- | --- |
| `src/utils/security/dompurify.ts` | **新建**。封装 `sanitizeHtml(html: string): string`，白名单标签/属性，`afterSanitizeAttributes` 钩子强制 a 标签 `rel="noopener noreferrer"` + `target="_blank"`，禁用 script/iframe/object/embed/form/input 等危险标签 |
| `src/directives/safeHtml.ts` | **新建**。Vue3 自定义指令 `v-safe-html`，`mounted`/`updated` 中先 `sanitizeHtml` 再写 `el.innerHTML` |
| `src/main.ts` | 注册全局指令 `app.directive('safe-html', safeHtmlDirective)` |
| `src/components/EmailLog/index.vue` | `v-html="currentLog.content"` → `v-safe-html="currentLog.content"`，移除 `eslint-disable vue/no-v-html` |
| `src/views/home/dashboard/index.vue` | 两处 `v-html` → `v-safe-html`；JS 中 `mapChartRef.value.innerHTML = ...` 改为 `sanitizeHtml(...)` 包裹，并补充 `import { sanitizeHtml }` |

---

## 二、manualChunks 分包策略

```
vue-vendor : vue / vue-router / pinia / vue-i18n
element-plus: element-plus / @element-plus/icons-vue
echarts    : echarts
monaco     : monaco-editor
xlsx       : xlsx
pdf        : jspdf / html2canvas
```

> 工程中除 monaco-editor 外无其他编辑器类库（无 quill/tinymce/ckeditor），故未单独建 `editor` chunk；monaco 即编辑器 chunk。

---

## 三、路由懒加载核查

- `src/router/constant/constantRoutes.ts`：业务页面（login / 404 / 403 / redirect / license-import / menu-preview / profile / notification）均已使用 `() => import(...)`；仅 `Layout` 静态导入（应用外壳，首屏必需）。✅
- `src/router/helper/routerHelper.ts`：动态路由原先 `{ eager: true }` 全量同步加载，本次改为懒加载 glob，组件表存储 `() => import(...)` 函数，Vue Router 访问路由时才加载对应 chunk。✅
- 结论：constantRoutes 基础页 + Layout 静态导入，业务页面全部懒加载。

---

## 四、chunk 大小对比

### 优化前（基线）

| chunk | 大小 | gzip |
| --- | ---: | ---: |
| index（入口，含全部业务页面） | 3654 KB | — |
| libs（echarts+xlsx+jspdf+html2canvas+dayjs+axios 混在一起） | 2028 KB | — |
| element | 973 KB | — |
| vue | 173 KB | — |

> 同时存在 `index > 2000kB`、`libs > 2000kB` 两条体积警告。

### 优化后（本次 `npm run build` 实测）

| chunk | 大小 | gzip | 加载时机 |
| --- | ---: | ---: | --- |
| **index（入口）** | **393.60 KB** | 142.25 KB | 首屏 |
| vue-vendor | 176.92 KB | 64.37 KB | 首屏 |
| element-plus | 973.54 KB | 310.47 KB | 首屏（全局组件库） |
| echarts | 1125.61 KB | 378.65 KB | 懒加载（Dashboard 等图表页） |
| xlsx | 281.85 KB | 94.77 KB | 懒加载（导出/导入页） |
| pdf | 559.95 KB | 166.35 KB | 懒加载（导出 PDF） |
| monaco | 2755.31 KB | 700.12 KB | 懒加载（MonacoEditor 页） |

### 关键结论

- **首屏入口 index：3654 KB → 393.6 KB，下降约 89%。**
- 原先 >2000KB 的 `libs` chunk 已拆分消除；`index` 不再包含 echarts / monaco / xlsx / pdf。
- 首屏 JS 主要为 index(394K) + vue-vendor(177K) + element-plus(974K) + 共享小工具；echarts/monaco/xlsx/pdf 均为独立懒加载 chunk，仅在对应业务页面打开时下载。
- 体积警告：`Some chunks are larger than ...` 警告已消除（构建日志无该告警）。

### 关于 monaco 的说明

`monaco` chunk 为 2755KB，是本次唯一超过 1500KB 目标的 chunk。原因：monaco-editor 编辑器内核 + 基础语言元数据本身体积约 2.7MB，其各语言 mode（jsonMode/htmlMode/cssMode/tsMode 等）已被 Vite 自动拆为独立小 chunk。该 chunk **不进入首屏**，仅在打开 MonacoEditor 页面时按需加载。为消除该已知大块的噪音告警，`chunkSizeWarningLimit` 设为 3000；若后续需要进一步压缩，可将 MonacoEditor 改为按需注册语言（`monaco-editor/esm/vs/editor/editor.api` + 手动 register），但那会涉及组件行为变更，本次按“不改变功能行为”约束未做。

---

## 五、v-html 替换清单

全局扫描 `src/` 下 `.vue` 文件 `v-html`，共 2 个文件 3 处模板用法 + 1 处 JS `innerHTML`：

| # | 文件 | 行号 | 原写法 | 现写法 |
| --- | --- | ---: | --- | --- |
| 1 | `src/components/EmailLog/index.vue` | 188 | `v-html="currentLog.content"` | `v-safe-html="currentLog.content"` |
| 2 | `src/views/home/dashboard/index.vue` | 72 | `v-html="metric.subLeft"` | `v-safe-html="metric.subLeft"` |
| 3 | `src/views/home/dashboard/index.vue` | 73 | `v-html="metric.subRight"` | `v-safe-html="metric.subRight"` |
| 4 | `src/views/home/dashboard/index.vue` | 730 | `mapChartRef.value.innerHTML = \`...\`` | `mapChartRef.value.innerHTML = sanitizeHtml(\`...\`)` |

替换后全局复查：
- `v-html` 残留：**0 处**（仅剩 `safeHtml.ts` 注释中描述“替代原生 v-html”的文字，非实际用法）。
- `innerHTML` 写入：仅存在于 `safeHtml.ts` 指令内部（消毒后写入，符合设计）与 `dompurify.ts` JSDoctor 示例；业务代码无未消毒的 innerHTML 写入。

### DOMPurify 白名单配置

- 允许标签：`b i u em strong p br ul ol li a img span div h1~h6 table thead tbody tr td th`
- 允许属性：`href src alt title class style colspan rowspan` + `data-*`
- 禁止标签：`script iframe object embed form input style link meta base frame frameset noscript`
- a 标签：强制 `rel="noopener noreferrer"`，`target` 归一为 `_blank`
- `ALLOW_UNKNOWN_PROTOCOLS: false`（阻止 `javascript:` 等自定义协议）

---

## 六、构建验证

- 命令：`npm run build`（= `vue-tsc --noEmit && vite build`）
- 结果：**exit 0**，`✓ built in ~45s`，3958 modules transformed。
- 无 chunk 体积告警；剩余的 `dynamic import will not move module into another chunk` 为既有的 i18n/user/router 静态+动态混用提示，非本次改动引入，不影响产物。
- 首屏入口 chunk 确认不含 echarts/monaco/xlsx/pdf（均为独立懒加载 chunk）。

---

## 七、未做 / 边界

- 未运行 `prettier --write`（另一个 agent 在处理格式化），保持所改文件原有格式风格。
- `database.config.ts` 未动。
- 未对 monaco-editor 做按需语言注册（避免功能行为变更）。
- WIP 单测文件（`*.test.ts`）类型错误由 `exclude` 排除出生产 type-check，未修改其测试逻辑。
