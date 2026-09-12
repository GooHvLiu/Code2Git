/**
 * Beagle 测试平台 - 后端入口
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const responseMiddleware = require('./middleware/response');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// 静态文件 - 报告目录
app.use('/reports', express.static(path.join(__dirname, '../reports')));

// 路由
app.use('/api/projects', require('./modules/projects/route'));
app.use('/api/plugins', require('./modules/plugins/route'));
app.use('/api/modules', require('./modules/test-modules/route'));
app.use('/api/test-runs', require('./modules/test-runs/route'));
app.use('/api/settings', require('./modules/settings/route'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.success({
    status: 'ok',
    service: 'Beagle Test Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在', data: null });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ code: 500, message: err.message || '服务器内部错误', data: null });
});

// 先初始化数据库，再启动服务器
async function start() {
  try {
    await initDatabase();

    // 初始化模块注册器（会自动注册所有内置模块）
    require('./test-modules/registry');

    app.listen(PORT, () => {
      console.log('========================================');
      console.log('  Beagle 测试平台 - 后端服务已启动');
      console.log(`  地址: http://localhost:${PORT}`);
      console.log(`  健康检查: http://localhost:${PORT}/api/health`);
      console.log('========================================');
    });
  } catch (err) {
    console.error('[启动失败]', err);
    process.exit(1);
  }
}

start();

module.exports = app;
