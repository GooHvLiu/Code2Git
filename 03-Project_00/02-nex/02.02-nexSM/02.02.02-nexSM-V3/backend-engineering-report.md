# 后端工程化整改报告

> 作者：GooHv ｜ 日期：2026-09-24
> 工程：`02.02.02-nexSM-V3`（Express + MySQL，CommonJS）

本次整改围绕 **dotenv 治理 / 结构化日志 / 限流 / helmet / 数据库迁移** 五项展开，不改变任何 API 行为与响应格式，不修改现有表结构与数据。

---

## 一、改动清单

### 1. dotenv 环境变量治理
| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `src/config/env.validate.js` | 新增 | 启动时校验 9 个必需变量（NODE_ENV/APP_PORT/DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME/JWT_SECRET/JWT_EXPIRES_IN），缺失即打印清单并 `process.exit(1)` |
| `.env.example` | 重写 | 与现有 `.env` 结构完全对齐，敏感值替换为 `your_xxx` 占位符，附使用说明 |
| `.gitignore` | 新增 | 仓库原本没有 `.gitignore`，已加入 `.env`、`node_modules/`、`logs/`、`uploads/`、`beehive/license`、`beehive/time` 等 |

- 配置硬编码检查：`app.config.js`、`db.config.js`、`jwt.config.js`、`license.config.js`、`upload.config.js` 均已从 `process.env` 读取，无需改动；`db.config.js` / `license.config.js` 结构保持原样。

### 2. 结构化日志（winston）
| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `src/utils/logger.js` | 新增 | winston 实例；开发环境控制台彩色 `时间 [级别] 消息`，文件统一 JSON；级别 dev=debug / prod=info；输出 `logs/error.log` + `logs/combined.log`（自动按 10MB 轮转，保留 10 个） |
| `src/middleware/logger.middleware.js` | 重写 | 请求结束时记录 method/url/status/responseTime(ms)/ip，按状态码区分 info/warn/error |
| `app.js` | 修改 | 启动横幅、Swagger、各模块初始化日志改用 `logger.info/error` |

### 3. 限流（express-rate-limit）
| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `src/middleware/rateLimit.middleware.js` | 新增 | `generalLimiter` 15min/1000 次；`strictLimiter` 15min/10 次；触发统一返回 `{code:429,msg:'请求过于频繁，请稍后再试'}` |
| `app.js` | 修改 | 通用限流挂所有路由前；严格限流挂 `/prod-api/v2/user/login`、`/register`、`/forgot-password`、`/prod-api/v2/captcha`；`/api-docs` 不受严格限流影响 |

### 4. helmet 安全头
| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `app.js` | 修改 | CORS 之后、路由之前挂载 `helmet()`；`crossOriginEmbedderPolicy:false`；开发环境关闭 CSP（兼容 Swagger UI / Vite inline script），生产环境启用 helmet 默认严格策略 |

### 5. 数据库迁移
| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `src/migrations/index.js` | 新增 | 轻量迁移执行器：自动扫描 `*.js` 排序执行，维护 `schema_migrations` 表；支持 `up` 与 `down <name>` |
| `src/migrations/001_initial.js` | 新增 | 基线迁移，`up/down` 均为空操作，仅标记现有库结构为迁移起点，不执行任何 DDL |
| `package.json` | 修改 | 新增 scripts：`migrate`、`migrate:down` |

---

## 二、验证结果

| # | 验证项 | 结果 |
| --- | --- | --- |
| 1 | `node app.js` 启动无报错 | ✅ 正常启动，监听 3002 |
| 2 | `GET /api-docs` Swagger 可访问 | ✅ 200，helmet 未阻断 |
| 3 | 健康检查 `GET /` | ✅ `{code:200,data:{State:"Connected Success."}}` |
| 4 | 连续 11 次登录，第 11 次 | ✅ 第 1–10 次 200，第 11 次 **429**，响应体 `{"code":429,"msg":"请求过于频繁，请稍后再试"...}` |
| 5 | helmet 安全头 | ✅ `X-Content-Type-Options:nosniff`、`X-Frame-Options:SAMEORIGIN`、`Referrer-Policy`、`Strict-Transport-Security` 等均在 |
| 6 | `logs/` 日志文件 | ✅ 生成 `combined.log`（结构化 JSON，含 method/url/status/responseTime/ip）与 `error.log` |
| 7 | 迁移表 | ✅ `schema_migrations` 已建，记录 `001_initial` |
| 附 | 环境变量负向校验 | ✅ 删除 JWT_SECRET/DB_PASSWORD 后启动即打印缺失清单并 exit 1 |

补充观察：
- 通用限流响应头 `RateLimit-Limit:1000`、严格限流 `RateLimit-Limit:10`、`Retry-After` 均正常下发。
- PLC 未连接报错属正常现象（本机无物理 PLC，不影响本次整改）。

---

## 三、注意事项 / 后续建议

1. **生产部署**：`NODE_ENV=production` 时 helmet CSP 自动启用严格策略；如前端有独立域名/CDN 静态资源，需在 `helmet()` 中显式配置 `contentSecurityPolicy.directives` 放行白名单源，否则可能阻断前端静态资源。
2. **限流窗口**：当前严格限流 15 分钟 10 次偏严，若正常用户输错密码较多可能被锁；可按需在 `rateLimit.middleware.js` 调整 `max`。
3. **邮箱兜底凭据**：`src/config/email.config.js` 中 `username/password` 仍有硬编码兜底值（当前环境在用）。按"不改 API 行为"约束本次未动，建议后续把真实邮箱口令迁入 `.env`（`EMAIL_USERNAME`/`EMAIL_PASSWORD`）后清空兜底值。
4. **日志文件**：当前按大小轮转（10MB×10），未按日期分文件（`winston-daily-rotate-file` 未安装）；如需按天归档，可后续 `npm i winston-daily-rotate-file` 后替换 transport。
5. **迁移扩展**：后续表结构变更请新建 `src/migrations/002_xxx.js`，导出 `up(pool)/down(pool)`，执行 `npm run migrate` 即可。
6. **Beehive 授权中间件**：保持原样，白名单路径未改动。
