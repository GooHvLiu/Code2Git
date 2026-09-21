<template>
  <div class="database-manager">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.database.page.title') }}</h2>
        <p class="page-desc">{{ t('superPanel.database.page.desc') }}</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="small" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>&nbsp;{{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-change="handleTabChange">
      <!-- 1. 数据查看 -->
      <el-tab-pane :label="t('superPanel.database.tab.dataView')" name="dataView">
        <div class="tab-content">
          <!-- 左侧表列表（卡片式设计） -->
          <div class="table-list-panel">
            <div class="panel-header">
              <div class="header-right">
                <el-tooltip placement="top" :content="t('superPanel.database.dataView.expandAll')">
                  <button class="expand-collapse-btn" @click="expandAll">
                    <el-icon><ArrowDown /></el-icon>
                  </button>
                </el-tooltip>
                <el-tooltip placement="top" :content="t('superPanel.database.dataView.collapseAll')">
                  <button class="expand-collapse-btn" @click="collapseAll">
                    <el-icon><ArrowRight /></el-icon>
                  </button>
                </el-tooltip>
                <el-input v-model="tableSearch" :placeholder="t('superPanel.database.dataView.searchTable')" size="small" clearable style="width: 160px" />
                <el-tooltip placement="top" :content="t('superPanel.database.dataView.configFileTip')">
                  <el-icon class="config-help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="table-list">
              <div v-for="(group, categoryKey) in tablesByCategory" :key="categoryKey" class="table-category">
                <div class="category-title" @click="toggleCategory(categoryKey)">
                  <el-icon class="category-arrow">
                    <ArrowDown v-if="expandedCategories[categoryKey]" />
                    <ArrowRight v-else />
                  </el-icon>
                  <el-icon>
                    <FolderOpened v-if="expandedCategories[categoryKey]" />
                    <Folder v-else />
                  </el-icon>
                  <span>{{ getCategoryName(categoryKey, group.name) }}</span>
                  <span class="category-count">{{ group.tables.length }}</span>
                </div>
                <div v-show="expandedCategories[categoryKey]" class="category-tables">
                  <div
                    v-for="table in group.tables"
                    :key="table.table_name"
                    class="table-card"
                    :class="{ active: selectedTable === table.table_name }"
                    @click="selectTable(table.table_name)"
                  >
                    <div class="card-header">
                      <el-icon class="card-icon"><component :is="getTableIcon(table.table_icon)" /></el-icon>
                      <span class="card-alias">{{ getTableAlias(table) }}</span>
                    </div>
                    <div class="card-name">{{ table.table_name }}</div>
                    <div class="card-desc">{{ getTableComment(table) }}</div>
                    <div class="card-stats">
                      <span class="stat"><el-icon><DataLine /></el-icon>{{ table.table_rows || 0 }} {{ t('superPanel.database.dataView.rows') }}</span>
                      <span class="stat"><el-icon><Files /></el-icon>{{ formatFileSize(table.data_length || 0) }}</span>
                    </div>
                    <div v-if="selectedTable === table.table_name" class="card-connector"><el-icon><ArrowRight /></el-icon></div>
                  </div>
                </div>
              </div>
              <div v-if="filteredTables.length === 0" class="empty-tip">{{ t('superPanel.database.dataView.noTable') }}</div>
            </div>
          </div>

          <!-- 右侧数据展示 -->
          <div class="data-panel">
            <div v-if="!selectedTable" class="empty-data">
              <el-icon class="empty-icon"><Histogram /></el-icon>
              <p>{{ t('superPanel.database.dataView.selectTip') }}</p>
            </div>
            <div v-else class="data-content">
              <div class="data-header">
                <div class="data-title">
                  <el-icon class="title-icon"><component :is="getTableIcon(currentTableInfo?.table_icon)" /></el-icon>
                  <div class="title-text">
                    <h3 class="title-alias">{{ getTableAlias(currentTableInfo) || selectedTable }}</h3>
                    <span class="title-name">{{ selectedTable }}</span>
                  </div>
                  <el-tag size="small" type="info" effect="plain">
                    {{ getCategoryName(currentTableInfo?.table_category_key, currentTableInfo?.table_category || t('superPanel.database.categories.other')) }}
                  </el-tag>
                  <el-button size="small" type="primary" @click="loadTableData">{{ t('superPanel.database.page.refresh') }}</el-button>
                </div>
                <div class="data-search">
                  <el-input v-model="dataSearch" :placeholder="t('superPanel.database.dataView.searchData')" size="small" clearable style="width: 200px" @keyup.enter="loadTableData" />
                  <el-button size="small" type="primary" @click="loadTableData">{{ t('superPanel.database.page.search') }}</el-button>
                </div>
              </div>

              <div class="table-stats-bar">
                <div class="stat-item">
                  <el-icon><DataLine /></el-icon>
                  <span class="stat-label">{{ t('superPanel.database.dataView.dataRows') }}</span>
                  <span class="stat-value">{{ dataTotal }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><Files /></el-icon>
                  <span class="stat-label">{{ t('superPanel.database.dataView.fieldCount') }}</span>
                  <span class="stat-value">{{ tableColumns.length }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><Document /></el-icon>
                  <span class="stat-label">{{ t('superPanel.database.dataView.description') }}</span>
                  <span class="stat-value">{{ getTableComment(currentTableInfo) }}</span>
                </div>
              </div>

              <el-table v-loading="dataLoading" :data="tableData" border stripe size="small" :element-loading-text="t('common.loading')" max-height="500">
                <el-table-column v-for="col in tableColumns" :key="col" :prop="col" :label="col" :min-width="80" align="center" class-name="auto-width-col" show-overflow-tooltip />
              </el-table>

              <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="dataTotal" :page-size="dataPageSize" :current-page="dataPage" :page-sizes="[10, 20, 50, 100]" @size-change="handleDataSizeChange" @current-change="handleDataPageChange" />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 2. 配置表编辑 -->
      <el-tab-pane :label="t('superPanel.database.tab.tableEdit')" name="tableEdit">
        <div class="tab-content edit-tab-content">
          <div class="config-list-panel">
            <div class="panel-header">
              <span class="panel-title">{{ t('superPanel.database.dataView.selectConfig') }}</span>
            </div>
            <div class="config-list">
              <div
                v-for="table in processedConfigTables"
                :key="table.table_name"
                class="config-card"
                :class="{ active: editTableName === table.table_name }"
                @click="selectConfigTable(table.table_name)"
              >
                <div class="card-header">
                  <el-icon class="card-icon"><component :is="getTableIcon(table.table_icon)" /></el-icon>
                  <span class="card-alias">{{ getTableAlias(table) }}</span>
                </div>
                <div class="card-name">{{ table.table_name }}</div>
                <div class="card-stats">
                  <span class="stat"><el-icon><DataLine /></el-icon>{{ table.table_rows || 0 }} {{ t('superPanel.database.dataView.rows') }}</span>
                </div>
                <div v-if="editTableName === table.table_name" class="card-connector"><el-icon><ArrowRight /></el-icon></div>
              </div>
              <div v-if="configTables.length === 0" class="empty-tip">{{ t('superPanel.database.dataView.noConfigTable') }}</div>
            </div>
          </div>

          <div class="edit-panel">
            <div v-if="!editTableName" class="empty-data">
              <el-icon class="empty-icon"><Document /></el-icon>
              <p>{{ t('superPanel.database.dataView.selectConfigTip') }}</p>
            </div>
            <div v-else class="edit-content">
              <div class="edit-content-header">
                <div class="edit-title">
                  <el-icon class="title-icon"><component :is="getTableIcon(currentEditTableInfo?.table_icon)" /></el-icon>
                  <div class="title-text">
                    <h3 class="title-alias">{{ getTableAlias(currentEditTableInfo) || editTableName }}</h3>
                    <span class="title-name">{{ editTableName }}</span>
                  </div>
                </div>
                <div class="edit-actions">
                  <el-button size="small" type="primary" @click="openAddDialog">{{ t('superPanel.database.dataView.addRecord') }}</el-button>
                  <el-button size="small" @click="loadEditData">{{ t('superPanel.database.page.refresh') }}</el-button>
                </div>
              </div>

              <div class="edit-table-wrapper">
                <el-table v-loading="editLoading" :data="editData" border stripe size="small" :element-loading-text="t('common.loading')" max-height="450" class="config-edit-table">
                  <el-table-column v-for="col in editColumns" :key="col" :prop="col" :label="col" :min-width="100" align="center" show-overflow-tooltip />
                  <el-table-column :label="t('superPanel.database.page.operation')" width="120" fixed="right" align="center">
                    <template #default="scope">
                      <el-button type="text" size="small" @click="openEditDialog(scope.row)">{{ t('superPanel.database.dataView.edit') }}</el-button>
                      <el-button type="text" size="small" style="color: var(--el-color-danger)" @click="handleDeleteRecord(scope.row)">{{ t('superPanel.database.page.delete') }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="editTotal" :page-size="editPageSize" :current-page="editPage" :page-sizes="[10, 20, 50, 100]" @size-change="handleEditSizeChange" @current-change="handleEditPageChange" />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 3. 版本备份 -->
      <el-tab-pane :label="t('superPanel.database.tab.backup')" name="backup">
        <div class="tab-content backup-tab-content">
          <div class="backup-stats">
            <div class="stat-card">
              <div class="stat-icon total"><el-icon><FolderOpened /></el-icon></div>
              <div class="stat-info"><div class="stat-value">{{ backupTotal }}</div><div class="stat-label">{{ t('superPanel.database.backup.total') }}</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon success"><el-icon><CircleCheckFilled /></el-icon></div>
              <div class="stat-info"><div class="stat-value">{{ successBackupCount }}</div><div class="stat-label">{{ t('superPanel.database.backup.successCount') }}</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon failed"><el-icon><CircleCloseFilled /></el-icon></div>
              <div class="stat-info"><div class="stat-value">{{ failedBackupCount }}</div><div class="stat-label">{{ t('superPanel.database.backup.failedCount') }}</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon size"><el-icon><Files /></el-icon></div>
              <div class="stat-info"><div class="stat-value">{{ totalBackupSize }}</div><div class="stat-label">{{ t('superPanel.database.page.totalSize') }}</div></div>
            </div>
          </div>

          <div class="backup-header">
            <div class="backup-actions">
              <el-button type="primary" size="small" @click="openBackupDialog">{{ t('superPanel.database.backup.create') }}</el-button>
              <el-button size="small" @click="loadBackupList">{{ t('superPanel.database.page.refresh') }}</el-button>
              <el-button size="small" @click="openPathDialog">{{ t('superPanel.database.path.change') }}</el-button>
              <el-tooltip :content="t('superPanel.database.path.currentStorage') + (backupConfig.storagePath || t('superPanel.database.path.default'))" placement="top" effect="dark">
                <span class="path-question">?</span>
              </el-tooltip>
            </div>
            <div class="backup-tip"><el-icon><InfoFilled /></el-icon>{{ t('superPanel.database.backup.tip') }}</div>
          </div>

          <el-table v-loading="backupLoading" :data="backupList" border stripe size="small" :element-loading-text="t('common.loading')">
            <el-table-column prop="backup_name" :label="t('superPanel.database.backup.name')" :min-width="120" align="center" class-name="auto-width-col" show-overflow-tooltip />
            <el-table-column prop="backup_type" :label="t('superPanel.database.backup.type')" width="90" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.backup_type === 'full'" size="small" type="success">{{ t('superPanel.database.backup.fullType') }}</el-tag>
                <el-tag v-else size="small" type="warning">{{ t('superPanel.database.backup.tableType') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="table_name" :label="t('superPanel.database.dataView.name')" :min-width="100" align="center" class-name="auto-width-col" show-overflow-tooltip>
              <template #default="scope">{{ scope.row.table_name || '-' }}</template>
            </el-table-column>
            <el-table-column prop="file_size_formatted" :label="t('superPanel.database.page.fileSize')" width="100" align="center" />
            <el-table-column prop="remark" :label="t('superPanel.database.page.remark')" :min-width="120" align="center" class-name="auto-width-col" show-overflow-tooltip>
              <template #default="scope">{{ scope.row.remark || '-' }}</template>
            </el-table-column>
            <el-table-column prop="operator" :label="t('superPanel.database.page.operator')" width="100" align="center" />
            <el-table-column prop="status" :label="t('superPanel.database.page.status')" width="80" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.status === 'success'" size="small" type="success">{{ t('superPanel.database.page.success') }}</el-tag>
                <el-tag v-else size="small" type="danger">{{ t('superPanel.database.page.failed') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="t('superPanel.database.page.createTime')" width="180" align="center">
              <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
            </el-table-column>
            <el-table-column :label="t('superPanel.database.page.operation')" width="150" fixed="right" align="center">
              <template #default="scope">
                <el-button type="text" size="small" style="color: var(--el-color-warning)" :disabled="scope.row.status !== 'success'" @click="handleRestore(scope.row as BackupRow)">{{ t('superPanel.database.restore.action') }}</el-button>
                <el-button type="text" size="small" style="color: var(--el-color-danger)" @click="handleDeleteBackup(scope.row as BackupRow)">{{ t('superPanel.database.page.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="backupTotal" :page-size="backupPageSize" :current-page="backupPage" :page-sizes="[10, 20, 50, 100]" @size-change="handleBackupSizeChange" @current-change="handleBackupPageChange" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 4. 回滚指南 -->
      <el-tab-pane :label="t('superPanel.database.tab.restore')" name="restore">
        <div class="tab-content">
          <div class="restore-guide">
            <h3>{{ t('superPanel.database.restore.guideTitle') }}</h3>
            <div class="guide-steps">
              <div class="step"><div class="step-number">1</div><div class="step-content"><h4>{{ t('superPanel.database.restore.step1Title') }}</h4><p>{{ t('superPanel.database.restore.step1Desc') }}</p></div></div>
              <div class="step"><div class="step-number">2</div><div class="step-content"><h4>{{ t('superPanel.database.restore.step2Title') }}</h4><p>{{ t('superPanel.database.restore.step2Desc') }}</p></div></div>
              <div class="step"><div class="step-number">3</div><div class="step-content"><h4>{{ t('superPanel.database.restore.step3Title') }}</h4><p>{{ t('superPanel.database.restore.step3Desc') }}</p></div></div>
              <div class="step"><div class="step-number">4</div><div class="step-content"><h4>{{ t('superPanel.database.restore.step4Title') }}</h4><p>{{ t('superPanel.database.restore.step4Desc') }}</p></div></div>
            </div>
            <div class="restore-warning">
              <el-icon><WarningFilled /></el-icon>
              <div>
                <h4>{{ t('superPanel.database.restore.warningTitle') }}</h4>
                <ul>
                  <li>{{ t('superPanel.database.restore.warning1') }}</li>
                  <li>{{ t('superPanel.database.restore.warning2') }}</li>
                  <li>{{ t('superPanel.database.restore.warning3') }}</li>
                </ul>
              </div>
            </div>
            <div class="restore-action">
              <el-button type="primary" @click="activeTab = 'backup'">{{ t('superPanel.database.backup.goTo') }}</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑记录弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="editDialogTitle" width="600px" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="160px" size="small">
        <el-form-item v-for="col in editFormColumns" :key="col">
          <template #label>
            {{ col }}
            <el-tooltip :content="t('superPanel.database.dataView.fieldValueTip')" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="editForm[col]" :placeholder="t('superPanel.database.dataView.fieldSearchPlaceholder') + col" :disabled="isPrimaryKey(col) && editMode === 'edit'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">{{ t('superPanel.database.page.cancel') }}</el-button>
        <el-button type="primary" @click="saveEditRecord">{{ t('superPanel.database.page.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 创建备份弹窗 -->
    <el-dialog v-model="backupDialogVisible" :title="t('superPanel.database.backup.create')" width="500px" :close-on-click-modal="false">
      <el-form :model="backupForm" label-width="100px" size="small">
        <el-form-item :label="t('superPanel.database.backup.type')">
          <el-radio-group v-model="backupForm.backupType">
            <el-radio value="full">{{ t('superPanel.database.backup.fullType') }}</el-radio>
            <el-radio value="table">{{ t('superPanel.database.backup.tableType') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="backupForm.backupType === 'table'" :label="t('superPanel.database.dataView.select')">
          <el-select v-model="backupForm.tableName" style="width: 100%">
            <el-option v-for="table in allTables" :key="table.table_name" :label="table.table_name" :value="table.table_name" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('superPanel.database.page.remark')">
          <el-input v-model="backupForm.remark" type="textarea" :rows="3" :placeholder="t('superPanel.database.backup.remarkPlaceholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="backupDialogVisible = false">{{ t('superPanel.database.page.cancel') }}</el-button>
        <el-button type="primary" :loading="backupCreating" @click="confirmCreateBackup">{{ t('superPanel.database.page.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 修改存储路径弹窗 -->
    <el-dialog v-model="pathDialogVisible" :title="t('superPanel.database.path.dialogTitle')" width="550px" :close-on-click-modal="false">
      <el-form :model="pathForm" label-width="120px" size="small">
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.database.path.current') }}
              <el-tooltip :content="t('superPanel.database.path.currentTip')" placement="top"><el-icon class="label-tip-icon"><QuestionFilled /></el-icon></el-tooltip>
            </span>
          </template>
          <span style="color: #909399">{{ backupConfig.storagePath || t('superPanel.database.path.default') }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.database.path.new') }}
              <el-tooltip :content="t('superPanel.database.path.newTip')" placement="top"><el-icon class="label-tip-icon"><QuestionFilled /></el-icon></el-tooltip>
            </span>
          </template>
          <el-input v-model="pathForm.newPath" :placeholder="t('superPanel.database.path.newPlaceholder')">
            <template #append>
              <el-button @click="triggerFolderSelect">{{ t('superPanel.database.path.browse') }}</el-button>
            </template>
          </el-input>
          <input ref="folderInput" type="file" webkitdirectory directory style="display: none" @change="handleFolderSelect" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.database.path.quick') }}
              <el-tooltip :content="t('superPanel.database.path.quickTip')" placement="top"><el-icon><QuestionFilled /></el-icon></el-tooltip>
            </span>
          </template>
          <div class="quick-paths">
            <el-tag v-for="path in quickPaths" :key="path" size="small" class="quick-path-tag" @click="pathForm.newPath = path">{{ path }}</el-tag>
          </div>
        </el-form-item>
        <el-form-item>
          <el-alert :title="t('superPanel.database.path.warning')" type="warning" :closable="false" show-icon />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="pathDialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="confirmChangePath">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 数据库管理：数据查看 / 配置表编辑 / 版本备份 / 回滚指南
 * @author GooHv
 */
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from '@/composables/useI18n'
import { showError, showSuccess, showWarning, showInfo, confirmAction } from '@/utils/ui/feedback'
import {
  requestGetAllTablesApi,
  requestGetTableDataApi,
  requestUpdateTableDataApi,
  requestInsertTableDataApi,
  requestDeleteTableDataApi,
  requestCreateBackupApi,
  requestGetBackupListApi,
  requestDeleteBackupApi,
  requestRestoreBackupApi
} from '@/api'
import { getTableAliasMap, type DbTableAliasInfo } from '@/config/database.config'
import {
  Refresh, ArrowDown, ArrowRight, QuestionFilled, Folder, FolderOpened, DataLine, Files, Document,
  Histogram, CircleCheckFilled, CircleCloseFilled, InfoFilled, WarningFilled, Plus, Edit, Delete,
  Setting, Key, Menu, Link, OfficeBuilding, Notebook, User, UserFilled, Lock, DocumentChecked,
  Message, Postcard, Bell, Cpu, Tools, Search, Download, Monitor
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

const { t, locale } = useI18n()

const tableAliasMap = getTableAliasMap() as Record<string, DbTableAliasInfo>

/** element-ui 图标类名 -> Element Plus 图标组件 映射（去掉 el-icon- 前缀查表） */
const ICON_MAP: Record<string, Component> = {
  key: Key, menu: Menu, setting: Setting, link: Link, 'office-building': OfficeBuilding,
  'notebook-2': Notebook, document: Document, user: User, 's-custom': UserFilled, lock: Lock,
  'document-checked': DocumentChecked, notebook: Notebook, message: Message,
  postcard: Postcard, bell: Bell, monitor: Monitor, cpu: Cpu, files: Files, refresh: Refresh,
  's-data': DataLine, 's-tools': Tools, search: Search, download: Download, plus: Plus,
  edit: Edit, delete: Delete, 'refresh-left': Refresh, database: Histogram
}

function getTableIcon(iconClass?: string): Component {
  if (!iconClass) return Histogram
  const name = iconClass.replace(/^el-/, '')
  return ICON_MAP[name] || Histogram
}

interface TableRow extends Record<string, unknown> {
  table_name: string
  table_comment?: string
  table_rows?: number
  data_length?: number
}
interface ProcessedTable extends TableRow {
  table_alias: string
  table_alias_en: string
  table_comment_config: string
  table_comment_en_config: string
  table_category: string
  table_category_key: string
  table_icon: string
}
interface BackupRow extends Record<string, unknown> {
  id: string | number
  backup_name: string
  backup_type: string
  table_name?: string
  file_size?: number
  file_size_formatted?: string
  remark?: string
  operator?: string
  status: string
  create_time: string
}

const activeTab = ref('dataView')

// 备份存储路径配置
const backupConfig = reactive({ storagePath: '' })
const pathDialogVisible = ref(false)
const pathForm = reactive({ newPath: '' })
const quickPaths = ['backups/database', 'D:/backups/database', 'E:/backups/database', 'F:/backups/database', './backups/database']

// 数据查看
const allTables = ref<TableRow[]>([])
const tableSearch = ref('')
const selectedTable = ref('')
const tableColumns = ref<string[]>([])
const tableData = ref<Record<string, unknown>[]>([])
const dataLoading = ref(false)
const dataSearch = ref('')
const dataPage = ref(1)
const dataPageSize = ref(20)
const dataTotal = ref(0)
const expandedCategories = reactive<Record<string, boolean>>({})

// 配置表编辑
const configTables = ref<TableRow[]>([])
const editTableName = ref('')
const editColumns = ref<string[]>([])
const editData = ref<Record<string, unknown>[]>([])
const editLoading = ref(false)
const editPage = ref(1)
const editPageSize = ref(20)
const editTotal = ref(0)
const editDialogVisible = ref(false)
const editMode = ref<'add' | 'edit'>('add')
const editForm = reactive<Record<string, any>>({})
const editFormColumns = ref<string[]>([])
const editOriginalRow = ref<Record<string, unknown>>({})

// 版本备份
const backupList = ref<BackupRow[]>([])
const backupLoading = ref(false)
const backupPage = ref(1)
const backupPageSize = ref(20)
const backupTotal = ref(0)
const backupDialogVisible = ref(false)
const backupCreating = ref(false)
const backupForm = reactive({ backupType: 'full', tableName: '', remark: '' })

const folderInput = ref<HTMLInputElement | null>(null)

// ==================== computed ====================
function decorateTable(table: TableRow, fallback: DbTableAliasInfo): ProcessedTable {
  const info = tableAliasMap[table.table_name] || fallback
  return {
    ...table,
    table_alias: info.alias,
    table_alias_en: info.alias_en,
    table_comment_config: info.comment,
    table_comment_en_config: info.comment_en,
    table_category: info.category,
    table_category_key: info.categoryKey,
    table_icon: info.icon
  }
}

const processedTables = computed<ProcessedTable[]>(() =>
  allTables.value.map((table) => decorateTable(table, { alias: table.table_name, alias_en: table.table_name, comment: table.table_comment || '', comment_en: table.table_comment || '', category: '其他', categoryKey: 'other', icon: 'el-icon-database', categoryIcon: 'el-icon-folder' }))
)

const filteredTables = computed<ProcessedTable[]>(() => {
  let tables = processedTables.value
  if (tableSearch.value) {
    const keyword = tableSearch.value.toLowerCase()
    tables = tables.filter(
      (tb) =>
        tb.table_name.toLowerCase().includes(keyword) ||
        tb.table_alias.toLowerCase().includes(keyword) ||
        ((tb.table_comment || '').toLowerCase().includes(keyword))
    )
  }
  return [...tables].sort((a, b) => {
    if (a.table_category !== b.table_category) return a.table_category.localeCompare(b.table_category, 'zh-CN')
    return a.table_name.localeCompare(b.table_name)
  })
})

const tablesByCategory = computed<Record<string, { name: string; tables: ProcessedTable[] }>>(() => {
  const groups: Record<string, { name: string; tables: ProcessedTable[] }> = {}
  filteredTables.value.forEach((table) => {
    const key = table.table_category_key || 'other'
    if (!groups[key]) groups[key] = { name: table.table_category, tables: [] }
    groups[key].tables.push(table)
  })
  return groups
})

const currentTableInfo = computed<ProcessedTable | null>(() =>
  processedTables.value.find((tb) => tb.table_name === selectedTable.value) || null
)

const processedConfigTables = computed<ProcessedTable[]>(() =>
  configTables.value.map((table) => decorateTable(table, { alias: table.table_name, alias_en: table.table_name, comment: table.table_comment || '', comment_en: table.table_comment || '', category: '配置管理', categoryKey: 'config', icon: 'el-icon-setting', categoryIcon: 'el-icon-setting' }))
)

const currentEditTableInfo = computed<ProcessedTable | null>(() =>
  processedConfigTables.value.find((tb) => tb.table_name === editTableName.value) || null
)

const successBackupCount = computed(() => backupList.value.filter((b) => b.status === 'success').length)
const failedBackupCount = computed(() => backupList.value.filter((b) => b.status === 'failed').length)
const totalBackupSize = computed(() => formatFileSize(backupList.value.reduce((sum, b) => sum + (b.file_size || 0), 0)))
const editDialogTitle = computed(() =>
  editMode.value === 'add' ? t('superPanel.database.dataView.addRecord') : t('superPanel.database.dataView.editRecord')
)

watch(tableSearch, (newVal) => { if (newVal) expandAll() })

// ==================== 通用方法 ====================
function handleTabChange(name: string | number | Record<string, unknown>): void {
  const tabName = typeof name === 'string' ? name : ''
  if (tabName === 'backup') loadBackupList()
}

function handleRefresh(): void {
  if (activeTab.value === 'dataView') {
    loadAllTables()
    if (selectedTable.value) loadTableData()
  } else if (activeTab.value === 'tableEdit') {
    if (editTableName.value) loadEditData()
  } else if (activeTab.value === 'backup') {
    loadBackupList()
  }
  showSuccess(t('superPanel.database.messages.refreshSuccess'))
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(value: unknown): string {
  if (!value) return '-'
  return dayjs(value as string).format('YYYY-MM-DD HH:mm:ss')
}

// ==================== 数据查看 ====================
async function loadAllTables(): Promise<void> {
  try {
    const res: any = await requestGetAllTablesApi()
    if (res.code === 200) {
      allTables.value = res.data || []
      configTables.value = allTables.value.filter((tb) => tb.table_name.includes('config') || tb.table_name.includes('feature'))
      await nextTick()
      initExpandedCategories()
    }
  } catch (err: any) {
    console.error('[database] 加载表列表失败:', err)
    showError(t('superPanel.database.messages.loadTablesFailed') + ': ' + (err?.message || ''))
  }
}

function toggleCategory(category: string): void {
  expandedCategories[category] = !expandedCategories[category]
}

function getCategoryName(categoryKey?: string, defaultName?: string): string {
  const key = `superPanel.database.categories.${categoryKey}`
  const translated = t(key)
  if (translated && translated !== key) return translated
  return defaultName || ''
}

function getTableAlias(table?: ProcessedTable | null): string {
  if (!table) return ''
  if (locale.value === 'en-US' && table.table_alias_en) return table.table_alias_en
  return table.table_alias
}

function getTableComment(table?: ProcessedTable | null): string {
  if (!table) return ''
  if (locale.value === 'en-US') {
    return table.table_comment_en_config || table.table_comment || t('superPanel.database.page.noDescription')
  }
  return table.table_comment_config || table.table_comment || t('superPanel.database.page.noDescription')
}

function expandAll(): void {
  Object.keys(tablesByCategory.value).forEach((category) => { expandedCategories[category] = true })
}
function collapseAll(): void {
  Object.keys(tablesByCategory.value).forEach((category) => { expandedCategories[category] = false })
}
function initExpandedCategories(): void {
  Object.keys(tablesByCategory.value).forEach((category) => {
    if (expandedCategories[category] === undefined) expandedCategories[category] = true
  })
}

function selectTable(tableName: string): void {
  selectedTable.value = tableName
  dataPage.value = 1
  loadTableData()
}

async function loadTableData(): Promise<void> {
  if (!selectedTable.value) return
  dataLoading.value = true
  try {
    const res: any = await requestGetTableDataApi(selectedTable.value, dataPage.value, dataPageSize.value, dataSearch.value)
    if (res.code === 200) {
      const { data, total } = res.data
      tableData.value = data || []
      dataTotal.value = total || 0
      tableColumns.value = data && data.length > 0 ? Object.keys(data[0]) : []
    }
  } catch (err: any) {
    console.error('[database] 加载表数据失败:', err)
    showError(t('superPanel.database.messages.loadDataFailed') + ': ' + (err?.message || ''))
  } finally {
    dataLoading.value = false
  }
}

function handleDataSizeChange(size: number): void { dataPageSize.value = size; dataPage.value = 1; loadTableData() }
function handleDataPageChange(page: number): void { dataPage.value = page; loadTableData() }

// ==================== 配置表编辑 ====================
function selectConfigTable(tableName: string): void {
  editTableName.value = tableName
  editPage.value = 1
  loadEditData()
}

async function loadEditData(): Promise<void> {
  if (!editTableName.value) return
  editLoading.value = true
  try {
    const res: any = await requestGetTableDataApi(editTableName.value, editPage.value, editPageSize.value)
    if (res.code === 200) {
      const { data, total } = res.data
      editData.value = data || []
      editTotal.value = total || 0
      editColumns.value = data && data.length > 0 ? Object.keys(data[0]) : []
    }
  } catch (err: any) {
    console.error('[database] 加载编辑数据失败:', err)
    showError(t('superPanel.database.messages.loadEditFailed') + ': ' + (err?.message || ''))
  } finally {
    editLoading.value = false
  }
}

function handleEditSizeChange(size: number): void { editPageSize.value = size; editPage.value = 1; loadEditData() }
function handleEditPageChange(page: number): void { editPage.value = page; loadEditData() }

function openAddDialog(): void {
  editMode.value = 'add'
  Object.keys(editForm).forEach((k) => delete editForm[k])
  editColumns.value.forEach((col) => { editForm[col] = '' })
  editFormColumns.value = editColumns.value
  editDialogVisible.value = true
}

function openEditDialog(row: Record<string, unknown>): void {
  editMode.value = 'edit'
  editOriginalRow.value = { ...row }
  Object.keys(editForm).forEach((k) => delete editForm[k])
  editColumns.value.forEach((col) => { editForm[col] = row[col] ?? '' })
  editFormColumns.value = editColumns.value
  editDialogVisible.value = true
}

function isPrimaryKey(col: string): boolean {
  return col === 'id' || col.endsWith('_id')
}

async function saveEditRecord(): Promise<void> {
  try {
    if (editMode.value === 'add') {
      const res: any = await requestInsertTableDataApi(editTableName.value, { ...editForm })
      if (res.code === 200) {
        showSuccess(t('superPanel.database.dataView.addSuccess'))
        editDialogVisible.value = false
        loadEditData()
      } else {
        showError(t('superPanel.database.dataView.addFailed'))
      }
    } else {
      const where: Record<string, unknown> = {}
      editColumns.value.forEach((col) => { if (isPrimaryKey(col)) where[col] = editOriginalRow.value[col] })
      if (Object.keys(where).length === 0) where[editColumns.value[0]] = editOriginalRow.value[editColumns.value[0]]
      const res: any = await requestUpdateTableDataApi(editTableName.value, { ...editForm }, where as unknown as string)
      if (res.code === 200) {
        showSuccess(t('superPanel.database.dataView.editSuccess'))
        editDialogVisible.value = false
        loadEditData()
      } else {
        showError(t('superPanel.database.dataView.editFailed'))
      }
    }
  } catch (err: any) {
    console.error('[database] 保存失败:', err)
    showError(t('superPanel.database.dataView.saveFailed') + ': ' + (err?.message || ''))
  }
}

async function handleDeleteRecord(row: Record<string, unknown>): Promise<void> {
  const ok = await confirmAction(t('superPanel.database.dataView.deleteConfirm'), t('superPanel.database.page.warning'), { type: 'warning' })
  if (!ok) return
  try {
    const where: Record<string, unknown> = {}
    editColumns.value.forEach((col) => { if (isPrimaryKey(col)) where[col] = row[col] })
    if (Object.keys(where).length === 0) where[editColumns.value[0]] = row[editColumns.value[0]]
    const res: any = await requestDeleteTableDataApi(editTableName.value, where as unknown as string)
    if (res.code === 200) {
      showSuccess(t('superPanel.database.dataView.deleteSuccess'))
      loadEditData()
    } else {
      showError(t('superPanel.database.dataView.deleteFailed'))
    }
  } catch (err: any) {
    console.error('[database] 删除失败:', err)
    showError(t('superPanel.database.dataView.deleteFailed') + ': ' + (err?.message || ''))
  }
}

// ==================== 版本备份 ====================
function loadStoragePath(): void {
  const savedPath = localStorage.getItem('db_backup_storage_path')
  if (savedPath) backupConfig.storagePath = savedPath
}

function openPathDialog(): void {
  pathForm.newPath = backupConfig.storagePath || ''
  pathDialogVisible.value = true
}

function triggerFolderSelect(): void {
  folderInput.value?.click()
}

function handleFolderSelect(event: Event): void {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const firstFile = files[0] as File & { webkitRelativePath?: string }
    const relativePath = firstFile.webkitRelativePath || firstFile.name
    const folderName = relativePath.split('/')[0]
    if (folderName) {
      showInfo(t('superPanel.database.messages.folderSelected', { name: folderName }))
      pathForm.newPath = pathForm.newPath ? pathForm.newPath + '/' + folderName : folderName
    }
  }
  (event.target as HTMLInputElement).value = ''
}

function confirmChangePath(): void {
  if (!pathForm.newPath) {
    showWarning(t('superPanel.database.messages.pathRequired'))
    return
  }
  localStorage.setItem('db_backup_storage_path', pathForm.newPath)
  backupConfig.storagePath = pathForm.newPath
  showSuccess(t('superPanel.database.messages.pathChanged'))
  pathDialogVisible.value = false
}

function openBackupDialog(): void {
  backupForm.backupType = 'full'
  backupForm.tableName = ''
  backupForm.remark = ''
  backupDialogVisible.value = true
}

async function confirmCreateBackup(): Promise<void> {
  if (backupForm.backupType === 'table' && !backupForm.tableName) {
    showWarning(t('superPanel.database.backup.selectTableTip'))
    return
  }
  backupCreating.value = true
  try {
    const res: any = await requestCreateBackupApi(backupForm.backupType, backupForm.backupType === 'table' ? backupForm.tableName : null, backupForm.remark)
    if (res.code === 200) {
      showSuccess(t('superPanel.database.backup.success'))
      backupDialogVisible.value = false
      loadBackupList()
    } else {
      showError(t('superPanel.database.backup.failed'))
    }
  } catch (err: any) {
    console.error('[database] 创建备份失败:', err)
    showError(t('superPanel.database.backup.failed') + ': ' + (err?.message || ''))
  } finally {
    backupCreating.value = false
  }
}

async function loadBackupList(): Promise<void> {
  backupLoading.value = true
  try {
    const res: any = await requestGetBackupListApi(backupPage.value, backupPageSize.value)
    if (res.code === 200) {
      const { list, total, storagePath } = res.data
      backupList.value = list || []
      backupTotal.value = total || 0
      if (storagePath) backupConfig.storagePath = storagePath
    }
  } catch (err: any) {
    console.error('[database] 加载备份列表失败:', err)
    showError(t('superPanel.database.messages.loadBackupFailed') + ': ' + (err?.message || ''))
  } finally {
    backupLoading.value = false
  }
}

function handleBackupSizeChange(size: number): void { backupPageSize.value = size; backupPage.value = 1; loadBackupList() }
function handleBackupPageChange(page: number): void { backupPage.value = page; loadBackupList() }

async function handleRestore(backup: BackupRow): Promise<void> {
  const ok = await confirmAction(t('superPanel.database.restore.confirm', { name: backup.backup_name }), t('superPanel.database.page.warning'), { type: 'warning' })
  if (!ok) return
  try {
    const res: any = await requestRestoreBackupApi(String(backup.id))
    if (res.code === 200) {
      showSuccess(t('superPanel.database.restore.success'))
      loadBackupList()
    } else {
      showError(t('superPanel.database.restore.failed'))
    }
  } catch (err: any) {
    console.error('[database] 回滚失败:', err)
    showError(t('superPanel.database.restore.failed') + ': ' + (err?.message || ''))
  }
}

async function handleDeleteBackup(backup: BackupRow): Promise<void> {
  const ok = await confirmAction(t('superPanel.database.backup.deleteConfirm', { name: backup.backup_name }), t('superPanel.database.page.warning'), { type: 'warning' })
  if (!ok) return
  try {
    const res: any = await requestDeleteBackupApi(String(backup.id))
    if (res.code === 200) {
      showSuccess(t('superPanel.database.dataView.deleteSuccess'))
      loadBackupList()
    } else {
      showError(t('superPanel.database.dataView.deleteFailed'))
    }
  } catch (err: any) {
    console.error('[database] 删除备份失败:', err)
    showError(t('superPanel.database.dataView.deleteFailed') + ': ' + (err?.message || ''))
  }
}

onMounted(() => {
  loadAllTables()
  loadStoragePath()
})
</script>

<style scoped lang="less">
.database-manager {
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 84px);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  .header-left .page-title { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #303133; }
  .header-left .page-desc { margin: 0; font-size: 13px; color: #909399; }
  .header-right { display: flex; gap: 10px; align-items: center; }
}
.main-tabs { margin-top: 0; }
.tab-content { padding: 10px 0; }
.table-list-panel {
  display: inline-block;
  width: 300px;
  vertical-align: top;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-right: 15px;
  height: 650px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.panel-header {
  padding: 12px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel-title { font-weight: 600; font-size: 14px; color: #fff; }
.panel-header .el-input :deep(.el-input__inner) { background: rgba(255, 255, 255, 0.9); border: none; }
.header-right { display: flex; align-items: center; gap: 8px; }
.config-help-icon { color: rgba(255, 255, 255, 0.8); font-size: 16px; cursor: help; transition: color 0.2s; }
.config-help-icon:hover { color: #fff; }
.table-list { height: calc(100% - 54px); overflow-y: auto; padding: 10px; }
.table-category { margin-bottom: 15px; }
.category-title {
  display: flex; align-items: center; padding: 6px 10px; font-size: 12px; font-weight: 600;
  color: #909399; background: #f5f7fa; border-radius: 4px; margin-bottom: 8px;
  cursor: pointer; transition: all 0.2s ease; user-select: none;
}
.category-title .el-icon { margin-right: 5px; color: #409eff; }
.category-title:hover { background: #e8f0fe; color: #409eff; }
.category-count { margin-left: auto; background: #409eff; color: #fff; border-radius: 10px; padding: 0 8px; font-size: 11px; }
.category-arrow { margin-right: 4px; font-size: 12px; }
.category-tables { overflow: hidden; transition: all 0.3s ease; }
.expand-collapse-btn {
  display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px;
  border: none; border-radius: 4px; background: rgba(255, 255, 255, 0.2); color: #fff; cursor: pointer;
  transition: all 0.2s ease; padding: 0;
}
.expand-collapse-btn:hover { background: rgba(255, 255, 255, 0.35); transform: scale(1.1); }
.table-card {
  position: relative; padding: 12px; margin-bottom: 8px; background: #fff; border: 1px solid #ebeef5;
  border-radius: 8px; cursor: pointer; transition: all 0.3s ease;
}
.table-card:hover { border-color: #409eff; box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15); transform: translateY(-2px); }
.table-card.active { border-color: #409eff; background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%); box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2); }
.table-card .card-header { display: flex; align-items: center; margin-bottom: 6px; }
.table-card .card-icon { font-size: 18px; color: #409eff; margin-right: 8px; }
.table-card .card-alias { font-size: 14px; font-weight: 600; color: #303133; flex: 1; }
.table-card .card-name {
  font-size: 11px; color: #909399; font-family: "Courier New", monospace; margin-bottom: 4px;
  background: #f5f7fa; padding: 2px 6px; border-radius: 3px; display: inline-block;
}
.table-card .card-desc { font-size: 12px; color: #606266; margin-bottom: 8px; line-height: 1.4; }
.table-card .card-stats { display: flex; gap: 10px; }
.table-card .stat { font-size: 11px; color: #909399; display: flex; align-items: center; }
.table-card .stat .el-icon { margin-right: 3px; }
.table-card .card-connector {
  position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px;
  background: #409eff; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 12px;
}
.empty-tip { padding: 40px 20px; text-align: center; color: #909399; font-size: 13px; }
.data-panel { display: inline-block; width: calc(100% - 320px); vertical-align: top; }
.empty-data { text-align: center; padding: 100px 0; color: #909399; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; }
.empty-data .empty-icon { font-size: 60px; margin-bottom: 20px; display: block; color: #c0c4cc; }
.data-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 15px; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; }
.data-title { display: flex; align-items: center; gap: 12px; }
.data-title .title-icon { font-size: 28px; color: #409eff; }
.data-title .title-text { display: flex; flex-direction: column; gap: 8px; }
.data-title .title-alias { font-size: 18px; font-weight: 600; color: #303133; }
.data-title .title-name { font-size: 12px; color: #909399; font-family: "Courier New", monospace; }
.data-search { display: flex; align-items: center; gap: 10px; }
.table-stats-bar { display: flex; gap: 15px; margin-bottom: 15px; }
.table-stats-bar .stat-item { flex: 1; display: flex; align-items: center; padding: 12px 15px; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; }
.table-stats-bar .stat-item .el-icon { font-size: 24px; color: #409eff; margin-right: 10px; }
.table-stats-bar .stat-label { font-size: 12px; color: #909399; margin-right: 8px; }
.table-stats-bar .stat-value { font-size: 16px; font-weight: 600; color: #303133; }
.pagination { margin-top: 15px; text-align: right; }
.auto-width-col { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
:deep(.auto-width-col .cell) { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
:deep(.el-table__header th) { padding: 12px 0; }
:deep(.el-table__header .cell) { padding: 0 10px; line-height: 1.5; }
:deep(.el-table__body td) { padding: 8px 0; }
.edit-tab-content { display: flex; gap: 15px; }
.config-list-panel { width: 280px; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; height: 600px; overflow: hidden; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); }
.config-list { height: calc(100% - 54px); overflow-y: auto; padding: 10px; }
.config-card { position: relative; padding: 12px; margin-bottom: 8px; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
.config-card:hover { border-color: #67c23a; box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15); transform: translateY(-2px); }
.config-card.active { border-color: #67c23a; background: linear-gradient(135deg, #f0f9eb 0%, #f5fcf0 100%); box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2); }
.config-card .card-header { display: flex; align-items: center; margin-bottom: 6px; }
.config-card .card-icon { font-size: 18px; color: #67c23a; margin-right: 8px; }
.config-card .card-alias { font-size: 14px; font-weight: 600; color: #303133; }
.config-card .card-name { font-size: 11px; color: #909399; font-family: "Courier New", monospace; margin-bottom: 6px; background: #f5f7fa; padding: 2px 6px; border-radius: 3px; display: inline-block; }
.config-card .card-stats { display: flex; gap: 10px; }
.config-card .stat { font-size: 11px; color: #909399; display: flex; align-items: center; }
.config-card .stat .el-icon { margin-right: 3px; }
.config-card .card-connector { position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; background: #67c23a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; }
.edit-panel { flex: 1; min-width: 0; }
.edit-table-wrapper { width: 100%; overflow: hidden; }
.config-edit-table { width: 100% !important; table-layout: fixed; }
.config-edit-table .el-table__body-wrapper { overflow-x: auto; }
.config-edit-table .cell { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.edit-content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 15px; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; }
.edit-title { display: flex; align-items: center; gap: 12px; }
.edit-title .title-icon { font-size: 28px; color: #67c23a; }
.edit-title .title-text { gap: 12px; display: flex; flex-direction: column; }
.edit-title .title-alias { margin-top: 5px; font-size: 18px; font-weight: 600; color: #303133; }
.edit-title .title-name { font-size: 12px; color: #909399; font-family: "Courier New", monospace; }
.edit-actions { display: flex; gap: 10px; }
.backup-tab-content { padding: 0; }
.backup-stats { display: flex; gap: 15px; margin-bottom: 20px; }
.backup-stats .stat-card { flex: 1; display: flex; align-items: center; padding: 20px; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; transition: all 0.3s ease; }
.backup-stats .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }
.backup-stats .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; margin-right: 15px; }
.backup-stats .stat-icon.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.backup-stats .stat-icon.success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.backup-stats .stat-icon.failed { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); }
.backup-stats .stat-icon.size { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.backup-stats .stat-info { display: flex; flex-direction: column; }
.backup-stats .stat-value { font-size: 24px; font-weight: 700; color: #303133; line-height: 1.2; }
.backup-stats .stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.backup-header { margin-bottom: 15px; }
.backup-actions { margin-bottom: 10px; display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: linear-gradient(135deg, #f8f9fc 0%, #f0f2f8 100%); border-radius: 8px; border: 1px solid #ebeef5; }
.quick-paths { display: flex; flex-wrap: wrap; gap: 8px; }
.quick-path-tag { cursor: pointer; transition: all 0.3s; }
.quick-path-tag:hover { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3); }
.path-question {
  display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%;
  background: #fff; color: #909399; font-size: 12px; font-weight: bold; cursor: help; transition: all 0.3s;
  border: 1px solid #dcdfe6; margin-left: 5px;
}
.path-question:hover { background: #409eff; color: #fff; border-color: #409eff; }
.backup-tip { padding: 12px 15px; background: linear-gradient(135deg, #fef9e7 0%, #fdf2d1 100%); border: 1px solid #faecd8; border-radius: 6px; font-size: 13px; color: #e6a23c; }
.backup-tip .el-icon { color: #e6a23c; margin-right: 5px; }
.restore-guide { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ebeef5; border-radius: 8px; padding: 30px; }
.restore-guide h3 { font-size: 18px; font-weight: 600; color: #303133; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #409eff; }
.guide-steps { margin-bottom: 30px; }
.step { display: flex; margin-bottom: 20px; }
.step-number {
  width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px;
  margin-right: 15px; flex-shrink: 0;
}
.step-content h4 { margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #303133; }
.step-content p { margin: 0; font-size: 13px; color: #606266; line-height: 1.6; }
.restore-warning { padding: 20px; background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%); border: 1px solid #fde2e2; border-radius: 8px; margin-bottom: 20px; display: flex; }
.restore-warning .el-icon { font-size: 24px; color: #f56c6c; margin-right: 15px; flex-shrink: 0; }
.restore-warning h4 { margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #f56c6c; }
.restore-warning ul { margin: 0; padding-left: 20px; }
.restore-warning li { font-size: 13px; color: #606266; line-height: 1.8; }
.restore-action { text-align: center; }
.label-with-tip { display: inline-flex; align-items: center; gap: 4px; }
.label-tip-icon { color: #c0c4cc; cursor: help; font-size: 14px; transition: color 0.2s; }
.label-tip-icon:hover { color: #409eff; }
</style>
