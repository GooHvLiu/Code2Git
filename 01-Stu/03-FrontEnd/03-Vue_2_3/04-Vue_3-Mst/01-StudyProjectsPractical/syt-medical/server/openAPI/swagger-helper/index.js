/**
 * swagger-helper / index.js
 * 可复用标准模块入口 —— 一行接入 OpenAPI 文档
 *
 * 用法：
 *   const swaggerHelper = require("./swagger-helper");
 *   app.use("/api-docs", swaggerHelper({
 *     title: "XX项目 API",
 *     version: "1.0.0",
 *     pathsDir: __dirname + "/paths",
 *     schemasDir: __dirname + "/schemas",
 *     servers: [{ url: "http://localhost:3000" }],
 *   }));
 *
 *   // 同时可访问 /api-docs/spec.json 下载完整规范
 */

const express = require("express");
const { buildSpec } = require("./loader");
const { validateSpec } = require("./validator");
const { createUi } = require("./ui");

/**
 * 创建 swagger 文档中间件
 * @param {object} config - 配置对象
 * @returns {express.Router} Express 路由
 */
function swaggerHelper(config) {
  const router = express.Router();

  // 构建规范
  const spec = buildSpec(config);

  // 启动时校验（异步，不阻塞启动，但打印警告）
  if (config.validate !== false) {
    validateSpec(spec);
  }

  // JSON 规范下载端点（必须在 UI 之前，否则被 swagger-ui 拦截）
  router.get("/spec.json", (req, res) => {
    res.json(spec);
  });

  // UI 页面
  const { serve, setup } = createUi(spec, config.ui || {});
  router.use("/", serve, setup);

  return router;
}

module.exports = swaggerHelper;
module.exports.swaggerHelper = swaggerHelper;
module.exports.buildSpec = buildSpec;
module.exports.validateSpec = validateSpec;
