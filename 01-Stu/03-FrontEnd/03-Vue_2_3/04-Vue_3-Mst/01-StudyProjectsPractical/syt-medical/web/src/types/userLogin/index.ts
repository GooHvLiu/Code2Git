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

// 获取小程序码 响应数据类型
export interface WxQrcodeItem {
  uuid: string;
  qrDataUrl: string; // base 32/64 图片
}

// 扫码用户信息
export interface WxUserItem {
  id: number;
  nickname: string;
  avatar: string;
  openid: string;
}

// 扫码状态轮询 响应数据类型
export interface WxScanStatusItem {
  status: "pending" | "done" | "expired";
  token?: string;
  user?: WxUserItem;
}
