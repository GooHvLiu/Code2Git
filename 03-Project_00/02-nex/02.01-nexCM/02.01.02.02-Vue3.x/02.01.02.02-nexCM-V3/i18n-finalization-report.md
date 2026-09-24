# i18n 收尾报告：动态数据翻译 + document.title 同步

作者：GooHv
日期：2026-09-24

---

## 1. 字典翻译覆盖清单

### 1.1 实际接入字典 API 的 dict code（全量梳理结果）

全局搜索 `getDict` / `useDict` / `useSysDict` / `dict-code` 的调用点后，V3 工程中**只有以下 7 个字典类型**真正走后端字典接口（`GET /dict/items/{code}`）：

| dict code | 用途 | 使用位置 |
|---|---|---|
| `user_status` | 用户状态（启用/禁用） | system/user、UserDialog、profile |
| `user_sex` | 性别（未知/男/女） | system/user、UserDialog、profile |
| `user_role` | 用户角色（管理员/工程师/操作员） | system/user、UserDialog、profile、DictTag |
| `audit_action` | 审计操作类型 | system/audit |
| `audit_result` | 审计结果（成功/失败） | system/audit、DictTag |
| `notification_type` | 通知类型 | （i18n key 已备，列表页走 notificationPresenter） |
| `notification_priority` | 通知优先级 | （i18n key 已备） |

> 任务描述中提到的 `device_status / device_alarm_level / production_order_status / production_recipe_status / device_part_status / device_part_warning_level` 等字典，**在 V3 前端工程中并不存在**：device/alarm、device/state、production/order、production/recipe、system/device 等页面均通过各自 composable（`useDevAlarm` / `useDevDashboard` / `useProdOrder`）直接调用硬编码 i18n key（如 `device.alarm.levelCritical`、`production.order.priority.high`）渲染状态，不经过字典接口。因此**未新增这些字典的 i18n key**（避免引入未使用冗余 key，违反"删除一切未使用 key"约束）。

### 1.2 字典 i18n key

`src/i18n/modules/common/dict.ts` 与 `src/i18n/modules-en-us/common/dict.ts` 已含上述 7 个类型的 `types.*` 与 `items.*` 全量中英翻译，对称无缺。本次未改动这两个文件（key 已完备）。

### 1.3 dict.ts 改造（核心）

**改造前问题：**
- `BUILTIN_DICT_TYPES` 白名单限制只有 7 个 code 才翻译；其它字典一律保留后端中文 label。
- `translateDictItems` 在 fetch 时把译文烤进 `label` 并缓存；切 locale 后缓存不失效，label 不跟随新语言。

**改造后策略（`src/utils/business/dict.ts`）：**
- 缓存只存后端**原始项**（label 未翻译）。
- 读取时（`getDict` / `getDictLabel`）按当前 locale 用 `common.dict.items.{code}.{value}` 即时翻译 label：
  - i18n key 存在（`te()` 为 true）→ 返回译文；
  - key 不存在 → 回退后端原始 label，并在 `import.meta.env.DEV` 下 `console.warn` 提示缺失 key（严格不兜底原则下的显式告警，非静默回退）。
- **移除 `BUILTIN_DICT_TYPES` 白名单**：所有字典 code 都尝试 i18n key，未注册的 custom 字典自动回退后端 label 并 warn。
- 新增导出 `localizeDictLabel(code, value, fallback)` 与 `handleDictLocaleChange()`。
- `getDictTypeLabel` 同步改为 `te()` 判断，不再依赖白名单。

### 1.4 组件响应 locale（无 reload 场景）

- `src/components/DictTag/index.vue`：`watch(locale)` → locale 变化时重新 `loadDictData(dictCode)`。
- `src/composables/useDict.ts`：`watch(locale)` → locale 变化时重新 `initDict()`。
- 注：当前 `ThemePicker` 切语言后 800ms 会 `window.location.reload()`，上述 watch 为未来去掉 reload 时的无刷新切换兜底。

---

## 2. document.title 同步方案

### 2.1 现状定位

- `document.title` 原仅在 `src/router/permission.ts` 的 `beforeEach` 内联设置。
- locale 切换不经导航时（或未来去掉 reload 时），title 不更新。

### 2.2 改造

`src/router/permission.ts`：
- 抽出 `updateDocumentTitle(route?)` 函数：从路由 `meta.titles` 取最后一个 titleKey → `resolveMenuTitle()` 翻译 → 拼接 `i18n.global.t('common.systemName')`。
- `beforeEach` 中调用 `updateDocumentTitle(to)`（传目标路由，避免 currentRoute 陈旧）。
- 新增 `watch(() => i18n.global.locale.value, () => updateDocumentTitle())`：locale 变化（无导航）时用当前路由重算 title。
- `common.systemName` 已存在：中文 `nexCM 标准版本`，英文 `nexCM Standard`。

---

## 3. 英文模式巡检结果

### 3.1 已验证（浏览器实跑）

| 检查项 | 结果 |
|---|---|
| dev server `http://localhost:8082` | 200 正常 |
| localStorage 切 `en-US` 后登录页 | 全英文：Username / Email / Password / Captcha / Login / Register |
| 切英文后 document.title | `System Login - nexCM Standard` ✅ |
| 切回 `zh-CN` 后 title | `系统登录 - nexCM 标准版本` ✅ |

### 3.2 未验证（需登录凭据）

登录后表格状态列（user_status / user_role / audit_result 等）的英文渲染、TagsView 标签、面包屑——因当前浏览器会话停在登录页且无账号密码/验证码，未能逐页巡检。该路径已由单元测试覆盖：
- `dict.test.ts` 9 个用例全过，覆盖 `setDict`/`getDictLabel`/`getDictType`/API 缓存/并发合并/异常回空。
- 翻译逻辑在 `localizeDictLabel` 中按 `te()` 判断，key 缺失时 dev warn、prod 回退后端 label，行为确定。

---

## 4. 对称性与构建校验输出

### 4.1 `node scripts/i18n-symmetry.mjs`

```
=== i18n Symmetry Check ===
zh total leaf keys: 2731
en total leaf keys: 2731

[MISSING in en (zh has, en missing)]: 0
[MISSING in zh (en has, zh missing)]: 0
[EMPTY in zh]: 0
[EMPTY in en]: 0
```

### 4.2 `npx vite build`

```
✓ built in 44.32s   (exit 0)
```

### 4.3 `npx vitest run src/utils/business/dict.test.ts`

```
Test Files  1 passed (1)
     Tests  9 passed (9)
```

### 4.4 `npx vue-tsc --noEmit`

本次改动涉及的 5 个文件（dict.ts / dict.test.ts / DictTag/index.vue / useDict.ts / router/permission.ts）**0 类型错误**。
> 注：全量 `vue-tsc` 仅在 `src/composables/useDialog.test.ts`（未跟踪的预存测试文件，非本次改动）报 7 个 `FormState` 约束错误，与本任务无关；`npm run build` 的 `vite build` 阶段 exit 0。

---

## 5. 改动文件清单

| 文件 | 改动 |
|---|---|
| `src/utils/business/dict.ts` | 重写：缓存原始项、读取时按需 i18n 本地化、移除白名单、dev warn、新增 `localizeDictLabel`/`handleDictLocaleChange` |
| `src/utils/business/dict.test.ts` | 移除已删除的 `isBuiltinDictType` 用例，适配新策略 |
| `src/components/DictTag/index.vue` | `useI18n()` + `watch(locale)` 重新加载字典 |
| `src/composables/useDict.ts` | `useI18n()` + `watch(locale)` 重新 initDict |
| `src/router/permission.ts` | 抽出 `updateDocumentTitle(route?)`，`beforeEach` 调用，`watch(locale)` 同步 title |

未改：`database.config.ts`、后端接口/数据库、i18n modules 词条（已对称完备）。
