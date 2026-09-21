/**
 * ==========================================
 * 系统管理模块业务实体类型
 * ==========================================
 * 与后端 system / permission / role / audit / config 等表字段对齐，
 * 供 views/system、views/permission-core、views/home 等模块复用。
 * 作者：GooHv
 */

/** 角色实体（后端 role 表） */
export interface Role {
  id: number | string
  /** 角色编码（内置：Super_Admin / Administrator / Engineer / Operator） */
  role_code: string
  /** 角色名称（自定义角色使用） */
  role_name?: string
  /** 角色描述 */
  description?: string
  /** 是否超级管理员：1 是 / 0 否 */
  is_super_admin?: number | string
  /** 角色等级：1 超管 / 2 管理员 / 3 工程师 / 4 操作员 */
  role_level?: number | string
  /** 是否内置角色 */
  is_builtin?: number | string
  /** 状态 */
  status?: number | string
  [key: string]: unknown
}

/** 权限树节点（菜单 / 按钮 / 参数） */
export interface PermissionNode {
  id: number | string
  /** 节点名称 */
  name?: string
  /** 菜单标题（i18n key，用于菜单渲染） */
  title?: string
  /** 节点类型：menu / button / param */
  type?: 'menu' | 'button' | 'param' | string
  /** 权限标识码 */
  permissionCode?: string
  /** 是否超级专属节点（超管自动拥有） */
  superOnly?: boolean
  /** 是否禁用勾选 */
  disabled?: boolean
  children?: PermissionNode[]
  [key: string]: unknown
}

/** 审计日志条目 */
export interface AuditLogItem {
  id: number | string
  userId?: number | string
  username?: string
  action?: string
  target?: string
  detail?: string
  ip?: string
  createdAt?: string
  [key: string]: unknown
}

/** 系统配置项 */
export interface SystemConfig {
  key: string
  value: string | number | boolean
  category?: string
  description?: string
}

/** 分页查询通用入参 */
export interface PageQuery {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc' | string
  [key: string]: unknown
}

/** 分页列表通用出参 */
export interface PageResult<T> {
  list?: T[]
  records?: T[]
  total?: number
}
