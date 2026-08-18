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
    console.log("data:", data);

    const { error, value } = schema.validate(data, {
      abortEarly: true,       // 遇到第一个错误就返回，不累积
      stripUnknown: true,     // 自动剔除schema以外的多余字段，防止脏数据
      convert: true           // 自动类型转换（如字符串数字转number）
    });

    if (error) {
      // 校验失败，返回参数非法错误码 + joi的友好提示
      return res.error(error.details[0].message, ERROR_CODE.PARAM_INVALID);
    }

    // 把清洗后的数据挂回 req，controller 拿到的就是干净数据
    req[source] = value;
    next();
  };
}

module.exports = validate;
