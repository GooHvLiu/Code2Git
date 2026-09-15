/**
 * useI18n - 统一的国际化组合式函数
 *
 * 为什么需要这个？
 * 在 Vue 2.7 的 <script setup> 中，getCurrentInstance() 在某些生命周期阶段
 * （如组件销毁后、异步回调中）可能返回 null，导致 proxy.$t 报错。
 *
 * 解决方案：直接导入 i18n 单例，使用 i18n.t() 代替 this.$t
 *
 * 用法：
 *   import { useI18n } from '@/composables/useI18n'
 *   const { t } = useI18n()
 *   console.log(t('common.confirm'))
 */
import { computed } from 'vue'
import i18n from '@/i18n'

export function useI18n() {
  return {
    t: i18n.t.bind(i18n),
    te: i18n.te.bind(i18n),
    locale: computed(() => i18n.locale),
    i18n
  }
}
