<template>
  <div class="user-management">
    <!-- ==================== 搜索表单 ==================== -->
    <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item :label="$t('user.username')" prop="username">
        <el-input v-model="queryParams.username" :placeholder="$t('user.username')" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item :label="$t('user.role')" prop="role">
        <el-select v-model="queryParams.role" :placeholder="$t('user.role')" clearable style="width: 120px">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('user.status')" clearable style="width: 100px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="$t('user.title')"
          :filename="$t('user.title')"
          :selected="selectedRows"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
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
          <dict-tag dict-code="user_role" :value="row.role" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.dept')" prop="dept_name" min-width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.dept_name || '-' }}
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

    <!-- ==================== 电子签名弹窗（删除用户用） ==================== -->
    <electronic-signature
      ref="esDialog"
      @confirm="handleEsConfirm"
    />
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
import dictMixin from '@/mixins/dict'
import SearchForm from '@/components/SearchForm/index.vue'
import TableToolbar from '@/components/TableToolbar/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { formatDate } from '@/utils/date'
import UserDialog from './components/UserDialog.vue'
import ElectronicSignature from '@/components/ElectronicSignature/index.vue'
import {
  requestGetUserListApi,
  requestDeleteUserApi,
  requestBatchDeleteUserApi,
  requestUpdateUserApi
} from '@/api'
import { requestGetRoleAllApi } from '@/api'
import { requestGetDeptTreeApi } from '@/api'
import { withCache } from '@/utils/cache'

export default {
  name: 'UserManagement',
  components: { SearchForm, TableToolbar, Pagination, DictTag, ExportDropdown, UserDialog, ElectronicSignature },
  mixins: [tableMixin, dictMixin],
  data() {
    return {
      /** 获取列表的 API（tableMixin 调用） */
      listApi: requestGetUserListApi,
      /** 需要加载的字典编码 */
      dictCodes: ['user_status', 'user_sex', 'user_role'],
      /** 角色列表（从角色管理接口获取） */
      roleList: [],
      /** 部门树（从部门管理接口获取） */
      deptTree: [],
      /** 搜索表单数据 */
      queryParams: {
        username: '',
        role: '',
        status: ''
      },
      /** 表格数据 */
      tableData: [],
      /** 选中的ID列表 */
      selectedIds: [],
      /** 选中的行数据（用于导出选中） */
      selectedRows: [],
      /** 当前待删除操作类型：single / batch */
      pendingDeleteType: '',
      /** 待删除的用户数据 */
      pendingDeleteUser: null
    }
  },
  computed: {
    /** 角色列表（从字典获取，用于下拉框和显示） */
    roleOptions() {
      return this.dict.user_role || []
    },
    /** 角色映射（用于表格显示） */
    roleMap() {
      const map = {}
      this.roleOptions.forEach(item => {
        map[item.value] = item.label
      })
      return map
    },
    /** 状态字典（从数据字典获取） */
    statusOptions() {
      return this.dict.user_status || []
    },
    /** 导出列配置 */
    exportColumns() {
      return [
        { label: this.$t('user.username'), prop: 'username', width: 120 },
        { label: this.$t('user.realName'), prop: 'real_name', width: 100 },
        { label: this.$t('user.email'), prop: 'email', width: 180 },
        { label: this.$t('user.phone'), prop: 'phone', width: 130 },
        {
          label: this.$t('user.role'),
          prop: 'role',
          width: 100,
          formatter: row => this.roleMap[row.role] || row.role
        },
        {
          label: this.$t('user.status'),
          prop: 'status',
          width: 80,
          formatter: row => (row.status === 1 ? this.$t('user.enable') : this.$t('user.disable'))
        },
        {
          label: this.$t('user.createTime'),
          prop: 'create_time',
          width: 170,
          formatter: row => formatDate(row.create_time)
        }
      ]
    }
  },
  created() {
    this.loadRoleList()
    this.loadDeptTree()
  },
  methods: {
    /** 加载角色列表（从角色管理接口，带缓存） */
    async loadRoleList() {
      try {
        const res = await withCache('user_roleList', () => requestGetRoleAllApi())
        this.roleList = res.data || []
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[用户管理] 加载角色列表失败:', e)
      }
    },
    /** 加载部门树（从部门管理接口，带缓存） */
    async loadDeptTree() {
      try {
        const res = await withCache('user_deptTree', () => requestGetDeptTreeApi())
        this.deptTree = res.data || []
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[用户管理] 加载部门树失败:', e)
      }
    },
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
      this.selectedRows = selection
    },

    /** 新增 */
    handleAdd() {
      this.$refs.userDialog.open()
    },

    /** 编辑 */
    handleEdit(row) {
      this.$refs.userDialog.open(row)
    },

    /** 删除（GMP：需电子签名） */
    handleDelete(row) {
      this.pendingDeleteType = 'single'
      this.pendingDeleteUser = row
      this.$refs.esDialog.open({
        operation: `${this.$t('common.delete')} - ${row.username}`,
        userName: this.$store.state.user.userInfo?.username || '',
        extraData: { id: row.id, username: row.username }
      })
    },

    /** 批量删除（GMP：需电子签名） */
    handleBatchDelete() {
      this.pendingDeleteType = 'batch'
      this.pendingDeleteUser = null
      this.$refs.esDialog.open({
        operation: `${this.$t('common.delete')} - ${this.selectedIds.length} ${this.$t('user.title')}`,
        userName: this.$store.state.user.userInfo?.username || '',
        extraData: { ids: [...this.selectedIds] }
      })
    },

    /** 电子签名确认回调 */
    async handleEsConfirm({ password, extraData }) {
      try {
        if (this.pendingDeleteType === 'single') {
          await requestDeleteUserApi(extraData.id, password)
          this.$message.success(this.$t('user.deleteSuccess'))
        } else if (this.pendingDeleteType === 'batch') {
          await requestBatchDeleteUserApi(extraData.ids, password)
          this.$message.success(this.$t('user.batchDeleteSuccess'))
          this.selectedIds = []
        }
        this.$refs.esDialog.close()
        this.refreshList()
      } catch (err) {
        this.$message.error(err.message || this.$t('common.failed'))
      }
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
