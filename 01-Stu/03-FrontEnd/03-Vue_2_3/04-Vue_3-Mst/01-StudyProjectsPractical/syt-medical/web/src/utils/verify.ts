/**
 * ==========================================
 * 校验工具 TS版
 * ==========================================
 * 登录输入：校验手机号格式是否正确
 */
// 校验手机号码的正则表达式
const regularPhoneNumber = /^1[3-9]\d{9}$/;
// 导出 手机号码 验证结果
export const verifyPhoneNumber = (phoneNumber: string): boolean => {
  // 验证手机号是否合法的结果
  if (!phoneNumber) return false;
  return regularPhoneNumber.test(phoneNumber.trim());
};
