/**
 * axios实例 + 请求/响应拦截器
 */
import axios from "axios";
// 引入对应按需使用的插件名称
import { Message } from "element-ui";
const server = axios.create({
  baseURL: "/prod-api",
  timeout: 100000
});

// 请求拦截器
server.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token，字段需要根据实际情况修改
    const token = localStorage.getItem("nexCM-authorization-token");
    if (token) {
      // 主流后台格式 Authorization: Bearer xxx
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
server.interceptors.response.use(
  (res) => {
    // 响应如果不是200，则拦截器进行阻拦，可以减少主代码中的所有判断条件
    let res_data = res.data;
    if (res_data.code !== 200) {
      //此条是利用element ui组件之后具备的错误报警
      Message.error(res_data.msg);
      // 所有接收到的响应首先判断是不是false，如果是false，则直接return
      return false;
    }
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default server;
