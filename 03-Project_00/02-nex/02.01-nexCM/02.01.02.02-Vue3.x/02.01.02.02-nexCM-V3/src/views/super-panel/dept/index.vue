<template>
  <div class="dept-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.dept.page.title') }}</h2>
        <p class="page-desc">{{ t('superPanel.dept.page.pageDesc') }}</p>
      </div>
      <div class="header-right">
        <ExportDropdown
          :data="flatTableData"
          :columns="exportColumns"
          :title="t('superPanel.dept.page.title')"
          :filename="t('superPanel.dept.page.title')"
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

    <!-- ==================== 树形表格 ==================== -->
    <el-table
      v-loading="loading"
      :element-loading-text="t('common.loading')"
      :data="tableData"
      border
      stripe
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      class="dept-table"
    >
      <el-table-column :label="t('superPanel.dept.page.deptName')" prop="dept_name" min-width="200" />
      <el-table-column :label="t('superPanel.dept.page.orderNum')" prop="order_num" width="100" align="center" />
      <el-table-column :label="t('superPanel.dept.page.leader')" prop="leader" width="120" align="center" />
      <el-table-column :label="t('superPanel.dept.page.phone')" prop="phone" width="150" align="center" />
      <el-table-column :label="t('superPanel.dept.page.email')" prop="email" width="200" align="center" />
      <el-table-column :label="t('common.status')" prop="status" width="80" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? t('common.enable') : t('common.disable') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.operation')" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="handleAddChild(row as DeptItem)">{{ t('superPanel.dept.page.addChild') }}</el-button>
          <el-button type="text" size="small" @click="handleEdit(row as DeptItem)">{{ t('common.edit') }}</el-button>
          <el-button type="text" size="small" style="color: var(--el-color-danger)" @click="handleDelete(row as DeptItem)">{{ t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==================== 部门编辑弹窗 ==================== -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="560px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="160px">
        <el-form-item prop="parent_id">
          <template #label>
            {{ t('superPanel.dept.page.parentDept') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.parentDept')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-select v-model="form.parent_id" :placeholder="t('superPanel.dept.page.parentDeptPlaceholder')" style="width: 100%" clearable>
            <el-option v-for="item in flatDeptOptions" :key="item.id" :label="item.dept_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dept_name">
          <template #label>
            {{ t('superPanel.dept.page.deptName') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.deptName')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.dept_name" :maxlength="50" :placeholder="t('superPanel.dept.page.deptNamePlaceholder')" />
        </el-form-item>
        <el-form-item prop="order_num">
          <template #label>
            {{ t('superPanel.dept.page.orderNum') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.orderNum')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input-number v-model="form.order_num" :min="0" />
        </el-form-item>
        <el-form-item prop="leader">
          <template #label>
            {{ t('superPanel.dept.page.leader') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.leader')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.leader" />
        </el-form-item>
        <el-form-item prop="phone">
          <template #label>
            {{ t('superPanel.dept.page.phone') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.phone')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item prop="email">
          <template #label>
            {{ t('superPanel.dept.page.email') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.email')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item prop="status">
          <template #label>
            {{ t('common.status') }}
            <el-tooltip :content="t('superPanel.dept.page.tips.status')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-radio-group v-model="form.status">
            <el-radio :value="1">{{ t('common.enable') }}</el-radio>
            <el-radio :value="0">{{ t('common.disable') }}</el-radio>
          </el-radio-group>
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
 * 部门管理（树形表格）
 * @author GooHv
 * 部门树直接整棵加载，无分页；新增/编辑/删除；上级部门下拉由当前树扁平化生成。
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { ExportColumn } from '@/utils/business/exportTable'
import { useUserStore } from '@/store/modules/user'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { showSuccess, showError, confirmDelete } from '@/utils/ui/feedback'
import {
  requestGetDeptTreeApi,
  requestCreateDeptApi,
  requestUpdateDeptApi,
  requestDeleteDeptApi
} from '@/api'
import type { DeptItem, DeptForm } from '@/types/super-panel'

const { t } = useI18n()
const userStore = useUserStore()

const loading = ref(false)
const tableData = ref<DeptItem[]>([])
const formRef = ref()

const dialog = reactive({ visible: false, title: '', isEdit: false })
const form = reactive<DeptForm>({
  id: null,
  parent_id: 0,
  dept_name: '',
  order_num: 0,
  leader: '',
  phone: '',
  email: '',
  status: 1
})

const rules = {
  dept_name: [{ required: true, message: t('superPanel.dept.page.deptNameRequired'), trigger: 'blur' }]
}

/** 上级部门下拉选项（含根节点） */
interface DeptOption {
  id: number | string
  dept_name: string
}
const flatDeptOptions = computed<DeptOption[]>(() => {
  const result: DeptOption[] = [{ id: 0, dept_name: t('superPanel.dept.page.rootDept') }]
  const flatten = (list: DeptItem[]): void => {
    if (!Array.isArray(list)) return
    list.forEach((item) => {
      result.push({ id: item.id, dept_name: item.dept_name })
      if (item.children && item.children.length > 0) flatten(item.children)
    })
  }
  flatten(tableData.value)
  return result
})

/** 扁平化树形数据用于导出 */
const flatTableData = computed<DeptItem[]>(() => {
  const result: DeptItem[] = []
  const flatten = (list: DeptItem[], level = 0): void => {
    list.forEach((item) => {
      result.push({ ...item, _level: level })
      if (item.children && item.children.length > 0) flatten(item.children, level + 1)
    })
  }
  flatten(tableData.value)
  return result
})

const exportColumns = computed((): ExportColumn[] => [
  { label: t('superPanel.dept.page.deptName'), prop: 'dept_name', width: 200, formatter: (row) => { const r = row as DeptItem; return '  '.repeat(r._level || 0) + r.dept_name } },
  { label: t('superPanel.dept.page.orderNum'), prop: 'order_num', width: 100 },
  { label: t('superPanel.dept.page.leader'), prop: 'leader', width: 120 },
  { label: t('superPanel.dept.page.phone'), prop: 'phone', width: 150 },
  { label: t('superPanel.dept.page.email'), prop: 'email', width: 200 },
  { label: t('common.status'), prop: 'status', width: 80, formatter: (row) => ((row as DeptItem).status === 1 ? t('common.enable') : t('common.disable')) }
])

function resetForm(): void {
  Object.assign(form, { id: null, parent_id: 0, dept_name: '', order_num: 0, leader: '', phone: '', email: '', status: 1 })
}

async function getList(): Promise<void> {
  loading.value = true
  try {
    const res = await requestGetDeptTreeApi()
    tableData.value = (res.data as DeptItem[]) || []
  } finally {
    loading.value = false
  }
}

function handleAdd(): void {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = t('superPanel.dept.page.addDept')
  resetForm()
}

function handleAddChild(row: DeptItem): void {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = t('superPanel.dept.page.addChild')
  resetForm()
  form.parent_id = row.id as number
}

function handleEdit(row: DeptItem): void {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = t('superPanel.dept.page.editDept')
  resetForm()
  Object.assign(form, row)
}

async function submitForm(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    if (dialog.isEdit) {
      await requestUpdateDeptApi(form.id as string, form)
      showSuccess(t('common.updateSuccess'))
    } else {
      await requestCreateDeptApi(form)
      showSuccess(t('common.createSuccess'))
    }
    dialog.visible = false
    getList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

async function handleDelete(row: DeptItem): Promise<void> {
  const ok = await confirmDelete(t('superPanel.dept.page.deleteConfirm'))
  if (!ok) return
  try {
    await requestDeleteDeptApi(row.id as string)
    showSuccess(t('common.deleteSuccess'))
    getList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="less">
.dept-management {
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

.dept-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}
</style>
