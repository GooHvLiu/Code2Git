<template>
  <el-tag v-if="dictItem" :type="tagType" size="small" effect="light">
    {{ dictItem.label }}
  </el-tag>
  <span v-else-if="value !== undefined && value !== null && value !== ''">{{ value }}</span>
  <span v-else>--</span>
</template>

<script setup lang="ts">
/**
 * 字典标签组件
 * 支持两种方式：
 * 1. 传入 options 数组：<dict-tag :options="statusOptions" :value="row.status" />
 * 2. 传入 dictCode（字典类型编码），自动从后端加载：<dict-tag dict-code="user_status" :value="row.status" />
 *
 * options / 自动加载的项格式：{ label, value, type, list_class, css_class }
 * type 可选：success / warning / danger / info / primary
 *
 * 字典缓存与内置字典 i18n 由 @/utils/business/dict 统一管理。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDict, clearDictCache, type DictItem } from '@/utils/business/dict'

defineOptions({ name: 'DictTag' })

interface Props {
  /** 字典选项列表（手动传入） */
  options?: DictItem[]
  /** 字典类型编码（从后端自动加载） */
  dictCode?: string
  /** 当前值 */
  value?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  dictCode: '',
  value: ''
})

const { locale } = useI18n()
const loadedOptions = ref<DictItem[]>([])

const finalOptions = computed<DictItem[]>(() => (props.options.length > 0 ? props.options : loadedOptions.value))

const dictItem = computed<DictItem | undefined>(() =>
  finalOptions.value.find(item => String(item.value) === String(props.value))
)

/** el-tag type 合法取值 */
type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/** el-tag type 归一化（list_class / css_class 优先，兜底 info） */
const tagType = computed<TagType>(() => {
  const raw = (dictItem.value?.list_class || dictItem.value?.css_class || dictItem.value?.type || 'info') as string
  const allowed: TagType[] = ['primary', 'success', 'warning', 'danger', 'info']
  return allowed.includes(raw as TagType) ? (raw as TagType) : 'info'
})

async function loadDictData(code: string): Promise<void> {
  if (!code) return
  loadedOptions.value = await getDict(code)
}

/** 清除字典缓存（修改字典后调用） */
function clearCache(code?: string): void {
  clearDictCache(code)
}

defineExpose({ clearCache })

watch(
  () => props.dictCode,
  code => {
    if (code) loadDictData(code)
  },
  { immediate: true }
)

/** 切换 locale 后重新加载字典，确保 label 跟随新语言（无 reload 场景） */
watch(locale, () => {
  if (props.dictCode) loadDictData(props.dictCode)
})
</script>
