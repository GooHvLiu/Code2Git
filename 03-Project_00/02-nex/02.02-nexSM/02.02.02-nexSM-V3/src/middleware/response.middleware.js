/**
 * 统一响应格式中间件
 * 给 res 对象挂载 success / error 方法
 * 所有接口统一返回格式：{ code, msg, data }
 */
const { ERROR_CODE, ERROR_MESSAGE } = require('../constants/errorCode');

module.exports = (req, res, next) => {
  /**
   * 成功响应
   * @param {any} data 返回数据
   * @param {string} msg 提示消息
   * @param {number} code 状态码，默认200
   */
  res.success = (data = null, msg = '操作成功', code = ERROR_CODE.SUCCESS) => {
    res.json({
      code,
      msg,
      data,
      timestamp: Date.now()
    });
  };

  /**
   * 失败响应
   * @param {string|number} error 错误消息或错误码
   * @param {number} code 状态码，默认400
   */
  res.error = (error, code = ERROR_CODE.PARAM_ERROR) => {
    let msg = error;
    let errorCode = code;

    // 如果传入的是数字错误码，从常量中取消息
    if (typeof error === 'number') {
      errorCode = error;
      msg = ERROR_MESSAGE[error] || '操作失败';
    }

    res.json({
      code: errorCode,
      msg,
      data: null,
      timestamp: Date.now()
    });
  };

  next();
};
