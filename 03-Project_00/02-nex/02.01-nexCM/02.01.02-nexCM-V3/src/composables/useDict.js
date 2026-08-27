/**
 * useDict - 字典数据组合式函数
 * 页面中自动加载所需的字典数据，存入 dict 数据对象
 * 替代原 mixins/dict.js
 */
import { ref, onMounted } from 'vue'
import { getDicts } from '@/utils/dict'

export function useDict(dictCodes = []) {
  const dict = ref({})

  async function initDict() {
    if (!dictCodes || !dictCodes.length) return
    const result = await getDicts(dictCodes)
    dict.value = { ...dict.value, ...result }
  }

  onMounted(() => {
    initDict()
  })

  return {
    dict,
    initDict
  }
}
