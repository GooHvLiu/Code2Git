import axios from "axios";
import { NO_TOKEN_API, CODE_SUCCESS } from "../base/constants";
import { handleBusinessError, handleNetworkError } from "../base/errorHandler";
const server = axios.create({
  baseURL: "/prod-api",
  timeout: 100000
});

// 请求拦截器
server.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token
    const token = localStorage.getItem("nexCM-authorization-token");
    // 通过白名单和即将访问的地址做对比判断，排除白名单内的地址之外，都需要token
    const isNeedToken = !NO_TOKEN_API.some((item) => config.url.includes(item));
    if (token && isNeedToken) {
      // 主流后台格式 Authorization: Bearer xxx
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

/** 响应拦截器
 *  业务异常：
 *      200 业务成功
 *      500 服务器未知异常
 *      10000 账号数据类型不一致 
 *      10001 账号不存在  
 *      10002 账号已禁用  
 *      10003 账号或密码错误
 *  JWT鉴权异常：
 *      40001 token不存在
 *      40002 token无效/篡改
 *      40003 token已过期
 */
server.interceptors.response.use(
  (res) => {
    const resData = res.data;
    if (resData.code === CODE_SUCCESS) {
      return resData;
    }
    // 业务非200，交给统一错误处理器
    return handleBusinessError(resData);
  },
  (err) => {
    // http层面网络错误统一处理
    return handleNetworkError(err);
  }
);

export default server;