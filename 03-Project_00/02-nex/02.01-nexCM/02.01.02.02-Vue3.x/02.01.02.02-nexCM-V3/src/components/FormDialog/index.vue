<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="form-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" :label-width="labelWidth" :disabled="disabled">
      <slot name="form-content" :form="form" :disabled="disabled"></slot>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">{{ cancelText || t('common.cancel') }}</el-button>
        <el-button :type="confirmType" :loading="loading" @click="handleSubmit">
          {{ confirmText || t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 表单弹窗组件
 * 通过 ref 调用 open(row?) 打开（传 row 视为编辑），emit submit(form, isEdit)。
 * 作者：GooHv
 * 创建日期：2026-09-24
 */
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'FormDialog' })

interface Props {
  /** 弹窗标题（新增时） */
  addTitle?: string
  /** 弹窗标题（编辑时） */
  editTitle?: string
  /** 弹窗宽度 */
  width?: string
  /** 表单数据 */
  form: Record<string, unknown>
  /** 表单校验规则 */
  rules?: FormRules
  /** 标签宽度 */
  labelWidth?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认按钮类型 */
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** 加载状态 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  addTitle: '',
  editTitle: '',
  width: '600px',
  rules: () => ({}),
  labelWidth: '100px',
  disabled: false,
  confirmText: '',
  cancelText: '',
  confirmType: 'primary',
  loading: false
})

const emit = defineEmits<{
  (e: 'submit', form: Record<string, unknown>, isEdit: boolean): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const isEdit = ref(false)

const dialogTitle = computed(() => (isEdit.value ? props.editTitle : props.addTitle))

/** 打开弹窗（传入 row 视为编辑） */
function open(row?: Record<string, unknown> | null): void {
  isEdit.value = !!row
  dialogVisible.value = true
  // 等待 DOM 更新后清除旧校验
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

/** 关闭弹窗 */
function close(): void {
  dialogVisible.value = false
}

/** 校验表单，返回是否通过 */
function validate(): Promise<boolean> {
  return new Promise(resolve => {
    formRef.value?.validate(valid => resolve(!!valid))
  })
}

/** 清除校验 */
function clearValidate(): void {
  formRef.value?.clearValidate()
}

async function handleSubmit(): Promise<void> {
  const valid = await validate()
  if (!valid) return
  emit('submit', props.form, isEdit.value)
}

function handleCancel(): void {
  emit('cancel')
  dialogVisible.value = false
}

function handleClose(): void {
  emit('close')
}

defineExpose({ open, close, validate, clearValidate })
</script>

<style scoped lang="less">
.form-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .dialog-footer {
    text-align: right;
  }
}
</style>
