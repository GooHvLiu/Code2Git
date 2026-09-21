<template>
  <!-- 单根组件：外部传入的 class/style/事件等 attrs 由 Vue 自动继承到根 <svg>，
       切勿使用 v-on="$attrs"（会把 class 字符串当作 onClass 事件监听器而告警） -->
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
/**
 * SVG 图标组件
 * 用法：<svg-icon icon-class="user" className="nav-icon" />
 */
import { computed } from 'vue'

interface Props {
  /** svg 文件名（不含目录与后缀） */
  iconClass: string
  /** 追加的类名 */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

const iconName = computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => {
  if (props.className) return `svg-icon ${props.className}`
  return 'svg-icon'
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
