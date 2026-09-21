/**
 * useDialog - 弹窗通用组合式函数
 * 封装新增/编辑弹窗的通用逻辑：显示/隐藏、表单重置、提交
 * 替代原 mixins/dialog.js
 *
 * 用法：
 *   const { dialogVisible, dialogTitle, submitLoading, open, close, handleSubmit } =
 *     useDialog({ addTitle: '新增用户', editTitle: '编辑用户', submitApi: createUser })
 *
 * 作者：GooHv
 */
import { ref, nextTick, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'

/** 表单提交接口（任意入参，返回 Promise） */
export type DialogSubmitApi<T> = (form: T) => Promise<unknown>

export interface UseDialogOptions<T extends Record<string, unknown>> {
  /** 新增标题 */
  addTitle?: string
  /** 编辑标题 */
  editTitle?: string
  /** 提交接口 */
  submitApi?: DialogSubmitApi<T> | null
  /** 提交成功回调 */
  onSubmitSuccess?: (() => void) | null
}

export interface UseDialogReturn<T extends Record<string, unknown>> {
  dialogVisible: Ref<boolean>
  submitLoading: Ref<boolean>
  dialogTitle: Ref<string>
  /** 打开弹窗；row 非空视为编辑 */
  open: (row: T | null, form: Ref<T>, defaultForm: T, formRef: Ref<FormInstance | null>) => void
  /** 关闭弹窗并重置表单 */
  close: (form: Ref<T>, defaultForm: T, formRef: Ref<FormInstance | null>) => void
  /** 校验并提交 */
  handleSubmit: (form: Ref<T>, formRef: Ref<FormInstance | null>) => void
}

export function useDialog<T extends Record<string, unknown> = Record<string, unknown>>(
  options: UseDialogOptions<T> = {}
): UseDialogReturn<T> {
  const {
    addTitle = '新增',
    editTitle = '编辑',
    submitApi = null,
    onSubmitSuccess = null
  } = options

  const dialogVisible = ref<boolean>(false)
  const submitLoading = ref<boolean>(false)
  const dialogTitle = ref<string>(addTitle)

  function open(row: T | null, form: Ref<T>, defaultForm: T, formRef: Ref<FormInstance | null>): void {
    dialogVisible.value = true
    void nextTick(() => {
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

  function close(form: Ref<T>, defaultForm: T, formRef: Ref<FormInstance | null>): void {
    dialogVisible.value = false
    form.value = { ...defaultForm }
    formRef.value && formRef.value.clearValidate()
  }

  async function handleSubmit(form: Ref<T>, formRef: Ref<FormInstance | null>): Promise<void> {
    if (!formRef.value) return
    formRef.value.validate(async (valid: boolean) => {
      if (!valid) return
      if (!submitApi) {
        console.warn('[useDialog] 请传入 submitApi 方法')
        return
      }
      submitLoading.value = true
      try {
        await submitApi(form.value)
        // 提交成功提示由调用方处理
        close(form, {} as T, formRef)
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
