/**
 * ==========================================
 * useSysDict - 系统模块类型化字典组合式函数
 * ==========================================
 * 对既有 @/composables/useDict（@ts-nocheck）做类型收窄：
 * 返回原始 dict ref 与类型化 dictMap（Record<string, DictItem[]>），
 * 供 system 各页面安全读取 user_status / user_role 等字典，避免 `Property 'x' does not exist on '{}'`。
 *
 * 用法：
 *   const { dictMap } = useSysDict(['user_status', 'user_role'])
 *   const statusOptions = computed(() => dictMap.value.user_status || [])
 * 作者：GooHv
 */
import { computed } from 'vue'
import { useDict } from '@/composables/useDict'
import type { DictItem } from '@/utils/business/dict'

/**
 * @param codes 字典编码数组
 */
export function useSysDict(codes: string[]) {
  // useDict 为 @ts-nocheck，参数历史类型为 never[]，此处显式桥接
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { dict } = useDict(codes as any)

  /** 类型化字典映射：dictMap.value.<code> => DictItem[] */
  const dictMap = computed<Record<string, DictItem[]>>(
    () => (dict.value as unknown as Record<string, DictItem[]>) || {}
  )

  return { dict, dictMap }
}
