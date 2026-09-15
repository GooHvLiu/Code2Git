<template>
  <div class="i18n-manager-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("superPanel.i18n.page.title") }}
        </h2>
        <span class="page-desc">{{
          $t("superPanel.i18n.page.desc")
        }}</span>
      </div>
      <div class="header-right">
        <!-- 翻译状态按钮（翻译进行时显示） -->
        <el-button
          v-if="translateManager.state.isTranslating"
          type="info"
          size="small"
          icon="el-icon-loading"
          @click="translateManager.showDialog()"
        >
          {{ $t("superPanel.i18n.translate.status") }}
          {{ translateManager.getProgressPercent() }}%
        </el-button>
        <el-button
          type="warning"
          size="small"
          icon="el-icon-plus"
          @click="openCreateLanguageDialog"
        >
          {{ $t("superPanel.i18n.createLang.action") }}
        </el-button>
        <el-button
          type="success"
          size="small"
          icon="el-icon-check"
          :loading="saving"
          :disabled="!activeTab"
          @click="handleSave"
        >
          {{ $t("common.save") }}
        </el-button>
        <el-tooltip
          :content="$t('superPanel.i18n.backup.action')"
          placement="bottom"
        >
          <el-button
            size="small"
            icon="el-icon-download"
            :disabled="!activeTab"
            @click="handleBackup"
            circle
          ></el-button>
        </el-tooltip>
        <!-- 批量对比字段按钮（图标按钮，非母版语言且未在翻译时显示） -->
        <el-tooltip
          v-if="
            activeTab &&
            activeTab !== masterLanguage &&
            !translateManager.state.isTranslating
          "
          :content="$t('superPanel.i18n.compare.batch')"
          placement="bottom"
        >
          <el-button
            size="small"
            icon="el-icon-document-copy"
            @click="openBatchCompareDialog"
            circle
          ></el-button>
        </el-tooltip>
        <!-- 批量翻译当前语言按钮（图标按钮，非母版语言且未在翻译时显示） -->
        <el-tooltip
          v-if="
            activeTab &&
            activeTab !== masterLanguage &&
            !translateManager.state.isTranslating
          "
          :content="$t('superPanel.i18n.translate.batch')"
          placement="bottom"
        >
          <el-button
            size="small"
            icon="el-icon-reading"
            @click="openBatchTranslateDialog"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip :content="backupPathTooltip" placement="bottom">
          <el-button
            size="small"
            icon="el-icon-folder-opened"
            @click="openBackupPathDialog"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip :content="$t('common.refresh')" placement="bottom">
          <el-button
            size="small"
            icon="el-icon-refresh"
            :disabled="!activeTab"
            @click="loadCurrentFile"
            circle
          ></el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="main-wrapper">
      <!-- 自定义语言 Tab 栏 -->
      <div class="lang-tabs">
        <div
          v-for="file in fileList"
          :key="file.langCode"
          class="lang-tab-item"
          :class="{ active: activeTab === file.langCode }"
          @click="handleLangTabClick(file.langCode)"
        >
          <i class="el-icon-chat-line-round"></i>
          <span>{{ file.autonym }}</span>
        </div>
      </div>

      <!-- 未选择语言时的提示区域 -->
      <div v-if="!activeTab" class="language-empty-tip">
        <div class="tip-icon">
          <i class="el-icon-document"></i>
        </div>
        <h3 class="tip-title">
          {{ $t("superPanel.i18n.createLang.selectTitle") }}
        </h3>
        <p class="tip-desc">
          {{ $t("superPanel.i18n.createLang.selectDesc") }}
        </p>
        <div class="tip-language-list">
          <div
            v-for="file in fileList"
            :key="file.langCode"
            class="language-card"
            @click="handleLangTabClick(file.langCode)"
          >
            <i class="el-icon-chat-line-round"></i>
            <span>{{ file.autonym }}</span>
          </div>
        </div>
      </div>

      <!-- 已选择语言时的编辑区域 -->
      <div
        v-else
        class="editor-area"
        v-loading="loading"
        :element-loading-text="$t('common.loading')"
      >
        <!-- 左右分栏 -->
        <div class="main-content" ref="mainContent">
          <!-- 左边：树形导航区 -->
          <div class="tree-panel" :style="{ width: leftPanelWidth + '%' }">
            <div class="panel-header">
              <el-input
                v-model="searchKeyword"
                :placeholder="
                  $t('superPanel.i18n.field.searchPlaceholder')
                "
                prefix-icon="el-icon-search"
                clearable
                size="small"
                class="tree-search"
                @input="handleTreeSearch"
                @keyup.enter.native="handleSearchEnter"
              />
              <!-- 搜索结果工具栏 -->
              <div
                class="search-toolbar"
                v-if="searchKeyword && searchResults.length > 0"
              >
                <span class="search-count-text"
                  >{{ currentSearchIndex + 1 }} /
                  {{ searchResults.length }}</span
                >
                <el-button-group size="mini">
                  <el-button
                    icon="el-icon-arrow-up"
                    @click="prevSearchResult"
                    :disabled="currentSearchIndex === 0"
                  ></el-button>
                  <el-button
                    icon="el-icon-arrow-down"
                    @click="nextSearchResult"
                    :disabled="currentSearchIndex === searchResults.length - 1"
                  ></el-button>
                </el-button-group>
              </div>
              <div
                class="search-no-result"
                v-if="
                  searchKeyword && searchResults.length === 0 && !searchLoading
                "
              >
                <span>{{
                  $t("superPanel.i18n.field.noData")
                }}</span>
              </div>
            </div>
            <div class="tree-container">
              <el-tree
                ref="i18nTree"
                :load="isSearching ? undefined : loadNode"
                :lazy="!isSearching"
                :data="isSearching ? filteredTreeData : undefined"
                node-key="keyPath"
                :props="{
                  label: 'label',
                  children: 'children',
                  isLeaf: 'isLeaf',
                }"
                :expand-on-click-node="false"
                :highlight-current="true"
                :default-expand-all="isSearching"
                class="i18n-tree"
                @node-click="handleNodeClick"
                @node-contextmenu="showContextMenu"
              >
                <span slot-scope="{ data }" class="custom-tree-node">
                  <i
                    :class="data.isLeaf ? 'el-icon-document' : 'el-icon-folder'"
                  ></i>
                  <span
                    class="tree-node-label"
                    :class="{
                      'match-node': isSearching && data.isMatch,
                      'parent-match-node':
                        isSearching && !data.isMatch && data.matchCount > 0,
                    }"
                    >{{ data.label }}</span
                  >
                  <span
                    class="tree-node-count"
                    v-if="!data.isLeaf && data.childCount !== undefined"
                    >({{ data.childCount }})</span
                  >
                  <!-- 搜索状态下，匹配节点显示匹配标识 -->
                  <span class="match-badge" v-if="isSearching && data.isMatch"
                    >匹配</span
                  >
                  <!-- 搜索状态下，中间父节点显示匹配子节点数量 -->
                  <span
                    class="match-count-badge"
                    v-if="isSearching && !data.isMatch && data.matchCount > 0"
                    >含 {{ data.matchCount }} 个匹配</span
                  >
                </span>
              </el-tree>
              <div class="empty-state" v-if="!loading && !currentData">
                <i class="el-icon-folder-opened"></i>
                <p>{{ $t("superPanel.i18n.field.noData") }}</p>
              </div>
              <!-- 统计栏 -->
              <div class="tree-footer" v-if="currentData && !loading">
                <span class="footer-stat">
                  <i class="el-icon-folder"></i>
                  {{ totalFolderCount }}
                  {{ $t("superPanel.i18n.node.folders") }}
                </span>
                <span class="footer-stat">
                  <i class="el-icon-document"></i>
                  {{ totalLeafCount }}
                  {{ $t("superPanel.i18n.node.items") }}
                </span>
                <span class="footer-stat footer-total">
                  <i class="el-icon-menu"></i>
                  {{ totalNodeCount }}
                  {{ $t("superPanel.i18n.compare.total") }}
                </span>
              </div>
            </div>
          </div>

          <!-- 可拖拽分隔条 -->
          <div
            class="resizer"
            :class="{ dragging: isResizing }"
            @mousedown="startResize"
          >
            <div class="resizer-handle">
              <span class="resizer-dot"></span>
              <span class="resizer-dot"></span>
              <span class="resizer-dot"></span>
            </div>
          </div>

          <!-- 右边：详情编辑区 -->
          <div class="detail-panel">
            <!-- 面包屑路径 -->
            <div class="breadcrumb-bar" v-if="selectedKeyPath !== null">
              <span class="breadcrumb-label"
                >{{
                  $t("superPanel.i18n.backup.currentPath")
                }}:</span
              >
              <el-breadcrumb separator="/">
                <el-breadcrumb-item
                  v-for="(item, index) in breadcrumbList"
                  :key="index"
                  :class="{ clickable: index < breadcrumbList.length - 1 }"
                  @click.native="handleBreadcrumbClick(index)"
                >
                  {{ item }}
                </el-breadcrumb-item>
              </el-breadcrumb>
              <div class="breadcrumb-actions">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  @click="openAddDialog('addChild', selectedKeyPath)"
                >
                  {{ $t("superPanel.i18n.node.addChild") }}
                </el-button>
              </div>
            </div>

            <!-- 叶子节点编辑区 -->
            <div class="leaf-editor" v-if="selectedIsLeaf">
              <div class="leaf-info">
                <span class="leaf-key">{{ selectedKeyPath }}</span>
              </div>
              <el-input
                v-model="leafValue"
                type="textarea"
                :rows="3"
                :placeholder="
                  $t('superPanel.i18n.field.valuePlaceholder')
                "
                @change="handleLeafValueChange"
              />
            </div>

            <!-- 子节点列表 -->
            <div class="detail-list" v-else-if="selectedKeyPath !== null">
              <div class="list-header">
                <span class="header-key">{{
                  $t("superPanel.i18n.field.keyName")
                }}</span>
                <span class="header-value">{{
                  $t("superPanel.i18n.field.value")
                }}</span>
                <span class="header-actions">{{
                  $t("superPanel.i18n.page.actions")
                }}</span>
              </div>
              <div class="list-body">
                <div
                  v-for="item in detailList"
                  :key="item.keyPath"
                  class="list-item"
                  :class="{ modified: modifiedKeys.has(item.keyPath) }"
                >
                  <span class="item-key" @click="handleItemClick(item)">
                    <i
                      :class="
                        item.isLeaf ? 'el-icon-document' : 'el-icon-folder'
                      "
                    ></i>
                    {{ item.label }}
                  </span>
                  <span class="item-value" v-if="item.isLeaf">
                    <el-input
                      v-model="item.value"
                      size="mini"
                      :placeholder="
                        $t(
                          'superPanel.i18n.field.valuePlaceholder'
                        )
                      "
                      @change="handleValueChange(item)"
                    />
                  </span>
                  <span
                    class="item-value item-value-folder"
                    v-else
                    @click="handleItemClick(item)"
                  >
                    {{ item.childCount }}
                    {{ $t("superPanel.i18n.node.items") }}
                  </span>
                  <span class="item-actions">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-plus"
                      @click="openAddDialog('addChild', item.keyPath)"
                      v-if="!item.isLeaf"
                    >
                      {{ $t("superPanel.i18n.node.addChild") }}
                    </el-button>
                    <!-- 自动翻译按钮：只对叶子节点且非中文语言显示 -->
                    <el-dropdown
                      v-if="item.isLeaf && activeTab !== masterLanguage"
                      trigger="hover"
                      placement="bottom"
                      @command="
                        (format) => autoTranslateDetailItem(item, format)
                      "
                    >
                      <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-connection"
                        :loading="detailTranslating[item.keyPath]"
                        class="auto-translate-btn-text"
                      >
                        {{
                          $t("superPanel.i18n.translate.auto")
                        }}
                        <el-tooltip
                          :content="
                            $t(
                              'superPanel.i18n.translate.autoTip'
                            )
                          "
                          placement="top"
                        >
                          <i
                            class="el-icon-question auto-translate-question"
                          ></i>
                        </el-tooltip>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="normal">
                          <i class="el-icon-document"></i>
                          {{
                            $t(
                              "superPanel.i18n.field.formatNormal"
                            )
                          }}
                        </el-dropdown-item>
                        <el-dropdown-item command="title">
                          <i class="el-icon-document"></i>
                          {{
                            $t("superPanel.i18n.field.formatTitle")
                          }}
                        </el-dropdown-item>
                        <el-dropdown-item command="camel">
                          <i class="el-icon-document"></i>
                          {{
                            $t("superPanel.i18n.field.formatCamel")
                          }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      class="delete-btn"
                      @click="handleDeleteItem(item)"
                    >
                      {{ $t("common.delete") }}
                    </el-button>
                  </span>
                </div>
                <div class="empty-list" v-if="detailList.length === 0">
                  <i class="el-icon-folder-opened"></i>
                  <p>
                    {{ $t("superPanel.i18n.node.noChildren") }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 未选择节点提示 -->
            <div
              class="detail-empty"
              v-if="selectedKeyPath === null && currentData"
            >
              <i class="el-icon-pointer"></i>
              <p>
                {{ $t("superPanel.i18n.node.selectTip") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ul
      v-show="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <li @click="handleAddChild">
        <i class="el-icon-plus"></i>
        <span>{{ $t("superPanel.i18n.node.addChild") }}</span>
      </li>
      <li @click="handleAddSibling">
        <i class="el-icon-document-copy"></i>
        <span>{{ $t("superPanel.i18n.node.addSibling") }}</span>
      </li>
      <li class="divider"></li>
      <li
        @click="handleNodeTranslate"
        v-if="!contextMenu.data?.isLeaf"
        :class="{ disabled: translateManager.state.isTranslating }"
      >
        <i class="el-icon-reading"></i>
        <span>{{
          $t("superPanel.i18n.translate.node")
        }}</span>
      </li>
      <li class="divider" v-if="!contextMenu.data?.isLeaf"></li>
      <li @click="handleDeleteNode" class="danger">
        <i class="el-icon-delete"></i>
        <span>{{ $t("superPanel.i18n.node.deleteNode") }}</span>
      </li>
    </ul>

    <!-- 新增配置对话框 -->
    <!-- 新增/编辑配置对话框（右键菜单使用） -->
    <el-dialog
      :title="addDialog.mode === 'edit' ? $t('superPanel.i18n.node.editConfig') : $t('superPanel.i18n.node.addConfig')"
      :visible.sync="addDialog.visible"
      width="600px"
      @close="addDialog.visible = false"
    >
      <el-form :model="addDialog.form" label-width="180px">
        <el-form-item v-if="addDialog.mode !== 'edit'">
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.node.parentPath") }}
              <el-tooltip
                :content="
                  $t('superPanel.i18n.node.parentPathTip')
                "
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-cascader
            v-model="addDialog.parentPathArray"
            :options="cascaderOptions"
            :props="{
              expandTrigger: 'hover',
              children: 'children',
              label: 'label',
              value: 'keyPath',
            }"
            :placeholder="
              $t('superPanel.i18n.node.parentPathPlaceholder')
            "
            style="width: 100%"
            clearable
            @change="handleParentPathChange"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.field.keyName") }}
              <el-tooltip
                :content="$t('superPanel.i18n.field.keyNameTip')"
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="addDialog.form.key"
            :placeholder="
              $t('superPanel.i18n.field.keyNamePlaceholder')
            "
            :disabled="addDialog.mode === 'edit'"
          />
        </el-form-item>
        <el-form-item
          v-for="file in fileList"
          :key="file.langCode"
          :label="file.autonym"
        >
          <div class="value-input-wrapper">
            <el-input
              v-model="addDialog.form.values[file.langCode]"
              :placeholder="
                $t(
                  'superPanel.i18n.field.valuePlaceholderWithLang',
                  { lang: file.autonym }
                )
              "
            />
            <el-dropdown
              v-if="
                file.langCode !== masterLanguage &&
                addDialog.form.values[masterLanguage]
              "
              trigger="hover"
              placement="bottom"
              @command="(format) => autoTranslate(file.langCode, format)"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-connection"
                :loading="addDialog.translating[file.langCode]"
                class="auto-translate-btn"
              >
                {{ $t("superPanel.i18n.translate.auto") }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="normal">
                  <i class="el-icon-document"></i>
                  {{ $t("superPanel.i18n.field.formatNormal") }}
                </el-dropdown-item>
                <el-dropdown-item command="title">
                  <i class="el-icon-document"></i>
                  {{ $t("superPanel.i18n.field.formatTitle") }}
                </el-dropdown-item>
                <el-dropdown-item command="camel">
                  <i class="el-icon-document"></i>
                  {{ $t("superPanel.i18n.field.formatCamel") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="addDialog.saving"
          @click="handleAddConfig"
        >
          {{ $t("common.confirm") }}
        </el-button>
      </span>
    </el-dialog>

    <!-- 备份路径设置对话框 -->
    <el-dialog
      :title="$t('superPanel.i18n.backup.path')"
      :visible.sync="backupPathDialog.visible"
      width="700px"
      @open="loadBackupList"
    >
      <el-form label-width="140px">
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.backup.currentPath") }}
              <el-tooltip
                :content="
                  $t('superPanel.i18n.backup.currentPathTip')
                "
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            :value="backupConfig.backupDir"
            readonly
            class="readonly-path-input"
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.backup.newPath") }}
              <el-tooltip
                :content="$t('superPanel.i18n.backup.newPathTip')"
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="backupPathDialog.newPath"
            :placeholder="$t('superPanel.i18n.node.pathNotEmpty')"
          />
        </el-form-item>
      </el-form>

      <!-- 备份清单 -->
      <div class="backup-list-section">
        <div class="backup-list-header">
          <span class="backup-list-title">{{
            $t("superPanel.i18n.backup.list")
          }}</span>
          <el-button size="mini" icon="el-icon-refresh" @click="loadBackupList">
            {{ $t("common.refresh") }}
          </el-button>
        </div>
        <div
          class="backup-list-container"
          v-loading="backupListLoading"
          :element-loading-text="$t('common.loading')"
        >
          <el-table
            :data="backupList"
            size="small"
            border
            style="width: 100%"
            max-height="300"
          >
            <el-table-column
              prop="fileName"
              :label="$t('superPanel.i18n.backup.fileName')"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="size"
              :label="$t('superPanel.i18n.backup.fileSize')"
              width="100"
            />
            <el-table-column
              prop="createdAt"
              :label="$t('superPanel.i18n.backup.createTime')"
              width="180"
            />
            <el-table-column
              :label="$t('common.operation')"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  class="delete-btn"
                  @click="handleDeleteBackup(scope.row.fileName)"
                >
                  {{ $t("common.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="backup-list-empty"
            v-if="!backupListLoading && backupList.length === 0"
          >
            <i class="el-icon-folder-opened"></i>
            <span>{{ $t("superPanel.i18n.backup.noBackup") }}</span>
          </div>
        </div>
      </div>

      <span slot="footer">
        <el-button @click="backupPathDialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="handleSetBackupPath">
          {{ $t("common.confirm") }}
        </el-button>
      </span>
    </el-dialog>

    <!-- 批量翻译确认对话框 -->
    <el-dialog
      :title="
        batchTranslateDialog.nodePath
          ? $t('superPanel.i18n.translate.node')
          : $t('superPanel.i18n.translate.batch')
      "
      :visible.sync="batchTranslateDialog.visible"
      width="500px"
      @close="batchTranslateDialog.visible = false"
    >
      <div class="batch-translate-content">
        <div class="batch-translate-info">
          <i class="el-icon-warning-outline"></i>
          <span v-if="batchTranslateDialog.nodePath">
            {{ $t("superPanel.i18n.translate.nodeTip") }}
            <span class="node-path-label"
              >[{{ batchTranslateDialog.nodeLabel }}]</span
            >
          </span>
          <span v-else>{{
            $t("superPanel.i18n.translate.batchTip")
          }}</span>
        </div>
        <el-radio-group
          v-model="batchTranslateDialog.mode"
          class="batch-translate-mode"
        >
          <el-radio label="missing">
            {{ $t("superPanel.i18n.translate.missingOnly") }}
            <div class="radio-desc">
              {{
                $t(
                  "superPanel.i18n.translate.missingOnlyDesc"
                )
              }}
            </div>
          </el-radio>
          <el-radio label="all">
            {{ $t("superPanel.i18n.translate.all") }}
            <div class="radio-desc">
              {{ $t("superPanel.i18n.translate.allDesc") }}
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchTranslateDialog.visible = false">
          {{ $t("common.cancel") }}
        </el-button>
        <el-button type="primary" @click="confirmBatchTranslate">
          {{ $t("common.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 批量对比字段对话框 -->
    <el-dialog
      :title="$t('superPanel.i18n.compare.batch')"
      :visible.sync="batchCompareDialog.visible"
      width="900px"
      :close-on-click-modal="false"
      @close="batchCompareDialog.visible = false"
    >
      <!-- 顶部配置区 -->
      <div class="batch-compare-config">
        <el-form
          :model="batchCompareDialog.form"
          label-width="160px"
          size="small"
        >
          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t("superPanel.i18n.compare.masterLanguage") }}
                <el-tooltip
                  :content="
                    $t('superPanel.i18n.compare.masterLanguageTip')
                  "
                  placement="top"
                >
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-input
              :value="batchCompareDialog.masterLangName"
              readonly
              class="readonly-language-input"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span class="label-with-tip">
                {{ $t("superPanel.i18n.compare.targetLanguage") }}
                <el-tooltip
                  :content="
                    $t('superPanel.i18n.compare.targetLanguageTip')
                  "
                  placement="top"
                >
                  <i class="el-icon-question label-tip-icon"></i>
                </el-tooltip>
              </span>
            </template>
            <el-select
              v-model="batchCompareDialog.form.targetLangCode"
              :placeholder="
                $t('superPanel.i18n.compare.pleaseSelectLanguage')
              "
              style="width: 300px"
            >
              <el-option
                v-for="file in fileList"
                :key="file.langCode"
                :label="file.autonym"
                :value="file.langCode"
                :disabled="file.langCode === masterLanguage"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="batchCompareDialog.comparing"
              @click="handleStartCompare"
            >
              {{ $t("superPanel.i18n.compare.start") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 统计信息区（比对完成后显示） -->
      <div v-if="batchCompareDialog.hasResult" class="batch-compare-stats">
        <div class="stat-card stat-blue">
          <div class="stat-value">
            {{ batchCompareDialog.stats.masterTotal }}
          </div>
          <div class="stat-label">
            {{ $t("superPanel.i18n.compare.masterCount") }}
          </div>
        </div>
        <div class="stat-card stat-blue">
          <div class="stat-value">
            {{ batchCompareDialog.stats.targetTotal }}
          </div>
          <div class="stat-label">
            {{ $t("superPanel.i18n.compare.targetCount") }}
          </div>
        </div>
        <div class="stat-card stat-orange">
          <div class="stat-value">
            {{ batchCompareDialog.stats.missingCount }}
          </div>
          <div class="stat-label">
            {{ $t("superPanel.i18n.compare.missingCount") }}
          </div>
        </div>
        <div class="stat-card stat-green">
          <div class="stat-value">
            {{ batchCompareDialog.stats.extraCount }}
          </div>
          <div class="stat-label">
            {{ $t("superPanel.i18n.compare.extraCount") }}
          </div>
        </div>
      </div>

      <!-- 详细结果区（比对完成后显示） -->
      <div v-if="batchCompareDialog.hasResult" class="batch-compare-result">
        <div class="result-toolbar">
          <el-tabs v-model="batchCompareDialog.activeTab" size="small">
            <el-tab-pane
              :label="
                $t('superPanel.i18n.compare.missingFields') +
                ' (' +
                batchCompareDialog.stats.missingCount +
                ')'
              "
              name="missing"
            />
            <el-tab-pane
              :label="
                $t('superPanel.i18n.compare.extraFields') +
                ' (' +
                batchCompareDialog.stats.extraCount +
                ')'
              "
              name="extra"
            />
            <el-tab-pane
              :label="
                $t('superPanel.i18n.compare.emptyFields') +
                ' (' +
                batchCompareDialog.stats.emptyCount +
                ')'
              "
              name="empty"
            />
          </el-tabs>
          <el-tooltip :content="$t('common.copy')" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-document-copy"
              circle
              @click="handleCopyReport"
            />
          </el-tooltip>
        </div>
        <div class="result-table-wrapper">
          <el-table
            :data="batchCompareDialog.fields[batchCompareDialog.activeTab]"
            border
            size="mini"
            style="width: 100%"
            max-height="400"
          >
            <el-table-column
              type="index"
              label="#"
              width="60"
              align="center"
            />
            <el-table-column
              prop="keyPath"
              :label="$t('superPanel.i18n.node.fieldPath')"
              min-width="280"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('superPanel.i18n.compare.masterValue')"
              min-width="180"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.masterValue !== null && scope.row.masterValue !== undefined">
                  {{ scope.row.masterValue }}
                </span>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('superPanel.i18n.compare.targetValue')"
              min-width="180"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.targetValue !== null && scope.row.targetValue !== undefined && scope.row.targetValue !== ''">
                  {{ scope.row.targetValue }}
                </span>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 未比对时的提示 -->
      <div v-if="!batchCompareDialog.hasResult" class="batch-compare-empty">
        <i class="el-icon-document"></i>
        <p>{{ $t("superPanel.i18n.compare.emptyTip") }}</p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="batchCompareDialog.visible = false">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 新建语言对话框 -->
    <el-dialog
      :title="$t('superPanel.i18n.createLang.action')"
      :visible.sync="createLanguageDialog.visible"
      width="550px"
      @close="createLanguageDialog.visible = false"
    >
      <el-form :model="createLanguageDialog.form" label-width="180px">
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.translate.source") }}
              <el-tooltip
                :content="
                  $t('superPanel.i18n.translate.sourceTip')
                "
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="masterLangDisplay"
            readonly
            style="width: 100%"
          />
          <div class="source-lang-hint">
            {{ $t("superPanel.i18n.createLang.sourceHint") }}
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.createLang.code") }}
              <el-tooltip
                :content="
                  $t('superPanel.i18n.createLang.codeTip')
                "
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-select
            v-model="createLanguageDialog.form.newLangCode"
            style="width: 100%"
            :placeholder="
              $t('superPanel.i18n.createLang.codePlaceholder')
            "
          >
            <el-option
              v-for="lang in presetLanguages"
              :key="lang.code"
              :label="`${lang[languageDisplayField]} (${lang.code})`"
              :value="lang.code"
            >
              <span style="display: flex; align-items: center">
                <svg-icon
                  :icon-class="lang.flag || 'global'"
                  style="width: 20px; height: 20px; margin-right: 8px"
                />
                <span>{{ lang[languageDisplayField] }} ({{ lang.code }})</span>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.translate.copyValues") }}
              <el-tooltip
                :content="
                  $t('superPanel.i18n.translate.copyValuesTip')
                "
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-switch
            v-model="createLanguageDialog.form.copyValues"
            :active-text="
              $t('superPanel.i18n.translate.copyValuesYes')
            "
            :inactive-text="
              $t('superPanel.i18n.translate.copyValuesNo')
            "
          />
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t("superPanel.i18n.translate.autoAll") }}
              <el-tooltip
                :content="
                  $t('superPanel.i18n.translate.autoAllTip')
                "
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-switch
            v-model="createLanguageDialog.autoTranslate"
            :active-text="$t('common.enabled')"
            :inactive-text="$t('common.disabled')"
            :disabled="translateManager.state.isTranslating"
          />
        </el-form-item>
        <el-alert
          :title="$t('superPanel.i18n.createLang.tip')"
          type="info"
          :closable="false"
          show-icon
        />
      </el-form>
      <span slot="footer">
        <el-button @click="createLanguageDialog.visible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="createLanguageDialog.saving"
          @click="handleCreateLanguage"
        >
          {{ $t("common.confirm") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
  requestTranslateApi,
  requestGetLanguageBackupListApi,
  requestDeleteLanguageBackupApi,
  requestGetTranslationConfigApi,
} from "@/api";
import { applyFormat } from "@/utils/business/translationFormat";
import translateManager from "@/utils/business/translateManager";

export default {
  name: "I18nManager",
  data() {
    return {
      translateManager,
      fileList: [],
      activeTab: "",
      loading: false,
      saving: false,
      masterLanguage: "zh-CN", // 母版语言，默认中文，从翻译配置中加载
      languageDisplayField: "autonym", // 语言名称显示方式：autonym=母语, name=中文
      currentData: null,
      originalData: null,
      selectedKeyPath: null,
      selectedIsLeaf: false,
      leafValue: "",
      detailList: [],
      searchKeyword: "",
      searchResults: [],
      currentSearchIndex: 0,
      searchLoading: false,
      searchTimer: null,
      isSearching: false,
      filteredTreeData: [],
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        node: null,
        data: null,
      },
      addDialog: {
        visible: false,
        saving: false,
        translating: {},
        mode: "add",
        parentPathArray: [],
        currentFormat: "title",
        form: {
          parentPath: "",
          key: "",
          values: {},
        },
      },
      cascaderOptions: [],
      backupConfig: {
        backupDir: "",
        i18nDir: "",
      },
      backupPathDialog: {
        visible: false,
        newPath: "",
      },
      backupList: [],
      backupListLoading: false,
      batchTranslateDialog: {
        visible: false,
        mode: "missing", // missing: 仅翻译缺失项, all: 全部重新翻译
        nodePath: null, // 节点翻译时的节点路径，null 表示全量翻译
        nodeLabel: "", // 节点翻译时的节点名称
      },
      // 批量对比字段对话框
      batchCompareDialog: {
        visible: false,
        comparing: false,
        hasResult: false,
        masterLangName: "",
        activeTab: "missing",
        form: {
          targetLangCode: "",
        },
        stats: {
          masterTotal: 0,
          targetTotal: 0,
          missingCount: 0,
          extraCount: 0,
          emptyCount: 0,
        },
        fields: {
          missing: [],
          extra: [],
          empty: [],
        },
      },
      createLanguageDialog: {
        visible: false,
        saving: false,
        autoTranslate: false,
        form: {
          sourceLangCode: "zh-CN",
          newLangCode: "",
          copyValues: true,
        },
      },
      // 预设语言列表
      presetLanguages: [],
      // 详情区翻译状态
      detailTranslating: {},
      // 中文语言数据（用于翻译源）
      zhData: null,
      modifiedKeys: new Set(),
      // 可拖拽分隔条
      leftPanelWidth: 20,
      isResizing: false,
      minLeftWidth: 20,
      maxLeftWidth: 60,
      // 加载文件列表的 Promise 缓存，避免重复请求
      loadingFileListPromise: null,
    };
  },

  computed: {
    backupPathTooltip() {
      return `${this.$t("superPanel.i18n.backup.currentPath")}: ${
        this.backupConfig.backupDir
      }`;
    },

    // 母版语言的显示名称（根据 languageDisplayField 决定 autonym 或 name）
    masterLangDisplay() {
      const master = this.fileList.find(
        (f) => f.langCode === this.masterLanguage
      );
      if (!master) return this.masterLanguage;
      const field = this.languageDisplayField || "autonym";
      return master[field] || master.autonym || this.masterLanguage;
    },

    breadcrumbList() {
      if (this.selectedKeyPath === null) return [];
      return this.selectedKeyPath.split(".");
    },

    // 统计节点数量
    totalNodeCount() {
      return this.countNodes(this.currentData).total;
    },
    totalFolderCount() {
      return this.countNodes(this.currentData).folders;
    },
    totalLeafCount() {
      return this.countNodes(this.currentData).leaves;
    },
  },

  mounted() {
    this.init();
    document.addEventListener("click", this.hideContextMenu);
    document.addEventListener("mousemove", this.onResize);
    document.addEventListener("mouseup", this.stopResize);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.hideContextMenu);
    document.removeEventListener("mousemove", this.onResize);
    document.removeEventListener("mouseup", this.stopResize);
  },

  methods: {
    async init() {
      await Promise.all([
        this.loadFileList(),
        this.loadBackupConfig(),
        this.loadTranslationConfig(),
        this.loadPresetLanguages(),
      ]);
    },

    // 加载预设语言列表
    async loadPresetLanguages() {
      try {
        const { requestGetPresetLanguagesApi } = await import(
          "@/api/i18n-manager"
        );
        const res = await requestGetPresetLanguagesApi();
        this.presetLanguages = res.data || [];
      } catch (err) {
        // 加载预设语言失败，忽略错误
      }
    },

    // ========== 可拖拽分隔条 ==========

    startResize(e) {
      e.preventDefault();
      this.isResizing = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },

    onResize(e) {
      if (!this.isResizing) return;
      const mainContent = this.$refs.mainContent;
      if (!mainContent) return;
      const rect = mainContent.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      let percent = (offsetX / rect.width) * 100;
      // 限制范围
      percent = Math.max(
        this.minLeftWidth,
        Math.min(this.maxLeftWidth, percent)
      );
      this.leftPanelWidth = percent;
    },

    stopResize() {
      if (!this.isResizing) return;
      this.isResizing = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    },

    async loadFileList(retryCount = 0) {
      // 如果正在加载，返回同一个 Promise，避免重复请求
      if (this.loadingFileListPromise && retryCount === 0) {
        return this.loadingFileListPromise;
      }

      this.loadingFileListPromise = (async () => {
        try {
          const res = await requestGetLanguagesApi();
          this.fileList = res.data || [];
          // 加载成功后，如果 activeTab 不在文件列表中，重置为 null
          if (
            this.activeTab &&
            !this.fileList.some((f) => f.langCode === this.activeTab)
          ) {
            this.activeTab = "";
            this.currentData = null;
          }
        } catch (err) {
          // 请求被取消时的处理
          if (
            err &&
            (err.__CANCEL__ ||
              err.code === "ERR_CANCELED" ||
              err.message === "重复请求，自动取消上一次" ||
              err.message === "路由切换，取消未完成请求")
          ) {
            // 如果 fileList 为空，可能是页面加载时请求被取消，重试一次
            if (this.fileList.length === 0 && retryCount < 2) {
              await new Promise((resolve) => setTimeout(resolve, 300));
              return this.loadFileList(retryCount + 1);
            }
            // fileList 不为空，继续使用之前的数据
            return;
          }
          // 失败时重试一次（最多重试2次）
          if (retryCount < 2) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return this.loadFileList(retryCount + 1);
          }
          this.$message.error(
            this.$t("superPanel.i18n.common.loadFileListFailed") +
              (err.message ? `: ${err.message}` : "")
          );
        }
      })();

      try {
        return await this.loadingFileListPromise;
      } finally {
        // 加载完成后清除缓存
        this.loadingFileListPromise = null;
      }
    },

    // 加载翻译配置（获取母版语言）
    async loadTranslationConfig() {
      try {
        const res = await requestGetTranslationConfigApi();
        if (res.data) {
          if (res.data.masterLanguage) {
            this.masterLanguage = res.data.masterLanguage;
          }
          if (res.data.languageDisplayField) {
            this.languageDisplayField = res.data.languageDisplayField;
          }
        }
      } catch (err) {
        // 加载失败，使用默认值 zh-CN
      }
    },

    async handleLangTabClick(langCode) {
      if (this.activeTab === langCode) return;
      if (this.modifiedKeys.size > 0) {
        try {
          await this.$confirm(
            this.$t("superPanel.i18n.common.unsavedChanges"),
            this.$t("common.tip"),
            { type: "warning" }
          );
        } catch {
          return;
        }
      }
      this.activeTab = langCode;
      await this.loadCurrentFile();
    },

    async loadCurrentFile(showLoading = true) {
      if (!this.activeTab) return;
      if (showLoading) {
        this.loading = true;
      }
      this.modifiedKeys.clear();
      this.selectedKeyPath = null;
      this.detailList = [];
      try {
        // 加载当前语言文件
        const res = await requestReadLanguageApi(this.activeTab);
        if (!res || !res.data || !res.data.data) {
          throw new Error("返回数据格式不正确");
        }
        const i18nData = res.data.data;
        this.currentData = i18nData;
        this.originalData = JSON.parse(JSON.stringify(i18nData));

        // 如果当前语言不是母版语言，同时加载母版语言文件作为翻译源
        const masterFileName = this.masterLanguage;
        if (this.activeTab !== masterFileName) {
          try {
            const masterRes = await requestReadLanguageApi(masterFileName);
            if (masterRes && masterRes.data && masterRes.data.data) {
              this.zhData = masterRes.data.data;
            }
          } catch (masterErr) {
            // 加载主语言文件失败，忽略错误
          }
        } else {
          this.zhData = i18nData;
        }

        this.$nextTick(() => {
          if (this.$refs.i18nTree) {
            this.$refs.i18nTree.root.childNodes = [];
            this.$refs.i18nTree.store.root.loaded = false;
            this.$refs.i18nTree.store.root.loadData();
          }
        });
        this.searchKeyword = "";
      } catch (err) {
        // 只有用户主动操作时才显示错误提示
        if (showLoading) {
          this.$message.error(
            this.$t("superPanel.i18n.common.loadFileFailed") +
              (err.message ? ": " + err.message : "")
          );
        }
      } finally {
        // 无论 showLoading 是什么值，都要重置 loading 状态
        this.loading = false;
      }
    },

    async loadBackupConfig() {
      try {
        const res = await requestGetI18nBackupConfigApi();
        this.backupConfig = res.data || {};
      } catch (err) {
        // 静默失败
      }
    },

    // ========== 树懒加载 ==========

    loadNode(node, resolve) {
      if (!this.currentData) {
        resolve([]);
        return;
      }
      if (node.level === 0) {
        const children = this.getChildrenByPath("");
        resolve(children);
      } else {
        const keyPath = node.data.keyPath;
        const children = this.getChildrenByPath(keyPath);
        resolve(children);
      }
    },

    getChildrenByPath(keyPath) {
      let data = this.currentData;
      if (keyPath) {
        const keys = keyPath.split(".");
        for (const key of keys) {
          if (data && data[key] !== undefined) {
            data = data[key];
          } else {
            return [];
          }
        }
      }

      const result = [];
      if (data && typeof data === "object" && !Array.isArray(data)) {
        for (const [key, value] of Object.entries(data)) {
          const childKeyPath = keyPath ? `${keyPath}.${key}` : key;
          if (value && typeof value === "object" && !Array.isArray(value)) {
            const childCount = Object.keys(value).length;
            result.push({
              label: key,
              keyPath: childKeyPath,
              isLeaf: false,
              childCount,
            });
          } else {
            result.push({
              label: key,
              keyPath: childKeyPath,
              isLeaf: true,
              value: value,
            });
          }
        }
      }
      return result;
    },

    // ========== 节点点击 ==========

    handleNodeClick(data) {
      this.selectedKeyPath = data.keyPath;
      this.selectedIsLeaf = data.isLeaf;
      if (data.isLeaf) {
        this.leafValue = data.value;
      } else {
        this.buildDetailList(data.keyPath);
      }
    },

    handleItemClick(item) {
      this.selectedKeyPath = item.keyPath;
      this.selectedIsLeaf = item.isLeaf;
      if (item.isLeaf) {
        this.leafValue = item.value;
      } else {
        this.buildDetailList(item.keyPath);
        this.$nextTick(() => {
          if (this.$refs.i18nTree) {
            const node = this.$refs.i18nTree.getNode(item.keyPath);
            if (node) {
              node.expanded = true;
            }
          }
        });
      }
    },

    buildDetailList(keyPath) {
      this.detailList = this.getChildrenByPath(keyPath);
    },

    // ========== 面包屑 ==========

    handleBreadcrumbClick(index) {
      const path = this.breadcrumbList.slice(0, index + 1).join(".");
      this.selectedKeyPath = path;
      this.selectedIsLeaf = false;
      this.buildDetailList(path);
    },

    // ========== 值修改 ==========

    handleValueChange(item) {
      this.modifiedKeys.add(item.keyPath);
      this.updateDataByPath(item.keyPath, item.value);
    },

    handleLeafValueChange() {
      this.modifiedKeys.add(this.selectedKeyPath);
      this.updateDataByPath(this.selectedKeyPath, this.leafValue);
      if (this.$refs.i18nTree) {
        const node = this.$refs.i18nTree.getNode(this.selectedKeyPath);
        if (node && node.data) {
          node.data.value = this.leafValue;
        }
      }
    },

    updateDataByPath(keyPath, value, targetData = null) {
      const keys = keyPath.split(".");
      let data = targetData || this.currentData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (data[keys[i]] === undefined) {
          data[keys[i]] = {};
        }
        data = data[keys[i]];
      }
      data[keys[keys.length - 1]] = value;
    },

    getValueByPath(data, keyPath) {
      if (!data || !keyPath) return "";
      const keys = keyPath.split(".");
      let current = data;
      for (const key of keys) {
        if (current === undefined || current === null) return "";
        current = current[key];
      }
      return current || "";
    },

    // ========== 删除节点 ==========

    async handleDeleteItem(item) {
      try {
        await this.$confirm(
          `${this.$t("superPanel.i18n.node.confirmDelete")}: ${
            item.keyPath
          }`,
          this.$t("common.tip"),
          { type: "warning" }
        );
      } catch {
        return;
      }

      try {
        await requestDeleteNodeApi({ langCode: this.activeTab, keyPath: item.keyPath });
        this.$message.success(
          this.$t("superPanel.i18n.common.deleteSuccess")
        );
        await this.loadCurrentFile();
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.common.deleteFailed")
        );
      }
    },

    // ========== 搜索 ==========

    handleTreeSearch() {
      // 清空之前的防抖定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      if (!this.searchKeyword) {
        this.searchResults = [];
        this.currentSearchIndex = 0;
        this.isSearching = false;
        this.filteredTreeData = [];
        return;
      }
      // 防抖 300ms
      this.searchLoading = true;
      this.searchTimer = setTimeout(() => {
        this.executeSearch();
      }, 300);
    },

    executeSearch() {
      if (!this.searchKeyword || !this.currentData) {
        this.searchResults = [];
        this.currentSearchIndex = 0;
        this.searchLoading = false;
        this.isSearching = false;
        this.filteredTreeData = [];
        return;
      }
      const keyword = this.searchKeyword.toLowerCase();
      const matches = this.searchInData(this.currentData, "", keyword);
      this.searchResults = matches;
      this.currentSearchIndex = 0;
      this.searchLoading = false;
      if (matches.length > 0) {
        // 构建过滤后的树数据（只包含匹配节点及其父节点）
        this.filteredTreeData = this.buildFilteredTreeData(matches);
        this.isSearching = true;
        // 等树渲染完成后手动展开所有节点，并选中第一个结果
        this.$nextTick(() => {
          this.$nextTick(() => {
            // 手动展开所有节点（default-expand-all 只在初始化时生效，数据变化后需要手动展开）
            if (this.$refs.i18nTree && this.$refs.i18nTree.store) {
              const nodesMap = this.$refs.i18nTree.store.nodesMap;
              for (const key in nodesMap) {
                if (Object.prototype.hasOwnProperty.call(nodesMap, key)) {
                  nodesMap[key].expanded = true;
                }
              }
            }
            this.selectSearchResult(0);
          });
        });
      } else {
        this.isSearching = false;
        this.filteredTreeData = [];
      }
    },

    handleSearchEnter() {
      // 按回车跳到下一个结果
      if (this.searchResults.length === 0) return;
      const nextIndex =
        (this.currentSearchIndex + 1) % this.searchResults.length;
      this.selectSearchResult(nextIndex);
    },

    prevSearchResult() {
      if (this.currentSearchIndex > 0) {
        this.selectSearchResult(this.currentSearchIndex - 1);
      }
    },

    nextSearchResult() {
      if (this.currentSearchIndex < this.searchResults.length - 1) {
        this.selectSearchResult(this.currentSearchIndex + 1);
      }
    },

    selectSearchResult(index) {
      if (index < 0 || index >= this.searchResults.length) return;
      this.currentSearchIndex = index;
      const result = this.searchResults[index];

      if (this.isSearching) {
        // 搜索模式下，节点已经全部加载并展开，直接选中
        this.$nextTick(() => {
          if (this.$refs.i18nTree) {
            this.$refs.i18nTree.setCurrentKey(result.keyPath);
          }
        });
      } else {
        // 非搜索模式下，需要展开节点的所有父节点
        this.expandNodeByPath(result.keyPath);
      }

      // 同时在右边显示详情
      this.selectedKeyPath = result.keyPath;
      this.selectedIsLeaf = !this.isKeyPathFolder(result.keyPath);
      if (this.selectedIsLeaf) {
        this.leafValue = result.value;
      } else {
        this.buildDetailList(result.keyPath);
      }
    },

    isKeyPathFolder(keyPath) {
      let data = this.currentData;
      const keys = keyPath.split(".");
      for (const key of keys) {
        if (data && data[key] !== undefined) {
          data = data[key];
        } else {
          return false;
        }
      }
      return data && typeof data === "object" && !Array.isArray(data);
    },

    // 统计节点数量
    countNodes(data) {
      const result = { total: 0, folders: 0, leaves: 0 };
      if (!data || typeof data !== "object" || Array.isArray(data))
        return result;
      for (const [, value] of Object.entries(data)) {
        result.total++;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          result.folders++;
          const childResult = this.countNodes(value);
          result.total += childResult.total;
          result.folders += childResult.folders;
          result.leaves += childResult.leaves;
        } else {
          result.leaves++;
        }
      }
      return result;
    },

    // 收集所有叶子节点（递归）
    collectLeafNodes(data, prefix = "") {
      const result = [];
      if (!data || typeof data !== "object" || Array.isArray(data))
        return result;
      for (const [key, value] of Object.entries(data)) {
        const keyPath = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          result.push(...this.collectLeafNodes(value, keyPath));
        } else {
          result.push({
            keyPath,
            value: value || "",
          });
        }
      }
      return result;
    },

    // 构建过滤后的树数据（只包含匹配节点及其父节点）
    buildFilteredTreeData(searchResults) {
      // 收集所有需要显示的 keyPath（包括匹配节点的所有父节点）
      const pathsToShow = new Set();
      // 收集所有匹配节点的 keyPath（用于高亮显示）
      const matchPaths = new Set();
      for (const result of searchResults) {
        matchPaths.add(result.keyPath);
        const keys = result.keyPath.split(".");
        for (let i = 1; i <= keys.length; i++) {
          pathsToShow.add(keys.slice(0, i).join("."));
        }
      }

      // 递归构建过滤后的树
      const buildTree = (data, prefix) => {
        const result = [];
        if (!data || typeof data !== "object") return result;
        for (const [key, value] of Object.entries(data)) {
          const keyPath = prefix ? `${prefix}.${key}` : key;
          if (pathsToShow.has(keyPath)) {
            if (value && typeof value === "object" && !Array.isArray(value)) {
              const children = buildTree(value, keyPath);
              // 计算该节点下的匹配子节点数量
              let matchCount = 0;
              const countMatches = (nodes) => {
                for (const node of nodes) {
                  if (node.isMatch) matchCount++;
                  if (node.children && node.children.length > 0) {
                    countMatches(node.children);
                  }
                }
              };
              countMatches(children);
              result.push({
                label: key,
                keyPath,
                isLeaf: false,
                children,
                childCount: children.length,
                isMatch: matchPaths.has(keyPath),
                matchCount: matchCount,
              });
            } else {
              result.push({
                label: key,
                keyPath,
                isLeaf: true,
                value,
                isMatch: matchPaths.has(keyPath),
                matchCount: 0,
              });
            }
          }
        }
        return result;
      };

      return buildTree(this.currentData, "");
    },

    searchInData(data, prefix, keyword) {
      const results = [];
      if (!data || typeof data !== "object" || Array.isArray(data))
        return results;
      for (const [key, value] of Object.entries(data)) {
        const keyPath = prefix ? `${prefix}.${key}` : key;
        // 检查 key 是否匹配（严格字符串匹配）
        if (typeof key === "string" && key.toLowerCase().includes(keyword)) {
          results.push({ keyPath, label: key, value });
        }
        // 根据 value 类型分别处理
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          // 对象类型，递归搜索
          results.push(...this.searchInData(value, keyPath, keyword));
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          // 基本类型（字符串/数字/布尔），转换为字符串检查
          if (String(value).toLowerCase().includes(keyword)) {
            if (!results.find((r) => r.keyPath === keyPath)) {
              results.push({ keyPath, label: key, value });
            }
          }
        }
        // null/undefined/数组/函数等其他类型不参与搜索
      }
      return results;
    },

    expandNodeByPath(keyPath) {
      if (!this.$refs.i18nTree) return;
      const keys = keyPath.split(".");
      let currentPath = "";
      const expandNext = (index) => {
        if (index >= keys.length) return;
        currentPath = currentPath
          ? `${currentPath}.${keys[index]}`
          : keys[index];
        const node = this.$refs.i18nTree.getNode(currentPath);
        if (node) {
          node.expanded = true;
          this.$nextTick(() => expandNext(index + 1));
        } else {
          setTimeout(() => expandNext(index), 100);
        }
      };
      expandNext(0);
    },

    // ========== 保存 ==========

    async handleSave() {
      if (this.modifiedKeys.size === 0) {
        this.$message.info(
          this.$t("superPanel.i18n.common.noChanges")
        );
        return;
      }

      this.saving = true;
      try {
        await requestSaveLanguageValuesApi(this.activeTab, this.currentData);
        this.$message.success(
          this.$t("superPanel.i18n.common.saveSuccess")
        );
        this.modifiedKeys.clear();
        this.originalData = JSON.parse(JSON.stringify(this.currentData));
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.common.saveFailed")
        );
      } finally {
        this.saving = false;
      }
    },

    // ========== 备份 ==========

    async handleBackup() {
      try {
        await requestBackupLanguageApi(this.activeTab);
        this.$message.success(
          this.$t("superPanel.i18n.backup.success")
        );
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.backup.failed")
        );
      }
    },

    // ========== 备份路径 ==========

    openBackupPathDialog() {
      this.backupPathDialog.newPath = this.backupConfig.backupDir;
      this.backupPathDialog.visible = true;
    },

    async handleSetBackupPath() {
      if (!this.backupPathDialog.newPath) {
        this.$message.warning(
          this.$t("superPanel.i18n.node.pathNotEmpty")
        );
        return;
      }
      try {
        await requestSetI18nBackupDirApi(this.backupPathDialog.newPath);
        this.backupConfig.backupDir = this.backupPathDialog.newPath;
        this.$message.success(
          this.$t("superPanel.i18n.backup.setPathSuccess")
        );
        this.backupPathDialog.visible = false;
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.backup.setPathFailed")
        );
      }
    },

    // 加载备份列表
    async loadBackupList() {
      this.backupListLoading = true;
      try {
        // 备份路径弹窗为全局配置，显示所有语言的备份，不传 activeTab 过滤
        const res = await requestGetLanguageBackupListApi();
        if (res && res.data && Array.isArray(res.data)) {
          this.backupList = res.data.map((item) => ({
            ...item,
            size: this.formatFileSize(item.size),
            createdAt: this.formatDateTime(item.createdAt),
          }));
        } else {
          this.backupList = [];
        }
      } catch (err) {
        this.backupList = [];
      } finally {
        this.backupListLoading = false;
      }
    },

    // 删除备份
    async handleDeleteBackup(backupFileName) {
      const confirmed = await this.$confirm.delete(
        `${this.$t(
          "superPanel.i18n.backup.deleteConfirm"
        )}: ${backupFileName}`
      );
      if (!confirmed) return;
      try {
        await requestDeleteLanguageBackupApi(backupFileName);
        this.$message.success(
          this.$t("superPanel.i18n.backup.deleteSuccess")
        );
        await this.loadBackupList();
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.backup.deleteFailed")
        );
      }
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes && bytes !== 0) return "-";
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    },

    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      const pad = (n) => (n < 10 ? "0" + n : n);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    },

    // ========== 批量翻译已有语言 ==========

    openBatchTranslateDialog() {
      // 如果正在翻译，不允许开始新的翻译
      if (translateManager.state.isTranslating) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.inProgressTip")
        );
        return;
      }
      this.batchTranslateDialog.visible = true;
      this.batchTranslateDialog.mode = "missing"; // 默认仅翻译缺失项
      this.batchTranslateDialog.nodePath = null;
      this.batchTranslateDialog.nodeLabel = "";
    },

    // ========== 批量对比字段 ==========

    // 打开批量对比字段弹窗
    openBatchCompareDialog() {
      // 如果正在翻译，不允许开始对比
      if (translateManager.state.isTranslating) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.inProgressTip")
        );
        return;
      }
      // 设置母版语言名称
      const masterFile = this.fileList.find(
        (f) => f.langCode === this.masterLanguage
      );
      this.batchCompareDialog.masterLangName = masterFile
        ? masterFile.autonym
        : this.masterLanguage;
      // 默认选中当前激活的语言（如果不是母版）
      if (this.activeTab && this.activeTab !== this.masterLanguage) {
        this.batchCompareDialog.form.targetLangCode = this.activeTab;
      } else {
        // 否则选中第一个非母版语言
        const firstNonMaster = this.fileList.find(
          (f) => f.langCode !== this.masterLanguage
        );
        this.batchCompareDialog.form.targetLangCode = firstNonMaster
          ? firstNonMaster.langCode
          : "";
      }
      // 重置结果
      this.batchCompareDialog.hasResult = false;
      this.batchCompareDialog.comparing = false;
      this.batchCompareDialog.activeTab = "missing";
      this.batchCompareDialog.stats = {
        masterTotal: 0,
        targetTotal: 0,
        missingCount: 0,
        extraCount: 0,
        emptyCount: 0,
      };
      this.batchCompareDialog.reports = {
        missing: "",
        extra: "",
        empty: "",
        full: "",
      };
      this.batchCompareDialog.visible = true;
    },

    // 开始比对
    async handleStartCompare() {
      if (!this.batchCompareDialog.form.targetLangCode) {
        this.$message.warning(
          this.$t("superPanel.i18n.compare.selectLanguage")
        );
        return;
      }
      this.batchCompareDialog.comparing = true;
      try {
        const masterFileName = this.masterLanguage;
        const targetLangCode = this.batchCompareDialog.form.targetLangCode;

        // 加载母版语言文件
        const masterRes = await requestReadLanguageApi(masterFileName);
        const masterData = masterRes?.data?.data || {};

        // 加载待比对语言
        const targetRes = await requestReadLanguageApi(targetLangCode);
        const targetData = targetRes?.data?.data || {};

        // 执行对比
        const result = this.compareLanguageFiles(
          masterData,
          targetData,
          masterFileName,
          targetLangCode
        );

        // 更新统计数据
        this.batchCompareDialog.stats = {
          masterTotal: result.masterTotal,
          targetTotal: result.targetTotal,
          missingCount: result.missingFields.length,
          extraCount: result.extraFields.length,
          emptyCount: result.emptyFields.length,
        };

        // 保存字段列表（用于表格展示）
        this.batchCompareDialog.fields.missing = result.missingFields;
        this.batchCompareDialog.fields.extra = result.extraFields;
        this.batchCompareDialog.fields.empty = result.emptyFields;

        this.batchCompareDialog.hasResult = true;
        this.$message.success(
          this.$t("superPanel.i18n.compare.success")
        );
      } catch (error) {
        console.error("比对失败:", error);
        this.$message.error(
          this.$t("superPanel.i18n.compare.failed") +
            ": " +
            (error.message || "")
        );
      } finally {
        this.batchCompareDialog.comparing = false;
      }
    },

    // ========== 语言文件对比工具函数 ==========

    /**
     * 对比两个语言文件的结构差异
     * @param {Object} masterData - 母版语言数据
     * @param {Object} targetData - 待比对语言数据
     * @param {string} masterFileName - 母版文件名
     * @param {string} targetLangCode - 待比对文件名
     * @returns {Object} 对比结果
     */
    compareLanguageFiles(masterData, targetData) {
      const masterLeaves = this.collectLeafNodes(masterData);
      const targetLeaves = this.collectLeafNodes(targetData);

      const masterKeySet = new Set(masterLeaves.map((n) => n.keyPath));
      const targetKeySet = new Set(targetLeaves.map((n) => n.keyPath));
      const targetValueMap = new Map(
        targetLeaves.map((n) => [n.keyPath, n.value])
      );

      // 缺失字段：母版有但待比对没有
      const missingFields = masterLeaves
        .filter((node) => !targetKeySet.has(node.keyPath))
        .map((node) => ({
          keyPath: node.keyPath,
          masterValue: node.value,
          targetValue: null,
        }));

      // 多余字段：待比对有但母版没有
      const extraFields = targetLeaves
        .filter((node) => !masterKeySet.has(node.keyPath))
        .map((node) => ({
          keyPath: node.keyPath,
          masterValue: null,
          targetValue: node.value,
        }));

      // 空值字段：待比对中值为空的字段（且母版中有值）
      const emptyFields = masterLeaves
        .filter((node) => {
          if (!targetKeySet.has(node.keyPath)) return false;
          const targetValue = targetValueMap.get(node.keyPath);
          const masterValue = node.value;
          return (
            masterValue &&
            (!targetValue || targetValue.toString().trim() === "")
          );
        })
        .map((node) => ({
          keyPath: node.keyPath,
          masterValue: node.value,
          targetValue: targetValueMap.get(node.keyPath) || "",
        }));

      return {
        masterTotal: masterLeaves.length,
        targetTotal: targetLeaves.length,
        missingFields,
        extraFields,
        emptyFields,
      };
    },

    // 复制当前Tab的字段列表
    handleCopyReport() {
      const activeTab = this.batchCompareDialog.activeTab;
      const fields = this.batchCompareDialog.fields[activeTab] || [];
      if (fields.length === 0) {
        this.$message.warning(
          this.$t("superPanel.i18n.compare.noContentToCopy")
        );
        return;
      }
      // 生成文本内容
      const lines = [];
      const tabLabel = {
        missing: "缺失字段",
        extra: "多余字段",
        empty: "空值字段",
      }[activeTab] || activeTab;
      lines.push(`// ${tabLabel}报告（共 ${fields.length} 个）`);
      lines.push("");
      fields.forEach((field, index) => {
        lines.push(`// [${index + 1}] ${field.keyPath}`);
        if (field.masterValue !== null && field.masterValue !== undefined) {
          lines.push(`//   母版值: ${JSON.stringify(field.masterValue)}`);
        }
        if (field.targetValue !== null && field.targetValue !== undefined && field.targetValue !== "") {
          lines.push(`//   待比对值: ${JSON.stringify(field.targetValue)}`);
        }
        lines.push(`"${field.keyPath}": "",`);
        lines.push("");
      });
      const content = lines.join("\n");
      // 创建临时 textarea 元素
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        this.$message.success(this.$t("common.copySuccess"));
      } catch (err) {
        this.$message.error(this.$t("common.copyFailed"));
        console.error("复制失败:", err);
      } finally {
        document.body.removeChild(textarea);
      }
    },

    // 节点翻译：打开批量翻译确认弹窗，只翻译当前节点下的内容
    handleNodeTranslate() {
      // 如果正在翻译，不允许开始新的翻译
      if (translateManager.state.isTranslating) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.inProgressTip")
        );
        return;
      }
      const rawData = this.contextMenu.data;
      this.hideContextMenu();

      // 健壮地获取真实数据：递归查找有 keyPath 字段的对象
      let data = rawData;
      if (data && !data.keyPath) {
        if (data.data && data.data.keyPath) {
          data = data.data;
        } else if (data.node && data.node.data && data.node.data.keyPath) {
          data = data.node.data;
        }
      }

      if (!data || data.isLeaf) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.nodeLeafTip")
        );
        return;
      }
      if (!data.keyPath) {
        this.$message.error(
          this.$t(
            "superPanel.i18n.translate.nodeKeyPathMissing"
          )
        );
        return;
      }
      this.batchTranslateDialog.visible = true;
      // 节点翻译默认使用"全部重新翻译"模式，避免目标语言已有值时全部被跳过
      this.batchTranslateDialog.mode = "all";
      this.batchTranslateDialog.nodePath = data.keyPath;
      this.batchTranslateDialog.nodeLabel = data.label;
    },

    async confirmBatchTranslate() {
      this.batchTranslateDialog.visible = false;
      const targetLangCode = this.activeTab;
      // 获取当前语言的名称
      const currentFile = this.fileList.find(
        (f) => f.langCode === targetLangCode
      );
      const targetLangName = currentFile
        ? currentFile.autonym
        : targetLangCode;
      // 执行批量翻译（支持节点翻译）
      await this.batchTranslateLanguage(
        targetLangCode,
        targetLangName,
        this.batchTranslateDialog.mode,
        this.batchTranslateDialog.nodePath,
        this.batchTranslateDialog.nodeLabel
      );
    },

    // ========== 新建语言 ==========

    openCreateLanguageDialog() {
      this.createLanguageDialog.visible = true;
      this.createLanguageDialog.form = {
        sourceLangCode: this.masterLanguage,
        newLangCode: "",
        copyValues: true,
      };
    },

    async handleCreateLanguage() {
      // 如果正在翻译且勾选了自动翻译，不允许创建
      if (
        translateManager.state.isTranslating &&
        this.createLanguageDialog.autoTranslate
      ) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.inProgressTip")
        );
        return;
      }
      const { sourceLangCode, newLangCode, copyValues } =
        this.createLanguageDialog.form;

      // 校验
      if (!sourceLangCode) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.sourceNotEmpty")
        );
        return;
      }
      if (!newLangCode) {
        this.$message.warning(
          this.$t("superPanel.i18n.createLang.codeNotEmpty")
        );
        return;
      }

      this.createLanguageDialog.saving = true;
      try {
        await requestCreateLanguageApi({
          sourceLangCode,
          newLangCode,
          copyValues,
        });
        this.$message.success(
          this.$t("superPanel.i18n.createLang.success")
        );

        // 重新加载语言列表
        await this.loadFileList();
        this.createLanguageDialog.visible = false;

        // 勾选自动翻译时，切换到新语言并执行整语言批量翻译
        if (this.createLanguageDialog.autoTranslate) {
          const preset = this.presetLanguages.find(
            (l) => l.code === newLangCode
          );
          const targetLangName = preset ? preset.autonym : newLangCode;
          this.activeTab = newLangCode;
          await this.loadCurrentFile();
          await this.batchTranslateLanguage(newLangCode, targetLangName);
        }
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.createLang.failed")
        );
      } finally {
        this.createLanguageDialog.saving = false;
      }
    },

    // 批量翻译整个语言文件或指定节点
    // mode: 'all' - 全部重新翻译（默认）, 'missing' - 仅翻译缺失项
    // nodePath: 节点路径，null 表示全量翻译
    // nodeLabel: 节点名称，用于显示
    async batchTranslateLanguage(
      targetLangCode,
      targetLangName,
      mode = "all",
      nodePath = null,
      nodeLabel = ""
    ) {
      // 强制重置 loading 状态，避免翻译过程中显示"加载中"
      this.loading = false;
      try {
        // 母版语言文件名和代码
        const masterFileName = this.masterLanguage;
        const masterLangCode = this.masterLanguage;

        // 加载母版语言文件作为源
        const masterRes = await requestReadLanguageApi(masterFileName);
        if (!masterRes || !masterRes.data || !masterRes.data.data) {
          this.$message.error(
            this.$t("superPanel.i18n.translate.failed")
          );
          return;
        }
        const masterData = masterRes.data.data;

        // 收集叶子节点（全量或指定节点）
        let leafNodes;
        if (nodePath) {
          // 节点翻译：只收集指定节点下的叶子节点
          const nodeData = this.getValueByPath(masterData, nodePath);
          if (
            !nodeData ||
            typeof nodeData !== "object" ||
            Array.isArray(nodeData)
          ) {
            this.$message.warning(
              this.$t(
                "superPanel.i18n.translate.nodeNoContent"
              )
            );
            return;
          }
          leafNodes = this.collectLeafNodes(nodeData, nodePath);
        } else {
          // 全量翻译：收集所有叶子节点
          leafNodes = this.collectLeafNodes(masterData);
        }
        const totalCount = leafNodes.length;

        if (totalCount === 0) {
          this.$message.warning(
            this.$t("superPanel.i18n.translate.noContent")
          );
          return;
        }

        // 开始翻译（显示进度弹窗）
        translateManager.startTranslate(
          targetLangCode,
          targetLangName,
          totalCount,
          nodePath,
          nodeLabel
        );

        // 加载目标语言文件
        const targetRes = await requestReadLanguageApi(targetLangCode);
        if (!targetRes || !targetRes.data || !targetRes.data.data) {
          translateManager.finishTranslate(
            false,
            this.$t("superPanel.i18n.translate.failed")
          );
          return;
        }
        const targetData = targetRes.data.data;

        // 逐个翻译
        let successCount = 0;
        let failCount = 0;
        const failItems = [];

        for (let i = 0; i < leafNodes.length; i++) {
          // 检查是否取消
          if (translateManager.state.isCancelled) {
            break;
          }

          const node = leafNodes[i];
          if (!node.value) {
            continue; // 跳过空值
          }

          // 如果是仅翻译缺失项模式，检查目标语言中对应 key 的值是否为空
          if (mode === "missing") {
            const existingValue = this.getValueByPath(targetData, node.keyPath);
            if (existingValue && existingValue.trim() !== "") {
              continue; // 已有翻译，跳过
            }
          }

          // 更新进度
          translateManager.updateProgress(
            i + 1,
            successCount,
            failCount,
            node.keyPath,
            node.value
          );

          try {
            const res = await requestTranslateApi(
              node.value,
              masterLangCode,
              targetLangCode
            );
            // 响应拦截器返回 response.data，翻译结果在 res.data.result 中
            if (res && res.data && res.data.result) {
              // 应用首字大写格式（value 使用首字大写）
              const formattedResult = applyFormat(res.data.result, "title");
              // 更新目标语言数据
              this.updateDataByPath(node.keyPath, formattedResult, targetData);
              successCount++;
            } else {
              failCount++;
              failItems.push(node.keyPath);
              translateManager.addFailItem(node.keyPath);
            }
          } catch (err) {
            // 被取消的请求不计入失败数（用户取消翻译或重复请求自动取消）
            if (
              err &&
              (err.__CANCEL__ ||
                err.code === "ERR_CANCELED" ||
                err.message === "重复请求，自动取消上一次")
            ) {
              continue;
            }
            failCount++;
            failItems.push(node.keyPath);
            translateManager.addFailItem(node.keyPath);
          }
        }

        // 最终更新进度
        translateManager.updateProgress(
          leafNodes.length,
          successCount,
          failCount,
          "",
          ""
        );

        // 保存翻译结果
        try {
          await requestSaveLanguageValuesApi(targetLangCode, targetData);
          const successMessage = this.$t(
            "superPanel.i18n.translate.batchSuccess",
            { lang: targetLangName, success: successCount, fail: failCount }
          );

          // 如果是取消的，显示取消提示
          if (translateManager.state.isCancelled) {
            const cancelMessage = this.$t(
              "superPanel.i18n.translate.cancelled",
              { lang: targetLangName, completed: successCount, fail: failCount }
            );
            translateManager.finishTranslate(false, cancelMessage);
          } else {
            translateManager.finishTranslate(true, successMessage);
          }

          this.$message.success(successMessage);

          if (failItems.length > 0 && failItems.length <= 10) {
            // TODO: 失败项较少时，显示详细的失败列表
          }
          // 翻译完成后不自动刷新，避免后端接口异常导致"加载中"和错误提示
          // 用户可以手动点击刷新按钮查看翻译结果
          // if (this.activeTab === targetLangCode) {
          //   try {
          //     await this.loadCurrentFile(false);
          //   } catch (e) {
          //     console.error("[I18N] 翻译完成后自动刷新失败:", e);
          //   }
          // }
        } catch (saveErr) {
          const saveFailedMessage = this.$t(
            "superPanel.i18n.translate.saveFailed"
          );
          translateManager.finishTranslate(false, saveFailedMessage);
          this.$message.error(saveFailedMessage);
        }
      } catch (err) {
        const errorMessage =
          this.$t("superPanel.i18n.translate.failed");
        translateManager.finishTranslate(false, errorMessage);
        this.$message.error(errorMessage);
      }
    },

    // ========== 右键菜单 ==========

    showContextMenu(event, node, data) {
      // 兼容 Element UI 参数顺序：确保 data 是我们自定义的数据对象（有 keyPath 字段）
      // 如果第二个参数是 Node 对象，第三个参数是自定义数据，就交换
      let realNode = node;
      let realData = data;
      if (node && !node.keyPath && node.data && node.data.keyPath) {
        realNode = node;
        realData = node.data;
      } else if (data && !data.keyPath && data.data && data.data.keyPath) {
        realNode = data;
        realData = data.data;
      }
      this.contextMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        node: realNode,
        data: realData,
      };
    },

    hideContextMenu() {
      this.contextMenu.visible = false;
    },

    handleAddChild() {
      const data = this.contextMenu.data;
      this.hideContextMenu();
      if (data.isLeaf) {
        this.$message.warning(
          this.$t("superPanel.i18n.node.cannotAddChildToLeaf")
        );
        return;
      }
      this.openAddDialog("addChild", data.keyPath);
    },

    handleAddSibling() {
      const data = this.contextMenu.data;
      this.hideContextMenu();
      const parentPath = data.keyPath.split(".").slice(0, -1).join(".");
      this.openAddDialog("addSibling", parentPath);
    },

    async handleDeleteNode() {
      const data = this.contextMenu.data;
      this.hideContextMenu();

      try {
        await this.$confirm(
          `${this.$t("superPanel.i18n.node.confirmDelete")}: ${
            data.keyPath
          }`,
          this.$t("common.tip"),
          { type: "warning" }
        );
      } catch {
        return;
      }

      try {
        await requestDeleteNodeApi({ langCode: this.activeTab, keyPath: data.keyPath });
        this.$message.success(
          this.$t("superPanel.i18n.common.deleteSuccess")
        );
        await this.loadCurrentFile();
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.common.deleteFailed")
        );
      }
    },

    // ========== 新增配置 ==========

    openAddDialog(mode = "add", parentPath = "") {
      this.addDialog.mode = mode;
      // 先构建好完整的 values 对象，避免 Vue2 响应式问题
      const values = {};
      for (const file of this.fileList) {
        values[file.langCode] = "";
      }
      this.addDialog.form = {
        parentPath,
        key: "",
        values,
      };
      // 重置翻译状态
      this.addDialog.translating = {};
      this.cascaderOptions = this.buildCascaderOptionsFromData(
        this.currentData,
        ""
      );
      this.addDialog.parentPathArray = parentPath ? parentPath.split(".") : [];
      this.addDialog.visible = true;
    },

    buildCascaderOptionsFromData(data, prefix) {
      const result = [];
      if (!data || typeof data !== "object") return result;
      for (const [key, value] of Object.entries(data)) {
        const keyPath = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          result.push({
            keyPath,
            label: key,
            children: this.buildCascaderOptionsFromData(value, keyPath),
          });
        }
      }
      return result;
    },

    handleParentPathChange(value) {
      if (value && value.length > 0) {
        this.addDialog.form.parentPath = value.join(".");
      } else {
        this.addDialog.form.parentPath = "";
      }
    },

    async handleAddConfig() {
      const { parentPath, key, values } = this.addDialog.form;

      if (!key) {
        this.$message.warning(
          this.$t("superPanel.i18n.field.keyNotEmpty")
        );
        return;
      }

      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
        this.$message.warning(
          this.$t("superPanel.i18n.field.keyInvalid")
        );
        return;
      }

      this.addDialog.saving = true;
      try {
        for (const file of this.fileList) {
          const value = values[file.langCode] || "";
          await requestAddNodeApi({ langCode: file.langCode, parentPath, key, value });
        }
        this.$message.success(
          this.$t("superPanel.i18n.common.addSuccess")
        );
        this.addDialog.visible = false;
        await this.loadCurrentFile();
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.common.addFailed")
        );
      } finally {
        this.addDialog.saving = false;
      }
    },

    // ========== 自动翻译 ==========

    async autoTranslate(targetLangCode, format = "title") {
      const masterFileName = this.masterLanguage;
      const sourceText = this.addDialog.form.values[masterFileName];
      if (!sourceText) {
        this.$message.warning(
          this.$t("superPanel.i18n.translate.sourceEmpty")
        );
        return;
      }

      // 设置翻译中状态
      this.$set(this.addDialog.translating, targetLangCode, true);

      try {
        const res = await requestTranslateApi(
          sourceText,
          this.masterLanguage,
          targetLangCode
        );
        // 响应拦截器返回 response.data，翻译结果在 res.data.result 中
        if (res && res.data && res.data.result) {
          // 应用翻译格式
          const formattedResult = applyFormat(res.data.result, format);
          this.$set(
            this.addDialog.form.values,
            targetLangCode,
            formattedResult
          );
          this.$message.success(
            this.$t("superPanel.i18n.translate.success")
          );
        } else {
          this.$message.warning(
            this.$t("superPanel.i18n.translate.failed")
          );
        }
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.translate.failed")
        );
      } finally {
        this.$set(this.addDialog.translating, targetLangCode, false);
      }
    },

    // 详情区单项自动翻译
    async autoTranslateDetailItem(item, format = "title") {
      // 获取中文语言中对应 keyPath 的 value
      const sourceText = this.getValueByPath(this.zhData, item.keyPath);
      if (!sourceText) {
        // 中文语言包中找不到对应的 key，给出明确的错误提示
        this.$message.error(
          `${this.$t(
            "superPanel.i18n.translate.zhNotFound"
          )}: ${item.keyPath}`
        );
        return;
      }

      // 设置翻译中状态
      this.$set(this.detailTranslating, item.keyPath, true);

      try {
        const res = await requestTranslateApi(
          sourceText,
          this.masterLanguage,
          this.activeTab
        );
        // 响应拦截器返回 response.data，翻译结果在 res.data.result 中
        if (res && res.data && res.data.result) {
          // 应用翻译格式
          const formattedResult = applyFormat(res.data.result, format);
          // 更新当前语言中对应 keyPath 的 value
          this.updateDataByPath(item.keyPath, formattedResult);
          // 更新 detailList 中对应 item 的 value
          item.value = formattedResult;
          // 标记为已修改
          this.modifiedKeys.add(item.keyPath);
          // 给出明确的成功提示，显示翻译的源内容和结果
          this.$message.success(
            `${this.$t(
              "superPanel.i18n.translate.success"
            )}: 「${sourceText}」→ 「${formattedResult}」`
          );
        } else {
          this.$message.warning(
            this.$t("superPanel.i18n.translate.failed")
          );
        }
      } catch (err) {
        this.$message.error(
          this.$t("superPanel.i18n.translate.failed")
        );
      } finally {
        this.$set(this.detailTranslating, item.keyPath, false);
      }
    },
  },
};
</script>

<style scoped>
/* 只读路径输入框灰色样式 */
.readonly-path-input >>> .el-input__inner {
  background-color: #f5f7fa !important;
  color: #909399 !important;
  cursor: not-allowed !important;
}

.i18n-manager-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-left .page-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-left .page-desc {
  font-size: 13px;
  color: #909399;
}

.header-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ========== 主体包装 ========== */

.main-wrapper {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 180px);
  overflow: hidden;
}

/* ========== 自定义语言 Tab 栏 ========== */

.lang-tabs {
  display: flex;
  gap: 4px;
  padding: 12px 16px 0 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;
}

.lang-tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.lang-tab-item:hover {
  color: #409eff;
  background: #ecf5ff;
}

.lang-tab-item.active {
  color: #409eff;
  background: #fff;
  border-color: #e4e7ed;
  font-weight: 500;
}

.lang-tab-item i {
  font-size: 16px;
}

/* ========== 未选择语言提示区域 ========== */

.language-empty-tip {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.language-empty-tip .tip-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ecf5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.language-empty-tip .tip-icon i {
  font-size: 40px;
  color: #409eff;
}

.language-empty-tip .tip-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.language-empty-tip .tip-desc {
  margin: 0 0 32px 0;
  font-size: 14px;
  color: #909399;
  text-align: center;
  max-width: 500px;
}

.tip-language-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.language-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
}

.language-card:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(64, 158, 255, 0.2);
}

.language-card i {
  font-size: 18px;
}

/* ========== 编辑区域 ========== */

.editor-area {
  padding: 16px;
}

.main-content {
  display: flex;
  min-height: calc(100vh - 300px);
}

/* ========== 可拖拽分隔条 ========== */

.resizer {
  width: 8px;
  cursor: col-resize;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}

.resizer:hover,
.resizer.dragging {
  background: #ecf5ff;
}

.resizer-handle {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 2px;
  border-radius: 2px;
  background: transparent;
  transition: background 0.2s;
}

.resizer:hover .resizer-handle,
.resizer.dragging .resizer-handle {
  background: #409eff;
}

.resizer-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c0c4cc;
  transition: background 0.2s;
}

.resizer:hover .resizer-dot,
.resizer.dragging .resizer-dot {
  background: #fff;
}

/* ========== 左边树形导航区 ========== */

.tree-panel {
  min-width: 200px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.tree-search {
  width: 100%;
}

/* 搜索结果工具栏 */
.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 6px 8px;
  background: #ecf5ff;
  border-radius: 4px;
}

.search-count-text {
  font-size: 12px;
  color: #409eff;
  font-weight: 500;
}

.search-no-result {
  margin-top: 8px;
  padding: 6px 8px;
  background: #fdf6ec;
  border-radius: 4px;
  text-align: center;
}

.search-no-result span {
  font-size: 12px;
  color: #e6a23c;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

/* 统计栏 */
.tree-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 8px;
  margin-top: 8px;
  background: #f5f7fa;
  border-top: 1px solid #ebeef5;
  border-radius: 0 0 4px 4px;
  flex-shrink: 0;
}

.footer-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.footer-stat i {
  font-size: 14px;
}

.footer-stat.footer-total {
  color: #409eff;
  font-weight: 500;
}

.i18n-tree {
  background: transparent;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 8px;
  font-size: 13px;
}

.tree-node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-node-count {
  color: #909399;
  font-size: 12px;
}

/* 搜索状态下匹配节点高亮 */
.match-node {
  color: #f56c6c;
  font-weight: bold;
}

/* 搜索状态下中间父节点（包含匹配子节点） */
.parent-match-node {
  color: #e6a23c;
}

/* 匹配标识徽章 */
.match-badge {
  display: inline-block;
  padding: 0 6px;
  background: #f56c6c;
  color: #fff;
  font-size: 10px;
  border-radius: 2px;
  line-height: 16px;
  margin-left: 4px;
}

/* 匹配数量徽章 */
.match-count-badge {
  display: inline-block;
  padding: 0 6px;
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f5dab1;
  font-size: 10px;
  border-radius: 2px;
  line-height: 14px;
  margin-left: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #909399;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ========== 右边详情编辑区 ========== */

.detail-panel {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.breadcrumb-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
  gap: 8px;
}

.breadcrumb-label {
  font-size: 13px;
  color: #606266;
  flex-shrink: 0;
}

.breadcrumb-actions {
  margin-left: auto;
}

.breadcrumb-bar >>> .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #409eff;
  font-weight: 500;
}

.breadcrumb-bar >>> .el-breadcrumb__inner.clickable {
  cursor: pointer;
  color: #606266;
}

.breadcrumb-bar >>> .el-breadcrumb__inner.clickable:hover {
  color: #409eff;
}

/* 叶子节点编辑 */

.leaf-editor {
  padding: 20px;
}

.leaf-info {
  margin-bottom: 12px;
}

.leaf-key {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  background: #ecf5ff;
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
}

/* 子节点列表 */

.detail-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.header-key {
  width: 30%;
  flex-shrink: 0;
}

.header-value {
  flex: 1;
}

.header-actions {
  width: 160px;
  text-align: right;
  flex-shrink: 0;
}

.list-body {
  flex: 1;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.2s;
}

.list-item:hover {
  background: #f5f7fa;
}

.list-item.modified {
  background: #fdf6ec;
}

.item-key {
  width: 30%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #303133;
  cursor: pointer;
  overflow: hidden;
}

.item-key:hover {
  color: #409eff;
}

.item-value {
  flex: 1;
  padding-right: 16px;
}

.item-value-folder {
  color: #909399;
  font-size: 13px;
  cursor: pointer;
}

.item-value-folder:hover {
  color: #409eff;
}

.item-actions {
  width: 160px;
  text-align: right;
  flex-shrink: 0;
}

.delete-btn {
  color: #f56c6c;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #909399;
}

.empty-list i {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-list p {
  margin: 0;
  font-size: 14px;
}

/* 未选择节点提示 */

.detail-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.detail-empty i {
  font-size: 48px;
  margin-bottom: 16px;
}

.detail-empty p {
  margin: 0;
  font-size: 14px;
}

/* ========== 右键菜单 ========== */

.context-menu {
  position: fixed;
  z-index: 9999;
  list-style: none;
  margin: 0;
  padding: 6px 0;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 140px;
}

.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
  transition: background 0.2s;
}

.context-menu li:hover {
  background: #f5f7fa;
  color: #409eff;
}

.context-menu li.danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.context-menu li.divider {
  padding: 0;
  margin: 4px 0;
  border-top: 1px solid #ebeef5;
  cursor: default;
}

.context-menu li.divider:hover {
  background: transparent;
}

.context-menu li.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.context-menu li.disabled:hover {
  background: transparent;
  color: #c0c4cc;
}

/* ========== 自动翻译按钮 ========== */

.auto-translate-btn {
  margin-left: 8px;
}

.auto-translate-btn-text {
  padding: 0 4px;
}

.auto-translate-question {
  margin-left: 2px;
  font-size: 12px;
  color: #c0c4cc;
}

.auto-translate-question:hover {
  color: #409eff;
}

/* ========== 新增对话框 ========== */

.value-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.value-input-wrapper .el-input {
  flex: 1;
}

/* ========== 带问号提示的 label ========== */
.label-with-tip {
  display: inline-flex;
  align-items: center;
  width: 150px;
  gap: 4px;
}

.label-tip-icon {
  color: #c0c4cc;
  cursor: help;
  font-size: 14px;
  transition: color 0.2s;
}

.label-tip-icon:hover {
  color: #409eff;
}

/* ========== 备份清单 ========== */
.backup-list-section {
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
}

.backup-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.backup-list-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.backup-list-container {
  position: relative;
}

.backup-list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #909399;
  gap: 8px;
}

.backup-list-empty i {
  font-size: 32px;
}

.delete-btn {
  color: #f56c6c;
}

/* ========== 批量翻译确认对话框 ========== */
.batch-translate-content {
  padding: 8px 0;
}

.batch-translate-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #fdf6ec;
  border-radius: 4px;
  margin-bottom: 20px;
}

.batch-translate-info i {
  color: #e6a23c;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.batch-translate-info span {
  font-size: 13px;
  color: #e6a23c;
  line-height: 1.5;
}

.node-path-label {
  color: #409eff;
  font-weight: 500;
  margin-left: 4px;
}

.batch-translate-mode {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.batch-translate-mode .el-radio {
  display: flex;
  align-items: flex-start;
  margin-right: 0;
  height: auto;
  line-height: normal;
}

.batch-translate-mode .el-radio__input {
  margin-top: 3px;
}

.batch-translate-mode .el-radio__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 8px;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
}

.radio-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  padding-left: 4px;
}

/* ========== 批量对比字段对话框 ========== */
.batch-compare-config {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.readonly-language-input {
  background-color: #f5f7fa !important;
  color: #909399 !important;
  cursor: not-allowed;
}

.readonly-language-input >>> .el-input__inner {
  background-color: #f5f7fa;
  color: #909399;
  cursor: not-allowed;
}

/* 统计信息区 */
.batch-compare-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  padding: 16px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #ebeef5;
}

.stat-blue {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #b3d8ff;
}

.stat-orange {
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  border-color: #f5dab1;
}

.stat-green {
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  border-color: #c2e7b0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 12px;
  color: #606266;
}

/* 详细报告区 */
.batch-compare-result {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}

.result-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.result-toolbar >>> .el-tabs__header {
  margin-bottom: 0;
}

.result-toolbar >>> .el-tabs__item {
  height: 36px;
  line-height: 36px;
  font-size: 13px;
  padding: 0 18px;
}

.result-table-wrapper {
  padding: 0;
  background: #fff;
}

.result-table-wrapper >>> .el-table {
  border-radius: 0;
}

.result-table-wrapper >>> .el-table th {
  background: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.text-muted {
  color: #c0c4cc;
}

/* 空状态提示 */
.batch-compare-empty {
  text-align: center;
  padding: 60px 20px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
  box-sizing: border-box;
}

.batch-compare-empty i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.batch-compare-empty p {
  font-size: 14px;
  margin: 0;
}
.source-lang-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}
</style>