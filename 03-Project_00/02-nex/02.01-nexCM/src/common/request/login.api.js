import server from "./index";

// 验证码API  ESModule 向服务器 异步获取
export async function requestCaptchaCodeAPI() {
  const captchRes = await server.get("/captchaImage");
  return captchRes;
}

// 登录API ESModule 向服务器 异步获取
export async function requestLoginApi(params) {
  const loginRes = await server.post("/login", params);
  return loginRes;
}
