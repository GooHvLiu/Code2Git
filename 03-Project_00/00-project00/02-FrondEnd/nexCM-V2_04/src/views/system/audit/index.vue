<template>
  <div class="audit-log">
    <!-- ==================== 搜索表单 ==================== -->
    <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item v-if="isAdmin" :label="$t('audit.userName')" prop="userName">
        <el-input v-model="queryParams.userName" :placeholder="$t('audit.userName')" clearable />
      </el-form-item>
      <el-form-item :label="$t('audit.action')" prop="action">
        <el-input v-model="queryParams.action" :placeholder="$t('audit.action')" clearable />
      </el-form-item>
      <el-form-item :label="$t('audit.target')" prop="target">
        <el-input v-model="queryParams.target" :placeholder="$t('audit.target')" clearable />
      </el-form-item>
      <el-form-item :label="$t('audit.timeRange')" prop="timeRange">
        <el-date-picker
          v-model="queryParams.timeRange"
          type="datetimerange"
          :start-placeholder="$t('audit.startTime')"
          :end-placeholder="$t('audit.endTime')"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
    </search-form>

    <!-- ==================== 表格工具栏 ==================== -->
    <table-toolbar
      :title="isAdmin ? $t('audit.title') : $t('audit.myTitle')"
      show-refresh
      @refresh="refreshList"
    />

    <!-- ==================== 表格 ==================== -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      :header-cell-style="{ textAlign: 'center' }"
    >
      <el-table-column :label="$t('common.index')" type="index" width="60" align="center" />
      <el-table-column v-if="isAdmin" :label="$t('audit.userName')" prop="user_name" min-width="120" align="center" />
      <el-table-column :label="$t('audit.action')" prop="action" min-width="140" align="center">
        <template slot-scope="{ row }">
          <el-tag size="small" :type="actionTagType(row.action)">{{ row.action }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('audit.target')" prop="target" min-width="200" show-overflow-tooltip />
      <el-table-column :label="$t('audit.oldValue')" prop="old_value" min-width="120" show-overflow-tooltip />
      <el-table-column :label="$t('audit.newValue')" prop="new_value" min-width="120" show-overflow-tooltip />
      <el-table-column :label="$t('audit.result')" prop="result" width="100" align="center">
        <template slot-scope="{ row }">
          <el-tag size="small" :type="row.result === 'success' ? 'success' : 'danger'">
            {{ row.result === 'success' ? $t('audit.success') : $t('audit.failed') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('audit.ip')" prop="ip" width="140" align="center" />
      <el-table-column :label="$t('audit.createdAt')" prop="created_at" min-width="170" align="center" sortable="custom">
        <template slot-scope="{ row }">
          {{ formatDateTime(row.created_at) }}
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
  </div>
</template>

<script>
/**
 * 审计追踪页面
 * - 管理员：可查看全部用户的审计日志，支持按用户名/操作类型/操作对象/时间范围筛选
 * - 普通用户：只能查看自己的审计日志，无删除/修改权限
 */
import tableMixin from '@/mixins/table'
import SearchForm from '@/components/SearchForm/index.vue'
import TableToolbar from '@/components/TableToolbar/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { formatDate } from '@/utils/date'
import { requestGetAuditListApi, requestGetMyAuditListApi } from '@/api/audit'

export default {
  name: 'AuditLog',
  components: { SearchForm, TableToolbar, Pagination },
  mixins: [tableMixin],
  data() {
    return {
      listApi: requestGetAuditListApi,
      queryParams: {
        userName: '',
        action: '',
        target: '',
        timeRange: []
      }
    }
  },
  computed: {
    /** 是否管理员 */
    isAdmin() {
      return this.$store.state.user.userInfo?.role === 'administrator'
    }
  },
  methods: {
    /** 格式化日期时间（模板中使用） */
    formatDateTime(date) {
      return formatDate(date)
    },

    /**
     * 请求前参数转换
     */
    beforeFetch(params) {
      const { pageNum, timeRange, ...rest } = params
      const result = { page: pageNum, ...rest }
      // 时间范围转换
      if (timeRange && timeRange.length === 2) {
        result.startTime = timeRange[0]
        result.endTime = timeRange[1]
      }
      // 普通用户只看自己的，调用 /audit/my 接口
      if (!this.isAdmin) {
        this.listApi = requestGetMyAuditListApi
      } else {
        this.listApi = requestGetAuditListApi
      }
      return result
    },

    /** 操作类型标签颜色 */
    actionTagType(action) {
      if (!action) return 'info'
      if (action.includes('修改')) return 'warning'
      if (action.includes('删除')) return 'danger'
      if (action.includes('登录') || action.includes('导出')) return 'success'
      return 'info'
    }
  }
}
</script>

<style scoped lang="less">
.audit-log {
  height: 100%;
}

/* 排序箭头居中 */
/deep/ .el-table .caret-wrapper {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
