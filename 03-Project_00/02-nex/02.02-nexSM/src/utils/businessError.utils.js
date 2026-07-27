class BusinessError extends Error {
  /**
   * @param {string} msg 提示信息
   * @param {number} code 自定义错误码 
   * 业务异常: 
   *     200 业务成功
   *     500 服务器位置异常
   *     10xxx 账号数据类型不一致  
   *     10001 账号不存在  
   *     10002 账号已禁用  
   *     10003 账号或密码错误
   * JWT鉴权异常:
   *     40001 token不存在 
   *     40002 token无效/篡改
   *     40003 token已过期
   */
  constructor(msg, code) {
    super(msg);
    this.msg = msg;
    this.code = code;
    this.name = "BusinessError";
  }
}
module.exports = BusinessError;