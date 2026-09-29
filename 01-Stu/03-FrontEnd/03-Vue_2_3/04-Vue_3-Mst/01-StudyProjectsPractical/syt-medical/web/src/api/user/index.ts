// 引入网络请求接口
import { request } from "@/utils";

// 引入 用户/登录/验证码 数据类型
import type { ResponseData } from "@/types/api";
import type { CaptchaItem, ReqLoginItem, ResLoginItem } from "@/types/userLogin/index";

// 通过枚举管理 用户 相关功能的后端获取地址
enum API {
  // Login 模块的验证码 后端获取地址
  CAPTCHA_URL = "/user/msm/send",
  LOGIN_URL = "/user/userInfo/login"
}

// 用户 登录前 验证码获取
export const reqLoginCapcha = async (phoneNumber: string) => {
  const result = await request.post(API.CAPTCHA_URL, {
    phone: phoneNumber
  });
  return result.data as ResponseData<CaptchaItem>;
};

// 用户 登录 用户信息获取
export const reqLogin = async (reqObject: ReqLoginItem) => {
  const result = await request.post(API.LOGIN_URL, reqObject);
  return result.data as ResponseData<ResLoginItem>;
};
