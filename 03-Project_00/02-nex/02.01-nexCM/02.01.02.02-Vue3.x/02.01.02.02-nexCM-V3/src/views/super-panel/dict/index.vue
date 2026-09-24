<template>
  <div class="dict-management">
    <!-- ==================== 页面头部 ==================== -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.dict.page.title') }}</h2>
        <p class="page-desc">{{ t('superPanel.dict.page.pageDesc') }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="small" :loading="typeLoading || itemLoading" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>&nbsp;{{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- ==================== 主体：左右布局 ==================== -->
    <el-row :gutter="20" class="content-row">
      <!-- 左侧：字典类型 -->
      <el-col :span="8">
        <div class="dict-type-panel">
          <div class="panel-header">
            <span class="panel-title">{{ t('superPanel.dict.page.typeList') }}</span>
            <el-button type="primary" size="small" @click="handleAddType">
              <el-icon><Plus /></el-icon>&nbsp;{{ t('common.add') }}
            </el-button>
          </div>
          <el-table
            v-loading="typeLoading"
            :element-loading-text="t('common.loading')"
            :data="typeList"
            border
            highlight-current-row
            style="width: 100%"
            @current-change="handleTypeChange"
          >
            <el-table-column :label="t('superPanel.dict.page.typeName')" min-width="120" align="center">
              <template #default="{ row }">{{ getDictTypeLabel(row.dict_code, row.dict_name) }}</template>
            </el-table-column>
            <el-table-column
              prop="dict_code"
              :label="t('superPanel.dict.page.typeCode')"
              min-width="120"
              align="center"
            />
            <el-table-column :label="t('common.operation')" width="100" align="center">
              <template #default="{ row }">
                <el-button type="text" size="small" @click.stop="handleEditType(row as DictTypeItem)">{{
                  t('common.edit')
                }}</el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: var(--el-color-danger)"
                  @click.stop="handleDeleteType(row as DictTypeItem)"
                  >{{ t('common.delete') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <!-- 右侧：字典项 -->
      <el-col :span="16">
        <div class="dict-item-panel">
          <div class="panel-header">
            <span class="panel-title">
              {{
                currentType
                  ? getDictTypeLabel(currentType.dict_code, currentType.dict_name) +
                    ' - ' +
                    t('superPanel.dict.page.itemList')
                  : t('superPanel.dict.page.itemList')
              }}
            </span>
            <div class="panel-actions">
              <ExportDropdown
                :data="itemList"
                :columns="exportColumns"
                :title="exportTitle"
                :filename="exportTitle"
                :exporter="userStore.userInfo?.username || ''"
              />
              <el-button type="primary" size="small" :disabled="!currentType" @click="handleAddItem">
                <el-icon><Plus /></el-icon>&nbsp;{{ t('common.add') }}
              </el-button>
            </div>
          </div>
          <el-table v-loading="itemLoading" :element-loading-text="t('common.loading')" :data="itemList" border stripe>
            <el-table-column :label="t('common.index')" type="index" width="60" align="center" />
            <el-table-column prop="label" :label="t('superPanel.dict.page.itemLabel')" min-width="120" align="center" />
            <el-table-column prop="value" :label="t('superPanel.dict.page.itemValue')" min-width="120" align="center" />
            <el-table-column :label="t('common.status')" prop="status" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 1 ? t('common.enable') : t('common.disable') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="t('common.sort')" prop="sort" width="80" align="center" />
            <el-table-column :label="t('common.remark')" prop="remark" min-width="120" show-overflow-tooltip />
            <el-table-column :label="t('common.operation')" width="100" align="center">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="handleEditItem(row as DictItemRow)">{{
                  t('common.edit')
                }}</el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: var(--el-color-danger)"
                  @click="handleDeleteItem(row as DictItemRow)"
                  >{{ t('common.delete') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- ==================== 字典类型弹窗 ==================== -->
    <el-dialog v-model="typeDialog.visible" :title="typeDialog.title" width="560px" :close-on-click-modal="false">
      <el-form ref="typeFormRef" :model="typeForm" :rules="typeRules" label-width="160px">
        <el-form-item prop="dict_name">
          <template #label>
            {{ t('superPanel.dict.page.typeName') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.typeName')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input
            v-model="typeForm.dict_name"
            :placeholder="t('superPanel.dict.page.typeNamePlaceholder')"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item prop="dict_code">
          <template #label>
            {{ t('superPanel.dict.page.typeCode') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.typeCode')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input
            v-model="typeForm.dict_code"
            :placeholder="t('superPanel.dict.page.typeCodePlaceholder')"
            :disabled="typeDialog.isEdit"
          />
        </el-form-item>
        <el-form-item prop="description">
          <template #label>
            {{ t('common.description') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.description')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input v-model="typeForm.description" type="textarea" :rows="2" :maxlength="200" />
        </el-form-item>
        <el-form-item prop="status">
          <template #label>
            {{ t('common.status') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.status')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-radio-group v-model="typeForm.status">
            <el-radio :value="1">{{ t('common.enable') }}</el-radio>
            <el-radio :value="0">{{ t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sort">
          <template #label>
            {{ t('common.sort') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.sort')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input-number v-model="typeForm.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="typeDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitTypeForm">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 字典项弹窗 ==================== -->
    <el-dialog v-model="itemDialog.visible" :title="itemDialog.title" width="560px" :close-on-click-modal="false">
      <el-form ref="itemFormRef" :model="itemForm" :rules="itemRules" label-width="160px">
        <el-form-item prop="label">
          <template #label>
            {{ t('superPanel.dict.page.itemLabel') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.itemLabel')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input
            v-model="itemForm.label"
            :placeholder="t('superPanel.dict.page.itemLabelPlaceholder')"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item prop="value">
          <template #label>
            {{ t('superPanel.dict.page.itemValue') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.itemValue')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input v-model="itemForm.value" :placeholder="t('superPanel.dict.page.itemValuePlaceholder')" />
        </el-form-item>
        <el-form-item prop="status">
          <template #label>
            {{ t('common.status') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.itemStatus')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-radio-group v-model="itemForm.status">
            <el-radio :value="1">{{ t('common.enable') }}</el-radio>
            <el-radio :value="0">{{ t('common.disable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sort">
          <template #label>
            {{ t('common.sort') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.itemSort')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input-number v-model="itemForm.sort" :min="0" />
        </el-form-item>
        <el-form-item prop="remark">
          <template #label>
            {{ t('common.remark') }}
            <el-tooltip :content="t('superPanel.dict.page.tips.itemRemark')" placement="top"
              ><el-icon><QuestionFilled /></el-icon
            ></el-tooltip>
          </template>
          <el-input v-model="itemForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitItemForm">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 字典管理（左：字典类型；右：字典项）
 * @author GooHv
 * 选择左侧类型后加载右侧字典项；支持新增/编辑/删除与导出。
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { ExportColumn } from '@/utils/business/exportTable'
import { useUserStore } from '@/store/modules/user'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { showSuccess, showError, confirmDelete } from '@/utils/ui/feedback'
import { getDictTypeLabel } from '@/utils/business/dict'
import {
  requestGetDictTypeListApi,
  requestCreateDictTypeApi,
  requestUpdateDictTypeApi,
  requestDeleteDictTypeApi,
  requestGetDictItemListApi,
  requestCreateDictItemApi,
  requestUpdateDictItemApi,
  requestDeleteDictItemApi
} from '@/api'
import type { DictTypeItem, DictItemRow } from '@/types/super-panel'

const { t } = useI18n()
const userStore = useUserStore()

/** 分页响应数据形状（request 默认 data 为 unknown，这里显式收窄） */
interface PageData<T> {
  list?: T[]
  total?: number
}

const typeLoading = ref(false)
const itemLoading = ref(false)
const typeList = ref<DictTypeItem[]>([])
const itemList = ref<DictItemRow[]>([])
const currentType = ref<DictTypeItem | null>(null)
const typeFormRef = ref()
const itemFormRef = ref()

const typeDialog = reactive({ visible: false, title: '', isEdit: false })
const itemDialog = reactive({ visible: false, title: '', isEdit: false })

const typeForm = reactive({
  id: null as number | string | null,
  dict_name: '',
  dict_code: '',
  description: '',
  status: 1 as 0 | 1,
  sort: 0
})
const itemForm = reactive({
  id: null as number | string | null,
  label: '',
  value: '',
  status: 1 as 0 | 1,
  sort: 0,
  remark: ''
})

const typeRules = {
  dict_name: [{ required: true, message: t('superPanel.dict.page.typeNameRequired'), trigger: 'blur' }],
  dict_code: [{ required: true, message: t('superPanel.dict.page.typeCodeRequired'), trigger: 'blur' }]
}
const itemRules = {
  label: [{ required: true, message: t('superPanel.dict.page.itemLabelRequired'), trigger: 'blur' }],
  value: [{ required: true, message: t('superPanel.dict.page.itemValueRequired'), trigger: 'blur' }]
}

const exportColumns = computed((): ExportColumn[] => [
  { label: t('superPanel.dict.page.itemLabel'), prop: 'label', width: 150 },
  { label: t('superPanel.dict.page.itemValue'), prop: 'value', width: 150 },
  {
    label: t('superPanel.dict.page.itemStatus'),
    prop: 'status',
    width: 80,
    formatter: row => ((row as DictItemRow).status === 1 ? t('common.enable') : t('common.disable'))
  },
  { label: t('common.sort'), prop: 'sort', width: 80 },
  { label: t('common.remark'), prop: 'remark', width: 200 }
])

const exportTitle = computed(() =>
  currentType.value
    ? `${getDictTypeLabel(currentType.value.dict_code, currentType.value.dict_name)} - ${t('superPanel.dict.page.itemList')}`
    : t('superPanel.dict.page.itemList')
)

function handleRefresh(): void {
  loadTypeList()
  if (currentType.value) loadItemList()
}

async function loadTypeList(): Promise<void> {
  typeLoading.value = true
  try {
    const res = await requestGetDictTypeListApi({ page: 1, pageSize: 100 })
    typeList.value = (res.data as PageData<DictTypeItem>)?.list || []
    if (typeList.value.length > 0 && !currentType.value) {
      currentType.value = typeList.value[0]
      loadItemList()
    }
  } finally {
    typeLoading.value = false
  }
}

async function loadItemList(): Promise<void> {
  if (!currentType.value) return
  itemLoading.value = true
  try {
    const res = await requestGetDictItemListApi({ type_id: currentType.value.id, page: 1, pageSize: 100 })
    itemList.value = (res.data as PageData<DictItemRow>)?.list || []
  } finally {
    itemLoading.value = false
  }
}

function handleTypeChange(row: DictTypeItem | null): void {
  currentType.value = row
  if (row) loadItemList()
}

function resetTypeForm(): void {
  Object.assign(typeForm, { id: null, dict_name: '', dict_code: '', description: '', status: 1, sort: 0 })
}
function resetItemForm(): void {
  Object.assign(itemForm, { id: null, label: '', value: '', status: 1, sort: 0, remark: '' })
}

function handleAddType(): void {
  typeDialog.visible = true
  typeDialog.isEdit = false
  typeDialog.title = t('superPanel.dict.page.addType')
  resetTypeForm()
}
function handleEditType(row: DictTypeItem): void {
  typeDialog.visible = true
  typeDialog.isEdit = true
  typeDialog.title = t('superPanel.dict.page.editType')
  resetTypeForm()
  Object.assign(typeForm, row)
}

async function submitTypeForm(): Promise<void> {
  if (!typeFormRef.value) return
  const valid = await typeFormRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    if (typeDialog.isEdit) {
      await requestUpdateDictTypeApi(typeForm.id as string, typeForm)
      showSuccess(t('common.updateSuccess'))
    } else {
      await requestCreateDictTypeApi(typeForm)
      showSuccess(t('common.createSuccess'))
    }
    typeDialog.visible = false
    loadTypeList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

async function handleDeleteType(row: DictTypeItem): Promise<void> {
  const ok = await confirmDelete(t('superPanel.dict.page.deleteTypeConfirm'))
  if (!ok) return
  try {
    await requestDeleteDictTypeApi(row.id as string)
    showSuccess(t('common.deleteSuccess'))
    if (currentType.value?.id === row.id) {
      currentType.value = null
      itemList.value = []
    }
    loadTypeList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

function handleAddItem(): void {
  itemDialog.visible = true
  itemDialog.isEdit = false
  itemDialog.title = t('superPanel.dict.page.addItem')
  resetItemForm()
}
function handleEditItem(row: DictItemRow): void {
  itemDialog.visible = true
  itemDialog.isEdit = true
  itemDialog.title = t('superPanel.dict.page.editItem')
  resetItemForm()
  Object.assign(itemForm, row)
}

async function submitItemForm(): Promise<void> {
  if (!itemFormRef.value) return
  const valid = await itemFormRef.value.validate().catch(() => false)
  if (!valid) return
  try {
    const data: Record<string, unknown> = { ...itemForm, type_id: currentType.value?.id }
    if (itemDialog.isEdit) {
      await requestUpdateDictItemApi(itemForm.id as string, data)
      showSuccess(t('common.updateSuccess'))
    } else {
      await requestCreateDictItemApi(data)
      showSuccess(t('common.createSuccess'))
    }
    itemDialog.visible = false
    loadItemList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

async function handleDeleteItem(row: DictItemRow): Promise<void> {
  const ok = await confirmDelete(t('superPanel.dict.page.deleteItemConfirm'))
  if (!ok) return
  try {
    await requestDeleteDictItemApi(row.id as string)
    showSuccess(t('common.deleteSuccess'))
    loadItemList()
  } catch (e) {
    showError((e as { msg?: string })?.msg || t('common.operationFailed'))
  }
}

onMounted(() => {
  loadTypeList()
})
</script>

<style scoped lang="less">
.dict-management {
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

.content-row {
  .dict-type-panel,
  .dict-item-panel {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
    font-weight: 600;
    color: #303133;

    .panel-title {
      font-size: 15px;
    }
    .panel-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}
</style>
