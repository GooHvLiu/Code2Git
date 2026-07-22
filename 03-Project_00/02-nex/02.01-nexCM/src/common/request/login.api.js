import server from "./index";

// ESModule 向服务器 异步 获取 数据请求 获取验证码接口
export async function requestCaptchaCodeAPI() {
  const captchRes = await server.get("/captchaImage");
  return captchRes;
}

// ESModule 向服务器 异步 登录验证接口
export async function requestLoginApi(params) {
  const loginRes = await server.get("/login");
  return loginRes;
}
