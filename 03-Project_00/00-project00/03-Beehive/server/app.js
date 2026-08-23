/**
 * BeehiveTools 授权加密工具 - 后端服务入口
 *
 * 功能：
 * 1. 授权文件生成/管理（RSA签名 + AES加密）
 * 2. 机器指纹绑定
 * 3. 时间校准API（防客户端时间回退）
 * 4. 项目管理
 * 5. 公钥分发
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const responseMiddleware = require('./utils/response');

// 路由
const licenseRoutes = require('./routes/license');
const timeRoutes = require('./routes/time');
const projectRoutes = require('./routes/project');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// 静态资源：授权文件下载
app.use('/licenses', express.static(config.licensesDir));

// 路由
app.use('/api/license', licenseRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/project', projectRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.success({
    status: 'ok',
    service: 'BeehiveTools License Server',
    version: '1.0.0',
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, msg: '接口不存在', data: null, timestamp: Date.now() });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ code: 500, msg: '服务器内部错误', data: null, timestamp: Date.now() });
});

// 启动
app.listen(config.port, config.host, () => {
  console.log('\n========================================');
  console.log('  🐝 BeehiveTools 授权服务启动成功');
  console.log('========================================');
  console.log(`  📍 地址: http://${config.host}:${config.port}`);
  console.log(`  📦 环境: ${config.env}`);
  console.log(`  🔑 密钥目录: ${config.keysDir}`);
  console.log(`  📄 授权目录: ${config.licensesDir}`);
  console.log('========================================');
  console.log('  API 列表:');
  console.log('    GET  /api/health          - 健康检查');
  console.log('    GET  /api/time            - 服务器时间（客户端校准用）');
  console.log('    GET  /api/license/types   - 授权类型列表');
  console.log('    GET  /api/license/list    - 授权文件列表');
  console.log('    POST /api/license/generate - 生成授权文件');
  console.log('    POST /api/license/parse   - 解析授权文件');
  console.log('    POST /api/license/validate - 验证授权有效性');
  console.log('    GET  /api/license/public-key - 获取公钥');
  console.log('    GET  /api/project         - 项目列表');
  console.log('========================================\n');
});

module.exports = app;
