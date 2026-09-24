/**
 * useCrud - CRUD 页面通用组合式函数
 * 封装列表页的通用逻辑：列表、搜索、分页、新增、编辑、删除
 * 基于列表 + 弹窗 + 表单校验的通用收敛，减少重复代码
 *
 * 使用示例：
 * const {
 *   // 列表相关
 *   loading, tableData, total, pageNum, pageSize,
 *   getList, handleQuery, handleReset, handlePageChange, handleSizeChange,
 *   // 弹窗相关
 *   dialogVisible, submitLoading, dialogTitle,
 *   openDialog, closeDialog, handleSubmit,
 *   // 删除相关
 *   deleteLoading, handleDelete,
 *   // 表单相关
 *   form, formRef, resetForm, validateForm
 * } = useCrud<UserRow, UserForm>({
 *   listApi: getUserList,
 *   createApi: createUser,
 *   updateApi: updateUser,
 *   deleteApi: deleteUser,
 *   defaultForm: { username: '', password: '', role: '' },
 *   addTitle: 'common.add',
 *   editTitle: 'common.edit',
 *   deleteTitle: 'common.deleteConfirm',
 *   deleteMessage: 'common.deleteConfirmMessage',
 *   immediate: true
 * })
 *
 * 作者：GooHv
 */
import { ref, shallowRef, reactive, type Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { ApiResponse } from '@/types/api'
import { useI18n } from '@/composables/useI18n'

/** 列表数据片段 */
interface CrudPageData<T> {
  list?: T[]
  records?: T[]
  total?: number
}

/** 记录行（带可选 id / 名称字段） */
export interface CrudRow {
  id?: number | string
  name?: string
  username?: string
  [key: string]: unknown
}

export interface UseCrudOptions<T extends Record<string, unknown>, F extends Record<string, unknown>> {
  /** 列表接口 */
  listApi?: ((params: Record<string, unknown>) => Promise<ApiResponse<CrudPageData<T>>>) | null
  /** 新增接口 */
  createApi?: ((data: F) => Promise<unknown>) | null
  /** 编辑接口 */
  updateApi?: ((data: F) => Promise<unknown>) | null
  /** 删除接口（默认传 row.id） */
  deleteApi?: ((id: number | string) => Promise<unknown>) | null
  /** 默认表单 */
  defaultForm?: F
  /** 新增标题（i18n key） */
  addTitle?: string
  /** 编辑标题（i18n key） */
  editTitle?: string
  /** 删除确认标题（i18n key） */
  deleteTitle?: string
  /** 删除确认文案（i18n key） */
  deleteMessage?: string
  /** 挂载即加载 */
  immediate?: boolean
  /** 请求参数预处理 */
  beforeFetch?: (params: Record<string, unknown>) => Record<string, unknown>
  /** 列表拉取后回调 */
  afterFetch?: (res: ApiResponse<CrudPageData<T>>) => void
  /** 提交前处理（可改造提交数据） */
  beforeSubmit?: (form: F, isEdit: boolean) => F
  /** 提交后回调 */
  afterSubmit?: (form: F, isEdit: boolean) => void
  /** 删除前处理（可改造删除参数） */
  beforeDelete?: (row: CrudRow) => number | string
  /** 删除后回调 */
  afterDelete?: (row: CrudRow) => void
}

export interface UseCrudReturn<T extends Record<string, unknown>, F extends Record<string, unknown>> {
  loading: Ref<boolean>
  tableData: Ref<T[]>
  total: Ref<number>
  pageNum: Ref<number>
  pageSize: Ref<number>
  queryParams: Record<string, unknown>
  getList: () => Promise<void>
  handleQuery: () => void
  handleReset: () => void
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
  dialogVisible: Ref<boolean>
  submitLoading: Ref<boolean>
  dialogTitle: Ref<string>
  isEdit: Ref<boolean>
  currentId: Ref<number | string | null>
  openDialog: (row?: CrudRow | null) => void
  closeDialog: () => void
  handleSubmit: () => Promise<void>
  deleteLoading: Ref<boolean>
  handleDelete: (row: CrudRow) => Promise<void>
  form: Ref<F>
  formRef: Ref<FormInstance | null>
  resetForm: () => void
  validateForm: () => Promise<boolean>
}

export function useCrud<
  T extends Record<string, unknown> = Record<string, unknown>,
  F extends Record<string, unknown> = Record<string, unknown>
>(options: UseCrudOptions<T, F> = {}): UseCrudReturn<T, F> {
  const { t } = useI18n()

  const {
    listApi = null,
    createApi = null,
    updateApi = null,
    deleteApi = null,
    defaultForm = {} as F,
    addTitle = 'common.add',
    editTitle = 'common.edit',
    deleteTitle = 'common.deleteConfirm',
    deleteMessage = 'common.deleteConfirmMessage',
    immediate = true,
    beforeFetch = null,
    afterFetch = null,
    beforeSubmit = null,
    afterSubmit = null,
    beforeDelete = null,
    afterDelete = null
  } = options

  // ==================== 列表相关 ====================
  const loading = ref<boolean>(false)
  const tableData = shallowRef<T[]>([])
  const total = ref<number>(0)
  const pageNum = ref<number>(1)
  const pageSize = ref<number>(10)
  const queryParams = reactive<Record<string, unknown>>({})

  async function getList(): Promise<void> {
    if (!listApi) {
      console.warn('[useCrud] 请传入 listApi 方法')
      return
    }
    loading.value = true
    try {
      const params: Record<string, unknown> = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        ...queryParams
      }
      const finalParams = beforeFetch ? beforeFetch(params) : params
      const res = await listApi(finalParams)
      tableData.value = res.data?.list || res.data?.records || []
      total.value = res.data?.total || 0
      afterFetch && afterFetch(res)
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      loading.value = false
    }
  }

  function handleQuery(): void {
    pageNum.value = 1
    void getList()
  }

  function handleReset(): void {
    Object.keys(queryParams).forEach(key => {
      queryParams[key] = ''
    })
    pageNum.value = 1
    void getList()
  }

  function handlePageChange(page: number): void {
    pageNum.value = page
    void getList()
  }

  function handleSizeChange(size: number): void {
    pageSize.value = size
    pageNum.value = 1
    void getList()
  }

  // ==================== 弹窗相关 ====================
  const dialogVisible = ref<boolean>(false)
  const submitLoading = ref<boolean>(false)
  const dialogTitle = ref<string>(addTitle)
  const isEdit = ref<boolean>(false)
  const currentId = ref<number | string | null>(null)

  const form = ref<F>(JSON.parse(JSON.stringify(defaultForm)) as F) as Ref<F>
  const formRef = ref<FormInstance | null>(null)

  function openDialog(row: CrudRow | null = null): void {
    dialogVisible.value = true
    isEdit.value = !!row
    currentId.value = row?.id ?? null
    dialogTitle.value = row ? editTitle : addTitle

    // 重置表单
    form.value = JSON.parse(JSON.stringify(defaultForm)) as F
    if (row) {
      form.value = { ...form.value, ...row }
    }

    // 清除校验
    setTimeout(() => {
      formRef.value && formRef.value.clearValidate()
    }, 0)
  }

  function closeDialog(): void {
    dialogVisible.value = false
    form.value = JSON.parse(JSON.stringify(defaultForm)) as F
    formRef.value && formRef.value.clearValidate()
  }

  async function handleSubmit(): Promise<void> {
    if (!formRef.value) {
      console.warn('[useCrud] 未找到 formRef')
      return
    }

    // 校验表单
    const valid = await new Promise<boolean>(resolve => {
      formRef.value!.validate((v: boolean) => resolve(v))
    })
    if (!valid) return

    const api = isEdit.value ? updateApi : createApi
    if (!api) {
      console.warn('[useCrud] 请传入 createApi 或 updateApi 方法')
      return
    }

    submitLoading.value = true
    try {
      const submitData = beforeSubmit ? beforeSubmit(form.value, isEdit.value) : form.value
      await api(submitData)
      ElMessage.success(t(isEdit.value ? 'common.updateSuccess' : 'common.addSuccess'))
      closeDialog()
      await getList()
      afterSubmit && afterSubmit(form.value, isEdit.value)
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      submitLoading.value = false
    }
  }

  // ==================== 删除相关 ====================
  const deleteLoading = ref<boolean>(false)

  async function handleDelete(row: CrudRow): Promise<void> {
    if (!deleteApi) {
      console.warn('[useCrud] 请传入 deleteApi 方法')
      return
    }

    try {
      await ElMessageBox.confirm(t(deleteMessage, { name: row?.name || row?.username || '' }), t(deleteTitle), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
    } catch {
      return // 用户取消
    }

    deleteLoading.value = true
    try {
      const deleteData = beforeDelete ? beforeDelete(row) : (row.id as number | string)
      await deleteApi(deleteData)
      ElMessage.success(t('common.deleteSuccess'))
      await getList()
      afterDelete && afterDelete(row)
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      deleteLoading.value = false
    }
  }

  // ==================== 表单相关 ====================
  function resetForm(): void {
    form.value = JSON.parse(JSON.stringify(defaultForm)) as F
    formRef.value && formRef.value.clearValidate()
  }

  async function validateForm(): Promise<boolean> {
    if (!formRef.value) return true
    return new Promise<boolean>(resolve => {
      formRef.value!.validate((v: boolean) => resolve(v))
    })
  }

  // ==================== 初始化 ====================
  if (immediate && listApi) {
    void getList()
  }

  return {
    // 列表相关
    loading,
    tableData,
    total,
    pageNum,
    pageSize,
    queryParams,
    getList,
    handleQuery,
    handleReset,
    handlePageChange,
    handleSizeChange,
    // 弹窗相关
    dialogVisible,
    submitLoading,
    dialogTitle,
    isEdit,
    currentId,
    openDialog,
    closeDialog,
    handleSubmit,
    // 删除相关
    deleteLoading,
    handleDelete,
    // 表单相关
    form,
    formRef,
    resetForm,
    validateForm
  }
}
