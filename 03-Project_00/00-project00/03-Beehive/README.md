# 模板流程

以下为制作整个模板的基本过程，若想直接使用，可以跳过模板流程，直接查看模板授权。

## 基本概述

一套完整的软件授权管理解决方案，适用于 B/S 架构项目的桌面客户端授权控制。

## 核心特性

| 特性 | 说明 |
|---|---|
| 🔐 **RSA 非对称签名** | 私钥签发授权，公钥验证，无法伪造 |
| 🔒 **AES-256 加密** | 授权文件内容加密存储，防止篡改 |
| 💻 **机器指纹绑定** | 绑定 CPU+MAC+硬盘序列号，授权不可拷贝 |
| ⏰ **防时间回退** | 检测系统时间被调回，授权自动冻结 |
| 🌐 **联网时间校准** | 时间回退后可联网校准恢复授权 |
| 🎯 **功能级授权** | 可控制哪些功能模块可用 |
| 📦 **多项目管理** | 统一管理 nexCM、nexSM 等多个项目 |
| 🔌 **SDK 集成** | 提供 Node.js SDK，被保护项目一行代码接入 |

## 项目结构

```
BeehiveTools/
├── server/              # 授权服务器（Express）
│   ├── app.js           # 入口
│   ├── core/
│   │   ├── crypto.js    # RSA签名 + AES加密
│   │   ├── license.js   # 授权文件生成/解析/验证
│   │   ├── timeGuard.js # 时间防护（防回退+联网校准）
│   │   └── machineId.js # 机器指纹生成
│   ├── routes/          # API路由
│   ├── middleware/      # 中间件（含授权验证中间件）
│   ├── data/
│   │   ├── keys/        # RSA密钥对（私钥绝不能泄露）
│   │   └── licenses/    # 生成的授权文件
│   └── scripts/         # 密钥生成脚本
├── sdk/                 # 授权验证SDK（供被保护项目集成）
│   ├── index.js         # LicenseGuard 主类
│   ├── license-verify.js # 授权验证核心
│   ├── time-guard.js    # 时间防护
│   └── machine-id.js    # 机器指纹
└── web/                 # 管理后台（Vue2 + Element UI）
    └── src/views/
        ├── Dashboard.vue      # 概览
        ├── LicenseGen.vue     # 生成授权
        ├── LicenseList.vue    # 授权列表
        ├── ProjectManage.vue  # 项目管理
        └── TimeCheck.vue      # 时间校准
```

## 授权介绍

### 授权类型

| 类型                | 说明                       |
| ------------------- | -------------------------- |
| 试用版 (trial)      | 短期试用，通常7-30天       |
| 标准版 (standard)   | 标准授权，按年计费         |
| 企业版 (enterprise) | 企业授权，更多功能和用户数 |
| 永久版 (perpetual)  | 永久授权，不过期           |

### 授权格式

```json
{
  "version": "1.0",
  "licenseId": "uuid",
  "projectId": "nex-cm-v2",
  "projectName": "nexCM 设备管理系统",
  "licenseType": "standard",
  "machineId": "64位SHA256哈希（为空表示不绑定）",
  "issuedAt": 1700000000000,
  "expiresAt": 1730000000000,
  "features": ["user_manage", "device_manage"],
  "maxUsers": 100,
  "customer": { "name": "客户名称", "contact": "联系人" },
  "signature": "RSA-SHA256签名"
}
```

存储方式：JSON → AES-256-CBC 加密 → Base64 编码 → .lic 文件

### 防回原理

```
客户端每次授权验证
       ↓
读取本地时间守卫文件(.timeguard)
       ↓
比较当前时间 vs 上次记录时间
       ↓
   ┌─── 当前时间 >= 上次时间？ ───┐
   │ 是                           │ 否
   ↓                              ↓
更新守卫文件               判定为时间回退
   │                           ↓
   │                     授权冻结(403)
   │                           ↓
   │                     尝试联网校准
   │                     调用 /api/time 获取真实时间
   │                           ↓
   │                     校准成功 → 重置守卫 → 授权恢复
   ↓
授权验证通过
```

## 快速准备

### 启动服务

```bash
cd server
npm i
npm run start
# 服务启动在 http://0.0.0.0:3100
# 首次启动自动生成 RSA 密钥对
```

### 启动后台

```bash
cd web
npm i
npm run serve
# 后台启动在 http://localhost:3101
```

## 生成授权

### 后端项目

#### 安装依赖

先把项目的依赖装上，确保它们本身能跑起来，这是后续集成的基础。

```bash
cd F:\CodingMan\Code2Git\03-Project_00\00-project00\03-Beehive\demo\nexSM-V2_03
npm install
```

#### 授权文件

##### 项目管理

项目管理-新增项目中，填写如下内容：

| 字段     | 填写内容                                                     |
| -------- | ------------------------------------------------------------ |
| 项目 ID  | `nex-sm-v2`                                                  |
| 项目名称 | `nexSM 后端服务`                                             |
| 描述     | `nex项目的后端服务加密测试`                                  |
| 技术栈   | `Express, MySQL, Joi`                                        |
| 功能模块 | 输入 `api_service` 回车，再输入 `auth` 回车，再输入 `database` 回车 |

##### 生成授权

生成授权中，填写授权信息：

|    字段    |           当前值            | 状态 |
| :--------: | :-------------------------: | ---- |
|    项目    |          nex-sm-v2          | ✅    |
|  授权类型  |           试用版            | ✅    |
|  授权名称  |       nexSM 测试授权        | ✅    |
|  有效天数  |              1              | ✅    |
| 最大用户数 |             10              | ✅    |
|  功能授权  | api_service、auth、database | ✅    |
|  机器绑定  |           不绑定            | ✅    |

> 客户信息按照实际填写，机器绑定暂时不做，后面会做演示

将下载的文件名称更改为`license.lic`放在`demo\nexSM-V2_03`的根目录下。

##### 复制公钥

把 Beehive 的公钥文件复制到 nexSM 项目根目录：

```bash
# 源文件
F:\CodingMan\Code2Git\03-Project_00\00-project00\03-Beehive\server\data\keys\public.pem
# 目标文件
F:\CodingMan\Code2Git\03-Project_00\00-project00\03-Beehive\demo\nexSM-V2_03\public.pem
```

> 公钥是用来验证授权文件签名的，必须和生成授权时用的私钥配对。私钥在 Beehive 服务端，绝对不能泄露给客户端。

#### 授权SDK

##### 集成 SDK

把 Beehive 的整个 `sdk` 目录复制到 nexSM 项目根目录：

```bash
# 源文件
F:\CodingMan\Code2Git\03-Project_00\00-project00\03-Beehive\sdk
# 目标文件
F:\CodingMan\Code2Git\03-Project_00\00-project00\03-Beehive\demo\nexSM-V2_03\sdk
```

##### 加中间件

把授权中间件放在**主路由之前、测试路由之后**，这样测试接口不受影响，主业务接口全部受授权保护。

```js
// 总路由
const router = require('@routes/router.js');
const testRouter = require("@routes/testRouter.js");

// 新增 - Beehive 授权验证
const { LicenseGuard } = require('./sdk');
const licenseGuard = new LicenseGuard({
  projectId: 'nex-sm-v2',
  publicKey: fs.readFileSync(path.join(__dirname, './public.pem'), 'utf8'),
  licensePath: path.join(__dirname, './license.lic'),
  timeGuardPath: path.join(__dirname, './.timeguard'),
  licenseServerUrl: 'http://127.0.0.1:3100',
  strictMode: true
});

// 跨域
app.use(cors());

......
// 测试路由
app.use("/", testRouter);

// 新增 - 授权验证中间件（主业务接口全部受保护）
app.use(licenseGuard.middleware());

// 使用路由
app.use(router);
```

> 重新启动后端服务后，如下提示表示正确：
>
> 授权有效: trial | 过期: 2026/9/22 13:02:49

#### 测试访问

##### 模拟正常

用浏览器或 curl 访问一个受保护的接口，确认授权有效时能正常访问：

```bash
# 授权文件放在测试路由之后，如下不受授权限制
http://localhost:3002/
# 授权文件放在主路由之前，如下受授权限制
http://localhost:3002/prod-api/v2/captcha/captchaImage
```

> ```
> http://localhost:3002/：
> {"code":200,"msg":"成功连接服务器","data":{"State":"Connected Success."},"timestamp":1787461689278}
> http://localhost:3002/prod-api/v2/captcha/captchaImage：
> {"code":200,"msg":"获取验证码 - 操作成功","data":{"......}
> ```

##### 模拟失败

把 nexSM 根目录的 `license.lic` 重命名为 `license.lic.bak`，重启服务，重新访问：

```bash
# 授权文件放在测试路由之后，如下不受授权限制
http://localhost:3002/
# 授权文件放在主路由之前，如下受授权限制
http://localhost:3002/prod-api/v2/captcha/captchaImage
```

> ```
> http://localhost:3002/：
> {"code":200,"msg":"成功连接服务器","data":{"State":"Connected Success."},"timestamp":1787461689278}
> http://localhost:3002/prod-api/v2/captcha/captchaImage：
> {"code":403,"msg":"授权验证失败: 授权文件不存在或验证失败","data":{"type":"license_invalid"},"timestamp":1787462428394}
> ```

#### 授权接口

##### 环境配置

在`.env`中创建对应配置文件

```env
# 授权配置（Beehive License）
# 授权项目ID（必须与 Beehive 管理后台登记的项目ID一致）
LICENSE_PROJECT_ID=nex-sm-v2
# 授权文件路径（.lic 文件）
LICENSE_FILE_PATH=./license.lic
# RSA 公钥文件路径
LICENSE_PUBLIC_KEY_PATH=./public.pem
# 时间守卫文件路径（防时间回退）
LICENSE_TIME_GUARD_PATH=./.timeguard
# 授权服务器地址（联网时间校准用）
LICENSE_SERVER_URL=http://127.0.0.1:3100
# 严格模式：true=授权失败返回403，false=只警告不拦截
LICENSE_STRICT_MODE=true
# 授权文件最大大小（字节）
LICENSE_MAX_FILE_SIZE=1048576
```

##### 配置文件

创建`license.config.js`，用配置文件替换硬编码：

```js
/**
 * 授权配置
 * 统一管理 Beehive 授权 SDK 的配置项
 */
const path = require('path');

module.exports = {
  // 授权项目ID（必须与 Beehive 管理后台登记的项目ID一致）
  projectId: process.env.LICENSE_PROJECT_ID || 'nex-sm-v2',

  // 授权文件路径（.lic 文件）
  licensePath: process.env.LICENSE_FILE_PATH || path.join(__dirname, '../../license.lic'),

  // RSA 公钥文件路径（用于验证授权文件签名）
  publicKeyPath: process.env.LICENSE_PUBLIC_KEY_PATH || path.join(__dirname, '../../public.pem'),

  // 时间守卫文件路径（防时间回退，记录上次验证时间）
  timeGuardPath: process.env.LICENSE_TIME_GUARD_PATH || path.join(__dirname, '../../.timeguard'),

  // 授权服务器地址（联网时间校准用，Beehive 服务端地址）
  licenseServerUrl: process.env.LICENSE_SERVER_URL || 'http://127.0.0.1:3100',

  // 严格模式：授权失败时返回403；非严格模式只警告不拦截
  strictMode: process.env.LICENSE_STRICT_MODE !== 'false',

  // 授权中间件白名单：这些路径跳过授权校验（未授权时也能访问）
  whitelist: [
    '/prod-api/v2/license/import',
    '/prod-api/v2/license/status'
  ],

  // 授权文件上传限制
  upload: {
    // 最大文件大小（默认 1MB）
    maxSize: parseInt(process.env.LICENSE_MAX_FILE_SIZE) || 1 * 1024 * 1024,
    // 允许的文件扩展名
    allowedExtname: '.lic',
    // 上传字段名
    fieldName: 'file'
  }
};

```

##### 路由文件

| 文件                                        | 说明                            |
| ------------------------------------------- | ------------------------------- |
| `src/modules/license/license.controller.js` | 控制器：导入授权、查询授权状态  |
| `src/modules/license/license.route.js`      | 路由：POST /import、GET /status |

`modules/license/license.controller.js:`

```js
/**
 * 授权模块 - 控制器层
 * 负责授权文件导入、授权状态查询、机器ID查询、时间校准
 */
const fs = require('fs');
const path = require('path');
const { LicenseGuard } = require('../../../sdk');
const licenseConfig = require('../../config/license.config');

/**
 * 创建授权验证实例
 * @param {string} [customLicensePath] 自定义授权文件路径（用于验证临时文件）
 * @returns {LicenseGuard}
 */
function createGuard(customLicensePath) {
  return new LicenseGuard({
    projectId: licenseConfig.projectId,
    publicKey: fs.readFileSync(licenseConfig.publicKeyPath, 'utf8'),
    licensePath: customLicensePath || licenseConfig.licensePath,
    timeGuardPath: licenseConfig.timeGuardPath,
    licenseServerUrl: licenseConfig.licenseServerUrl,
    strictMode: licenseConfig.strictMode
  });
}

/**
 * 获取授权文件信息
 * @returns {Object|null}
 */
function getLicenseFileInfo() {
  try {
    if (!fs.existsSync(licenseConfig.licensePath)) {
      return null;
    }
    const stat = fs.statSync(licenseConfig.licensePath);
    return {
      path: licenseConfig.licensePath,
      size: stat.size,
      sizeFormatted: formatFileSize(stat.size),
      lastModified: stat.mtimeMs,
      fileName: path.basename(licenseConfig.licensePath)
    };
  } catch (e) {
    return null;
  }
}

/**
 * 获取时间守卫文件信息
 * @returns {Object|null}
 */
function getTimeGuardInfo() {
  try {
    if (!fs.existsSync(licenseConfig.timeGuardPath)) {
      return { exists: false, lastVerifiedAt: null };
    }
    const stat = fs.statSync(licenseConfig.timeGuardPath);
    const content = fs.readFileSync(licenseConfig.timeGuardPath, 'utf8');
    let lastVerifiedAt = null;
    try {
      const data = JSON.parse(content);
      lastVerifiedAt = data.lastVerifiedAt || data.timestamp || null;
    } catch (e) {
      // 解析失败，用文件修改时间
      lastVerifiedAt = stat.mtimeMs;
    }
    return {
      exists: true,
      path: licenseConfig.timeGuardPath,
      lastVerifiedAt,
      fileModifiedAt: stat.mtimeMs
    };
  } catch (e) {
    return { exists: false, lastVerifiedAt: null };
  }
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

class LicenseController {
  /**
   * 导入授权文件
   * POST /prod-api/v2/license/import
   */
  async importLicense(req, res, next) {
    try {
      if (!req.file) {
        return res.error('请上传授权文件');
      }

      // 检查文件扩展名
      const originalName = req.file.originalname || '';
      if (!originalName.endsWith(licenseConfig.upload.allowedExtname)) {
        return res.error(`授权文件格式错误，应为 ${licenseConfig.upload.allowedExtname} 文件`);
      }

      // 获取上传的文件内容
      const licenseContent = req.file.buffer.toString('utf8');

      // 先临时保存到一个临时文件，用于验证
      const tempPath = licenseConfig.licensePath + '.tmp';
      fs.writeFileSync(tempPath, licenseContent, 'utf8');

      // 用临时文件创建验证实例，验证授权有效性
      const tempGuard = createGuard(tempPath);
      const result = await tempGuard.check();

      if (!result.valid) {
        // 验证失败，删除临时文件
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        return res.error(`授权文件无效: ${result.reason}`);
      }

      // 验证通过，备份原有授权文件（如果存在）
      if (fs.existsSync(licenseConfig.licensePath)) {
        const backupPath = licenseConfig.licensePath + '.bak.' + Date.now();
        fs.copyFileSync(licenseConfig.licensePath, backupPath);
      }

      // 替换正式授权文件
      fs.copyFileSync(tempPath, licenseConfig.licensePath);
      fs.unlinkSync(tempPath);

      // 返回授权信息
      const lic = result.licenseData;
      return res.success({
        licenseId: lic.licenseId,
        projectId: lic.projectId,
        projectName: lic.projectName,
        licenseType: lic.licenseType,
        issuedAt: lic.issuedAt,
        expiresAt: lic.expiresAt,
        features: lic.features,
        maxUsers: lic.maxUsers,
        customer: lic.customer
      }, '授权文件导入成功');

    } catch (err) {
      next(err);
    }
  }

  /**
   * 查询当前授权状态（完整信息）
   * GET /prod-api/v2/license/status
   */
  async getLicenseStatus(req, res, next) {
    try {
      const guard = createGuard();
      const result = await guard.check();
      const currentMachineId = guard.getMachineId();
      const machineInfo = guard.getMachineInfo();
      const licenseFileInfo = getLicenseFileInfo();
      const timeGuardInfo = getTimeGuardInfo();

      if (result.valid) {
        const lic = result.licenseData;
        // 机器绑定状态
        const boundMachineId = lic.machineId || '';
        const machineBound = !!boundMachineId;
        const machineMatched = !machineBound || (boundMachineId === currentMachineId);

        return res.success({
          valid: true,
          // 授权基本信息
          licenseId: lic.licenseId,
          projectId: lic.projectId,
          projectName: lic.projectName,
          licenseType: lic.licenseType,
          issuedAt: lic.issuedAt,
          expiresAt: lic.expiresAt,
          features: lic.features,
          maxUsers: lic.maxUsers,
          customer: lic.customer,
          // 机器绑定信息
          machineId: currentMachineId,
          machineInfo: machineInfo,
          boundMachineId: boundMachineId,
          machineBound: machineBound,
          machineMatched: machineMatched,
          // 授权文件信息
          licenseFile: licenseFileInfo,
          // 时间守卫信息
          timeGuard: timeGuardInfo,
          // 服务器当前时间
          serverTime: Date.now()
        });
      } else {
        return res.success({
          valid: false,
          reason: result.reason,
          type: result.type,
          // 机器信息（即使授权无效也返回，方便用户绑定机器）
          machineId: currentMachineId,
          machineInfo: machineInfo,
          // 授权文件信息
          licenseFile: licenseFileInfo,
          // 时间守卫信息
          timeGuard: timeGuardInfo,
          // 服务器当前时间
          serverTime: Date.now()
        });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * 获取当前服务器机器ID
   * GET /prod-api/v2/license/machine-id
   */
  async getMachineId(req, res, next) {
    try {
      const guard = createGuard();
      const machineId = guard.getMachineId();
      const machineInfo = guard.getMachineInfo();
      return res.success({
        machineId: machineId,
        machineInfo: machineInfo
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 手动触发联网时间校准
   * POST /prod-api/v2/license/sync-time
   */
  async syncTime(req, res, next) {
    try {
      const guard = createGuard();
      const beforeTime = Date.now();
      const result = await guard.syncTime();

      if (result.ok) {
        const afterTime = Date.now();
        return res.success({
          ok: true,
          beforeTime: beforeTime,
          afterTime: afterTime,
          drift: result.drift || 0,
          serverTime: result.serverTime || null,
          message: result.reason || '时间校准成功'
        }, '时间校准成功');
      } else {
        return res.error(`时间校准失败: ${result.reason}`);
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * 下载当前授权文件
   * GET /prod-api/v2/license/download
   */
  async downloadLicense(req, res, next) {
    try {
      if (!fs.existsSync(licenseConfig.licensePath)) {
        return res.error('授权文件不存在');
      }
      const fileName = path.basename(licenseConfig.licensePath);
      res.download(licenseConfig.licensePath, fileName);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LicenseController();

```

`modules/license/license.route.js:`

```js
/**
 * 授权模块 - 路由层
 * 自动注册到 /prod-api/v2/license 前缀下
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const licenseController = require('./license.controller');
const licenseConfig = require('../../config/license.config');
const { requireAuth, requireRole } = require('../../middleware/auth.middleware');
const { USER_ROLE } = require('../../constants/statusCode');

// 配置 multer 内存存储（授权文件不需要保存到 uploads，直接在 controller 里处理）
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: licenseConfig.upload.maxSize
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith(licenseConfig.upload.allowedExtname)) {
      cb(null, true);
    } else {
      cb(new Error(`只允许上传 ${licenseConfig.upload.allowedExtname} 授权文件`));
    }
  }
});

// ==================== 公开接口（无需登录） ====================

/**
 * 导入授权文件（公开接口，无需登录）
 * POST /prod-api/v2/license/import
 */
router.post('/import', upload.single(licenseConfig.upload.fieldName), licenseController.importLicense);

/**
 * 查询当前授权状态（公开接口，无需登录）
 * GET /prod-api/v2/license/status
 */
router.get('/status', licenseController.getLicenseStatus);

// ==================== 需要登录的接口 ====================

router.use(requireAuth);

/**
 * 获取当前服务器机器ID（需登录）
 * GET /prod-api/v2/license/machine-id
 */
router.get('/machine-id', licenseController.getMachineId);

/**
 * 手动触发联网时间校准（需登录）
 * POST /prod-api/v2/license/sync-time
 */
router.post('/sync-time', licenseController.syncTime);

// ==================== 仅管理员接口 ====================

router.use(requireRole(USER_ROLE.ADMINISTRATOR));

/**
 * 下载当前授权文件（仅管理员）
 * GET /prod-api/v2/license/download
 */
router.get('/download', licenseController.downloadLicense);

module.exports = router;

```

| 接口          | 方法 | 权限     | 说明                                 |
| ------------- | ---- | -------- | ------------------------------------ |
| `/import`     | POST | 公开     | 导入授权文件（不变）                 |
| `/status`     | GET  | 公开     | 查询授权状态（不变，返回内容扩展了） |
| `/machine-id` | GET  | 需登录   | 获取当前服务器机器 ID                |
| `/sync-time`  | POST | 需登录   | 手动触发联网时间校准                 |
| `/download`   | GET  | 仅管理员 | 下载当前授权文件                     |

##### 项目导入

在`app.js`中使用配置文件并

```js
// 总路由
const router = require('@routes/router.js');
const testRouter = require("@routes/testRouter.js");

// 新增 - Beehive 授权验证
const { LicenseGuard } = require('./sdk');
const licenseConfig = require('./src/config/license.config');
const licenseGuard = new LicenseGuard({
  projectId: licenseConfig.projectId,
  publicKey: fs.readFileSync(licenseConfig.publicKeyPath, 'utf8'),
  licensePath: licenseConfig.licensePath,
  timeGuardPath: licenseConfig.timeGuardPath,
  licenseServerUrl: licenseConfig.licenseServerUrl,
  strictMode: licenseConfig.strictMode
});

// 跨域
app.use(cors());

......
// 测试路由
app.use("/", testRouter);

// 新增 - 授权验证中间件（主业务接口全部受保护）
app.use((req, res, next) => {
  // 白名单路径直接放行（未授权时也能导入授权、查询状态）
  if (licenseConfig.whitelist.some(p => req.path.startsWith(p))) {
    return next();
  }
  licenseGuard.middleware()(req, res, next);
});

// 使用路由
app.use(router);
```

#### 测试方法

| 接口                                  | 测试方式               | 预期                                                         |
| ------------------------------------- | ---------------------- | ------------------------------------------------------------ |
| `GET /prod-api/v2/license/status`     | 浏览器直接访问         | 返回授权完整信息（valid、machineId、licenseFile、timeGuard 等） |
| `POST /prod-api/v2/license/import`    | Postman 上传 .lic 文件 | 返回授权信息                                                 |
| `GET /prod-api/v2/license/machine-id` | 需带 token 访问        | 返回机器 ID 和机器信息                                       |
| `POST /prod-api/v2/license/sync-time` | 需带 token             | 返回时间校准结果                                             |
| `GET /prod-api/v2/license/download`   | 需管理员 token         | 下载 .lic 文件                                               |

>  最简单的是先测 `/status`，浏览器直接访问就能看到返回的完整 JSON。

### 前端项目

前端主要的目的是为了更好地体验和对实际操作的实现。

#### 安装依赖

先把项目的依赖装上，确保它们本身能跑起来，这是后续集成的基础。

```bash
cd F:\CodingMan\Code2Git\03-Project_00\00-project00\03-Beehive\demo\nexCM-V2_04
npm install
```

#### 创建文件

##### 路径常量

在`src/router/pathConstants.js`中添加`LICENSE_IMPORT: '/license/import'` 路径常量，在软件授权失效时，无需登录：

`pathConstants.js:`

```js
/** 路由路径常量 */
export const ROUTE_PATHS = {
  /** 原有内容保留 */ 
  /** 授权导入页（软件授权失效时跳转，无需登录） */
  LICENSE_IMPORT: '/license/import'
}
```

##### 路由名单

在`src/router/constants.js`中授权导入页加入路由白名单（无需登录）:

```js
import { ROUTE_PATHS } from './pathConstants'

// 路由白名单：不需要登录就能访问的页面
// 没有 token 时，仅允许直接访问白名单内页面；其他页面强制跳登录
// 注意：与 axios 的 NO_TOKEN_API（接口白名单）完全不同
export const ROUTE_WHITE_LIST = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.LICENSE_IMPORT]
```

##### 静态路由

在`src/router/constantRoutes.js`中授权导入页加入路由白名单（无需登录）：

`src/router/constantRoutes.js:`

```js
/**
 * ==========================================
 * 静态路由（无需权限，所有人可访问）
 * ==========================================
 * 登录页、404、主布局等基础路由
 * meta.titles 为面包屑层级数组，TagsView 取最后一项作为标签标题
 */
import Layout from '@/Layout/index.vue'
import { ROUTE_PATHS } from './pathConstants'

export const constantRoutes = [
  {
    path: ROUTE_PATHS.LICENSE_IMPORT,
    name: 'LicenseImport',
    component: () => import('@/views/license/LicenseImport.vue'),
    hidden: true,
    meta: { titles: ['授权导入'] }
  },
  // 404 兜底必须放最后
  { path: '*', redirect: ROUTE_PATHS.NOT_FOUND, hidden: true }
]
```

##### 授权封装

新增`src/api/license.js`,授权 API 封装：

```js
/**
 * 授权管理 API
 * 与后端 /prod-api/v2/license 接口对应
 */
import request from '@/utils/request'

/**
 * 查询当前授权状态
 * GET /prod-api/v2/license/status
 * @returns {Promise<{valid: boolean, licenseId?: string, expiresAt?: number, reason?: string}>}
 */
export function getLicenseStatus() {
  return request({
    url: '/license/status',
    method: 'get'
  })
}

/**
 * 导入授权文件
 * POST /prod-api/v2/license/import
 * @param {File} file .lic 授权文件
 * @returns {Promise<Object>} 授权详细信息
 */
export function importLicense(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/license/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // 授权导入接口不需要 token（未授权时也能导入）
    // 通过 NO_TOKEN_API 白名单机制处理
    timeout: 30000
  })
}
```

##### 无需token

`src/utils/constants.js`授权接口加入 `NO_TOKEN_API` 白名单（无需 token）:

```js
/** 不需要 token 的接口白名单 */
export const NO_TOKEN_API = ['/user/login', '/captcha/captchaImage', '/license/status', '/license/import']
```

##### 授权页面

创建`src/views/license/LicenseImport.vue`授权导入页面（现代化 UI，拖拽上传，授权状态展示）:

授权导入页面（左右分栏布局，左侧品牌信息，右侧表单）：

- 当前授权状态卡片（有效 / 无效）
- 拖拽上传区域（el-upload drag）
- 已选择文件展示（文件名、大小、移除按钮）
- 导入成功后授权信息展示（el-descriptions）
- 操作按钮（导入授权、进入系统、刷新状态）

```vue
<template>
  <div class="license-import-page">
    <div class="license-bg"></div>

    <div class="license-container">
      <!-- 左侧：品牌信息 -->
      <div class="brand-panel">
        <div class="brand-logo">🔐</div>
        <h1 class="brand-title">软件授权管理</h1>
        <p class="brand-desc">Beehive License Manager</p>
        <div class="brand-features">
          <div class="feature-item">
            <i class="el-icon-lock"></i>
            <span>RSA 非对称签名</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-time"></i>
            <span>防时间回退</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-monitor"></i>
            <span>机器指纹绑定</span>
          </div>
        </div>
      </div>

      <!-- 右侧：授权导入表单 -->
      <div class="form-panel">
        <h2 class="form-title">
          <i class="el-icon-document-checked"></i>
          导入授权文件
        </h2>

        <!-- 当前授权状态 -->
        <div v-if="licenseStatus" class="status-card" :class="{ valid: licenseStatus.valid, invalid: !licenseStatus.valid }">
          <div class="status-icon">
            <i :class="licenseStatus.valid ? 'el-icon-success' : 'el-icon-warning'"></i>
          </div>
          <div class="status-info">
            <div class="status-label">{{ licenseStatus.valid ? '授权有效' : '授权无效' }}</div>
            <div v-if="licenseStatus.valid" class="status-detail">
              过期时间：{{ formatTime(licenseStatus.expiresAt) }}
            </div>
            <div v-else class="status-detail error">
              {{ licenseStatus.reason }}
            </div>
          </div>
        </div>

        <!-- 上传区域 -->
        <el-upload
          class="license-upload"
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
          accept=".lic"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将 <em>.lic</em> 授权文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            仅支持 .lic 格式的授权文件，最大 1MB
          </div>
        </el-upload>

        <!-- 授权信息展示（导入成功后） -->
        <div v-if="importedLicense" class="license-info-card">
          <div class="info-header">
            <i class="el-icon-circle-check"></i>
            <span>授权导入成功</span>
          </div>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="授权ID">{{ importedLicense.licenseId }}</el-descriptions-item>
            <el-descriptions-item label="项目">{{ importedLicense.projectName }}</el-descriptions-item>
            <el-descriptions-item label="授权类型">{{ licenseTypeLabel(importedLicense.licenseType) }}</el-descriptions-item>
            <el-descriptions-item label="签发时间">{{ formatTime(importedLicense.issuedAt) }}</el-descriptions-item>
            <el-descriptions-item label="过期时间">{{ formatTime(importedLicense.expiresAt) }}</el-descriptions-item>
            <el-descriptions-item label="最大用户数">{{ importedLicense.maxUsers || '不限' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button
            type="primary"
            size="medium"
            :loading="importing"
            :disabled="!selectedFile"
            @click="handleImport"
          >
            <i class="el-icon-upload2"></i>
            导入授权
          </el-button>
          <el-button
            v-if="importedLicense"
            type="success"
            size="medium"
            @click="handleGoHome"
          >
            <i class="el-icon-house"></i>
            进入系统
          </el-button>
          <el-button
            size="medium"
            @click="handleRefreshStatus"
          >
            <i class="el-icon-refresh"></i>
            刷新状态
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLicenseStatus, importLicense } from '@/api/license'
import { ROUTE_PATHS } from '@/router/pathConstants'

export default {
  name: 'LicenseImport',
  data() {
    return {
      licenseStatus: null,
      selectedFile: null,
      importing: false,
      importedLicense: null
    }
  },
  created() {
    this.loadStatus()
  },
  methods: {
    /**
     * 加载当前授权状态
     */
    async loadStatus() {
      try {
        const res = await getLicenseStatus()
        this.licenseStatus = res.data
      } catch (e) {
        this.licenseStatus = { valid: false, reason: '无法获取授权状态，请检查后端服务' }
      }
    },

    /**
     * 刷新授权状态
     */
    handleRefreshStatus() {
      this.importedLicense = null
      this.loadStatus()
    },

    /**
     * 文件选择变化
     */
    handleFileChange(file) {
      this.selectedFile = file.raw
      this.importedLicense = null
    },

    /**
     * 导入授权文件
     */
    async handleImport() {
      if (!this.selectedFile) {
        this.$message.warning('请先选择授权文件')
        return
      }

      this.importing = true
      try {
        const res = await importLicense(this.selectedFile)
        this.importedLicense = res.data
        this.$message.success('授权文件导入成功')
        // 刷新状态
        await this.loadStatus()
      } catch (e) {
        // 错误已在拦截器提示
      } finally {
        this.importing = false
      }
    },

    /**
     * 进入系统（跳转到首页或登录页）
     */
    handleGoHome() {
      // 如果有 token 跳首页，没有跳登录
      const token = this.$store?.state?.user?.token
      if (token) {
        this.$router.push(ROUTE_PATHS.HOME)
      } else {
        this.$router.push(ROUTE_PATHS.LOGIN)
      }
    },

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp) return '永久有效'
      const d = new Date(timestamp)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },

    /**
     * 授权类型标签
     */
    licenseTypeLabel(type) {
      const map = {
        trial: '试用版',
        standard: '标准版',
        enterprise: '企业版',
        perpetual: '永久版'
      }
      return map[type] || type
    }
  }
}
</script>

<style lang="less" scoped>
.license-import-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.license-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.license-container {
  display: flex;
  width: 900px;
  max-width: 90vw;
  min-height: 560px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* 左侧品牌面板 */
.brand-panel {
  width: 360px;
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  padding: 48px 36px;
  display: flex;
  flex-direction: column;
}

.brand-logo {
  font-size: 56px;
  margin-bottom: 20px;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.brand-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 40px 0;
}

.brand-features {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);

  i {
    font-size: 18px;
    color: #667eea;
  }
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #667eea;
  }
}

/* 授权状态卡片 */
.status-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 20px;

  &.valid {
    background: #f0f9eb;
    border: 1px solid #e1f3d8;
    .status-icon i { color: #67c23a; }
    .status-label { color: #67c23a; }
  }

  &.invalid {
    background: #fef0f0;
    border: 1px solid #fde2e2;
    .status-icon i { color: #f56c6c; }
    .status-label { color: #f56c6c; }
  }
}

.status-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.status-detail {
  font-size: 12px;
  color: #909399;

  &.error {
    color: #f56c6c;
  }
}

/* 上传区域 */
.license-upload {
  margin-bottom: 20px;

  ::v-deep .el-upload-dragger {
    padding: 24px;
    border-radius: 10px;
    transition: all 0.3s;

    &:hover {
      border-color: #667eea;
    }
  }

  ::v-deep .el-upload__text {
    font-size: 14px;
    color: #606266;

    em {
      color: #667eea;
      font-style: normal;
    }
  }

  ::v-deep .el-upload__tip {
    font-size: 12px;
    color: #c0c4cc;
    margin-top: 8px;
  }
}

/* 授权信息卡片 */
.license-info-card {
  margin-bottom: 20px;
  border: 1px solid #e1f3d8;
  border-radius: 10px;
  overflow: hidden;
}

.info-header {
  background: #f0f9eb;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 操作按钮 */
.form-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;
  padding-top: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .license-container {
    flex-direction: column;
    width: 95vw;
  }

  .brand-panel {
    width: 100%;
    padding: 32px 24px;
  }

  .form-panel {
    padding: 28px 24px;
  }
}
</style>

```

##### 自动跳转

创建`src/utils/request.js`，在403 授权失败自动跳转到授权导入页：

- 新增 `isLicenseRedirecting` 标志位（防重复跳转）
- error 处理中新增 403 授权失败判断：

```js
if (status === 403) {
  const isLicenseError = resData.msg?.includes('授权') || resData.data?.type?.includes('license')
  if (isLicenseError) {
    showWarning('软件授权已失效，请导入授权文件')
    setTimeout(() => router.push(ROUTE_PATHS.LICENSE_IMPORT), 800)
  }
}
```

##### 路由守卫

修改 `src/router/permission.js`

- 引入 `getLicenseStatus` API
- 新增 `licenseCache` 缓存变量（只检查一次，避免每次路由跳转都调接口）
- 新增 `resetLicenseCache()` 导出方法（导入成功后调用）
- 路由守卫**最前面**加授权检查（优先于登录检查）：

```js
if (to.path === ROUTE_PATHS.LICENSE_IMPORT) return next()
const valid = await checkLicense()
if (!valid) return next(ROUTE_PATHS.LICENSE_IMPORT)
```

## API 列表

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/health | 健康检查 |
| GET | /api/time | 服务器时间（客户端校准用，无需鉴权） |
| GET | /api/license/types | 授权类型列表 |
| GET | /api/license/machine-id | 当前服务器机器ID |
| GET | /api/license/list | 授权文件列表 |
| POST | /api/license/generate | 生成授权文件 |
| POST | /api/license/parse | 解析授权文件 |
| POST | /api/license/validate | 验证授权有效性 |
| GET | /api/license/public-key | 获取公钥 |
| DELETE | /api/license/:fileName | 删除授权文件 |
| GET | /api/project | 项目列表 |
| POST | /api/project | 新增项目 |
| PUT | /api/project/:id | 更新项目 |
| DELETE | /api/project/:id | 删除项目 |

# 模板授权

以下为模板已经具备，直接应用于其他项目，不对模板的实现进行讲解和说明。

## 后端集成

### 拷贝资源

#### SDK资源

将模板中`beehive/sdk/`拷贝到项目根目录`beehive/sdk`中：

```bash
# 拷贝 SDK 目录
cp -r Backend/sdk /your-project/beehive/sdk
```

#### 环境变量

将模板中的`env`中的如下代码拷贝到项目根目录下的`env`中：

```env
# 授权配置（Beehive License） 
# 授权项目ID（必须与 Beehive 管理后台登记的项目ID一致）
LICENSE_PROJECT_ID=nex-sm-v2
# 授权文件路径（.lic 文件）
LICENSE_FILE_PATH=./beehive/license/license.lic
# RSA 公钥文件路径
LICENSE_PUBLIC_KEY_PATH=./beehive/public/public.pem
# 时间守卫文件路径（防时间回退）
LICENSE_TIME_GUARD_PATH=./beehive/time/.timeguard
# 严格模式：true=授权失败返回403，false=只警告不拦截
LICENSE_STRICT_MODE=true
# 授权文件最大大小（字节）
LICENSE_MAX_FILE_SIZE=1048576
```

#### 公钥文件

将模板中的`beehive/public/public.pem`拷贝到项目：

```bash
# 拷贝公钥
cp Backend/beehive/public/public.pem  /your-project/beehive/public/public.pem
```

#### 授权文件

将生成的`license.lic`拷贝到项目：

```bash
# 拷贝授权文件
cp license.lic  /your project/beehive/license/
```

#### 授权配置

将模板中的`src/config/license.config.js`拷贝到项目：

```bash
# 拷贝授权配置
cp Backend/src/config/license.config.js /your-project/src/config/
```

#### 上传模块

将模板中的`src/config/upload.config.js`拷贝到项目：

```bash
# 拷贝上传模块，若有对应功能和模块，可忽略
cp Backend/src/config/upload.config.js /your-project/src/config/
```

#### 授权路由

将模板中的`src/modules/license`拷贝到项目：

```bash
# 拷贝授权路由
cp -r Backend/src/modules/license /your-project/src/modules/
```

#### 上传路由

将模板中的`src/modules/upload`拷贝到项目：

```bash
# 拷贝上传路由
cp -r Backend/src/modules/upload /your-project/src/modules/
```

#### 上传中间件

将模板中的`src/middleware/upload.middleware.js`拷贝到项目：

```bash
# 拷贝上传中间件
cp -r Backend/src/middleware/upload.middleware.js /your-project/src/middleware/
```

### 静态资源

参考 `Backend/app.js`，在入口文件中添加：

```js
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

```

### 安装依赖

```bash
npm install axios uuid dayjs
```

### 入口文件

参考 `Backend/app.js`，在入口文件中添加：

```js
const fs = require("fs");
const { LicenseGuard } = require("./beehive/sdk");

// 新增 - Beehive 授权验证
const { LicenseGuard } = require("./beehive/sdk");
const licenseConfig = require("./src/config/license.config");
const licenseGuard = new LicenseGuard({
  projectId: licenseConfig.projectId,
  publicKey: fs.readFileSync(licenseConfig.publicKeyPath, "utf8"),
  licensePath: licenseConfig.licensePath,
  timeGuardPath: licenseConfig.timeGuardPath,
  licenseServerUrl: licenseConfig.licenseServerUrl,
  strictMode: licenseConfig.strictMode,
});

// 新增 - 授权验证中间件（白名单路径跳过授权校验）
app.use((req, res, next) => {
  // 白名单路径直接放行（未授权时也能导入授权、查询状态）
  if (licenseConfig.whitelist.some((p) => req.path.startsWith(p))) {
    return next();
  }
  licenseGuard.middleware()(req, res, next);
});
```

> 1. 若路由需要自输入，按照如下在对应的文件内加入
>
> ```js
> // 注册授权路由
> app.use('/prod-api/v2/license', require('./src/modules/license/license.route'));
> ```
>
> 2. 若路由自扫码，则不需要处理授权路有问题

## 前端集成

### 拷贝资源

#### API 封装

将模板中的`src/api/ulicense.js`拷贝到项目：

```bash
# API 封装
cp Frontend/src/api/license.js /your-project/src/api/
```

#### 授权配置

将模板中的`src/config/license.config.js`拷贝到项目：

```bash
# API 封装
cp Frontend/src/api/license.js /your-project/src/api/
```

#### 授权页面

将模板中的`src/views/license`拷贝到项目：

```bash
# 授权页面
cp -r Frontend/src/views/license /your-project/src/views/
```

### 合并修改

#### 路径常量

将`src/router/pathConstants.js`中新增 `LICENSE_IMPORT` 路径常量如下：
```js
/** 路由路径常量 */
export const ROUTE_PATHS = {
  /** 授权导入页（软件授权失效时跳转，无需登录） */
  LICENSE_IMPORT: '/license/import'
}
```

#### 路由白名单

将`src/router/constants.js`中授权导入页加入路由白名单：

```js
// ROUTE_PATHS.LICENSE_IMPORT 为新增字段
export const ROUTE_WHITE_LIST = [ROUTE_PATHS.LOGIN, ROUTE_PATHS.LICENSE_IMPORT]
```

#### 静态路由

将`src/router/constantRoutes.js`中新增授权导入页和授权管理页静态路由：

```js
export const constantRoutes = [      {
        path: 'system/licenseManage',
        name: 'SystemLicense',
        component: () => import('@/views/license/LicenseManage.vue'),
        hidden: true,
        meta: { titles: ['授权管理'], roles: ['administrator'] }
      },
      {
        path: 'system/licenseImport',
        name: 'LicenseImport',
        component: () => import('@/views/license/LicenseImport.vue'),
        hidden: true,
        meta: { titles: ['授权导入'] }
      },
]
```

#### 路由守卫

将`src/router/permission.js`路由守卫先检查授权状态：

```js
import { getLicenseStatus } from '@/api/license'
const whiteList = ROUTE_WHITE_LIST || [ROUTE_PATHS.LOGIN]

/**
 * 授权状态缓存
 * null = 未检查, true = 授权有效, false = 授权失效
 * 只在应用启动时检查一次，避免每次路由跳转都调用接口
 * 导入授权成功后需调用 resetLicenseCache() 重置
 */
let licenseCache = null

/**
 * 重置授权缓存（导入授权成功后调用）
 */
export function resetLicenseCache() {
  licenseCache = null
}

/**
 * 检查授权状态（带缓存）
 * @returns {Promise<boolean>} 是否授权有效
 */
async function checkLicense() {
  if (licenseCache !== null) {
    return licenseCache
  }
  try {
    const res = await getLicenseStatus()
    licenseCache = res.data?.valid === true
    return licenseCache
  } catch (e) {
    // 接口请求失败（如后端未启动），默认视为授权有效，避免无法使用
    licenseCache = true
    return true
  }
}

router.beforeEach(async (to, from, next) => {
    ......
      // 授权检查（优先于登录检查）
  // 授权导入页本身放行
  if (to.path === ROUTE_PATHS.LICENSE_IMPORT) {
    return next()
  }

  // 检查授权状态，失效则跳授权导入页
  const valid = await checkLicense()
  if (!valid) {
    return next(ROUTE_PATHS.LICENSE_IMPORT)
  }

  const hasToken = getToken()

  // 未登录
  if (!hasToken) {....
```

#### 无需认证

`src/utils/constants.js` — 授权接口加入 `NO_TOKEN_API` 白名单：

```js
/** 不需要 token 的接口白名单 */
export const NO_TOKEN_API = ['/user/login', '/captcha/captchaImage','/license/status', '/license/import']

```

#### 自动跳转

`src/utils/request.js` — 403授权失败自动跳转授权导入页，blob响应跳过业务码判断:

```js
/**
 * 是否正在跳转授权导入页
 * 防止多个请求同时 403 时重复跳转
 */
let isLicenseRedirecting = false

/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
service.interceptors.response.use(......
        // Blob 响应（文件下载）直接返回，不做业务码判断
    if (response.config.responseType === 'blob') {
      return response
    }
......
    // HTTP 层错误（网络异常、404、500 等）
    if (!error.response) {
      showError(config.MESSAGES.NETWORK_ERROR)
    } else {
      const status = error.response.status

      // 403 授权失效：跳转到授权导入页面（区分业务码权限不足）
      if (status === 403) {
        const resData = error.response.data || {}
        // 判断是否是授权相关的403（msg 包含"授权"或 data.type 包含 license）
        const isLicenseError = resData.msg?.includes('授权') ||
          resData.data?.type?.includes('license') ||
          resData.data?.type === 'time_rollback'

        if (isLicenseError && !isLicenseRedirecting) {
          isLicenseRedirecting = true
          showWarning('软件授权已失效，请导入授权文件')
          // 延迟跳转，让用户看到提示
          setTimeout(() => {
            const router = require('@/router/index.js').default
            // 如果当前已经在授权导入页，不重复跳转
            if (router.currentRoute.path !== ROUTE_PATHS.LICENSE_IMPORT) {
              router.push(ROUTE_PATHS.LICENSE_IMPORT)
            }
            isLicenseRedirecting = false
          }, 800)
        } else if (!isLicenseError) {
          // 非授权类403（如权限不足），按普通错误处理
          const message = config.HTTP_ERRORS[status] || `请求错误 ${status}`
          showError(message)
        }
        return Promise.reject(error)
      }

      const message = config.HTTP_ERRORS[status] || `请求错误 ${status}`
      showError(message)
    }
```

### 授权接口

| 方法 | 路径                              | 权限     | 说明                 |
| ---- | --------------------------------- | -------- | -------------------- |
| POST | `/prod-api/v2/license/import`     | 公开     | 导入授权文件         |
| GET  | `/prod-api/v2/license/status`     | 公开     | 查询授权状态         |
| GET  | `/prod-api/v2/license/machine-id` | 需登录   | 获取服务器机器ID     |
| POST | `/prod-api/v2/license/sync-time`  | 需登录   | 手动触发联网时间校准 |
| GET  | `/prod-api/v2/license/download`   | 仅管理员 | 下载当前授权文件     |

## 注意事项

1. **公钥一致性**：`public.pem` 必须从 Beehive 管理后台下载，确保与生成授权文件的服务端密钥对一致
2. **AES 密钥**：Beehive 服务端的 AES 密钥必须保持不变，否则旧授权文件无法解密。启动服务端前确认环境变量 `AES_KEY` 未被篡改
3. **项目ID**：授权文件中的 `projectId` 必须与项目配置的 `projectId` 一致
4. **时间防护**：首次运行会自动生成 `.timeguard` 文件，防止客户端修改系统时间
5. **严格模式**：`strictMode=true` 时授权失败返回403；`false` 时只警告不拦截









