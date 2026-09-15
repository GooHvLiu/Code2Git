<template>
  <div class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */
import { computed } from 'vue'
import config from '@/config'

const props = defineProps({
  /** 总条数 */
  total: {
    type: Number,
    required: true
  },
  /** 当前页码 */
  page: {
    type: Number,
    default: 1
  },
  /** 每页条数 */
  limit: {
    type: Number,
    default: config.PAGE_SIZE
  },
  /** 可选每页条数 */
  pageSizes: {
    type: Array,
    default: () => config.PAGE_SIZES
  },
  /** 布局 */
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  /** 是否有背景 */
  background: {
    type: Boolean,
    default: true
  },
  /** 是否自动滚动到顶部 */
  autoScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

function handleSizeChange(val) {
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, config.SCROLL_TOP_DURATION)
  }
}

function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, config.SCROLL_TOP_DURATION)
  }
}
</script>

<style scoped lang="less">
.pagination-container {
  padding: @spacing-lg 0;
  text-align: right;
}
</style>
