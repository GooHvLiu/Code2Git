<template>
  <div class="language-config-container">
    <!-- 配置文件卡片 -->
    <div class="config-cards">
      <div v-for="item in configItems" :key="item.key" class="config-card">
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="config-name">
            <el-icon class="name-icon"><component :is="getEditTypeIcon(item.meta?.editType)" /></el-icon>
            <span>{{ item.meta?.labelKey ? t(item.meta.labelKey) : item.label }}</span>
          </div>
          <div class="config-tags">
            <el-tooltip v-if="item.meta?.editType" :content="t(getEditTypeTipKey(item.meta.editType))" placement="top">
              <el-tag :type="getEditTypeTagType(item.meta.editType)" size="small" effect="light">
                {{ t(getEditTypeLabelKey(item.meta.editType)) }}
              </el-tag>
            </el-tooltip>
            <el-tooltip v-if="item.meta?.effectType" :content="t(getEffectTypeTipKey(item.meta.effectType))" placement="top">
              <el-tag :type="getEffectTypeTagType(item.meta.effectType)" size="small" effect="plain">
                {{ t(getEffectTypeLabelKey(item.meta.effectType)) }}
              </el-tag>
            </el-tooltip>
            <el-tooltip v-if="getOwnerType(item.meta)" :content="t(getOwnerTypeConfig(getOwnerType(item.meta)).descriptionKey)" placement="top">
              <el-tag :type="getOwnerTypeConfig(getOwnerType(item.meta)).type" size="small" effect="plain">
                <el-icon><component :is="getOwnerTypeConfig(getOwnerType(item.meta)).icon" /></el-icon>
                {{ t(getOwnerTypeConfig(getOwnerType(item.meta)).labelKey) }}
              </el-tag>
            </el-tooltip>
          </div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-body">
          <div class="config-value">
            <span class="lang-count-text">{{ t('superPanel.config.language.currentSupportedLangs') }}：</span>
            <span class="lang-count-number">{{ presetLanguages.length }}</span>
            <span class="lang-count-unit">{{ t('superPanel.config.language.totalLangsUnit') }}</span>
          </div>
          <div class="lang-preview">
            <el-tag v-for="lang in presetLanguages.slice(0, 8)" :key="lang.code" size="small" class="lang-tag">
              <SvgIcon :icon-class="lang.flag || 'global'" class-name="lang-flag-icon" />
              <span>{{ lang.autonym }}</span>
            </el-tag>
            <el-tag v-if="presetLanguages.length > 8" size="small" type="info" class="lang-tag">
              +{{ presetLanguages.length - 8 }}
            </el-tag>
          </div>
        </div>

        <!-- 卡片底部 -->
        <div class="card-footer">
          <div v-if="item.meta?.descriptionKey || item.meta?.description" class="config-desc">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ item.meta?.descriptionKey ? t(item.meta.descriptionKey) : item.meta.description }}</span>
          </div>
          <div class="config-actions">
            <el-button type="primary" size="small" @click="openEditor(item)">
              <el-icon><Edit /></el-icon>&nbsp;{{ t('superPanel.projectConfig.actions.editFile') }}
            </el-button>
            <el-button size="small" @click="viewLanguages">
              <el-icon><View /></el-icon>&nbsp;{{ t('superPanel.config.language.viewLanguages') }}
            </el-button>
          </div>
        </div>

        <!-- 文件路径 -->
        <div v-if="item.meta" class="file-path">
          <template v-if="getSourceType(item.meta) === 'file'">
            <el-icon><FolderOpened /></el-icon>
            <code>{{ item.meta.filePath }}</code>
          </template>
        </div>
      </div>
    </div>

    <!-- Monaco 编辑器弹窗 -->
    <el-dialog v-model="editorDialogVisible" :title="editorDialogTitle" width="90%" top="5vh" :close-on-click-modal="false" append-to-body @closed="handleEditorClosed">
      <div class="editor-dialog-content">
        <!-- 工具栏 -->
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <el-tag size="small" type="info">{{ currentEditFile }}</el-tag>
            <el-tag size="small" :type="editorDirty ? 'warning' : 'success'">
              {{ editorDirty ? t('superPanel.projectConfig.editor.unsaved') : t('superPanel.projectConfig.editor.saved') }}
            </el-tag>
          </div>
          <div class="toolbar-right">
            <el-button size="small" :loading="checkingSyntax" @click="checkSyntax">
              <el-icon><Check /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.syntaxCheck') }}
            </el-button>
            <el-button size="small" @click="showBackupPanel = !showBackupPanel">
              <el-icon><Back /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.versionHistory') }}
            </el-button>
            <el-button size="small" type="primary" :loading="saving" :disabled="!editorDirty" @click="saveFile">
              <el-icon><Document /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.save') }}
            </el-button>
          </div>
        </div>

        <!-- 语法检查结果 -->
        <div v-if="syntaxResult" class="syntax-result" :class="syntaxResult.valid ? 'success' : 'error'">
          <el-icon><component :is="syntaxResult.valid ? SuccessFilled : CircleCloseFilled" /></el-icon>
          <span>{{ syntaxResult.message }}</span>
        </div>

        <!-- 编辑器主体 -->
        <div class="editor-main">
          <div class="editor-wrapper" :class="{ 'with-backup': showBackupPanel }">
            <MonacoEditor v-model="editorContent" :language="editorLanguage" theme="vs" :read-only="false" />
          </div>

          <!-- 版本历史面板 -->
          <div v-if="showBackupPanel" class="backup-panel">
            <div class="panel-header">
              <span class="panel-title">{{ t('superPanel.projectConfig.backup.title') }}</span>
              <el-button size="small" @click="loadBackupList"><el-icon><Refresh /></el-icon></el-button>
            </div>
            <div v-loading="backupListLoading" :element-loading-text="t('common.loading')" class="backup-list">
              <div v-for="backup in backupList" :key="backup.name" class="backup-item">
                <div class="backup-header">
                  <el-icon><Clock /></el-icon>
                  <span class="backup-time">{{ backup.createTimeFormatted || backup.createTime || backup.name }}</span>
                </div>
                <div class="backup-meta">
                  <span>{{ backup.sizeFormatted || backup.size || '' }}</span>
                </div>
                <div class="backup-actions" @click.stop>
                  <el-button size="small" type="warning" @click="restoreBackup(backup)">
                    {{ t('superPanel.projectConfig.backup.restore') }}
                  </el-button>
                  <el-button size="small" type="danger" @click="deleteBackup(backup)">
                    {{ t('superPanel.projectConfig.backup.delete') }}
                  </el-button>
                </div>
              </div>
              <div v-if="backupList.length === 0 && !backupListLoading" class="backup-empty">
                <el-icon><Document /></el-icon>
                <p>{{ t('superPanel.projectConfig.backup.empty') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="editor-tip">
          <el-alert :title="t('superPanel.config.language.tipTitle')" type="warning" :closable="false" show-icon>
            <template #default>
              <p>{{ t('superPanel.config.language.tipContent') }}</p>
              <p class="tip-extra">{{ t('superPanel.config.language.tipExtra') }}</p>
            </template>
          </el-alert>
        </div>
      </div>
    </el-dialog>

    <!-- 语言列表预览对话框 -->
    <el-dialog v-model="languageDialogVisible" :title="t('superPanel.config.language.currentSupportedLangs')" width="60%" top="10vh">
      <div class="language-preview">
        <div class="lang-tags">
          <el-tag v-for="lang in presetLanguages" :key="lang.code" size="small" class="lang-tag">
            <SvgIcon :icon-class="lang.flag || 'global'" class-name="lang-flag-icon" />
            <span class="lang-tag-text">{{ lang.autonym }} ({{ lang.code }})</span>
          </el-tag>
        </div>
        <div class="lang-count-info">
          {{ t('superPanel.config.language.totalLangs', { count: presetLanguages.length }) }}
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="languageDialogVisible = false">{{ t('common.close') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 预设语言配置：卡片 + Monaco 在线编辑 + 语法检查 + 备份版本历史
 * @author GooHv
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { showError, showSuccess, confirmAction } from '@/utils/ui/feedback'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {
  requestGetPresetLanguagesConfigApi,
  requestSavePresetLanguagesConfigApi,
  requestGetPresetLanguagesApi
} from '@/api/i18n-manager'
import {
  requestCheckConfigSyntaxApi,
  requestGetConfigBackupListApi,
  requestRestoreConfigBackupApi,
  requestDeleteConfigBackupApi
} from '@/api/project-config'
import {
  Files,
  Document,
  Setting,
  EditPen,
  Monitor,
  Cpu,
  InfoFilled,
  Edit,
  View,
  FolderOpened,
  Check,
  Back,
  Refresh,
  Clock,
  SuccessFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()

// 编辑类型常量
const EDIT_TYPE = { DATABASE: 'database', CONFIG_FILE: 'configFile', ENV_FILE: 'envFile', CODE: 'code' } as const
// 生效类型常量
const EFFECT_TYPE = { IMMEDIATE: 'immediate', RESTART: 'restart', REBUILD: 'rebuild' } as const

interface OwnerTypeConfig {
  labelKey: string
  descriptionKey: string
  icon: unknown
  type: 'primary' | 'success'
}

const OWNER_TYPE_CONFIG: Record<string, OwnerTypeConfig> = {
  frontend: { labelKey: 'superPanel.projectConfig.ownerType.frontend', descriptionKey: 'superPanel.projectConfig.ownerType.frontendTip', icon: Monitor, type: 'primary' },
  backend: { labelKey: 'superPanel.projectConfig.ownerType.backend', descriptionKey: 'superPanel.projectConfig.ownerType.backendTip', icon: Cpu, type: 'success' }
}

interface ConfigMeta {
  labelKey?: string
  descriptionKey?: string
  description?: string
  editType?: string
  effectType?: string
  owner?: string
  filePath?: string
  sourceType?: string
}
interface ConfigItem {
  key: string
  label: string
  meta?: ConfigMeta
}
interface PresetLang {
  code: string
  autonym: string
  flag?: string
}
interface BackupItem {
  name: string
  size?: number | string
  sizeFormatted?: string
  createTime?: string
  createTimeFormatted?: string
}
interface SyntaxResult {
  valid: boolean
  message: string
}

const loading = ref(false)
const saving = ref(false)
const checkingSyntax = ref(false)
const editorDialogVisible = ref(false)
const languageDialogVisible = ref(false)
const editorContent = ref('')
const originalContent = ref('')
const currentEditFile = ref('')
const currentEditItem = ref<ConfigItem | null>(null)
const editorLanguage = ref('javascript')
const syntaxResult = ref<SyntaxResult | null>(null)
const presetLanguages = ref<PresetLang[]>([])
const showBackupPanel = ref(false)
const backupList = ref<BackupItem[]>([])
const backupListLoading = ref(false)

const configItems = ref<ConfigItem[]>([
  {
    key: 'languagesConfig',
    label: '预设语言配置',
    meta: {
      labelKey: 'superPanel.config.language.title',
      descriptionKey: 'superPanel.config.language.desc',
      editType: EDIT_TYPE.CONFIG_FILE,
      effectType: EFFECT_TYPE.RESTART,
      owner: 'backend',
      filePath: 'src/config/languages.config.js',
      sourceType: 'file'
    }
  }
])

const editorDirty = computed(() => editorContent.value !== originalContent.value)
const editorDialogTitle = computed(() => {
  if (currentEditItem.value) {
    const label = currentEditItem.value.meta?.labelKey
      ? t(currentEditItem.value.meta.labelKey)
      : currentEditItem.value.label
    return `${label} - ${t('superPanel.projectConfig.editor.title')}`
  }
  return t('superPanel.projectConfig.editor.title')
})

function loadPresetLanguages(): Promise<void> {
  return requestGetPresetLanguagesApi().then((res: any) => {
    presetLanguages.value = (res.data as PresetLang[]) || []
  }).catch((err: unknown) => {
    console.error('[LanguageConfig] 加载预设语言列表失败:', err)
  })
}

function getEditTypeIcon(editType?: string): unknown {
  const map: Record<string, unknown> = {
    [EDIT_TYPE.DATABASE]: Files,
    [EDIT_TYPE.CONFIG_FILE]: Document,
    [EDIT_TYPE.ENV_FILE]: Setting,
    [EDIT_TYPE.CODE]: EditPen
  }
  return (editType && map[editType]) || Setting
}
function getEditTypeTagType(editType?: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    [EDIT_TYPE.DATABASE]: 'success',
    [EDIT_TYPE.CONFIG_FILE]: 'warning',
    [EDIT_TYPE.ENV_FILE]: 'danger',
    [EDIT_TYPE.CODE]: 'info'
  }
  return (editType && map[editType]) || 'info'
}
function getEditTypeLabelKey(editType?: string): string {
  const map: Record<string, string> = {
    [EDIT_TYPE.DATABASE]: 'superPanel.projectConfig.editType.database',
    [EDIT_TYPE.CONFIG_FILE]: 'superPanel.projectConfig.editType.configFile',
    [EDIT_TYPE.ENV_FILE]: 'superPanel.projectConfig.editType.envFile',
    [EDIT_TYPE.CODE]: 'superPanel.projectConfig.editType.code'
  }
  return (editType && map[editType]) || 'superPanel.projectConfig.editType.code'
}
function getEditTypeTipKey(editType?: string): string {
  const map: Record<string, string> = {
    [EDIT_TYPE.DATABASE]: 'superPanel.projectConfig.editType.databaseTip',
    [EDIT_TYPE.CONFIG_FILE]: 'superPanel.projectConfig.editType.configFileTip',
    [EDIT_TYPE.ENV_FILE]: 'superPanel.projectConfig.editType.envFileTip',
    [EDIT_TYPE.CODE]: 'superPanel.projectConfig.editType.codeTip'
  }
  return (editType && map[editType]) || 'superPanel.projectConfig.editType.codeTip'
}
function getEffectTypeTagType(effectType?: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    [EFFECT_TYPE.IMMEDIATE]: 'success',
    [EFFECT_TYPE.RESTART]: 'warning',
    [EFFECT_TYPE.REBUILD]: 'danger'
  }
  return (effectType && map[effectType]) || 'info'
}
function getEffectTypeLabelKey(effectType?: string): string {
  const map: Record<string, string> = {
    [EFFECT_TYPE.IMMEDIATE]: 'superPanel.projectConfig.effectType.immediate',
    [EFFECT_TYPE.RESTART]: 'superPanel.projectConfig.effectType.restart',
    [EFFECT_TYPE.REBUILD]: 'superPanel.projectConfig.effectType.rebuild'
  }
  return (effectType && map[effectType]) || 'superPanel.projectConfig.effectType.restart'
}
function getEffectTypeTipKey(effectType?: string): string {
  const map: Record<string, string> = {
    [EFFECT_TYPE.IMMEDIATE]: 'superPanel.projectConfig.effectType.immediateTip',
    [EFFECT_TYPE.RESTART]: 'superPanel.projectConfig.effectType.restartTip',
    [EFFECT_TYPE.REBUILD]: 'superPanel.projectConfig.effectType.rebuildTip'
  }
  return (effectType && map[effectType]) || 'superPanel.projectConfig.effectType.restartTip'
}
function getOwnerType(meta?: ConfigMeta): string {
  if (!meta) return ''
  return meta.owner || 'backend'
}
function getOwnerTypeConfig(ownerType: string): OwnerTypeConfig {
  return OWNER_TYPE_CONFIG[ownerType] || OWNER_TYPE_CONFIG.backend
}
function getSourceType(meta?: ConfigMeta): string {
  if (!meta) return ''
  return meta.sourceType || 'file'
}

async function openEditor(item: ConfigItem): Promise<void> {
  currentEditItem.value = item
  currentEditFile.value = item.meta?.filePath || ''
  editorLanguage.value = 'javascript'
  syntaxResult.value = null
  loading.value = true
  try {
    const res: any = await requestGetPresetLanguagesConfigApi()
    editorContent.value = (res.data as string) || ''
    originalContent.value = editorContent.value
    editorDialogVisible.value = true
    loadBackupList()
  } catch (err) {
    console.error('[LanguageConfig] 加载配置失败:', err)
    showError(t('superPanel.config.language.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function checkSyntax(): Promise<void> {
  checkingSyntax.value = true
  syntaxResult.value = null
  try {
    const res: any = await requestCheckConfigSyntaxApi({ content: editorContent.value, language: 'javascript' })
    const valid = res.data?.valid !== false
    syntaxResult.value = {
      valid,
      message: res.data?.message || (valid ? t('superPanel.projectConfig.editor.syntaxValid') : t('superPanel.projectConfig.editor.syntaxInvalid'))
    }
  } catch (err: any) {
    console.error('[LanguageConfig] 语法检查失败:', err)
    syntaxResult.value = {
      valid: false,
      message: `${t('superPanel.projectConfig.editor.syntaxCheckFailed')}：${err.message || t('superPanel.projectConfig.editor.syntaxInvalid')}`
    }
  } finally {
    checkingSyntax.value = false
  }
}

async function saveFile(): Promise<void> {
  if (!editorContent.value.trim()) {
    showError(t('superPanel.config.language.emptyWarning'))
    return
  }
  saving.value = true
  try {
    await requestSavePresetLanguagesConfigApi(editorContent.value as unknown as Record<string, unknown>)
    originalContent.value = editorContent.value
    showSuccess(t('superPanel.config.language.saveSuccess'))
    loadPresetLanguages()
    editorDialogVisible.value = false
  } catch (err) {
    console.error('[LanguageConfig] 保存配置失败:', err)
    showError(t('superPanel.config.language.saveFailed'))
  } finally {
    saving.value = false
  }
}

function handleEditorClosed(): void {
  currentEditItem.value = null
  currentEditFile.value = ''
  editorContent.value = ''
  originalContent.value = ''
  syntaxResult.value = null
  showBackupPanel.value = false
  backupList.value = []
}
function viewLanguages(): void {
  languageDialogVisible.value = true
}

function loadBackupList(): Promise<void> {
  backupListLoading.value = true
  return requestGetConfigBackupListApi(currentEditFile.value).then((res: any) => {
    backupList.value = (res.data as BackupItem[]) || []
  }).catch((err: unknown) => {
    console.error('[LanguageConfig] 加载备份列表失败:', err)
    showError(t('superPanel.projectConfig.backup.loadFailed'))
  }).finally(() => {
    backupListLoading.value = false
  })
}

async function restoreBackup(backup: BackupItem): Promise<void> {
  const ok = await confirmAction(t('superPanel.projectConfig.backup.restoreConfirm'), t('superPanel.projectConfig.backup.restore'), { type: 'warning' })
  if (!ok) return
  try {
    await requestRestoreConfigBackupApi({ filePath: currentEditFile.value, backupName: backup.name })
    showSuccess(t('superPanel.projectConfig.backup.restoreSuccess'))
    const res: any = await requestGetPresetLanguagesConfigApi()
    editorContent.value = (res.data as string) || ''
    originalContent.value = editorContent.value
    loadBackupList()
    loadPresetLanguages()
  } catch (err) {
    console.error('[LanguageConfig] 恢复备份失败:', err)
    showError(t('superPanel.projectConfig.backup.restoreFailed'))
  }
}

async function deleteBackup(backup: BackupItem): Promise<void> {
  const ok = await confirmAction(t('superPanel.projectConfig.backup.deleteConfirm'), t('superPanel.projectConfig.backup.delete'), { type: 'warning' })
  if (!ok) return
  try {
    await requestDeleteConfigBackupApi({ filePath: currentEditFile.value, backupName: backup.name })
    showSuccess(t('superPanel.projectConfig.backup.deleteSuccess'))
    loadBackupList()
  } catch (err) {
    console.error('[LanguageConfig] 删除备份失败:', err)
    showError(t('superPanel.projectConfig.backup.deleteFailed'))
  }
}

onMounted(() => {
  loadPresetLanguages()
})
</script>

<style scoped>
.language-config-container { padding: 0; }
.config-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 15px; }
.config-card { border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; transition: all 0.2s; }
.config-card:hover { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-color: #dcdfe6; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: #fafafa; border-bottom: 1px solid #ebeef5; }
.config-name { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #303133; }
.name-icon { font-size: 16px; color: #409eff; }
.config-tags { display: flex; gap: 5px; }
.card-body { padding: 15px; }
.config-value { font-size: 14px; color: #606266; margin-bottom: 10px; display: flex; align-items: baseline; gap: 4px; }
.lang-count-text { color: #909399; }
.lang-count-number { font-size: 20px; font-weight: 600; color: #409eff; }
.lang-count-unit { color: #909399; }
.lang-preview { display: flex; flex-wrap: wrap; gap: 6px; }
.lang-tag { display: flex; align-items: center; gap: 4px; }
.lang-flag-icon { width: 14px; height: 14px; vertical-align: middle; }
.card-footer { padding: 10px 15px; border-top: 1px solid #f0f0f0; }
.config-desc { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; color: #909399; margin-bottom: 10px; line-height: 1.5; }
.config-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.file-path { display: flex; align-items: center; gap: 5px; padding: 8px 15px; background: #f5f7fa; border-top: 1px solid #ebeef5; font-size: 12px; }
.file-path code { font-family: "Consolas", "Monaco", "Courier New", monospace; background: #fff; padding: 2px 6px; border-radius: 3px; color: #606266; font-size: 11px; }
.editor-dialog-content { display: flex; flex-direction: column; gap: 12px; }
.editor-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #f5f7fa; border-radius: 4px; }
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 10px; }
.syntax-result { padding: 10px 15px; border-radius: 4px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
.syntax-result.success { background: #f0f9eb; color: #67c23a; border: 1px solid #e1f3d8; }
.syntax-result.error { background: #fef0f0; color: #f56c6c; border: 1px solid #fde2e2; }
.editor-main { flex: 1; display: flex; gap: 10px; min-height: 500px; height: 500px; }
.editor-wrapper { flex: 1; border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; }
.backup-panel { width: 280px; flex-shrink: 0; border: 1px solid #ebeef5; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.backup-panel .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fafafa; border-bottom: 1px solid #ebeef5; }
.backup-panel .panel-title { font-size: 14px; font-weight: 600; color: #303133; }
.backup-list { flex: 1; overflow-y: auto; padding: 10px; }
.backup-item { padding: 10px; border: 1px solid #ebeef5; border-radius: 4px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
.backup-item:hover { border-color: #409eff; }
.backup-header { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
.backup-header i { color: #909399; font-size: 12px; }
.backup-time { font-size: 13px; font-weight: 500; color: #303133; }
.backup-meta { display: flex; justify-content: space-between; font-size: 11px; color: #909399; margin-bottom: 6px; }
.backup-actions { display: flex; gap: 5px; }
.backup-empty { text-align: center; padding: 30px 0; color: #909399; }
.backup-empty .el-icon { font-size: 36px; margin-bottom: 10px; }
.backup-empty p { font-size: 13px; margin: 0; }
.editor-tip { margin-top: 10px; }
.tip-extra { margin-top: 8px; color: #909399; font-size: 12px; }
.language-preview { padding: 10px 0; }
.lang-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
.lang-tag { display: flex; align-items: center; gap: 6px; padding: 6px 12px; }
.lang-tag-text { font-size: 13px; }
.lang-count-info { text-align: center; color: #909399; font-size: 13px; padding-top: 10px; border-top: 1px solid #ebeef5; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 10px; }
</style>
