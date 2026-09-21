/**
 * ==========================================
 * useSysTable - 系统模块类型化表格组合式函数
 * ==========================================
 * 对既有 @/composables/useTable（@ts-nocheck，返回类型松散）做一层类型收窄包装，
 * 供 system/home/error 等列表页统一使用，避免每页重复类型断言。
 *
 * 与 useTable 行为完全一致：列表加载、搜索、重置、分页、排序。
 *
 * 用法：
 *   const { loading, tableData, total, pageNum, pageSize, getList, handleQuery,
 *           handleReset, refreshList, handleSortChange } =
 *     useSysTable<UserRow>(requestGetUserListApi, queryParams, { beforeFetch })
 * 作者：GooHv
 */
import type { Ref } from 'vue'
import { useTable } from '@/composables/useTable'

/** 排序变更载荷 */
export interface SortChangePayload {
  prop?: string | null
  order?: 'ascending' | 'descending' | null
}

/** 表格结果（类型化） */
export interface SysTableResult<T = Record<string, any>> {
  loading: Ref<boolean>
  tableData: Ref<T[]>
  total: Ref<number>
  pageNum: Ref<number>
  pageSize: Ref<number>
  getList: () => Promise<void>
  handleQuery: () => void
  handleReset: () => void
  refreshList: () => void
  handleSortChange: (payload: SortChangePayload) => void
}

/**
 * 类型化包装 useTable
 * @param listApi 列表接口
 * @param queryParams 查询参数对象（响应式）
 * @param options 透传 useTable 选项（immediate / beforeFetch）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSysTable<T = Record<string, any>>(
  listApi: any,
  queryParams: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any> = {}
): SysTableResult<T> {
  return useTable(listApi, queryParams, options) as unknown as SysTableResult<T>
}
