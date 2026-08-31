<template>
  <div class="audit-log">
    <!-- ==================== 搜索表单 ==================== -->
    <search-form
      v-permission="'system:audit:search'"
      :form="queryParams"
      @search="handleQuery"
      @reset="handleReset"
    >
      <el-form-item
        v-if="isAdmin"
        :label="$t('menu.system.audit.page.userName')"
        prop="userName"
      >
        <el-input
          v-model="queryParams.userName"
          :placeholder="$t('menu.system.audit.page.userName')"
          clearable
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item :label="$t('menu.system.audit.page.action')" prop="action">
        <el-select
          v-model="queryParams.action"
          :placeholder="$t('menu.system.audit.page.action')"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="item in dict.audit_action || []"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('menu.system.audit.page.target')" prop="target">
        <el-input
          v-model="queryParams.target"
          :placeholder="$t('menu.system.audit.page.target')"
          clearable
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item
        :label="$t('menu.system.audit.page.timeRange')"
        prop="timeRange"
      >
        <el-date-picker
          v-model="queryParams.timeRange"
          type="datetimerange"
          :start-placeholder="$t('menu.system.audit.page.startTime')"
          :end-placeholder="$t('menu.system.audit.page.endTime')"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 240px"
        />
      </el-form-item>
    </search-form>

    <!-- ==================== 表格工具栏 ==================== -->
    <table-toolbar
      :title="
        isAdmin
          ? $t('menu.system.audit.page.title')
          : $t('menu.system.audit.page.myTitle')
      "
      :show-refresh="hasSearchPermission"
      @refresh="refreshList"
    >
      <template #right>
        <export-dropdown
          v-permission="'system:audit:export'"
          :data="tableData"
          :columns="exportColumns"
          :title="
            isAdmin
              ? $t('menu.system.audit.page.title')
              : $t('menu.system.audit.page.myTitle')
          "
          :filename="
            isAdmin
              ? $t('menu.system.audit.page.title')
              : $t('menu.system.audit.page.myTitle')
          "
          :exporter="$store.state.user.userInfo?.username || ''"
        />
      </template>
    </table-toolbar>

    <!-- ==================== 表格 ==================== -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      :header-cell-style="{
        background: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        textAlign: 'center',
      }"
    >
      <el-table-column
        :label="$t('common.index')"
        type="index"
        width="60"
        align="center"
      />
      <el-table-column
        v-if="isAdmin"
        :label="$t('menu.system.audit.page.userName')"
        prop="user_name"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.audit.page.action')"
        prop="action"
        min-width="140"
        align="center"
      >
        <template slot-scope="{ row }">
          <dict-tag dict-code="audit_action" :value="row.action" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.system.audit.page.target')"
        prop="target"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('menu.system.audit.page.oldValue')"
        prop="old_value"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('menu.system.audit.page.newValue')"
        prop="new_value"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('menu.system.audit.page.result')"
        prop="result"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <dict-tag dict-code="audit_result" :value="row.result" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('menu.system.audit.page.ip')"
        prop="ip"
        width="140"
        align="center"
      />
      <el-table-column
        :label="$t('menu.system.audit.page.createdAt')"
        prop="created_at"
        min-width="170"
        align="center"
        sortable="custom"
      >
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

<script setup>
import { reactive, computed } from "vue";
import { useTable } from "@/composables/useTable";
import { useDict } from "@/composables/useDict";
import SearchForm from "@/components/SearchForm/index.vue";
import TableToolbar from "@/components/TableToolbar/index.vue";
import Pagination from "@/components/Pagination/index.vue";
import DictTag from "@/components/DictTag/index.vue";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import { formatDate } from "@/utils/date";
import { hasRole, hasPermission } from "@/utils/permission";
import { requestGetAuditListApi, requestGetMyAuditListApi } from "@/api";

// 字典数据
const { dict } = useDict(["audit_action", "audit_result"]);

// 搜索参数
const queryParams = reactive({
  userName: "",
  action: "",
  target: "",
  timeRange: [],
});

// 是否管理员
const isAdmin = computed(() => hasRole("administrator"));

// 是否有搜索/重置/刷新权限
const hasSearchPermission = computed(() =>
  hasPermission("system:audit:search")
);

// 请求前参数转换
function beforeFetch(params) {
  const { pageNum, timeRange, ...rest } = params;
  const result = { page: pageNum, ...rest };
  // 时间范围转换
  if (timeRange && timeRange.length === 2) {
    result.startTime = timeRange[0];
    result.endTime = timeRange[1];
  }
  return result;
}

// 根据角色选择 API
const listApi = computed(() => {
  return isAdmin.value ? requestGetAuditListApi : requestGetMyAuditListApi;
});

// 使用 useTable 组合式函数
const {
  loading,
  tableData,
  total,
  pageNum,
  pageSize,
  getList,
  handleQuery,
  handleReset,
  refreshList,
} = useTable(listApi.value, queryParams, { beforeFetch });

// 格式化日期时间
function formatDateTime(date) {
  return formatDate(date);
}

// 导出列配置
const exportColumns = computed(() => {
  const cols = [];
  if (isAdmin.value) {
    cols.push({ label: "用户名", prop: "user_name", width: 120 });
  }
  cols.push(
    { label: "操作类型", prop: "action", width: 140 },
    { label: "操作对象", prop: "target", width: 200 },
    { label: "旧值", prop: "old_value", width: 150 },
    { label: "新值", prop: "new_value", width: 150 },
    {
      label: "结果",
      prop: "result",
      width: 80,
      formatter: (row) => (row.result === "success" ? "成功" : "失败"),
    },
    { label: "IP地址", prop: "ip", width: 130 },
    {
      label: "创建时间",
      prop: "created_at",
      width: 170,
      formatter: (row) => formatDate(row.created_at),
    }
  );
  return cols;
});
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
