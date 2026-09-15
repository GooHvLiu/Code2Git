/**
 * 公共模块 - 表单校验国际化字段
 * 命名空间挂载：common.validate.字段名
 * 由 src/utils/data/validate.js 的 Element 表单校验器调用
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【校验】用户名长度
  usernameLength: '用户名需要在3-16位之间，请重新输入',
  // 【校验】密码长度
  passwordLength: '密码需要在6-20位之间，请重新输入',
  // 【校验】两次密码不一致
  passwordMismatch: '两次输入的密码不一致',
  // 【校验】邮箱格式
  emailFormat: '请输入正确的邮箱地址'
}
