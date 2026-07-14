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
  let errorMsg = "";
  if (typeof msg === "string") {
    errorMsg = msg;
  } else if (msg?.message) {
    errorMsg = msg.message;
  } else {
    errorMsg = "服务器内部异常";
  }
  return res.status(code).json({
    code,
    msg: errorMsg,
    data: null,
  });
};

module.exports = { success, fail };
