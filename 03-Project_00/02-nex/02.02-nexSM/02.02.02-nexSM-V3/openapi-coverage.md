# nexSM 后端 OpenAPI (Swagger) 端点覆盖清单

> 作者: GooHv
> 生成时间: 2026-09-24
> 文档地址: http://localhost:3002/api-docs
> 规范: OpenAPI 3.0 / swagger-jsdoc（JSDoc `@openapi` 注释）

## 总览

| 指标 | 数值 |
| ---- | ---- |
| 业务模块数 | 22 |
| 已注释端点数 | 193 |
| 未注释端点数 | 0 |
| **总覆盖率** | **100%** |
| OpenAPI paths（去重路径项） | 158 |
| OpenAPI operations（含同路径多方法） | 193 |
| components.schemas | 21 |
| 控制台 JS 报错 | 0 |

> 说明：Express 路由按 `/prod-api/v2/<module>` 自动挂载。Swagger `server.url` 已含 `/prod-api/v2`，
> 故 `@openapi` 路径均写为相对前缀（如 `/user/login`）。`testRouter` 健康检查挂载在根路径 `/`，
> 单独计入并在文档中标注。

## 分模块覆盖明细

| # | 模块 (tag) | 路由前缀 | 端点数 | 已注释 | 覆盖率 |
|---|-----------|----------|:-----:|:-----:|:-----:|
| 1 | 用户管理 | /user | 21 | 21 | 100% |
| 2 | 国际化管理 | /i18n-manager | 17 | 17 | 100% |
| 3 | 设备部件 | /device-part | 17 | 17 | 100% |
| 4 | 通知中心 | /notification | 15 | 15 | 100% |
| 5 | 邮箱服务 | /email | 15 | 15 | 100% |
| 6 | 菜单管理 | /menu | 14 | 14 | 100% |
| 7 | 数据字典 | /dict | 12 | 12 | 100% |
| 8 | 数据库管理 | /db-manager | 11 | 11 | 100% |
| 9 | 文件管理 | /file-manager | 10 | 10 | 100% |
| 10 | 功能配置 | /feature-config | 9 | 9 | 100% |
| 11 | 客户管理 | /customer | 7 | 7 | 100% |
| 12 | 文件上传 | /upload | 6 | 6 | 100% |
| 13 | 角色管理 | /role | 6 | 6 | 100% |
| 14 | PLC 通讯 | /plc | 5 | 5 | 100% |
| 15 | 授权管理 | /license | 5 | 5 | 100% |
| 16 | 部门管理 | /dept | 5 | 5 | 100% |
| 17 | 翻译服务 | /translation | 5 | 5 | 100% |
| 18 | 权限管理 | /permission | 4 | 4 | 100% |
| 19 | 系统配置 | /config | 3 | 3 | 100% |
| 20 | 审计追踪 | /audit | 3 | 3 | 100% |
| 21 | 项目配置 | /project-config | 1 | 1 | 100% |
| 22 | 验证码 | /captcha | 1 | 1 | 100% |
| 23 | 健康检查（testRouter） | /（根路径） | 1 | 1 | 100% |
| | **合计** | | **193** | **193** | **100%** |

## 各模块端点清单

### 1. 用户管理 `/user`（21）
- GET `/user/token-valid`（公开，optionalAuth）
- POST `/user/login`（公开）
- POST `/user/register`（公开）
- POST `/user/forgot-password/send-code`（公开）
- POST `/user/forgot-password/reset`（公开）
- GET `/user/info`
- GET `/user/device/count`
- GET `/user/device/my`
- GET `/user`（管理员，分页）
- GET `/user/device`（管理员）
- POST `/user/device/refresh-status`（管理员）
- POST `/user/device/:id/kick`（管理员）
- DELETE `/user/device/:id`（管理员）
- GET `/user/:id`（管理员）
- POST `/user`（管理员，新增）
- PUT `/user/:id`（管理员）
- DELETE `/user/:id`（管理员）
- DELETE `/user/batch`（管理员）
- PATCH `/user/:id/status`（管理员）
- POST `/user/:id/reset-password`（管理员）
- POST `/user/:id/unlock`（管理员）

### 2. 国际化管理 `/i18n-manager`（17）
GET /languages、GET /language/read、GET /language/search、POST /node/save、POST /node/add、POST /node/delete、POST /language/save-values、POST /language/create、POST /backup、GET /backups、POST /backup/restore、POST /backup/delete、GET /backup-config、POST /backup-dir、GET /preset-languages、GET /preset-languages/config、POST /preset-languages/config

### 3. 设备部件 `/device-part`（17）
GET /templates、GET /templates/admin、GET /templates/base、GET /templates/:id、POST /templates/add、PUT /templates/update/:id、DELETE /templates/delete/:id、GET /list、GET /:id、POST /add、PUT /update/:id、DELETE /delete/:id、POST /replace/:id、POST /update-life/:id、POST /batch-update-life、GET /replace-records/list、GET /warning-parts/list

### 4. 通知中心 `/notification`（15）
GET /unread-count、GET /type-stats、GET /、GET /:id、PUT /:id/read、PUT /read-all、PUT /batch-read、DELETE /:id、DELETE /batch、DELETE /all、PUT /archive、PUT /unarchive、GET /settings/get、PUT /settings/update、POST /

### 5. 邮箱服务 `/email`（15）
GET /providers、GET /all、GET /list、GET /log/list、GET /:id、POST /（管理员）、PUT /:id（管理员）、DELETE /:id（管理员）、PUT /:id/default（管理员）、PUT /:id/status（管理员）、POST /test（管理员）、POST /verify（管理员）、GET /log/:id（管理员）、DELETE /log/:id（管理员）、POST /log/batch-delete（管理员）

### 6. 菜单管理 `/menu`（14）
GET /version、GET /routers、GET /admin/tree、POST /admin、PUT /admin/:id、DELETE /admin/:id、PUT /admin/:id/drag、POST /admin/batch-save、GET /admin/backup/dir、PUT /admin/backup/dir、POST /admin/backup、GET /admin/backup/list、POST /admin/backup/restore、DELETE /admin/backup/:fileName

### 7. 数据字典 `/dict`（12）
GET /type、GET /type/:id、POST /type、PUT /type/:id、DELETE /type/:id、GET /item、GET /items/:code、POST /items/batch、GET /item/:id、POST /item、PUT /item/:id、DELETE /item/:id

### 8. 数据库管理 `/db-manager`（11，仅超管）
GET /tables、GET /tables/:tableName/structure、GET /tables/:tableName/data、PUT /tables/:tableName/data、POST /tables/:tableName/data、DELETE /tables/:tableName/data、POST /backup、GET /backup、GET /backup/:id、DELETE /backup/:id、POST /backup/:id/restore

### 9. 文件管理 `/file-manager`（10，仅超管）
GET /files、GET /backup-dir、POST /backup-dir、GET /file/read、POST /file/write、GET /backups、GET /backup/read、POST /backup/restore、POST /backup/delete、POST /check-syntax

### 10. 功能配置 `/feature-config`（9，仅超管）
GET /、GET /category/:category、GET /check/:featureKey、GET /:featureKey、PUT /:featureKey、PUT /:featureKey/reset、POST /batch-update、PUT /category/:category/reset、PUT /reset-all

### 11. 客户管理 `/customer`（7）
GET /、GET /:id、POST /、PUT /:id、DELETE /:id、DELETE /batch、PATCH /:id/status

### 12. 文件上传 `/upload`（6）
POST /local、POST /local/batch、DELETE /local、POST /github、POST /github/batch、DELETE /github

### 13. 角色管理 `/role`（6）
GET /all、GET /、GET /:id、POST /、PUT /:id、DELETE /:id

### 14. PLC 通讯 `/plc`（5）
GET /status、GET /read-tag、GET /read-all、POST /write-tag、POST /reconnect

### 15. 授权管理 `/license`（5）
POST /import（公开）、GET /status（公开）、GET /machine-id、POST /sync-time、GET /download（管理员）

### 16. 部门管理 `/dept`（5）
GET /tree、GET /:id、POST /、PUT /:id、DELETE /:id

### 17. 翻译服务 `/translation`（5）
GET /config（超管）、POST /config/save（超管）、POST /config/test（超管）、POST /translate、POST /translate/batch

### 18. 权限管理 `/permission`（4）
GET /my、GET /all（管理员）、GET /role/:roleId/menu-ids（管理员）、POST /role/save（管理员）

### 19. 系统配置 `/config`（3）
GET /、GET /category/:category、PUT /

### 20. 审计追踪 `/audit`（3）
GET /list、GET /my、GET /verify（管理员）

### 21. 项目配置 `/project-config`（1，仅超管，只读）
GET /all

### 22. 验证码 `/captcha`（1）
GET /captcha-image（公开）

### 23. 健康检查 `/`（testRouter，根路径）
GET /（公开探活）

## 文档工程改动说明

- `src/config/swagger.config.js`：扩展 components.schemas（User/Customer/Role/Dept/Menu/DictType/DictItem/AuditLog/Notification/DevicePart/DevicePartTemplate/EmailConfig/LoginResult + 通用 ApiResponse/PageResult/BadRequest/Unauthorized/Forbidden/NotFound/InternalError/PaginationQuery），补全 23 个 tag 及排序，apis 改为 glob `./src/modules/**/*.route.js` 等，导出 `{ specs, uiOptions }`。
- `app.js`：`swaggerUi.setup(specs, uiOptions)` 接入深色/蓝色主题、explorer、docExpansion=none、filter、tagsSorter 等 UI 选项。
- 各 `src/modules/<module>/<module>.route.js`：在每个 `router.METHOD(...)` 上方添加 `@openapi` JSDoc 注释（summary/description/tags/parameters/requestBody/responses/security）。
- `routes/testRouter.js`：补充根路径健康检查的 `@openapi` 注释。

## 在线验证结果

- 服务 `node app.js` 启动无报错，`http://localhost:3002/api-docs` 返回 200。
- 浏览器控制台 **0 条 JS 报错**（修复 tagsSorter 闭包引用后）。
- 标题「nexSM 管理平台 API 文档」、自定义 favicon、Filter by tag、Authorize、方法色块均正常渲染。
- 截图见 `public/swagger-screenshots/`：
  - `01-home-title.png`：文档首页（标题/统一响应格式/错误码表）
  - `02-endpoint-detail-post-user.png`：典型端点 POST /user 详情（请求体示例）
  - `03-responses-examples.png`：响应 200/400/403 示例
