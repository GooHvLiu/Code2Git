<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="560px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form v-if="dialogVisible" ref="formRef" :model="form" :rules="rules">
      <el-form-item
        v-for="field in visibleFields"
        :key="field.prop"
        :prop="field.prop"
      >
        <template #label>
          <span class="label-with-tip">
            {{ t(field.label) }}
            <el-tooltip
              v-if="field.tip"
              :content="t(field.tip)"
              placement="top"
            >
              <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <!-- 文本输入 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="form[field.prop]"
          :placeholder="t(field.placeholder || '')"
          :disabled="!!(field.disabledEdit && isEdit)"
          clearable
        />
        <!-- 密码输入 -->
        <el-input
          v-if="field.type === 'password'"
          v-model="form[field.prop]"
          type="password"
          :placeholder="t(field.placeholder || '')"
          show-password
          clearable
        />
        <!-- 下拉选择 -->
        <el-select
          v-if="field.type === 'select'"
          v-model="form[field.prop]"
          :placeholder="t(field.placeholder || '')"
          style="width: 100%"
        >
          <el-option
            v-for="opt in field.options || []"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- 树形下拉选择（部门） -->
        <el-select
          v-if="field.type === 'treeselect'"
          v-model="form[field.prop]"
          :placeholder="t(field.placeholder || '')"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in flatDeptList"
            :key="item.id"
            :label="item.dept_name"
            :value="item.id"
          />
        </el-select>
        <!-- 单选按钮 -->
        <el-radio-group
          v-if="field.type === 'radio'"
          v-model="form[field.prop]"
        >
          <el-radio
            v-for="opt in field.options || []"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </el-radio>
        </el-radio-group>
        <!-- 文本域 -->
        <el-input
          v-if="field.type === 'textarea'"
          v-model="form[field.prop]"
          type="textarea"
          :rows="3"
          :placeholder="t(field.placeholder || '')"
          class="fixed-textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 新增/编辑用户弹窗
 * 字段由 fieldConfig 驱动渲染，支持输入/密码/下拉/部门树/单选/文本域。
 * 作者：GooHv
 */
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { useSysDict } from '@/composables/useSysDict'
import { requestAddUserApi, requestUpdateUserApi, requestGetRoleAllApi, requestGetDeptTreeApi } from '@/api'
import { withCache } from '@/utils/data/cache'
import { getRoleName } from '@/utils/auth/roleMapper'
import type { Role } from '@/types/system'

const { t } = useI18n()

const emit = defineEmits<{ (e: 'success'): void }>()

/** 用户表单 */
interface UserForm {
  id: number | string | null
  username: string
  password: string
  real_name: string
  sex: number
  phone: string
  email: string
  dept_id: number | string | null
  role: string
  status: number
  remark: string
  [key: string]: unknown
}

/** 字段配置 */
interface FieldOption { label: string; value: string | number }
interface FieldConfigItem {
  prop: string
  label: string
  tip?: string
  type: 'input' | 'password' | 'select' | 'treeselect' | 'radio' | 'textarea'
  placeholder?: string
  required?: boolean
  disabledEdit?: boolean
  options?: FieldOption[]
  show?: (isEdit: boolean) => boolean
}

/** 字典数据 */
const { dictMap } = useSysDict(['user_status', 'user_sex', 'user_role'])

const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const roleList = ref<Array<Record<string, any>>>([])
const deptTree = ref<Array<Record<string, any>>>([])

function getDefaultForm(): UserForm {
  return {
    id: null,
    username: '',
    password: '',
    real_name: '',
    sex: 0,
    phone: '',
    email: '',
    dept_id: null,
    role: 'operator',
    status: 1,
    remark: ''
  }
}

const form = reactive<Record<string, any>>(getDefaultForm())
const defaultForm = getDefaultForm()

const isEdit = computed(() => !!form.id)

const dialogTitle = computed(() =>
  isEdit.value ? t('system.user.page.editUser') : t('system.user.page.addUser')
)

const roleOptions = computed<FieldOption[]>(() =>
  roleList.value.map((item) => ({
    label: getRoleName(item as unknown as Role) || item.role_code,
    value: item.role_code
  }))
)

const flatDeptList = computed<Array<{ id: string | number; dept_name: string }>>(() => {
  const result: Array<{ id: string | number; dept_name: string }> = []
  const flatten = (list: Array<Record<string, any>>) => {
    if (!Array.isArray(list)) return
    list.forEach((item) => {
      result.push({ id: item.id, dept_name: item.dept_name })
      if (item.children && item.children.length > 0) flatten(item.children)
    })
  }
  flatten(deptTree.value)
  return result
})

const sexOptions = computed<FieldOption[]>(() =>
  (dictMap.value.user_sex || []).map((item) => ({ ...item, value: Number(item.value) }))
)
const statusOptions = computed<FieldOption[]>(() =>
  (dictMap.value.user_status || []).map((item) => ({ ...item, value: Number(item.value) }))
)

const fieldConfig = computed<FieldConfigItem[]>(() => [
  { prop: 'username', label: 'system.user.page.username', tip: 'system.user.page.usernameTip', type: 'input', placeholder: 'system.user.page.usernamePlaceholder', required: true, disabledEdit: true },
  { prop: 'password', label: 'system.user.page.password', tip: 'system.user.page.passwordTip', type: 'password', placeholder: 'system.user.page.passwordPlaceholder', required: true, show: (e) => !e },
  { prop: 'real_name', label: 'system.user.page.realName', tip: 'system.user.page.realNameTip', type: 'input', placeholder: 'system.user.page.realNamePlaceholder', required: false },
  { prop: 'sex', label: 'system.user.page.sex', tip: 'system.user.page.sexTip', type: 'radio', required: false, options: sexOptions.value },
  { prop: 'phone', label: 'system.user.page.phone', tip: 'system.user.page.phoneTip', type: 'input', placeholder: 'system.user.page.phonePlaceholder', required: false },
  { prop: 'email', label: 'system.user.page.email', tip: 'system.user.page.emailTip', type: 'input', placeholder: 'system.user.page.emailPlaceholder', required: false },
  { prop: 'dept_id', label: 'system.user.page.dept', tip: 'system.user.page.deptTip', type: 'treeselect', placeholder: 'system.user.page.deptPlaceholder', required: false },
  { prop: 'role', label: 'system.user.page.role', tip: 'system.user.page.roleTip', type: 'select', placeholder: 'system.user.page.rolePlaceholder', required: false, options: roleOptions.value },
  { prop: 'status', label: 'system.user.page.status', tip: 'system.user.page.statusTip', type: 'radio', required: false, options: statusOptions.value, show: (e) => e },
  { prop: 'remark', label: 'system.user.page.remark', tip: 'system.user.page.remarkTip', type: 'textarea', placeholder: 'system.user.page.remarkPlaceholder', required: false }
])

const visibleFields = computed<FieldConfigItem[]>(() =>
  fieldConfig.value.filter((field) => (typeof field.show === 'function' ? field.show(isEdit.value) : true))
)

const rules = computed<FormRules>(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: Record<string, any> = {}
  fieldConfig.value.forEach((field) => {
    if (field.required) {
      r[field.prop] = [{ required: true, message: t(field.placeholder || field.label), trigger: 'blur' }]
    }
    if (field.prop === 'email') {
      r.email = [{ type: 'email', message: t('system.user.page.emailInvalid'), trigger: 'blur' }]
    }
    if (field.prop === 'username') {
      r.username = [
        { required: true, message: t('system.user.page.usernameRequired'), trigger: 'blur' },
        { min: 2, max: 50, message: t('system.user.page.usernameLength'), trigger: 'blur' }
      ]
    }
    if (field.prop === 'password' && !isEdit.value) {
      r.password = [
        { required: true, message: t('system.user.page.passwordRequired'), trigger: 'blur' },
        { min: 6, max: 32, message: t('system.user.page.passwordLength'), trigger: 'blur' }
      ]
    }
  })
  return r as unknown as FormRules
})

async function loadRoleList(): Promise<void> {
  try {
    const res = await withCache('user_roleList', () => requestGetRoleAllApi())
    roleList.value = (res.data as Array<Record<string, any>>) || []
  } catch {
    // 拦截器已处理
  }
}

async function loadDeptTree(): Promise<void> {
  try {
    const res = await withCache('user_deptTree', () => requestGetDeptTreeApi())
    deptTree.value = (res.data as Array<Record<string, any>>) || []
  } catch {
    // 拦截器已处理
  }
}

function open(row?: Record<string, any>): void {
  dialogVisible.value = true
  nextTick(() => {
    if (row) Object.assign(form, defaultForm, row)
    else Object.assign(form, defaultForm)
    formRef.value && formRef.value.clearValidate()
  })
}

function close(): void {
  dialogVisible.value = false
  Object.assign(form, defaultForm)
  formRef.value && formRef.value.clearValidate()
}

/** 提交（过滤只读字段） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function submitApi(formData: Record<string, any>) {
  const ALLOWED_FIELDS = [
    'username', 'password', 'role', 'real_name', 'sex', 'phone', 'email', 'dept_id', 'avatar', 'remark', 'status'
  ]
  const cleanData: Record<string, unknown> = {}
  ALLOWED_FIELDS.forEach((key) => {
    if (formData[key] !== undefined) cleanData[key] = formData[key]
  })
  if (formData.id) cleanData.id = formData.id
  return formData.id ? requestUpdateUserApi(cleanData) : requestAddUserApi(cleanData)
}

function handleSubmit(): void {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      await submitApi(form)
      close()
      emit('success')
    } catch {
      // 拦截器已处理
    } finally {
      submitLoading.value = false
    }
  })
}

onMounted(() => {
  loadRoleList()
  loadDeptTree()
})

defineExpose({ open, close })
</script>

<style scoped lang="less">
.fixed-textarea :deep(.el-textarea__inner) {
  resize: none;
  min-height: 80px !important;
  max-height: 80px !important;
  overflow-y: auto;
}

:deep(.el-select .el-select__tags-text) {
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  max-width: none;
}
:deep(.el-select .el-input__inner) {
  text-overflow: clip;
}
</style>
