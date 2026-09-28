/**
 * ==========================================
 * 校验工具 TS版
 * ==========================================
 * 登录输入：校验手机号格式是否正确
 */
// 校验 手机号码 的正则表达式
const regularPhoneNumber = /^1[3-9]\d{9}$/;
// 校验 六位纯数字验证码 的正则表达式
const regularCaptchaCode = /^\d{6}$/;
// 导出 手机号码 验证结果
export const verifyPhoneNumber = (phoneNumber: string | null | undefined): boolean => {
  // 先转字符串，防止不是字符串调用trim报错
  const str = String(phoneNumber ?? "").trim();
  // 验证手机号是否合法的结果
  if (!str) return false;
  return regularPhoneNumber.test(str);
};
// 导出 验证码 的验证结果
export const verifyCaptchCode = (captchCode: string | null | undefined): boolean => {
  // 先转字符串，防止不是字符串调用trim报错
  const str = String(captchCode ?? "").trim();
  // 验证 验证码 是否合法的结果
  if (!str) return false;
  return regularCaptchaCode.test(str);
};
