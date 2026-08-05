import { Message } from "element-ui"
import {
  TOKEN_AUTO_REDIRECT_CODES,
  CODE_TOKEN_INVALID
} from "./constants";
import { clearLoginStorage } from "@/common/utils/index.js"
/**
 * 后端返回非200业务码统一处理
 * @param {Object} resData {code, msg, data}
 */
export function handleBusinessError(resData) {
  const { code, msg } = resData;

  // token缺失 / token过期：清除token + 跳转登录
  if (TOKEN_AUTO_REDIRECT_CODES.includes(code)) {
    Message.error(msg || "登录凭证失效，请重新登录");
    clearLoginStorage();
    // 函数内动态导入，解决循环依赖
    const router = require("@/router/index.js").default;
    router.replace("/login");
    return Promise.reject(resData);
  }

  // token非法/篡改：仅弹窗，不自动跳转登录
  if (code === CODE_TOKEN_INVALID) {
    Message.error(msg || "登录凭证非法");
    return Promise.reject(resData);
  }

  // 其余所有业务错误（账号不存在、密码错误等）
  Message.error(msg || "请求失败");
  return Promise.reject(resData);
}

/**
 * 网络层级异常（404、500、断网、超时）
 * @param {Error} err axios原始错误对象
 */
export function handleNetworkError(err) {
  if (!err.response) {
    Message.error("网络异常，无法连接服务器");
  } else {
    const status = err.response.status;
    if (status === 404) {
      Message.error("接口地址不存在 404");
    } else if (status >= 500) {
      Message.error("服务器内部异常");
    } else {
      Message.error(`请求错误 ${status}`);
    }
  }
  return Promise.reject(err);
}