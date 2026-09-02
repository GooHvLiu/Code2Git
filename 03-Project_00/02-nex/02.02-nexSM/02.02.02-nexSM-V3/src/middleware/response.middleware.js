/**
 * 统一响应格式中间件
 * 给 res 对象挂载 success / error 方法
 * 所有接口统一返回格式：{ code, msg, data }
 *
 * 国际化规范：
 * - 成功响应：不返回 msg，前端根据 code=200 统一显示"操作成功"
 * - 错误响应：返回字符串错误码 code + 动态参数 data，前端根据 code 做国际化
 * - msg 字段仅用于后端调试（中文），前端不依赖此字段
 */
const { ERROR_CODE, ERROR_MESSAGE } = require('../constants/errorCode');

module.exports = (req, res, next) => {
  /**
   * 成功响应
   * @param {any} data 返回数据
   * @param {string|null} msg 提示消息（建议不传，前端统一处理）
   * @param {number|string} code 状态码，默认200
   */
  res.success = (data = null, msg = null, code = ERROR_CODE.SUCCESS) => {
    res.json({
      code,
      msg,
      data,
      timestamp: Date.now()
    });
  };

  /**
   * 失败响应（国际化规范版）
   * @param {string} errorCode 错误码字符串，如 'USER_NOT_FOUND'
   * @param {Object|null} params 动态参数对象，前端用于国际化模板填充，如 { username: 'xxx' }
   * @param {number} httpCode HTTP状态码（可选，默认400）
   *
   * 调用示例：
   *   res.error('USER_NOT_FOUND')                          // 无动态参数
   *   res.error('USER_NOT_FOUND', { userId: 123 })         // 有动态参数
   *   res.error('PERMISSION_DENIED', null, 403)           // 指定HTTP状态码
   *
   * 向后兼容（旧格式将逐步淘汰）：
   *   res.error('中文错误消息')                             // 旧格式，直接传中文
   *   res.error(数字错误码)                                 // 旧格式，传数字错误码
   */
  res.error = (errorCode, params = null, httpCode = 400) => {
    let code, msg, data;

    if (typeof errorCode === 'string' && ERROR_MESSAGE[errorCode]) {
      // 新格式：res.error('ERROR_CODE', { param: 'value' })
      code = errorCode;
      msg = ERROR_MESSAGE[errorCode];
      data = typeof params === 'object' && params !== null ? params : null;
    } else if (typeof errorCode === 'string') {
      // 旧格式兼容：res.error('中文消息')
      code = ERROR_CODE.UNKNOWN_ERROR;
      msg = errorCode;
      data = null;
    } else if (typeof errorCode === 'number') {
      // 旧格式兼容：res.error(数字错误码)
      code = errorCode;
      msg = ERROR_MESSAGE[errorCode] || '操作失败';
      data = null;
    } else {
      // 未知格式
      code = ERROR_CODE.UNKNOWN_ERROR;
      msg = '未知错误';
      data = null;
    }

    res.status(httpCode).json({
      code,
      msg,
      data,
      timestamp: Date.now()
    });
  };

  next();
};
