const BusinessError = require("@utils/businessError.utils.js");
/**
 * 简单参数校验
 * @param {any} value 校验值
 * @param {string} type 类型 number/string
 * @param {string} msg 错误提示
 */
function validateParams(value, type, msg) {
  //检查传入的数据类型和真实传进来的值是否匹配
  if (type === "number" && isNaN(Number(value))) {
    //如果检测不一致，则抛出错误信息
    throw new BusinessError(msg, 10000);
  }
  //检查传入的数据类型和真实传进来的值是否匹配
  if (type === "string" && !value) {
    //如果检测不一致，则抛出错误信息
    throw new BusinessError(msg, 10000);
  }
}

module.exports = { validateParams };
