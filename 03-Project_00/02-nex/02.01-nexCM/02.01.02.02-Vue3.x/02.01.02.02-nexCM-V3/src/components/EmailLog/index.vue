<template>
  <div class="email-log-panel">
    <!-- 操作栏 -->
    <div class="email-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('system.config.emailLog.searchPlaceholder')"
          clearable
          style="width: 260px"
          @clear="loadList"
          @keyup.enter="loadList"
        >
          <template #append>
            <el-button :icon="Search" @click="loadList" />
          </template>
        </el-input>

        <el-select
          v-model="filterStatus"
          :placeholder="t('system.config.emailLog.statusFilter')"
          clearable
          style="width: 140px; margin-left: 12px"
          @change="loadList"
        >
          <el-option :label="t('system.config.emailLog.statusSending')" :value="0" />
          <el-option :label="t('system.config.emailLog.statusSuccess')" :value="1" />
          <el-option :label="t('system.config.emailLog.statusFailed')" :value="2" />
        </el-select>

        <el-select
          v-model="filterConfigId"
          :placeholder="t('system.config.emailLog.configFilter')"
          clearable
          filterable
          style="width: 180px; margin-left: 12px"
          @change="loadList"
        >
          <el-option v-for="config in configList" :key="config.id" :label="config.name" :value="config.id" />
        </el-select>
      </div>

      <div class="toolbar-right">
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="t('system.config.emailLog.title')"
          :filename="t('system.config.emailLog.title')"
          :exporter="userStore.userInfo?.username || ''"
        />
        <el-button v-if="multipleSelection.length > 0" type="danger" :icon="Delete" @click="handleBatchDelete">
          {{ t('system.config.emailLog.batchDelete') }} ({{ multipleSelection.length }})
        </el-button>
        <el-button :icon="Refresh" @click="loadList">
          {{ t('system.config.emailLog.refreshBtn') }}
        </el-button>
      </div>
    </div>

    <!-- 日志列表表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :element-loading-text="t('common.loading')"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column
        prop="config_name"
        :label="t('system.config.emailLog.configName')"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="to_email"
        :label="t('system.config.emailLog.recipient')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="subject"
        :label="t('system.config.emailLog.subject')"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="template" :label="t('system.config.emailLog.template')" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.template" size="small" type="info">{{ scope.row.template }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('system.config.emailLog.status')" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success" size="small">
            <el-icon style="margin-right: 3px"><CircleCheckFilled /></el-icon>
            {{ t('system.config.emailLog.statusSuccess') }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger" size="small">
            <el-icon style="margin-right: 3px"><CircleCloseFilled /></el-icon>
            {{ t('system.config.emailLog.statusFailed') }}
          </el-tag>
          <el-tag v-else type="warning" size="small">
            <el-icon class="is-loading" style="margin-right: 3px"><Loading /></el-icon>
            {{ t('system.config.emailLog.statusSending') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="retry_count" :label="t('system.config.emailLog.retryCount')" width="80" align="center">
        <template #default="scope">
          <span v-if="scope.row.retry_count > 0" style="color: #e6a23c">{{ scope.row.retry_count }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="send_duration" :label="t('system.config.emailLog.duration')" width="90" align="center">
        <template #default="scope">{{ scope.row.send_duration }}ms</template>
      </el-table-column>
      <el-table-column
        prop="error_msg"
        :label="t('system.config.emailLog.errorMsg')"
        min-width="180"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span v-if="scope.row.error_msg" style="color: #f56c6c">{{ scope.row.error_msg }}</span>
          <span v-else style="color: #c0c4cc">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="send_time" :label="t('system.config.emailLog.sendTime')" width="170" align="center">
        <template #default="scope">{{ formatTime(scope.row.send_time || scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column :label="t('system.config.emailLog.operations')" width="140" align="center" fixed="right">
        <template #default="scope">
          <el-button text size="small" :icon="View" @click="handleViewDetail(scope.row as EmailLogRow)">
            {{ t('system.config.emailLog.viewDetail') }}
          </el-button>
          <el-button
            text
            size="small"
            :icon="Delete"
            style="color: #f56c6c"
            @click="handleDelete(scope.row as EmailLogRow)"
          >
            {{ t('system.config.emailLog.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 日志详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="t('system.config.emailLog.detailTitle')"
      width="700px"
      append-to-body
    >
      <div v-loading="detailLoading" :element-loading-text="t('common.loading')" class="log-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item :label="t('system.config.emailLog.logId')">{{ currentLog.id }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.status')">
            <el-tag v-if="currentLog.status === 1" type="success" size="small">
              {{ t('system.config.emailLog.statusSuccess') }}
            </el-tag>
            <el-tag v-else-if="currentLog.status === 2" type="danger" size="small">
              {{ t('system.config.emailLog.statusFailed') }}
            </el-tag>
            <el-tag v-else type="warning" size="small">{{ t('system.config.emailLog.statusSending') }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.configName')">{{
            currentLog.config_name
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.recipient')">{{
            currentLog.to_email
          }}</el-descriptions-item>
          <el-descriptions-item v-if="currentLog.cc_email" :label="t('system.config.emailLog.cc')">{{
            currentLog.cc_email
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.subject')">{{
            currentLog.subject
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.template')">{{
            currentLog.template || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.retryCount')">{{
            currentLog.retry_count
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.duration')"
            >{{ currentLog.send_duration }}ms</el-descriptions-item
          >
          <el-descriptions-item :label="t('system.config.emailLog.ip')">{{
            currentLog.ip || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :label="t('system.config.emailLog.sendTime')">
            {{ formatTime(currentLog.send_time || currentLog.create_time) }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="currentLog.error_msg" class="error-section">
          <div class="section-title">
            <el-icon style="color: #f56c6c; margin-right: 5px"><CircleCloseFilled /></el-icon>
            {{ t('system.config.emailLog.errorMsg') }}
          </div>
          <div class="error-content">{{ currentLog.error_msg }}</div>
        </div>

        <div class="content-section">
          <div class="section-title">
            <el-icon style="color: #409eff; margin-right: 5px"><Document /></el-icon>
            {{ t('system.config.emailLog.emailContent') }}
          </div>
          <!-- 后端返回的邮件正文为 HTML，经 v-safe-html（DOMPurify 白名单消毒）后渲染 -->
          <div class="content-html" v-safe-html="currentLog.content"></div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">{{ t('system.config.emailLog.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 邮件发送日志列表（查询/筛选/详情/删除）
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Search,
  Refresh,
  Delete,
  View,
  Document,
  CircleCheckFilled,
  CircleCloseFilled,
  Loading
} from '@element-plus/icons-vue'
import {
  requestGetEmailLogListApi,
  requestGetEmailLogDetailApi,
  requestDeleteEmailLogApi,
  requestBatchDeleteEmailLogsApi,
  requestGetAllEmailConfigsApi
} from '@/api/email'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { useUserStore } from '@/store/modules/user'
import { showMessage, confirmAction } from '@/utils/ui/feedback'
import type { ExportColumn } from '@/utils/business/exportTable'

defineOptions({ name: 'EmailLog' })

interface EmailLogRow {
  id: number
  status: number
  retry_count: number
  send_duration: number
  send_time?: string
  create_time?: string
  content?: string
  [key: string]: unknown
}

interface ConfigOption {
  id: number
  name: string
  [key: string]: unknown
}

const { t } = useI18n()
const userStore = useUserStore()

const loading = ref(false)
const tableData = ref<EmailLogRow[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const filterStatus = ref<number | null>(null)
const filterConfigId = ref<number | null>(null)
const configList = ref<ConfigOption[]>([])
const multipleSelection = ref<EmailLogRow[]>([])
const detailDialogVisible = ref(false)
const detailLoading = ref(false)
const currentLog = reactive<Partial<EmailLogRow>>({})

const exportColumns = computed<ExportColumn[]>(() => [
  { label: 'ID', prop: 'id', width: 80 },
  { label: t('system.config.emailLog.configName'), prop: 'config_name', width: 150 },
  { label: t('system.config.emailLog.recipient'), prop: 'to_email', width: 200 },
  { label: t('system.config.emailLog.subject'), prop: 'subject', width: 250 },
  { label: t('system.config.emailLog.template'), prop: 'template', width: 120 },
  {
    label: t('system.config.emailLog.status'),
    prop: 'status',
    width: 100,
    formatter: (row: Record<string, unknown>) => {
      if (row.status === 1) return t('system.config.emailLog.statusSuccess')
      if (row.status === 2) return t('system.config.emailLog.statusFailed')
      return t('system.config.emailLog.statusSending')
    }
  },
  { label: t('system.config.emailLog.retryCount'), prop: 'retry_count', width: 100 },
  { label: t('system.config.emailLog.duration'), prop: 'send_duration', width: 120 },
  { label: t('system.config.emailLog.errorMsg'), prop: 'error_msg', width: 200 },
  { label: t('system.config.emailLog.ip'), prop: 'ip', width: 130 },
  {
    label: t('system.config.emailLog.sendTime'),
    prop: 'send_time',
    width: 180,
    formatter: (row: Record<string, unknown>) => formatTime(String(row.send_time || row.create_time))
  }
])

async function loadConfigList(): Promise<void> {
  try {
    const res = await requestGetAllEmailConfigsApi()
    configList.value = (res.data as ConfigOption[]) || []
  } catch {
    // 拦截器统一处理
  }
}

async function loadList(): Promise<void> {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }
    if (filterStatus.value !== null && filterStatus.value !== undefined) {
      params.status = filterStatus.value
    }
    if (filterConfigId.value) params.configId = filterConfigId.value
    const res = await requestGetEmailLogListApi(params)
    const data = res.data as { list?: EmailLogRow[]; total?: number }
    tableData.value = data.list || []
    total.value = data.total || 0
  } catch {
    showMessage(t('system.config.emailLog.loadFailed'), 'error')
  } finally {
    loading.value = false
  }
}

function handleSizeChange(size: number): void {
  pageSize.value = size
  page.value = 1
  loadList()
}

function handlePageChange(p: number): void {
  page.value = p
  loadList()
}

function handleSelectionChange(selection: EmailLogRow[]): void {
  multipleSelection.value = selection
}

async function handleViewDetail(row: EmailLogRow): Promise<void> {
  detailDialogVisible.value = true
  detailLoading.value = true
  Object.keys(currentLog).forEach(k => delete currentLog[k])
  try {
    const res = await requestGetEmailLogDetailApi(String(row.id))
    Object.assign(currentLog, (res.data as Partial<EmailLogRow>) || {})
  } catch {
    showMessage(t('system.config.emailLog.detailFailed'), 'error')
  } finally {
    detailLoading.value = false
  }
}

async function handleDelete(row: EmailLogRow): Promise<void> {
  try {
    await confirmAction(t('system.config.emailLog.deleteConfirm'), t('system.config.emailLog.deleteTitle'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    })
    await requestDeleteEmailLogApi(String(row.id))
    showMessage(t('system.config.emailLog.deleteSuccess'), 'success')
    loadList()
  } catch {
    // 取消或拦截器处理
  }
}

async function handleBatchDelete(): Promise<void> {
  if (multipleSelection.value.length === 0) return
  try {
    await confirmAction(
      t('system.config.emailLog.batchDeleteConfirm', { count: multipleSelection.value.length }),
      t('system.config.emailLog.deleteTitle'),
      { type: 'warning', confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel') }
    )
    const ids = multipleSelection.value.map(item => item.id)
    await requestBatchDeleteEmailLogsApi(ids)
    showMessage(t('system.config.emailLog.batchDeleteSuccess'), 'success')
    multipleSelection.value = []
    loadList()
  } catch {
    // 取消或拦截器处理
  }
}

function formatTime(time?: string): string {
  if (!time) return '-'
  const date = new Date(time)
  const pad = (n: number) => (n < 10 ? '0' + n : String(n))
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

onMounted(() => {
  loadConfigList()
  loadList()
})
</script>

<style scoped>
.email-log-panel {
  padding: 0;
}

.email-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.log-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.error-section {
  margin-top: 16px;
  padding: 12px;
  background: #fef0f0;
  border-radius: 4px;
  border-left: 4px solid #f56c6c;
}

.content-section {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.section-title {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.error-content {
  color: #f56c6c;
  font-size: 13px;
  word-break: break-all;
}

.content-html {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
}

.content-html :deep(img) {
  max-width: 100%;
}

.content-html :deep(table) {
  border-collapse: collapse;
  width: 100%;
}

.content-html :deep(td),
.content-html :deep(th) {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
