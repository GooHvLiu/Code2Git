/**
 * swagger-helper / loader.js
 * 负责加载 YAML 文件、合并 paths 和 schemas、解析 $ref
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * 加载目录下所有 YAML 文件并合并为一个对象
 * @param {string} dir - 目录路径
 * @returns {object} 合并后的对象
 */
function loadYamlDir(dir) {
  const result = {};
  if (!fs.existsSync(dir)) return result;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
  files.forEach((file) => {
    const content = fs.readFileSync(path.join(dir, file), "utf8");
    const parsed = yaml.load(content);
    if (parsed && typeof parsed === "object") {
      Object.assign(result, parsed);
    }
  });
  return result;
}

/**
 * 加载单个 YAML 文件
 */
function loadYamlFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.load(content) || {};
}

/**
 * 构建完整的 OpenAPI 规范对象
 * @param {object} config - 项目配置 { title, version, description, servers, tags, pathsDir, schemasDir, securitySchemes }
 * @returns {object} 完整 OpenAPI 3.0 规范
 */
function buildSpec(config) {
  const paths = loadYamlDir(config.pathsDir);
  const schemas = loadYamlDir(config.schemasDir);

  const spec = {
    openapi: "3.0.3",
    info: {
      title: config.title || "API Document",
      version: config.version || "1.0.0",
      description: config.description || "",
      contact: config.contact || {},
      license: config.license || { name: "MIT" },
    },
    servers: config.servers || [{ url: "http://localhost:3000" }],
    tags: config.tags || [],
    paths,
    components: {
      schemas,
    },
  };

  // 安全方案
  if (config.bearerAuth !== false) {
    spec.components.securitySchemes = {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "登录后获取的 token，放入请求头 token 字段",
      },
    };
  }
  if (config.securitySchemes) {
    Object.assign(spec.components.securitySchemes, config.securitySchemes);
  }

  // 外部文档
  if (config.externalDocs) {
    spec.externalDocs = config.externalDocs;
  }

  return spec;
}

module.exports = { loadYamlDir, loadYamlFile, buildSpec };
