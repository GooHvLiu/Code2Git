<template>
  <div class="part-template-manager">
    <div class="page-toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('device.part.templateSearchPlaceholder')"
          clearable
          style="width: 280px"
          @clear="loadTemplateList"
          @keyup.enter="loadTemplateList"
        >
          <template #append>
            <el-button
              v-permission="'device:part:template:search'"
              :icon="Search"
              @click="loadTemplateList"
            ></el-button>
          </template>
        </el-input>
      </div>
      <div class="toolbar-right">
        <el-button v-permission="'device:part:template:add'" type="primary" :icon="Plus" @click="handleAdd">{{
          t('device.part.templateAdd')
        }}</el-button>
        <el-button v-permission="'device:part:template:refresh'" :icon="Refresh" @click="loadTemplateList">{{
          t('device.part.templateRefresh')
        }}</el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="filteredTemplates"
      :element-loading-text="t('common.loading')"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        :label="t('device.part.templateColumnTemplateName')"
        prop="name_key"
        min-width="150"
        align="center"
      >
        <template #default="{ row }">
          <!-- row.icon 为后端字体类字符串，Vue3 下无法解析为组件，仅展示名称 -->
          {{ getTemplateName(row) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="t('device.part.templateColumnTemplateKey')"
        prop="template_key"
        min-width="150"
        align="center"
      />
      <el-table-column
        :label="t('device.part.templateColumnCodePrefix')"
        prop="code_prefix"
        min-width="120"
        align="center"
      />
      <el-table-column
        :label="t('device.part.templateColumnDefaultSpec')"
        prop="default_spec"
        min-width="150"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        :label="t('device.part.templateColumnDefaultRatedLife')"
        prop="default_rated_life"
        min-width="120"
        align="center"
      >
        <template #default="{ row }">{{ row.default_rated_life }} {{ t('device.part.unitTimes') }}</template>
      </el-table-column>
      <el-table-column
        :label="t('device.part.templateColumnStatMethod')"
        prop="stat_method"
        min-width="140"
        align="center"
      >
        <template #default="{ row }">{{ getStatMethodText(row.stat_method) }}</template>
      </el-table-column>
      <el-table-column
        :label="t('device.part.templateColumnStatTag')"
        prop="stat_tag"
        min-width="180"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column :label="t('device.part.templateColumnStatus')" prop="enabled" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
            {{ row.enabled ? t('device.part.templateStatusEnabled') : t('device.part.templateStatusDisabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('device.part.templateColumnAction')" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            v-permission="'device:part:template:edit'"
            type="primary"
            link
            size="small"
            :icon="Edit"
            :disabled="row.part_count > 0 || row.is_base_template === 1"
            @click="handleEdit(row)"
          >
            {{ t('common.edit') }}
          </el-button>
          <el-button
            v-permission="'device:part:template:delete'"
            type="danger"
            link
            size="small"
            :icon="Delete"
            :disabled="row.part_count > 0 || row.is_base_template === 1"
            @click="handleDelete(row)"
          >
            {{ t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('device.part.templateEdit') : t('device.part.templateAdd')"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        label-width="160px"
        class="template-dialog-form"
      >
        <el-form-item prop="source_template_key">
          <template #label>
            {{ t('device.part.templateFormTemplateName') }}
            <el-tooltip :content="t('device.part.templateTipTemplateName')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-select
            v-model="templateForm.source_template_key"
            :placeholder="t('device.part.templateFormTemplateName')"
            style="width: 100%"
            :disabled="isEdit"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="item in sourceTemplates"
              :key="item.template_key"
              :label="getTemplateName(item)"
              :value="item.template_key ?? ''"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="default_spec">
          <template #label>
            {{ t('device.part.templateFormDefaultSpec') }}
            <el-tooltip :content="t('device.part.templateTipDefaultSpec')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input v-model="templateForm.default_spec" :placeholder="t('device.part.templateFormDefaultSpec')" />
        </el-form-item>
        <el-form-item prop="default_rated_life">
          <template #label>
            {{ t('device.part.templateFormDefaultRatedLife') }}
            <el-tooltip :content="t('device.part.templateTipDefaultRatedLife')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input-number
            v-model="templateForm.default_rated_life"
            :min="1"
            :max="9999999"
            :step="1000"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleConfirm">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 备件模板管理：模板列表 / 新增 / 编辑 / 删除
 * 作者：GooHv
 */
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, Refresh, Edit, Delete, QuestionFilled } from '@element-plus/icons-vue'
import {
  getPartTemplatesForAdmin,
  getBasePartTemplates,
  addPartTemplate,
  updatePartTemplate,
  deletePartTemplate
} from '@/api/device-part'
import { useI18n } from '@/composables/useI18n'
import { $msg, $confirm } from '@/utils/ui/feedback'
import type { PartTemplate } from '@/types/device'

const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const searchKeyword = ref('')
const templateList = ref<PartTemplate[]>([])
const sourceTemplates = ref<PartTemplate[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentTemplate = ref<PartTemplate | null>(null)
const templateFormRef = ref<FormInstance>()

const templateForm = reactive({
  source_template_key: '',
  default_spec: '',
  default_rated_life: 10000
})

const templateRules = computed<FormRules>(() => ({
  source_template_key: [{ required: true, message: t('device.part.templateRuleSelectName'), trigger: 'change' }],
  default_spec: [{ required: true, message: t('device.part.templateRuleSpecRequired'), trigger: 'blur' }],
  default_rated_life: [{ required: true, message: t('device.part.templateRuleRatedLifeRequired'), trigger: 'blur' }]
}))

const filteredTemplates = computed(() => {
  if (!searchKeyword.value) return templateList.value
  const keyword = searchKeyword.value.toLowerCase()
  return templateList.value.filter(
    item =>
      (item.template_key || '').toLowerCase().includes(keyword) ||
      (item.code_prefix || '').toLowerCase().includes(keyword) ||
      (item.default_spec || '').toLowerCase().includes(keyword) ||
      getTemplateName(item).toLowerCase().includes(keyword)
  )
})

function getTemplateName(template: PartTemplate): string {
  if (!template) return ''
  if (template.name_key && template.name_key.startsWith('layout.menu.')) return t(template.name_key)
  return template.name_key || template.template_name || template.name || ''
}

function getStatMethodText(method: string): string {
  const map: Record<string, string> = {
    success_count: t('device.part.templateStatMethodSuccessCount'),
    rotation_count: t('device.part.templateStatMethodRotationCount'),
    manual: t('device.part.templateStatMethodManual')
  }
  return map[method] || method
}

async function loadTemplateList() {
  loading.value = true
  try {
    const [res, baseRes] = await Promise.all([getPartTemplatesForAdmin(), getBasePartTemplates()])
    templateList.value = (res.data as PartTemplate[]) || []
    if (baseRes.code === 200) sourceTemplates.value = (baseRes.data as PartTemplate[]) || []
  } catch {
    /* 请求拦截器已统一提示 */
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(templateForm, { source_template_key: '', default_spec: '', default_rated_life: 0 })
  templateFormRef.value?.clearValidate()
}

function handleTemplateChange(templateKey: string) {
  if (!templateKey) {
    templateForm.default_rated_life = 0
    return
  }
  const selected = sourceTemplates.value.find(item => item.template_key === templateKey)
  templateForm.default_rated_life = selected?.default_rated_life || 0
}

function handleAdd() {
  isEdit.value = false
  currentTemplate.value = null
  resetForm()
  dialogVisible.value = true
}

function handleEdit(row: PartTemplate) {
  isEdit.value = true
  currentTemplate.value = row
  resetForm()
  Object.assign(templateForm, {
    source_template_key: row.template_key || '',
    default_spec: row.default_spec || '',
    default_rated_life: row.default_rated_life || 0
  })
  dialogVisible.value = true
}

async function handleDelete(row: PartTemplate) {
  const ok = await $confirm.action(t('device.part.templateMessageDeleteConfirm'), t('common.tip'))
  if (!ok || row.id == null) return
  try {
    const res = await deletePartTemplate(String(row.id))
    if (res.code === 200) {
      $msg.success(t('device.part.templateMessageDeleteSuccess'))
      loadTemplateList()
    }
  } catch {
    /* 已统一处理 */
  }
}

async function handleConfirm() {
  if (!templateFormRef.value) return
  try {
    await templateFormRef.value.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    const data = isEdit.value
      ? { default_spec: templateForm.default_spec, default_rated_life: templateForm.default_rated_life }
      : {
          source_template_key: templateForm.source_template_key,
          default_spec: templateForm.default_spec,
          default_rated_life: templateForm.default_rated_life
        }
    const res =
      isEdit.value && currentTemplate.value?.id != null
        ? await updatePartTemplate(String(currentTemplate.value.id), data)
        : await addPartTemplate(data)
    if (res.code === 200) {
      $msg.success(
        isEdit.value ? t('device.part.templateMessageEditSuccess') : t('device.part.templateMessageAddSuccess')
      )
      dialogVisible.value = false
      loadTemplateList()
    }
  } catch {
    /* 已统一处理 */
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadTemplateList()
})
</script>

<style scoped>
.part-template-manager {
  padding: 16px;
}
.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}
.template-dialog-form :deep(.el-form-item__content) .el-select,
.template-dialog-form :deep(.el-form-item__content) .el-input-number {
  width: 100%;
}
</style>
