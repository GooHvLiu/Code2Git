require("module-alias/register");
require("dotenv-expand").expand(require("dotenv").config());
var express = require("express");
const cors = require("cors");
var path = require("path");
const fs = require("fs");
const app = express();
const appConfig = require('./src/config/app.config.js');

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

// 中间件
const responseMiddleware = require('./src/middleware/response.middleware.js');
const loggerMiddleware = require('./src/middleware/logger.middleware.js');
const { errorHandler, notFoundHandler } = require('./src/middleware/error.middleware.js');

// 总路由
const router = require('@routes/router.js');
const testRouter = require("@routes/testRouter.js");

// PLC 模块初始化
const plcModule = require('./src/plc/index')
const { manager, pollTask, plcSetting, plcTagMap } = plcModule

// 跨域
app.use(cors());

// 解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 统一响应格式 res.success和res.error
app.use(responseMiddleware);

// 请求日志
app.use(loggerMiddleware);

// 静态资源
app.use('/public', express.static(path.join(__dirname, './public')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// 使用路由
app.use("/", testRouter);

// 新增 - 授权验证中间件（白名单路径跳过授权校验）
app.use((req, res, next) => {
  // 白名单路径直接放行（未授权时也能导入授权、查询状态）
  if (licenseConfig.whitelist.some(p => req.path.startsWith(p))) {
    return next();
  }
  licenseGuard.middleware()(req, res, next);
});

app.use(router);


// 404 处理
app.use(notFoundHandler);

// 全局错误处理（必须放在最后）
app.use(errorHandler);

// 启动服务
const PORT = appConfig.port;
const HOST = appConfig.host;

// PLC 模块初始化：注册默认设备、连接、开启轮询
async function initPlcModule() {
  try {
    // 初始化配置的多设备
    plcModule.initDevices()

    // 如果没有配置多设备，注册默认设备（单设备兼容模式）
    if (manager.size === 0) {
      manager.registerDevice('default', plcSetting, plcTagMap)
    }

    // 连接所有设备
    const results = await manager.connectAll()
    const connectedCount = Object.values(results).filter(r => r.success).length

    // 开启轮询
    if (plcSetting.enablePoll) {
      pollTask.start()
    }

    console.log(`✅ PLC模块初始化完成，设备数: ${manager.size}，已连接: ${connectedCount}`)
  } catch (err) {
    console.error('❌ PLC初始化失败：', err.message)
    console.log('   提示：请检查 .env 中的 PLC_HOST / PLC_PORT 配置，或确认PLC已开机')
  }
}
initPlcModule()

// 网络监听
app.listen(PORT, HOST, () => {
  console.log('\n========================================');
  console.log(`🚀 服务启动成功`);
  console.log(`📍 地址: http://${HOST}:${PORT}`);
  console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================\n');
});

module.exports = app;
