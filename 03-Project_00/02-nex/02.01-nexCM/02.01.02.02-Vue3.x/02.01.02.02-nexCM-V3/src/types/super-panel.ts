/**
 * ==========================================
 * 超级面板（super-panel）业务实体类型
 * ==========================================
 * 作者：GooHv
 * 与后端表字段对齐，集中放在本文件，避免跨页面重复定义。
 * 字段以后端实际返回为准，未明确处用 [key: string]: unknown 放宽。
 */

/** 启用状态 */
export type EnableStatus = 0 | 1

/** 角色 */
export interface RoleItem {
  id: number | string
  role_name: string
  role_code: string
  status: EnableStatus
  description?: string
  /** 是否内置（内置角色禁止编辑/删除），后端 is_builtin 字段 */
  is_builtin?: 0 | 1
  [key: string]: unknown
}

/** 角色表单 */
export interface RoleForm {
  id: number | string | null
  role_name: string
  role_code: string
  status: EnableStatus
  description: string
}

/** 部门（树形） */
export interface DeptItem {
  id: number | string
  parent_id?: number | string
  dept_name: string
  order_num?: number
  leader?: string
  phone?: string
  email?: string
  status: EnableStatus
  children?: DeptItem[]
  /** 导出用层级（前端扁平化时附加） */
  _level?: number
  [key: string]: unknown
}

/** 部门表单 */
export interface DeptForm {
  id: number | string | null
  parent_id: number
  dept_name: string
  order_num: number
  leader: string
  phone: string
  email: string
  status: EnableStatus
}

/** 字典类型 */
export interface DictTypeItem {
  id: number | string
  dict_name: string
  dict_code: string
  description?: string
  status: EnableStatus
  sort?: number
  [key: string]: unknown
}

/** 字典项 */
export interface DictItemRow {
  id?: number | string
  type_id?: number | string
  label: string
  value: string
  status: EnableStatus
  sort: number
  remark?: string
  [key: string]: unknown
}

/** 功能开关项 */
export interface FeatureItem {
  feature_key: string
  /** 国际化 key（传入 $t） */
  feature_name: string
  /** 国际化 key（传入 $t） */
  description: string
  category: string
  default_value: string
  current_value: string
  [key: string]: unknown
}

/** 功能分类统计 */
export interface FeatureCategoryStat {
  category: string
  enabled_count: number
  total: number
  [key: string]: unknown
}
