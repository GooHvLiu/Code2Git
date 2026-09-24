<template>
  <div class="search-form-wrapper">
    <el-form ref="searchFormRef" :model="form" :inline="true" label-width="90px" class="search-form" size="small">
      <slot></slot>
    </el-form>

    <div class="search-actions">
      <el-button :icon="Search" type="primary" size="small" @click="handleSearch">
        {{ t('common.search') }}
      </el-button>
      <el-button :icon="RefreshLeft" size="small" @click="handleReset">
        {{ t('common.reset') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 搜索表单组件：封装搜索/重置按钮，外层 flex 布局。
 * 用法：
 *   <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
 *     <el-form-item .../>
 *   </search-form>
 * 作者：GooHv
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const { t } = useI18n()

interface Props {
  /** 搜索表单数据对象 */
  form: Record<string, unknown>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'search', form: Record<string, unknown>): void
  (e: 'reset', form: Record<string, unknown>): void
}>()

const searchFormRef = ref<FormInstance>()

function handleSearch(): void {
  emit('search', props.form)
}
function handleReset(): void {
  searchFormRef.value?.resetFields()
  emit('reset', props.form)
}
</script>

<style scoped lang="less">
.search-form-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.search-form {
  flex: 1;

  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 18px;
  }

  :deep(.el-form-item__label) {
    padding-right: 6px;
    font-size: 13px;
    color: #909399;
    line-height: 30px;
    font-weight: normal;
  }

  :deep(.el-form-item__content) {
    line-height: 30px;
  }

  :deep(.el-input__inner),
  :deep(.el-select .el-input__inner) {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    border-radius: 4px;
    border-color: #dcdfe6;
    transition: all 0.2s;

    &:hover {
      border-color: #c0c4cc;
    }
    &:focus {
      border-color: #409eff;
    }
  }

  :deep(.el-input__icon) {
    line-height: 30px;
  }

  :deep(.el-date-editor .el-input__inner) {
    padding-left: 30px;
  }
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  :deep(.el-button) {
    margin-left: 0;
  }
}
</style>
