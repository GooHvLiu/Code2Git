/**
 * 模拟 Express req / res 对象，用于本地单元测试 Controller
 */
class ReqResModule {
  constructor(body = {}, params = {}, query = {}, session = {}) {
    // 模拟请求体 req.body
    this.body = body;
    // 路径参数 req.params
    this.params = params;
    // 查询参数 req.query
    this.query = query;
    // 模拟session
    this.session = session;
    // 请求头（用于JWT登出接口）
    this.headers = {};

    // res 存储返回结果
    this.resResult = null;
    this.resStatus = 200;
  }

  // 模拟 res.status + json（success / fail 内部调用）
  status(code) {
    this.resStatus = code;
    return this;
  }

  json(data) {
    this.resResult = data;
    return this;
  }

  // 获取完整返回结果
  getResponse() {
    return {
      status: this.resStatus,
      data: this.resResult,
    };
  }

  // 设置Authorization Bearer Token
  setAuthToken(token) {
    this.headers.authorization = `Bearer ${token}`;
  }
}

module.exports = ReqResModule;
