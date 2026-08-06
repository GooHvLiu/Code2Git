import server from "../interceptors/axios.js";
import pureServer from "../interceptors/pure-axios.js";

// 验证码API  ESModule 向服务器 异步获取
export async function requestCaptchaCodeAPI() {
  const captchRes = await server.get("/captcha/captchaImage");
  return captchRes;
}

// token有效性API 纯净请求，无需拦截 ESModule 向服务器 异步获取
export async function requestTakenIsValidAPI() {
  const res = await pureServer.get("/user/tokenvalid");
  // 后端返回 res.data.data.valid 只有 true 和false 两个结果
  // console.log("token 请求后返回数据：", res.data.data.valid);
  return res.data.data.valid;
}

// 登录API ESModule 向服务器 异步获取 params可以从 req.body 获取
export async function requestLoginApi(params) {
  const loginRes = await server.post("/user/login", params);
  return loginRes;
}

// 获取菜单API ESModule 向服务器 异步获取
export async function requestGetUserRouterMenuApi(params) {
  const userMenuRes = await server.get("/menu/getRouters", params);
  return userMenuRes;
}

// 获取用户信息 ESModule 向服务器 异步获取
export async function requestGetUserInfoApi() {
  const userInfoRes = await server.get("/user/info");
  return userInfoRes;
}
