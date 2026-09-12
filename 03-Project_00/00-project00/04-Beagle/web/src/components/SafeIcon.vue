<template>
  <el-icon :size="size" :color="color">
    <component :is="resolvedIcon" />
  </el-icon>
</template>

<script setup>
import { computed } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: [Number, String], default: 24 },
  color: { type: String, default: '' },
  // 图标名不存在时的兜底图标
  fallback: { type: String, default: 'Tools' }
})

// 所有合法图标名集合
const iconMap = ElementPlusIconsVue

const resolvedIcon = computed(() => {
  const name = props.name
  if (name && iconMap[name]) return iconMap[name]
  // 兜底：fallback 也不存在时用 Setting（一定存在）
  return iconMap[props.fallback] || iconMap.Setting
})
</script>
