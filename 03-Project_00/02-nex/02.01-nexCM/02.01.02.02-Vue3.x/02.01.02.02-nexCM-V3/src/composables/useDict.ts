/**
 * useDict - 字典数据组合式函数
 * 页面中自动加载所需的字典数据，存入 dict 数据对象
 * 替代原 mixins/dict.js
 *
 * 用法：
 *   const { dict, initDict } = useDict(['user_status', 'user_sex'])
 *   dict.value.user_status // => DictItem[]
 *
 * 作者：GooHv
 */
import { ref, onMounted, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDicts, type DictItem } from '@/utils/business/dict'

export interface UseDictReturn {
  /** 字典映射：dict.value[code] => DictItem[] */
  dict: Ref<Record<string, DictItem[]>>
  /** 手动重新加载字典 */
  initDict: () => Promise<void>
}

/**
 * @param dictCodes 字典编码数组
 */
export function useDict(dictCodes: string[] = []): UseDictReturn {
  const dict = ref<Record<string, DictItem[]>>({})
  const { locale } = useI18n()

  async function initDict(): Promise<void> {
    if (!dictCodes || !dictCodes.length) return
    const result = await getDicts(dictCodes)
    dict.value = { ...dict.value, ...result }
  }

  onMounted(() => {
    void initDict()
  })

  /** 切换 locale 后重新加载，确保 label 跟随新语言（无 reload 场景） */
  watch(locale, () => {
    void initDict()
  })

  return {
    dict,
    initDict
  }
}
