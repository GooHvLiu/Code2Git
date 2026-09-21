/**
 * ==========================================
 * 通用 API 响应与分页类型
 * ==========================================
 * 与后端 Express 返回结构对齐：{ code, message, data }
 */

/** 后端统一响应体 */
export interface ApiResponse<T = unknown> {
  /** 业务码：200 成功，字符串错误码见 utils/config/constants */
  code: number | string
  /** 提示信息（前端不直接使用，文案一律走 i18n） */
  message?: string
  /** 业务数据 */
  data: T
}

/** 分页查询入参 */
export interface PageQuery {
  /** 当前页（从 1 开始） */
  pageNum?: number
  /** 每页条数 */
  pageSize?: number
  /** 关键词模糊搜索 */
  keyword?: string
  /** 排序字段 */
  orderBy?: string
  /** 排序方向 */
  order?: 'asc' | 'desc'
}

/** 分页结果 */
export interface PageResult<T = unknown> {
  /** 列表数据 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
}

/** 键值对字典项 */
export interface DictItem {
  label: string
  value: string | number
  /** 字典类型（如 tag / color） */
  type?: string
  disabled?: boolean
  children?: DictItem[]
}

/** 通用 id 实体 */
export interface BaseEntity {
  id: number | string
  createTime?: string
  updateTime?: string
}
