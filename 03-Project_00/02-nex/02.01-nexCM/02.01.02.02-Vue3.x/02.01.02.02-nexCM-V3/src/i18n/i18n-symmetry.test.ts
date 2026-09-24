/**
 * ==========================================
 * i18n 对称性单元测试
 * ==========================================
 * 复用 scripts/i18n-symmetry.mjs 的扁平化思路：递归对比 zh-CN 与 en-US 的完整 key 树
 * 断言：两边叶子 key 完全对称、无空值
 * 作者：GooHv
 */
import { describe, it, expect } from 'vitest'
import zhCN from './modules/index'
import enUS from './modules-en-us/index'

/** 递归收集对象的全部叶子 key（点路径） */
function flattenKeys(obj: unknown, prefix = '', out: Map<string, unknown> = new Map()): Map<string, unknown> {
  if (obj === null || obj === undefined) return out
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    out.set(prefix, obj)
    return out
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flattenKeys(v, p, out)
    } else {
      out.set(p, v)
    }
  }
  return out
}

const zhFlat = flattenKeys(zhCN)
const enFlat = flattenKeys(enUS)

const zhKeys = new Set(zhFlat.keys())
const enKeys = new Set(enFlat.keys())

describe('i18n 对称性', () => {
  it('中英文叶子 key 数量一致', () => {
    expect(zhFlat.size).toBe(enFlat.size)
  })

  it('英文不缺 key（zh 有的 en 必须有）', () => {
    const missing = [...zhKeys].filter(k => !enKeys.has(k))
    expect(missing, `en 缺少 key:\n${missing.join('\n')}`).toEqual([])
  })

  it('中文不缺 key（en 有的 zh 必须有）', () => {
    const missing = [...enKeys].filter(k => !zhKeys.has(k))
    expect(missing, `zh 缺少 key:\n${missing.join('\n')}`).toEqual([])
  })

  it('中文无空值', () => {
    const empty = [...zhFlat.entries()]
      .filter(([, v]) => v === '' || v === null || v === undefined || (typeof v === 'string' && v.trim() === ''))
      .map(([k]) => k)
    expect(empty, `zh 存在空值 key:\n${empty.join('\n')}`).toEqual([])
  })

  it('英文无空值', () => {
    const empty = [...enFlat.entries()]
      .filter(([, v]) => v === '' || v === null || v === undefined || (typeof v === 'string' && v.trim() === ''))
      .map(([k]) => k)
    expect(empty, `en 存在空值 key:\n${empty.join('\n')}`).toEqual([])
  })
})
