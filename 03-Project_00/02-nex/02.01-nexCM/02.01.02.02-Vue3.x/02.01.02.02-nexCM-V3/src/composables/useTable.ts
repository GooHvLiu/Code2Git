/**
 * useTable - 列表页通用组合式函数
 * 封装列表页的通用逻辑：搜索、分页、加载状态、获取数据
 * 替代原 mixins/table.js
 *
 * 用法：
 *   const { loading, tableData, total, pageNum, pageSize, getList, handleQuery,
 *           handleReset, handlePageChange, handleSizeChange, handleSortChange } =
 *     useTable<UserRow>(getUserListApi, queryParams)
 *
 * 作者：GooHv
 */
import { ref, shallowRef, onMounted, onUnmounted, type Ref } from 'vue'
import config from '@/config'
import { getConfig } from '@/utils/config/config'
import type { ApiResponse } from '@/types/api'

/** 列表接口返回的数据片段（兼容 list / records 两种分页结构） */
export interface ListPageData<T> {
  list?: T[]
  records?: T[]
  total?: number
}

/** 列表查询接口 */
export type ListApi<T> = (params: Record<string, unknown>) => Promise<ApiResponse<ListPageData<T>>>

/** 排序变更载荷 */
export interface TableSortPayload {
  prop?: string
  order?: 'ascending' | 'descending' | null
}

export interface UseTableOptions {
  /** 是否在 onMounted 立即拉取 */
  immediate?: boolean
  /** 请求参数预处理 */
  beforeFetch?: (params: Record<string, unknown>) => Record<string, unknown>
}

export interface UseTableReturn<T, P extends Record<string, unknown>> {
  loading: Ref<boolean>
  tableData: Ref<T[]>
  total: Ref<number>
  pageNum: Ref<number>
  pageSize: Ref<number>
  orderBy: Ref<string>
  orderDir: Ref<string>
  queryParams: P
  getList: () => Promise<void>
  handleQuery: () => void
  handleReset: () => void
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
  handleSortChange: (payload: TableSortPayload) => void
  refreshList: () => void
}

export function useTable<T = Record<string, unknown>, P extends Record<string, unknown> = Record<string, unknown>>(
  listApi: ListApi<T>,
  queryParams: P = {} as P,
  options: UseTableOptions = {}
): UseTableReturn<T, P> {
  const { immediate = true, beforeFetch = null } = options

  const loading = ref<boolean>(false)
  const tableData = shallowRef<T[]>([])
  const total = ref<number>(0)
  const pageNum = ref<number>(1)
  const pageSize = ref<number>(Number(getConfig<number>('defaultPageSize', config.PAGE_SIZE)) || config.PAGE_SIZE)
  const orderBy = ref<string>('')
  const orderDir = ref<string>('desc')

  async function getList(): Promise<void> {
    if (!listApi) {
      // eslint-disable-next-line no-console
      console.warn('[useTable] 请传入 listApi 方法')
      return
    }
    loading.value = true
    try {
      const params: Record<string, unknown> = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        orderBy: orderBy.value,
        orderDir: orderDir.value,
        ...queryParams
      }
      const finalParams = beforeFetch ? beforeFetch(params) : params
      const res = await listApi(finalParams)
      tableData.value = res.data?.list || res.data?.records || []
      total.value = res.data?.total || 0
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      loading.value = false
    }
  }

  function handleQuery(): void {
    pageNum.value = 1
    void getList()
  }

  function handleReset(): void {
    ;(Object.keys(queryParams) as Array<keyof P>).forEach(key => {
      queryParams[key] = '' as P[keyof P]
    })
    pageNum.value = 1
    void getList()
  }

  function handlePageChange(page: number): void {
    pageNum.value = page
    void getList()
  }

  function handleSizeChange(size: number): void {
    pageSize.value = size
    pageNum.value = 1
    void getList()
  }

  function handleSortChange({ prop, order }: TableSortPayload): void {
    orderBy.value = prop || ''
    orderDir.value = order === 'ascending' ? 'asc' : 'desc'
    void getList()
  }

  function refreshList(): void {
    void getList()
  }

  function handleDefaultPageSizeChanged(event: Event): void {
    const detail = (event as CustomEvent<{ pageSize?: number }>).detail
    const newPageSize = detail?.pageSize
    if (newPageSize && newPageSize !== pageSize.value) {
      pageSize.value = newPageSize
      pageNum.value = 1
      void getList()
    }
  }

  onMounted(() => {
    window.addEventListener('defaultPageSizeChanged', handleDefaultPageSizeChanged)
    if (immediate) {
      void getList()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('defaultPageSizeChanged', handleDefaultPageSizeChanged)
  })

  return {
    loading,
    tableData,
    total,
    pageNum,
    pageSize,
    orderBy,
    orderDir,
    queryParams,
    getList,
    handleQuery,
    handleReset,
    handlePageChange,
    handleSizeChange,
    handleSortChange,
    refreshList
  }
}
