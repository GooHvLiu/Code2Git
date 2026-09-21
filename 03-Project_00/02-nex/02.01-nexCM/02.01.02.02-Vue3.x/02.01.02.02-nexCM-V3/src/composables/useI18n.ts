/**
 * useI18n - 统一的国际化组合式函数
 *
 * 为什么需要这个？
 * 在组合式 API 中，getCurrentInstance() 在某些生命周期阶段（如组件销毁后、
 * 异步回调中）可能返回 null，导致 proxy.$t 报错。直接绑定 i18n.global 实例更稳。
 *
 * 用法：
 *   import { useI18n } from '@/composables/useI18n'
 *   const { t } = useI18n()
 *   console.log(t('common.confirm'))
 *
 * 作者：GooHv
 */
import { computed, type ComputedRef } from 'vue'
import i18n from '@/i18n'

export interface UseI18nReturn {
  /** 翻译函数：t(key, pluralOrValues?) => string */
  t: typeof i18n.global.t
  /** 翻译存在性检查：te(key) => boolean */
  te: typeof i18n.global.te
  /** 当前语言（响应式） */
  locale: ComputedRef<string>
  /** i18n 实例本体 */
  i18n: typeof i18n
}

export function useI18n(): UseI18nReturn {
  const global = i18n.global
  return {
    t: global.t.bind(global),
    te: global.te.bind(global),
    locale: computed<string>(() => (global.locale as { value: string }).value),
    i18n
  }
}
