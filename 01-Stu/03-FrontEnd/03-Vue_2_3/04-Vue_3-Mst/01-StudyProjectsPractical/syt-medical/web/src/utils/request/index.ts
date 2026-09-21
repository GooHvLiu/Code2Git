/**
 * ==========================================
 * Axios 请求统一封装 TS版
 * ==========================================
 * 请求拦截器：Token注入、白名单放行
 * 响应拦截器：业务码判断、错误提示、Token过期跳转
 */
import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  // 环境变量中的对应字段： VITE_APP_BASE_API = /api
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  // 环境变量中的对应字段： VITE_APP_TIME_OUT = 1000
  timeout: Number(import.meta.env.VITE_APP_TIME_OUT)
});

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    console.log("恭喜，这只是提示您：请求拦截器已生效~");

    return requestConfig;
  },
  (error) => {
    // 请求发送失败 返回错误信息
    console.log("糟糕，请求拦截器发送失败~");

    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一处理业务码和错误
 */
service.interceptors.response.use(
  (response) => {
    console.log(response);

    const res = response.data;
    // 业务成功
    if (res.code === 200) {
      console.log("恭喜，响应拦截器已生效，响应码:200");

      return res;
    } else {
      console.log(res.message || "业务失败");
      return Promise.reject(res);
    }
  },
  (error: AxiosError) => {
    // 容错：没有response的情况（断网、跨域、超时）
    if (!error.response) {
      console.log("网络异常，请检查网络连接~");
      return Promise.reject(error);
    }
    // 处理 http 网络错误
    const status = error.response.status;
    let msg = "";
    switch (status) {
      case 401:
        msg = "请求参数有误~";
        break;
      case 404:
        msg = "请求失败：接口路径不存在";
        break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 505:
        msg = "服务器挂掉了~";
        break;
      default:
        msg = `HTTP错误：${status}`;
    }
    console.log(msg);
    return Promise.reject(error);
  }
);

export default service;
