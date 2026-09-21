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
    <el-dialog v-model="editorDialogVisible :title" width="90%" top="5vh" :close-on-click-modal="false" append-to-body @closed="handleEditorClosed">
    </el-dialog>
  </div>
</template>
