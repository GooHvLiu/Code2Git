/**
 * ==========================================
 * 接口响应业务码常量定义
 * ==========================================
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
export const CODE_SUCCESS = 200

export const CODE_PARAM_ERROR = 'PARAM_ERROR'
export const CODE_PARAM_MISSING = 'PARAM_MISSING'
export const CODE_PARAM_INVALID = 'PARAM_INVALID'

export const CODE_UNAUTHORIZED = 'UNAUTHORIZED'
export const CODE_TOKEN_EXPIRED = 'TOKEN_EXPIRED'
export const CODE_TOKEN_INVALID = 'TOKEN_INVALID'
export const CODE_PERMISSION_DENIED = 'PERMISSION_DENIED'
export const CODE_TOKEN_KICKED_OUT = 'TOKEN_KICKED_OUT'

export const CODE_NOT_FOUND = 'NOT_FOUND'
export const CODE_MENU_NOT_MODIFIED = 'MENU_NOT_MODIFIED'
export const CODE_SYSTEM_ERROR = 'SYSTEM_ERROR'
export const CODE_DATABASE_ERROR = 'DATABASE_ERROR'
export const CODE_NETWORK_ERROR = 'NETWORK_ERROR'
export const CODE_UNKNOWN_ERROR = 'UNKNOWN_ERROR'

/** 需要自动清除 token + 跳转登录的 token 错误码集合 */
export const TOKEN_AUTO_REDIRECT_CODES: string[] = [
  CODE_UNAUTHORIZED,
  CODE_TOKEN_EXPIRED,
  CODE_TOKEN_INVALID,
  CODE_TOKEN_KICKED_OUT
]

/** 不需要 token 的接口白名单 */
export const NO_TOKEN_API: string[] = ['/user/login', '/captcha/captcha-image', '/license/status', '/license/import']

/** 系统角色定义 */
export const ROLES = {
  ADMIN: 'admin',
  ENGINEER: 'engineer',
  OPERATOR: 'operator',
  ADMINISTRATOR: 'administrator',
  GUEST: 'guest'
} as const

/** 设备类型 */
export const DEVICE_TYPES = {
  FILLING: 'filling',
  STOPPER: 'stopper',
  INTEGRATED: 'integrated'
} as const
