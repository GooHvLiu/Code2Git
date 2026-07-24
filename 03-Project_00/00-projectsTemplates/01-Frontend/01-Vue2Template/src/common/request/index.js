/**
 * axios实例 + 请求/响应拦截器
 */
import axios from "axios";
// 引入对应按需使用的插件名称
import { Message } from "element-ui";

// 不需要 token 的接口集合，即白名单，内容需要调整
const NO_TOKEN_API = ["/login", "/captchaImage"];

// axios的基本配置
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
