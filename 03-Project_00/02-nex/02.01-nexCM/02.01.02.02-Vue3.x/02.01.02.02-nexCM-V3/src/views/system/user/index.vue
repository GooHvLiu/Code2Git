<template>
  <div class="user-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ t('system.user.page.title') }}
        </h2>
        <p class="page-desc">{{ t('system.user.page.pageDesc') }}</p>
      </div>
      <div class="header-right">
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="t('system.user.page.title')"
          :filename="t('system.user.page.title')"
          :selected="selectedRows"
          :exporter="(userStore.userInfo?.username as string) || ''"
        />
        <el-button v-if="selectedIds.length > 0" type="danger" :icon="Delete" size="small" @click="handleBatchDelete">
          {{ t('common.delete') }}({{ selectedIds.length }})
        </el-button>
        <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">
          {{ t('common.add') }}
        </el-button>
        <el-button type="primary" :icon="Refresh" size="small" :loading="loading" @click="refreshList">
          {{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- ==================== 搜索表单 ==================== -->
    <search-form class="search-form" :form="queryParams" @search="handleQuery" @reset="handleReset">
      <el-form-item :label="t('system.user.page.username')" prop="username">
        <el-input
          v-model="queryParams.username"
          :placeholder="t('system.user.page.username')"
          clearable
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item :label="t('system.user.page.role')" prop="role">
        <el-select v-model="queryParams.role" :placeholder="t('system.user.page.role')" clearable style="width: 120px">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('system.user.page.status')" prop="status">
        <el-select
          v-model="queryParams.status"
          :placeholder="t('system.user.page.status')"
          clearable
          style="width: 100px"
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </search-form>

    <!-- ==================== 表格 ==================== -->
    <el-table
      v-loading="loading"
      :element-loading-text="t('common.loading')"
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column :label="t('common.index')" type="index" width="60" align="center" />
      <el-table-column :label="t('system.user.page.username')" prop="username" min-width="120" align="center" />
      <el-table-column :label="t('system.user.page.realName')" prop="real_name" min-width="100" align="center" />
      <el-table-column :label="t('system.user.page.email')" prop="email" min-width="160" align="center" />
      <el-table-column :label="t('system.user.page.phone')" prop="phone" min-width="120" align="center" />
      <el-table-column :label="t('system.user.page.role')" prop="role" min-width="100" align="center">
        <template #default="{ row }">
          <dict-tag dict-code="user_role" :value="row.role" />
        </template>
      </el-table-column>
      <el-table-column :label="t('system.user.page.dept')" prop="dept_name" min-width="120" align="center">
        <template #default="{ row }">
          {{ row.dept_name || '-' }}
        </template>
      </el-table-column>
      <el-table-column :label="t('system.user.page.status')" prop="status" width="80" align="center">
        <template #default="{ row }">
          <dict-tag :options="statusOptions" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('system.user.page.createTime')"
        prop="create_time"
        min-width="160"
        align="center"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ formatDateTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" width="240" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row as UserRow)">{{
            t('common.edit')
          }}</el-button>
          <el-button type="primary" link size="small" @click="handleResetPwd(row as UserRow)">{{
            t('system.user.page.resetPassword')
          }}</el-button>
          <el-button
            v-if="isUserLocked(row as UserRow)"
            type="warning"
            link
            size="small"
            @click="handleUnlock(row as UserRow)"
          >
            {{ t('system.user.page.unlock') }}
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row as UserRow)">{{
            t('common.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 分页 ==================== -->
    <pagination v-model:page="pageNum" v-model:limit="pageSize" :total="total" @pagination="getList" />

    <!-- ==================== 新增/编辑弹窗 ==================== -->
    <user-dialog ref="userDialog" @success="refreshList" />

    <!-- ==================== 重置密码弹窗 ==================== -->
    <el-dialog v-model="resetPwdDialogVisible" :title="t('system.user.page.resetPwdTitle')" width="400px">
      <el-form :model="resetPwdForm" label-width="100px">
        <el-form-item :label="t('system.user.page.username')">
          <span>{{ resetPwdUser?.username }}</span>
        </el-form-item>
        <el-form-item :label="t('system.user.page.newPassword')">
          <el-input
            v-model="resetPwdForm.newPassword"
            type="password"
            :placeholder="t('system.user.page.newPasswordPlaceholder')"
            show-password
          />
        </el-form-item>
        <el-form-item :label="t('system.user.page.confirmPassword')">
          <el-input
            v-model="resetPwdForm.confirmPassword"
            type="password"
            :placeholder="t('system.user.page.confirmPasswordPlaceholder')"
            show-password
            @keyup.enter="handleConfirmResetPwd"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPwdDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirmResetPwd">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户管理列表页
 * 作者：GooHv
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Plus, Refresh } from '@element-plus/icons-vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import UserDialog from './components/UserDialog.vue'
import { formatDate } from '@/utils/data/date'
import { withCache } from '@/utils/data/cache'
import { useUserStore } from '@/store/modules/user'
import { useSysTable } from '@/composables/useSysTable'
import { useSysDict } from '@/composables/useSysDict'
import { showSuccess, showWarning, confirmAction } from '@/utils/ui/feedback'
import {
  requestGetUserListApi,
  requestDeleteUserApi,
  requestBatchDeleteUserApi,
  requestResetUserPwdApi,
  requestUnlockUserApi,
  requestGetRoleAllApi,
  requestGetDeptTreeApi
} from '@/api'
import type { DictItem } from '@/utils/business/dict'
import type { ExportColumn } from '@/utils/business/exportTable'

const { t } = useI18n()
const userStore = useUserStore()

const { dictMap } = useSysDict(['user_status', 'user_sex', 'user_role'])

const queryParams = reactive({
  username: '',
  role: '',
  status: ''
})

function beforeFetch(params: Record<string, unknown>) {
  const { pageNum, ...rest } = params
  return { page: pageNum, ...rest }
}

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
  handleSortChange
} = useSysTable<UserRow>(requestGetUserListApi, queryParams, { beforeFetch })

const roleList = ref<Array<Record<string, any>>>([])
const deptTree = ref<Array<Record<string, any>>>([])
const selectedIds = ref<Array<string | number>>([])
const selectedRows = ref<Array<Record<string, any>>>([])
const userDialog = ref<InstanceType<typeof UserDialog>>()

const roleOptions = computed<DictItem[]>(() => dictMap.value.user_role || [])
const statusOptions = computed<DictItem[]>(() => dictMap.value.user_status || [])

interface UserRow {
  id: string | number
  username?: string
  real_name?: string
  email?: string
  phone?: string
  role?: string
  dept_name?: string
  status?: number
  create_time?: string
  lock_until?: string
  [key: string]: unknown
}

const roleMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  roleOptions.value.forEach(item => {
    map[String(item.value)] = item.label
  })
  return map
})

const exportColumns = computed<ExportColumn[]>(() => [
  { label: t('system.user.page.username'), prop: 'username', width: 120 },
  { label: t('system.user.page.realName'), prop: 'real_name', width: 100 },
  { label: t('system.user.page.email'), prop: 'email', width: 180 },
  { label: t('system.user.page.phone'), prop: 'phone', width: 130 },
  {
    label: t('system.user.page.role'),
    prop: 'role',
    width: 100,
    formatter: row => roleMap.value[String(row.role)] || row.role
  },
  {
    label: t('system.user.page.status'),
    prop: 'status',
    width: 80,
    formatter: row => (row.status === 1 ? t('system.user.page.statusEnabled') : t('system.user.page.statusDisabled'))
  },
  {
    label: t('system.user.page.createTime'),
    prop: 'create_time',
    width: 170,
    formatter: row => formatDate(row.create_time as string)
  }
])

async function loadRoleList(): Promise<void> {
  try {
    const res = await withCache('user_roleList', () => requestGetRoleAllApi())
    roleList.value = (res.data as Array<Record<string, any>>) || []
  } catch {
    /* 拦截器已处理 */
  }
}
async function loadDeptTree(): Promise<void> {
  try {
    const res = await withCache('user_deptTree', () => requestGetDeptTreeApi())
    deptTree.value = (res.data as Array<Record<string, any>>) || []
  } catch {
    /* 拦截器已处理 */
  }
}

function formatDateTime(date: string): string {
  return formatDate(date)
}

function handleSelectionChange(selection: UserRow[]): void {
  selectedIds.value = selection.map(item => item.id)
  selectedRows.value = selection
}

function handleAdd(): void {
  userDialog.value?.open()
}
function handleEdit(row: UserRow): void {
  userDialog.value?.open(row)
}

async function handleDelete(row: UserRow): Promise<void> {
  const ok = await confirmAction(
    t('system.user.page.deleteConfirm', { name: row.username }),
    t('system.user.page.title')
  )
  if (!ok) return
  try {
    await requestDeleteUserApi(String(row.id))
    showSuccess(t('system.user.page.deleteSuccess'))
    refreshList()
  } catch {
    /* 拦截器已处理 */
  }
}

async function handleBatchDelete(): Promise<void> {
  if (selectedIds.value.length === 0) {
    showWarning(t('system.user.page.selectToDelete'))
    return
  }
  const ok = await confirmAction(
    t('system.user.page.batchDeleteConfirm', { count: selectedIds.value.length }),
    t('system.user.page.title')
  )
  if (!ok) return
  try {
    await requestBatchDeleteUserApi([...selectedIds.value])
    showSuccess(t('system.user.page.batchDeleteSuccess'))
    selectedIds.value = []
    refreshList()
  } catch {
    /* 拦截器已处理 */
  }
}

// ===== 重置密码 =====
const resetPwdDialogVisible = ref(false)
const resetPwdUser = ref<UserRow | null>(null)
const resetPwdForm = reactive({ newPassword: '', confirmPassword: '' })

function handleResetPwd(row: UserRow): void {
  resetPwdUser.value = row
  resetPwdForm.newPassword = ''
  resetPwdForm.confirmPassword = ''
  resetPwdDialogVisible.value = true
}

async function handleConfirmResetPwd(): Promise<void> {
  if (!resetPwdForm.newPassword || resetPwdForm.newPassword.length < 8) {
    showWarning(t('system.user.page.passwordMinLength8'))
    return
  }
  if (resetPwdForm.newPassword !== resetPwdForm.confirmPassword) {
    showWarning(t('system.user.page.passwordMismatch'))
    return
  }
  try {
    await requestResetUserPwdApi(String(resetPwdUser.value?.id), resetPwdForm.newPassword)
    showSuccess(t('system.user.page.resetPasswordSuccess'))
    resetPwdDialogVisible.value = false
  } catch {
    /* 拦截器已处理 */
  }
}

function isUserLocked(row: UserRow): boolean {
  if (!row.lock_until) return false
  return new Date(row.lock_until).getTime() > Date.now()
}

async function handleUnlock(row: UserRow): Promise<void> {
  const ok = await confirmAction(t('system.user.page.unlockConfirm'), t('common.tip'))
  if (!ok) return
  try {
    await requestUnlockUserApi(String(row.id))
    showSuccess(t('system.user.page.unlockSuccess'))
    getList()
  } catch {
    /* 拦截器已处理 */
  }
}

onMounted(() => {
  loadRoleList()
  loadDeptTree()
})
</script>

<style scoped lang="less">
.user-management {
  padding: 0;
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

:deep(.el-table .caret-wrapper) {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
