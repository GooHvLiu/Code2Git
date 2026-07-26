import server from "./index";

// 验证码API  ESModule 向服务器 异步获取
export async function requestCaptchaCodeAPI() {
  const captchRes = await server.get("/captchaImage");
  return captchRes;
}

// 登录API ESModule 向服务器 异步获取 params可以从 req.body 获取
export async function requestLoginApi(params) {
  const loginRes = await server.post("/login", params);
  return loginRes;
}

// 获取菜单API ESModule 向服务器 异步获取
export async function requestGetUserRouterMenuApi(params) {
  const userMenuRes = await server.get("/getRouters",params);
  return userMenuRes;
}

// 获取用户信息 ESModule 向服务器 异步获取
export async function requestGetUserInfoApi() {
  const userInfoRes = await server.get("/user/info");
  return userInfoRes;
}
