/**
 * useForm - 表单通用组合式函数
 * 封装表单的重置、校验、清除校验等通用逻辑
 * 替代原 mixins/form.js
 *
 * 用法：
 *   const { formRef, resetForm, validateForm, clearValidate, fillForm } = useForm('formRef')
 *   // 模板：<el-form ref="formRef" :model="form">
 *
 * 作者：GooHv
 */
import { ref, nextTick, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'

export interface UseFormReturn<T extends Record<string, unknown> = Record<string, unknown>> {
  /** el-form 实例引用（模板上 ref 同名绑定） */
  formRef: Ref<FormInstance | null>
  /** 重置表单为默认值 */
  resetForm: (form: Ref<T>, defaultForm: T) => void
  /** 校验整个表单，返回是否通过 */
  validateForm: () => Promise<boolean>
  /** 校验指定字段 */
  validateField: (fields?: string | string[]) => Promise<boolean>
  /** 清除校验状态 */
  clearValidate: (fields?: string | string[]) => void
  /** 用数据填充表单 */
  fillForm: (form: Ref<T>, defaultForm: T, data: Partial<T>, merge?: boolean) => void
}

/**
 * @param formRefName 模板上 el-form 的 ref 名（仅用于告警提示）
 */
export function useForm<T extends Record<string, unknown> = Record<string, unknown>>(
  formRefName = 'formRef'
): UseFormReturn<T> {
  const formRef = ref<FormInstance | null>(null)

  function resetForm(form: Ref<T>, defaultForm: T): void {
    form.value = JSON.parse(JSON.stringify(defaultForm)) as T
    clearValidate()
  }

  async function validateForm(): Promise<boolean> {
    if (!formRef.value) {
      console.warn(`[useForm] 未找到 ref="${formRefName}" 的表单`)
      return true
    }
    return new Promise<boolean>(resolve => {
      formRef.value!.validate((valid: boolean) => {
        resolve(valid)
      })
    })
  }

  async function validateField(fields?: string | string[]): Promise<boolean> {
    if (!formRef.value) return true
    return new Promise<boolean>(resolve => {
      formRef.value!.validateField(fields, (error?: unknown) => {
        resolve(!error)
      })
    })
  }

  function clearValidate(fields?: string | string[]): void {
    if (formRef.value) {
      formRef.value.clearValidate(fields)
    }
  }

  function fillForm(form: Ref<T>, defaultForm: T, data: Partial<T>, merge = false): void {
    if (merge) {
      form.value = { ...form.value, ...data }
    } else {
      form.value = { ...defaultForm, ...data }
    }
    nextTick(() => {
      clearValidate()
    })
  }

  return {
    formRef,
    resetForm,
    validateForm,
    validateField,
    clearValidate,
    fillForm
  }
}
