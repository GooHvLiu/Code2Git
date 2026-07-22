import server from "./index";

// ESModule 向服务器 异步 获取 数据请求 获取验证码接口
export async function requestCaptchaCodeAPI() {
  const res = await server.get("/captchaImage");
  return res;
}
