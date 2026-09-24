<template>
  <div class="audit-log">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ isAdmin ? t('system.audit.page.title') : t('system.audit.page.myTitle') }}
        </h2>
        <p class="page-desc">{{ t('system.audit.page.pageDesc') }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Refresh" size="small" :loading="loading" @click="refreshList">
          {{ t('common.refresh') }}
        </el-button>
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="isAdmin ? t('system.audit.page.title') : t('system.audit.page.myTitle')"
          :filename="isAdmin ? t('system.audit.page.title') : t('system.audit.page.myTitle')"
          :exporter="(userStore.userInfo?.username as string) || ''"
        />
      </div>
    </div>

    <!-- ==================== 搜索表单 ==================== -->
    <search-form class="search-form" :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item v-if="isAdmin" :label="t('system.audit.page.userName')" prop="userName">
        <el-input
          v-model="queryParams.userName"
          :placeholder="t('system.audit.page.userName')"
          clearable
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item :label="t('system.audit.page.action')" prop="action">
        <el-select
          v-model="queryParams.action"
          :placeholder="t('system.audit.page.action')"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="item in dictMap.audit_action || []"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('system.audit.page.target')" prop="target">
        <el-input
          v-model="queryParams.target"
          :placeholder="t('system.audit.page.target')"
          clearable
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item :label="t('system.audit.page.timeRange')" prop="timeRange">
        <el-date-picker
          v-model="queryParams.timeRange"
          type="datetimerange"
          :start-placeholder="t('system.audit.page.startTime')"
          :end-placeholder="t('system.audit.page.endTime')"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 280px"
        />
      </el-form-item>
    </search-form>

    <!-- ==================== 表格 ==================== -->
    <el-table
      v-loading="loading"
      :element-loading-text="t('common.loading')"
      :data="tableData"
      border
      stripe
      class="audit-table"
    >
      <el-table-column :label="t('common.index')" type="index" width="60" align="center" />
      <el-table-column
        v-if="isAdmin"
        :label="t('system.audit.page.userName')"
        prop="user_name"
        min-width="120"
        align="center"
      />
      <el-table-column :label="t('system.audit.page.action')" prop="action" min-width="140" align="center">
        <template #default="{ row }">{{ getActionText(row.action) }}</template>
      </el-table-column>
      <el-table-column :label="t('system.audit.page.target')" prop="target" min-width="200" show-overflow-tooltip><template #default="{ row }">{{ getTargetText(row.target) }}</template></el-table-column>
      <el-table-column
        :label="t('system.audit.page.oldValue')"
        prop="old_value"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('system.audit.page.newValue')"
        prop="new_value"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column :label="t('system.audit.page.result')" prop="result" width="100" align="center">
        <template #default="{ row }">
          <dict-tag dict-code="audit_result" :value="row.result" />
        </template>
      </el-table-column>
      <el-table-column :label="t('system.audit.page.ip')" prop="ip" width="140" align="center" />
      <el-table-column
        :label="t('system.audit.page.createdAt')"
        prop="create_time"
        min-width="170"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">{{ formatDateTime(row.create_time) }}</template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" width="100" align="center">
        <template #default="{ row }">
          <el-button type="primary" link size="small" :icon="View" @click="handleDetail(row)">
            {{ t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 分页 ==================== -->
    <div class="pagination-section">
      <pagination
        v-model:page="pageNum"
        v-model:limit="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @pagination="getList"
      />
    </div>

    <!-- ==================== 详情对话框 ==================== -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="t('system.audit.page.detailTitle')"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentDetail" :column="1" border>
        <el-descriptions-item :label="t('system.audit.page.userName')">{{
          currentDetail.user_name || '-'
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.action')">{{
          getActionText(currentDetail.action)
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.target')">{{
          getTargetText(currentDetail.target) || '-'
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.oldValue')">{{
          currentDetail.old_value || '-'
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.newValue')">{{
          currentDetail.new_value || '-'
        }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.result')">
          <dict-tag dict-code="audit_result" :value="currentDetail.result" />
        </el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.ip')">{{ currentDetail.ip || '-' }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.audit.page.createdAt')">{{
          formatDateTime(currentDetail.create_time)
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">{{ t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 审计日志页（管理员看全部，普通用户只看自己）
 * 作者：GooHv
 */
import { reactive, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Refresh, View } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { formatDate } from '@/utils/data/date'
import { useUserStore } from '@/store/modules/user'
import { useSysTable } from '@/composables/useSysTable'
import { useSysDict } from '@/composables/useSysDict'
import { requestGetAuditListApi, requestGetMyAuditListApi } from '@/api'
import type { ExportColumn } from '@/utils/business/exportTable'

const { t } = useI18n()
const userStore = useUserStore()

const { dictMap } = useSysDict(['audit_action', 'audit_result'])

interface AuditRow {
  user_name?: string
  action?: string
  target?: string
  old_value?: string
  new_value?: string
  result?: string
  ip?: string
  create_time?: string
  [key: string]: unknown
}

const queryParams = reactive({
  userName: '',
  action: '',
  target: '',
  timeRange: [] as string[]
})

const detailDialogVisible = ref(false)
const currentDetail = ref<AuditRow | null>(null)

/** 是否管理员及以上（role_level <= 2） */
const isAdmin = computed(() => {
  const level = Number((userStore.userInfo as unknown as { role_level?: number }).role_level)
  return level > 0 && level <= 2
})

function beforeFetch(params: Record<string, unknown>) {
  const { pageNum, timeRange, ...rest } = params as { pageNum: number; timeRange?: string[] }
  const result: Record<string, unknown> = { page: pageNum, ...rest }
  if (timeRange && timeRange.length === 2) {
    result.startTime = timeRange[0]
    result.endTime = timeRange[1]
  }
  return result
}

/** 翻译操作类型（缺 key 回退原始 action） */
function getActionText(action?: string): string {
  if (!action) return ''
  const key = `system.audit.action.${action}.title`
  const translated = t(key)
  return translated === key ? action : translated
}

/** 翻译审计目标（缺 key 回退原始 target） */
function getTargetText(target?: string): string {
  if (!target) return ''
  const key = `system.audit.target.${target}`
  const translated = t(key)
  return translated === key ? target : translated
}

const listApi = computed(() => (isAdmin.value ? requestGetAuditListApi : requestGetMyAuditListApi))

const { loading, tableData, total, pageNum, pageSize, getList, handleQuery, handleReset, refreshList } =
  useSysTable<AuditRow>(listApi.value, queryParams, { beforeFetch })

function formatDateTime(date?: string): string {
  return formatDate(date)
}

function handleDetail(row: AuditRow): void {
  currentDetail.value = row
  detailDialogVisible.value = true
}

const exportColumns = computed<ExportColumn[]>(() => {
  const cols: ExportColumn[] = []
  if (isAdmin.value) {
    cols.push({ label: t('system.audit.page.userName'), prop: 'user_name', width: 120 })
  }
  cols.push(
    { label: t('system.audit.page.action'), prop: 'action', width: 140 },
    { label: t('system.audit.page.target'), prop: 'target', width: 200 },
    { label: t('system.audit.page.oldValue'), prop: 'old_value', width: 150 },
    { label: t('system.audit.page.newValue'), prop: 'new_value', width: 150 },
    {
      label: t('system.audit.page.result'),
      prop: 'result',
      width: 80,
      formatter: row =>
        row.result === 'success' ? t('system.audit.page.resultSuccess') : t('system.audit.page.resultFailed')
    },
    { label: t('system.audit.page.ip'), prop: 'ip', width: 130 },
    {
      label: t('system.audit.page.createdAt'),
      prop: 'create_time',
      width: 170,
      formatter: row => formatDate(row.create_time as string)
    }
  )
  return cols
})
</script>

<style scoped lang="less">
.audit-log {
  height: 100%;
  min-height: calc(100vh - 84px);
}

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

.audit-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table .caret-wrapper) {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
