<template>
  <div class="i18n-manager-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.i18n.page.title') }}</h2>
        <span class="page-desc">{{ t('superPanel.i18n.page.desc') }}</span>
      </div>
      <div class="header-right">
        <el-button v-if="translateManager.state.isTranslating" type="info" size="small" :icon="Loading" @click="translateManager.showDialog()">
          {{ t('superPanel.i18n.translate.status') }} {{ translateManager.getProgressPercent() }}%
        </el-button>
        <el-button type="warning" size="small" :icon="Plus" @click="openCreateLanguageDialog">
          {{ t('superPanel.i18n.createLang.action') }}
        </el-button>
        <el-button type="success" size="small" :icon="Check" :loading="saving" :disabled="!activeTab" @click="handleSave">
          {{ t('common.save') }}
        </el-button>
        <el-tooltip :content="t('superPanel.i18n.backup.action')" placement="bottom">
          <el-button size="small" :icon="Download" :disabled="!activeTab" circle @click="handleBackup" />
        </el-tooltip>
        <el-tooltip v-if="activeTab && activeTab !== masterLanguage && !translateManager.state.isTranslating" :content="t('superPanel.i18n.compare.batch')" placement="bottom">
          <el-button size="small" :icon="DocumentCopy" circle @click="openBatchCompareDialog" />
        </el-tooltip>
        <el-tooltip v-if="activeTab && activeTab !== masterLanguage && !translateManager.state.isTranslating" :content="t('superPanel.i18n.translate.batch')" placement="bottom">
          <el-button size="small" :icon="Reading" circle @click="openBatchTranslateDialog" />
        </el-tooltip>
        <el-tooltip :content="backupPathTooltip" placement="bottom">
          <el-button size="small" :icon="FolderOpened" circle @click="openBackupPathDialog" />
        </el-tooltip>
        <el-tooltip :content="t('common.refresh')" placement="bottom">
          <el-button size="small" :icon="Refresh" :disabled="!activeTab" circle @click="loadCurrentFile()" />
        </el-tooltip>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="main-wrapper">
      <div class="lang-tabs">
        <div v-for="file in fileList" :key="file.langCode" class="lang-tab-item" :class="{ active: activeTab === file.langCode }" @click="handleLangTabClick(file.langCode)">
          <el-icon><ChatLineRound /></el-icon>
          <span>{{ file.autonym }}</span>
        </div>
      </div>

      <!-- 未选择语言 -->
      <div v-if="!activeTab" class="language-empty-tip">
        <div class="tip-icon"><el-icon><Document /></el-icon></div>
        <h3 class="tip-title">{{ t('superPanel.i18n.createLang.selectTitle') }}</h3>
        <p class="tip-desc">{{ t('superPanel.i18n.createLang.selectDesc') }}</p>
        <div class="tip-language-list">
          <div v-for="file in fileList" :key="file.langCode" class="language-card" @click="handleLangTabClick(file.langCode)">
            <el-icon><ChatLineRound /></el-icon>
            <span>{{ file.autonym }}</span>
          </div>
        </div>
      </div>

      <!-- 已选择语言编辑区 -->
      <div v-else v-loading="loading" :element-loading-text="t('common.loading')" class="editor-area">
        <div ref="mainContentRef" class="main-content">
          <!-- 左：树形导航 -->
          <div class="tree-panel" :style="{ width: leftPanelWidth + '%' }">
            <div class="panel-header">
              <el-input
                v-model="searchKeyword"
                :placeholder="t('superPanel.i18n.field.searchPlaceholder')"
                :prefix-icon="Search"
                clearable
                size="small"
                class="tree-search"
                @input="handleTreeSearch"
                @keyup.enter="handleSearchEnter"
              />
              <div v-if="searchKeyword && searchResults.length > 0" class="search-toolbar">
                <span class="search-count-text">{{ currentSearchIndex + 1 }} / {{ searchResults.length }}</span>
                <el-button-group size="small">
                  <el-button :icon="ArrowUp" :disabled="currentSearchIndex === 0" @click="prevSearchResult" />
                  <el-button :icon="ArrowDown" :disabled="currentSearchIndex === searchResults.length - 1" @click="nextSearchResult" />
                </el-button-group>
              </div>
              <div v-if="searchKeyword && searchResults.length === 0 && !searchLoading" class="search-no-result">
                <span>{{ t('superPanel.i18n.field.noData') }}</span>
              </div>
            </div>
            <div class="tree-container">
              <el-tree
                ref="i18nTreeRef"
                :key="treeKey"
                :load="isSearching ? undefined : loadNode"
                :lazy="!isSearching"
                :data="isSearching ? filteredTreeData : undefined"
                node-key="keyPath"
                :props="{ label: 'label', children: 'children', isLeaf: 'isLeaf' }"
                :expand-on-click-node="false"
                :highlight-current="true"
                :default-expand-all="isSearching"
                class="i18n-tree"
                @node-click="handleNodeClick"
                @node-contextmenu="showContextMenu"
              >
                <template #default="{ data }">
                  <span class="custom-tree-node">
                    <el-icon><component :is="data.isLeaf ? Document : Folder" /></el-icon>
                    <span class="tree-node-label" :class="{ 'match-node': isSearching && data.isMatch, 'parent-match-node': isSearching && !data.isMatch && data.matchCount > 0 }">{{ data.label }}</span>
                    <span v-if="!data.isLeaf && data.childCount !== undefined" class="tree-node-count">({{ data.childCount }})</span>
                    <span v-if="isSearching && data.isMatch" class="match-badge">{{ t('superPanel.i18n.search.matchBadge') }}</span>
                    <span v-if="isSearching && !data.isMatch && data.matchCount > 0" class="match-count-badge">{{ t('superPanel.i18n.search.matchCountBadge', { count: data.matchCount }) }}</span>
                  </span>
                </template>
              </el-tree>
              <div v-if="!loading && !currentData" class="empty-state">
                <el-icon><FolderOpened /></el-icon>
                <p>{{ t('superPanel.i18n.field.noData') }}</p>
              </div>
              <div v-if="currentData && !loading" class="tree-footer">
                <span class="footer-stat"><el-icon><Folder /></el-icon> {{ totalFolderCount }} {{ t('superPanel.i18n.node.folders') }}</span>
                <span class="footer-stat"><el-icon><Document /></el-icon> {{ totalLeafCount }} {{ t('superPanel.i18n.node.items') }}</span>
                <span class="footer-stat footer-total"><el-icon><Menu /></el-icon> {{ totalNodeCount }} {{ t('superPanel.i18n.compare.total') }}</span>
              </div>
            </div>
          </div>

          <div class="resizer" :class="{ dragging: isResizing }" @mousedown="startResize">
            <div class="resizer-handle">
              <span class="resizer-dot"></span><span class="resizer-dot"></span><span class="resizer-dot"></span>
            </div>
          </div>

          <!-- 右：详情编辑区 -->
          <div class="detail-panel">
            <div v-if="selectedKeyPath !== null" class="breadcrumb-bar">
              <span class="breadcrumb-label">{{ t('superPanel.i18n.backup.currentPath') }}:</span>
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :class="{ clickable: index < breadcrumbList.length - 1 }" @click="handleBreadcrumbClick(index)">
                  {{ item }}
                </el-breadcrumb-item>
              </el-breadcrumb>
              <div class="breadcrumb-actions">
                <el-button type="primary" size="small" :icon="Plus" @click="openAddDialog('addChild', selectedKeyPath)">
                  {{ t('superPanel.i18n.node.addChild') }}
                </el-button>
              </div>
            </div>

            <div v-if="selectedIsLeaf" class="leaf-editor">
              <div class="leaf-info"><span class="leaf-key">{{ selectedKeyPath }}</span></div>
              <el-input v-model="leafValue" type="textarea" :rows="3" :placeholder="t('superPanel.i18n.field.valuePlaceholder')" @change="handleLeafValueChange" />
            </div>

            <div v-else-if="selectedKeyPath !== null" class="detail-list">
              <div class="list-header">
                <span class="header-key">{{ t('superPanel.i18n.field.keyName') }}</span>
                <span class="header-value">{{ t('superPanel.i18n.field.value') }}</span>
                <span class="header-actions">{{ t('superPanel.i18n.page.actions') }}</span>
              </div>
              <div class="list-body">
                <div v-for="item in detailList" :key="item.keyPath" class="list-item" :class="{ modified: modifiedKeys.has(item.keyPath) }">
                  <span class="item-key" @click="handleItemClick(item)">
                    <el-icon><component :is="item.isLeaf ? Document : Folder" /></el-icon>
                    {{ item.label }}
                  </span>
                  <span v-if="item.isLeaf" class="item-value">
                    <el-input v-model="item.value" size="small" :placeholder="t('superPanel.i18n.field.valuePlaceholder')" @change="handleValueChange(item)" />
                  </span>
                  <span v-else class="item-value item-value-folder" @click="handleItemClick(item)">
                    {{ item.childCount }} {{ t('superPanel.i18n.node.items') }}
                  </span>
                  <span class="item-actions">
                    <el-button v-if="!item.isLeaf" type="text" size="small" :icon="Plus" @click="openAddDialog('addChild', item.keyPath)">
                      {{ t('superPanel.i18n.node.addChild') }}
                    </el-button>
                    <el-dropdown v-if="item.isLeaf && activeTab !== masterLanguage" trigger="hover" placement="bottom" @command="(format: string) => autoTranslateDetailItem(item, format)">
                      <el-button type="text" size="small" :icon="Connection" :loading="detailTranslating[item.keyPath]" class="auto-translate-btn-text">
                        {{ t('superPanel.i18n.translate.auto') }}
                        <el-tooltip :content="t('superPanel.i18n.translate.autoTip')" placement="top">
                          <el-icon class="auto-translate-question"><QuestionFilled /></el-icon>
                        </el-tooltip>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="normal">{{ t('superPanel.i18n.field.formatNormal') }}</el-dropdown-item>
                          <el-dropdown-item command="title">{{ t('superPanel.i18n.field.formatTitle') }}</el-dropdown-item>
                          <el-dropdown-item command="camel">{{ t('superPanel.i18n.field.formatCamel') }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                    <el-button type="text" size="small" :icon="Delete" class="delete-btn" @click="handleDeleteItem(item)">
                      {{ t('common.delete') }}
                    </el-button>
                  </span>
                </div>
                <div v-if="detailList.length === 0" class="empty-list">
                  <el-icon><FolderOpened /></el-icon>
                  <p>{{ t('superPanel.i18n.node.noChildren') }}</p>
                </div>
              </div>
            </div>

            <div v-if="selectedKeyPath === null && currentData" class="detail-empty">
              <el-icon><Pointer /></el-icon>
              <p>{{ t('superPanel.i18n.node.selectTip') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ul v-show="contextMenu.visible" class="context-menu" :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
      <li @click="handleAddChild"><el-icon><Plus /></el-icon><span>{{ t('superPanel.i18n.node.addChild') }}</span></li>
      <li @click="handleAddSibling"><el-icon><DocumentCopy /></el-icon><span>{{ t('superPanel.i18n.node.addSibling') }}</span></li>
      <li class="divider"></li>
      <li v-if="contextMenu.data && !contextMenu.data.isLeaf" :class="{ disabled: translateManager.state.isTranslating }" @click="handleNodeTranslate">
        <el-icon><Reading /></el-icon><span>{{ t('superPanel.i18n.translate.node') }}</span>
      </li>
      <li v-if="contextMenu.data && !contextMenu.data.isLeaf" class="divider"></li>
      <li class="danger" @click="handleDeleteNode"><el-icon><Delete /></el-icon><span>{{ t('superPanel.i18n.node.deleteNode') }}</span></li>
    </ul>

    <!-- 新增/编辑配置对话框 -->
    <el-dialog v-model="addDialog.visible" :title="addDialog.mode === 'edit' ? t('superPanel.i18n.node.editConfig') : t('superPanel.i18n.node.addConfig')" width="600px">
      <el-form :model="addDialog.form" label-width="180px">
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.node.parentPath') }}
              <el-tooltip :content="t('superPanel.i18n.node.parentPathTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-cascader
            v-model="addDialog.parentPathArray"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover', children: 'children', label: 'label', value: 'keyPath' }"
            :placeholder="t('superPanel.i18n.node.parentPathPlaceholder')"
            style="width: 100%"
            clearable
            @change="handleParentPathChange"
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.field.keyName') }}
              <el-tooltip :content="t('superPanel.i18n.field.keyNameTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="addDialog.form.key" :placeholder="t('superPanel.i18n.field.keyNamePlaceholder')" />
        </el-form-item>
        <el-form-item v-for="file in fileList" :key="file.langCode" :label="file.autonym">
          <div class="value-input-wrapper">
            <el-input v-model="addDialog.form.values[file.langCode]" :placeholder="t('superPanel.i18n.field.valuePlaceholderWithLang', { lang: file.autonym })" />
            <el-dropdown v-if="file.langCode !== masterLanguage && addDialog.form.values[masterLanguage]" trigger="hover" placement="bottom" @command="(format: string) => autoTranslate(file.langCode, format)">
              <el-button size="small" type="primary" :icon="Connection" :loading="addDialog.translating[file.langCode]" class="auto-translate-btn">
                {{ t('superPanel.i18n.translate.auto') }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="normal">{{ t('superPanel.i18n.field.formatNormal') }}</el-dropdown-item>
                  <el-dropdown-item command="title">{{ t('superPanel.i18n.field.formatTitle') }}</el-dropdown-item>
                  <el-dropdown-item command="camel">{{ t('superPanel.i18n.field.formatCamel') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="addDialog.saving" @click="handleAddConfig">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 备份路径设置对话框 -->
    <el-dialog v-model="backupPathDialog.visible" :title="t('superPanel.i18n.backup.path')" width="700px" @open="loadBackupList">
      <el-form label-width="140px">
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.backup.currentPath') }}
              <el-tooltip :content="t('superPanel.i18n.backup.currentPathTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input :model-value="backupConfig.backupDir" readonly class="readonly-path-input" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.backup.newPath') }}
              <el-tooltip :content="t('superPanel.i18n.backup.newPathTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="backupPathDialog.newPath" :placeholder="t('superPanel.i18n.node.pathNotEmpty')" />
        </el-form-item>
      </el-form>
      <div class="backup-list-section">
        <div class="backup-list-header">
          <span class="backup-list-title">{{ t('superPanel.i18n.backup.list') }}</span>
          <el-button size="small" :icon="Refresh" @click="loadBackupList">{{ t('common.refresh') }}</el-button>
        </div>
        <div v-loading="backupListLoading" :element-loading-text="t('common.loading')" class="backup-list-container">
          <el-table :data="backupList" size="small" border style="width: 100%" max-height="300">
            <el-table-column prop="fileName" :label="t('superPanel.i18n.backup.fileName')" min-width="200" show-overflow-tooltip />
            <el-table-column prop="size" :label="t('superPanel.i18n.backup.fileSize')" width="100" />
            <el-table-column prop="createdAt" :label="t('superPanel.i18n.backup.createTime')" width="180" />
            <el-table-column :label="t('common.operation')" width="120" align="center">
              <template #default="scope">
                <el-button type="text" size="small" :icon="Delete" class="delete-btn" @click="handleDeleteBackup((scope.row as any).fileName)">
                  {{ t('common.delete') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!backupListLoading && backupList.length === 0" class="backup-list-empty">
            <el-icon><FolderOpened /></el-icon>
            <span>{{ t('superPanel.i18n.backup.noBackup') }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="backupPathDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSetBackupPath">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 批量翻译确认对话框 -->
    <el-dialog v-model="batchTranslateDialog.visible" :title="batchTranslateDialog.nodePath ? t('superPanel.i18n.translate.node') : t('superPanel.i18n.translate.batch')" width="500px">
      <div class="batch-translate-content">
        <div class="batch-translate-info">
          <el-icon><WarningFilled /></el-icon>
          <span v-if="batchTranslateDialog.nodePath">
            {{ t('superPanel.i18n.translate.nodeTip') }}
            <span class="node-path-label">[{{ batchTranslateDialog.nodeLabel }}]</span>
          </span>
          <span v-else>{{ t('superPanel.i18n.translate.batchTip') }}</span>
        </div>
        <el-radio-group v-model="batchTranslateDialog.mode" class="batch-translate-mode">
          <el-radio value="missing">
            {{ t('superPanel.i18n.translate.missingOnly') }}
            <div class="radio-desc">{{ t('superPanel.i18n.translate.missingOnlyDesc') }}</div>
          </el-radio>
          <el-radio value="all">
            {{ t('superPanel.i18n.translate.all') }}
            <div class="radio-desc">{{ t('superPanel.i18n.translate.allDesc') }}</div>
          </el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="batchTranslateDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmBatchTranslate">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 批量对比字段对话框 -->
    <el-dialog v-model="batchCompareDialog.visible" :title="t('superPanel.i18n.compare.batch')" width="900px" :close-on-click-modal="false">
      <div class="batch-compare-config">
        <el-form :model="batchCompareDialog.form" label-width="160px" size="small">
          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.i18n.compare.masterLanguage') }}
                <el-tooltip :content="t('superPanel.i18n.compare.masterLanguageTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-input :model-value="batchCompareDialog.masterLangName" readonly class="readonly-language-input" style="width: 300px" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <span class="label-with-tip">
                {{ t('superPanel.i18n.compare.targetLanguage') }}
                <el-tooltip :content="t('superPanel.i18n.compare.targetLanguageTip')" placement="top">
                  <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="batchCompareDialog.form.targetLangCode" :placeholder="t('superPanel.i18n.compare.pleaseSelectLanguage')" style="width: 300px">
              <el-option v-for="file in fileList" :key="file.langCode" :label="file.autonym" :value="file.langCode" :disabled="file.langCode === masterLanguage" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="batchCompareDialog.comparing" @click="handleStartCompare">
              {{ t('superPanel.i18n.compare.start') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="batchCompareDialog.hasResult" class="batch-compare-stats">
        <div class="stat-card stat-blue"><div class="stat-value">{{ batchCompareDialog.stats.masterTotal }}</div><div class="stat-label">{{ t('superPanel.i18n.compare.masterCount') }}</div></div>
        <div class="stat-card stat-blue"><div class="stat-value">{{ batchCompareDialog.stats.targetTotal }}</div><div class="stat-label">{{ t('superPanel.i18n.compare.targetCount') }}</div></div>
        <div class="stat-card stat-orange"><div class="stat-value">{{ batchCompareDialog.stats.missingCount }}</div><div class="stat-label">{{ t('superPanel.i18n.compare.missingCount') }}</div></div>
        <div class="stat-card stat-green"><div class="stat-value">{{ batchCompareDialog.stats.extraCount }}</div><div class="stat-label">{{ t('superPanel.i18n.compare.extraCount') }}</div></div>
      </div>

      <div v-if="batchCompareDialog.hasResult" class="batch-compare-result">
        <div class="result-toolbar">
          <el-tabs v-model="batchCompareDialog.activeTab" size="small">
            <el-tab-pane :label="t('superPanel.i18n.compare.missingFields') + ' (' + batchCompareDialog.stats.missingCount + ')'" name="missing" />
            <el-tab-pane :label="t('superPanel.i18n.compare.extraFields') + ' (' + batchCompareDialog.stats.extraCount + ')'" name="extra" />
            <el-tab-pane :label="t('superPanel.i18n.compare.emptyFields') + ' (' + batchCompareDialog.stats.emptyCount + ')'" name="empty" />
          </el-tabs>
          <el-tooltip :content="t('common.copy')" placement="top">
            <el-button size="small" type="primary" :icon="DocumentCopy" circle @click="handleCopyReport" />
          </el-tooltip>
        </div>
        <div class="result-table-wrapper">
          <el-table :data="batchCompareDialog.fields[batchCompareDialog.activeTab]" border size="small" style="width: 100%" max-height="400">
            <el-table-column type="index" label="#" width="60" align="center" />
            <el-table-column prop="keyPath" :label="t('superPanel.i18n.node.fieldPath')" min-width="280" show-overflow-tooltip />
            <el-table-column :label="t('superPanel.i18n.compare.masterValue')" min-width="180" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="(scope.row as any).masterValue !== null && (scope.row as any).masterValue !== undefined">{{ (scope.row as any).masterValue }}</span>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('superPanel.i18n.compare.targetValue')" min-width="180" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="(scope.row as any).targetValue !== null && (scope.row as any).targetValue !== undefined && (scope.row as any).targetValue !== ''">{{ (scope.row as any).targetValue }}</span>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-if="!batchCompareDialog.hasResult" class="batch-compare-empty">
        <el-icon><Document /></el-icon>
        <p>{{ t('superPanel.i18n.compare.emptyTip') }}</p>
      </div>
      <template #footer>
        <el-button @click="batchCompareDialog.visible = false">{{ t('common.close') }}</el-button>
      </template>
    </el-dialog>

    <!-- 新建语言对话框 -->
    <el-dialog v-model="createLanguageDialog.visible" :title="t('superPanel.i18n.createLang.action')" width="550px">
      <el-form :model="createLanguageDialog.form" label-width="180px">
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.translate.source') }}
              <el-tooltip :content="t('superPanel.i18n.translate.sourceTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input :model-value="masterLangDisplay" readonly style="width: 100%" />
          <div class="source-lang-hint">{{ t('superPanel.i18n.createLang.sourceHint') }}</div>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.createLang.code') }}
              <el-tooltip :content="t('superPanel.i18n.createLang.codeTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-select v-model="createLanguageDialog.form.newLangCode" style="width: 100%" :placeholder="t('superPanel.i18n.createLang.codePlaceholder')">
            <el-option v-for="lang in presetLanguages" :key="lang.code" :label="`${(lang as any)[languageDisplayField]} (${lang.code})`" :value="lang.code">
              <span style="display: flex; align-items: center">
                <svg-icon :icon-class="lang.flag || 'global'" style="width: 20px; height: 20px; margin-right: 8px" />
                <span>{{ (lang as any)[languageDisplayField] }} ({{ lang.code }})</span>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.translate.copyValues') }}
              <el-tooltip :content="t('superPanel.i18n.translate.copyValuesTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="createLanguageDialog.form.copyValues" :active-text="t('superPanel.i18n.translate.copyValuesYes')" :inactive-text="t('superPanel.i18n.translate.copyValuesNo')" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.i18n.translate.autoAll') }}
              <el-tooltip :content="t('superPanel.i18n.translate.autoAllTip')" placement="top">
                <el-icon class="label-tip-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="createLanguageDialog.autoTranslate" :active-text="t('common.enabled')" :inactive-text="t('common.disabled')" :disabled="translateManager.state.isTranslating" />
        </el-form-item>
        <el-alert :title="t('superPanel.i18n.createLang.tip')" type="info" :closable="false" show-icon />
      </el-form>
      <template #footer>
        <el-button @click="createLanguageDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="createLanguageDialog.saving" @click="handleCreateLanguage">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <TranslateProgressDialog />
  </div>
</template>

<script setup lang="ts">
/**
 * 国际化（多语言）在线管理：语言文件树形编辑、单/批量自动翻译、字段对比、备份
 * @author GooHv
 */
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { showSuccess, showError, showWarning, showInfo, confirmAction, confirmDelete } from '@/utils/ui/feedback'
import {
  requestGetLanguagesApi,
  requestReadLanguageApi,
  requestSaveLanguageValuesApi,
  requestBackupLanguageApi,
  requestAddNodeApi,
  requestDeleteNodeApi,
  requestGetI18nBackupConfigApi,
  requestSetI18nBackupDirApi,
  requestCreateLanguageApi,
  requestGetLanguageBackupListApi,
  requestDeleteLanguageBackupApi,
  requestGetPresetLanguagesApi
} from '@/api/i18n-manager'
import { requestGetTranslationConfigApi, requestTranslateApi } from '@/api/translation'
import { applyFormat } from '@/utils/business/translationFormat'
import translateManager from '@/utils/business/translateManager'
import SvgIcon from '@/components/SvgIcon/index.vue'
import TranslateProgressDialog from '@/components/TranslateProgressDialog/index.vue'
import {
  Loading, Plus, Check, Download, DocumentCopy, Reading, FolderOpened, Refresh,
  ChatLineRound, Document, Folder, Search, ArrowUp, ArrowDown, Menu, Connection,
  QuestionFilled, Delete, WarningFilled, Pointer
} from '@element-plus/icons-vue'

defineOptions({ name: 'I18nManager' })
const { t } = useI18n()

// ============ 类型 ============
interface LangFile { langCode: string; autonym: string }
interface TreeNode {
  label: string
  keyPath: string
  isLeaf: boolean
  value?: any
  childCount?: number
  children?: TreeNode[]
  isMatch?: boolean
  matchCount?: number
}
interface SearchResult { keyPath: string; label: string; value: any }
interface BackupRow { fileName: string; size: string; createdAt: string }
interface PresetLang { code: string; autonym: string; flag?: string; name?: string }

// ============ 状态 ============
const fileList = ref<LangFile[]>([])
const activeTab = ref<string>('')
const loading = ref(false)
const saving = ref(false)
const masterLanguage = ref('zh-CN')
const languageDisplayField = ref('autonym')
const currentData = ref<Record<string, any> | null>(null)
const selectedKeyPath = ref<string | null>(null)
const selectedIsLeaf = ref(false)
const leafValue = ref('')
const detailList = ref<TreeNode[]>([])
const searchKeyword = ref('')
const searchResults = ref<SearchResult[]>([])
const currentSearchIndex = ref(0)
const searchLoading = ref(false)
let searchTimer: ReturnType<typeof setTimeout> | null = null
const isSearching = ref(false)
const filteredTreeData = ref<TreeNode[]>([])
const treeKey = ref(0)

const mainContentRef = ref<HTMLElement | null>(null)
const i18nTreeRef = ref<any>(null)

const contextMenu = reactive<{ visible: boolean; x: number; y: number; data: any }>({ visible: false, x: 0, y: 0, data: null })

const addDialog = reactive<{
  visible: boolean; saving: boolean; translating: Record<string, boolean>
  mode: string; parentPathArray: Array<string | number>; form: { parentPath: string; key: string; values: Record<string, string> }
}>({
  visible: false, saving: false, translating: {}, mode: 'add', parentPathArray: [],
  form: { parentPath: '', key: '', values: {} }
})
const cascaderOptions = ref<TreeNode[]>([])
const backupConfig = reactive({ backupDir: '', i18nDir: '' })
const backupPathDialog = reactive({ visible: false, newPath: '' })
const backupList = ref<BackupRow[]>([])
const backupListLoading = ref(false)
const batchTranslateDialog = reactive<{ visible: boolean; mode: string; nodePath: string | null; nodeLabel: string }>({ visible: false, mode: 'missing', nodePath: null, nodeLabel: '' })
interface CompareField { keyPath: string; masterValue: any; targetValue: any }
const batchCompareDialog = reactive<{
  visible: boolean; comparing: boolean; hasResult: boolean; masterLangName: string; activeTab: string
  form: { targetLangCode: string }
  stats: { masterTotal: number; targetTotal: number; missingCount: number; extraCount: number; emptyCount: number }
  fields: Record<string, CompareField[]>
}>({
  visible: false, comparing: false, hasResult: false, masterLangName: '', activeTab: 'missing',
  form: { targetLangCode: '' },
  stats: { masterTotal: 0, targetTotal: 0, missingCount: 0, extraCount: 0, emptyCount: 0 },
  fields: { missing: [], extra: [], empty: [] }
})
const createLanguageDialog = reactive<{
  visible: boolean; saving: boolean; autoTranslate: boolean
  form: { sourceLangCode: string; newLangCode: string; copyValues: boolean }
}>({
  visible: false, saving: false, autoTranslate: false,
  form: { sourceLangCode: 'zh-CN', newLangCode: '', copyValues: true }
})
const presetLanguages = ref<PresetLang[]>([])
const detailTranslating = reactive<Record<string, boolean>>({})
const zhData = ref<Record<string, any> | null>(null)
const modifiedKeys = new Set<string>()
const leftPanelWidth = ref(20)
const isResizing = ref(false)
const minLeftWidth = 20
const maxLeftWidth = 60
let loadingFileListPromise: Promise<void> | null = null

// ============ 计算属性 ============
const backupPathTooltip = computed(() => `${t('superPanel.i18n.backup.currentPath')}: ${backupConfig.backupDir}`)
const masterLangDisplay = computed(() => {
  const master = fileList.value.find((f) => f.langCode === masterLanguage.value)
  if (!master) return masterLanguage.value
  const field = languageDisplayField.value || 'autonym'
  return (master as any)[field] || master.autonym || masterLanguage.value
})
const breadcrumbList = computed(() => (selectedKeyPath.value === null ? [] : selectedKeyPath.value.split('.')))

const nodeStats = computed(() => countNodes(currentData.value))
const totalNodeCount = computed(() => nodeStats.value.total)
const totalFolderCount = computed(() => nodeStats.value.folders)
const totalLeafCount = computed(() => nodeStats.value.leaves)

// ============ 生命周期 ============
onMounted(() => {
  init()
  document.addEventListener('click', hideContextMenu)
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextMenu)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  if (searchTimer) clearTimeout(searchTimer)
})

async function init(): Promise<void> {
  await Promise.all([loadFileList(), loadBackupConfig(), loadTranslationConfig(), loadPresetLanguages()])
}

async function loadPresetLanguages(): Promise<void> {
  try {
    const res: any = await requestGetPresetLanguagesApi()
    presetLanguages.value = res.data || []
  } catch { /* 忽略 */ }
}

// ============ 拖拽分隔条 ============
function startResize(e: MouseEvent): void {
  e.preventDefault()
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
function onResize(e: MouseEvent): void {
  if (!isResizing.value || !mainContentRef.value) return
  const rect = mainContentRef.value.getBoundingClientRect()
  let percent = ((e.clientX - rect.left) / rect.width) * 100
  percent = Math.max(minLeftWidth, Math.min(maxLeftWidth, percent))
  leftPanelWidth.value = percent
}
function stopResize(): void {
  if (!isResizing.value) return
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// ============ 文件列表 / 配置 ============
async function loadFileList(retryCount = 0): Promise<void> {
  if (loadingFileListPromise && retryCount === 0) return loadingFileListPromise
  loadingFileListPromise = (async () => {
    try {
      const res: any = await requestGetLanguagesApi()
      fileList.value = res.data || []
      if (activeTab.value && !fileList.value.some((f) => f.langCode === activeTab.value)) {
        activeTab.value = ''
        currentData.value = null
      }
    } catch (err: any) {
      if (err && (err.__CANCEL__ || err.code === 'ERR_CANCELED') && fileList.value.length === 0 && retryCount < 2) {
        await new Promise((r) => setTimeout(r, 300))
        return loadFileList(retryCount + 1)
      }
      if (retryCount < 2) {
        await new Promise((r) => setTimeout(r, 500))
        return loadFileList(retryCount + 1)
      }
      showError(t('superPanel.i18n.common.loadFileListFailed') + (err?.message ? `: ${err.message}` : ''))
    }
  })()
  try {
    return await loadingFileListPromise
  } finally {
    loadingFileListPromise = null
  }
}

async function loadTranslationConfig(): Promise<void> {
  try {
    const res: any = await requestGetTranslationConfigApi()
    if (res?.data) {
      if (res.data.masterLanguage) masterLanguage.value = res.data.masterLanguage
      if (res.data.languageDisplayField) languageDisplayField.value = res.data.languageDisplayField
    }
  } catch { /* 默认 zh-CN */ }
}

async function loadBackupConfig(): Promise<void> {
  try {
    const res: any = await requestGetI18nBackupConfigApi()
    Object.assign(backupConfig, res.data || {})
  } catch { /* 静默 */ }
}

async function handleLangTabClick(langCode: string): Promise<void> {
  if (activeTab.value === langCode) return
  if (modifiedKeys.size > 0) {
    const ok = await confirmAction(t('superPanel.i18n.common.unsavedChanges'), t('common.tip'), { type: 'warning' })
    if (!ok) return
  }
  activeTab.value = langCode
  await loadCurrentFile()
}

async function loadCurrentFile(showL = true): Promise<void> {
  if (!activeTab.value) return
  if (showL) loading.value = true
  modifiedKeys.clear()
  selectedKeyPath.value = null
  detailList.value = []
  try {
    const res: any = await requestReadLanguageApi(activeTab.value)
    if (!res?.data?.data) throw new Error('返回数据格式不正确')
    const i18nData = res.data.data
    currentData.value = i18nData
    if (activeTab.value !== masterLanguage.value) {
      try {
        const masterRes: any = await requestReadLanguageApi(masterLanguage.value)
        if (masterRes?.data?.data) zhData.value = masterRes.data.data
      } catch { /* 忽略 */ }
    } else {
      zhData.value = i18nData
    }
    searchKeyword.value = ''
    isSearching.value = false
    filteredTreeData.value = []
    treeKey.value++
  } catch (err: any) {
    if (showL) showError(t('superPanel.i18n.common.loadFileFailed') + (err?.message ? ': ' + err.message : ''))
  } finally {
    loading.value = false
  }
}

// ============ 树懒加载 ============
function loadNode(node: any, resolve: (nodes: TreeNode[]) => void): void {
  if (!currentData.value) { resolve([]); return }
  const keyPath = node.level === 0 ? '' : node.data.keyPath
  resolve(getChildrenByPath(keyPath))
}

function getChildrenByPath(keyPath: string): TreeNode[] {
  let data: any = currentData.value
  if (keyPath) {
    for (const key of keyPath.split('.')) {
      if (data && data[key] !== undefined) data = data[key]
      else return []
    }
  }
  const result: TreeNode[] = []
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    for (const [key, value] of Object.entries(data)) {
      const childKeyPath = keyPath ? `${keyPath}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result.push({ label: key, keyPath: childKeyPath, isLeaf: false, childCount: Object.keys(value).length })
      } else {
        result.push({ label: key, keyPath: childKeyPath, isLeaf: true, value })
      }
    }
  }
  return result
}

// ============ 节点点击 ============
function handleNodeClick(data: TreeNode): void {
  selectedKeyPath.value = data.keyPath
  selectedIsLeaf.value = data.isLeaf
  if (data.isLeaf) leafValue.value = data.value
  else buildDetailList(data.keyPath)
}
function handleItemClick(item: TreeNode): void {
  selectedKeyPath.value = item.keyPath
  selectedIsLeaf.value = item.isLeaf
  if (item.isLeaf) leafValue.value = item.value
  else {
    buildDetailList(item.keyPath)
    nextTick(() => {
      if (i18nTreeRef.value) {
        const node = i18nTreeRef.value.getNode(item.keyPath)
        if (node) node.expanded = true
      }
    })
  }
}
function buildDetailList(keyPath: string): void {
  detailList.value = getChildrenByPath(keyPath)
}
function handleBreadcrumbClick(index: number): void {
  const path = breadcrumbList.value.slice(0, index + 1).join('.')
  selectedKeyPath.value = path
  selectedIsLeaf.value = false
  buildDetailList(path)
}

// ============ 值修改 ============
function handleValueChange(item: TreeNode): void {
  modifiedKeys.add(item.keyPath)
  updateDataByPath(item.keyPath, item.value)
}
function handleLeafValueChange(): void {
  if (selectedKeyPath.value === null) return
  modifiedKeys.add(selectedKeyPath.value)
  updateDataByPath(selectedKeyPath.value, leafValue.value)
  if (i18nTreeRef.value && selectedKeyPath.value) {
    const node = i18nTreeRef.value.getNode(selectedKeyPath.value)
    if (node?.data) node.data.value = leafValue.value
  }
}
function updateDataByPath(keyPath: string, value: any, targetData: any = null): void {
  const keys = keyPath.split('.')
  let data = targetData || currentData.value
  for (let i = 0; i < keys.length - 1; i++) {
    if (data[keys[i]] === undefined) data[keys[i]] = {}
    data = data[keys[i]]
  }
  data[keys[keys.length - 1]] = value
}
function getValueByPath(data: any, keyPath: string): any {
  if (!data || !keyPath) return ''
  let current = data
  for (const key of keyPath.split('.')) {
    if (current === undefined || current === null) return ''
    current = current[key]
  }
  return current || ''
}

// ============ 删除 ============
async function handleDeleteItem(item: TreeNode): Promise<void> {
  const ok = await confirmAction(`${t('superPanel.i18n.node.confirmDelete')}: ${item.keyPath}`, t('common.tip'), { type: 'warning' })
  if (!ok) return
  try {
    await requestDeleteNodeApi({ langCode: activeTab.value, keyPath: item.keyPath })
    showSuccess(t('superPanel.i18n.common.deleteSuccess'))
    await loadCurrentFile()
  } catch {
    showError(t('superPanel.i18n.common.deleteFailed'))
  }
}

// ============ 搜索 ============
function handleTreeSearch(): void {
  if (searchTimer) clearTimeout(searchTimer)
  if (!searchKeyword.value) {
    searchResults.value = []
    currentSearchIndex.value = 0
    isSearching.value = false
    filteredTreeData.value = []
    return
  }
  searchLoading.value = true
  searchTimer = setTimeout(() => executeSearch(), 300)
}
function executeSearch(): void {
  if (!searchKeyword.value || !currentData.value) {
    searchResults.value = []
    currentSearchIndex.value = 0
    searchLoading.value = false
    isSearching.value = false
    filteredTreeData.value = []
    return
  }
  const keyword = searchKeyword.value.toLowerCase()
  const matches = searchInData(currentData.value, '', keyword)
  searchResults.value = matches
  currentSearchIndex.value = 0
  searchLoading.value = false
  if (matches.length > 0) {
    filteredTreeData.value = buildFilteredTreeData(matches)
    isSearching.value = true
    nextTick(() => nextTick(() => selectSearchResult(0)))
  } else {
    isSearching.value = false
    filteredTreeData.value = []
  }
}
function handleSearchEnter(): void {
  if (searchResults.value.length === 0) return
  selectSearchResult((currentSearchIndex.value + 1) % searchResults.value.length)
}
function prevSearchResult(): void {
  if (currentSearchIndex.value > 0) selectSearchResult(currentSearchIndex.value - 1)
}
function nextSearchResult(): void {
  if (currentSearchIndex.value < searchResults.value.length - 1) selectSearchResult(currentSearchIndex.value + 1)
}
function selectSearchResult(index: number): void {
  if (index < 0 || index >= searchResults.value.length) return
  currentSearchIndex.value = index
  const result = searchResults.value[index]
  if (isSearching.value) {
    nextTick(() => { i18nTreeRef.value?.setCurrentKey(result.keyPath) })
  } else {
    expandNodeByPath(result.keyPath)
  }
  selectedKeyPath.value = result.keyPath
  selectedIsLeaf.value = !isKeyPathFolder(result.keyPath)
  if (selectedIsLeaf.value) leafValue.value = result.value
  else buildDetailList(result.keyPath)
}
function isKeyPathFolder(keyPath: string): boolean {
  let data: any = currentData.value
  for (const key of keyPath.split('.')) {
    if (data && data[key] !== undefined) data = data[key]
    else return false
  }
  return !!(data && typeof data === 'object' && !Array.isArray(data))
}

function countNodes(data: any): { total: number; folders: number; leaves: number } {
  const result = { total: 0, folders: 0, leaves: 0 }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return result
  for (const value of Object.values(data)) {
    result.total++
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const child = countNodes(value)
      result.total += child.total
      result.folders += child.folders + 1
      result.leaves += child.leaves
    } else {
      result.leaves++
    }
  }
  return result
}

function collectLeafNodes(data: any, prefix = ''): SearchResult[] {
  const result: SearchResult[] = []
  if (!data || typeof data !== 'object' || Array.isArray(data)) return result
  for (const [key, value] of Object.entries(data)) {
    const keyPath = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...collectLeafNodes(value, keyPath))
    } else {
      result.push({ keyPath, label: key, value: value || '' })
    }
  }
  return result
}

function buildFilteredTreeData(results: SearchResult[]): TreeNode[] {
  const pathsToShow = new Set<string>()
  const matchPaths = new Set<string>()
  for (const r of results) {
    matchPaths.add(r.keyPath)
    const keys = r.keyPath.split('.')
    for (let i = 1; i <= keys.length; i++) pathsToShow.add(keys.slice(0, i).join('.'))
  }
  const buildTree = (data: any, prefix: string): TreeNode[] => {
    const result: TreeNode[] = []
    if (!data || typeof data !== 'object') return result
    for (const [key, value] of Object.entries(data)) {
      const keyPath = prefix ? `${prefix}.${key}` : key
      if (!pathsToShow.has(keyPath)) continue
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const children = buildTree(value, keyPath)
        let matchCount = 0
        const countMatch = (nodes: TreeNode[]): void => {
          for (const n of nodes) {
            if (n.isMatch) matchCount++
            if (n.children && n.children.length > 0) countMatch(n.children)
          }
        }
        countMatch(children)
        result.push({ label: key, keyPath, isLeaf: false, children, childCount: children.length, isMatch: matchPaths.has(keyPath), matchCount })
      } else {
        result.push({ label: key, keyPath, isLeaf: true, value, isMatch: matchPaths.has(keyPath), matchCount: 0 })
      }
    }
    return result
  }
  return buildTree(currentData.value, '')
}

function searchInData(data: any, prefix: string, keyword: string): SearchResult[] {
  const results: SearchResult[] = []
  if (!data || typeof data !== 'object' || Array.isArray(data)) return results
  for (const [key, value] of Object.entries(data)) {
    const keyPath = prefix ? `${prefix}.${key}` : key
    if (typeof key === 'string' && key.toLowerCase().includes(keyword)) {
      results.push({ keyPath, label: key, value })
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      results.push(...searchInData(value, keyPath, keyword))
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      if (String(value).toLowerCase().includes(keyword) && !results.find((r) => r.keyPath === keyPath)) {
        results.push({ keyPath, label: key, value })
      }
    }
  }
  return results
}

function expandNodeByPath(keyPath: string): void {
  if (!i18nTreeRef.value) return
  const keys = keyPath.split('.')
  let currentPath = ''
  const expandNext = (index: number): void => {
    if (index >= keys.length) return
    currentPath = currentPath ? `${currentPath}.${keys[index]}` : keys[index]
    const node = i18nTreeRef.value.getNode(currentPath)
    if (node) {
      node.expanded = true
      nextTick(() => expandNext(index + 1))
    } else {
      setTimeout(() => expandNext(index), 100)
    }
  }
  expandNext(0)
}

// ============ 保存 / 备份 ============
async function handleSave(): Promise<void> {
  if (modifiedKeys.size === 0) {
    showInfo(t('superPanel.i18n.common.noChanges'))
    return
  }
  saving.value = true
  try {
    await requestSaveLanguageValuesApi(activeTab.value, currentData.value || {})
    showSuccess(t('superPanel.i18n.common.saveSuccess'))
    modifiedKeys.clear()
  } catch {
    showError(t('superPanel.i18n.common.saveFailed'))
  } finally {
    saving.value = false
  }
}

async function handleBackup(): Promise<void> {
  try {
    await requestBackupLanguageApi(activeTab.value)
    showSuccess(t('superPanel.i18n.backup.success'))
  } catch {
    showError(t('superPanel.i18n.backup.failed'))
  }
}

function openBackupPathDialog(): void {
  backupPathDialog.newPath = backupConfig.backupDir
  backupPathDialog.visible = true
}
async function handleSetBackupPath(): Promise<void> {
  if (!backupPathDialog.newPath) {
    showWarning(t('superPanel.i18n.node.pathNotEmpty'))
    return
  }
  try {
    await requestSetI18nBackupDirApi(backupPathDialog.newPath)
    backupConfig.backupDir = backupPathDialog.newPath
    showSuccess(t('superPanel.i18n.backup.setPathSuccess'))
    backupPathDialog.visible = false
  } catch {
    showError(t('superPanel.i18n.backup.setPathFailed'))
  }
}

async function loadBackupList(): Promise<void> {
  backupListLoading.value = true
  try {
    const res: any = await requestGetLanguageBackupListApi('')
    if (res?.data && Array.isArray(res.data)) {
      backupList.value = res.data.map((item: any) => ({
        ...item,
        size: formatFileSize(item.size),
        createdAt: formatDateTime(item.createdAt)
      }))
    } else backupList.value = []
  } catch {
    backupList.value = []
  } finally {
    backupListLoading.value = false
  }
}

async function handleDeleteBackup(fileName: string): Promise<void> {
  const ok = await confirmDelete(`${t('superPanel.i18n.backup.deleteConfirm')}: ${fileName}`)
  if (!ok) return
  try {
    await requestDeleteLanguageBackupApi(fileName)
    showSuccess(t('superPanel.i18n.backup.deleteSuccess'))
    await loadBackupList()
  } catch {
    showError(t('superPanel.i18n.backup.deleteFailed'))
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes && bytes !== 0) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const pad = (n: number) => (n < 10 ? '0' + n : String(n))
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// ============ 批量翻译 / 对比 ============
function openBatchTranslateDialog(): void {
  if (translateManager.state.isTranslating) {
    showWarning(t('superPanel.i18n.translate.inProgressTip'))
    return
  }
  batchTranslateDialog.visible = true
  batchTranslateDialog.mode = 'missing'
  batchTranslateDialog.nodePath = null
  batchTranslateDialog.nodeLabel = ''
}

function openBatchCompareDialog(): void {
  if (translateManager.state.isTranslating) {
    showWarning(t('superPanel.i18n.translate.inProgressTip'))
    return
  }
  const masterFile = fileList.value.find((f) => f.langCode === masterLanguage.value)
  batchCompareDialog.masterLangName = masterFile ? masterFile.autonym : masterLanguage.value
  if (activeTab.value && activeTab.value !== masterLanguage.value) {
    batchCompareDialog.form.targetLangCode = activeTab.value
  } else {
    const firstNonMaster = fileList.value.find((f) => f.langCode !== masterLanguage.value)
    batchCompareDialog.form.targetLangCode = firstNonMaster ? firstNonMaster.langCode : ''
  }
  batchCompareDialog.hasResult = false
  batchCompareDialog.comparing = false
  batchCompareDialog.activeTab = 'missing'
  batchCompareDialog.stats = { masterTotal: 0, targetTotal: 0, missingCount: 0, extraCount: 0, emptyCount: 0 }
  batchCompareDialog.fields = { missing: [], extra: [], empty: [] }
  batchCompareDialog.visible = true
}

async function handleStartCompare(): Promise<void> {
  if (!batchCompareDialog.form.targetLangCode) {
    showWarning(t('superPanel.i18n.compare.selectLanguage'))
    return
  }
  batchCompareDialog.comparing = true
  try {
    const masterRes: any = await requestReadLanguageApi(masterLanguage.value)
    const masterData = masterRes?.data?.data || {}
    const targetRes: any = await requestReadLanguageApi(batchCompareDialog.form.targetLangCode)
    const targetData = targetRes?.data?.data || {}
    const result = compareLanguageFiles(masterData, targetData)
    batchCompareDialog.stats = {
      masterTotal: result.masterTotal,
      targetTotal: result.targetTotal,
      missingCount: result.missingFields.length,
      extraCount: result.extraFields.length,
      emptyCount: result.emptyFields.length
    }
    batchCompareDialog.fields.missing = result.missingFields
    batchCompareDialog.fields.extra = result.extraFields
    batchCompareDialog.fields.empty = result.emptyFields
    batchCompareDialog.hasResult = true
    showSuccess(t('superPanel.i18n.compare.success'))
  } catch (error: any) {
    showError(t('superPanel.i18n.compare.failed') + ': ' + (error?.message || ''))
  } finally {
    batchCompareDialog.comparing = false
  }
}

interface CompareResult {
  masterTotal: number; targetTotal: number; missingFields: CompareField[]; extraFields: CompareField[]; emptyFields: CompareField[]
}
function compareLanguageFiles(masterData: any, targetData: any): CompareResult {
  const masterLeaves = collectLeafNodes(masterData)
  const targetLeaves = collectLeafNodes(targetData)
  const masterKeySet = new Set(masterLeaves.map((n) => n.keyPath))
  const targetKeySet = new Set(targetLeaves.map((n) => n.keyPath))
  const targetValueMap = new Map(targetLeaves.map((n) => [n.keyPath, n.value]))
  const missingFields = masterLeaves.filter((n) => !targetKeySet.has(n.keyPath)).map((n) => ({ keyPath: n.keyPath, masterValue: n.value, targetValue: null }))
  const extraFields = targetLeaves.filter((n) => !masterKeySet.has(n.keyPath)).map((n) => ({ keyPath: n.keyPath, masterValue: null, targetValue: n.value }))
  const emptyFields = masterLeaves
    .filter((n) => {
      if (!targetKeySet.has(n.keyPath)) return false
      const tv = targetValueMap.get(n.keyPath)
      return n.value && (!tv || String(tv).trim() === '')
    })
    .map((n) => ({ keyPath: n.keyPath, masterValue: n.value, targetValue: targetValueMap.get(n.keyPath) || '' }))
  return { masterTotal: masterLeaves.length, targetTotal: targetLeaves.length, missingFields, extraFields, emptyFields }
}

function handleCopyReport(): void {
  const active = batchCompareDialog.activeTab
  const fields = batchCompareDialog.fields[active] || []
  if (fields.length === 0) {
    showWarning(t('superPanel.i18n.compare.noContentToCopy'))
    return
  }
  const lines: string[] = [`// report (${fields.length})`, '']
  fields.forEach((field: any, index: number) => {
    lines.push(`// [${index + 1}] ${field.keyPath}`)
    if (field.masterValue !== null && field.masterValue !== undefined) lines.push(`//   master: ${JSON.stringify(field.masterValue)}`)
    if (field.targetValue !== null && field.targetValue !== undefined && field.targetValue !== '') lines.push(`//   target: ${JSON.stringify(field.targetValue)}`)
    lines.push(`"${field.keyPath}": "",`)
    lines.push('')
  })
  const textarea = document.createElement('textarea')
  textarea.value = lines.join('\n')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand('copy')
    showSuccess(t('common.copySuccess'))
  } catch {
    showError(t('common.copyFailed'))
  } finally {
    document.body.removeChild(textarea)
  }
}

function handleNodeTranslate(): void {
  hideContextMenu()
  let data: any = contextMenu.data
  if (data && !data.keyPath && data.data?.keyPath) data = data.data
  if (!data || data.isLeaf) {
    showWarning(t('superPanel.i18n.translate.nodeLeafTip'))
    return
  }
  if (!data.keyPath) {
    showError(t('superPanel.i18n.translate.nodeKeyPathMissing'))
    return
  }
  batchTranslateDialog.visible = true
  batchTranslateDialog.mode = 'all'
  batchTranslateDialog.nodePath = data.keyPath
  batchTranslateDialog.nodeLabel = data.label
}

async function confirmBatchTranslate(): Promise<void> {
  batchTranslateDialog.visible = false
  const targetLangCode = activeTab.value
  const currentFile = fileList.value.find((f) => f.langCode === targetLangCode)
  const targetLangName = currentFile ? currentFile.autonym : targetLangCode
  await batchTranslateLanguage(targetLangCode, targetLangName, batchTranslateDialog.mode, batchTranslateDialog.nodePath, batchTranslateDialog.nodeLabel)
}

// ============ 新建语言 ============
function openCreateLanguageDialog(): void {
  createLanguageDialog.visible = true
  createLanguageDialog.form = { sourceLangCode: masterLanguage.value, newLangCode: '', copyValues: true }
}

async function handleCreateLanguage(): Promise<void> {
  if (translateManager.state.isTranslating && createLanguageDialog.autoTranslate) {
    showWarning(t('superPanel.i18n.translate.inProgressTip'))
    return
  }
  const { sourceLangCode, newLangCode, copyValues } = createLanguageDialog.form
  if (!sourceLangCode) { showWarning(t('superPanel.i18n.translate.sourceNotEmpty')); return }
  if (!newLangCode) { showWarning(t('superPanel.i18n.createLang.codeNotEmpty')); return }
  createLanguageDialog.saving = true
  try {
    await requestCreateLanguageApi({ sourceLangCode, newLangCode, copyValues })
    showSuccess(t('superPanel.i18n.createLang.success'))
    await loadFileList()
    createLanguageDialog.visible = false
    if (createLanguageDialog.autoTranslate) {
      const preset = presetLanguages.value.find((l) => l.code === newLangCode)
      const targetLangName = preset ? preset.autonym : newLangCode
      activeTab.value = newLangCode
      await loadCurrentFile()
      await batchTranslateLanguage(newLangCode, targetLangName)
    }
  } catch {
    showError(t('superPanel.i18n.createLang.failed'))
  } finally {
    createLanguageDialog.saving = false
  }
}

async function batchTranslateLanguage(targetLangCode: string, targetLangName: string, mode = 'all', nodePath: string | null = null, nodeLabel = ''): Promise<void> {
  loading.value = false
  try {
    const masterRes: any = await requestReadLanguageApi(masterLanguage.value)
    if (!masterRes?.data?.data) {
      showError(t('superPanel.i18n.translate.failed'))
      return
    }
    const masterData = masterRes.data.data
    let leafNodes: SearchResult[]
    if (nodePath) {
      const nodeData = getValueByPath(masterData, nodePath)
      if (!nodeData || typeof nodeData !== 'object' || Array.isArray(nodeData)) {
        showWarning(t('superPanel.i18n.translate.nodeNoContent'))
        return
      }
      leafNodes = collectLeafNodes(nodeData, nodePath)
    } else {
      leafNodes = collectLeafNodes(masterData)
    }
    if (leafNodes.length === 0) {
      showWarning(t('superPanel.i18n.translate.noContent'))
      return
    }
    translateManager.startTranslate(targetLangCode, targetLangName, leafNodes.length, nodePath, nodeLabel)
    const targetRes: any = await requestReadLanguageApi(targetLangCode)
    if (!targetRes?.data?.data) {
      translateManager.finishTranslate(false, t('superPanel.i18n.translate.failed'))
      return
    }
    const targetData = targetRes.data.data
    let successCount = 0
    let failCount = 0
    const failItems: string[] = []
    for (let i = 0; i < leafNodes.length; i++) {
      if (translateManager.state.isCancelled) break
      const node = leafNodes[i]
      if (!node.value) continue
      if (mode === 'missing') {
        const existing = getValueByPath(targetData, node.keyPath)
        if (existing && String(existing).trim() !== '') continue
      }
      translateManager.updateProgress(i + 1, successCount, failCount, node.keyPath, node.value)
      try {
        const res: any = await requestTranslateApi(node.value, masterLanguage.value, targetLangCode)
        if (res?.data?.result) {
          const formatted = applyFormat(res.data.result, 'title')
          updateDataByPath(node.keyPath, formatted, targetData)
          successCount++
        } else {
          failCount++
          failItems.push(node.keyPath)
          translateManager.addFailItem(node.keyPath)
        }
      } catch (err: any) {
        if (err && (err.__CANCEL__ || err.code === 'ERR_CANCELED')) continue
        failCount++
        failItems.push(node.keyPath)
        translateManager.addFailItem(node.keyPath)
      }
    }
    translateManager.updateProgress(leafNodes.length, successCount, failCount, '', '')
    try {
      await requestSaveLanguageValuesApi(targetLangCode, targetData)
      const successMessage = t('superPanel.i18n.translate.batchSuccess', { lang: targetLangName, success: successCount, fail: failCount })
      if (translateManager.state.isCancelled) {
        const cancelMessage = t('superPanel.i18n.translate.cancelled', { lang: targetLangName, completed: successCount, fail: failCount })
        translateManager.finishTranslate(false, cancelMessage)
      } else {
        translateManager.finishTranslate(true, successMessage)
      }
      showSuccess(successMessage)
    } catch {
      const msg = t('superPanel.i18n.translate.saveFailed')
      translateManager.finishTranslate(false, msg)
      showError(msg)
    }
  } catch {
    const msg = t('superPanel.i18n.translate.failed')
    translateManager.finishTranslate(false, msg)
    showError(msg)
  }
}

// ============ 右键菜单 ============
function showContextMenu(event: Event, data: any, node?: any): void {
  const evt = event as MouseEvent
  let realData = data
  if (data && !data.keyPath && data.data?.keyPath) realData = data.data
  else if (node && !node.keyPath && node.data?.keyPath) realData = node.data
  contextMenu.visible = true
  contextMenu.x = evt.clientX
  contextMenu.y = evt.clientY
  contextMenu.data = realData
}
function hideContextMenu(): void {
  contextMenu.visible = false
}
function handleAddChild(): void {
  const data = contextMenu.data
  hideContextMenu()
  if (!data || data.isLeaf) {
    showWarning(t('superPanel.i18n.node.cannotAddChildToLeaf'))
    return
  }
  openAddDialog('addChild', data.keyPath)
}
function handleAddSibling(): void {
  const data = contextMenu.data
  hideContextMenu()
  if (!data) return
  const parentPath = String(data.keyPath).split('.').slice(0, -1).join('.')
  openAddDialog('addSibling', parentPath)
}
async function handleDeleteNode(): Promise<void> {
  const data = contextMenu.data
  hideContextMenu()
  if (!data) return
  const ok = await confirmAction(`${t('superPanel.i18n.node.confirmDelete')}: ${data.keyPath}`, t('common.tip'), { type: 'warning' })
  if (!ok) return
  try {
    await requestDeleteNodeApi({ langCode: activeTab.value, keyPath: data.keyPath })
    showSuccess(t('superPanel.i18n.common.deleteSuccess'))
    await loadCurrentFile()
  } catch {
    showError(t('superPanel.i18n.common.deleteFailed'))
  }
}

// ============ 新增配置 ============
function openAddDialog(mode = 'add', parentPath = ''): void {
  addDialog.mode = mode
  const values: Record<string, string> = {}
  for (const file of fileList.value) values[file.langCode] = ''
  addDialog.form = { parentPath, key: '', values }
  addDialog.translating = {}
  cascaderOptions.value = buildCascaderOptionsFromData(currentData.value, '')
  addDialog.parentPathArray = parentPath ? parentPath.split('.') : []
  addDialog.visible = true
}
function buildCascaderOptionsFromData(data: any, prefix: string): TreeNode[] {
  const result: TreeNode[] = []
  if (!data || typeof data !== 'object') return result
  for (const [key, value] of Object.entries(data)) {
    const keyPath = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push({ label: key, keyPath, isLeaf: false, children: buildCascaderOptionsFromData(value, keyPath) })
    }
  }
  return result
}
function handleParentPathChange(value: any): void {
  addDialog.form.parentPath = value && value.length > 0 ? value.join('.') : ''
}
async function handleAddConfig(): Promise<void> {
  const { parentPath, key, values } = addDialog.form
  if (!key) { showWarning(t('superPanel.i18n.field.keyNotEmpty')); return }
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
    showWarning(t('superPanel.i18n.field.keyInvalid'))
    return
  }
  addDialog.saving = true
  try {
    for (const file of fileList.value) {
      const value = values[file.langCode] || ''
      await requestAddNodeApi({ langCode: file.langCode, parentPath, key, value })
    }
    showSuccess(t('superPanel.i18n.common.addSuccess'))
    addDialog.visible = false
    await loadCurrentFile()
  } catch {
    showError(t('superPanel.i18n.common.addFailed'))
  } finally {
    addDialog.saving = false
  }
}

// ============ 自动翻译 ============
async function autoTranslate(targetLangCode: string, format = 'title'): Promise<void> {
  const sourceText = addDialog.form.values[masterLanguage.value]
  if (!sourceText) {
    showWarning(t('superPanel.i18n.translate.sourceEmpty'))
    return
  }
  addDialog.translating[targetLangCode] = true
  try {
    const res: any = await requestTranslateApi(sourceText, masterLanguage.value, targetLangCode)
    if (res?.data?.result) {
      addDialog.form.values[targetLangCode] = applyFormat(res.data.result, format)
      showSuccess(t('superPanel.i18n.translate.success'))
    } else {
      showWarning(t('superPanel.i18n.translate.failed'))
    }
  } catch {
    showError(t('superPanel.i18n.translate.failed'))
  } finally {
    addDialog.translating[targetLangCode] = false
  }
}

async function autoTranslateDetailItem(item: TreeNode, format = 'title'): Promise<void> {
  const sourceText = getValueByPath(zhData.value, item.keyPath)
  if (!sourceText) {
    showError(`${t('superPanel.i18n.translate.zhNotFound')}: ${item.keyPath}`)
    return
  }
  detailTranslating[item.keyPath] = true
  try {
    const res: any = await requestTranslateApi(sourceText, masterLanguage.value, activeTab.value)
    if (res?.data?.result) {
      const formatted = applyFormat(res.data.result, format)
      updateDataByPath(item.keyPath, formatted)
      item.value = formatted
      modifiedKeys.add(item.keyPath)
      showSuccess(`${t('superPanel.i18n.translate.success')}: 「${sourceText}」→ 「${formatted}」`)
    } else {
      showWarning(t('superPanel.i18n.translate.failed'))
    }
  } catch {
    showError(t('superPanel.i18n.translate.failed'))
  } finally {
    detailTranslating[item.keyPath] = false
  }
}
</script>

<style scoped>
.i18n-manager-container { padding: 20px; height: 100%; box-sizing: border-box; }
.readonly-path-input :deep(.el-input__inner) { background-color: #f5f7fa !important; color: #909399 !important; cursor: not-allowed !important; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding: 16px 20px; background: #fff; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); }
.header-left .page-title { margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #303133; }
.header-left .page-desc { font-size: 13px; color: #909399; }
.header-right { display: flex; gap: 8px; flex-wrap: wrap; }
.main-wrapper { background: #fff; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); min-height: calc(100vh - 180px); overflow: hidden; }
.lang-tabs { display: flex; gap: 4px; padding: 12px 16px 0 16px; border-bottom: 1px solid #e4e7ed; background: #fafafa; }
.lang-tab-item { display: flex; align-items: center; gap: 6px; padding: 10px 20px; font-size: 14px; color: #606266; cursor: pointer; border: 1px solid transparent; border-bottom: none; border-radius: 4px 4px 0 0; transition: all 0.2s; margin-bottom: -1px; }
.lang-tab-item:hover { color: #409eff; background: #ecf5ff; }
.lang-tab-item.active { color: #409eff; background: #fff; border-color: #e4e7ed; font-weight: 500; }
.language-empty-tip { padding: 80px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; }
.language-empty-tip .tip-icon { width: 80px; height: 80px; border-radius: 50%; background: #ecf5ff; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.language-empty-tip .tip-icon .el-icon { font-size: 40px; color: #409eff; }
.tip-title { margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #303133; }
.tip-desc { margin: 0 0 32px 0; font-size: 14px; color: #909399; text-align: center; max-width: 500px; }
.tip-language-list { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
.language-card { display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: #f5f7fa; border: 1px solid #e4e7ed; border-radius: 4px; cursor: pointer; transition: all 0.3s; font-size: 14px; color: #606266; }
.language-card:hover { background: #ecf5ff; border-color: #409eff; color: #409eff; transform: translateY(-2px); box-shadow: 0 4px 12px 0 rgba(64,158,255,0.2); }
.editor-area { padding: 16px; }
.main-content { display: flex; min-height: calc(100vh - 300px); }
.resizer { width: 8px; cursor: col-resize; position: relative; display: flex; align-items: center; justify-content: center; transition: background 0.2s; flex-shrink: 0; }
.resizer:hover, .resizer.dragging { background: #ecf5ff; }
.resizer-handle { display: flex; flex-direction: column; gap: 3px; padding: 8px 2px; border-radius: 2px; }
.resizer:hover .resizer-handle, .resizer.dragging .resizer-handle { background: #409eff; }
.resizer-dot { width: 4px; height: 4px; border-radius: 50%; background: #c0c4cc; }
.tree-panel { min-width: 200px; border: 1px solid #ebeef5; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.panel-header { padding: 12px; border-bottom: 1px solid #ebeef5; background: #fafafa; }
.tree-search { width: 100%; }
.search-toolbar { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding: 6px 8px; background: #ecf5ff; border-radius: 4px; }
.search-count-text { font-size: 12px; color: #409eff; font-weight: 500; }
.search-no-result { margin-top: 8px; padding: 6px 8px; background: #fdf6ec; border-radius: 4px; text-align: center; }
.search-no-result span { font-size: 12px; color: #e6a23c; }
.tree-container { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; }
.tree-footer { display: flex; align-items: center; justify-content: space-around; padding: 10px 8px; margin-top: 8px; background: #f5f7fa; border-top: 1px solid #ebeef5; border-radius: 0 0 4px 4px; flex-shrink: 0; }
.footer-stat { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #909399; }
.footer-stat.footer-total { color: #409eff; font-weight: 500; }
.custom-tree-node { flex: 1; display: flex; align-items: center; gap: 6px; padding-right: 8px; font-size: 13px; }
.tree-node-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-node-count { color: #909399; font-size: 12px; }
.match-node { color: #f56c6c; font-weight: bold; }
.parent-match-node { color: #e6a23c; }
.match-badge { display: inline-block; padding: 0 6px; background: #f56c6c; color: #fff; font-size: 10px; border-radius: 2px; line-height: 16px; margin-left: 4px; }
.match-count-badge { display: inline-block; padding: 0 6px; background: #fdf6ec; color: #e6a23c; border: 1px solid #f5dab1; font-size: 10px; border-radius: 2px; line-height: 14px; margin-left: 4px; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: #909399; }
.empty-state .el-icon, .empty-list .el-icon { font-size: 48px; margin-bottom: 16px; }
.detail-panel { flex: 1; border: 1px solid #ebeef5; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.breadcrumb-bar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebeef5; background: #fafafa; gap: 8px; }
.breadcrumb-label { font-size: 13px; color: #606266; flex-shrink: 0; }
.breadcrumb-actions { margin-left: auto; }
.breadcrumb-bar :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) { color: #409eff; font-weight: 500; }
.breadcrumb-bar :deep(.el-breadcrumb__inner.clickable) { cursor: pointer; color: #606266; }
.breadcrumb-bar :deep(.el-breadcrumb__inner.clickable:hover) { color: #409eff; }
.leaf-editor { padding: 20px; }
.leaf-info { margin-bottom: 12px; }
.leaf-key { font-size: 14px; font-weight: 500; color: #303133; background: #ecf5ff; padding: 4px 12px; border-radius: 4px; display: inline-block; }
.detail-list { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.list-header { display: flex; align-items: center; padding: 10px 16px; background: #f5f7fa; border-bottom: 1px solid #ebeef5; font-size: 13px; font-weight: 600; color: #606266; }
.header-key { width: 30%; flex-shrink: 0; }
.header-value { flex: 1; }
.header-actions { width: 160px; text-align: right; flex-shrink: 0; }
.list-body { flex: 1; overflow-y: auto; }
.list-item { display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid #f0f2f5; transition: background 0.2s; }
.list-item:hover { background: #f5f7fa; }
.list-item.modified { background: #fdf6ec; }
.item-key { width: 30%; flex-shrink: 0; display: flex; align-items: center; gap: 6px; font-size: 13px; color: #303133; cursor: pointer; overflow: hidden; }
.item-key:hover { color: #409eff; }
.item-value { flex: 1; padding-right: 16px; }
.item-value-folder { color: #909399; font-size: 13px; cursor: pointer; }
.item-value-folder:hover { color: #409eff; }
.item-actions { width: 160px; text-align: right; flex-shrink: 0; }
.delete-btn { color: #f56c6c; }
.empty-list { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: #909399; }
.detail-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #909399; }
.detail-empty .el-icon { font-size: 48px; margin-bottom: 16px; }
.context-menu { position: fixed; z-index: 9999; list-style: none; margin: 0; padding: 6px 0; background: #fff; border: 1px solid #e4e7ed; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); min-width: 140px; }
.context-menu li { padding: 8px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #606266; transition: background 0.2s; }
.context-menu li:hover { background: #f5f7fa; color: #409eff; }
.context-menu li.danger:hover { background: #fef0f0; color: #f56c6c; }
.context-menu li.disabled { opacity: 0.5; cursor: not-allowed; }
.context-menu li.divider { padding: 0; margin: 4px 0; border-top: 1px solid #ebeef5; cursor: default; }
.context-menu li.divider:hover { background: transparent; }
</style>
