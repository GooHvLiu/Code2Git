<template>
  <div class="language-config-container">
    <!-- 配置文件卡片列表 -->
    <div class="config-cards">
      <div
        v-for="item in configItems"
        :key="item.key"
        class="config-card"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="config-name">
            <i
              :class="getEditTypeIcon(item.meta?.editType)"
              class="name-icon"
            ></i>
            <span>{{
              item.meta?.labelKey ? $t(item.meta.labelKey) : item.label
            }}</span>
          </div>
          <div class="config-tags">
            <!-- 编辑类型标签 -->
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
            <!-- 生效类型标签 -->
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
              :content="
                $t(
                  getOwnerTypeConfig(getOwnerType(item.meta))
                    .descriptionKey
                )
              "
              placement="top"
            >
              <el-tag
                :type="getOwnerTypeConfig(getOwnerType(item.meta)).type"
                size="mini"
                effect="plain"
              >
                <i
                  :class="
                    getOwnerTypeConfig(getOwnerType(item.meta)).icon
                  "
                ></i>
                {{
                  $t(getOwnerTypeConfig(getOwnerType(item.meta)).labelKey)
                }}
              </el-tag>
            </el-tooltip>
          </div>
        </div>

        <!-- 卡片内容：配置值 -->
        <div class="card-body">
          <div class="config-value">
            <span class="lang-count-text">{{ $t("menu.superPanel.config.childrenMenu.language.currentSupportedLangs") }}：</span>
            <span class="lang-count-number">{{ presetLanguages.length }}</span>
            <span class="lang-count-unit">{{ $t("menu.superPanel.config.childrenMenu.language.totalLangsUnit") }}</span>
          </div>
          <!-- 语言标签预览 -->
          <div class="lang-preview">
            <el-tag
              v-for="lang in presetLanguages.slice(0, 8)"
              :key="lang.code"
              size="mini"
              class="lang-tag"
            >
              <svg-icon :icon-class="lang.flag || 'flags/global'" class="lang-flag-icon" />
              <span>{{ lang.autonym }}</span>
            </el-tag>
            <el-tag
              v-if="presetLanguages.length > 8"
              size="mini"
              type="info"
              class="lang-tag"
            >
              +{{ presetLanguages.length - 8 }}
            </el-tag>
          </div>
        </div>

        <!-- 卡片底部：说明 + 操作 -->
        <div class="card-footer">
          <div
            class="config-desc"
            v-if="item.meta?.descriptionKey || item.meta?.description"
          >
            <i class="el-icon-info"></i>
            <span>{{
              item.meta?.descriptionKey
                ? $t(item.meta.descriptionKey)
                : item.meta.description
            }}</span>
          </div>
          <div class="config-actions">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEditor(item)"
            >
              {{ $t("menu.superPanel.projectConfig.actions.editFile") }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-view"
              @click="viewLanguages"
            >
              {{ $t("menu.superPanel.config.childrenMenu.language.viewLanguages") }}
            </el-button>
          </div>
        </div>

        <!-- 文件路径显示 -->
        <div v-if="item.meta" class="file-path">
          <template v-if="getSourceType(item.meta) === 'file'">
            <i class="el-icon-folder-opened"></i>
            <code>{{ item.meta.filePath }}</code>
          </template>
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
              {{
                editorDirty
                  ? $t("menu.superPanel.projectConfig.editor.unsaved")
                  : $t("menu.superPanel.projectConfig.editor.saved")
              }}
            </el-tag>
          </div>
          <div class="toolbar-right">
            <el-button
              size="small"
              icon="el-icon-check"
              @click="checkSyntax"
              :loading="checkingSyntax"
            >
              {{ $t("menu.superPanel.projectConfig.editor.syntaxCheck") }}
            </el-button>
            <el-button
              size="small"
              icon="el-icon-back"
              @click="showBackupPanel = !showBackupPanel"
            >
              {{ $t("menu.superPanel.projectConfig.editor.versionHistory") }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-document"
              @click="saveFile"
              :loading="saving"
              :disabled="!editorDirty"
            >
              {{ $t("menu.superPanel.projectConfig.editor.save") }}
            </el-button>
          </div>
        </div>

        <!-- 语法检查结果 -->
        <div v-if="syntaxResult" class="syntax-result" :class="syntaxResult.valid ? 'success' : 'error'">
          <i :class="syntaxResult.valid ? 'el-icon-success' : 'el-icon-error'"></i>
          <span>{{ syntaxResult.message }}</span>
        </div>

        <!-- 编辑器主体 -->
        <div class="editor-main">
          <div class="editor-wrapper" :class="{ 'with-backup': showBackupPanel }">
            <monaco-editor
              ref="monacoEditor"
              v-model="editorContent"
              :language="editorLanguage"
              :theme="'vs'"
              :read-only="false"
              :minimap="true"
              :font-size="14"
            />
          </div>

          <!-- 版本历史面板 -->
          <div class="backup-panel" v-if="showBackupPanel">
            <div class="panel-header">
              <span class="panel-title">{{
                $t("menu.superPanel.projectConfig.backup.title")
              }}</span>
              <el-button
                size="mini"
                icon="el-icon-refresh"
                @click="loadBackupList"
              ></el-button>
            </div>
            <div class="backup-list" v-loading="backupListLoading" :element-loading-text="$t('common.loading')">
              <div
                v-for="backup in backupList"
                :key="backup.name"
                class="backup-item"
              >
                <div class="backup-header">
                  <i class="el-icon-time"></i>
                  <span class="backup-time">{{
                    backup.createTimeFormatted || backup.createTime || backup.name
                  }}</span>
                </div>
                <div class="backup-meta">
                  <span>{{ backup.sizeFormatted || backup.size || '' }}</span>
                </div>
                <div class="backup-actions" @click.stop>
                  <el-button
                    size="mini"
                    type="warning"
                    @click="restoreBackup(backup)"
                  >
                    {{ $t("menu.superPanel.projectConfig.backup.restore") }}
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteBackup(backup)"
                  >
                    {{ $t("menu.superPanel.projectConfig.backup.delete") }}
                  </el-button>
                </div>
              </div>
              <div
                v-if="backupList.length === 0 && !backupListLoading"
                class="backup-empty"
              >
                <i class="el-icon-document"></i>
                <p>{{ $t("menu.superPanel.projectConfig.backup.empty") }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="editor-tip">
          <el-alert
            :title="$t('menu.superPanel.config.childrenMenu.language.tipTitle')"
            type="warning"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>{{ $t("menu.superPanel.config.childrenMenu.language.tipContent") }}</p>
              <p class="tip-extra">
                {{ $t("menu.superPanel.config.childrenMenu.language.tipExtra") }}
              </p>
            </template>
          </el-alert>
        </div>
      </div>
    </el-dialog>

    <!-- 语言列表预览对话框 -->
    <el-dialog
      :title="$t('menu.superPanel.config.childrenMenu.language.currentSupportedLangs')"
      :visible.sync="languageDialogVisible"
      width="60%"
      top="10vh"
    >
      <div class="language-preview">
        <div class="lang-tags">
          <el-tag
            v-for="lang in presetLanguages"
            :key="lang.code"
            size="small"
            class="lang-tag"
          >
            <svg-icon :icon-class="lang.flag || 'flags/global'" class="lang-flag-icon" />
            <span class="lang-tag-text">{{ lang.autonym }} ({{ lang.code }})</span>
          </el-tag>
        </div>
        <div class="lang-count-info">
          {{ $t("menu.superPanel.config.childrenMenu.language.totalLangs", { count: presetLanguages.length }) }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="languageDialogVisible = false">
          {{ $t("common.close") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MonacoEditor from "@/components/MonacoEditor/index.vue";
import { requestGetPresetLanguagesConfigApi, requestSavePresetLanguagesConfigApi, requestGetPresetLanguagesApi, requestGetI18nBackupListApi, requestRestoreI18nBackupApi, requestDeleteI18nBackupApi } from '@/api/i18nManager'
import { requestCheckConfigSyntaxApi } from '@/api/projectConfig'

// 编辑类型常量
const EDIT_TYPE = {
  DATABASE: 'database',
  CONFIG_FILE: 'configFile',
  ENV_FILE: 'envFile',
  CODE: 'code'
}

// 生效类型常量
const EFFECT_TYPE = {
  IMMEDIATE: 'immediate',
  RESTART: 'restart',
  REBUILD: 'rebuild'
}

// 归属类型配置
const OWNER_TYPE_CONFIG = {
  frontend: {
    labelKey: 'menu.superPanel.projectConfig.ownerType.frontend',
    descriptionKey: 'menu.superPanel.projectConfig.ownerType.frontendTip',
    icon: 'el-icon-monitor',
    type: 'primary'
  },
  backend: {
    labelKey: 'menu.superPanel.projectConfig.ownerType.backend',
    descriptionKey: 'menu.superPanel.projectConfig.ownerType.backendTip',
    icon: 'el-icon-cpu',
    type: 'success'
  }
}

export default {
  name: 'LanguageConfig',
  components: { MonacoEditor },
  data() {
    return {
      loading: false,
      saving: false,
      checkingSyntax: false,
      editorDialogVisible: false,
      languageDialogVisible: false,
      editorContent: '',
      originalContent: '',
      currentEditFile: '',
      currentEditItem: null,
      editorLanguage: 'javascript',
      syntaxResult: null,
      presetLanguages: [],
      // 版本历史
      showBackupPanel: false,
      backupList: [],
      backupListLoading: false,
      // 配置项列表
      configItems: [
        {
          key: 'languagesConfig',
          label: '预设语言配置',
          meta: {
            labelKey: 'menu.superPanel.config.childrenMenu.language.title',
            descriptionKey: 'menu.superPanel.config.childrenMenu.language.desc',
            editType: EDIT_TYPE.CONFIG_FILE,
            effectType: EFFECT_TYPE.RESTART,
            owner: 'backend',
            filePath: 'src/config/languages.config.js',
            sourceType: 'file'
          }
        }
      ]
    }
  },
  computed: {
    editorDirty() {
      return this.editorContent !== this.originalContent;
    },
    editorDialogTitle() {
      if (this.currentEditItem) {
        const label = this.currentEditItem.meta?.labelKey
          ? this.$t(this.currentEditItem.meta.labelKey)
          : this.currentEditItem.label;
        return `${label} - ${this.$t(
          "menu.superPanel.projectConfig.editor.title"
        )}`;
      }
      return this.$t("menu.superPanel.projectConfig.editor.title");
    }
  },
  mounted() {
    this.loadPresetLanguages();
  },
  methods: {
    // 加载预设语言列表
    async loadPresetLanguages() {
      try {
        const res = await requestGetPresetLanguagesApi()
        this.presetLanguages = res.data || []
      } catch (err) {
        console.error('[LanguageConfig] 加载预设语言列表失败:', err)
      }
    },

    // ==================== 修改方式/生效方式配置 ====================
    getEditTypeIcon(editType) {
      const iconMap = {
        [EDIT_TYPE.DATABASE]: "el-icon-coin",
        [EDIT_TYPE.CONFIG_FILE]: "el-icon-document",
        [EDIT_TYPE.ENV_FILE]: "el-icon-setting",
        [EDIT_TYPE.CODE]: "el-icon-code",
      };
      return iconMap[editType] || "el-icon-setting";
    },

    getEditTypeTagType(editType) {
      const typeMap = {
        [EDIT_TYPE.DATABASE]: "success",
        [EDIT_TYPE.CONFIG_FILE]: "warning",
        [EDIT_TYPE.ENV_FILE]: "danger",
        [EDIT_TYPE.CODE]: "info",
      };
      return typeMap[editType] || "info";
    },

    getEditTypeLabelKey(editType) {
      const keyMap = {
        [EDIT_TYPE.DATABASE]: "menu.superPanel.projectConfig.editType.database",
        [EDIT_TYPE.CONFIG_FILE]: "menu.superPanel.projectConfig.editType.configFile",
        [EDIT_TYPE.ENV_FILE]: "menu.superPanel.projectConfig.editType.envFile",
        [EDIT_TYPE.CODE]: "menu.superPanel.projectConfig.editType.code",
      };
      return keyMap[editType] || "menu.superPanel.projectConfig.editType.code";
    },

    getEditTypeTipKey(editType) {
      const keyMap = {
        [EDIT_TYPE.DATABASE]: "menu.superPanel.projectConfig.editType.databaseTip",
        [EDIT_TYPE.CONFIG_FILE]: "menu.superPanel.projectConfig.editType.configFileTip",
        [EDIT_TYPE.ENV_FILE]: "menu.superPanel.projectConfig.editType.envFileTip",
        [EDIT_TYPE.CODE]: "menu.superPanel.projectConfig.editType.codeTip",
      };
      return keyMap[editType] || "menu.superPanel.projectConfig.editType.codeTip";
    },

    getEffectTypeTagType(effectType) {
      const typeMap = {
        [EFFECT_TYPE.IMMEDIATE]: "success",
        [EFFECT_TYPE.RESTART]: "warning",
        [EFFECT_TYPE.REBUILD]: "danger",
      };
      return typeMap[effectType] || "info";
    },

    getEffectTypeLabelKey(effectType) {
      const keyMap = {
        [EFFECT_TYPE.IMMEDIATE]: "menu.superPanel.projectConfig.effectType.immediate",
        [EFFECT_TYPE.RESTART]: "menu.superPanel.projectConfig.effectType.restart",
        [EFFECT_TYPE.REBUILD]: "menu.superPanel.projectConfig.effectType.rebuild",
      };
      return keyMap[effectType] || "menu.superPanel.projectConfig.effectType.restart";
    },

    getEffectTypeTipKey(effectType) {
      const keyMap = {
        [EFFECT_TYPE.IMMEDIATE]: "menu.superPanel.projectConfig.effectType.immediateTip",
        [EFFECT_TYPE.RESTART]: "menu.superPanel.projectConfig.effectType.restartTip",
        [EFFECT_TYPE.REBUILD]: "menu.superPanel.projectConfig.effectType.rebuildTip",
      };
      return keyMap[effectType] || "menu.superPanel.projectConfig.effectType.restartTip";
    },

    // ==================== 归属类型 ====================
    getOwnerType(meta) {
      if (!meta) return "";
      if (meta.owner) return meta.owner;
      return "backend";
    },

    getOwnerTypeConfig(ownerType) {
      return OWNER_TYPE_CONFIG[ownerType] || OWNER_TYPE_CONFIG.backend;
    },

    // ==================== 来源类型 ====================
    getSourceType(meta) {
      if (!meta) return "";
      return meta.sourceType || "file";
    },

    // ==================== 编辑器 ====================
    async openEditor(item) {
      this.currentEditItem = item;
      this.currentEditFile = item.meta.filePath;
      this.editorLanguage = 'javascript';
      this.syntaxResult = null;
      
      this.loading = true;
      try {
        const res = await requestGetPresetLanguagesConfigApi();
        this.editorContent = res.data || '';
        this.originalContent = this.editorContent;
        this.editorDialogVisible = true;
        // 加载备份列表
        this.loadBackupList();
      } catch (err) {
        console.error('[LanguageConfig] 加载配置失败:', err);
        this.$message.error(
          this.$t("menu.superPanel.config.childrenMenu.language.loadFailed")
        );
      } finally {
        this.loading = false;
      }
    },

    // 语法检查
    async checkSyntax() {
      this.checkingSyntax = true;
      this.syntaxResult = null;
      try {
        const res = await requestCheckConfigSyntaxApi({
          content: this.editorContent,
          language: 'javascript'
        });
        this.syntaxResult = {
          valid: res.data?.valid !== false,
          message: res.data?.message || (res.data?.valid !== false ? '语法检查通过' : '语法检查失败')
        };
      } catch (err) {
        console.error('[LanguageConfig] 语法检查失败:', err);
        this.syntaxResult = {
          valid: false,
          message: '语法检查失败：' + (err.message || '未知错误')
        };
      } finally {
        this.checkingSyntax = false;
      }
    },

    // 保存文件
    async saveFile() {
      if (!this.editorContent.trim()) {
        this.$message.warning(
          this.$t("menu.superPanel.config.childrenMenu.language.emptyWarning")
        );
        return;
      }

      this.saving = true;
      try {
        await requestSavePresetLanguagesConfigApi(this.editorContent);
        this.originalContent = this.editorContent;
        this.$message.success(
          this.$t("menu.superPanel.config.childrenMenu.language.saveSuccess")
        );
        // 重新加载预设语言列表
        this.loadPresetLanguages();
        this.editorDialogVisible = false;
      } catch (err) {
        console.error('[LanguageConfig] 保存配置失败:', err);
        this.$message.error(
          this.$t("menu.superPanel.config.childrenMenu.language.saveFailed")
        );
      } finally {
        this.saving = false;
      }
    },

    // 编辑器关闭
    handleEditorClosed() {
      this.currentEditItem = null;
      this.currentEditFile = '';
      this.editorContent = '';
      this.originalContent = '';
      this.syntaxResult = null;
      this.showBackupPanel = false;
      this.backupList = [];
    },

    // 查看语言列表
    viewLanguages() {
      this.languageDialogVisible = true;
    },

    // ==================== 版本历史 ====================
    // 加载备份列表
    async loadBackupList() {
      this.backupListLoading = true;
      try {
        const res = await requestGetI18nBackupListApi('languages.config.js');
        this.backupList = res.data || [];
      } catch (err) {
        console.error('[LanguageConfig] 加载备份列表失败:', err);
        this.$message.error('加载备份列表失败');
      } finally {
        this.backupListLoading = false;
      }
    },

    // 恢复备份
    async restoreBackup(backup) {
      try {
        await this.$confirm(
          `确定要恢复备份 "${backup.name}" 吗？恢复后当前内容将被覆盖。`,
          '恢复备份',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
      } catch (err) {
        return;
      }

      try {
        await requestRestoreI18nBackupApi(backup.name, 'languages.config.js');
        this.$message.success('备份恢复成功');
        // 重新加载配置内容
        const res = await requestGetPresetLanguagesConfigApi();
        this.editorContent = res.data || '';
        this.originalContent = this.editorContent;
        // 重新加载备份列表
        this.loadBackupList();
        // 重新加载预设语言列表
        this.loadPresetLanguages();
      } catch (err) {
        console.error('[LanguageConfig] 恢复备份失败:', err);
        this.$message.error('恢复备份失败');
      }
    },

    // 删除备份
    async deleteBackup(backup) {
      try {
        await this.$confirm(
          `确定要删除备份 "${backup.name}" 吗？删除后不可恢复。`,
          '删除备份',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
      } catch (err) {
        return;
      }

      try {
        await requestDeleteI18nBackupApi(backup.name);
        this.$message.success('备份删除成功');
        // 重新加载备份列表
        this.loadBackupList();
      } catch (err) {
        console.error('[LanguageConfig] 删除备份失败:', err);
        this.$message.error('删除备份失败');
      }
    }
  }
}
</script>

<style scoped>
.language-config-container {
  padding: 0;
}

/* 配置文件卡片列表 */
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

/* 卡片头部 */
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

/* 卡片内容 */
.card-body {
  padding: 15px;
}

.config-value {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.lang-count-text {
  color: #909399;
}

.lang-count-number {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
}

.lang-count-unit {
  color: #909399;
}

.lang-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.lang-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lang-flag-icon {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

/* 卡片底部 */
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

/* 文件路径 */
.file-path {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: #f5f7fa;
  border-top: 1px solid #ebeef5;
  font-size: 12px;
}

.file-path code {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  color: #606266;
  font-size: 11px;
}

/* 编辑器对话框 */
.editor-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 语法检查结果 */
.syntax-result {
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.syntax-result.success {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.syntax-result.error {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}

/* 编辑器主体 */
.editor-main {
  flex: 1;
  display: flex;
  gap: 10px;
  min-height: 500px;
  height: 500px;
}

.editor-wrapper {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

/* 版本历史面板 */
.backup-panel {
  width: 280px;
  flex-shrink: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.backup-panel .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.backup-panel .panel-title {
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

.backup-header i {
  color: #909399;
  font-size: 12px;
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

.backup-actions {
  display: flex;
  gap: 5px;
}

.backup-empty {
  text-align: center;
  padding: 30px 0;
  color: #909399;
}

.backup-empty i {
  font-size: 36px;
  margin-bottom: 10px;
}

.backup-empty p {
  font-size: 13px;
  margin: 0;
}

/* 提示信息 */
.editor-tip {
  margin-top: 10px;
}

.tip-extra {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}

/* 语言列表预览 */
.language-preview {
  padding: 10px 0;
}

.lang-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.lang-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
}

.lang-flag-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.lang-tag-text {
  font-size: 13px;
}

.lang-count-info {
  text-align: center;
  color: #909399;
  font-size: 13px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
