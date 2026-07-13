/**
 * 成功返回
 * @param {Object} res express响应对象
 * @param {*} data 返回数据
 * @param {string} msg 提示信息
 */
const success = (res, data = null, msg = "操作成功") => {
  return res.status(200).json({
    code: 200,
    msg,
    data,
  });
};

/**
 * 失败返回
 * @param {Object} res
 * @param {string} msg
 * @param {number} code
 */
const fail = (res, msg = "操作失败", code = 500) => {
  return res.status(code).json({
    code,
    msg,
    data: null,
  });
};

module.exports = { success, fail };
