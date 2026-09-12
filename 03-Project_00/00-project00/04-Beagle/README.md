# Beagle 测试平台

一个**通用、项目无关、插件化**的自动化测试平台。平台本身不内置任何具体测试逻辑——所有测试能力都以「插件」形式存在，开发者按标准约定新增一个后端插件，平台即自动获得配置页、执行页与报告页，**零前端代码**。

> 设计目标：像 VS Code 之于插件、像大厂 CI 质量门禁之于规则——平台负责调度、进度、历史报告与项目/插件绑定，具体测什么、怎么测，全部交给插件。

---

## 目录

- [架构总览](#架构总览)
- [快速开始](#快速开始)
- [使用流程](#使用流程)
- [内置插件一览](#内置插件一览)
- [插件开发指南](#插件开发指南)
- [可继续开发的插件路线图](#可继续开发的插件路线图)
- [技术栈与设计理念](#技术栈与设计理念)

---

## 架构总览

```
04-Beagle/
├── server/                     # 后端 Node.js + Express + sql.js(WASM SQLite)
│   ├── src/
│   │   ├── app.js              # 入口（端口 3003）
│   │   ├── db/index.js         # sql.js 数据库初始化与读写
│   │   ├── modules/            # 平台业务：项目、插件、测试执行、报告
│   │   └── test-modules/       # ★ 插件目录（每子目录一个插件，自动发现）
│   │       ├── base.js         # 插件基类（声明式配置/统一报告）
│   │       ├── registry.js    # 自动注册器（扫到 index.js 即注册）
│   │       ├── shared/         # 共享工具库（sourceScan 静态扫描等）
│   │       └── <plugin>/index.js
│   ├── data/                   # SQLite 数据文件（运行时生成）
│   └── reports/                # 历史报告（运行时生成）
│
└── web/                        # 前端 Vue3 + Element Plus + Vite + Pinia + ECharts
    └── src/
        ├── views/
        │   ├── projects/       # 项目管理
        │   ├── modules/        # 测试模块入口
        │   │   ├── index.vue   #   插件卡片墙（点击进入）
        │   │   ├── runner/     #   ★ 通用执行页（schema 驱动，所有插件复用）
        │   │   └── i18n-check/ #   定制页（仅复杂插件需要）
        │   ├── reports/        # 历史报告
        │   └── settings/       # 系统设置
        ├── components/
        │   ├── ConfigForm.vue  # 通用配置表单（按 configSchema 自动渲染）
        │   ├── ModuleReport.vue# 通用报告组件（统计/筛选/详情）
        │   └── SafeIcon.vue    # 图标兜底
        └── api/                # 前端接口层
```

**关键机制**：插件只在后端声明「要哪些配置项 `configSchema`」和「分几步执行 `progressStages`」，前端 `runner/index.vue` + `ConfigForm.vue` 据此自动生成表单，执行后 `ModuleReport.vue` 自动渲染结果。**新增纯后端插件 = 零前端代码、零路由、零注册**。

---

## 快速开始

### 1. 启动后端

```bash
cd server
npm install
npm run dev          # = nodemon src/app.js
# 后端运行在 http://localhost:3003
```

### 2. 启动前端

```bash
cd web
npm install
npm run serve        # = vite（开发）；npm run build 为生产构建
# 前端运行在 http://localhost:5173，/api 代理到 3003
```

> 要求 Node.js ≥ 18（内置 fetch，api-reachability 等插件依赖）。

---

## 使用流程

1. **项目管理** → 新建被测项目，填写前端路径、后端路径、API 基础地址等（所有路径/参数都在页面配置，不写死在代码里）。
2. **测试模块** → 选择项目 → 点击某个插件卡片。
3. 平台根据该插件的 `configSchema` **自动渲染配置表单**，按需调整 → 点「开始检测」。
4. 页面实时展示插件自定义的**核心节点进度**（`progressStages`）。
5. 执行完成后，通用报告组件展示统计概览、按类别筛选、逐条结果与详情弹窗。
6. **测试报告** → 查看历史执行记录与完整报告。

---

## 内置插件一览

平台当前内置 **9 个插件**（作者统一为 GooHv），覆盖质量 / 安全 / 接口 / 性能四类。

| 插件 (moduleType) | 分类 | 用途 | 关键可调项 |
|---|---|---|---|
| **国际化检测** `i18n-check` | 质量 | 多语言包 key 对称性、缺失/多余/空值、前端引用完整性、引用图、数据库 key 比对 | 母版语言、20+ 检查项开关 |
| **调试残留检测** `console-debug` | 质量 | 扫描 `console.*`、`debugger`、原生 `alert/confirm/prompt` | 放行级别、扫描目录 |
| **代码规范检测** `eslint-check` | 质量 | 优先调用**被测项目自带 ESLint** 真实 lint；缺失则降级内置规则（var / `==` / 空块 / 超长行 / TODO） | 目标范围、内置规则开关 |
| **硬编码检测** `hardcode-check` | 质量 | 硬编码 URL / WebSocket / IP / localhost / 邮箱，可选魔法数字、域名白名单 | 规则开关、白名单 |
| **必备文件完整性** `required-files` | 质量 | 前后端必备文件/目录/锁文件/package.json 字段，支持 `*` 通配 | 自定义文件清单、缺失级别 |
| **敏感信息泄露检测** `secret-leak` | 安全 | PEM 私钥 / AWS Key / JWT / 连接串 / 密钥赋值 / 弱口令 / 高熵字符串，自动脱敏 | 规则开关、熵阈值 |
| **接口鉴权检测** `api-auth` | 安全 | 静态分析 Express/Koa 路由是否被鉴权中间件保护，**按中间件注册顺序**判定 | 鉴权中间件名、公开白名单 |
| **API 可达性检测** `api-reachability` | 接口 | 从代码提取接口或手工录入，真实 HTTP 探测，按 2xx/401·403/404/5xx/网络错误分类 | 基础地址、超时、Token、写操作策略 |
| **构建体积分析** `bundle-size` | 性能 | dist 产物原始+gzip 体积、按类型汇总、超大 chunk / 总体积超标标记 | 产物目录、阈值、是否先构建 |

> 「不确定」的结果统一归入 `uncertain`（存疑），不武断判错，符合「宁可存疑、不冤枉」的检测哲学。

---

## 插件开发指南

### 最小步骤

1. 在 `server/src/test-modules/` 下新建目录，例如 `my-check/`，里面写 `index.js`。
2. 继承 `TestModuleBase`，实现必需的静态元信息 + `async run()`。
3. **无需注册**（`registry.autoDiscover` 自动发现），**无需写前端**（通用 runner 自动渲染）。
4. 重启后端，前端「测试模块」页即出现该插件卡片。

### 必须实现的静态成员

| 成员 | 说明 |
|---|---|
| `moduleType` | 唯一标识（目录同名，如 `my-check`） |
| `moduleName` | 中文展示名 |
| `description` | 详细描述（会显示在插件介绍卡片） |
| `icon` | Element Plus 图标名，如 `Lock`、`Monitor` |
| `category` | `quality` / `security` / `api` / `performance` / `permission` / `other` |
| `version` / `author` | 版本与作者 |
| `progressStages` | 执行核心节点数组 `[{key,label}]`，前端据此画步骤条 |
| `configSchema` | 配置项声明（见下），平台据此自动生成表单 |

### configSchema 字段类型

每个字段：`{ key, label, type, default, required, placeholder, tip, options, group, span, min, max, step, rows }`。

| type | 渲染控件 | 适用 |
|---|---|---|
| `string` / `path` | 文本框 / 路径输入 | 普通参数、目录 |
| `password` | 密码框 | Token、密钥 |
| `number` | 数字输入 | 阈值、超时、行数 |
| `boolean` | 开关 | 功能开关 |
| `select` | 下拉单选 | 枚举（`options: [{label,value}]`） |
| `multiselect` | 下拉多选 | 枚举集合，默认 `[]` |
| `textarea` | 多行文本 | 清单、忽略目录，配合 `rows` |

> 所有 `tip` 都会渲染为标签后的「?」悬浮提示。

### run() 可用的基类方法

```js
this.project          // 被测项目：{ id, name, frontend_path, backend_path, api_base_url, ... }
this.cfg              // 合并了 schema 默认值 + 用户配置后的配置对象
this.startTimer()
this.setProgress(stageKey, 0~100)   // 推进前端步骤条
this.addResult({
  name: 'main.js:4 [URL]',           // 检测项标题
  passed: false,                      // 是否通过
  category: 'warning',                // error / warning / uncertain / info / pass
  message: '存在硬编码 URL',           // 一句话结果
  detail: { file, line, ... }        // 可点开查看的结构化详情
})
this.parseIgnoreDirs(textareaStr)     // 把 textarea 忽略目录解析成数组
this.complete(statsObject)           // ★ 收尾：停止计时、生成统一报告并注入统计
```

报告由基类统一生成（`total/pass/fail/passRate/duration/results/summary/stats`），前端 `ModuleReport` 自动渲染。

### 完整最小示例

```js
// server/src/test-modules/no-console-log/index.js
const fs = require('fs');
const path = require('path');
const TestModuleBase = require('../base');
const { scanDirectory } = require('../shared/sourceScan');

class NoConsoleLogModule extends TestModuleBase {
  static get moduleType() { return 'no-console-log'; }
  static get moduleName() { return '禁止 console.log 检查'; }
  static get description() { return '扫描源码，发现残留的 console.log 调用。'; }
  static get icon() { return 'Monitor'; }
  static get category() { return 'quality'; }
  static get version() { return '1.0.0'; }
  static get author() { return 'GooHv'; }

  static get progressStages() {
    return [
      { key: 'scan', label: '扫描源码' },
      { key: 'report', label: '汇总报告' }
    ];
  }

  static get configSchema() {
    return [
      { key: 'srcDir', label: '源码目录', type: 'path', default: 'src',
        tip: '相对于项目「前端路径」' },
      { key: 'level', label: '严重级别', type: 'select', default: 'warning',
        options: [{ label: '警告', value: 'warning' }, { label: '错误', value: 'error' }] },
      { key: 'ignoreDirs', label: '额外忽略目录', type: 'textarea', default: 'test,node_modules' }
    ];
  }

  async run() {
    this.startTimer();
    const stats = { files: 0, hits: 0 };
    this.setProgress('scan', 10);

    const root = path.join(this.project.frontend_path, this.cfg.srcDir || 'src');
    if (!fs.existsSync(root)) {
      this.addResult({ name: '路径', passed: false, category: 'error', message: '源码目录不存在' });
      return this.complete(stats);
    }

    const res = scanDirectory(root, (ctx) => {
      const out = [];
      if (/console\.log\s*\(/.test(ctx.text)) {
        stats.hits++;
        out.push({
          name: `${ctx.rel}:${ctx.line}`, passed: false, category: this.cfg.level,
          message: '发现 console.log', detail: { file: ctx.rel, line: ctx.line }
        });
      }
      return out;
    }, null, { ignoreDirs: this.parseIgnoreDirs(this.cfg.ignoreDirs) });

    stats.files = res.files;
    for (const h of res.hits) this.addResult(h);
    this.setProgress('report', 100);
    return this.complete(stats);
  }
}

module.exports = NoConsoleLogModule;
```

### 开发要点

- **图标必须真实存在**：从 `@element-plus/icons-vue` 选取，先用 `node -e "const I=require('@element-plus/icons-vue'); console.log(I.Xxx)"` 验证，避免用了不存在的图标。
- **静态检测优先复用**：源码遍历/逐行扫描用 `shared/sourceScan.js` 的 `scanDirectory / scanContent / walk`，不要重复造轮子。
- **写操作要安全**：插件默认**只读**被测项目，不要自动改写文件；需要执行外部命令（如 build、lint）时做成显式开关，默认关闭。
- **不确定不判错**：动态行为、跨文件依赖、运行时才能确定的，归 `uncertain`，让人工复核。
- **配置项都要可配**：路径、阈值、白名单、规则开关一律走 `configSchema`，禁止硬编码。
- **复杂插件才写前端**：若插件交互/可视化极复杂（如 i18n-check 的引用图），可在 `web/src/views/modules/<type>/` 写定制页，并在 `router/index.js` 与 `views/modules/index.vue` 的 `customPages` 登记。常规插件无需这样做。

---

## 可继续开发的插件路线图

按"覆盖 90% 常见业务测试场景"的目标，建议后续优先补充：

**质量与规范**
- 依赖漏洞扫描（`npm audit` / 锁文件 CVE 检查）
- TypeScript 类型检查（`tsc --noEmit`）
- 重复代码检测（jscpd）
- 死代码 / 未使用导出 / 未使用依赖检测
- Git 提交规范、分支命名、敏感分支检查

**接口与数据**
- OpenAPI/Swagger 与实际代码路由的契约一致性校验
- 接口 Mock / 契约测试
- 数据库表结构与 ORM 模型 / 迁移脚本一致性
- 环境变量 `.env` 跨环境一致性与缺失检查

**性能与体验**
- Lighthouse / Web Vitals 关键指标
- 图片 / 字体等静态资源优化检查
- 路由懒加载、首屏资源分析（在 bundle-size 基础上扩展）
- 可访问性（a11y）检查

**端到端与流程**
- 登录 / 鉴权主流程 E2E（Playwright）
- 关键业务链路冒烟测试
- 跨浏览器 / 视口响应式检查

> 新插件遵循上文约定即可，平台会自动承接配置、执行、进度、报告与历史。

---

## 技术栈与设计理念

- **后端**：Node.js + Express + sql.js（纯 WASM SQLite，免原生编译）+ multer + node-cron + axios
- **前端**：Vue 3 + Element Plus + Vite + Pinia + Vue Router + ECharts
- **插件元信息**：全部来自插件代码（`Class.getMeta()`），平台只负责调用——「有就展示，没有就不显示」，不写死。

设计理念：
- **平台与业务解耦**：平台不带任何具体测试规则，规则全在插件里。
- **声明式优先**：用 `configSchema` 描述需求，平台自动生成 UI，减少重复前端。
- **统一报告契约**：所有插件输出同一套结果结构，前端组件可复用。
- **项目无关**：被测项目的一切信息（路径、API 地址、Token）都在页面配置并按项目保存。
