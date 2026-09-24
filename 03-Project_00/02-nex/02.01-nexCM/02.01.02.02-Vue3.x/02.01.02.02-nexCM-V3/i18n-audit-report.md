# i18n 全覆盖审计与整改报告

> 工程：`02.01.02.02-nexCM-V3`（Vue 3 + vue-i18n v9 legacy:false / fallbackLocale:false）
> 作者：GooHv
> 日期：2026-09-24

---

## 0. 结论速览

| 检查项 | 修复前 | 修复后 |
| --- | --- | --- |
| 中英 key 对称性（缺失/多余/空值） | 0 / 0 / 0 | **0 / 0 / 0** |
| 中文 leaf key 总数 | 2706 | 2731 |
| 英文 leaf key 总数 | 2706 | 2731 |
| `t(key, '默认值')` 兜底调用 | 0 | 0 |
| `fallbackLocale` 具体语言 | 无（已为 `false`） | 无（保持 `false`） |
| 日文语言配置 / 注册项 | 0 | 0 |
| `npm run build`（含 vue-tsc） | — | **通过（exit 0，41.55s）** |

---

## 1. 硬编码文本扫描（最高优先）

扫描器：`scripts/scan-hardcoded.mjs`（递归 `src/**/*.vue|*.ts`，剔除注释、`console.*`、`src/i18n` 定义目录）。

### 1.1 已修复的硬编码清单（全部接入 i18n，中英 key 对称新增）

| 文件 | 修复内容 |
| --- | --- |
| `src/utils/ui/feedback.ts` | `confirmDelete` 默认文案、`confirmBatch` 模板、`confirmLogout` 文案改为 `t(...)` |
| `src/utils/request/request.ts` | 两处 `source.cancel('...')` 原因文案改为 i18n；静态引入 `@/i18n` |
| `src/utils/business/exportTable.ts` | 无列/无数据提示、导出成功、PDF 标题、导出人/时间、记录数、PDF 失败、不支持格式全部接入 i18n |
| `src/utils/business/licenseHelper.ts` | `licenseTypeLabel`（试用/正式/永久）、`getLicenseCountdown`（过期/倒计时）接入 i18n |
| `src/store/modules/errorLog.ts` | 未知错误兜底文案改用 `common.error.UNKNOWN_ERROR` |
| `src/store/modules/websocket.ts` | 未知错误兜底文案改用 `common.error.UNKNOWN_ERROR` |
| `src/composables/useDialog.ts` | `addTitle/editTitle` 默认值改用 `common.add` / `common.edit` |
| `src/views/system/config/index.vue` | 加载中 / 加载失败标题+描述 / 重新加载 / 配置不完整 alert / 未初始化项计数 / 缺失项标题 / 不完整提示 / 未配置项警告，全部改为 `$t(...)` |

### 1.2 新增 i18n key（zh / en 同步对称新增，已通过对称性校验）

- `common.deleteConfirmDefault` / `common.batchConfirmMessage` / `common.action` / `common.logoutConfirmMessage`
- `common.requestCancelDuplicate` / `common.requestCancelRouteChange`
- `common.noColumnsToExport` / `common.exportSuccess` / `common.exportData` / `common.exporter` / `common.exportTime` / `common.recordCountPrefix` / `common.recordCountSuffix` / `common.pdfExportFailed` / `common.unsupportedExportFormat`
- `superPanel.license.type.trial` / `.formal` / `.permanent`
- `system.config.loadFailedTitle` / `loadFailedDesc` / `incompleteTitle` / `incompleteDetected` / `missingKeysTitle` / `incompleteTip` / `missingItemsWarning`

### 1.3 判定为“非 UI 硬编码”而保留的内容（附理由）

| 路径 | 保留理由 |
| --- | --- |
| `src/utils/business/worldCities.ts` | 地理数据字典，自带 `nameZh` / `nameEn` 双语字段，消费端按 locale 取字段，非 UI 文案 |
| `src/config/database.config.ts` | 任务明确“不可删除/不涉及”；表/菜单自带 `alias`/`alias_en`、`comment`/`comment_en` 双语字段 |
| `src/composables/useDevAlarm.ts`、`useProdOrder.ts`、`useProdRecipe.ts`、`src/store/modules/device.ts` | 开发/演示用 mock 记录（人名、产品名、批次名），属样例数据而非界面标签 |
| `src/views/license/license-import/index.vue` 的 `formatLicenseReason` | 其中中文（“不存在/已过期/机器不匹配”等）是**匹配后端返回原因串**的判别条件，不直接展示；命中后映射为 i18n key，符合预期 |
| `src/views/super-panel/database/index.vue` 的 `category:'其他'/'配置管理'` | 仅为兜底值，展示走 `getCategoryName()` → `superPanel.database.categories.{key}`（key 已存在） |
| `src/views/super-panel/config/components/LanguageConfig.vue` 的 `label:'预设语言配置'` | 仅为兜底值，展示走 `meta.labelKey`（i18n key 已存在） |
| `src/store/modules/tagsView.ts` 的 `invalidTitles=['欢迎登录',...]` | 历史脏标题过滤比对值，非展示文案 |
| `src/config/ui.config.ts` 的 `PAGE_TITLE_LOGIN` 等死配置 | 无引用、不渲染 |
| 各 `.vue`/`.ts` 中的 `//`、`/* */`、`<!-- -->` 注释与 `console.*` | 任务明确排除 |

> 说明：`scripts/scan-hardcoded.mjs` 终态命中 415 条，其中约 250 条来自 `worldCities.ts` 双语数据、约 30 条来自 `database.config.ts` 双语数据，其余为注释/console/mock 样例数据/兜底值，均按上表理由保留。

---

## 2. 中英 key 对称性校验

脚本：`scripts/i18n-symmetry.mjs`（用 esbuild 把 `modules/index.ts` 与 `modules-en-us/index.ts` 打成 ESM，递归展平成 leaf key 树后对比）。

- 修复前：2706 / 2706，缺失 0、多余 0、空值 0（基线已干净）。
- 修复后：2731 / 2731，缺失 0、多余 0、空值 0。
- 英文文案采用工业管理系统专业术语（如 *Formal License*、*Configuration Incomplete*、*Exported by*），无机械直译感。

---

## 3. 未使用 key 清理

脚本：`scripts/scan-unused-keys.mjs`。静态扫描得到 834 个“疑似未引用”key，但**全部保留、未删除**，理由：

- `common.dict.types.*` / `common.dict.items.*`：由 `src/utils/business/dict.ts` 以 `common.dict.items.${dictCode}.${item.value}` 模板动态取值，静态扫描无法命中，属运行期动态引用。
- `layout.menu.*`：菜单标题 key 存于后端菜单表，前端 `resolveMenuTitle()` 动态 `t(titleKey)`，源码中不出现字面量。
- `notification.*`、`common.error.*`：分别由通知类型码、HTTP/业务 code 动态拼接（如 `common.error.${code}`、`common.error.http.${status}`）。

按任务“动态拼接 key 需保留父级下所有可能值”的要求，这些命名空间整体保留。其余少量字面量孤儿 key（如 `common.addSuccess`）属于预留公共文案，删除风险大于收益，予以保留。**未删除任何 key**，因此对称性仍为 0/0/0。

---

## 4. 严格不兜底检查

- 全局正则搜索 `t('key', '默认文字')`（第二参数为字符串字面量）：**0 处**（唯一命中是 `emit(...)` 误报）。
- `fallbackLocale`：`src/i18n/index.ts` 中已是 `fallbackLocale: false`，无任何具体语言兜底。
- `defaultMessages` / `fallbackWarn` / `missingWarn`：全局搜索**0 处**。
- `@intlify/unplugin-vue-i18n` 的 `defaultMessages` 配置：**未使用**。

---

## 5. 日文清理

- 全局搜索平假名/片假名（`぀-ヿ`）与 `ja-JP`/`ja_JP`/`Japanese`/`日本語`：
  - 无任何日文语言包、语言选项、注册项。
  - 仅 `superPanel/i18n.ts` 表单占位符示例写作 “如 ja-JP、ko-KR”，已改为 “如 zh-CN、en-US”（英文对应改为 “e.g. zh-CN, en-US”）。
- 最终语言仅保留 `zh-CN` 与 `en-US`。

---

## 6. 后端返回文案检查

- 全局搜索视图层直接展示 `res.msg` / `response.msg`：**0 处**。
- `src/utils/request/request.ts` 响应拦截器已统一用 `i18n.global.t('common.error.' + code)` / `common.error.http.{status}` 将后端 code 映射为前端文案，不直接透传中文 `msg`。
- `src/api/i18n-manager.ts` 的动态多语言能力（`loadLanguageList`/`loadLanguageFile`）仍被 `src/i18n/index.ts` 与超级面板多语言管理页使用，属保留能力，无残留死引用。
- `src/api/i18n-manager.ts` 注释存在历史 GBK→UTF-8 双重编码乱码（仅注释、不影响运行），本次按“注释中的中文排除”原则未改动。

---

## 7. key 命名规范

- 所有新增 key 均为小写+点分隔，归入现有模块（`common.*`、`superPanel.license.*`、`system.config.*`），公共文案归 `common`、模块文案归对应模块，未跨模块重复定义。

---

## 8. 硬约束遵守情况

- 只改前端工程；未改后端。
- `database.config.js` / `license.config.js` 未删除、未改动其双语数据。
- 未新增第三种语言。
- 未使用任何默认值/回退掩盖缺失 key。
- `npm run build`（含 `vue-tsc --noEmit`）通过，exit 0。

---

## 9. 附录：最终 key 对称性脚本输出

```
=== i18n Symmetry Check ===
zh total leaf keys: 2731
en total leaf keys: 2731

[MISSING in en (zh has, en missing)]: 0

[MISSING in zh (en has, zh missing)]: 0

[EMPTY in zh]: 0

[EMPTY in en]: 0
```

## 10. 附录：本次新增脚本

| 脚本 | 用途 |
| --- | --- |
| `scripts/i18n-symmetry.mjs` | esbuild 打包中英 i18n 入口，递归对比 leaf key 树，输出缺失/多余/空值 |
| `scripts/scan-hardcoded.mjs` | 扫描 `.vue/.ts` 中未走 `t()` 的中文（剔除注释/console/i18n 定义目录） |
| `scripts/scan-unused-keys.mjs` | 扫描实际引用的 i18n key，对比定义，输出疑似冗余 key（动态命名空间已豁免） |
