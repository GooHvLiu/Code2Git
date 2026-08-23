# Beehive 授权系统集成文件

本目录包含 Beehive 授权系统的前后端集成文件，可直接拷贝到其他项目中使用。

## 目录结构

```
sources/
├── Backend/                    # 后端集成文件（Express）
│   ├── sdk/                    # 授权验证 SDK（核心，必须拷贝）
│   │   ├── index.js            # SDK 入口，导出 LicenseGuard
│   │   ├── license-verify.js   # 授权文件解密、RSA验签、有效性验证
│   │   ├── time-guard.js       # 时间防护（防时间回退、联网校准）
│   │   ├── machine-id.js       # 机器指纹生成
│   │   ├── package.json        # SDK 依赖声明
│   │   └── README.md           # SDK 使用说明
│   ├── src/
│   │   ├── config/
│   │   │   └── license.config.js   # 授权配置中心（路径、密钥、白名单）
│   │   └── modules/license/
│   │       ├── license.controller.js  # 授权控制器（导入、状态查询、机器ID、时间校准、下载）
│   │       └── license.route.js       # 授权路由（5个接口 + 权限分层）
│   ├── public.pem              # RSA 公钥（从 Beehive 管理后台下载，每个项目相同）
│   ├── app.js                  # 后端入口文件示例（包含授权初始化和中间件配置）
│   ├── .env                    # 环境变量示例（包含 LICENSE_* 配置）
│   └── .env.example            # 环境变量模板
│
└── Frontend/                   # 前端集成文件（Vue2 + Element UI）
    ├── src/
    │   ├── api/
    │   │   └── license.js      # 授权相关 API 封装
    │   ├── config/
    │   │   └── license.config.js   # 前端授权配置
    │   ├── views/license/
    │   │   ├── LicenseImport.vue    # 授权导入页面（未授权时跳转）
    │   │   └── LicenseManage.vue    # 授权管理页面（管理员查看授权状态）
    │   ├── router/
    │   │   ├── pathConstants.js     # 路由路径常量（新增 LICENSE_IMPORT）
    │   │   ├── constants.js          # 路由白名单（授权导入页加入白名单）
    │   │   ├── constantRoutes.js     # 静态路由（新增授权导入页和授权管理页）
    │   │   └── permission.js         # 路由守卫（先检查授权状态）
    │   └── utils/
    │       ├── constants.js          # 常量（授权接口加入 NO_TOKEN_API 白名单）
    │       └── request.js            # 请求拦截器（403授权失败跳转、blob响应处理）
    └── README.md                     # 本说明文档
```

## 后端集成步骤

### 1. 拷贝核心文件（必须）

```bash
# 拷贝 SDK 目录
cp -r Backend/sdk /your-project/sdk

# 拷贝公钥
cp Backend/public.pem /your-project/public.pem

# 拷贝授权配置
cp Backend/src/config/license.config.js /your-project/src/config/

# 拷贝授权模块
cp -r Backend/src/modules/license /your-project/src/modules/
```

### 2. 安装依赖

```bash
npm install axios uuid dayjs
```

### 3. 修改 app.js

参考 `Backend/app.js`，在入口文件中添加：

```javascript
const fs = require('fs');
const { LicenseGuard } = require("./beehive/sdk");
const licenseConfig = require('./src/config/license.config');

// 初始化授权守卫
const licenseGuard = new LicenseGuard({
  projectId: licenseConfig.projectId,
  publicKey: fs.readFileSync(licenseConfig.publicKeyPath, 'utf8'),
  licensePath: licenseConfig.licensePath,
  timeGuardPath: licenseConfig.timeGuardPath,
  licenseServerUrl: licenseConfig.licenseServerUrl,
  strictMode: licenseConfig.strictMode
});

// 授权验证中间件（白名单路径跳过授权校验）
app.use((req, res, next) => {
  if (licenseConfig.whitelist.some(p => req.path.startsWith(p))) {
    return next();
  }
  licenseGuard.middleware()(req, res, next);
});

// 注册授权路由
app.use('/prod-api/v2/license', require('./src/modules/license/license.route'));
```

### 4. 配置环境变量

参考 `Backend/.env`，在项目的 `.env` 中添加：

```env
LICENSE_PROJECT_ID=your-project-id
LICENSE_FILE_PATH=./license.lic
LICENSE_PUBLIC_KEY_PATH=./public.pem
LICENSE_TIME_GUARD_PATH=./.timeguard
LICENSE_SERVER_URL=
LICENSE_STRICT_MODE=true
```

### 5. 生成授权文件

1. 在 Beehive 管理后台登记项目
2. 生成授权文件（.lic）
3. 下载授权文件放到项目根目录

## 前端集成步骤

### 1. 拷贝核心文件

```bash
# API 封装
cp Frontend/src/api/license.js /your-project/src/api/

# 授权配置
cp Frontend/src/config/license.config.js /your-project/src/config/

# 授权页面
cp -r Frontend/src/views/license /your-project/src/views/
```

### 2. 合并修改的核心文件（根据项目情况）

以下文件是项目核心文件，**不要直接覆盖**，需要根据项目情况合并修改：

- `src/router/pathConstants.js` — 新增 `LICENSE_IMPORT` 路径常量
- `src/router/constants.js` — 授权导入页加入路由白名单
- `src/router/constantRoutes.js` — 新增授权导入页和授权管理页静态路由
- `src/router/permission.js` — 路由守卫先检查授权状态
- `src/utils/constants.js` — 授权接口加入 `NO_TOKEN_API` 白名单
- `src/utils/request.js` — 403授权失败自动跳转授权导入页，blob响应跳过业务码判断

### 3. 路由配置

在静态路由中添加：

```javascript
// 授权导入页（未授权时跳转）
{
  path: '/license/import',
  name: 'LicenseImport',
  component: () => import('@/views/license/LicenseImport.vue'),
  hidden: true,
  meta: { title: '授权导入' }
},

// 授权管理页（管理员查看）
{
  path: 'system/license',
  name: 'SystemLicense',
  component: () => import('@/views/license/LicenseManage.vue'),
  hidden: true,
  meta: { titles: ['授权管理'], roles: ['administrator'] }
}
```

### 4. 路由守卫

在 `permission.js` 中，登录检查之前先检查授权状态：

```javascript
// 检查授权状态
const licenseRes = await getLicenseStatus();
if (!licenseRes.data.valid) {
  if (to.path !== ROUTE_PATHS.LICENSE_IMPORT) {
    return next(ROUTE_PATHS.LICENSE_IMPORT);
  }
  return next();
}
```

### 5. 请求拦截器

在 `request.js` 中添加：

```javascript
// 403 授权失败，跳转授权导入页
if (error.response?.status === 403) {
  router.push(ROUTE_PATHS.LICENSE_IMPORT);
}

// Blob 响应（文件下载）直接返回，不做业务码判断
if (response.config.responseType === 'blob') {
  return response;
}
```

## 授权接口清单

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/prod-api/v2/license/import` | 公开 | 导入授权文件 |
| GET | `/prod-api/v2/license/status` | 公开 | 查询授权状态 |
| GET | `/prod-api/v2/license/machine-id` | 需登录 | 获取服务器机器ID |
| POST | `/prod-api/v2/license/sync-time` | 需登录 | 手动触发联网时间校准 |
| GET | `/prod-api/v2/license/download` | 仅管理员 | 下载当前授权文件 |

## 注意事项

1. **公钥一致性**：`public.pem` 必须从 Beehive 管理后台下载，确保与生成授权文件的服务端密钥对一致
2. **AES 密钥**：Beehive 服务端的 AES 密钥必须保持不变，否则旧授权文件无法解密。启动服务端前确认环境变量 `AES_KEY` 未被篡改
3. **项目ID**：授权文件中的 `projectId` 必须与项目配置的 `projectId` 一致
4. **时间防护**：首次运行会自动生成 `.timeguard` 文件，防止客户端修改系统时间
5. **严格模式**：`strictMode=true` 时授权失败返回403；`false` 时只警告不拦截
