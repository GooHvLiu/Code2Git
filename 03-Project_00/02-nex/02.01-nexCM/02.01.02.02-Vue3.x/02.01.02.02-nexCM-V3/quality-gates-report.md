# 前端质量门禁建设报告（Vitest + Prettier + commitlint + CI）

> 工程：nexCM-V3（Vue3 + Vite + TypeScript）
> 作者：GooHv
> 日期：2026-09-24

---

## 一、配置清单

### 1. Vitest
| 文件 | 说明 |
| --- | --- |
| `vitest.config.ts` | 继承 `@/ → src/` 别名；`environment: jsdom`；收集 `src/**/*.{test,spec}.{ts,tsx}`；coverage provider `v8` |
| `package.json` scripts | `test` / `test:watch` / `test:coverage` |

### 2. Prettier
| 文件 | 说明 |
| --- | --- |
| `.prettierrc` | semi=false, singleQuote=true, trailingComma=none, printWidth=120, tabWidth=2, arrowParens=avoid, endOfLine=lf |
| `.prettierignore` | node_modules / dist / coverage / *.md / public / auto-imports.d.ts / components.d.ts |
| `package.json` scripts | `format`（write）/ `format:check`（check） |

### 3. commitlint + husky
| 文件 | 说明 |
| --- | --- |
| `commitlint.config.js` | extends `@commitlint/config-conventional`（项目 `type: module`，故用 ESM `export default`） |
| `.husky/commit-msg` | `npx --no -- commitlint --edit "$1"` |
| `package.json` scripts | `commitlint` / `prepare: husky install` |

> 说明：当前 git 仓库为多工程共享（toplevel = `F:/CodingMan/Code2Git`），`core.hooksPath` 已指向 V2 工程的 `.husky`。本工程仅新增 `.husky/commit-msg` 文件，未改动全局 `core.hooksPath`（避免影响 V2）。若要在本工程单独启用钩子，需将 `core.hooksPath` 指向本工程 `.husky`（由仓库维护者决定）。commitlint 本身已本地验证可用。

### 4. CI（GitHub Actions）
| 文件 | 说明 |
| --- | --- |
| `.github/workflows/ci.yml` | workflow 名 `CI`；触发 push(main/master) + pull_request |

流水线步骤：`checkout` → `setup-node@v4 (node 18, cache npm)` → `npm ci` → `npm run type-check` → `npm run test` → `npm run build` → `i18n 对称性校验`。

i18n 校验先跑 `node scripts/i18n-symmetry.mjs`（生成 `.i18n-zh-flat.json` / `.i18n-en-flat.json`），再用内联 `node -e` 比对两边 key 集合与空值，存在缺失/多余/空值时 `process.exit(1)` 使 CI 失败。

---

## 二、单元测试结果

**总计：10 个测试文件，99 个用例，全部通过（0 失败）。**

| 测试文件 | 用例数 | 覆盖点 |
| --- | --- | --- |
| `src/utils/data/date.test.ts` | 17 | formatDate 各格式/边界值、parseDate、addDays/Months、diffDays、isSameDay、isDateBetween、startOf/endOfDay、now |
| `src/utils/data/storage.test.ts` | 9 | get/set/remove localStorage、sessionStorage、JSON 解析兜底、clearLoginStorage |
| `src/utils/data/validate.test.ts` | 14 | 用户名/密码/确认密码/邮箱校验正反例 |
| `src/utils/business/dict.test.ts` | 9 | 内置字典判断、本地静态字典、API 拉取与缓存、并发合并、异常兜底（mock `@/api`） |
| `src/utils/auth/permission.test.ts` | 17 | 超管短路、hasRole、hasPermission 的 view 兜底、checkPermission、getRoleLevel（mock user store） |
| `src/composables/useTable.test.ts` | 9 | 分页/搜索/重置/排序/loading、请求异常兜底（mount 包裹） |
| `src/composables/useDialog.test.ts` | 7 | 打开/关闭/标题切换（新增 vs 编辑）、提交成功/校验失败/无 formRef |
| `src/store/modules/app.test.ts` | 5 | toggleSideBar/closeSideBar 持久化、loading 计数、device 切换 |
| `src/store/modules/tagsView.test.ts` | 7 | 标签增删/去重/关闭其他/关闭全部/隐藏路由跳过 |
| `src/i18n/i18n-symmetry.test.ts` | 5 | 中英 key 对称、无缺失、无空值（复用 symmetry 逻辑） |

测试设计要点：
- `dict` / `permission` 通过 `vi.mock` 隔离 `@/api` 与 user store 的重依赖链路（axios/router/ws）。
- `useTable` 通过 `defineComponent + mount` 包裹，使 `onMounted/onUnmounted` 正常生效。
- `useDialog` 的 `formRef` 以 `ref` 包裹 mock FormInstance，与真实组件用法一致。
- store 测试统一 `createPinia + setActivePinia`，jsdom 原生 localStorage/sessionStorage 可用。
- i18n 对称性测试递归扁平化 zh/en 两棵消息树，断言 key 集合完全一致。

---

## 三、格式化结果

- 已执行 `npm run format`，对 `src/**/*.{ts,vue,json}` 统一格式化（约 178 个文件变更，含 104 个 ts、59 个 vue）。
- 未改动业务逻辑，仅统一风格（无分号、单引号、printWidth 120 等）。
- `database.config.ts` 未触碰。

---

## 四、构建验证

| 命令 | 结果 |
| --- | --- |
| `npm run type-check`（vue-tsc --noEmit） | exit 0 |
| `npm run test` | 10 文件 / 99 用例全部通过 |
| `npm run build`（vue-tsc + vite build） | exit 0（格式化前后各验证一次，均通过） |
| `node scripts/i18n-symmetry.mjs` | zh/en 各 2731 叶子 key，缺失 0、空值 0 |

---

## 五、新增/变更文件清单

**新增：**
- `vitest.config.ts`
- `.prettierrc`、`.prettierignore`
- `commitlint.config.js`
- `.husky/commit-msg`
- `.github/workflows/ci.yml`
- 10 个 `*.test.ts`（见上表）

**变更：**
- `package.json`：新增 test / format / commitlint / prepare scripts
- 全量 `src/**/*.{ts,vue,json}` 经 Prettier 统一格式

---

## 六、约束遵守说明

- 仅改前端工程；未改变业务逻辑，仅加测试与配置。
- `database.config.ts` 未改动。
- 所有新增文件头注释作者为 GooHv。
- `npm run test` 全部通过，`npm run build` exit 0。
