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
    console.log("后端返回的数据@@:", response);
    const res = response.data;
    // 业务成功
    if (res.code === 200) {
      // console.log("恭喜，响应拦截器已生效，响应码:200");
      return response;
    } else {
      // console.log(res.data.message || "业务失败");
      return Promise.reject(res);
    }
  },
  (error: AxiosError) => {
    // 容错：没有response的情况（断网、跨域、超时）
    if (!error.response) {
      // console.log("网络异常，请检查网络连接~");
      return Promise.reject({ code: 500, message: "网络异常，请检查网络连接", ok: false, data: null });
    }
    // 处理 HTTP 错误：也统一 reject 业务数据
    return Promise.reject(error.response.data);
  }
);

export default service;
