/**
 * ==========================================
 * 文案配置（保留原结构，实际页面文案走 i18n）
 * ==========================================
 */
export default {
  MESSAGES: {
    TOKEN_EXPIRED: '登录状态已过期，请重新登录',
    PERMISSION_DENIED: '当前账号权限不足',
    NETWORK_ERROR: '网络连接异常，请检查网络',
    TIMEOUT: '请求超时，请稍后重试',
    SERVER_ERROR: '服务器异常，请联系管理员',
    UNKNOWN_ERROR: '请求失败，请稍后重试'
  },
  HTTP_ERRORS: {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问，权限不足',
    404: '请求地址不存在',
    500: '服务器异常，请联系管理员',
    502: '网关错误，后端服务可能未启动',
    503: '服务不可用',
    504: '请求超时，请稍后重试'
  } as Record<number, string>,
  VALIDATE: {
    USERNAME_LENGTH: '用户名需要在3-16位之间，请重新输入！',
    PASSWORD_LENGTH: '密码需要在6-20位之间，请重新输入！',
    PASSWORD_MISMATCH: '两次输入的密码不一致！',
    EMAIL_FORMAT: '请输入正确的邮箱地址！'
  }
}
