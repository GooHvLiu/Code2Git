import axios from "axios";
// 纯净请求，用于 token 校验
const pureServer = axios.create({
  baseURL: "/prod-api",
  timeout: 100000
});

// 请求拦截器
pureServer.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token
    const token = localStorage.getItem("nexCM-authorization-token");
    if (token) {
      // 主流后台格式 Authorization: Bearer xxx
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  })

export default pureServer;