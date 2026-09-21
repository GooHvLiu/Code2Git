<template>
  <div class="role-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.role.page.title') }}</h2>
        <p class="page-desc">{{ t('superPanel.role.page.pageDesc') }}</p>
      </div>
      <div class="header-right">
        <ExportDropdown
          :data="tableData"
          :columns="exportColumns"
          :title="t('superPanel.role.page.title')"
          :filename="t('superPanel.role.page.title')"
          :exporter="userStore.userInfo?.username || ''"
        />
        <el-button type="primary" size="small" @click="handleAdd">
          <el-icon><Plus /></el-icon>&nbsp;{{ t('common.add') }}
        </el-button>
        <el-button type="primary" size="small" :loading="loading" @click="getList">
          <el-icon><Refresh /></el-icon>&nbsp;{{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- ==================== 表格 ==================== -->
    <el-table v-loading="loading" :element-loading-text="t('common.loading')" :data="tableData" border stripe class="role-table">
      <el-table-column :label="t('common.index')" type="index" width="60" align="center" />
      <el-table-column :label="t('superPanel.role.page.roleName')" min-width="120" align="center">
        <template #default="{ row }">{{ getRoleName(row as RoleItem) }}</template>
      </el-table-column>
      <el-table-column :label="t('superPanel.role.page.roleCode')" prop="role_code" min-width="120" align="center" />
      <el-table-column :label="t('common.status')" prop="status" width="80" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? t('common.enable') : t('common.disable') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.description')" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ getRoleDesc(row as RoleItem) }}</template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" width="150" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            type="text"
            size="small"
            :class="{ 'btn-disabled': isBasicRole(row as RoleItem) }"
            :disabled="isBasicRole(row as RoleItem)"
            @click="handleEdit(row as RoleItem)"
          >
            {{ t('common.edit') }}
          </el-button>
          <el-button
            type="text"
            size="small"
            style="color: var(--el-color-danger)"
            :class="{ 'btn-disabled': isBasicRole(row as RoleItem) }"
            :disabled="isBasicRole(row as RoleItem)"
            @click="handleDelete(row as RoleItem)"
          >
            {{ t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 分页 ==================== -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- ==================== 角色编辑弹窗 ==================== -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="560px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item prop="role_name">
          <template #label>
            {{ t('superPanel.role.page.roleName') }}
            <el-tooltip :content="t('superPanel.role.page.tips.roleName')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.role_name" :maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item prop="role_code">
          <template #label>
            {{ t('superPanel.role.page.roleCode') }}
            <el-tooltip :content="t('superPanel.role.page.tips.roleCode')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.role_code" :disabled="dialog.isEdit" />
        </el-form-item>
        <el-form-item prop="status">
          <template #label>
            {{ t('common.status') }}
            <el-tooltip :content="t('superPanel.role.page.tips.status')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-radio-group v-model="form.status">
            <el-radio :value="1">{{ t('common.enable') }}</el-radio>
            <el-radio :value="0">{{ t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="description">
          <template #label>
            {{ t('common.description') }}
            <el-tooltip :content="t('superPanel.role.page.tips.description')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.description" type="textarea" :rows="2" :maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 角色管理
 * @author GooHv
 * 列表 + 新增/编辑弹窗 + 删除确认；内置角色（is_builtin=1）禁止编辑/删除。
 */
import { ref, reactive, computed } from 'vue'
import { useTable } from '@/composables/useTable'
import type { ExportColumn } from '@/utils/business/exportTable'
import { useI18n } from '@/composables/useI18n'
import { useUserStore } from '@/store/modules/user'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { showSuccess, showError, showWarning, confirmDelete } from '@/utils/ui/feedback'
import { getRoleName, getRoleDesc } from '@/utils/auth/roleMapper'
import {
  requestGetRoleListApi,
  requestCreateRoleApi,
  requestUpdateRoleApi,
  requestDeleteRoleApi
} from '@/api'
import type { RoleItem, RoleForm } from '@/types/super-panel'

const { t } = useI18n()
const userStore = useUserStore()

const queryParams = reactive<Record<string, unknown>>({})
const { loading, tableData, total, pageNum, pageSize, getList, handlePageChange, handleSizeChange } = useTable(
  requestGetRoleListApi as never,
  queryParams
)

const formRef = ref()
const dialog = reactive({ visible: false, title: '', isEdit: false })
const form = reactive<RoleForm>({
  id: null,
  role_name: '',
  role_code: '',
  status: 1,
  description: ''
})

/** 判断是否系统内置角色（依据后端 is_builtin 字段，不硬编码角色编码） */
function isBasicRole(row: RoleItem): boolean {
  return !!row && Number(row.is_builtin) === 1
}

const rules = computed(() => ({
  role_name: [{ required: true, message: t('superPanel.role.page.roleNameRequired'), trigger: 'blur' }],
  role_code: [{ required: true, message: t('superPanel.role.page.roleCodeRequired'), trigger: 'blur' }]
}))

const exportColumns = computed((): ExportColumn[] => [
  { label: t('superPanel.role.page.roleName'), prop: 'role_name', width: 120, formatter: (row) => getRoleName(row as RoleItem) },
  { label: t('superPanel.role.page.roleCode'), prop: 'role_code', width: 120 },
  {
    label: t('common.status'),
    prop: 'status',
    width: 80,
    formatter: (row) => ((row as RoleItem).status === 1 ? t('common.enable') : t('common.disable'))
  },
  { label: t('common.description'), prop: 'description', width: 200, formatter: (row) => getRoleDesc(row as RoleItem) }
])

function resetForm(): void {
  Object.assign(form, { id: null, role_name: '', role_code: '', status: 1, description: '' })
}

function handleAdd(): void {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = t('superPanel.role.page.addRole')
  resetForm()
}

function handleEdit(row: RoleItem): void {
  if (isBasicRole(row as RoleItem)) {
    showWarning(t('superPanel.role.page.basicRoleCannotEdit'))
    return
  }
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = t('superPanel.role.page.editRole')
  resetForm()
  Object.assign(form, row)
}

async function submitForm(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    if (dialog.isEdit) {
      await requestUpdateRoleApi(form.id as string, form)
      showSuccess(t('common.updateSuccess'))
    } else {
      await requestCreateRoleApi(form)
      showSuccess(t('common.createSuccess'))
    }
    dialog.visible = false
    getList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

async function handleDelete(row: RoleItem): Promise<void> {
  if (isBasicRole(row as RoleItem)) {
    showWarning(t('superPanel.role.page.basicRoleCannotDelete'))
    return
  }
  const ok = await confirmDelete(t('superPanel.role.page.deleteConfirm'))
  if (!ok) return
  try {
    await requestDeleteRoleApi(row.id as string)
    showSuccess(t('common.deleteSuccess'))
    getList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}
</script>

<style scoped lang="less">
.role-management {
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

.role-table {
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

.btn-disabled {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
  opacity: 0.6;
  &:hover {
    color: #c0c4cc !important;
  }
}
</style>
