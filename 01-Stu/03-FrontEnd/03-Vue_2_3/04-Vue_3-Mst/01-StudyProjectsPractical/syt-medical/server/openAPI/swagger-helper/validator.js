/**
 * swagger-helper / validator.js
 * 启动时校验 OpenAPI 规范合法性，不通过则打印错误并退出
 */

const SwaggerParser = require("@apidevtools/swagger-parser");

/**
 * 校验 OpenAPI 规范
 * @param {object} spec - OpenAPI 规范对象
 * @returns {Promise<boolean>} 是否通过
 */
async function validateSpec(spec) {
  try {
    await SwaggerParser.validate(spec);
    console.log("[swagger-helper] OpenAPI 规范校验通过");
    return true;
  } catch (err) {
    console.error("\n[swagger-helper] ❌ OpenAPI 规范校验失败：");
    console.error("  " + err.message);
    if (err.errors) {
      err.errors.forEach((e, i) => {
        console.error(`  [${i + 1}] ${e.message}`);
        if (e.path) console.error(`      路径: ${e.path.join(".")}`);
      });
    }
    console.error("");
    return false;
  }
}

module.exports = { validateSpec };
