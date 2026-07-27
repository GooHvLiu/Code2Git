import axios from "axios";
import { Message } from "element-ui";
import router from "@router/index.js";

// 不需要 token 的接口集合，即白名单
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

    // 200 成功，直接返回完整data
    if (resData.code === 200) {
      return resData;
    }

    // Token 鉴权类错误：40001 / 40003 → 需要清除token、跳登录
    const tokenErrCodes = [40001, 40003];
    if (tokenErrCodes.includes(resData.code)) {
      Message.error(resData.msg || '登录凭证失效，请重新登录');
      // 删除本地token
      localStorage.removeItem('token');
      // 跳转到登录页，replace防止返回
      router.replace({ path: '/login' });
      // 规范：reject抛出异常，组件await可以catch捕获
      return Promise.reject(resData);
    }

    // Token 鉴权类错误：40002 token非法、篡改：仅提示，不自动跳转
    if (resData.code === 40002) {
      Message.error(resData.msg || "请求失败");
      return Promise.reject(resData);
    }

    // 其他业务错误（10001账号不存在、10003密码错误等）
    Message.error(resData.msg || '请求失败');
    return Promise.reject(resData);
  },
  (err) => {
    // 网络层面异常（http状态码 404/502/超时/跨域）
    if (!err.response) {
      Message.error('网络异常，无法连接服务器');
    } else {
      const status = err.response.status;
      if (status === 404) {
        Message.error('接口地址不存在 404');
      } else if (status >= 500) {
        Message.error('服务器异常');
      } else {
        Message.error(`请求错误 ${status}`);
      }
    }
    return Promise.reject(err);
  }
);

export default server;
