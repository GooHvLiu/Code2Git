<template>
  <el-tag v-if="dictItem" :type="dictItem.type || 'info'" size="small" effect="light">
    {{ dictItem.label }}
  </el-tag>
  <span v-else>{{ value }}</span>
</template>

<script>
/**
 * 字典标签组件
 * 根据字典编码和值，显示对应的标签（带颜色）
 *
 * 用法：
 * <dict-tag :options="statusOptions" :value="row.status" />
 *
 * 其中 options 格式：[{ label: '正常', value: '1', type: 'success' }]
 * type 可选：success / warning / danger / info / primary
 */
export default {
  name: 'DictTag',
  props: {
    /** 字典选项列表 */
    options: {
      type: Array,
      default: () => []
    },
    /** 当前值 */
    value: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    dictItem() {
      return this.options.find(item => String(item.value) === String(this.value))
    }
  }
}
</script>
