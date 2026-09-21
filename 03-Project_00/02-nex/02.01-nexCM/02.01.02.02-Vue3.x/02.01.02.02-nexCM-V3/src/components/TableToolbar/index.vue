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
        :icon="Plus"
        size="small"
        @click="emit('add')"
      >
        {{ addText || t('common.add') }}
      </el-button>

      <!-- 导出按钮 -->
      <el-button
        v-if="showExport"
        :icon="Download"
        size="small"
        :loading="exportLoading"
        @click="emit('export')"
      >
        {{ exportText || t('common.export') }}
      </el-button>

      <!-- 刷新按钮 -->
      <el-button
        v-if="showRefresh"
        :icon="Refresh"
        size="small"
        @click="emit('refresh')"
      >
        {{ t('common.refresh') }}
      </el-button>

      <!-- 自定义按钮插槽 -->
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 表格工具栏组件
 * 左侧标题/批量操作，右侧新增/导出/刷新按钮。
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
import { useI18n } from 'vue-i18n'
import { Plus, Download, Refresh } from '@element-plus/icons-vue'

defineOptions({ name: 'TableToolbar' })

interface Props {
  /** 标题 */
  title?: string
  /** 显示新增按钮 */
  showAdd?: boolean
  /** 新增按钮文字 */
  addText?: string
  /** 显示导出按钮 */
  showExport?: boolean
  /** 导出按钮文字 */
  exportText?: string
  /** 导出加载状态 */
  exportLoading?: boolean
  /** 显示刷新按钮 */
  showRefresh?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  showAdd: false,
  addText: '',
  showExport: false,
  exportText: '',
  exportLoading: false,
  showRefresh: false
})

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'export'): void
  (e: 'refresh'): void
}>()

const { t } = useI18n()
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
    align-items: center;
    gap: 8px;

    :deep(.el-button) {
      margin-left: 0;
    }
  }
}
</style>
