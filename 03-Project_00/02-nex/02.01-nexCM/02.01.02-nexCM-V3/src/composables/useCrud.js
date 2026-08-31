/**
 * useCrud - CRUD 页面通用组合式函数
 * 封装列表页的通用逻辑：列表、搜索、分页、新增、编辑、删除
 * 基于 useTable + useDialog + useForm 封装，减少重复代码
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
 * } = useCrud({
 *   listApi: getUserList,
 *   createApi: createUser,
 *   updateApi: updateUser,
 *   deleteApi: deleteUser,
 *   defaultForm: { username: '', password: '', role: '' },
 *   addTitle: '新增用户',
 *   editTitle: '编辑用户',
 *   deleteTitle: '删除确认',
 *   deleteMessage: '确定要删除该用户吗？',
 *   immediate: true
 * })
 */
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-ui'
import { useI18n } from '@/composables/useI18n'

export function useCrud(options = {}) {
  const { t } = useI18n()

  const {
    // API 相关
    listApi = null,
    createApi = null,
    updateApi = null,
    deleteApi = null,
    // 表单相关
    defaultForm = {},
    // 标题相关
    addTitle = 'common.add',
    editTitle = 'common.edit',
    deleteTitle = 'common.deleteConfirm',
    deleteMessage = 'common.deleteConfirmMessage',
    // 其他
    immediate = true,
    beforeFetch = null,
    afterFetch = null,
    beforeSubmit = null,
    afterSubmit = null,
    beforeDelete = null,
    afterDelete = null
  } = options

  // ==================== 列表相关 ====================
  const loading = ref(false)
  const tableData = ref([])
  const total = ref(0)
  const pageNum = ref(1)
  const pageSize = ref(10)
  const queryParams = reactive({})

  async function getList() {
    if (!listApi) {
      console.warn('[useCrud] 请传入 listApi 方法')
      return
    }
    loading.value = true
    try {
      const params = {
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

  function handleQuery() {
    pageNum.value = 1
    getList()
  }

  function handleReset() {
    Object.keys(queryParams).forEach(key => {
      queryParams[key] = ''
    })
    pageNum.value = 1
    getList()
  }

  function handlePageChange(page) {
    pageNum.value = page
    getList()
  }

  function handleSizeChange(size) {
    pageSize.value = size
    pageNum.value = 1
    getList()
  }

  // ==================== 弹窗相关 ====================
  const dialogVisible = ref(false)
  const submitLoading = ref(false)
  const dialogTitle = ref(addTitle)
  const isEdit = ref(false)
  const currentId = ref(null)

  const form = ref({ ...defaultForm })
  const formRef = ref(null)

  function openDialog(row = null) {
    dialogVisible.value = true
    isEdit.value = !!row
    currentId.value = row?.id || null
    dialogTitle.value = row ? editTitle : addTitle

    // 重置表单
    form.value = JSON.parse(JSON.stringify(defaultForm))
    if (row) {
      form.value = { ...form.value, ...row }
    }

    // 清除校验
    setTimeout(() => {
      formRef.value && formRef.value.clearValidate()
    }, 0)
  }

  function closeDialog() {
    dialogVisible.value = false
    form.value = JSON.parse(JSON.stringify(defaultForm))
    formRef.value && formRef.value.clearValidate()
  }

  async function handleSubmit() {
    if (!formRef.value) {
      console.warn('[useCrud] 未找到 formRef')
      return
    }

    // 校验表单
    const valid = await new Promise(resolve => {
      formRef.value.validate(valid => resolve(valid))
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
      getList()
      afterSubmit && afterSubmit(form.value, isEdit.value)
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      submitLoading.value = false
    }
  }

  // ==================== 删除相关 ====================
  const deleteLoading = ref(false)

  async function handleDelete(row) {
    if (!deleteApi) {
      console.warn('[useCrud] 请传入 deleteApi 方法')
      return
    }

    try {
      await ElMessageBox.confirm(
        t(deleteMessage, { name: row?.name || row?.username || '' }),
        t(deleteTitle),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
    } catch {
      return // 用户取消
    }

    deleteLoading.value = true
    try {
      const deleteData = beforeDelete ? beforeDelete(row) : row.id
      await deleteApi(deleteData)
      ElMessage.success(t('common.deleteSuccess'))
      getList()
      afterDelete && afterDelete(row)
    } catch (e) {
      // 错误已由 request 拦截器统一处理
    } finally {
      deleteLoading.value = false
    }
  }

  // ==================== 表单相关 ====================
  function resetForm() {
    form.value = JSON.parse(JSON.stringify(defaultForm))
    formRef.value && formRef.value.clearValidate()
  }

  async function validateForm() {
    if (!formRef.value) return true
    return new Promise(resolve => {
      formRef.value.validate(valid => resolve(valid))
    })
  }

  // ==================== 初始化 ====================
  if (immediate && listApi) {
    getList()
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
