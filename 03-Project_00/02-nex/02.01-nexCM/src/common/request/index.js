/**
 * axios实例 + 请求/响应拦截器
 */
import axios from "axios";
const server = axios.create({
  baseURL: "/prod-api",
  timeout: 100000
});

// 请求拦截器
server.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
server.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default server;
