/**
 * ==========================================
 * 接口响应业务码常量定义
 * ==========================================
 * 与后端 ERROR_CODE 保持一致，使用字符串类型错误码
 * 错误码可读性好，前端可以直接用作国际化 key
 *
 * 注意：
 * - 成功码 CODE_SUCCESS = 200（数字类型，与后端一致）
 * - 错误码使用字符串类型，如 'PARAM_INVALID'
 * - 前端根据错误码做国际化，用 data 中的动态参数填充模板
 */

// ==================== 基础业务码 ====================
export const CODE_SUCCESS = 200

// ==================== 通用错误（字符串类型，与后端 ERROR_CODE 一致） ====================
export const CODE_PARAM_ERROR = 'PARAM_ERROR'           // 参数错误
export const CODE_PARAM_MISSING = 'PARAM_MISSING'       // 参数缺失
export const CODE_PARAM_INVALID = 'PARAM_INVALID'       // 参数格式非法/参数无效

// ==================== 鉴权错误 ====================
export const CODE_UNAUTHORIZED = 'UNAUTHORIZED'         // 未登录/未授权
export const CODE_TOKEN_EXPIRED = 'TOKEN_EXPIRED'      // Token已过期
export const CODE_TOKEN_INVALID = 'TOKEN_INVALID'      // Token无效
export const CODE_PERMISSION_DENIED = 'PERMISSION_DENIED'  // 权限不足，拒绝访问
export const CODE_TOKEN_KICKED_OUT = 'TOKEN_KICKED_OUT'   // Token被踢下线（在其他设备登录）

// ==================== 资源不存在 ====================
export const CODE_NOT_FOUND = 'NOT_FOUND'               // 接口/资源不存在

// ==================== 菜单模块 ====================
export const CODE_MENU_NOT_MODIFIED = 'MENU_NOT_MODIFIED'   // 菜单未变更（缓存命中）

// ==================== 系统错误 ====================
export const CODE_SYSTEM_ERROR = 'SYSTEM_ERROR'       // 服务器内部系统异常
export const CODE_DATABASE_ERROR = 'DATABASE_ERROR'     // 数据库操作异常
export const CODE_NETWORK_ERROR = 'NETWORK_ERROR'      // 网络异常
export const CODE_UNKNOWN_ERROR = 'UNKNOWN_ERROR'      // 未知异常

// ==================== 分组集合（业务逻辑直接使用） ====================

/** 需要自动清除token + 跳转登录的token错误码集合 */
export const TOKEN_AUTO_REDIRECT_CODES = [
  CODE_UNAUTHORIZED,
  CODE_TOKEN_EXPIRED,
  CODE_TOKEN_INVALID,
  CODE_TOKEN_KICKED_OUT
]

/** 不需要 token 的接口白名单 */
export const NO_TOKEN_API = ['/user/login', '/captcha/captcha-image', '/license/status', '/license/import']

// ==================== 权限角色常量 ====================

/**
 * 系统角色定义
 * 业务页面中通过 v-permission="['admin']" 或判断 roles 控制权限
 * 与后端返回的用户角色字段对应
 */
export const ROLES = {
  /** 超级管理员 - 所有权限 */
  ADMIN: 'admin',
  /** 工程师 - 设备操作、参数配置 */
  ENGINEER: 'engineer',
  /** 操作员 - 日常生产操作 */
  OPERATOR: 'operator',
  /** 管理员 - 用户管理、系统配置 */
  ADMINISTRATOR: 'administrator',
  /** 访客 - 只读权限 */
  GUEST: 'guest'
}

/** 设备类型（与后端字典对应，预留） */
export const DEVICE_TYPES = {
  FILLING: 'filling',       // 灌装机
  STOPPER: 'stopper',       // 加塞机
  INTEGRATED: 'integrated'  // 灌装加塞一体机
}
