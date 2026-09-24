/**
 * useSpConfigFileEditor —— 超级面板「配置文件 Monaco 在线编辑器」可复用封装
 * @author GooHv
 *
 * 把以下在 LanguageConfig / project-config / database 等多个页面重复出现的逻辑收敛为一个 composable：
 *  1. 编辑器弹窗显隐、内容/原始内容、脏标记(editorDirty)、标题(editorDialogTitle)
 *  2. 读取配置文件内容（readFile）
 *  3. 语法检查（checkSyntax）与结果展示
 *  4. 保存前备注弹窗 + 写回文件（writeFile）
 *  5. 备份版本历史：列表加载 / 恢复 / 删除
 *  6. 备份目录信息读取 / 修改
 *
 * @example
 * const editor = useSpConfigFileEditor({
 *   readFile: requestReadConfigFileApi,
 *   writeFile: requestWriteConfigFileApi,
 *   checkSyntax: requestCheckConfigSyntaxApi,
 *   getBackupList: requestGetConfigBackupListApi,
 *   restoreBackup: requestRestoreConfigBackupApi,
 *   deleteBackup: requestDeleteConfigBackupApi,
 *   getBackupDir: requestGetBackupDirApi,
 *   setBackupDir: requestSetBackupDirApi,
 *   onSaved: () => reloadCurrentPage(),
 * })
 * // 打开编辑：await editor.openEditor({ filePath: 'src/config/app.config.js', label: 'App 配置', highlightLine: 12 })
 */
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { showError, showSuccess, confirmAction } from '@/utils/ui/feedback'
import type { ConfigMetaItem } from '@/config/project-config.meta'

/** 备份版本条目 */
export interface SpBackupItem {
  name: string
  operator?: string
  remark?: string
  size?: number | string
  sizeFormatted?: string
  createTime?: string
  createTimeFormatted?: string
}

/** 语法检查结果 */
export interface SpSyntaxResult {
  valid: boolean
  message?: string
  error?: string
  warning?: string
}

/** 编辑器目标文件项 */
export interface SpEditorTarget {
  filePath: string
  label?: string
  meta?: ConfigMetaItem | null
  highlightLine?: number
}

type ReadFileApi = (filePath: string) => Promise<{ data: { content?: string } } | any>
type WriteFileApi = (payload: { filePath: string; content: string; remark?: string }) => Promise<unknown>
type CheckSyntaxApi = (payload: {
  filePath?: string
  content?: string
  language?: string
}) => Promise<{ data: SpSyntaxResult } | any>
type BackupListApi = (filePath: string) => Promise<{ data: SpBackupItem[] } | any>
type BackupMutateApi = (payload: { filePath: string; backupName: string }) => Promise<unknown>
type BackupDirGetApi = () => Promise<any>
type BackupDirSetApi = (payload: { backupPath: string }) => Promise<any>

interface SpConfigFileEditorApis {
  readFile: ReadFileApi
  writeFile: WriteFileApi
  checkSyntax: CheckSyntaxApi
  getBackupList: BackupListApi
  restoreBackup: BackupMutateApi
  deleteBackup: BackupMutateApi
  getBackupDir: BackupDirGetApi
  setBackupDir: BackupDirSetApi
  /** 保存/恢复成功后回调，用于刷新所属页面 */
  onSaved?: () => void | Promise<void>
}

export function useSpConfigFileEditor(apis: SpConfigFileEditorApis) {
  const { t } = useI18n()

  // ---------- 编辑器状态 ----------
  const editorDialogVisible = ref(false)
  const editorContent = ref('')
  const originalContent = ref('')
  const currentEditFile = ref('')
  const currentEditItem = ref<SpEditorTarget | null>(null)
  const editorLanguage = ref('javascript')
  const highlightLines = ref<number[]>([])
  const scrollToLine = ref<number | null>(null)
  const syntaxResult = ref<SpSyntaxResult | null>(null)
  const checkingSyntax = ref(false)
  const saving = ref(false)

  // ---------- 保存备注弹窗 ----------
  const saveDialogVisible = ref(false)
  const saveForm = ref<{ remark: string }>({ remark: '' })

  // ---------- 备份版本历史 ----------
  const showBackupPanel = ref(false)
  const backupList = ref<SpBackupItem[]>([])
  const backupListLoading = ref(false)

  // ---------- 备份目录 ----------
  const backupDirInfo = ref<{ absolute: string; relative: string }>({ absolute: '', relative: '' })
  const backupPathDialogVisible = ref(false)
  const backupPathForm = ref<{ newPath: string }>({ newPath: '' })
  const changingBackupPath = ref(false)

  const editorDirty = computed(() => editorContent.value !== originalContent.value)
  const editorDialogTitle = computed(() => {
    if (currentEditItem.value) {
      const label = currentEditItem.value.label || currentEditItem.value.filePath
      return `${label} - ${t('superPanel.projectConfig.editor.title')}`
    }
    return t('superPanel.projectConfig.editor.title')
  })

  /** 打开编辑器并读取文件内容 */
  async function openEditor(target: SpEditorTarget): Promise<void> {
    currentEditItem.value = target
    currentEditFile.value = target.filePath
    editorLanguage.value =
      target.filePath.endsWith('.js') || target.filePath.endsWith('.ts') ? 'javascript' : 'plaintext'
    highlightLines.value = target.highlightLine ? [target.highlightLine] : []
    scrollToLine.value = target.highlightLine || null
    syntaxResult.value = null
    try {
      const res = await apis.readFile(target.filePath)
      editorContent.value = res.data?.content || ''
      originalContent.value = editorContent.value
      editorDialogVisible.value = true
      loadBackupList()
      loadBackupDirInfo()
    } catch (err) {
      console.error('[useSpConfigFileEditor] 读取文件失败:', err)
      showError(t('superPanel.projectConfig.editor.readFailed'))
    }
  }

  /** 弹窗关闭后重置 */
  function handleEditorClosed(): void {
    editorContent.value = ''
    originalContent.value = ''
    currentEditFile.value = ''
    currentEditItem.value = null
    highlightLines.value = []
    scrollToLine.value = null
    syntaxResult.value = null
    showBackupPanel.value = false
    backupList.value = []
  }

  /** 语法检查 */
  async function checkSyntax(): Promise<void> {
    checkingSyntax.value = true
    try {
      const res = await apis.checkSyntax({ filePath: currentEditFile.value, content: editorContent.value })
      syntaxResult.value = res.data
      if (res.data?.valid) {
        showSuccess(t('superPanel.projectConfig.editor.syntaxValid'))
      } else {
        showError(t('superPanel.projectConfig.editor.syntaxInvalid'))
      }
    } catch (err) {
      console.error('[useSpConfigFileEditor] 语法检查失败:', err)
      showError(t('superPanel.projectConfig.editor.syntaxCheckFailed'))
    } finally {
      checkingSyntax.value = false
    }
  }

  /** 点击保存：打开备注弹窗 */
  function saveFile(): void {
    if (!editorDirty.value) return
    saveForm.value.remark = ''
    saveDialogVisible.value = true
  }

  /** 确认保存 */
  async function confirmSave(): Promise<void> {
    saving.value = true
    try {
      await apis.writeFile({
        filePath: currentEditFile.value,
        content: editorContent.value,
        remark: saveForm.value.remark
      })
      originalContent.value = editorContent.value
      saveDialogVisible.value = false
      showSuccess(t('superPanel.projectConfig.editor.saveSuccess'))
      loadBackupList()
      await apis.onSaved?.()
    } catch (err) {
      console.error('[useSpConfigFileEditor] 保存失败:', err)
    } finally {
      saving.value = false
    }
  }

  /** 加载备份列表 */
  async function loadBackupList(): Promise<void> {
    if (!currentEditFile.value) return
    backupListLoading.value = true
    try {
      const res = await apis.getBackupList(currentEditFile.value)
      backupList.value = res.data || []
    } catch (err) {
      console.error('[useSpConfigFileEditor] 加载备份列表失败:', err)
      showError(t('superPanel.projectConfig.backup.loadFailed'))
    } finally {
      backupListLoading.value = false
    }
  }

  /** 恢复备份 */
  async function restoreBackup(backup: SpBackupItem): Promise<void> {
    const ok = await confirmAction(t('superPanel.projectConfig.backup.restoreConfirm'), t('common.warning'), {
      type: 'warning'
    })
    if (!ok) return
    try {
      await apis.restoreBackup({ filePath: currentEditFile.value, backupName: backup.name })
      showSuccess(t('superPanel.projectConfig.backup.restoreSuccess'))
      const fileRes = await apis.readFile(currentEditFile.value)
      editorContent.value = fileRes.data?.content || ''
      originalContent.value = editorContent.value
      loadBackupList()
      await apis.onSaved?.()
    } catch (err) {
      console.error('[useSpConfigFileEditor] 恢复备份失败:', err)
    }
  }

  /** 删除备份 */
  async function deleteBackup(backup: SpBackupItem): Promise<void> {
    const ok = await confirmAction(t('superPanel.projectConfig.backup.deleteConfirm'), t('common.warning'), {
      type: 'warning'
    })
    if (!ok) return
    try {
      await apis.deleteBackup({ filePath: currentEditFile.value, backupName: backup.name })
      showSuccess(t('superPanel.projectConfig.backup.deleteSuccess'))
      loadBackupList()
    } catch (err) {
      console.error('[useSpConfigFileEditor] 删除备份失败:', err)
    }
  }

  /** 加载备份目录信息 */
  async function loadBackupDirInfo(): Promise<void> {
    try {
      const res = await apis.getBackupDir()
      backupDirInfo.value = (res.data || { absolute: '', relative: '' }) as { absolute: string; relative: string }
    } catch (err) {
      console.error('[useSpConfigFileEditor] 加载备份目录失败:', err)
    }
  }

  /** 打开备份路径设置弹窗 */
  function showBackupPathDialog(): void {
    backupPathForm.value.newPath = backupDirInfo.value.relative || ''
    backupPathDialogVisible.value = true
  }

  /** 确认修改备份路径 */
  async function confirmChangeBackupPath(): Promise<void> {
    if (!backupPathForm.value.newPath || !backupPathForm.value.newPath.trim()) {
      showError(t('superPanel.projectConfig.backupPathDialog.pathRequired'))
      return
    }
    changingBackupPath.value = true
    try {
      const res = await apis.setBackupDir({ backupPath: backupPathForm.value.newPath.trim() })
      backupDirInfo.value = (res.data?.new || { absolute: '', relative: '' }) as { absolute: string; relative: string }
      backupPathDialogVisible.value = false
      showSuccess(t('superPanel.projectConfig.backupPathDialog.changeSuccess'))
      loadBackupList()
    } catch (err) {
      console.error('[useSpConfigFileEditor] 修改备份路径失败:', err)
    } finally {
      changingBackupPath.value = false
    }
  }

  return {
    // state
    editorDialogVisible,
    editorContent,
    currentEditFile,
    editorLanguage,
    highlightLines,
    scrollToLine,
    syntaxResult,
    checkingSyntax,
    saving,
    saveDialogVisible,
    saveForm,
    showBackupPanel,
    backupList,
    backupListLoading,
    backupDirInfo,
    backupPathDialogVisible,
    backupPathForm,
    changingBackupPath,
    editorDirty,
    editorDialogTitle,
    // actions
    openEditor,
    handleEditorClosed,
    checkSyntax,
    saveFile,
    confirmSave,
    loadBackupList,
    restoreBackup,
    deleteBackup,
    loadBackupDirInfo,
    showBackupPathDialog,
    confirmChangeBackupPath
  }
}
