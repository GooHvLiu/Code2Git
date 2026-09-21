/**
 * 布局模块 - 登录页国际化字段
 * 登录、注册、忘记密码相关文案
 * 注意：不使用兜底方案，缺失字段直接显示 key
 */
export default {
  // 【页面】登录标题
  title: '系统登录',
  // 【表单】用户名
  username: '用户名',
  // 【表单】密码
  password: '密码',
  // 【表单】验证码
  captcha: '验证码',
  // 【按钮】登录
  loginBtn: '登 录',
  // 【按钮】注册
  registerBtn: '注 册',
  // 【链接】忘记密码
  forgotPassword: '忘记密码？',
  // 【链接】还没有账号
  noAccount: '还没有账号？',
  // 【链接】已有账号
  hasAccount: '已有账号？',
  // 【按钮】立即登录
  loginNow: '立即登录',
  // 【按钮】立即注册
  registerNow: '立即注册',
  // 【校验】请输入用户名
  usernameRequired: '请输入用户名',
  // 【校验】请输入密码
  passwordRequired: '请输入密码',
  // 【校验】请输入验证码
  captchaRequired: '请输入验证码',
  // 【校验】请输入邮箱
  emailRequired: '请输入邮箱',
  // 【页面】注册标题
  registerTitle: '用户注册',
  // 【表单】邮箱
  email: '邮箱',
  // 【表单】确认密码
  confirmPassword: '确认密码',
  // 【校验】请输入确认密码
  confirmPasswordRequired: '请输入确认密码',
  // 【消息】注册成功，请登录
  registerSuccess: '注册成功，请登录',
  // 【消息】重置验证码已发送，请查收邮件
  resetCodeSent: '验证码已发送，请查收邮件',
  // 【消息】操作失败
  operationFailed: '操作失败',
  // 【校验】请填写完整信息
  fillCompleteInfo: '请填写完整信息',
  // 【校验】重置密码长度不能少于8位
  resetPasswordMinLength: '密码长度不能少于8位',
  // 【占位】验证码加载中
  captchaLoading: '验证码加载中...',
  // 【忘记密码】对话框（顶层 forgotPassword 为入口链接文案，对话框统一用 forgotPasswordDialog）
  forgotPasswordDialog: {
    // 对话框标题
    title: '忘记密码',
    // 步骤一：验证身份
    stepVerify: '验证身份',
    // 步骤二：重置密码
    stepReset: '重置密码',
    // 步骤三：完成
    stepDone: '完成',
    // 用户名输入占位
    usernamePlaceholder: '请输入用户名',
    // 邮箱输入占位
    emailPlaceholder: '请输入注册邮箱',
    // 验证码输入占位
    codePlaceholder: '请输入验证码',
    // 新密码输入占位
    newPasswordPlaceholder: '请输入新密码（至少8位）',
    // 确认新密码占位
    confirmPasswordPlaceholder: '请再次输入新密码',
    // 发送验证码按钮
    sendCode: '发送验证码',
    // 倒计时重发（{seconds} 为剩余秒数）
    resendCountdown: '{seconds}s后重发',
    // 下一步
    nextStep: '下一步',
    // 确认重置
    confirmReset: '确认重置',
    // 去登录
    goLogin: '去登录',
    // 取消按钮
    cancelBtn: '取 消',
    // 重置成功标题
    resetSuccess: '密码重置成功！',
    // 重置成功提示
    resetSuccessTip: '请使用新密码登录'
  }
}
