<template>
  <div class="project-config-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.projectConfig.page.title') }}</h2>
        <p class="page-desc">{{ t('superPanel.projectConfig.page.desc') }}</p>
      </div>
      <div class="header-right">
        <el-tooltip :content="t('common.refresh')" placement="bottom">
          <el-button circle :loading="loading" @click="handleRefresh"><el-icon><Refresh /></el-icon></el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 主体 -->
    <div class="config-body">
      <!-- 左侧分类导航 -->
      <div class="config-sidebar">
        <div
          v-for="item in menuList"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeMenu === item.key }"
          @click="activeMenu = item.key"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ t(item.titleKey) }}</span>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div v-loading="loading" :element-loading-text="t('common.loading')" class="config-content">
        <!-- 翻译配置状态 -->
        <div v-if="activeMenu === 'translation'" class="translation-config-panel">
          <div class="panel-header">
            <h3 class="panel-title"><el-icon><Connection /></el-icon>{{ t('superPanel.projectConfig.translation.menu') }}</h3>
            <el-button type="primary" size="small" @click="goToTranslationConfig">
              <el-icon><Setting /></el-icon>&nbsp;{{ t('superPanel.projectConfig.translation.goToConfig') }}
            </el-button>
          </div>
          <div class="config-status-cards">
            <div class="status-card">
              <div class="status-label">{{ t('superPanel.config.translation.enableTranslation') }}</div>
              <div class="status-value">
                <el-tag :type="translationConfig.enabled ? 'success' : 'info'" size="small">
                  {{ translationConfig.enabled ? t('superPanel.config.translation.enabled') : t('superPanel.config.translation.disabled') }}
                </el-tag>
              </div>
            </div>
            <div class="status-card">
              <div class="status-label">{{ t('superPanel.config.translation.provider') }}</div>
              <div class="status-value"><el-tag type="warning" size="small">{{ t('superPanel.config.translation.providerTencent') }}</el-tag></div>
            </div>
            <div class="status-card">
              <div class="status-label">{{ t('superPanel.config.translation.masterLanguage') }}</div>
              <div class="status-value">
                <el-tag type="primary" size="small">{{ translationConfig.masterLanguage || 'zh-CN' }}</el-tag>
              </div>
            </div>
            <div class="status-card">
              <div class="status-label">{{ t('superPanel.config.translation.secretId') }}</div>
              <div class="status-value code-value">{{ translationConfig.tencent?.secretId || '-' }}</div>
            </div>
            <div class="status-card">
              <div class="status-label">{{ t('superPanel.config.translation.region') }}</div>
              <div class="status-value">{{ translationConfig.tencent?.region || '-' }}</div>
            </div>
            <div class="status-card">
              <div class="status-label">{{ t('superPanel.config.translation.projectId') }}</div>
              <div class="status-value">{{ translationConfig.tencent?.projectId ?? '-' }}</div>
            </div>
          </div>
          <el-alert
            :title="t('superPanel.projectConfig.translation.tipTitle')"
            :description="t('superPanel.projectConfig.translation.tipContent')"
            type="info"
            :closable="false"
            show-icon
            class="config-tip"
          />
        </div>

        <!-- 支持语言 -->
        <LanguageConfig v-else-if="activeMenu === 'i18n'" />

        <!-- 其他：卡片 -->
        <template v-else>
          <div class="config-cards">
            <div v-for="item in currentConfigItems" :key="item.key" class="config-card">
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

              <div class="card-body">
                <div class="config-value" :class="{ 'is-code': item.isCode, 'is-path': item.isPath }">
                  <template v-if="item.isBoolean">
                    <el-tag :type="item.value ? 'success' : 'info'" size="small">
                      {{ item.value ? t('common.enable') : t('common.disable') }}
                    </el-tag>
                  </template>
                  <span v-else-if="item.isPassword" class="password-mask">{{ item.value }}</span>
                  <template v-else>{{ item.displayValue || item.value }}</template>
                </div>
              </div>

              <div class="card-footer">
                <div v-if="item.meta?.descriptionKey || item.meta?.description" class="config-desc">
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ item.meta?.descriptionKey ? t(item.meta.descriptionKey) : item.meta.description }}</span>
                </div>
                <div class="config-actions">
                  <el-button
                    v-if="item.meta?.editType === 'database' && item.meta?.redirectPath"
                    type="primary"
                    size="small"
                    @click="goToConfig(item.meta)"
                  >
                    <el-icon><Promotion /></el-icon>&nbsp;{{ t('superPanel.projectConfig.actions.goToConfig') }}
                  </el-button>
                  <el-tooltip v-if="canEditFile(item.meta) && !isFileInWhitelist(item.meta)" :content="t('superPanel.projectConfig.tips.notInWhitelist')" placement="top">
                    <el-button type="warning" size="small" @click="openEditorFromCard(item)">
                      <el-icon><Edit /></el-icon>&nbsp;{{ t('superPanel.projectConfig.actions.editFile') }}
                    </el-button>
                  </el-tooltip>
                  <el-button
                    v-if="canEditFile(item.meta) && isFileInWhitelist(item.meta)"
                    type="primary"
                    size="small"
                    @click="openEditorFromCard(item)"
                  >
                    <el-icon><Edit /></el-icon>&nbsp;{{ t('superPanel.projectConfig.actions.editFile') }}
                  </el-button>
                  <el-tooltip v-if="item.meta?.editType === 'code'" :content="t('superPanel.projectConfig.tips.codeConstant')" placement="top">
                    <el-tag type="info" size="small" effect="plain">
                      <el-icon><WarningFilled /></el-icon>&nbsp;{{ t('superPanel.projectConfig.tips.needCodeChange') }}
                    </el-tag>
                  </el-tooltip>
                </div>
              </div>

              <div v-if="item.meta" class="file-path">
                <template v-if="getSourceType(item.meta) === 'database'">
                  <el-icon><Files /></el-icon>
                  <code>{{ getFileOrTableName(item.meta) }}</code>
                </template>
                <template v-else-if="getSourceType(item.meta) === 'file'">
                  <el-icon><FolderOpened /></el-icon>
                  <code>{{ item.meta.filePath }}</code>
                </template>
                <template v-else-if="getSourceType(item.meta) === 'runtime'">
                  <el-icon><Monitor /></el-icon>
                  <code>{{ t('superPanel.projectConfig.sourceType.runtime') }}</code>
                </template>
                <template v-else>
                  <el-icon><EditPen /></el-icon>
                  <code v-if="item.meta.filePath">{{ item.meta.filePath }}</code>
                  <code v-else>{{ t('superPanel.projectConfig.sourceType.code') }}</code>
                </template>
              </div>
            </div>
          </div>

          <div v-if="currentConfigItems.length === 0 && !loading" class="empty-state">
            <el-icon class="empty-icon"><Document /></el-icon>
            <p>{{ t('superPanel.projectConfig.empty.noConfig') }}</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Monaco 编辑器弹窗 -->
    <el-dialog
      v-model="editor.editorDialogVisible.value"
      :title="editor.editorDialogTitle.value"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
      append-to-body
      @closed="editor.handleEditorClosed"
    >
      <div class="editor-dialog-content">
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <el-tag size="small" type="info">{{ editor.currentEditFile.value }}</el-tag>
            <el-tag size="small" :type="editor.editorDirty.value ? 'warning' : 'success'">
              {{ editor.editorDirty.value ? t('superPanel.projectConfig.editor.unsaved') : t('superPanel.projectConfig.editor.saved') }}
            </el-tag>
            <div class="backup-path-wrapper">
              <el-button size="small" @click="editor.showBackupPathDialog()">
                <el-icon><FolderOpened /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.backupPath') }}
              </el-button>
              <el-tooltip :content="editor.backupDirInfo.value.absolute || t('superPanel.projectConfig.editor.backupPathLoading')" placement="bottom">
                <el-icon class="backup-path-tip"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </div>
          <div class="toolbar-right">
            <el-button size="small" :loading="editor.checkingSyntax.value" @click="editor.checkSyntax()">
              <el-icon><Check /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.syntaxCheck') }}
            </el-button>
            <el-button size="small" @click="editor.showBackupPanel.value = !editor.showBackupPanel.value">
              <el-icon><Back /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.versionHistory') }}
            </el-button>
            <el-button size="small" type="primary" :loading="editor.saving.value" :disabled="!editor.editorDirty.value" @click="editor.saveFile()">
              <el-icon><Document /></el-icon>&nbsp;{{ t('superPanel.projectConfig.editor.save') }}
            </el-button>
          </div>
        </div>

        <div class="editor-main">
          <div class="editor-wrapper">
            <MonacoEditor
              v-model="editor.editorContent.value"
              :language="editor.editorLanguage.value"
              theme="vs"
              :read-only="false"
              :highlight-lines="editor.highlightLines.value"
              :scroll-to-line="editor.scrollToLine.value"
            />
          </div>

          <div v-if="editor.showBackupPanel.value" class="backup-panel">
            <div class="panel-header">
              <span class="panel-title">{{ t('superPanel.projectConfig.backup.title') }}</span>
              <el-button size="small" @click="editor.loadBackupList()"><el-icon><Refresh /></el-icon></el-button>
            </div>
            <div v-loading="editor.backupListLoading.value" :element-loading-text="t('common.loading')" class="backup-list">
              <div v-for="backup in editor.backupList.value" :key="backup.name" class="backup-item">
                <div class="backup-header">
                  <el-icon><Clock /></el-icon>
                  <span class="backup-time">{{ backup.createTimeFormatted }}</span>
                </div>
                <div class="backup-meta">
                  <span>{{ t('superPanel.projectConfig.backup.operator') }}: {{ backup.operator }}</span>
                  <span>{{ backup.sizeFormatted }}</span>
                </div>
                <div v-if="backup.remark" class="backup-remark">
                  <el-icon><Document /></el-icon>
                  <span>{{ backup.remark }}</span>
                </div>
                <div class="backup-actions" @click.stop>
                  <el-button size="small" type="warning" @click="editor.restoreBackup(backup)">
                    {{ t('superPanel.projectConfig.backup.restore') }}
                  </el-button>
                  <el-button size="small" type="danger" @click="editor.deleteBackup(backup)">
                    {{ t('superPanel.projectConfig.backup.delete') }}
                  </el-button>
                </div>
              </div>
              <div v-if="editor.backupList.value.length === 0 && !editor.backupListLoading.value" class="empty-backup">
                <el-icon class="empty-icon"><Box /></el-icon>
                <p>{{ t('superPanel.projectConfig.backup.empty') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="editor.syntaxResult.value" class="syntax-result">
          <el-alert
            :title="editor.syntaxResult.value.valid ? t('superPanel.projectConfig.editor.syntaxValid') : t('superPanel.projectConfig.editor.syntaxInvalid')"
            :type="editor.syntaxResult.value.valid ? 'success' : 'error'"
            :description="editor.syntaxResult.value.error || editor.syntaxResult.value.warning"
            show-icon
            :closable="false"
          />
        </div>
      </div>

      <!-- 保存备注弹窗 -->
      <el-dialog v-model="editor.saveDialogVisible.value" :title="t('superPanel.projectConfig.saveDialog.title')" width="400px" :close-on-click-modal="false" append-to-body>
        <el-form :model="editor.saveForm.value" label-width="80px">
          <el-form-item :label="t('superPanel.projectConfig.saveDialog.remark')">
            <el-input v-model="editor.saveForm.value.remark" type="textarea" :rows="3" :placeholder="t('superPanel.projectConfig.saveDialog.remarkPlaceholder')" />
          </el-form-item>
          <el-alert :title="t('superPanel.projectConfig.saveDialog.warning')" type="warning" show-icon :closable="false" />
        </el-form>
        <template #footer>
          <el-button @click="editor.saveDialogVisible.value = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="editor.saving.value" @click="editor.confirmSave()">{{ t('superPanel.projectConfig.saveDialog.confirm') }}</el-button>
        </template>
      </el-dialog>

      <!-- 修改备份路径弹窗 -->
      <el-dialog v-model="editor.backupPathDialogVisible.value" :title="t('superPanel.projectConfig.backupPathDialog.title')" width="500px" :close-on-click-modal="false" append-to-body>
        <el-form :model="editor.backupPathForm.value" label-width="140px">
          <el-form-item :label="t('superPanel.projectConfig.backupPathDialog.currentPath')">
            <el-input :value="editor.backupDirInfo.value.absolute" readonly class="readonly-path-input" />
          </el-form-item>
          <el-form-item :label="t('superPanel.projectConfig.backupPathDialog.newPath')">
            <el-input v-model="editor.backupPathForm.value.newPath" :placeholder="t('superPanel.projectConfig.backupPathDialog.newPathPlaceholder')" />
          </el-form-item>
          <el-alert :title="t('superPanel.projectConfig.backupPathDialog.warning')" type="warning" show-icon :closable="false" />
        </el-form>
        <template #footer>
          <el-button @click="editor.backupPathDialogVisible.value = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="editor.changingBackupPath.value" @click="editor.confirmChangeBackupPath()">
            {{ t('common.confirm') }}
          </el-button>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 项目配置（只读浏览 + 在线编辑白名单文件）
 * @author GooHv
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { showError, confirmAction } from '@/utils/ui/feedback'
import { useSpConfigFileEditor } from '@/composables/useSpConfigFileEditor'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import LanguageConfig from '@/views/super-panel/config/components/LanguageConfig.vue'
import {
  requestGetProjectConfigApi,
  requestReadConfigFileApi,
  requestWriteConfigFileApi,
  requestGetConfigBackupListApi,
  requestRestoreConfigBackupApi,
  requestDeleteConfigBackupApi,
  requestCheckConfigSyntaxApi,
  requestGetBackupDirApi,
  requestSetBackupDirApi,
  requestGetTranslationConfigApi
} from '@/api'
import {
  getConfigMeta,
  EDIT_TYPE,
  OWNER_TYPE_CONFIG,
  getOwnerByEffectType,
  getFileNameFromPath,
  getTableName,
  getSourceType,
  type ConfigMetaItem
} from '@/config/project-config.meta'
import {
  Refresh, Connection, Setting, Files, Document, FolderOpened, Lock, Key, Message, Collection, Cpu,
  InfoFilled, Promotion, Edit, EditPen, WarningFilled, Monitor, Check, Back, Clock, QuestionFilled, Box
} from '@element-plus/icons-vue'

const { t } = useI18n()
const router = useRouter()

const EDITABLE_WHITELIST = [
  '.env',
  'src/config/app.config.js',
  'src/config/db.config.js',
  'src/config/jwt.config.js',
  'src/config/upload.config.js',
  'src/config/superPanel.license.config.js',
  'src/modules/email/email.config.js',
  'src/plc/config/plcSetting.js'
]

interface TranslationTencent { secretId: string; secretKey: string; region: string; projectId: number }
interface TranslationConfig { enabled: boolean; provider: string; masterLanguage: string; tencent?: TranslationTencent }

interface FlatItem {
  key: string
  label: string
  value: unknown
  displayValue: unknown
  meta: ConfigMetaItem | null
  isBoolean: boolean
  isPassword: boolean
  isCode: boolean
  isPath: boolean
}

const loading = ref(false)
const activeMenu = ref('environment')
const config = ref<Record<string, any>>({})
const translationConfig = ref<TranslationConfig>({ enabled: false, provider: 'tencent', masterLanguage: 'zh-CN', tencent: { secretId: '', secretKey: '', region: 'ap-guangzhou', projectId: 0 } })

const menuList = computed(() => [
  { key: 'environment', icon: InfoFilled, titleKey: 'superPanel.projectConfig.menu.environment' },
  { key: 'api', icon: Connection, titleKey: 'superPanel.projectConfig.menu.api' },
  { key: 'storage', icon: FolderOpened, titleKey: 'superPanel.projectConfig.menu.storage' },
  { key: 'security', icon: Lock, titleKey: 'superPanel.projectConfig.menu.security' },
  { key: 'database', icon: Files, titleKey: 'superPanel.projectConfig.menu.database' },
  { key: 'license', icon: Key, titleKey: 'superPanel.projectConfig.menu.license' },
  { key: 'email', icon: Message, titleKey: 'superPanel.projectConfig.menu.email' },
  { key: 'i18n', icon: Collection, titleKey: 'superPanel.projectConfig.menu.i18n' },
  { key: 'translation', icon: Connection, titleKey: 'superPanel.projectConfig.translation.menu' },
  { key: 'plc', icon: Cpu, titleKey: 'superPanel.projectConfig.menu.plc' }
])

const editor = useSpConfigFileEditor({
  readFile: requestReadConfigFileApi,
  writeFile: requestWriteConfigFileApi,
  checkSyntax: requestCheckConfigSyntaxApi,
  getBackupList: requestGetConfigBackupListApi,
  restoreBackup: requestRestoreConfigBackupApi,
  deleteBackup: requestDeleteConfigBackupApi,
  getBackupDir: requestGetBackupDirApi,
  setBackupDir: requestSetBackupDirApi,
  onSaved: () => loadConfig()
})

async function loadConfig(): Promise<void> {
  loading.value = true
  try {
    const res: any = await requestGetProjectConfigApi()
    config.value = res.data || {}
  } catch (err) {
    console.error('[project-config] 加载配置失败:', err)
    showError(t('superPanel.projectConfig.page.loadFailed'))
  } finally {
    loading.value = false
  }
}

function loadTranslationConfig(): void {
  requestGetTranslationConfigApi().then((res: any) => {
    if (res.data) translationConfig.value = res.data
  }).catch(() => { /* 不影响其他功能 */ })
}

function goToTranslationConfig(): void {
  router.push({ path: '/super-panel/config', query: { tab: 'translation' } })
}
function handleRefresh(): void {
  loadConfig()
  loadTranslationConfig()
}

function flattenConfig(obj: Record<string, any>, prefix: string, items: FlatItem[]): void {
  Object.keys(obj).forEach((key) => {
    const fullKey = `${prefix}.${key}`
    const value = obj[key]
    const meta = getConfigMeta(fullKey)
    const isAuxiliaryField =
      key.endsWith('Formatted') || key.endsWith('Absolute') || key.endsWith('Unit') || key.endsWith('Configured') ||
      key === 'unit' || (key === 'password' && value === '******')
    if (isAuxiliaryField) return
    if (value && typeof value === 'object' && !Array.isArray(value) && !meta) {
      flattenConfig(value, fullKey, items)
    } else {
      let displayValue: unknown = value
      const isBoolean = typeof value === 'boolean'
      const isPassword = fullKey.includes('password') || fullKey.includes('secret')
      const isCode = typeof value === 'string' && (value.includes('/') || value.includes('.') || value.includes('-'))
      const isPath = typeof value === 'string' && (value.startsWith('./') || value.startsWith('/') || value.includes('\\'))
      if (Array.isArray(value)) displayValue = value.join(', ')
      items.push({ key: fullKey, label: meta?.label || key, value, displayValue, meta, isBoolean, isPassword, isCode, isPath })
    }
  })
}

const currentConfigItems = computed<FlatItem[]>(() => {
  const categoryConfig = config.value[activeMenu.value]
  if (!categoryConfig) return []
  const items: FlatItem[] = []
  flattenConfig(categoryConfig, activeMenu.value, items)
  return items
})

function getEditTypeIcon(editType?: string) {
  const map: Record<string, unknown> = { database: Files, configFile: Document, envFile: Setting, code: EditPen }
  return (editType && map[editType]) || Setting
}
function getEditTypeTagType(editType?: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { database: 'success', configFile: 'warning', envFile: 'danger', code: 'info' }
  return (editType && map[editType]) || 'info'
}
function getEditTypeLabelKey(editType?: string): string {
  const map: Record<string, string> = { database: 'superPanel.projectConfig.editType.database', configFile: 'superPanel.projectConfig.editType.configFile', envFile: 'superPanel.projectConfig.editType.envFile', code: 'superPanel.projectConfig.editType.code' }
  return (editType && map[editType]) || 'superPanel.projectConfig.editType.code'
}
function getEditTypeTipKey(editType?: string): string {
  const map: Record<string, string> = { database: 'superPanel.projectConfig.editType.databaseTip', configFile: 'superPanel.projectConfig.editType.configFileTip', envFile: 'superPanel.projectConfig.editType.envFileTip', code: 'superPanel.projectConfig.editType.codeTip' }
  return (editType && map[editType]) || 'superPanel.projectConfig.editType.codeTip'
}
function getEffectTypeTagType(effectType?: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { immediate: 'success', restart: 'warning', rebuild: 'danger' }
  return (effectType && map[effectType]) || 'info'
}
function getEffectTypeLabelKey(effectType?: string): string {
  const map: Record<string, string> = { immediate: 'superPanel.projectConfig.effectType.immediate', restart: 'superPanel.projectConfig.effectType.restart', rebuild: 'superPanel.projectConfig.effectType.rebuild' }
  return (effectType && map[effectType]) || 'superPanel.projectConfig.effectType.restart'
}
function getEffectTypeTipKey(effectType?: string): string {
  const map: Record<string, string> = { immediate: 'superPanel.projectConfig.effectType.immediateTip', restart: 'superPanel.projectConfig.effectType.restartTip', rebuild: 'superPanel.projectConfig.effectType.rebuildTip' }
  return (effectType && map[effectType]) || 'superPanel.projectConfig.effectType.restartTip'
}
function getOwnerType(meta?: ConfigMetaItem | null): string {
  if (!meta) return ''
  if (meta.owner) return meta.owner
  return getOwnerByEffectType(meta.effectType)
}
function getOwnerTypeConfig(ownerType: string) {
  return (OWNER_TYPE_CONFIG as Record<string, { labelKey: string; descriptionKey: string; type: 'primary' | 'success'; icon: unknown }>)[ownerType] || OWNER_TYPE_CONFIG.backend
}
function getFileOrTableName(meta?: ConfigMetaItem | null): string {
  if (!meta) return ''
  if (meta.editType === EDIT_TYPE.DATABASE) return getTableName(meta, activeMenu.value)
  return getFileNameFromPath(meta.filePath)
}
function goToConfig(meta: ConfigMetaItem): void {
  if (meta?.redirectPath) {
    router.push({ path: meta.redirectPath, query: meta.redirectTab ? { tab: meta.redirectTab } : {} })
  }
}
function canEditFile(meta?: ConfigMetaItem | null): boolean {
  if (!meta || !meta.filePath) return false
  if (meta.editType === EDIT_TYPE.DATABASE || meta.editType === EDIT_TYPE.CODE) return false
  return true
}
function isFileInWhitelist(meta?: ConfigMetaItem | null): boolean {
  if (!meta || !meta.filePath) return false
  const filePath = meta.filePath.split(' / ')[0].split(' /')[0]
  return EDITABLE_WHITELIST.includes(filePath)
}

async function openEditorFromCard(item: FlatItem): Promise<void> {
  const meta = item.meta
  if (!meta || !meta.filePath) {
    showError(t('superPanel.projectConfig.tips.noFilePath'))
    return
  }
  const filePath = meta.filePath.split(' / ')[0].split(' /')[0]
  if (!EDITABLE_WHITELIST.includes(filePath)) {
    const ok = await confirmAction(t('superPanel.projectConfig.tips.notInWhitelist'), t('common.warning'), { type: 'warning' })
    if (!ok) return
  }
  await editor.openEditor({ filePath, label: item.label, meta, highlightLine: meta.highlightLine })
}

onMounted(() => {
  loadConfig()
  loadTranslationConfig()
})
</script>

<style scoped>
.project-config-container { padding: 20px; height: 100%; display: flex; flex-direction: column; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #ebeef5; }
.page-title { margin: 0; font-size: 20px; font-weight: 600; color: #303133; }
.page-desc { margin: 5px 0 0; font-size: 13px; color: #909399; }
.config-body { flex: 1; display: flex; gap: 15px; min-height: 0; }
.config-sidebar { width: 180px; flex-shrink: 0; background: #fff; border-radius: 4px; border: 1px solid #ebeef5; padding: 10px 0; }
.menu-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; cursor: pointer; transition: all 0.2s; font-size: 14px; color: #606266; }
.menu-item:hover { background: #f5f7fa; color: #409eff; }
.menu-item.active { background: #ecf5ff; color: #409eff; border-right: 3px solid #409eff; }
.config-content { flex: 1; background: #fff; border-radius: 4px; border: 1px solid #ebeef5; padding: 20px; overflow-y: auto; }
.config-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 15px; }
.config-card { border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; transition: all 0.2s; }
.config-card:hover { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); border-color: #dcdfe6; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: #fafafa; border-bottom: 1px solid #ebeef5; }
.config-name { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #303133; }
.name-icon { font-size: 16px; color: #409eff; }
.config-tags { display: flex; gap: 5px; }
.card-body { padding: 15px; }
.config-value { font-size: 14px; color: #606266; word-break: break-all; line-height: 1.6; }
.config-value.is-code, .config-value.is-path { font-family: "Consolas", "Monaco", "Courier New", monospace; background: #f5f7fa; padding: 8px 10px; border-radius: 4px; font-size: 13px; }
.password-mask { letter-spacing: 3px; }
.card-footer { padding: 10px 15px; border-top: 1px solid #f0f0f0; }
.config-desc { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; color: #909399; margin-bottom: 10px; line-height: 1.5; }
.config-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.file-path { display: flex; align-items: center; gap: 5px; padding: 8px 15px; background: #fafafa; border-top: 1px solid #f0f0f0; font-size: 12px; color: #909399; }
.file-path code { font-family: "Consolas", "Monaco", "Courier New", monospace; background: #fff; padding: 2px 6px; border-radius: 3px; border: 1px solid #ebeef5; }
.empty-state { text-align: center; padding: 60px 0; color: #909399; }
.empty-icon { font-size: 48px; margin-bottom: 15px; }
.editor-dialog-content { display: flex; flex-direction: column; height: 80vh; }
.editor-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #fafafa; border: 1px solid #ebeef5; border-radius: 4px 4px 0 0; margin-bottom: 10px; }
.toolbar-left { display: flex; align-items: center; gap: 10px; }
.toolbar-right { display: flex; gap: 8px; }
.backup-path-wrapper { display: flex; align-items: center; gap: 4px; margin-left: 10px; }
.backup-path-tip { font-size: 16px; color: #909399; cursor: help; }
.editor-main { flex: 1; display: flex; gap: 10px; min-height: 0; }
.editor-wrapper { flex: 1; border: 1px solid #ebeef5; border-radius: 4px; overflow: hidden; }
.backup-panel { width: 280px; flex-shrink: 0; border: 1px solid #ebeef5; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fafafa; border-bottom: 1px solid #ebeef5; }
.panel-title { font-size: 14px; font-weight: 600; color: #303133; }
.backup-list { flex: 1; overflow-y: auto; padding: 10px; }
.backup-item { padding: 10px; border: 1px solid #ebeef5; border-radius: 4px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
.backup-item:hover { border-color: #409eff; }
.backup-header { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
.backup-time { font-size: 13px; font-weight: 500; color: #303133; }
.backup-meta { display: flex; justify-content: space-between; font-size: 11px; color: #909399; margin-bottom: 6px; }
.backup-remark { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; color: #606266; margin-bottom: 8px; padding: 5px 8px; background: #f5f7fa; border-radius: 4px; }
.backup-actions { display: flex; gap: 5px; }
.empty-backup { text-align: center; padding: 30px 0; color: #909399; }
.empty-backup .empty-icon { font-size: 36px; margin-bottom: 10px; }
.translation-config-panel { padding: 0; }
.translation-config-panel .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #ebeef5; }
.translation-config-panel .panel-title { font-size: 18px; font-weight: 600; color: #303133; margin: 0; display: flex; align-items: center; gap: 10px; }
.config-status-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
.status-card { background: #fff; border: 1px solid #ebeef5; border-radius: 8px; padding: 20px; transition: all 0.3s; }
.status-card:hover { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); transform: translateY(-2px); }
.status-card .status-label { font-size: 13px; color: #909399; margin-bottom: 10px; }
.status-card .status-value { font-size: 16px; color: #303133; font-weight: 500; word-break: break-all; }
.status-card .status-value.code-value { font-family: "Courier New", monospace; font-size: 14px; color: #409eff; }
.config-tip { margin-top: 0; }
.syntax-result { margin-top: 10px; }
.readonly-path-input :deep(.el-input__inner) { background-color: #f5f7fa !important; border: 1px solid #dcdfe6 !important; color: #909399 !important; cursor: not-allowed !important; }
</style>
