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

<script>
/* eslint-disable vue/multi-word-component-names */
import config from '@/config'

export default {
  name: 'Pagination',
  props: {
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
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, config.SCROLL_TOP_DURATION)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, config.SCROLL_TOP_DURATION)
      }
    }
  }
}
</script>

<style scoped lang="less">
.pagination-container {
  padding: @spacing-lg 0;
  text-align: right;
}
</style>
