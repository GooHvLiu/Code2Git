/**
 * useDialog - 弹窗通用组合式函数
 * 封装新增/编辑弹窗的通用逻辑：显示/隐藏、表单重置、提交
 * 替代原 mixins/dialog.js
 */
import { ref, nextTick } from 'vue'

export function useDialog(options = {}) {
  const {
    addTitle = '新增',
    editTitle = '编辑',
    submitApi = null,
    onSubmitSuccess = null
  } = options

  const dialogVisible = ref(false)
  const submitLoading = ref(false)
  const dialogTitle = ref(addTitle)

  function open(row, form, defaultForm, formRef) {
    dialogVisible.value = true
    nextTick(() => {
      if (row) {
        form.value = { ...defaultForm, ...row }
        dialogTitle.value = editTitle
      } else {
        form.value = { ...defaultForm }
        dialogTitle.value = addTitle
      }
      formRef.value && formRef.value.clearValidate()
    })
  }

  function close(form, defaultForm, formRef) {
    dialogVisible.value = false
    form.value = { ...defaultForm }
    formRef.value && formRef.value.clearValidate()
  }

  async function handleSubmit(form, formRef) {
    if (!formRef.value) return
    formRef.value.validate(async valid => {
      if (!valid) return
      if (!submitApi) {
        console.warn('[useDialog] 请传入 submitApi 方法')
        return
      }
      submitLoading.value = true
      try {
        await submitApi(form.value)
        // 提交成功提示由调用方处理
        close(form, {}, formRef)
        onSubmitSuccess && onSubmitSuccess()
      } catch (e) {
        // 错误已由 request 拦截器统一处理
      } finally {
        submitLoading.value = false
      }
    })
  }

  return {
    dialogVisible,
    submitLoading,
    dialogTitle,
    open,
    close,
    handleSubmit
  }
}
