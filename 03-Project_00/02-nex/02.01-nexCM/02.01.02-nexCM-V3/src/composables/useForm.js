/**
 * useForm - 表单通用组合式函数
 * 封装表单的重置、校验、清除校验等通用逻辑
 * 替代原 mixins/form.js
 */
import { ref, nextTick } from 'vue'

export function useForm(formRefName = 'formRef') {
  const formRef = ref(null)

  function resetForm(form, defaultForm) {
    form.value = JSON.parse(JSON.stringify(defaultForm))
    clearValidate()
  }

  async function validateForm() {
    if (!formRef.value) {
      console.warn(`[useForm] 未找到 ref="${formRefName}" 的表单`)
      return true
    }
    return new Promise(resolve => {
      formRef.value.validate(valid => {
        resolve(valid)
      })
    })
  }

  async function validateField(fields) {
    if (!formRef.value) return true
    return new Promise(resolve => {
      formRef.value.validateField(fields, error => {
        resolve(!error)
      })
    })
  }

  function clearValidate(fields) {
    if (formRef.value) {
      formRef.value.clearValidate(fields)
    }
  }

  function fillForm(form, defaultForm, data, merge = false) {
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
