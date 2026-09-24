/**
 * ==========================================
 * composables/useTable.ts 单元测试
 * ==========================================
 * mock @/utils/config/config 隔离重依赖（api/store/ws）
 * 通过 mount 包裹组件使 onMounted/onUnmounted 正常生效
 * 覆盖分页、搜索、重置、loading 状态
 * 作者：GooHv
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, nextTick, type Ref } from 'vue'
import { mount } from '@vue/test-utils'

// mock 系统配置模块，避免引入 api/websocket 等重链路
vi.mock('@/utils/config/config', () => ({
  getConfig: <T>(_key?: string, defaultValue?: T) => defaultValue
}))

import { useTable } from './useTable'

interface Row {
  id: number
  name: string
}

function renderUseTable(
  listApi: (params: Record<string, unknown>) => Promise<{ data: { list?: Row[]; total?: number } }>,
  queryParams: Record<string, unknown> = {},
  options: Parameters<typeof useTable<Row>>[2] = {}
) {
  let result!: ReturnType<typeof useTable<Row>>
  const Comp = defineComponent({
    setup() {
      result = useTable<Row>(listApi as never, queryParams as never, options)
      return () => null
    }
  })
  const wrapper = mount(Comp)
  return { result, wrapper }
}

const sampleRows: Row[] = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' }
]

function apiResolved() {
  return vi.fn().mockResolvedValue({ data: { list: sampleRows, total: 2 } })
}

describe('useTable', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('immediate=false 时不在挂载时请求', async () => {
    const api = apiResolved()
    renderUseTable(api, {}, { immediate: false })
    expect(api).not.toHaveBeenCalled()
  })

  it('getList 拉取数据并填充 tableData/total', async () => {
    const api = apiResolved()
    const { result } = renderUseTable(api, {}, { immediate: false })
    await result.getList()
    expect(api).toHaveBeenCalled()
    expect(result.tableData.value).toEqual(sampleRows)
    expect(result.total.value).toBe(2)
    expect(result.loading.value).toBe(false)
  })

  it('loading 在请求期间为 true，结束后复位', async () => {
    let resolveApi!: (v: unknown) => void
    const api = vi.fn().mockImplementation(
      () =>
        new Promise(resolve => {
          resolveApi = resolve
        })
    )
    const { result } = renderUseTable(api, {}, { immediate: false })
    const p = result.getList()
    expect(result.loading.value).toBe(true)
    resolveApi({ data: { list: [], total: 0 } })
    await p
    expect(result.loading.value).toBe(false)
  })

  it('handleQuery 重置到第一页并重新请求', async () => {
    const api = apiResolved()
    const { result } = renderUseTable(api, {}, { immediate: false })
    result.pageNum.value = 3
    result.handleQuery()
    await nextTick()
    expect(result.pageNum.value).toBe(1)
    expect(api).toHaveBeenCalledTimes(1)
  })

  it('handleReset 清空查询参数并回到第一页', async () => {
    const api = apiResolved()
    const params = { name: 'init', status: 'on' }
    const { result } = renderUseTable(api, params, { immediate: false })
    result.pageNum.value = 2
    result.handleReset()
    await nextTick()
    expect(params.name).toBe('')
    expect(params.status).toBe('')
    expect(result.pageNum.value).toBe(1)
  })

  it('handlePageChange 更新页码', async () => {
    const api = apiResolved()
    const { result } = renderUseTable(api, {}, { immediate: false })
    result.handlePageChange(5)
    await nextTick()
    expect(result.pageNum.value).toBe(5)
  })

  it('handleSizeChange 更新 pageSize 并回到第一页', async () => {
    const api = apiResolved()
    const { result } = renderUseTable(api, {}, { immediate: false })
    result.pageNum.value = 4
    result.handleSizeChange(50)
    await nextTick()
    expect(result.pageSize.value).toBe(50)
    expect(result.pageNum.value).toBe(1)
  })

  it('handleSortChange 设置排序字段与方向', async () => {
    const api = apiResolved()
    const { result } = renderUseTable(api, {}, { immediate: false })
    result.handleSortChange({ prop: 'createTime', order: 'descending' })
    await nextTick()
    expect(result.orderBy.value).toBe('createTime')
    expect(result.orderDir.value).toBe('desc')
    result.handleSortChange({ prop: 'name', order: 'ascending' })
    expect(result.orderDir.value).toBe('asc')
  })

  it('请求异常时清空 loading 且不抛出', async () => {
    const api = vi.fn().mockRejectedValue(new Error('network'))
    const { result } = renderUseTable(api, {}, { immediate: false })
    await expect(result.getList()).resolves.toBeUndefined()
    expect(result.loading.value).toBe(false)
  })
})
