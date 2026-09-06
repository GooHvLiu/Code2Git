<template>
  <div class="audit-log">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{
            isAdmin
              ? $t("menu.system.audit.page.title")
              : $t("menu.system.audit.page.myTitle")
          }}
        </h2>
        <p class="page-desc">{{ $t("menu.system.audit.page.pageDesc") }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
          :loading="loading"
          @click="refreshList"
        >
          {{ $t("common.refresh") }}
        </el-button>
        <export-dropdown
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
      </div>
    </div>

    <!-- ==================== 搜索表单 ==================== -->
    <search-form :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item
        v-if="isAdmin"
        :label="$t('menu.system.audit.page.userName')"
        prop="userName"
      >
        <el-input
          v-model="queryParams.userName"
          :placeholder="$t('menu.system.audit.page.userName')"
          clearable
          style="width: 140px"
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
          style="width: 280px"
        />
      </el-form-item>
    </search-form>

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
      class="audit-table"
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
          {{ getActionText(row.action) }}
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
      <el-table-column
        :label="$t('common.operation')"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            @click="handleDetail(row)"
          >
            {{ $t("common.detail") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 分页 ==================== -->
    <div class="pagination-section">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- ==================== 详情对话框 ==================== -->
    <el-dialog
      :title="$t('menu.system.audit.page.detailTitle')"
      :visible.sync="detailDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1" border v-if="currentDetail">
        <el-descriptions-item :label="$t('menu.system.audit.page.userName')">
          {{ currentDetail.user_name || "-" }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.action')">
          {{ getActionText(currentDetail.action) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.target')">
          {{ currentDetail.target || "-" }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.oldValue')">
          {{ currentDetail.old_value || "-" }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.newValue')">
          {{ currentDetail.new_value || "-" }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.result')">
          <dict-tag dict-code="audit_result" :value="currentDetail.result" />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.ip')">
          {{ currentDetail.ip || "-" }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('menu.system.audit.page.createdAt')">
          {{ formatDateTime(currentDetail.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer">
        <el-button @click="detailDialogVisible = false">{{
          $t("common.close")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useTable } from "@/composables/useTable";
import { useDict } from "@/composables/useDict";
import { useI18n } from "@/composables/useI18n";
import SearchForm from "@/components/SearchForm/index.vue";
import DictTag from "@/components/DictTag/index.vue";
import ExportDropdown from "@/components/ExportDropdown/index.vue";
import { formatDate } from "@/utils/date";
import store from "@/store";
import { requestGetAuditListApi, requestGetMyAuditListApi } from "@/api";

const { t: $t } = useI18n();

// 字典数据
const { dict } = useDict(["audit_action", "audit_result"]);

// 搜索参数
const queryParams = reactive({
  userName: "",
  action: "",
  target: "",
  timeRange: [],
});

// 详情对话框
const detailDialogVisible = ref(false);
const currentDetail = ref(null);

// 是否管理员及以上（依据数据库 role_level 字段，等级 <=2）
const isAdmin = computed(() => {
  const level = Number(store?.state?.user?.userInfo?.role_level);
  return level > 0 && level <= 2;
});

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

// 翻译操作类型
function getActionText(action) {
  if (!action) return '';
  const key = `audit.${action}.title`;
  const translated = $t(key);
  // 如果翻译结果和key相同，说明没有对应的翻译，返回原始action
  return translated === key ? action : translated;
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

// 查看详情
function handleDetail(row) {
  currentDetail.value = row;
  detailDialogVisible.value = true;
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
  min-height: calc(100vh - 84px);
}

// 页面头部
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .header-left {
    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;
    }

    .page-desc {
      margin: 8px 0 0;
      font-size: 13px;
      color: #909399;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

// 筛选区域
.filter-section {
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;

  .filter-form {
    .el-form-item {
      margin-bottom: 0;
      margin-right: 16px;
    }
  }
}

// 审计表格
.audit-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

// 分页区域
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 排序箭头居中 */
/deep/ .el-table .caret-wrapper {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
