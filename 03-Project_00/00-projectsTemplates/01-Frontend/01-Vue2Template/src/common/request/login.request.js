import axios from "axios";

// ESModule 向服务器 异步 获取 数据请求 获取验证码接口
export async function requestCaptchaCode() {
  const res = await axios.get("/prod-api/captchaImage");
  return res.data;
}
