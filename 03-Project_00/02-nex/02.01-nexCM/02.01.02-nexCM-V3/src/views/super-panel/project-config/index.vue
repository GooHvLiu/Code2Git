<template>
  <div class="project-config-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ $t('menu.superPanel.projectConfig.page.title') }}</h2>
        <p class="page-desc">{{ $t('menu.superPanel.projectConfig.page.desc') }}</p>
      </div>
      <div class="header-right">
        <el-tooltip :content="$t('common.refresh')" placement="bottom">
          <el-button icon="el-icon-refresh" circle @click="handleRefresh" :loading="loading" />
        </el-tooltip>
      </div>
    </div>

    <!-- 主体内容 -->
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
          <i :class="item.icon"></i>
          <span>{{ $t(item.titleKey) }}</span>
        </div>
      </div>

      <!-- 右侧配置内容 -->
      <div class="config-content" v-loading="loading">
        <div class="config-cards">
          <div v-for="item in currentConfigItems" :key="item.key" class="config-card">
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="config-name">
                <i :class="getEditTypeIcon(item.meta?.editType)" class="name-icon"></i>
                <span>{{ item.meta?.labelKey ? $t(item.meta.labelKey) : item.label }}</span>
              </div>
              <div class="config-tags">
                <el-tooltip
                  v-if="item.meta?.editType"
                  :content="$t(getEditTypeTipKey(item.meta.editType))"
                  placement="top"
                >
                  <el-tag
                    :type="getEditTypeTagType(item.meta.editType)"
                    size="mini"
                    effect="light"
                  >
                    {{ $t(getEditTypeLabelKey(item.meta.editType)) }}
                  </el-tag>
                </el-tooltip>
                <el-tooltip
                  v-if="item.meta?.effectType"
                  :content="$t(getEffectTypeTipKey(item.meta.effectType))"
                  placement="top"
                >
                  <el-tag
                    :type="getEffectTypeTagType(item.meta.effectType)"
                    size="mini"
                    effect="plain"
                  >
                    {{ $t(getEffectTypeLabelKey(item.meta.effectType)) }}
                  </el-tag>
                </el-tooltip>
                <!-- 归属标签：前端/后端 -->
                <el-tooltip
                  v-if="getOwnerType(item.meta)"
                  :content="$t(getOwnerTypeConfig(getOwnerType(item.meta)).descriptionKey)"
                  placement="top"
                >
                  <el-tag
                    :type="getOwnerTypeConfig(getOwnerType(item.meta)).type"
                    size="mini"
                    effect="plain"
                  >
                    <i :class="getOwnerTypeConfig(getOwnerType(item.meta)).icon"></i>
                    {{ $t(getOwnerTypeConfig(getOwnerType(item.meta)).labelKey) }}
                  </el-tag>
                </el-tooltip>
              </div>
            </div>

            <!-- 卡片内容：配置值 -->
            <div class="card-body">
              <div class="config-value" :class="{ 'is-code': item.isCode, 'is-path': item.isPath }">
                <template v-if="item.isBoolean">
                  <el-tag :type="item.value ? 'success' : 'info'" size="small">
                    {{ item.value ? $t('common.enable') : $t('common.disable') }}
                  </el-tag>
                </template>
                <template v-else-if="item.isPassword">
                  <span class="password-mask">{{ item.value }}</span>
                </template>
                <template v-else>
                  {{ item.displayValue || item.value }}
                </template>
              </div>
            </div>

            <!-- 卡片底部：说明 + 操作 -->
            <div class="card-footer">
              <div class="config-desc" v-if="item.meta?.descriptionKey || item.meta?.description">
                <i class="el-icon-info"></i>
                <span>{{ item.meta?.descriptionKey ? $t(item.meta.descriptionKey) : item.meta.description }}</span>
              </div>
              <div class="config-actions">
                <!-- 数据库配置：前往配置按钮 -->
                <el-button
                  v-if="item.meta?.editType === 'database' && item.meta?.redirectPath"
                  type="primary"
                  size="mini"
                  icon="el-icon-s-promotion"
                  @click="goToConfig(item.meta)"
                >
                  {{ $t('menu.superPanel.projectConfig.actions.goToConfig') }}
                </el-button>
                <!-- 配置文件/环境变量：编辑文件按钮 -->
                <el-tooltip
                  v-if="canEditFile(item.meta) && !isFileInWhitelist(item.meta)"
                  :content="$t('menu.superPanel.projectConfig.tips.notInWhitelist')"
                  placement="top"
                >
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="openEditor(item)"
                  >
                    {{ $t('menu.superPanel.projectConfig.actions.editFile') }}
                  </el-button>
                </el-tooltip>
                <el-button
                  v-if="canEditFile(item.meta) && isFileInWhitelist(item.meta)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="openEditor(item)"
                >
                  {{ $t('menu.superPanel.projectConfig.actions.editFile') }}
                </el-button>
                <!-- 代码常量：提示 -->
                <el-tooltip
                  v-if="item.meta?.editType === 'code'"
                  :content="$t('menu.superPanel.projectConfig.tips.codeConstant')"
                  placement="top"
                >
                  <el-tag type="info" size="mini" effect="plain">
                    <i class="el-icon-warning-outline"></i>
                    {{ $t('menu.superPanel.projectConfig.tips.needCodeChange') }}
                  </el-tag>
                </el-tooltip>
              </div>
            </div>

            <!-- 文件路径/数据库表名/来源类型显示 -->
            <div
              v-if="item.meta"
              class="file-path"
            >
              <template v-if="getSourceType(item.meta) === 'database'">
                <i class="el-icon-coin"></i>
                <code>{{ getFileOrTableName(item.meta) }}</code>
              </template>
              <template v-else-if="getSourceType(item.meta) === 'file'">
                <i class="el-icon-folder-opened"></i>
                <code>{{ item.meta.filePath }}</code>
              </template>
              <template v-else-if="getSourceType(item.meta) === 'runtime'">
                <i class="el-icon-monitor"></i>
                <code>{{ $t('menu.superPanel.projectConfig.sourceType.runtime') }}</code>
              </template>
              <template v-else>
                <i class="el-icon-code"></i>
                <code v-if="item.meta.filePath">{{ item.meta.filePath }}</code>
                <code v-else>{{ $t('menu.superPanel.projectConfig.sourceType.code') }}</code>
              </template>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="currentConfigItems.length === 0 && !loading" class="empty-state">
          <i class="el-icon-document"></i>
          <p>{{ $t('menu.superPanel.projectConfig.empty.noConfig') }}</p>
        </div>
      </div>
    </div>

    <!-- Monaco Editor 弹窗 -->
    <el-dialog
      :title="editorDialogTitle"
      :visible.sync="editorDialogVisible"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
      append-to-body
      @closed="handleEditorClosed"
    >
      <div class="editor-dialog-content">
        <!-- 编辑器工具栏 -->
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <el-tag size="mini" type="info">{{ currentEditFile }}</el-tag>
            <el-tag size="mini" :type="editorDirty ? 'warning' : 'success'">
              {{ editorDirty ? $t('menu.superPanel.projectConfig.editor.unsaved') : $t('menu.superPanel.projectConfig.editor.saved') }}
            </el-tag>
            <div class="backup-path-wrapper">
              <el-button size="mini" icon="el-icon-folder-opened" @click="showBackupPathDialog">
                {{ $t('menu.superPanel.projectConfig.editor.backupPath') }}
              </el-button>
              <el-tooltip
                :content="backupDirInfo.absolute || $t('menu.superPanel.projectConfig.editor.backupPathLoading')"
                placement="bottom"
              >
                <i class="el-icon-question backup-path-tip"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="toolbar-right">
            <el-button size="small" icon="el-icon-check" @click="checkSyntax" :loading="checkingSyntax">
              {{ $t('menu.superPanel.projectConfig.editor.syntaxCheck') }}
            </el-button>
            <el-button size="small" icon="el-icon-back" @click="showBackupPanel = !showBackupPanel">
              {{ $t('menu.superPanel.projectConfig.editor.versionHistory') }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-document"
              @click="saveFile"
              :loading="saving"
              :disabled="!editorDirty"
            >
              {{ $t('menu.superPanel.projectConfig.editor.save') }}
            </el-button>
          </div>
        </div>

        <!-- 编辑器主体 -->
        <div class="editor-main">
          <!-- Monaco Editor -->
          <div class="editor-wrapper">
            <monaco-editor
              ref="monacoEditor"
              v-model="editorContent"
              :language="editorLanguage"
              :theme="'vs'"
              :read-only="false"
              :minimap="true"
              :font-size="14"
              :highlight-lines="highlightLines"
              :scroll-to-line="scrollToLine"
            />
          </div>

          <!-- 版本历史面板 -->
          <div class="backup-panel" v-if="showBackupPanel">
            <div class="panel-header">
              <span class="panel-title">{{ $t('menu.superPanel.projectConfig.backup.title') }}</span>
              <el-button size="mini" icon="el-icon-refresh" @click="loadBackupList"></el-button>
            </div>
            <div class="backup-list" v-loading="backupListLoading">
              <div
                v-for="backup in backupList"
                :key="backup.name"
                class="backup-item"
              >
                <div class="backup-header">
                  <i class="el-icon-time"></i>
                  <span class="backup-time">{{ backup.createTimeFormatted }}</span>
                </div>
                <div class="backup-meta">
                  <span>{{ $t('menu.superPanel.projectConfig.backup.operator') }}: {{ backup.operator }}</span>
                  <span>{{ backup.sizeFormatted }}</span>
                </div>
                <div class="backup-remark" v-if="backup.remark">
                  <i class="el-icon-document"></i>
                  <span>{{ backup.remark }}</span>
                </div>
                <div class="backup-actions" @click.stop>
                  <el-button size="mini" type="warning" @click="restoreBackup(backup)">
                    {{ $t('menu.superPanel.projectConfig.backup.restore') }}
                  </el-button>
                  <el-button size="mini" type="danger" @click="deleteBackup(backup)">
                    {{ $t('menu.superPanel.projectConfig.backup.delete') }}
                  </el-button>
                </div>
              </div>
              <div class="empty-backup" v-if="backupList.length === 0 && !backupListLoading">
                <i class="el-icon-box"></i>
                <p>{{ $t('menu.superPanel.projectConfig.backup.empty') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 语法检查结果 -->
        <div class="syntax-result" v-if="syntaxResult">
          <el-alert
            :title="syntaxResult.valid ? $t('menu.superPanel.projectConfig.editor.syntaxValid') : $t('menu.superPanel.projectConfig.editor.syntaxInvalid')"
            :type="syntaxResult.valid ? 'success' : 'error'"
            :description="syntaxResult.error || syntaxResult.warning"
            show-icon
            :closable="false"
          ></el-alert>
        </div>
      </div>

      <!-- 保存备注弹窗 -->
      <el-dialog
        :title="$t('menu.superPanel.projectConfig.saveDialog.title')"
        :visible.sync="saveDialogVisible"
        width="400px"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form :model="saveForm" label-width="80px">
          <el-form-item :label="$t('menu.superPanel.projectConfig.saveDialog.remark')">
            <el-input
              v-model="saveForm.remark"
              type="textarea"
              :rows="3"
              :placeholder="$t('menu.superPanel.projectConfig.saveDialog.remarkPlaceholder')"
            ></el-input>
          </el-form-item>
          <el-alert
            :title="$t('menu.superPanel.projectConfig.saveDialog.warning')"
            type="warning"
            show-icon
            :closable="false"
          ></el-alert>
        </el-form>
        <span slot="footer">
          <el-button @click="saveDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="confirmSave" :loading="saving">
            {{ $t('menu.superPanel.projectConfig.saveDialog.confirm') }}
          </el-button>
        </span>
      </el-dialog>

      <!-- 修改备份路径弹窗 -->
      <el-dialog
        :title="$t('menu.superPanel.projectConfig.backupPathDialog.title')"
        :visible.sync="backupPathDialogVisible"
        width="500px"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form :model="backupPathForm" label-width="100px">
          <el-form-item :label="$t('menu.superPanel.projectConfig.backupPathDialog.currentPath')">
            <el-input :value="backupDirInfo.absolute" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.superPanel.projectConfig.backupPathDialog.newPath')">
            <el-input
              v-model="backupPathForm.newPath"
              :placeholder="$t('menu.superPanel.projectConfig.backupPathDialog.newPathPlaceholder')"
            ></el-input>
          </el-form-item>
          <el-alert
            :title="$t('menu.superPanel.projectConfig.backupPathDialog.warning')"
            type="warning"
            show-icon
            :closable="false"
          ></el-alert>
        </el-form>
        <span slot="footer">
          <el-button @click="backupPathDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="confirmChangeBackupPath" :loading="changingBackupPath">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { MessageBox } from 'element-ui'
import {
  requestGetProjectConfigApi,
  requestReadConfigFileApi,
  requestWriteConfigFileApi,
  requestGetConfigBackupListApi,
  requestRestoreConfigBackupApi,
  requestDeleteConfigBackupApi,
  requestCheckConfigSyntaxApi,
  requestGetBackupDirApi,
  requestSetBackupDirApi
} from '@/api'
import {
  getConfigMeta,
  EDIT_TYPE,
  EFFECT_TYPE,
  OWNER_TYPE_CONFIG,
  getOwnerByEffectType,
  getFileNameFromPath,
  getTableName,
  SOURCE_TYPE_CONFIG,
  getSourceType
} from '@/config/projectConfig.meta'

// 可直接编辑的文件白名单
const EDITABLE_WHITELIST = [
  '.env',
  'src/config/app.config.js',
  'src/config/db.config.js',
  'src/config/jwt.config.js',
  'src/config/upload.config.js',
  'src/config/license.config.js',
  'src/modules/email/email.config.js',
  'src/plc/config/plcSetting.js'
]

export default {
  name: 'ProjectConfig',
  components: { MonacoEditor },
  data() {
    return {
      loading: false,
      activeMenu: 'environment',
      config: {},
      menuList: [
        { key: 'environment', icon: 'el-icon-info', titleKey: 'menu.superPanel.projectConfig.menu.environment' },
        { key: 'api', icon: 'el-icon-link', titleKey: 'menu.superPanel.projectConfig.menu.api' },
        { key: 'storage', icon: 'el-icon-folder-opened', titleKey: 'menu.superPanel.projectConfig.menu.storage' },
        { key: 'security', icon: 'el-icon-lock', titleKey: 'menu.superPanel.projectConfig.menu.security' },
        { key: 'database', icon: 'el-icon-coin', titleKey: 'menu.superPanel.projectConfig.menu.database' },
        { key: 'license', icon: 'el-icon-key', titleKey: 'menu.superPanel.projectConfig.menu.license' },
        { key: 'email', icon: 'el-icon-message', titleKey: 'menu.superPanel.projectConfig.menu.email' },
        { key: 'plc', icon: 'el-icon-cpu', titleKey: 'menu.superPanel.projectConfig.menu.plc' }
      ],

      // 编辑器相关
      editorDialogVisible: false,
      editorContent: '',
      originalContent: '',
      currentEditFile: '',
      currentEditItem: null,
      editorLanguage: 'javascript',
      highlightLines: [],
      scrollToLine: null,
      syntaxResult: null,
      checkingSyntax: false,
      saving: false,
      saveDialogVisible: false,
      saveForm: { remark: '' },

      // 版本历史
      showBackupPanel: false,
      backupList: [],
      backupListLoading: false,

      // 备份路径
      backupDirInfo: { absolute: '', relative: '' },
      backupPathDialogVisible: false,
      backupPathForm: { newPath: '' },
      changingBackupPath: false
    }
  },
  computed: {
    editorDirty() {
      return this.editorContent !== this.originalContent
    },
    editorDialogTitle() {
      if (this.currentEditItem) {
        return `${this.currentEditItem.label} - ${this.$t('menu.superPanel.projectConfig.editor.title')}`
      }
      return this.$t('menu.superPanel.projectConfig.editor.title')
    },
    currentConfigItems() {
      const category = this.activeMenu
      const categoryConfig = this.config[category]
      if (!categoryConfig) return []

      const items = []
      this.flattenConfig(categoryConfig, category, items)
      return items
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    // ==================== 配置加载 ====================
    async loadConfig() {
      this.loading = true
      try {
        const res = await requestGetProjectConfigApi()
        this.config = res.data || {}
      } catch (err) {
        this.$message.error(this.$t('menu.superPanel.projectConfig.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    handleRefresh() {
      this.loadConfig()
    },

    // ==================== 配置项处理 ====================
    flattenConfig(obj, prefix, items) {
      Object.keys(obj).forEach(key => {
        const fullKey = `${prefix}.${key}`
        const value = obj[key]
        const meta = getConfigMeta(fullKey)

        // 过滤辅助显示字段（格式化值、绝对路径、单位、是否已配置等）
        const isAuxiliaryField =
          key.endsWith('Formatted') ||
          key.endsWith('Absolute') ||
          key.endsWith('Unit') ||
          key.endsWith('Configured') ||
          key === 'unit' ||
          (key === 'password' && value === '******')

        if (isAuxiliaryField) {
          return
        }

        if (value && typeof value === 'object' && !Array.isArray(value) && !meta) {
          this.flattenConfig(value, fullKey, items)
        } else {
          let displayValue = value
          const isBoolean = typeof value === 'boolean'
          const isPassword = fullKey.includes('password') || fullKey.includes('secret')
          const isCode = typeof value === 'string' && (value.includes('/') || value.includes('.') || value.includes('-'))
          const isPath = typeof value === 'string' && (value.startsWith('./') || value.startsWith('/') || value.includes('\\'))

          if (Array.isArray(value)) {
            displayValue = value.join(', ')
          }

          items.push({
            key: fullKey,
            label: meta?.label || key,
            value: value,
            displayValue: displayValue,
            meta: meta,
            isBoolean: isBoolean,
            isPassword: isPassword,
            isCode: isCode,
            isPath: isPath
          })
        }
      })
    },

    // ==================== 修改方式/生效方式配置 ====================
    getEditTypeIcon(editType) {
      const iconMap = {
        [EDIT_TYPE.DATABASE]: 'el-icon-coin',
        [EDIT_TYPE.CONFIG_FILE]: 'el-icon-document',
        [EDIT_TYPE.ENV_FILE]: 'el-icon-setting',
        [EDIT_TYPE.CODE]: 'el-icon-code'
      }
      return iconMap[editType] || 'el-icon-setting'
    },

    getEditTypeTagType(editType) {
      const typeMap = {
        [EDIT_TYPE.DATABASE]: 'success',
        [EDIT_TYPE.CONFIG_FILE]: 'warning',
        [EDIT_TYPE.ENV_FILE]: 'danger',
        [EDIT_TYPE.CODE]: 'info'
      }
      return typeMap[editType] || 'info'
    },

    getEditTypeLabelKey(editType) {
      const keyMap = {
        [EDIT_TYPE.DATABASE]: 'menu.superPanel.projectConfig.editType.database',
        [EDIT_TYPE.CONFIG_FILE]: 'menu.superPanel.projectConfig.editType.configFile',
        [EDIT_TYPE.ENV_FILE]: 'menu.superPanel.projectConfig.editType.envFile',
        [EDIT_TYPE.CODE]: 'menu.superPanel.projectConfig.editType.code'
      }
      return keyMap[editType] || 'menu.superPanel.projectConfig.editType.code'
    },

    getEditTypeTipKey(editType) {
      const keyMap = {
        [EDIT_TYPE.DATABASE]: 'menu.superPanel.projectConfig.editType.databaseTip',
        [EDIT_TYPE.CONFIG_FILE]: 'menu.superPanel.projectConfig.editType.configFileTip',
        [EDIT_TYPE.ENV_FILE]: 'menu.superPanel.projectConfig.editType.envFileTip',
        [EDIT_TYPE.CODE]: 'menu.superPanel.projectConfig.editType.codeTip'
      }
      return keyMap[editType] || 'menu.superPanel.projectConfig.editType.codeTip'
    },

    getEffectTypeTagType(effectType) {
      const typeMap = {
        [EFFECT_TYPE.IMMEDIATE]: 'success',
        [EFFECT_TYPE.RESTART]: 'warning',
        [EFFECT_TYPE.REBUILD]: 'danger'
      }
      return typeMap[effectType] || 'info'
    },

    getEffectTypeLabelKey(effectType) {
      const keyMap = {
        [EFFECT_TYPE.IMMEDIATE]: 'menu.superPanel.projectConfig.effectType.immediate',
        [EFFECT_TYPE.RESTART]: 'menu.superPanel.projectConfig.effectType.restart',
        [EFFECT_TYPE.REBUILD]: 'menu.superPanel.projectConfig.effectType.rebuild'
      }
      return keyMap[effectType] || 'menu.superPanel.projectConfig.effectType.restart'
    },

    getEffectTypeTipKey(effectType) {
      const keyMap = {
        [EFFECT_TYPE.IMMEDIATE]: 'menu.superPanel.projectConfig.effectType.immediateTip',
        [EFFECT_TYPE.RESTART]: 'menu.superPanel.projectConfig.effectType.restartTip',
        [EFFECT_TYPE.REBUILD]: 'menu.superPanel.projectConfig.effectType.rebuildTip'
      }
      return keyMap[effectType] || 'menu.superPanel.projectConfig.effectType.restartTip'
    },

    // ==================== 归属类型 ====================
    getOwnerType(meta) {
      if (!meta) return ''
      // 如果配置元数据中明确指定了 owner，则使用指定的值
      if (meta.owner) return meta.owner
      // 否则根据生效方式自动判断
      return getOwnerByEffectType(meta.effectType)
    },

    getOwnerTypeConfig(ownerType) {
      return OWNER_TYPE_CONFIG[ownerType] || OWNER_TYPE_CONFIG.backend
    },

    // ==================== 文件名称/数据库表名称 ====================
    getFileOrTableName(meta) {
      if (!meta) return ''
      // 如果是数据库配置，返回数据库表名称
      if (meta.editType === EDIT_TYPE.DATABASE) {
        return getTableName(meta, this.activeMenu)
      }
      // 否则返回文件名称
      return getFileNameFromPath(meta.filePath)
    },

    // ==================== 来源类型 ====================
    getSourceType(meta) {
      return getSourceType(meta)
    },

    getSourceTypeConfig(sourceType) {
      return SOURCE_TYPE_CONFIG[sourceType] || SOURCE_TYPE_CONFIG.code
    },

    // ==================== 操作 ====================
    goToConfig(meta) {
      if (meta?.redirectPath) {
        this.$router.push({
          path: meta.redirectPath,
          query: meta.redirectTab ? { tab: meta.redirectTab } : {}
        })
      }
    },

    canEditFile(meta) {
      if (!meta || !meta.filePath) return false
      if (meta.editType === EDIT_TYPE.DATABASE) return false
      if (meta.editType === EDIT_TYPE.CODE) return false
      return true
    },

    isFileInWhitelist(meta) {
      if (!meta || !meta.filePath) return false
      const filePath = meta.filePath.split(' / ')[0].split(' /')[0]
      return EDITABLE_WHITELIST.includes(filePath)
    },

    // ==================== 编辑器 ====================
    async openEditor(item) {
      const meta = item.meta
      if (!meta || !meta.filePath) {
        this.$message.warning(this.$t('menu.superPanel.projectConfig.tips.noFilePath'))
        return
      }

      // 处理多个文件路径的情况
      let filePath = meta.filePath.split(' / ')[0].split(' /')[0]

      // 检查是否在白名单内
      const isInWhitelist = EDITABLE_WHITELIST.includes(filePath)
      if (!isInWhitelist) {
        try {
          await MessageBox.confirm(
            this.$t('menu.superPanel.projectConfig.tips.notInWhitelist'),
            this.$t('common.warning'),
            {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              type: 'warning'
            }
          )
        } catch (err) {
          // 用户点击取消按钮，直接返回
          if (err === 'cancel' || err?.message === 'cancel') {
            return
          }
          // 其他错误，打印日志并显示错误消息
          console.error('确认框调用失败:', err)
          this.$message.error(this.$t('menu.superPanel.projectConfig.tips.confirmFailed'))
          return
        }
      }

      this.currentEditItem = item
      this.currentEditFile = filePath
      this.editorLanguage = filePath.endsWith('.js') ? 'javascript' : 'plaintext'
      this.highlightLines = meta.highlightLine ? [meta.highlightLine] : []
      this.scrollToLine = meta.highlightLine || null
      this.syntaxResult = null

      try {
        const res = await requestReadConfigFileApi(filePath)
        this.editorContent = res.data.content || ''
        this.originalContent = this.editorContent
        this.editorDialogVisible = true
        this.$nextTick(() => {
          this.loadBackupList()
          this.loadBackupDirInfo()
        })
      } catch (err) {
        this.$message.error(this.$t('menu.superPanel.projectConfig.editor.readFailed'))
      }
    },

    handleEditorClosed() {
      this.editorContent = ''
      this.originalContent = ''
      this.currentEditFile = ''
      this.currentEditItem = null
      this.highlightLines = []
      this.scrollToLine = null
      this.syntaxResult = null
      this.showBackupPanel = false
      this.backupList = []
    },

    // ==================== 语法检查 ====================
    async checkSyntax() {
      this.checkingSyntax = true
      try {
        const res = await requestCheckConfigSyntaxApi({
          filePath: this.currentEditFile,
          content: this.editorContent
        })
        this.syntaxResult = res.data
        if (res.data.valid) {
          this.$message.success(this.$t('menu.superPanel.projectConfig.editor.syntaxValid'))
        } else {
          this.$message.error(this.$t('menu.superPanel.projectConfig.editor.syntaxInvalid'))
        }
      } catch (err) {
        this.$message.error(this.$t('menu.superPanel.projectConfig.editor.syntaxCheckFailed'))
      } finally {
        this.checkingSyntax = false
      }
    },

    // ==================== 保存 ====================
    saveFile() {
      if (!this.editorDirty) return
      this.saveForm.remark = ''
      this.saveDialogVisible = true
    },

    async confirmSave() {
      this.saving = true
      try {
        const res = await requestWriteConfigFileApi({
          filePath: this.currentEditFile,
          content: this.editorContent,
          remark: this.saveForm.remark
        })
        this.originalContent = this.editorContent
        this.saveDialogVisible = false
        this.$message.success(res.data.message || this.$t('menu.superPanel.projectConfig.editor.saveSuccess'))
        this.loadBackupList()
        this.loadConfig()
      } catch (err) {
        // 错误已由拦截器处理
      } finally {
        this.saving = false
      }
    },

    // ==================== 版本历史 ====================
    async loadBackupList() {
      if (!this.currentEditFile) return
      this.backupListLoading = true
      try {
        const res = await requestGetConfigBackupListApi(this.currentEditFile)
        this.backupList = res.data || []
      } catch (err) {
        this.$message.error(this.$t('menu.superPanel.projectConfig.backup.loadFailed'))
      } finally {
        this.backupListLoading = false
      }
    },

    async restoreBackup(backup) {
      try {
        await MessageBox.confirm(
          this.$t('menu.superPanel.projectConfig.backup.restoreConfirm'),
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
      } catch (err) {
        return
      }

      try {
        const res = await requestRestoreConfigBackupApi({
          filePath: this.currentEditFile,
          backupName: backup.name
        })
        this.$message.success(res.data.message || this.$t('menu.superPanel.projectConfig.backup.restoreSuccess'))
        // 重新加载文件内容
        const fileRes = await requestReadConfigFileApi(this.currentEditFile)
        this.editorContent = fileRes.data.content || ''
        this.originalContent = this.editorContent
        this.loadBackupList()
        this.loadConfig()
      } catch (err) {
        // 错误已由拦截器处理
      }
    },

    async deleteBackup(backup) {
      try {
        await MessageBox.confirm(
          this.$t('menu.superPanel.projectConfig.backup.deleteConfirm'),
          this.$t('common.warning'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }
        )
      } catch (err) {
        return
      }

      try {
        await requestDeleteConfigBackupApi({
          filePath: this.currentEditFile,
          backupName: backup.name
        })
        this.$message.success(this.$t('menu.superPanel.projectConfig.backup.deleteSuccess'))
        this.loadBackupList()
      } catch (err) {
        // 错误已由拦截器处理
      }
    },

    // ==================== 备份路径 ====================
    async loadBackupDirInfo() {
      try {
        const res = await requestGetBackupDirApi()
        this.backupDirInfo = res.data || { absolute: '', relative: '' }
      } catch (err) {
        // 错误已由拦截器处理
      }
    },

    showBackupPathDialog() {
      this.backupPathForm.newPath = this.backupDirInfo.relative || ''
      this.backupPathDialogVisible = true
    },

    async confirmChangeBackupPath() {
      if (!this.backupPathForm.newPath || !this.backupPathForm.newPath.trim()) {
        this.$message.warning(this.$t('menu.superPanel.projectConfig.backupPathDialog.pathRequired'))
        return
      }

      this.changingBackupPath = true
      try {
        const res = await requestSetBackupDirApi({
          backupPath: this.backupPathForm.newPath.trim()
        })
        this.backupDirInfo = res.data.new || { absolute: '', relative: '' }
        this.backupPathDialogVisible = false
        this.$message.success(this.$t('menu.superPanel.projectConfig.backupPathDialog.changeSuccess'))
        this.loadBackupList()
      } catch (err) {
        // 错误已由拦截器处理
      } finally {
        this.changingBackupPath = false
      }
    }
  }
}
</script>

<style scoped>
.project-config-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.page-desc {
  margin: 5px 0 0;
  font-size: 13px;
  color: #909399;
}

.config-body {
  flex: 1;
  display: flex;
  gap: 15px;
  min-height: 0;
}

.config-sidebar {
  width: 180px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 10px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #606266;
}

.menu-item:hover {
  background: #f5f7fa;
  color: #409eff;
}

.menu-item.active {
  background: #ecf5ff;
  color: #409eff;
  border-right: 3px solid #409eff;
}

.config-content {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 20px;
  overflow-y: auto;
}

.config-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 15px;
}

.config-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s;
}

.config-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-color: #dcdfe6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.config-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.name-icon {
  font-size: 16px;
  color: #409eff;
}

.config-tags {
  display: flex;
  gap: 5px;
}

.card-body {
  padding: 15px;
}

.config-value {
  font-size: 14px;
  color: #606266;
  word-break: break-all;
  line-height: 1.6;
}

.config-value.is-code,
.config-value.is-path {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: #f5f7fa;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 13px;
}

.password-mask {
  letter-spacing: 3px;
}

.card-footer {
  padding: 10px 15px;
  border-top: 1px solid #f0f0f0;
}

.config-desc {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
  line-height: 1.5;
}

.config-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.file-path {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #909399;
}

.file-path code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #ebeef5;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
}

/* 编辑器弹窗 */
.editor-dialog-content {
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 4px 4px 0 0;
  margin-bottom: 10px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.backup-path-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 10px;
}

.backup-path-tip {
  font-size: 16px;
  color: #909399;
  cursor: help;
}

.editor-main {
  flex: 1;
  display: flex;
  gap: 10px;
  min-height: 0;
}

.editor-wrapper {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.backup-panel {
  width: 280px;
  flex-shrink: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.backup-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.backup-item {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.backup-item:hover {
  border-color: #409eff;
}

.backup-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
}

.backup-time {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.backup-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;
  margin-bottom: 6px;
}

.backup-remark {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
  padding: 5px 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.backup-actions {
  display: flex;
  gap: 5px;
}

.empty-backup {
  text-align: center;
  padding: 30px 0;
  color: #909399;
}

.empty-backup i {
  font-size: 36px;
  margin-bottom: 10px;
}

.syntax-result {
  margin-top: 10px;
}
</style>
