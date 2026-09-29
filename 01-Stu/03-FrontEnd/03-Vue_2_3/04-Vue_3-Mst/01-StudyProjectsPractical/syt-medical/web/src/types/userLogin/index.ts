// 登录窗口 验证码 数据类型
export interface CaptchaItem {
  phone: string;
  code: string;
}

// 登录 请求数据类型
export interface ReqLoginItem {
  phone: string;
  code: string;
}
// 登录 响应数据类型
export interface ResLoginItem {
  token: string;
  name: string;
}
