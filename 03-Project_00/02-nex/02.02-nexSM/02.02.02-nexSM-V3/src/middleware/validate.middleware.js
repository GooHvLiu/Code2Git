/**
 * Joi Schema 校验中间件
 * 在路由层拦截非法请求，校验通过才进入 controller
 *
 * 使用方式：router.post('/', validate(createUserSchema), userController.createUser)
 */
const { ERROR_CODE } = require('../constants/errorCode');

/**
 * 生成校验中间件
 * @param {Object} schema joi schema 对象
 * @param {string} source 校验来源：'body' | 'query' | 'params'，默认 body
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: true,       // 遇到第一个错误就返回，不累积
      stripUnknown: true,     // 自动剔除schema以外的多余字段，防止脏数据
      convert: true           // 自动类型转换（如字符串数字转number）
    });

    if (error) {
      // 校验失败，返回参数非法错误码 + 结构化的错误数据（前端用于国际化解析）
      const detail = error.details[0];
      const field = detail.path.join('.');           // 字段名，如 'password'
      const type = detail.type;                        // 错误类型，如 'string.min'
      const context = detail.context || {};           // 错误参数，如 { limit: 6 }
      
      return res.json({
        code: ERROR_CODE.PARAM_INVALID,
        msg: detail.message,                           // 原始错误信息（调试用，前端兜底）
        data: {
          field,
          type,
          ...context,
          message: detail.message                      // 原始错误信息（兜底）
        },
        timestamp: Date.now()
      });
    }

    // 把清洗后的数据挂回 req，controller 拿到的就是干净数据
    req[source] = value;
    next();
  };
}

module.exports = validate;
