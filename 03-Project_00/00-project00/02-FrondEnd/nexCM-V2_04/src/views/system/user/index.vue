<template>
  <div class="user-management">
    <!-- ==================== 搜索表单 ==================== -->
    <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item :label="$t('user.username')" prop="username">
        <el-input v-model="queryParams.username" :placeholder="$t('user.username')" clearable />
      </el-form-item>
      <el-form-item :label="$t('user.role')" prop="role">
        <el-select v-model="queryParams.role" :placeholder="$t('user.role')" clearable style="width: 140px">
          <el-option :label="$t('user.roleAdministrator')" value="administrator" />
          <el-option :label="$t('user.roleEngineer')" value="engineer" />
          <el-option :label="$t('user.roleOperator')" value="operator" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('user.status')" clearable style="width: 120px">
          <el-option :label="$t('user.enable')" :value="1" />
          <el-option :label="$t('user.disable')" :value="0" />
        </el-select>
      </el-form-item>
    </search-form>

    <!-- ==================== 表格工具栏 ==================== -->
    <table-toolbar
      :title="$t('user.title')"
      show-add
      show-refresh
      @add="handleAdd"
      @refresh="refreshList"
    >
      <template #right>
        <el-button
          v-if="selectedIds.length > 0"
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="handleBatchDelete"
        >
          {{ $t('common.delete') }}({{ selectedIds.length }})
        </el-button>
      </template>
    </table-toolbar>

    <!-- ==================== 表格 ==================== -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      :header-cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column :label="$t('common.index')" type="index" width="60" align="center" />
      <el-table-column :label="$t('user.username')" prop="username" min-width="120" align="center" />
      <el-table-column :label="$t('user.realName')" prop="real_name" min-width="100" align="center" />
      <el-table-column :label="$t('user.email')" prop="email" min-width="160" align="center" />
      <el-table-column :label="$t('user.phone')" prop="phone" min-width="120" align="center" />
      <el-table-column :label="$t('user.role')" prop="role" min-width="100" align="center">
        <template slot-scope="{ row }">
          <el-tag size="small">{{ roleMap[row.role] || row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.status')" prop="status" width="80" align="center">
        <template slot-scope="{ row }">
          <dict-tag :options="statusOptions" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.createTime')" prop="create_time" min-width="160" align="center" sortable="custom">
        <template slot-scope="{ row }">
          {{ formatDateTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" width="200" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">{{ $t('common.edit') }}</el-button>
          <el-button type="text" size="small" @click="handleResetPwd(row)">{{ $t('user.resetPassword') }}</el-button>
          <el-button type="text" size="small" style="color: #f56c6c" @click="handleDelete(row)">{{ $t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 分页 ==================== -->
    <pagination
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getList"
    />

    <!-- ==================== 新增/编辑弹窗 ==================== -->
    <user-dialog ref="userDialog" @success="refreshList" />
  </div>
</template>

<script>
/**
 * 用户管理列表页（标准业务模块示例）
 *
 * 展示标准后台管理列表页的完整写法：
 * 1. 使用 tableMixin 封装表格通用逻辑（搜索、分页、加载）
 * 2. 使用 SearchForm 搜索表单组件
 * 3. 使用 TableToolbar 表格工具栏组件
 * 4. 使用 Pagination 分页组件
 * 5. 使用 DictTag 字典标签组件
 * 6. 使用 UserDialog 弹窗组件
 * 7. 批量选择、批量删除、导出、重置密码
 *
 * 新增业务模块可照此模板编写
 */
import tableMixin from '@/mixins/table'
import SearchForm from '@/components/SearchForm/index.vue'
import TableToolbar from '@/components/TableToolbar/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import { formatDate } from '@/utils/date'
import UserDialog from './components/UserDialog.vue'
import {
  requestGetUserListApi,
  requestDeleteUserApi,
  requestBatchDeleteUserApi,
  requestUpdateUserApi
} from '@/api/user'

export default {
  name: 'UserManagement',
  components: { SearchForm, TableToolbar, Pagination, DictTag, UserDialog },
  mixins: [tableMixin],
  data() {
    return {
      /** 获取列表的 API（tableMixin 调用） */
      listApi: requestGetUserListApi,
      /** 搜索表单数据 */
      queryParams: {
        username: '',
        role: '',
        status: ''
      },
      /** 表格数据 */
      tableData: [],
      /** 选中的ID列表 */
      selectedIds: []
    }
  },
  computed: {
    /** 角色映射（国际化，与后端 USER_ROLE 枚举一致） */
    roleMap() {
      return {
        administrator: this.$t('user.roleAdministrator'),
        engineer: this.$t('user.roleEngineer'),
        operator: this.$t('user.roleOperator')
      }
    },
    /** 状态字典（国际化，与后端 USER_STATUS 枚举一致） */
    statusOptions() {
      return [
        { label: this.$t('user.enable'), value: 1, type: 'success' },
        { label: this.$t('user.disable'), value: 0, type: 'danger' }
      ]
    }
  },
  methods: {
    /** 格式化日期时间（模板中使用） */
    formatDateTime(date) {
      return formatDate(date)
    },

    /**
     * 请求前参数转换（tableMixin 钩子）
     * 后端分页参数用 page，tableMixin 用 pageNum，这里做转换
     */
    beforeFetch(params) {
      const { pageNum, ...rest } = params
      return { page: pageNum, ...rest }
    },

    /** 多选变化 */
    handleSelectionChange(selection) {
      this.selectedIds = selection.map(item => item.id)
    },

    /** 新增 */
    handleAdd() {
      this.$refs.userDialog.open()
    },

    /** 编辑 */
    handleEdit(row) {
      this.$refs.userDialog.open(row)
    },

    /** 删除 */
    handleDelete(row) {
      this.$confirm(this.$t('user.deleteConfirm', { name: row.username }), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestDeleteUserApi(row.id)
        this.$message.success(this.$t('user.deleteSuccess'))
        this.refreshList()
      }).catch(() => {})
    },

    /** 批量删除 */
    handleBatchDelete() {
      this.$confirm(this.$t('user.batchDeleteConfirm', { count: this.selectedIds.length }), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestBatchDeleteUserApi(this.selectedIds)
        this.$message.success(this.$t('user.batchDeleteSuccess'))
        this.selectedIds = []
        this.refreshList()
      }).catch(() => {})
    },

    /** 重置密码 */
    handleResetPwd(row) {
      this.$prompt(this.$t('user.resetPasswordPlaceholder'), this.$t('user.resetPasswordTitle'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        inputPattern: /^.{6,32}$/,
        inputErrorMessage: this.$t('user.passwordLength')
      }).then(async ({ value }) => {
        await requestUpdateUserApi({ id: row.id, password: value })
        this.$message.success(this.$t('user.resetPasswordSuccess'))
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
.user-management {
  height: 100%;
}

/* 排序箭头居中 */
/deep/ .el-table .caret-wrapper {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
