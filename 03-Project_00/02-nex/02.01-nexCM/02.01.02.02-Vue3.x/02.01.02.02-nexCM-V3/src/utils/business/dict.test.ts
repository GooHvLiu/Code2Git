/**
 * ==========================================
 * dict.ts 单元测试
 * ==========================================
 * mock @/api 避免引入真实 axios 请求链路
 * 覆盖本地静态字典、缓存、API 拉取与标签/类型取值；
 * 字典 label 国际化（common.dict.items.*）由 i18n 实例提供，未注册 key 时回退后端 label。
 * 作者：GooHv
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { afterEach } from 'vitest'

// mock @/api，仅提供 dict 用到的请求函数
const requestGetDictItemsByCodeApi = vi.fn()
vi.mock('@/api', () => ({
  requestGetDictItemsByCodeApi: (code: string) => requestGetDictItemsByCodeApi(code)
}))

import { getDictTypeLabel, setDict, getDict, getDictLabel, getDictType, clearDictCache } from './dict'

describe('getDictTypeLabel', () => {
  it('无 i18n key 时返回 fallback 兜底', () => {
    expect(getDictTypeLabel('custom_xyz', '自定义字典')).toBe('自定义字典')
  })

  it('无 i18n key 且无 fallback 返回 code 本身', () => {
    expect(getDictTypeLabel('custom_xyz')).toBe('custom_xyz')
  })
})

describe('setDict / getDictLabel / getDictType（本地静态字典）', () => {
  beforeEach(() => clearDictCache())

  it('setDict 后能按 value 取到 label', () => {
    setDict('order_status', [
      { label: '待生产', value: 0, type: 'warning' },
      { label: '生产中', value: 1, type: 'primary' },
      { label: '已完成', value: 2, type: 'success' }
    ])
    expect(getDictLabel('order_status', 0)).toBe('待生产')
    expect(getDictLabel('order_status', 2)).toBe('已完成')
  })

  it('getDictType 返回对应颜色类型', () => {
    setDict('order_status', [
      { label: '待生产', value: 0, type: 'warning' },
      { label: '已完成', value: 2, type: 'success' }
    ])
    expect(getDictType('order_status', 0)).toBe('warning')
    expect(getDictType('order_status', 2)).toBe('success')
  })

  it('未知 value 回退为 info 类型 / 字符串化值', () => {
    setDict('order_status', [{ label: '待生产', value: 0 }])
    expect(getDictType('order_status', 999)).toBe('info')
    expect(getDictLabel('order_status', 999)).toBe('999')
  })

  it('clearDictCache 清空指定 code', () => {
    setDict('a', [{ label: 'A', value: 1 }])
    setDict('b', [{ label: 'B', value: 1 }])
    clearDictCache('a')
    expect(getDictLabel('a', 1)).toBe('1')
    expect(getDictLabel('b', 1)).toBe('B')
  })
})

describe('getDict（API 拉取 + 缓存）', () => {
  beforeEach(() => {
    clearDictCache()
    requestGetDictItemsByCodeApi.mockReset()
  })

  afterEach(() => clearDictCache())

  it('缓存未命中时调用 API 并缓存结果', async () => {
    requestGetDictItemsByCodeApi.mockResolvedValue({
      data: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 }
      ]
    })
    const list = await getDict('user_status')
    expect(requestGetDictItemsByCodeApi).toHaveBeenCalledWith('user_status')
    expect(list).toHaveLength(2)
    // 第二次命中缓存，不再请求
    await getDict('user_status')
    expect(requestGetDictItemsByCodeApi).toHaveBeenCalledTimes(1)
  })

  it('API 异常时返回空数组', async () => {
    requestGetDictItemsByCodeApi.mockRejectedValue(new Error('network'))
    const list = await getDict('broken_dict')
    expect(list).toEqual([])
  })

  it('并发同 key 共享同一请求', async () => {
    requestGetDictItemsByCodeApi.mockResolvedValue({ data: [{ label: 'X', value: 'x' }] })
    const [r1, r2] = await Promise.all([getDict('shared'), getDict('shared')])
    expect(requestGetDictItemsByCodeApi).toHaveBeenCalledTimes(1)
    expect(r1).toEqual(r2)
  })
})
