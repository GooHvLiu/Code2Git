/**
 * useTable - 列表页通用组合式函数
 * 封装列表页的通用逻辑：搜索、分页、加载状态、获取数据
 * 替代原 mixins/table.js
 */
import { ref, onMounted, onUnmounted } from 'vue'
import config from '@/config'
import { getConfig } from '@/utils/config'

export function useTable(listApi, queryParams = {}, options = {}) {
  const { immediate = true, beforeFetch = null } = options

  const loading = ref(false)
  const tableData = ref([])
  const total = ref(0)
  const pageNum = ref(1)
  const pageSize = ref(getConfig('defaultPageSize', config.PAGE_SIZE))
  const orderBy = ref('')
  const orderDir = ref('desc')

  async function getList() {
    if (!listApi) {
      // eslint-disable-next-line no-console
      console.warn('[useTable] 请传入 listApi 方法')
      return
    }
    loading.value = true
    try {
      const params = {
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

  function handleQuery() {
    pageNum.value = 1
    getList()
  }

  function handleReset() {
    Object.keys(queryParams).forEach(key => {
      queryParams[key] = ''
    })
    pageNum.value = 1
    getList()
  }

  function handlePageChange(page) {
    pageNum.value = page
    getList()
  }

  function handleSizeChange(size) {
    pageSize.value = size
    pageNum.value = 1
    getList()
  }

  function handleSortChange({ prop, order }) {
    orderBy.value = prop || ''
    orderDir.value = order === 'ascending' ? 'asc' : 'desc'
    getList()
  }

  function refreshList() {
    getList()
  }

  function handleDefaultPageSizeChanged(event) {
    const newPageSize = event.detail?.pageSize
    if (newPageSize && newPageSize !== pageSize.value) {
      pageSize.value = newPageSize
      pageNum.value = 1
      getList()
    }
  }

  if (immediate) {
    onMounted(() => {
      getList()
      window.addEventListener('defaultPageSizeChanged', handleDefaultPageSizeChanged)
    })
  } else {
    onMounted(() => {
      window.addEventListener('defaultPageSizeChanged', handleDefaultPageSizeChanged)
    })
  }

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
    getList,
    handleQuery,
    handleReset,
    handlePageChange,
    handleSizeChange,
    handleSortChange,
    refreshList
  }
}
