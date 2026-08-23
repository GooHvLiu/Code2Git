# Beehive授权验证 SDK

供被保护的 Node.js 项目（如 nexSM）集成使用，实现授权文件验证、防时间回退、联网时间校准。

## 安装

将 `sdk/` 目录复制到你的项目中，或通过本地路径引用：

```js
const { LicenseGuard } = require('./sdk');
```

## 快速开始

```js
const express = require('express');
const fs = require('fs');
const { LicenseGuard } = require('./sdk');

const app = express();

// 1. 初始化授权守卫
const guard = new LicenseGuard({
  projectId: 'nex-sm-v2',                          // 你的项目ID（必须与授权文件一致）
  publicKey: fs.readFileSync('./public.pem', 'utf8'), // 从授权服务器获取的公钥
  licensePath: './license.lic',                     // 客户端导入的授权文件路径
  timeGuardPath: './.timeguard',                    // 时间守卫文件路径（防回退）
  licenseServerUrl: 'http://your-license-server:3100', // 授权服务器地址（联网校准用）
  requiredFeatures: ['api_service', 'auth'],        // 可选：必需的功能模块
  strictMode: true                                   // 严格模式：验证失败返回403
});

// 2. 全局授权中间件（放在所有路由之前）
app.use(guard.middleware());

// 3. 你的业务路由
app.get('/api/users', (req, res) => {
  // req.license 包含授权信息
  res.json({ code: 200, msg: 'ok', license: req.license });
});

app.listen(3000);
```

## API 文档

### LicenseGuard

#### constructor(options)

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| projectId | string | 是 | 被保护项目ID，必须与授权文件一致 |
| publicKey | string | 是 | RSA公钥（PEM格式），从授权服务器获取 |
| licensePath | string | 是 | 授权文件(.lic)路径 |
| timeGuardPath | string | 是 | 时间守卫文件路径，防时间回退 |
| licenseServerUrl | string | 否 | 授权服务器地址，用于联网时间校准 |
| aesKey | string | 否 | AES密钥，必须与服务端一致（默认内置） |
| aesIv | string | 否 | AES IV，必须与服务端一致 |
| requiredFeatures | string[] | 否 | 必需功能列表，缺少则授权失败 |
| strictMode | boolean | 否 | 严格模式，默认true（失败返回403） |

#### async check()

手动执行完整授权检查，返回 `{ valid, reason, licenseData }`。

#### middleware()

返回 Express 中间件，验证通过挂载 `req.license`，失败返回403。

#### async syncTime()

手动触发联网时间校准。

#### reloadLicense()

清除授权文件缓存，导入新授权后调用。

#### getMachineId()

获取当前机器的唯一指纹ID（64位SHA256哈希）。

## 授权文件导入接口示例

在你的项目中提供一个授权文件导入接口：

```js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/license/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.json({ code: 400, msg: '请选择授权文件' });
  
  // 将上传的文件移动到授权路径
  const fs = require('fs');
  fs.renameSync(req.file.path, './license.lic');
  
  // 重新加载授权
  guard.reloadLicense();
  
  // 验证授权
  const result = await guard.check();
  if (result.valid) {
    res.json({ code: 200, msg: '授权导入成功', data: result.licenseData });
  } else {
    res.json({ code: 403, msg: `授权验证失败: ${result.reason}` });
  }
});
```

## 安全说明

1. **公钥分发**：`public.pem` 可以随客户端分发，不涉及安全问题
2. **私钥保管**：`private.pem` 必须保存在授权服务器，绝不能泄露
3. **时间守卫文件**：`.timeguard` 是加密的，用户无法手动篡改
4. **机器绑定**：启用机器绑定后，授权文件无法拷贝到其他机器使用
5. **AES密钥**：生产环境建议通过环境变量注入，不要硬编码
