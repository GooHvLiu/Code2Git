<template>
  <div class="search-form-container">
    <el-form
      ref="searchForm"
      :model="form"
      :inline="true"
      label-width="auto"
      class="search-form"
    >
      <!-- 默认插槽：放置表单项 -->
      <slot></slot>

      <!-- 操作按钮 -->
      <el-form-item class="search-actions">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          {{ $t('common.search') || '搜索' }}
        </el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">
          {{ $t('common.reset') || '重置' }}
        </el-button>
        <!-- 折叠/展开按钮（超过默认显示行数时显示） -->
        <el-button
          v-if="collapsible"
          type="text"
          @click="toggleCollapse"
        >
          {{ isCollapsed ? '展开' : '收起' }}
          <i :class="isCollapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/**
 * 搜索表单组件
 * 封装搜索/重置按钮，支持折叠/展开
 *
 * 用法：
 * <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
 *   <el-form-item label="用户名" prop="username">
 *     <el-input v-model="form.username" placeholder="请输入用户名" />
 *   </el-form-item>
 *   <el-form-item label="状态" prop="status">
 *     <el-select v-model="form.status" placeholder="请选择">
 *       <el-option label="正常" value="1" />
 *       <el-option label="禁用" value="0" />
 *     </el-select>
 *   </el-form-item>
 * </search-form>
 */
export default {
  name: 'SearchForm',
  props: {
    /** 表单数据对象（与父组件双向绑定） */
    form: {
      type: Object,
      required: true
    },
    /** 是否可折叠 */
    collapsible: {
      type: Boolean,
      default: false
    },
    /** 默认折叠状态 */
    defaultCollapsed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isCollapsed: this.defaultCollapsed
    }
  },
  methods: {
    /** 搜索 */
    handleSearch() {
      this.$emit('search', this.form)
    },
    /** 重置 */
    handleReset() {
      this.$refs.searchForm && this.$refs.searchForm.resetFields()
      this.$emit('reset', this.form)
    },
    /** 切换折叠 */
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      this.$emit('collapse-change', this.isCollapsed)
    }
  }
}
</script>

<style scoped lang="less">
.search-form-container {
  padding: @spacing-md;
  background: @bg-white;
  border-radius: @border-radius-md;
  margin-bottom: @spacing-md;
}

.search-form {
  .search-actions {
    margin-right: 0;
  }
}
</style>
