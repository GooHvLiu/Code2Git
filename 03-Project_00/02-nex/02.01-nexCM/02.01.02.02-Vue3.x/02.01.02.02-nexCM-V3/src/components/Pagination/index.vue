<template>
  <div class="pagination-container">
    <el-pagination
      v-bind="$attrs"
      :background="background"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      @update:current-page="handleCurrentChange"
      @update:page-size="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 分页组件（Vue3 / Element Plus）
 * 替代 element-ui 时代的 :page.sync / :limit.sync：
 *   <pagination :total="total" v-model:page="pageNum" v-model:limit="pageSize" @pagination="getList" />
 * 作者：GooHv
 */
import { computed } from 'vue'
import config from '@/config'

interface Props {
  /** 总条数 */
  total: number
  /** 当前页码 */
  page?: number
  /** 每页条数 */
  limit?: number
  /** 可选每页条数 */
  pageSizes?: number[]
  /** 布局 */
  layout?: string
  /** 是否有背景 */
  background?: boolean
  /** 是否自动滚动到顶部 */
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  limit: config.PAGE_SIZE,
  pageSizes: () => config.PAGE_SIZES,
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  autoScroll: true
})

const emit = defineEmits<{
  (e: 'update:page', val: number): void
  (e: 'update:limit', val: number): void
  (e: 'pagination', payload: { page: number; limit: number }): void
}>()

const currentPage = computed({
  get: () => props.page,
  set: (val: number) => emit('update:page', val)
})

const pageSize = computed({
  get: () => props.limit,
  set: (val: number) => emit('update:limit', val)
})

function handleSizeChange(val: number): void {
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) window.scrollTo(0, config.SCROLL_TOP_DURATION)
}

function handleCurrentChange(val: number): void {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) window.scrollTo(0, config.SCROLL_TOP_DURATION)
}
</script>

<style scoped lang="less">
.pagination-container {
  padding: 12px 0;
  text-align: right;
}
</style>
