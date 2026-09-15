<template>
  <div class="search-form-wrapper">
    <!-- 搜索条件 -->
    <el-form
      ref="searchForm"
      :model="form"
      :inline="true"
      label-width="90px"
      class="search-form"
      size="small"
    >
      <slot></slot>
    </el-form>

    <!-- 操作按钮 -->
    <div class="search-actions">
      <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">
        {{ $t('common.search') || '搜索' }}
      </el-button>
      <el-button icon="el-icon-refresh-left" size="small" @click="handleReset">
        {{ $t('common.reset') || '重置' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 搜索表单组件
 * 封装搜索/重置按钮
 * 外层 flex 布局，与 TableToolbar 保持一致
 */
import { ref } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'reset'])
const searchFormRef = ref(null)

function handleSearch() {
  emit('search', props.form)
}

function handleReset() {
  searchFormRef.value && searchFormRef.value.resetFields()
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

  /deep/ .el-form-item {
    margin-bottom: 0;
    margin-right: 18px;
  }

  /deep/ .el-form-item__label {
    padding-right: 6px;
    font-size: 13px;
    color: #909399;
    line-height: 30px;
    font-weight: normal;
  }

  /deep/ .el-form-item__content {
    line-height: 30px;
  }

  /deep/ .el-input__inner,
  /deep/ .el-select .el-input__inner {
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

  /deep/ .el-input__icon {
    line-height: 30px;
  }

  /deep/ .el-date-editor .el-input__inner {
    padding-left: 30px;
  }
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  /deep/ .el-button {
    margin-left: 0;
  }
}
</style>
