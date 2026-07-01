const Joi = require("joi");
const { responseError } = require("@MongoDB/utils/response.js");

/**
 * 参数校验中间件工厂函数
 * @param {Object} schemaRules - Joi校验规则对象 { body, params, query }
 * @returns 中间件函数
 */
const validateMiddleware = (schemaRules) => {
  return (req, res, next) => {
    // 待校验数据映射
    const sourceMap = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    // 遍历所有需要校验的字段域
    for (const [key, schema] of Object.entries(schemaRules)) {
      if (!sourceMap.hasOwnProperty(key)) continue;

      // 执行校验
      const { error } = schema.validate(sourceMap[key], {
        abortEarly: false, // 返回全部错误，不只第一条
        stripUnknown: true, // 剔除未定义的多余字段
      });

      if (error) {
        // 拼接错误提示
        const errMsg = error.details.map((item) => item.message).join("、");
        return responseError(res, 400, `参数校验失败：${errMsg}`);
      }
    }
    next();
  };
};

module.exports = validateMiddleware;
