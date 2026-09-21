<template>
  <div class="email-config-panel">
    <!-- 操作栏 -->
    <div class="email-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('superPanel.config.email.searchPlaceholder')"
          clearable
          style="width: 280px"
          @clear="loadList"
          @keyup.enter="loadList"
        >
          <template #append>
            <el-button :icon="Search" @click="loadList" />
          </template>
        </el-input>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          {{ t('superPanel.config.email.addBtn') }}
        </el-button>
        <el-button :icon="Refresh" @click="loadList">
          {{ t('superPanel.config.email.refreshBtn') }}
        </el-button>
      </div>
    </div>

    <!-- 配置列表表格 -->
    <el-table v-loading="loading" :data="tableData" :element-loading-text="t('common.loading')" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column prop="name" :label="t('superPanel.config.email.configName')" min-width="150" />
      <el-table-column prop="provider" :label="t('superPanel.config.email.provider')" width="120" align="center">
        <template #default="scope">
          <el-tag size="small">{{ getProviderLabel(scope.row.provider) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="host" :label="t('superPanel.config.email.smtpHost')" min-width="180" />
      <el-table-column prop="port" :label="t('superPanel.config.email.smtpPort')" width="90" align="center" />
      <el-table-column prop="username_masked" :label="t('superPanel.config.email.emailAccount')" min-width="180" />
      <el-table-column prop="from_name" :label="t('superPanel.config.email.senderName')" min-width="120" />
      <el-table-column prop="is_default" :label="t('superPanel.config.email.isDefault')" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_default === 1" type="success" size="small">
            {{ t('superPanel.config.email.default') }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('superPanel.config.email.status')" width="90" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row as EmailRow)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('superPanel.config.email.operations')" width="280" align="center" fixed="right">
        <template #default="scope">
          <el-button text size="small" :icon="Promotion" @click="handleTest(scope.row as EmailRow)">
            {{ t('superPanel.config.email.testBtn') }}
          </el-button>
          <el-button
            v-if="scope.row.is_default !== 1"
            text
            size="small"
            :icon="Star"
            @click="handleSetDefault(scope.row as EmailRow)"
          >
            {{ t('superPanel.config.email.setDefaultBtn') }}
          </el-button>
          <el-button text size="small" :icon="Edit" @click="handleEdit(scope.row as EmailRow)">
            {{ t('superPanel.config.email.editBtn') }}
          </el-button>
          <el-button
            v-if="scope.row.is_default !== 1 && scope.row.is_system !== 1"
            text
            size="small"
            :icon="Delete"
            style="color: #f56c6c"
            @click="handleDelete(scope.row as EmailRow)"
          >
            {{ t('superPanel.config.email.deleteBtn') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="email-pagination">
      <el-pagination
        background
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="emailFormRef" :model="form" :rules="formRules" label-width="130px">
        <el-form-item prop="name">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.configName') }}
              <el-tooltip :content="t('superPanel.config.email.configNameTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.name" :placeholder="t('superPanel.config.email.configNamePlaceholder')" />
        </el-form-item>
        <el-form-item prop="provider">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.provider') }}
              <el-tooltip :content="t('superPanel.config.email.providerTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-select v-model="form.provider" style="width: 100%" @change="handleProviderChange">
            <el-option v-for="item in providerList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="host">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.smtpHost') }}
              <el-tooltip :content="t('superPanel.config.email.smtpHostTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.host" placeholder="smtp.qq.com" />
        </el-form-item>
        <el-form-item prop="port">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.smtpPort') }}
              <el-tooltip :content="t('superPanel.config.email.smtpPortTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input-number v-model="form.port" :min="1" :max="65535" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="secure">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.useSSL') }}
              <el-tooltip :content="t('superPanel.config.email.useSSLTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="form.secure" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item prop="username">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.emailAccount') }}
              <el-tooltip :content="t('superPanel.config.email.emailAccountTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.username" placeholder="example@qq.com" />
        </el-form-item>
        <el-form-item prop="password">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.authCode') }}
              <el-tooltip :content="t('superPanel.config.email.authCodeTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="form.id ? t('superPanel.config.email.authCodePlaceholderEdit') : t('superPanel.config.email.authCodePlaceholder')"
          />
          <div class="form-tip">{{ t('superPanel.config.email.authCodeTip') }}</div>
        </el-form-item>
        <el-form-item prop="from_name">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.senderName') }}
              <el-tooltip :content="t('superPanel.config.email.senderNameTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.from_name" :placeholder="t('superPanel.config.email.senderNamePlaceholder')" />
        </el-form-item>
        <el-form-item prop="is_default">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.isDefault') }}
              <el-tooltip :content="t('superPanel.config.email.isDefaultTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="form.is_default" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item prop="status">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.status') }}
              <el-tooltip :content="t('superPanel.config.email.statusTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item prop="remark">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.remark') }}
              <el-tooltip :content="t('superPanel.config.email.remarkTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('superPanel.config.email.cancelBtn') }}</el-button>
          <el-button type="primary" :loading="saving" @click="handleSave">
            {{ t('superPanel.config.email.saveBtn') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 测试邮件对话框 -->
    <el-dialog
      v-model="testDialogVisible"
      :title="t('superPanel.config.email.testEmailTitle')"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="testForm" label-width="120px">
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.testConfigName') }}
              <el-tooltip :content="t('superPanel.config.email.testConfigNameTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="testForm.configName" disabled />
        </el-form-item>
        <el-form-item prop="toEmail">
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.config.email.testReceiver') }}
              <el-tooltip :content="t('superPanel.config.email.testReceiverTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="testForm.toEmail" placeholder="test@example.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="testDialogVisible = false">{{ t('superPanel.config.email.cancelBtn') }}</el-button>
          <el-button type="primary" :loading="testing" @click="handleSendTest">
            {{ t('superPanel.config.email.sendTestBtn') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 邮箱配置管理（CRUD + 测试发送）
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Refresh, Promotion, Star, Edit, Delete, QuestionFilled
} from '@element-plus/icons-vue'
import {
  requestGetEmailConfigListApi,
  requestCreateEmailConfigApi,
  requestUpdateEmailConfigApi,
  requestDeleteEmailConfigApi,
  requestSetDefaultEmailConfigApi,
  requestUpdateEmailConfigStatusApi,
  requestSendTestEmailApi,
  requestGetEmailProvidersApi
} from '@/api/email'
import { showMessage, confirmAction } from '@/utils/ui/feedback'

defineOptions({ name: 'EmailConfig' })

interface EmailForm {
  id: number | null
  name: string
  provider: string
  host: string
  port: number
  secure: number
  username: string
  password: string
  from_name: string
  is_default: number
  status: number
  remark: string
  [key: string]: unknown
}

interface ProviderItem {
  label: string
  value: string
  host?: string
  port?: number
  secure?: boolean
  [key: string]: unknown
}

interface EmailRow {
  id: number
  provider: string
  is_default: number
  is_system?: number
  status: number
  name: string
  [key: string]: unknown
}

const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const searchKeyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref<EmailRow[]>([])
const providerList = ref<ProviderItem[]>([])
const dialogVisible = ref(false)
const testDialogVisible = ref(false)
const emailFormRef = ref<FormInstance>()

function getEmptyForm(): EmailForm {
  return {
    id: null,
    name: '',
    provider: 'qq',
    host: 'smtp.qq.com',
    port: 465,
    secure: 1,
    username: '',
    password: '',
    from_name: '',
    is_default: 0,
    status: 1,
    remark: ''
  }
}

const form = reactive<EmailForm>(getEmptyForm())

const testForm = reactive({
  configId: null as number | null,
  configName: '',
  toEmail: ''
})

const dialogTitle = computed(() =>
  form.id ? t('superPanel.config.email.editTitle') : t('superPanel.config.email.addTitle')
)

const formRules = computed<FormRules>(() => ({
  name: [{ required: true, message: t('superPanel.config.email.configNameRequired'), trigger: 'blur' }],
  provider: [{ required: true, message: t('superPanel.config.email.providerRequired'), trigger: 'change' }],
  host: [{ required: true, message: t('superPanel.config.email.smtpHostRequired'), trigger: 'blur' }],
  port: [{ required: true, message: t('superPanel.config.email.smtpPortRequired'), trigger: 'blur' }],
  username: [
    { required: true, message: t('superPanel.config.email.emailAccountRequired'), trigger: 'blur' },
    { type: 'email', message: t('superPanel.config.email.emailFormatError'), trigger: 'blur' }
  ],
  password: [{ required: !form.id, message: t('superPanel.config.email.authCodeRequired'), trigger: 'blur' }]
}))

function resetForm(): void {
  Object.assign(form, getEmptyForm())
  emailFormRef.value?.clearValidate()
}

async function loadProviders(): Promise<void> {
  try {
    const res = await requestGetEmailProvidersApi()
    providerList.value = (res.data as ProviderItem[]) || []
  } catch (err) {
    console.error('[邮箱配置] 加载邮箱服务商列表失败:', err)
  }
}

function getProviderLabel(provider: string): string {
  const item = providerList.value.find(p => p.value === provider)
  return item ? item.label : provider
}

async function loadList(): Promise<void> {
  loading.value = true
  try {
    const res = await requestGetEmailConfigListApi({
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
    const data = res.data as { list?: EmailRow[]; total?: number }
    tableData.value = data.list || []
    total.value = data.total || 0
  } catch {
    showMessage(t('superPanel.config.email.loadFailed'), 'error')
  } finally {
    loading.value = false
  }
}

function handleSizeChange(size: number): void {
  pageSize.value = size
  page.value = 1
  loadList()
}

function handleCurrentChange(p: number): void {
  page.value = p
  loadList()
}

function handleAdd(): void {
  resetForm()
  dialogVisible.value = true
}

function handleEdit(row: EmailRow): void {
  Object.assign(form, { ...row, password: '' })
  dialogVisible.value = true
}

function handleProviderChange(provider: string): void {
  const item = providerList.value.find(p => p.value === provider)
  if (item) {
    form.host = item.host || ''
    form.port = item.port || 465
    form.secure = item.secure ? 1 : 0
  }
}

async function handleSave(): Promise<void> {
  try {
    await emailFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    if (form.id) {
      await requestUpdateEmailConfigApi(String(form.id), { ...form })
      showMessage(t('superPanel.config.email.updateSuccess'), 'success')
    } else {
      await requestCreateEmailConfigApi({ ...form })
      showMessage(t('superPanel.config.email.addSuccess'), 'success')
    }
    dialogVisible.value = false
    loadList()
  } catch {
    // 拦截器统一处理
  } finally {
    saving.value = false
  }
}

async function handleDelete(row: EmailRow): Promise<void> {
  try {
    await confirmAction(
      t('superPanel.config.email.deleteConfirm'),
      t('superPanel.config.email.deleteTitle'),
      { type: 'warning', confirmButtonText: t('superPanel.config.email.confirmBtn'), cancelButtonText: t('superPanel.config.email.cancelBtn') }
    )
    await requestDeleteEmailConfigApi(String(row.id))
    showMessage(t('superPanel.config.email.deleteSuccess'), 'success')
    loadList()
  } catch {
    // 取消或拦截器处理
  }
}

async function handleSetDefault(row: EmailRow): Promise<void> {
  try {
    await requestSetDefaultEmailConfigApi(String(row.id))
    showMessage(t('superPanel.config.email.setDefaultSuccess'), 'success')
    loadList()
  } catch (err) {
    console.error('[邮箱配置] 设置默认邮箱配置失败:', err)
  }
}

async function handleStatusChange(row: EmailRow): Promise<void> {
  try {
    await requestUpdateEmailConfigStatusApi(String(row.id), String(row.status))
    showMessage(
      row.status === 1
        ? t('superPanel.config.email.enableSuccess')
        : t('superPanel.config.email.disableSuccess'),
      'success'
    )
  } catch {
    row.status = row.status === 1 ? 0 : 1
  }
}

function handleTest(row: EmailRow): void {
  testForm.configId = row.id
  testForm.configName = row.name
  testForm.toEmail = ''
  testDialogVisible.value = true
}

async function handleSendTest(): Promise<void> {
  if (!testForm.toEmail) {
    showMessage(t('superPanel.config.email.testReceiverRequired'), 'warning')
    return
  }
  testing.value = true
  try {
    await requestSendTestEmailApi({ configId: testForm.configId, toEmail: testForm.toEmail })
    showMessage(t('superPanel.config.email.testSendSuccess'), 'success')
    testDialogVisible.value = false
  } catch {
    // 拦截器统一处理
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  loadProviders()
  loadList()
})
</script>

<style scoped>
.email-config-panel { padding: 20px; }

.email-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
}

.email-pagination {
  margin-top: 16px;
  text-align: right;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

.label-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-tip-icon {
  color: #c0c4cc;
  cursor: help;
  font-size: 14px;
  transition: color 0.2s;
}

.label-tip-icon:hover { color: #409eff; }
</style>
