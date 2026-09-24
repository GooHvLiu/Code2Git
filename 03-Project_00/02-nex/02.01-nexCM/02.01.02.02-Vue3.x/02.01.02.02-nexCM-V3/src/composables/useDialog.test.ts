/**
 * ==========================================
 * composables/useDialog.ts 单元测试
 * ==========================================
 * 覆盖弹窗打开/关闭/标题切换（新增 vs 编辑）与提交流程
 * formRef 用 ref 包裹 mock FormInstance，与组件真实用法一致
 * 作者：GooHv
 */
import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDialog } from './useDialog'
import type { FormInstance } from 'element-plus'

interface FormState {
  name: string
  status: number
}

const defaultForm: FormState = { name: '', status: 0 }

/** 构造一个最小 FormInstance mock */
function makeFormRef(valid = true) {
  return {
    clearValidate: vi.fn(),
    validate: vi.fn((cb: (valid: boolean) => void) => cb(valid))
  }
}

describe('useDialog', () => {
  it('初始状态：关闭、标题为新增', () => {
    const { dialogVisible, dialogTitle, submitLoading } = useDialog<FormState>({
      addTitle: '新增用户',
      editTitle: '编辑用户'
    })
    expect(dialogVisible.value).toBe(false)
    expect(submitLoading.value).toBe(false)
    expect(dialogTitle.value).toBe('新增用户')
  })

  it('open(null) 打开新增弹窗，标题为新增，表单为默认值', async () => {
    const { dialogVisible, dialogTitle, open } = useDialog<FormState>({
      addTitle: '新增用户',
      editTitle: '编辑用户'
    })
    const form = ref<FormState>({ ...defaultForm })
    const formRef = ref<FormInstance | null>(makeFormRef() as unknown as FormInstance)
    open(null, form, { ...defaultForm }, formRef)
    expect(dialogVisible.value).toBe(true)
    await nextTick()
    expect(dialogTitle.value).toBe('新增用户')
    expect(form.value).toEqual({ ...defaultForm })
    expect((formRef.value as unknown as { clearValidate: ReturnType<typeof vi.fn> }).clearValidate).toHaveBeenCalled()
  })

  it('open(row) 打开编辑弹窗，标题为编辑并合并行数据', async () => {
    const { dialogTitle, open } = useDialog<FormState>({
      addTitle: '新增用户',
      editTitle: '编辑用户'
    })
    const form = ref<FormState>({ ...defaultForm })
    const formRef = ref<FormInstance | null>(makeFormRef() as unknown as FormInstance)
    open({ name: '张三', status: 1 }, form, { ...defaultForm }, formRef)
    await nextTick()
    expect(dialogTitle.value).toBe('编辑用户')
    expect(form.value).toEqual({ name: '张三', status: 1 })
  })

  it('close 关闭弹窗并重置表单', () => {
    const { dialogVisible, close } = useDialog<FormState>({
      addTitle: '新增用户',
      editTitle: '编辑用户'
    })
    const form = ref<FormState>({ name: '脏数据', status: 9 })
    const formRef = ref<FormInstance | null>(makeFormRef() as unknown as FormInstance)
    dialogVisible.value = true
    close(form, { ...defaultForm }, formRef)
    expect(dialogVisible.value).toBe(false)
    expect(form.value).toEqual({ ...defaultForm })
    expect((formRef.value as unknown as { clearValidate: ReturnType<typeof vi.fn> }).clearValidate).toHaveBeenCalled()
  })

  it('handleSubmit 校验通过后调用 submitApi', async () => {
    const submitApi = vi.fn().mockResolvedValue(undefined)
    const onSubmitSuccess = vi.fn()
    const { handleSubmit, submitLoading, dialogVisible } = useDialog<FormState>({
      addTitle: '新增用户',
      editTitle: '编辑用户',
      submitApi,
      onSubmitSuccess
    })
    const form = ref<FormState>({ name: '李四', status: 1 })
    const formRef = ref<FormInstance | null>(makeFormRef(true) as unknown as FormInstance)
    dialogVisible.value = true
    handleSubmit(form, formRef)
    // 等待 validate 回调与 submitApi 完成
    await nextTick()
    expect(submitApi).toHaveBeenCalledWith({ name: '李四', status: 1 })
    expect(onSubmitSuccess).toHaveBeenCalled()
    expect(submitLoading.value).toBe(false)
  })

  it('handleSubmit 校验不通过时不调用 submitApi', async () => {
    const submitApi = vi.fn()
    const { handleSubmit } = useDialog<FormState>({
      addTitle: '新增用户',
      editTitle: '编辑用户',
      submitApi
    })
    const form = ref<FormState>({ name: '', status: 0 })
    const formRef = ref<FormInstance | null>(makeFormRef(false) as unknown as FormInstance)
    handleSubmit(form, formRef)
    await nextTick()
    expect(submitApi).not.toHaveBeenCalled()
  })

  it('handleSubmit 无 formRef 时直接返回', async () => {
    const submitApi = vi.fn()
    const { handleSubmit } = useDialog<FormState>({ submitApi })
    const form = ref<FormState>({ ...defaultForm })
    const formRef = ref<FormInstance | null>(null)
    handleSubmit(form, formRef)
    await nextTick()
    expect(submitApi).not.toHaveBeenCalled()
  })
})
