/**
 * swagger-helper / ui.js
 * swagger-ui-express 配置封装
 */

const swaggerUi = require("swagger-ui-express");

/**
 * 生成 swagger-ui 中间件
 * @param {object} spec - OpenAPI 规范对象
 * @param {object} options - UI 配置
 * @returns {object} { serve, setup }
 */
function createUi(spec, options = {}) {
  const uiOptions = {
    customSiteTitle: options.customSiteTitle || spec.info.title || "API Document",
    customCss: options.customCss || ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      deepLinking: options.deepLinking !== false,
      filter: options.filter !== false,
      tryItOutEnabled: options.tryItOutEnabled !== false,
      displayRequestDuration: options.displayRequestDuration !== false,
      defaultModelsExpandDepth: options.defaultModelsExpandDepth ?? 1,
      defaultModelExpandDepth: options.defaultModelExpandDepth ?? 1,
      docExpansion: options.docExpansion || "list",
      showExtensions: options.showExtensions || false,
      persistAuthorization: options.persistAuthorization !== false,
      displayOperationId: options.displayOperationId !== false,
      ...options.swaggerOptions,
    },
  };

  return {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(spec, uiOptions),
  };
}

module.exports = { createUi };
