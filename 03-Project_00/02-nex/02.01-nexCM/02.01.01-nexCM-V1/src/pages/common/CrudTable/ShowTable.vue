<template>
  <div class="show-table">
    <el-table
      ref="elTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 多选列 根据用户的 showSelection 条件渲染 -->
      <el-table-column v-if="showSelection" type="selection" width="50"></el-table-column>
      <!-- 业务列：父页面通过默认插槽传入 -->
      <slot name="business"></slot>
      <!-- 操作列 -->
      <el-table-column v-if="showActions" label="基本操作" :width="actionWidth" fixed="right">
        <template slot-scope="scope">
          <slot name="actions" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="show-table-pagination" v-if="showPagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="innerPage"
        :page-sizes="pageSizes"
        :page-size.sync="innerPageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowTable",
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // loading 状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否显示多选列
    showSelection: {
      type: Boolean,
      default: true
    },
    // 是否显示操作列
    showActions: {
      type: Boolean,
      default: true
    },
    // 操作列宽度
    actionWidth: {
      type: Number,
      default: 180
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 分页
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      innerPage: this.page,
      innerPageSize: this.pageSize
    };
  },
  watch: {
    page(val) {
      this.innerPage = val;
    },
    pageSize(val) {
      this.innerPageSize = val;
    }
  },
  methods: {
    // 选中单行时进行的处理工作
    handleSelectionChange(selection) {
      console.log("当前选中的行数：", selection);
      this.$emit("selection-change", selection);
    },
    // 点击重新排序后的处理工作
    handleSortChange(sortInfo) {
      console.log("当前选中的行重新排序：", sortInfo);
      this.$emit("sort-change", sortInfo);
    },
    handleCurrentChange(page) {
      this.$emit("update:page", page);
      this.$emit("page-change", page);
    },
    handleSizeChange(size) {
      this.$emit("update:pageSize", size);
      this.$emit("size-change", size);
    },
    // 给父组件调用的方法
    clearSelection() {
      this.$refs.elTable.clearSelection();
    },
    doLayout() {
      this.$refs.elTable.doLayout();
    }
  }
};
</script>

<style scoped lang="less">
.show-table {
  &-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
