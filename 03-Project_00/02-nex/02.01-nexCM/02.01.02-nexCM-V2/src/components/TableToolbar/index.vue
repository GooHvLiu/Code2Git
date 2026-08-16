<template>
  <div class="table-toolbar">
    <!-- 左侧：标题或批量操作 -->
    <div class="toolbar-left">
      <slot name="left">
        <span v-if="title" class="toolbar-title">{{ title }}</span>
      </slot>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="toolbar-right">
      <!-- 新增按钮 -->
      <el-button
        v-if="showAdd"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="$emit('add')"
      >
        {{ addText || ($t('common.add') || '新增') }}
      </el-button>

      <!-- 导出按钮 -->
      <el-button
        v-if="showExport"
        icon="el-icon-download"
        size="small"
        :loading="exportLoading"
        @click="$emit('export')"
      >
        {{ exportText || ($t('common.export') || '导出') }}
      </el-button>

      <!-- 刷新按钮 -->
      <el-button
        v-if="showRefresh"
        icon="el-icon-refresh"
        size="small"
        @click="$emit('refresh')"
      >
        {{ $t('common.refresh') || '刷新' }}
      </el-button>

      <!-- 自定义按钮插槽 -->
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
/**
 * 表格工具栏组件
 * 左侧标题/批量操作，右侧新增/导出/刷新按钮
 *
 * 用法：
 * <table-toolbar
 *   title="用户列表"
 *   show-add
 *   show-export
 *   show-refresh
 *   @add="handleAdd"
 *   @export="handleExport"
 *   @refresh="refreshList"
 * />
 *
 * 自定义按钮：
 * <table-toolbar>
 *   <template #right>
 *     <el-button size="small" @click="handleCustom">自定义</el-button>
 *   </template>
 * </table-toolbar>
 */
export default {
  name: 'TableToolbar',
  props: {
    /** 标题 */
    title: {
      type: String,
      default: ''
    },
    /** 显示新增按钮 */
    showAdd: {
      type: Boolean,
      default: false
    },
    /** 新增按钮文字 */
    addText: {
      type: String,
      default: ''
    },
    /** 显示导出按钮 */
    showExport: {
      type: Boolean,
      default: false
    },
    /** 导出按钮文字 */
    exportText: {
      type: String,
      default: ''
    },
    /** 导出加载状态 */
    exportLoading: {
      type: Boolean,
      default: false
    },
    /** 显示刷新按钮 */
    showRefresh: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-sm;

  .toolbar-left {
    .toolbar-title {
      font-size: @font-size-md;
      font-weight: 600;
      color: @text-primary;
    }
  }

  .toolbar-right {
    display: flex;
    gap: @spacing-xs;
  }
}
</style>
