/**
 * 总路由聚合
 * 自动扫描 modules 目录下所有模块的路由文件
 * 新增模块无需手动注册，自动加载
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const modulesDir = path.join(__dirname, '../src/modules');

/**
 * 自动扫描并加载所有模块路由
 */
function loadAllRoutes() {
  const moduleList = fs.readdirSync(modulesDir);

  for (const moduleName of moduleList) {
    const modulePath = path.join(modulesDir, moduleName);
    const stat = fs.statSync(modulePath);

    // 只处理文件夹
    if (!stat.isDirectory()) continue;

    // 查找路由文件（匹配 *.route.js）
    const files = fs.readdirSync(modulePath);
    const routeFile = files.find(file => file.endsWith('.route.js'));

    if (routeFile) {
      const routePath = path.join(modulePath, routeFile);
      const moduleRouter = require(routePath);

      // 路由前缀使用模块名，例如 user 模块 => /prod-api/user
      router.use(`/prod-api/${moduleName}`, moduleRouter);
      console.log(`✅ 路由加载: /api/${moduleName}`);
    }
  }
}

// 执行加载
loadAllRoutes();

module.exports = router;
