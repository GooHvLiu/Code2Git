/**
 * ==========================================
 * 用户 / 权限相关类型
 * ==========================================
 * 与后端 users 表字段对齐（同时兼容下划线与驼峰）
 */

/** 当前登录用户信息 */
export interface UserInfo {
  id?: number | string | null
  username?: string | null
  /** 角色编码（字符串或数组，后端可能返回其一） */
  role?: string | string[] | null
  avatar?: string | null
  realName?: string | null
  real_name?: string | null
  sex?: string | null
  remark?: string | null
  phone?: string | null
  email?: string | null
  status?: number | string | null
  createTime?: string | null
  create_time?: string | null
  deptId?: number | null
  dept_id?: number | null
  loginIp?: string | null
  login_ip?: string | null
  loginDate?: string | null
  login_date?: string | null
  /** 是否超级管理员（数据库 is_super_admin 字段，1 是 / 0 否） */
  is_super_admin?: 0 | 1
  /** 角色等级（数字越小等级越高） */
  role_level?: number
  isFirstLogin?: boolean
  firstLoginAt?: string | null
  [key: string]: unknown
}

/** 登录入参 */
export interface LoginPayload {
  username: string
  password: string
  /** 验证码 UUID */
  captchaUuid?: string
  /** 验证码答案 */
  captchaCode?: string
  remember?: boolean
}

/** 登录响应 */
export interface LoginResult {
  token: string
  expiresIn?: number
}

/** 我的权限响应 */
export interface MyPermissionsResult {
  permissions: string[]
  permissionVersion: string | number | null
}
