<template>
  <i v-if="iconName && iconName.indexOf('el-icon-') === 0" :class="iconName"></i>
  <svg
    v-else-if="iconName"
    class="svg-icon"
    aria-hidden="true"
    v-on="$listeners"
  >
    <use :xlink:href="`#icon-${iconName.replace(/\//g, '-')}`" rel="external nofollow" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 支持 icon-class（大多数地方使用）
  iconClass: {
    type: String,
    default: '',
  },
  // 兼容 icon-file-name（部分旧代码使用）
  iconFileName: {
    type: String,
    default: '',
  },
})

// 统一的图标名：优先使用 iconClass，其次使用 iconFileName
const iconName = computed(() => props.iconClass || props.iconFileName || '')

</script>

<style scoped>
.svg-icon {
  width: 1.6em;
  height: 1.6em;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>
