<template>
  <el-tag v-if="dictItem" :type="dictItem.list_class || dictItem.css_class || 'info'" size="small" effect="light">
    {{ dictItem.label }}
  </el-tag>
  <span v-else-if="value !== undefined && value !== null && value !== ''">{{ value }}</span>
  <span v-else>--</span>
</template>

<script setup>
/**
 * 字典标签组件
 * 支持两种方式：
 * 1. 传入 options 数组：<dict-tag :options="statusOptions" :value="row.status" />
 * 2. 传入 dictCode（字典类型编码），自动从后端加载：<dict-tag dict-code="user_status" :value="row.status" />
 *
 * options 格式：[{ label: '正常', value: '1', type: 'success' }]
 * type 可选：success / warning / danger / info / primary
 */
import { ref, computed, watch } from 'vue'
import { getDict, clearDictCache } from '@/utils/dict'

const props = defineProps({
  /** 字典选项列表（手动传入） */
  options: {
    type: Array,
    default: () => []
  },
  /** 字典类型编码（从后端自动加载） */
  dictCode: {
    type: String,
    default: ''
  },
  /** 当前值 */
  value: {
    type: [String, Number],
    default: ''
  }
})

const loadedOptions = ref([])

const finalOptions = computed(() => props.options.length > 0 ? props.options : loadedOptions.value)
const dictItem = computed(() => finalOptions.value.find(item => String(item.value) === String(props.value)))

/** 加载字典数据（使用全局缓存 + 并发请求合并） */
async function loadDictData(code) {
  if (!code) return
  try {
    const list = await getDict(code)
    loadedOptions.value = list
  } catch (e) {
    // 被取消的请求或其他错误静默处理，getDict 内部已处理
  }
}

/** 清除字典缓存（修改字典后调用） */
function clearCache(code) {
  clearDictCache(code)
}

// 暴露方法给父组件
defineExpose({ clearCache })

// 监听 dictCode 变化
watch(() => props.dictCode, (code) => {
  if (code) {
    loadDictData(code)
  }
}, { immediate: true })
</script>
