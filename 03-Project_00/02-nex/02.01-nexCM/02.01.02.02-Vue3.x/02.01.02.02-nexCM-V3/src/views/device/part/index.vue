<template>
  <div class="part-life-page">
    <el-tabs v-model="activeTab" class="part-life-tabs">
      <!-- 寿命详情 -->
      <el-tab-pane :label="t('device.part.tabLife')" name="life">
        <div class="page-toolbar">
          <div class="toolbar-left">
            <el-input v-model="searchKeyword" :placeholder="t('device.part.pageSearchPlaceholder')" clearable style="width: 280px" @clear="loadPartList" @keyup.enter="loadPartList">
              <template #append>
                <el-button v-permission="'device:part:search'" :icon="Search" @click="loadPartList"></el-button>
              </template>
            </el-input>
          </div>
          <div class="toolbar-right">
            <el-button v-permission="'device:part:add'" type="primary" :icon="Plus" @click="handleAdd">{{ t('device.part.add') }}</el-button>
            <el-button v-permission="'device:part:refresh'" :icon="Refresh" @click="loadPartList">{{ t('device.part.refresh') }}</el-button>
          </div>
        </div>

        <!-- 概览卡片 -->
        <el-row :gutter="12" class="overview-row">
          <el-col v-for="(part, index) in filteredParts" :key="part.id || index" :span="6">
            <div class="part-card" :class="getPartStatus(part)">
              <div class="card-header">
                <div class="part-icon"><el-icon :size="20"><component :is="partIconComp(part)" /></el-icon></div>
                <div class="part-info">
                  <div class="part-name">{{ getPartDisplayName(part) }}</div>
                  <div class="part-code">{{ part.part_code || part.code }}</div>
                </div>
                <el-tag :type="getPartStatusTag(part)" size="small" effect="plain">{{ getPartStatusText(part) }}</el-tag>
              </div>
              <div class="card-body">
                <div class="life-info">
                  <div class="life-item">
                    <span class="life-label">{{ t('device.part.formUsedLife') }}</span>
                    <span class="life-value">{{ part.used_life || part.used }}<span class="life-unit">{{ t('device.part.unitTimes') }}</span></span>
                  </div>
                  <div class="life-item">
                    <span class="life-label">{{ t('device.part.formRatedLife') }}</span>
                    <span class="life-value">{{ part.rated_life || part.total }}<span class="life-unit">{{ t('device.part.unitTimes') }}</span></span>
                  </div>
                  <div class="life-item">
                    <span class="life-label">{{ t('device.part.messageRemaining') }}</span>
                    <span class="life-value" :class="getRemainingClass(part)">{{ getRemaining(part) }}<span class="life-unit">{{ t('device.part.unitTimes') }}</span></span>
                  </div>
                </div>
                <div class="life-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getLifePercent(part) + '%' }" :class="getPartStatus(part)"></div>
                  </div>
                  <div class="progress-text">{{ getLifePercent(part).toFixed(1) }}%</div>
                </div>
                <div class="card-footer">
                  <span class="install-date">{{ t('device.part.formInstallDate') }}: {{ formatInstallDate(part) }}</span>
                  <div class="card-actions">
                    <el-button v-permission="'device:part:edit'" type="primary" link size="small" @click="handleEdit(part)">{{ t('device.part.edit') }}</el-button>
                    <el-button v-permission="'device:part:operate'" type="primary" link size="small" @click="handleReplace(part)">{{ t('device.part.operate') }}</el-button>
                    <el-button v-permission="'device:part:delete'" type="danger" link size="small" class="delete-btn" @click="handleDelete(part)">{{ t('device.part.delete') }}</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div v-if="filteredParts.length === 0 && !loading" class="empty-tip">
          <el-icon :size="48"><Box /></el-icon>
          <p>{{ t('device.part.messageNoData') }}</p>
        </div>

        <!-- 详细列表 + 更换记录 -->
        <el-row v-if="filteredParts.length > 0" :gutter="12" class="detail-row">
          <el-col :span="14">
            <div class="panel">
              <div class="panel-header"><span class="panel-title"><el-icon><Tools /></el-icon>{{ t('device.part.pageTitle') }}</span></div>
              <div class="panel-body">
                <el-table v-loading="loading" :data="filteredParts" border stripe :element-loading-text="t('common.loading')" style="width: 100%">
                  <el-table-column :label="t('device.part.formPartName')" width="120" align="center">
                    <template #default="{ row }">
                      <el-icon style="margin-right: 6px; color: #409eff"><component :is="partIconComp(row)" /></el-icon>
                      {{ getPartDisplayName(row) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.formPartCode')" width="140" align="center">
                    <template #default="{ row }">{{ row.part_code || row.code }}</template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.formSpecModel')" width="120" align="center">
                    <template #default="{ row }">{{ row.spec_model || row.spec || '-' }}</template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.tableLifeProgress')" min-width="180">
                    <template #default="{ row }">
                      <div class="table-progress">
                        <div class="tp-bar"><div class="tp-fill" :style="{ width: getLifePercent(row) + '%' }" :class="getPartStatus(row)"></div></div>
                        <span class="tp-text">{{ row.used_life || row.used }}/{{ row.rated_life || row.total }} {{ t('device.part.unitTimes') }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.tableRemainingLife')" width="110" align="center">
                    <template #default="{ row }"><span :class="getRemainingClass(row)">{{ getRemaining(row) }} {{ t('device.part.unitTimes') }}</span></template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.tableStatus')" width="80" align="center">
                    <template #default="{ row }"><el-tag :type="getPartStatusTag(row)" size="small">{{ getPartStatusText(row) }}</el-tag></template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.formInstallDate')" width="110" align="center">
                    <template #default="{ row }">{{ formatInstallDate(row) }}</template>
                  </el-table-column>
                  <el-table-column :label="t('device.part.tableOperation')" width="150" align="center" fixed="right">
                    <template #default="{ row }">
                      <el-button v-permission="'device:part:edit'" type="primary" link size="small" @click="handleEdit(row)">{{ t('device.part.edit') }}</el-button>
                      <el-button v-permission="'device:part:operate'" type="primary" link size="small" @click="handleReplace(row)">{{ t('device.part.operate') }}</el-button>
                      <el-button v-permission="'device:part:delete'" type="danger" link size="small" @click="handleDelete(row)">{{ t('device.part.delete') }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>

          <el-col :span="10">
            <div class="panel">
              <div class="panel-header"><span class="panel-title"><el-icon><Document /></el-icon>{{ t('device.part.messageRecentReplaceRecords') }}</span></div>
              <div class="panel-body">
                <div class="timeline">
                  <div v-for="(record, index) in recentRecords" :key="record.id || index" class="timeline-item">
                    <div class="timeline-dot" :class="record.status"></div>
                    <div v-if="index < recentRecords.length - 1" class="timeline-line"></div>
                    <div class="timeline-content">
                      <div class="tl-header">
                        <span class="tl-part">{{ record.part_name || record.partName }}</span>
                        <el-tag :type="record.status === 'success' ? 'success' : 'danger'" size="small">
                          {{ record.status === 'success' ? t('device.part.messageStatusSuccess') : t('device.part.messageStatusFailed') }}
                        </el-tag>
                      </div>
                      <div class="tl-detail">
                        <span>{{ t('device.part.messageOldCode') }}: {{ record.old_code || record.oldCode }}</span>
                        <span>{{ t('device.part.messageNewCode') }}: {{ record.new_code || record.newCode }}</span>
                      </div>
                      <div class="tl-footer">
                        <span class="tl-operator">{{ t('device.part.messageOperator') }}: {{ record.operator_name || record.operator }}</span>
                        <span class="tl-time">{{ record.replace_time || record.time }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="recentRecords.length === 0" class="empty-tip-small">{{ t('device.part.messageNoRecords') }}</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="partDialogVisible" :title="isEdit ? t('device.part.pageEditBtn') : t('device.part.pageAddBtn')" width="560px" :close-on-click-modal="false" @closed="handlePartDialogClosed">
          <el-form ref="partFormRef" :model="partForm" :rules="partRules" label-width="130px" class="part-dialog-form">
            <el-form-item prop="template_id">
              <template #label>
                {{ t('device.part.formTemplate') }}
                <el-tooltip :content="t('device.part.tipTemplate')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <el-select v-model="partForm.template_id" :placeholder="t('device.part.placeholderSelectTemplate')" style="width: 100%" :disabled="isEdit" @change="handleTemplateChange">
                <el-option v-for="template in templates" :key="template.id" :label="getTemplateName(template)" :value="template.id ?? ''" />
              </el-select>
            </el-form-item>
            <el-form-item prop="part_name">
              <template #label>
                {{ t('device.part.formPartName') }}
                <el-tooltip :content="t('device.part.tipPartName')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <el-input v-model="partForm.part_name" :placeholder="t('device.part.placeholderPartName')" disabled />
            </el-form-item>
            <el-form-item prop="part_code">
              <template #label>
                {{ t('device.part.formPartCode') }}
                <el-tooltip :content="t('device.part.tipPartCode')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <el-input v-model="partForm.part_code" :placeholder="t('device.part.placeholderPartCode')" />
            </el-form-item>
            <el-form-item prop="spec_model">
              <template #label>
                {{ t('device.part.formSpecModel') }}
                <el-tooltip :content="t('device.part.tipSpecModel')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <el-input v-model="partForm.spec_model" :placeholder="t('device.part.placeholderSpecModel')" disabled />
            </el-form-item>
            <el-form-item prop="rated_life">
              <template #label>
                {{ t('device.part.formRatedLife') }}
                <el-tooltip :content="t('device.part.tipRatedLife')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <div class="rated-life-input">
                <el-input-number v-model="partForm.rated_life" :min="1" :max="9999999" :step="1000" controls-position="right" style="width: 100%" disabled />
                <span class="rated-life-unit">{{ t('device.part.unitTimes') }}</span>
              </div>
            </el-form-item>
            <el-form-item prop="install_date">
              <template #label>
                {{ t('device.part.formInstallDate') }}
                <el-tooltip :content="t('device.part.tipInstallDate')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <el-date-picker v-model="partForm.install_date" type="date" :placeholder="t('device.part.placeholderInstallDate')" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
            <el-form-item>
              <template #label>
                {{ t('device.part.formRemark') }}
                <el-tooltip :content="t('device.part.tipRemark')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
              </template>
              <el-input v-model="partForm.remark" type="textarea" :rows="2" :placeholder="t('device.part.placeholderRemark')" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="partDialogVisible = false">{{ t('device.part.messageCancelBtn') }}</el-button>
            <el-button type="primary" :loading="partDialogLoading" @click="confirmPart">{{ t('device.part.messageConfirmBtn') }}</el-button>
          </template>
        </el-dialog>

        <!-- 更换录入弹窗 -->
        <el-dialog v-model="replaceDialogVisible" :title="t('device.part.messageReplaceDialogTitle')" width="560px" :close-on-click-modal="false" @closed="handleDialogClosed">
          <el-form ref="replaceFormRef" :model="replaceForm" :rules="replaceRules" label-width="110px" class="part-dialog-form">
            <el-form-item :label="t('device.part.formReplacePart')" prop="partCode">
              <el-input :model-value="replaceForm.partName" disabled />
            </el-form-item>
            <el-form-item v-if="currentReplacePart" :label="t('device.part.formCurrentCode')">
              <el-input :model-value="replaceForm.partCode" disabled />
            </el-form-item>
            <el-form-item :label="t('device.part.formNewCode')" prop="newCode">
              <el-input v-model="replaceForm.newCode" :placeholder="t('device.part.placeholderNewCode')" clearable />
            </el-form-item>
            <el-form-item :label="t('device.part.formReplaceReason')" prop="reason">
              <el-select v-model="replaceForm.reason" :placeholder="t('device.part.placeholderReplaceReason')" style="width: 100%">
                <el-option :label="t('device.part.replaceReasonLife')" value="life" />
                <el-option :label="t('device.part.replaceReasonDamage')" value="damage" />
                <el-option :label="t('device.part.replaceReasonMaintenance')" value="maintenance" />
                <el-option :label="t('device.part.replaceReasonChangeover')" value="changeover" />
                <el-option :label="t('device.part.replaceReasonOther')" value="other" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('device.part.formRemark')">
              <el-input v-model="replaceForm.remark" type="textarea" :rows="2" :placeholder="t('device.part.placeholderRemark')" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="replaceDialogVisible = false">{{ t('device.part.messageCancelBtn') }}</el-button>
            <el-button type="primary" :loading="replaceLoading" @click="confirmReplace">{{ t('device.part.formConfirmReplace') }}</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>

      <!-- 模板管理 -->
      <el-tab-pane :label="t('device.part.tabTemplate')" name="template">
        <PartTemplateManager ref="templateManagerRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
/**
 * 备件寿命管理：寿命监控 / 增删改 / 更换录入 / 更换记录
 * 作者：GooHv
 */
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Refresh, Box, Tools, Document, QuestionFilled,
  Aim, Operation, TopRight, Download, Cpu
} from '@element-plus/icons-vue'
import {
  getPartList, getPartTemplates, addPart, updatePart, deletePart, replacePart, getReplaceRecords
} from '@/api/device-part'
import { formatDate, getGlobalDateFormat } from '@/utils/data/date'
import { $msg, $confirm } from '@/utils/ui/feedback'
import { useI18n } from '@/composables/useI18n'
import type { Part, PartTemplate, ReplaceRecord } from '@/types/device'
import PartTemplateManager from './components/PartTemplateManager.vue'

const { t } = useI18n()

const loading = ref(false)
const searchKeyword = ref('')
const parts = ref<Part[]>([])
const templates = ref<PartTemplate[]>([])
const recentRecords = ref<ReplaceRecord[]>([])

const activeTab = ref('life')
const templateManagerRef = ref<InstanceType<typeof PartTemplateManager> | null>(null)

const partDialogVisible = ref(false)
const partDialogLoading = ref(false)
const isEdit = ref(false)
const currentEditPart = ref<Part | null>(null)
const partFormRef = ref<FormInstance>()

const partForm = reactive({
  template_id: null as number | string | null,
  part_name: '',
  part_code: '',
  spec_model: '',
  rated_life: 10000,
  install_date: '',
  remark: ''
})

const partRules = computed<FormRules>(() => ({
  template_id: [{ required: true, message: t('device.part.placeholderSelectTemplate'), trigger: 'change' }],
  part_code: [{ required: true, message: t('device.part.placeholderPartCode'), trigger: 'blur' }],
  rated_life: [{ required: true, message: t('device.part.placeholderRatedLife'), trigger: 'blur' }]
}))

const replaceDialogVisible = ref(false)
const replaceLoading = ref(false)
const currentReplacePart = ref<Part | null>(null)
const replaceFormRef = ref<FormInstance>()

const replaceForm = reactive({ partCode: '', partName: '', newCode: '', reason: '', remark: '' })
const replaceRules = computed<FormRules>(() => ({
  newCode: [{ required: true, message: t('device.part.placeholderNewCode'), trigger: 'blur' }],
  reason: [{ required: true, message: t('device.part.placeholderReplaceReason'), trigger: 'change' }]
}))

/** 模板 key -> 图标组件映射 */
const partIconMap: Record<string, unknown> = {
  fill_needle: Aim,
  fill_tube: Operation,
  stopper_rod: TopRight,
  vacuum_unit: Download
}
function partIconComp(part: Part): unknown {
  return partIconMap[part.template_key || ''] || Cpu
}

const filteredParts = computed(() => {
  if (!searchKeyword.value) return parts.value
  const keyword = searchKeyword.value.toLowerCase()
  return parts.value.filter(
    (part) =>
      (part.part_name || part.name || '').toLowerCase().includes(keyword) ||
      (part.part_code || part.code || '').toLowerCase().includes(keyword)
  )
})

function getTemplateName(template: PartTemplate): string {
  const nameKey = template.name_key || template.template_name || template.name || ''
  if (nameKey && nameKey.startsWith('layout.menu.')) return t(nameKey)
  return nameKey
}

function getPartDisplayName(part: Part): string {
  if (part.part_name || part.name) return part.part_name || part.name || ''
  const template = templates.value.find((tmpl) => tmpl.template_key === part.template_key || tmpl.id === part.template_id)
  if (template) return getTemplateName(template)
  return part.part_code || part.code || ''
}

function getPartStatus(part: Part): 'normal' | 'notice' | 'warning' | 'expired' {
  const used = Number(part.used_life || part.used || 0)
  const total = Number(part.rated_life || part.total || 1)
  const percent = used / total
  if (percent >= 1) return 'expired'
  if (percent >= 0.8) return 'warning'
  if (percent >= 0.6) return 'notice'
  return 'normal'
}

function getPartStatusTag(part: Part): 'success' | 'info' | 'warning' | 'danger' {
  const map = { normal: 'success', notice: 'info', warning: 'warning', expired: 'danger' } as const
  return map[getPartStatus(part)]
}

function getPartStatusText(part: Part): string {
  const map = {
    normal: t('device.part.statusNormal'),
    notice: t('device.part.statusWarning'),
    warning: t('device.part.statusCritical'),
    expired: t('device.part.statusExpired')
  }
  return map[getPartStatus(part)]
}

function getLifePercent(part: Part): number {
  const used = Number(part.used_life || part.used || 0)
  const total = Number(part.rated_life || part.total || 1)
  return Math.min((used / total) * 100, 100)
}

function getRemaining(part: Part): number {
  const used = Number(part.used_life || part.used || 0)
  const total = Number(part.rated_life || part.total || 0)
  return Math.max(total - used, 0)
}

function getRemainingClass(part: Part): string {
  const remaining = getRemaining(part)
  const total = Number(part.rated_life || part.total || 1)
  const percent = remaining / total
  if (percent <= 0) return 'text-danger'
  if (percent <= 0.2) return 'text-warning'
  return 'text-success'
}

function formatInstallDate(part: Part): string {
  const raw = part.install_date || part.installDate
  return raw ? formatDate(raw, getGlobalDateFormat()) : '-'
}

async function loadPartList() {
  loading.value = true
  try {
    const res = await getPartList()
    if (res.code === 200) {
      parts.value = (res.data as Part[]) || []
    } else {
      $msg.error(t('device.part.messageLoadFailed'))
    }
  } catch {
    $msg.error(t('device.part.messageLoadFailed'))
  } finally {
    loading.value = false
  }
}

async function loadTemplates() {
  try {
    const res = await getPartTemplates()
    if (res.code === 200) templates.value = (res.data as PartTemplate[]) || []
  } catch {
    /* 静默失败 */
  }
}

async function loadReplaceRecords() {
  try {
    const res = await getReplaceRecords({ page: 1, pageSize: 10 })
    if (res.code === 200) {
      const data = res.data as { list?: ReplaceRecord[] } | ReplaceRecord[]
      recentRecords.value = Array.isArray(data) ? data : data?.list || []
    }
  } catch {
    /* 静默失败 */
  }
}

function handleAdd() {
  isEdit.value = false
  currentEditPart.value = null
  Object.assign(partForm, { template_id: null, part_name: '', part_code: '', spec_model: '', rated_life: 10000, install_date: '', remark: '' })
  partDialogVisible.value = true
}

function handleEdit(part: Part) {
  isEdit.value = true
  currentEditPart.value = part
  Object.assign(partForm, {
    template_id: part.template_id ?? null,
    part_name: part.part_name || part.name || '',
    part_code: part.part_code || part.code || '',
    spec_model: part.spec_model || part.spec || '',
    rated_life: Number(part.rated_life || part.total || 10000),
    install_date: part.install_date || part.installDate || '',
    remark: part.remark || ''
  })
  partDialogVisible.value = true
}

function handleTemplateChange(templateId: number | string) {
  const template = templates.value.find((tmpl) => tmpl.id === templateId)
  if (template) {
    const nameKey = template.name_key || template.template_name || template.name || ''
    partForm.part_name = nameKey.startsWith('menu.') ? t(nameKey) : nameKey
    partForm.rated_life = Number(template.default_rated_life || template.default_life || template.rated_life || 10000)
    partForm.spec_model = template.default_spec || template.spec || ''
  }
}

function handlePartDialogClosed() {
  partFormRef.value?.clearValidate()
}

async function confirmPart() {
  if (!partFormRef.value) return
  try {
    await partFormRef.value.validate()
  } catch {
    return
  }
  partDialogLoading.value = true
  try {
    const data = { ...partForm }
    if (isEdit.value && currentEditPart.value?.id != null) {
      const res = await updatePart(String(currentEditPart.value.id), data)
      if (res.code === 200) {
        $msg.success(t('device.part.messageUpdateSuccess'))
        partDialogVisible.value = false
        loadPartList()
      } else {
        $msg.error(t('device.part.messageUpdateFailed'))
      }
    } else {
      const res = await addPart(data)
      if (res.code === 200) {
        $msg.success(t('device.part.messageAddSuccess'))
        partDialogVisible.value = false
        loadPartList()
      } else {
        $msg.error(t('device.part.messageAddFailed'))
      }
    }
  } catch {
    $msg.error(t('device.part.messageSaveFailed'))
  } finally {
    partDialogLoading.value = false
  }
}

async function handleDelete(part: Part) {
  const ok = await $confirm.action(t('device.part.messageDeleteConfirm'), t('device.part.messageDeleteConfirmTitle'))
  if (!ok || part.id == null) return
  try {
    const res = await deletePart(String(part.id))
    if (res.code === 200) {
      $msg.success(t('device.part.messageDeleteSuccess'))
      loadPartList()
    } else {
      $msg.error(t('device.part.messageDeleteFailed'))
    }
  } catch {
    $msg.error(t('device.part.messageDeleteFailedCatch'))
  }
}

function handleReplace(part: Part) {
  currentReplacePart.value = part
  Object.assign(replaceForm, {
    partCode: part.part_code || part.code || '',
    partName: getPartDisplayName(part),
    newCode: '',
    reason: '',
    remark: ''
  })
  replaceDialogVisible.value = true
}

function handleDialogClosed() {
  replaceFormRef.value?.clearValidate()
}

async function confirmReplace() {
  if (!replaceFormRef.value) return
  try {
    await replaceFormRef.value.validate()
  } catch {
    return
  }
  if (!currentReplacePart.value?.id) return
  replaceLoading.value = true
  try {
    const res = await replacePart(String(currentReplacePart.value.id), {
      new_code: replaceForm.newCode,
      replace_reason: replaceForm.reason,
      remark: replaceForm.remark
    })
    if (res.code === 200) {
      $msg.success(t('device.part.messageReplaceSuccess'))
      replaceDialogVisible.value = false
      loadPartList()
      loadReplaceRecords()
    } else {
      $msg.error(t('device.part.messageReplaceFailed'))
    }
  } catch {
    $msg.error(t('device.part.messageReplaceFailed'))
  } finally {
    replaceLoading.value = false
  }
}

onMounted(() => {
  loadTemplates()
  loadPartList()
  loadReplaceRecords()
})
</script>

<style scoped>
.part-life-page { padding: 16px; }
.part-dialog-form { margin-left: 20px; }
.part-dialog-form :deep(.el-form-item__content) .el-input,
.part-dialog-form :deep(.el-form-item__content) .el-select,
.part-dialog-form :deep(.el-form-item__content) .el-date-editor { width: 280px !important; }
.rated-life-input { display: flex; align-items: center; width: 280px !important; gap: 10px; }
.rated-life-input .el-input-number { flex: 1; min-width: 0; }
.rated-life-unit { color: #909399; font-size: 14px; white-space: nowrap; margin-right: -40px; width: 32px; text-align: left; }
.page-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.toolbar-left, .toolbar-right { display: flex; gap: 8px; }
.overview-row { margin-bottom: 16px; }
.part-card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #67c23a; transition: all 0.3s; }
.part-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); transform: translateY(-2px); }
.part-card.normal { border-left-color: #67c23a; }
.part-card.notice { border-left-color: #909399; }
.part-card.warning { border-left-color: #e6a23c; }
.part-card.expired { border-left-color: #f56c6c; }
.card-header { display: flex; align-items: center; margin-bottom: 12px; }
.part-icon { width: 40px; height: 40px; background: #ecf5ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #409eff; margin-right: 12px; }
.part-info { flex: 1; }
.part-name { font-size: 15px; font-weight: bold; color: #303133; margin-bottom: 2px; }
.part-code { font-size: 12px; color: #909399; }
.life-info { display: flex; justify-content: space-between; margin-bottom: 12px; }
.life-item { text-align: center; }
.life-label { display: block; font-size: 12px; color: #909399; margin-bottom: 4px; }
.life-value { font-size: 18px; font-weight: bold; color: #303133; }
.life-unit { font-size: 12px; color: #909399; margin-left: 2px; font-weight: normal; }
.text-success { color: #67c23a; }
.text-warning { color: #e6a23c; }
.text-danger { color: #f56c6c; }
.life-progress { margin-bottom: 12px; }
.progress-bar { height: 8px; background: #f0f2f5; border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
.progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
.progress-fill.normal { background: linear-gradient(90deg, #67c23a, #85ce61); }
.progress-fill.notice { background: linear-gradient(90deg, #909399, #a6a9ad); }
.progress-fill.warning { background: linear-gradient(90deg, #e6a23c, #ebb563); }
.progress-fill.expired { background: linear-gradient(90deg, #f56c6c, #f78989); }
.progress-text { text-align: right; font-size: 12px; color: #909399; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f0f2f5; }
.install-date { font-size: 12px; color: #909399; }
.card-actions { display: flex; gap: 4px; }
.detail-row { margin-top: 16px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
.panel-header { padding: 12px 16px; border-bottom: 1px solid #f0f2f5; display: flex; justify-content: space-between; align-items: center; }
.panel-title { font-size: 14px; font-weight: bold; color: #303133; display: inline-flex; align-items: center; gap: 6px; }
.panel-body { padding: 16px; }
.table-progress { display: flex; align-items: center; gap: 8px; }
.tp-bar { flex: 1; height: 6px; background: #f0f2f5; border-radius: 3px; overflow: hidden; }
.tp-fill { height: 100%; border-radius: 3px; }
.tp-fill.normal { background: #67c23a; }
.tp-fill.notice { background: #909399; }
.tp-fill.warning { background: #e6a23c; }
.tp-fill.expired { background: #f56c6c; }
.tp-text { font-size: 12px; color: #606266; white-space: nowrap; }
.timeline { position: relative; padding-left: 20px; }
.timeline-item { position: relative; padding-bottom: 20px; }
.timeline-dot { position: absolute; left: -20px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #67c23a; }
.timeline-dot.success { background: #67c23a; }
.timeline-dot.failed, .timeline-dot.fail { background: #f56c6c; }
.timeline-line { position: absolute; left: -15px; top: 20px; width: 2px; height: calc(100% - 16px); background: #e4e7ed; }
.timeline-content { background: #f8f9fa; border-radius: 6px; padding: 10px 12px; }
.tl-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.tl-part { font-size: 13px; font-weight: bold; color: #303133; }
.tl-detail { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: #606266; margin-bottom: 6px; }
.tl-footer { display: flex; justify-content: space-between; font-size: 11px; color: #909399; }
.empty-tip { text-align: center; padding: 60px 20px; color: #909399; }
.empty-tip :deep(.el-icon) { margin-bottom: 12px; display: block; }
.empty-tip-small { text-align: center; padding: 30px 20px; color: #909399; font-size: 13px; }
</style>
