<template>
  <div class="database-manager">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ $t("menu.superPanel.database.title") }}</h2>
        <p class="page-desc">{{ $t("menu.superPanel.database.desc") }}</p>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
          @click="handleRefresh"
        >
          {{ $t("common.refresh") }}
        </el-button>
      </div>
    </div>

    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-click="handleTabChange">
      <!-- 1. 数据查看 -->
      <el-tab-pane
        :label="$t('menu.superPanel.database.tabs.dataView')"
        name="dataView"
      >
        <div class="tab-content">
          <!-- 左侧表列表（卡片式设计） -->
          <div class="table-list-panel">
            <div class="panel-header">
              <div class="header-right">
                <el-tooltip placement="top" content="全部展开">
                  <button class="expand-collapse-btn" @click="expandAll">
                    <i class="el-icon-arrow-down"></i>
                  </button>
                </el-tooltip>
                <el-tooltip placement="top" content="全部折叠">
                  <button class="expand-collapse-btn" @click="collapseAll">
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </el-tooltip>
                <el-input
                  v-model="tableSearch"
                  :placeholder="$t('menu.superPanel.database.searchTable')"
                  size="small"
                  clearable
                  style="width: 160px"
                />
                <el-tooltip
                  placement="top"
                  :content="'配置文件: src/config/database.config.js'"
                >
                  <i class="el-icon-question config-help-icon"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="table-list">
              <div
                v-for="(tables, category) in tablesByCategory"
                :key="category"
                class="table-category"
              >
                <div class="category-title" @click="toggleCategory(category)">
                  <i
                    class="category-arrow"
                    :class="
                      expandedCategories[category]
                        ? 'el-icon-arrow-down'
                        : 'el-icon-arrow-right'
                    "
                  ></i>
                  <i
                    :class="
                      expandedCategories[category]
                        ? 'el-icon-folder-opened'
                        : 'el-icon-folder'
                    "
                  ></i>
                  <span>{{ category }}</span>
                  <span class="category-count">{{ tables.length }}</span>
                </div>
                <div
                  class="category-tables"
                  v-show="expandedCategories[category]"
                >
                  <div
                    v-for="table in tables"
                    :key="table.table_name"
                    class="table-card"
                    :class="{ active: selectedTable === table.table_name }"
                    @click="selectTable(table.table_name)"
                  >
                    <div class="card-header">
                      <i :class="table.table_icon" class="card-icon"></i>
                      <span class="card-alias">{{ table.table_alias }}</span>
                    </div>
                    <div class="card-name">{{ table.table_name }}</div>
                    <div class="card-desc">
                      {{ table.table_comment || "暂无描述" }}
                    </div>
                    <div class="card-stats">
                      <span class="stat">
                        <i class="el-icon-s-data"></i>
                        {{ table.table_rows || 0 }} 行
                      </span>
                      <span class="stat">
                        <i class="el-icon-files"></i>
                        {{ formatFileSize(table.data_length || 0) }}
                      </span>
                    </div>
                    <div
                      v-if="selectedTable === table.table_name"
                      class="card-connector"
                    >
                      <i class="el-icon-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="filteredTables.length === 0" class="empty-tip">
                {{ $t("menu.superPanel.database.noTable") }}
              </div>
            </div>
          </div>

          <!-- 右侧数据展示 -->
          <div class="data-panel">
            <div v-if="!selectedTable" class="empty-data">
              <i class="el-icon-database"></i>
              <p>{{ $t("menu.superPanel.database.selectTableTip") }}</p>
            </div>
            <div v-else class="data-content">
              <!-- 表信息头部 -->
              <div class="data-header">
                <div class="data-title">
                  <i
                    :class="currentTableInfo?.table_icon || 'el-icon-database'"
                    class="title-icon"
                  ></i>
                  <div class="title-text">
                    <h3 class="title-alias">
                      {{ currentTableInfo?.table_alias || selectedTable }}
                    </h3>
                    <span class="title-name">{{ selectedTable }}</span>
                  </div>
                  <el-tag size="mini" type="info" effect="plain">{{
                    currentTableInfo?.table_category || "其他"
                  }}</el-tag>
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-refresh"
                    @click="loadTableData"
                    >{{ $t("menu.superPanel.database.refresh") }}</el-button
                  >
                </div>
                <div class="data-search">
                  <el-input
                    v-model="dataSearch"
                    :placeholder="$t('menu.superPanel.database.searchData')"
                    size="small"
                    clearable
                    style="width: 200px"
                    @keyup.enter.native="loadTableData"
                  />
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-search"
                    @click="loadTableData"
                    >{{ $t("menu.superPanel.database.search") }}</el-button
                  >
                </div>
              </div>
              <!-- 表统计信息 -->
              <div class="table-stats-bar">
                <div class="stat-item">
                  <i class="el-icon-s-data"></i>
                  <span class="stat-label">数据行数</span>
                  <span class="stat-value">{{ dataTotal }}</span>
                </div>
                <div class="stat-item">
                  <i class="el-icon-files"></i>
                  <span class="stat-label">字段数量</span>
                  <span class="stat-value">{{ tableColumns.length }}</span>
                </div>
                <div class="stat-item">
                  <i class="el-icon-document"></i>
                  <span class="stat-label">表描述</span>
                  <span class="stat-value">{{
                    currentTableInfo?.table_comment || "暂无描述"
                  }}</span>
                </div>
              </div>

              <!-- 数据表格 -->
              <el-table
                :data="tableData"
                border
                stripe
                size="mini"
                v-loading="dataLoading"
                max-height="500"
                :header-cell-style="{
                  background: '#f5f7fa',
                  color: '#606266',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }"
              >
                <el-table-column
                  v-for="col in tableColumns"
                  :key="col"
                  :prop="col"
                  :label="col"
                  :min-width="80"
                  align="center"
                  class-name="auto-width-col"
                  show-overflow-tooltip
                />
              </el-table>

              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="dataTotal"
                  :page-size="dataPageSize"
                  :current-page="dataPage"
                  :page-sizes="[10, 20, 50, 100]"
                  @size-change="handleDataSizeChange"
                  @current-change="handleDataPageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 2. 配置表编辑 -->
      <el-tab-pane
        :label="$t('menu.superPanel.database.tabs.tableEdit')"
        name="tableEdit"
      >
        <div class="tab-content edit-tab-content">
          <!-- 左侧配置表列表（卡片式设计） -->
          <div class="config-list-panel">
            <div class="panel-header">
              <span class="panel-title">{{
                $t("menu.superPanel.database.selectConfigTable")
              }}</span>
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
                  <i :class="table.table_icon" class="card-icon"></i>
                  <span class="card-alias">{{ table.table_alias }}</span>
                </div>
                <div class="card-name">{{ table.table_name }}</div>
                <div class="card-stats">
                  <span class="stat">
                    <i class="el-icon-s-data"></i>
                    {{ table.table_rows || 0 }} 行
                  </span>
                </div>
                <div
                  v-if="editTableName === table.table_name"
                  class="card-connector"
                >
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div v-if="configTables.length === 0" class="empty-tip">
                暂无配置表
              </div>
            </div>
          </div>

          <!-- 右侧编辑区域 -->
          <div class="edit-panel">
            <div v-if="!editTableName" class="empty-data">
              <i class="el-icon-document"></i>
              <p>{{ $t("menu.superPanel.database.selectConfigTableTip") }}</p>
            </div>
            <div v-else class="edit-content">
              <!-- 编辑头部 -->
              <div class="edit-content-header">
                <div class="edit-title">
                  <i
                    :class="
                      currentEditTableInfo?.table_icon || 'el-icon-setting'
                    "
                    class="title-icon"
                  ></i>
                  <div class="title-text">
                    <h3 class="title-alias">
                      {{ currentEditTableInfo?.table_alias || editTableName }}
                    </h3>
                    <span class="title-name">{{ editTableName }}</span>
                  </div>
                </div>
                <div class="edit-actions">
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-plus"
                    @click="openAddDialog"
                    >{{ $t("menu.superPanel.database.addRecord") }}</el-button
                  >
                  <el-button
                    size="small"
                    icon="el-icon-refresh"
                    @click="loadEditData"
                    >{{ $t("menu.superPanel.database.refresh") }}</el-button
                  >
                </div>
              </div>

              <!-- 编辑数据表格 -->
              <div class="edit-table-wrapper">
                <el-table
                  :data="editData"
                  border
                  stripe
                  size="mini"
                  v-loading="editLoading"
                  max-height="450"
                  class="config-edit-table"
                  :header-cell-style="{
                    background: '#f5f7fa',
                    color: '#606266',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }"
                >
                  <el-table-column
                    v-for="col in editColumns"
                    :key="col"
                    :prop="col"
                    :label="col"
                    :min-width="100"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    :label="$t('menu.superPanel.database.operation')"
                    width="120"
                    fixed="right"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-edit"
                        @click="openEditDialog(scope.row)"
                        >{{ $t("menu.superPanel.database.edit") }}</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-delete"
                        style="color: #f56c6c"
                        @click="handleDeleteRecord(scope.row)"
                        >{{ $t("menu.superPanel.database.delete") }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="editTotal"
                  :page-size="editPageSize"
                  :current-page="editPage"
                  :page-sizes="[10, 20, 50, 100]"
                  @size-change="handleEditSizeChange"
                  @current-change="handleEditPageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 3. 版本备份 -->
      <el-tab-pane
        :label="$t('menu.superPanel.database.tabs.backup')"
        name="backup"
      >
        <div class="tab-content backup-tab-content">
          <!-- 统计卡片 -->
          <div class="backup-stats">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="el-icon-folder-opened"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ backupTotal }}</div>
                <div class="stat-label">备份总数</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon success">
                <i class="el-icon-circle-check"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ successBackupCount }}</div>
                <div class="stat-label">成功备份</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon failed">
                <i class="el-icon-circle-close"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ failedBackupCount }}</div>
                <div class="stat-label">失败备份</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon size">
                <i class="el-icon-files"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ totalBackupSize }}</div>
                <div class="stat-label">总大小</div>
              </div>
            </div>
          </div>

          <!-- 备份操作区 -->
          <div class="backup-header">
            <div class="backup-actions">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="small"
                @click="openBackupDialog"
              >
                {{ $t("menu.superPanel.database.createBackup") }}
              </el-button>
              <el-button
                icon="el-icon-refresh"
                size="small"
                @click="loadBackupList"
              >
                {{ $t("menu.superPanel.database.refresh") }}
              </el-button>
              <el-button
                icon="el-icon-folder"
                size="small"
                @click="openPathDialog"
              >
                修改路径
              </el-button>
              <el-tooltip
                :content="
                  '当前存储路径：' +
                  (backupConfig.storagePath || 'backups/database (默认)')
                "
                placement="top"
                effect="dark"
              >
                <span class="path-question">?</span>
              </el-tooltip>
            </div>
            <div class="backup-tip">
              <i class="el-icon-info"></i>
              {{ $t("menu.superPanel.database.backupTip") }}
            </div>
          </div>

          <!-- 备份列表 -->
          <el-table
            :data="backupList"
            border
            stripe
            size="small"
            v-loading="backupLoading"
            :header-cell-style="{
              background: '#f5f7fa',
              color: '#606266',
              fontWeight: 'bold',
              textAlign: 'center',
            }"
          >
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column
              prop="backup_name"
              :label="$t('menu.superPanel.database.backupName')"
              :min-width="120"
              align="center"
              class-name="auto-width-col"
              show-overflow-tooltip
            />
            <el-table-column
              prop="backup_type"
              :label="$t('menu.superPanel.database.backupType')"
              width="90"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.backup_type === 'full'"
                  size="mini"
                  type="success"
                  >{{ $t("menu.superPanel.database.fullBackup") }}</el-tag
                >
                <el-tag v-else size="mini" type="warning">{{
                  $t("menu.superPanel.database.tableBackup")
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="table_name"
              :label="$t('menu.superPanel.database.tableName')"
              :min-width="100"
              align="center"
              class-name="auto-width-col"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.table_name || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="file_size_formatted"
              :label="$t('menu.superPanel.database.fileSize')"
              width="100"
              align="center"
            />
            <el-table-column
              prop="remark"
              :label="$t('menu.superPanel.database.remark')"
              :min-width="120"
              align="center"
              class-name="auto-width-col"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.remark || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="operator"
              :label="$t('menu.superPanel.database.operator')"
              width="100"
              align="center"
            />
            <el-table-column
              prop="status"
              :label="$t('menu.superPanel.database.status')"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.status === 'success'"
                  size="mini"
                  type="success"
                  >{{ $t("menu.superPanel.database.success") }}</el-tag
                >
                <el-tag v-else size="mini" type="danger">{{
                  $t("menu.superPanel.database.failed")
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('menu.superPanel.database.createTime')"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.created_at | formatDate }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('menu.superPanel.database.operation')"
              width="150"
              fixed="right"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-refresh-left"
                  style="color: #e6a23c"
                  @click="handleRestore(scope.row)"
                  :disabled="scope.row.status !== 'success'"
                  >{{ $t("menu.superPanel.database.restore") }}</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  style="color: #f56c6c"
                  @click="handleDeleteBackup(scope.row)"
                  >{{ $t("menu.superPanel.database.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="backupTotal"
              :page-size="backupPageSize"
              :current-page="backupPage"
              :page-sizes="[10, 20, 50, 100]"
              @size-change="handleBackupSizeChange"
              @current-change="handleBackupPageChange"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 4. 回滚（在备份tab中已包含，这里做一个回滚历史/说明） -->
      <el-tab-pane
        :label="$t('menu.superPanel.database.tabs.restore')"
        name="restore"
      >
        <div class="tab-content">
          <div class="restore-guide">
            <h3>{{ $t("menu.superPanel.database.restoreGuideTitle") }}</h3>
            <div class="guide-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>
                    {{ $t("menu.superPanel.database.restoreStep1Title") }}
                  </h4>
                  <p>{{ $t("menu.superPanel.database.restoreStep1Desc") }}</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>
                    {{ $t("menu.superPanel.database.restoreStep2Title") }}
                  </h4>
                  <p>{{ $t("menu.superPanel.database.restoreStep2Desc") }}</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>
                    {{ $t("menu.superPanel.database.restoreStep3Title") }}
                  </h4>
                  <p>{{ $t("menu.superPanel.database.restoreStep3Desc") }}</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>
                    {{ $t("menu.superPanel.database.restoreStep4Title") }}
                  </h4>
                  <p>{{ $t("menu.superPanel.database.restoreStep4Desc") }}</p>
                </div>
              </div>
            </div>

            <div class="restore-warning">
              <i class="el-icon-warning-outline"></i>
              <div>
                <h4>
                  {{ $t("menu.superPanel.database.restoreWarningTitle") }}
                </h4>
                <ul>
                  <li>{{ $t("menu.superPanel.database.restoreWarning1") }}</li>
                  <li>{{ $t("menu.superPanel.database.restoreWarning2") }}</li>
                  <li>{{ $t("menu.superPanel.database.restoreWarning3") }}</li>
                </ul>
              </div>
            </div>

            <div class="restore-action">
              <el-button
                type="primary"
                icon="el-icon-refresh-left"
                @click="activeTab = 'backup'"
              >
                {{ $t("menu.superPanel.database.goToBackup") }}
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑记录弹窗 -->
    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="120px" size="small">
        <el-form-item v-for="col in editFormColumns" :key="col" :label="col">
          <el-input
            v-model="editForm[col]"
            :placeholder="'请输入' + col"
            :disabled="isPrimaryKey(col) && editMode === 'edit'"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">{{
          $t("menu.superPanel.database.cancel")
        }}</el-button>
        <el-button type="primary" @click="saveEditRecord">{{
          $t("menu.superPanel.database.confirm")
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 创建备份弹窗 -->
    <el-dialog
      :title="$t('menu.superPanel.database.createBackup')"
      :visible.sync="backupDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="backupForm" label-width="100px" size="small">
        <el-form-item :label="$t('menu.superPanel.database.backupType')">
          <el-radio-group v-model="backupForm.backupType">
            <el-radio label="full">{{
              $t("menu.superPanel.database.fullBackup")
            }}</el-radio>
            <el-radio label="table">{{
              $t("menu.superPanel.database.tableBackup")
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="backupForm.backupType === 'table'"
          :label="$t('menu.superPanel.database.selectTable')"
        >
          <el-select v-model="backupForm.tableName" style="width: 100%">
            <el-option
              v-for="table in allTables"
              :key="table.table_name"
              :label="table.table_name"
              :value="table.table_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('menu.superPanel.database.remark')">
          <el-input
            type="textarea"
            v-model="backupForm.remark"
            :rows="3"
            :placeholder="
              $t('menu.superPanel.database.backupRemarkPlaceholder')
            "
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="backupDialogVisible = false">{{
          $t("menu.superPanel.database.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="backupCreating"
          @click="confirmCreateBackup"
          >{{ $t("menu.superPanel.database.confirm") }}</el-button
        >
      </div>
    </el-dialog>

    <!-- 修改存储路径弹窗 -->
    <el-dialog
      title="修改存储路径"
      :visible.sync="pathDialogVisible"
      width="550px"
      :close-on-click-modal="false"
    >
      <el-form :model="pathForm" label-width="100px" size="small">
        <el-form-item label="当前路径">
          <span style="color: #909399">{{
            backupConfig.storagePath || "backups/database (默认)"
          }}</span>
        </el-form-item>
        <el-form-item label="新路径">
          <el-input
            v-model="pathForm.newPath"
            placeholder="请输入存储路径，如：D:/backups/database"
          >
            <el-button
              slot="append"
              icon="el-icon-folder-opened"
              @click="triggerFolderSelect"
              >浏览</el-button
            >
          </el-input>
          <input
            ref="folderInput"
            type="file"
            webkitdirectory
            directory
            style="display: none"
            @change="handleFolderSelect"
          />
        </el-form-item>
        <el-form-item label="快捷路径">
          <div class="quick-paths">
            <el-tag
              v-for="path in quickPaths"
              :key="path"
              size="small"
              class="quick-path-tag"
              @click="pathForm.newPath = path"
              >{{ path }}</el-tag
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-alert
            title="修改存储路径后，历史备份文件仍保留在原路径，新备份将保存到新路径。由于浏览器安全限制，浏览按钮只能获取文件夹名称，完整路径请手动输入。"
            type="warning"
            :closable="false"
            show-icon
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="pathDialogVisible = false"
          >取消</el-button
        >
        <el-button size="small" type="primary" @click="confirmChangePath"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import {
  requestGetAllTablesApi,
  requestGetTableDataApi,
  requestUpdateTableDataApi,
  requestInsertTableDataApi,
  requestDeleteTableDataApi,
  requestCreateBackupApi,
  requestGetBackupListApi,
  requestDeleteBackupApi,
  requestRestoreBackupApi,
} from "@/api";
import {
  getTableAliasMap,
} from "@/config/database.config";

// 表别名映射（从配置文件中提取）
const tableAliasMap = getTableAliasMap();

export default {
  name: "DatabaseManager",
  data() {
    return {
      activeTab: "dataView",

      // 备份存储路径配置
      backupConfig: {
        storagePath: "",
      },

      // 修改路径弹窗
      pathDialogVisible: false,
      pathForm: {
        newPath: "",
      },
      // 快捷路径
      quickPaths: [
        "backups/database",
        "D:/backups/database",
        "E:/backups/database",
        "F:/backups/database",
        "./backups/database",
      ],

      // 数据查看
      allTables: [],
      tableSearch: "",
      selectedTable: "",
      tableColumns: [],
      tableData: [],
      dataLoading: false,
      dataSearch: "",
      dataPage: 1,
      dataPageSize: 20,
      dataTotal: 0,
      // 分类展开状态（默认全部展开）
      expandedCategories: {},

      // 配置表编辑
      configTables: [],
      editTableName: "",
      editColumns: [],
      editData: [],
      editLoading: false,
      editPage: 1,
      editPageSize: 20,
      editTotal: 0,
      editDialogVisible: false,
      editMode: "add", // add or edit
      editForm: {},
      editFormColumns: [],
      editOriginalRow: null,

      // 版本备份
      backupList: [],
      backupLoading: false,
      backupPage: 1,
      backupPageSize: 20,
      backupTotal: 0,
      backupDialogVisible: false,
      backupCreating: false,
      backupForm: {
        backupType: "full",
        tableName: "",
        remark: "",
      },
    };
  },
  computed: {
    // 处理后的表列表（添加别名、分类、图标）
    processedTables() {
      return this.allTables.map((table) => {
        const aliasInfo = tableAliasMap[table.table_name] || {
          alias: table.table_name,
          category: "其他",
          icon: "el-icon-database",
        };
        return {
          ...table,
          table_alias: aliasInfo.alias,
          table_category: aliasInfo.category,
          table_icon: aliasInfo.icon,
        };
      });
    },
    filteredTables() {
      let tables = this.processedTables;
      if (this.tableSearch) {
        const keyword = this.tableSearch.toLowerCase();
        tables = tables.filter(
          (t) =>
            t.table_name.toLowerCase().includes(keyword) ||
            t.table_alias.toLowerCase().includes(keyword) ||
            (t.table_comment && t.table_comment.toLowerCase().includes(keyword))
        );
      }
      // 按分类排序
      return tables.sort((a, b) => {
        if (a.table_category !== b.table_category) {
          return a.table_category.localeCompare(b.table_category, "zh-CN");
        }
        return a.table_name.localeCompare(b.table_name);
      });
    },
    // 按分类分组的表列表
    tablesByCategory() {
      const groups = {};
      this.filteredTables.forEach((table) => {
        if (!groups[table.table_category]) {
          groups[table.table_category] = [];
        }
        groups[table.table_category].push(table);
      });
      return groups;
    },
    // 当前选中表的详细信息
    currentTableInfo() {
      return (
        this.processedTables.find((t) => t.table_name === this.selectedTable) ||
        null
      );
    },
    // 处理后的配置表列表
    processedConfigTables() {
      return this.configTables.map((table) => {
        const aliasInfo = tableAliasMap[table.table_name] || {
          alias: table.table_name,
          category: "配置管理",
          icon: "el-icon-setting",
        };
        return {
          ...table,
          table_alias: aliasInfo.alias,
          table_category: aliasInfo.category,
          table_icon: aliasInfo.icon,
        };
      });
    },
    // 当前选中配置表的详细信息
    currentEditTableInfo() {
      return (
        this.processedConfigTables.find(
          (t) => t.table_name === this.editTableName
        ) || null
      );
    },
    // 成功备份数量
    successBackupCount() {
      return this.backupList.filter((b) => b.status === "success").length;
    },
    // 失败备份数量
    failedBackupCount() {
      return this.backupList.filter((b) => b.status === "failed").length;
    },
    // 总备份大小
    totalBackupSize() {
      const totalBytes = this.backupList.reduce(
        (sum, b) => sum + (b.file_size || 0),
        0
      );
      return this.formatFileSize(totalBytes);
    },
    editDialogTitle() {
      return this.editMode === "add"
        ? this.$t("menu.superPanel.database.addRecord")
        : this.$t("menu.superPanel.database.editRecord");
    },
  },
  watch: {
    // 搜索时自动展开所有分类
    tableSearch(newVal) {
      if (newVal) {
        this.expandAll();
      }
    },
  },
  mounted() {
    this.loadAllTables();
    this.loadStoragePath();
  },
  methods: {
    // ==================== 通用方法 ====================
    handleTabChange(tab) {
      const tabName = tab.name || tab;
      if (tabName === "backup") {
        this.loadBackupList();
      }
    },

    handleRefresh() {
      if (this.activeTab === "dataView") {
        this.loadAllTables();
        if (this.selectedTable) {
          this.loadTableData();
        }
      } else if (this.activeTab === "tableEdit") {
        if (this.editTableName) {
          this.loadEditData();
        }
      } else if (this.activeTab === "backup") {
        this.loadBackupList();
      }
      this.$message.success(this.$t("common.refreshSuccess") || "刷新成功");
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    // ==================== 数据查看 ====================
    async loadAllTables() {
      try {
        const res = await requestGetAllTablesApi();
        if (res.code === 200) {
          this.allTables = res.data || [];
          // 配置表（以config开头或包含config的表）
          this.configTables = this.allTables.filter(
            (t) =>
              t.table_name.includes("config") ||
              t.table_name.includes("feature")
          );
          // 初始化分类展开状态
          this.$nextTick(() => {
            this.initExpandedCategories();
          });
        }
      } catch (err) {
        console.error("加载表列表失败:", err);
        this.$message.error("加载表列表失败: " + (err.message || ""));
      }
    },

    // 切换单个分类的展开/折叠状态
    toggleCategory(category) {
      this.$set(
        this.expandedCategories,
        category,
        !this.expandedCategories[category]
      );
    },

    // 全部展开
    expandAll() {
      Object.keys(this.tablesByCategory).forEach((category) => {
        this.$set(this.expandedCategories, category, true);
      });
    },

    // 全部折叠
    collapseAll() {
      Object.keys(this.tablesByCategory).forEach((category) => {
        this.$set(this.expandedCategories, category, false);
      });
    },

    // 初始化分类展开状态（默认全部展开）
    initExpandedCategories() {
      Object.keys(this.tablesByCategory).forEach((category) => {
        if (this.expandedCategories[category] === undefined) {
          this.$set(this.expandedCategories, category, true);
        }
      });
    },

    selectTable(tableName) {
      this.selectedTable = tableName;
      this.dataPage = 1;
      this.loadTableData();
    },

    async loadTableData() {
      if (!this.selectedTable) return;
      this.dataLoading = true;
      try {
        const res = await requestGetTableDataApi(
          this.selectedTable,
          this.dataPage,
          this.dataPageSize,
          this.dataSearch
        );
        if (res.code === 200) {
          const { data, total } = res.data;
          this.tableData = data || [];
          this.dataTotal = total || 0;
          if (data && data.length > 0) {
            this.tableColumns = Object.keys(data[0]);
          } else {
            this.tableColumns = [];
          }
        }
      } catch (err) {
        console.error("加载表数据失败:", err);
        this.$message.error("加载表数据失败: " + (err.message || ""));
      } finally {
        this.dataLoading = false;
      }
    },

    handleDataSizeChange(size) {
      this.dataPageSize = size;
      this.dataPage = 1;
      this.loadTableData();
    },

    handleDataPageChange(page) {
      this.dataPage = page;
      this.loadTableData();
    },

    // ==================== 配置表编辑 ====================
    selectConfigTable(tableName) {
      this.editTableName = tableName;
      this.editPage = 1;
      this.loadEditData();
    },

    async loadEditData() {
      if (!this.editTableName) return;
      this.editLoading = true;
      try {
        const res = await requestGetTableDataApi(
          this.editTableName,
          this.editPage,
          this.editPageSize
        );
        if (res.code === 200) {
          const { data, total } = res.data;
          this.editData = data || [];
          this.editTotal = total || 0;
          if (data && data.length > 0) {
            this.editColumns = Object.keys(data[0]);
          } else {
            this.editColumns = [];
          }
        }
      } catch (err) {
        console.error("加载编辑数据失败:", err);
        this.$message.error("加载编辑数据失败: " + (err.message || ""));
      } finally {
        this.editLoading = false;
      }
    },

    handleEditSizeChange(size) {
      this.editPageSize = size;
      this.editPage = 1;
      this.loadEditData();
    },

    handleEditPageChange(page) {
      this.editPage = page;
      this.loadEditData();
    },

    openAddDialog() {
      this.editMode = "add";
      this.editForm = {};
      this.editFormColumns = this.editColumns;
      this.editDialogVisible = true;
    },

    openEditDialog(row) {
      this.editMode = "edit";
      this.editOriginalRow = { ...row };
      this.editForm = { ...row };
      this.editFormColumns = this.editColumns;
      this.editDialogVisible = true;
    },

    isPrimaryKey(col) {
      return col === "id" || col.endsWith("_id");
    },

    async saveEditRecord() {
      try {
        if (this.editMode === "add") {
          const res = await requestInsertTableDataApi(
            this.editTableName,
            this.editForm
          );
          if (res.code === 200) {
            this.$message.success(
              this.$t("menu.superPanel.database.addSuccess")
            );
            this.editDialogVisible = false;
            this.loadEditData();
          } else {
            this.$message.error(
              res.message || this.$t("menu.superPanel.database.addFailed")
            );
          }
        } else {
          // 编辑：使用主键作为where条件
          const where = {};
          this.editColumns.forEach((col) => {
            if (this.isPrimaryKey(col)) {
              where[col] = this.editOriginalRow[col];
            }
          });
          if (Object.keys(where).length === 0) {
            // 如果没有主键，使用第一列作为条件
            where[this.editColumns[0]] =
              this.editOriginalRow[this.editColumns[0]];
          }
          const res = await requestUpdateTableDataApi(
            this.editTableName,
            this.editForm,
            where
          );
          if (res.code === 200) {
            this.$message.success(
              this.$t("menu.superPanel.database.editSuccess")
            );
            this.editDialogVisible = false;
            this.loadEditData();
          } else {
            this.$message.error(
              res.message || this.$t("menu.superPanel.database.editFailed")
            );
          }
        }
      } catch (err) {
        console.error("保存失败:", err);
        this.$message.error(
          this.$t("menu.superPanel.database.saveFailed") +
            ": " +
            (err.message || "")
        );
      }
    },

    handleDeleteRecord(row) {
      MessageBox.confirm(
        this.$t("menu.superPanel.database.deleteConfirm"),
        this.$t("menu.superPanel.database.warning"),
        {
          confirmButtonText: this.$t("menu.superPanel.database.confirm"),
          cancelButtonText: this.$t("menu.superPanel.database.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const where = {};
            this.editColumns.forEach((col) => {
              if (this.isPrimaryKey(col)) {
                where[col] = row[col];
              }
            });
            if (Object.keys(where).length === 0) {
              where[this.editColumns[0]] = row[this.editColumns[0]];
            }
            const res = await requestDeleteTableDataApi(
              this.editTableName,
              where
            );
            if (res.code === 200) {
              this.$message.success(
                this.$t("menu.superPanel.database.deleteSuccess")
              );
              this.loadEditData();
            } else {
              this.$message.error(
                res.message || this.$t("menu.superPanel.database.deleteFailed")
              );
            }
          } catch (err) {
            console.error("删除失败:", err);
            this.$message.error(
              this.$t("menu.superPanel.database.deleteFailed") +
                ": " +
                (err.message || "")
            );
          }
        })
        .catch(() => {});
    },

    // ==================== 版本备份 ====================
    // 从localStorage加载存储路径
    loadStoragePath() {
      const savedPath = localStorage.getItem("db_backup_storage_path");
      if (savedPath) {
        this.backupConfig.storagePath = savedPath;
      }
    },

    // 打开修改路径弹窗
    openPathDialog() {
      this.pathForm = {
        newPath: this.backupConfig.storagePath || "",
      };
      this.pathDialogVisible = true;
    },

    // 触发文件夹选择
    triggerFolderSelect() {
      this.$refs.folderInput.click();
    },

    // 处理文件夹选择
    handleFolderSelect(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        // 获取文件夹路径（浏览器安全限制，只能获取相对路径）
        const firstFile = files[0];
        const relativePath = firstFile.webkitRelativePath || firstFile.name;
        const folderName = relativePath.split("/")[0];
        if (folderName) {
          this.$message.info(
            "已选择文件夹：" + folderName + "，请手动补全完整路径"
          );
          this.pathForm.newPath = this.pathForm.newPath
            ? this.pathForm.newPath + "/" + folderName
            : folderName;
        }
      }
      // 清空input，允许重复选择
      event.target.value = "";
    },

    // 确认修改路径
    confirmChangePath() {
      if (!this.pathForm.newPath) {
        this.$message.warning("请输入存储路径");
        return;
      }
      // 保存到localStorage
      localStorage.setItem("db_backup_storage_path", this.pathForm.newPath);
      this.backupConfig.storagePath = this.pathForm.newPath;
      this.$message.success("存储路径已修改");
      this.pathDialogVisible = false;
    },

    openBackupDialog() {
      this.backupForm = {
        backupType: "full",
        tableName: "",
        remark: "",
      };
      this.backupDialogVisible = true;
    },

    async confirmCreateBackup() {
      if (
        this.backupForm.backupType === "table" &&
        !this.backupForm.tableName
      ) {
        this.$message.warning(
          this.$t("menu.superPanel.database.backupSelectTableTip")
        );
        return;
      }
      this.backupCreating = true;
      try {
        const res = await requestCreateBackupApi(
          this.backupForm.backupType,
          this.backupForm.backupType === "table"
            ? this.backupForm.tableName
            : null,
          this.backupForm.remark
        );
        if (res.code === 200) {
          this.$message.success(
            this.$t("menu.superPanel.database.backupSuccess")
          );
          this.backupDialogVisible = false;
          this.loadBackupList();
        } else {
          this.$message.error(
            res.message || this.$t("menu.superPanel.database.backupFailed")
          );
        }
      } catch (err) {
        console.error("创建备份失败:", err);
        this.$message.error(
          this.$t("menu.superPanel.database.backupFailed") +
            ": " +
            (err.message || "")
        );
      } finally {
        this.backupCreating = false;
      }
    },

    async loadBackupList() {
      this.backupLoading = true;
      try {
        const res = await requestGetBackupListApi(
          this.backupPage,
          this.backupPageSize
        );
        if (res.code === 200) {
          const { list, total, storagePath } = res.data;
          this.backupList = list || [];
          this.backupTotal = total || 0;
          // 更新存储路径为后端返回的绝对路径
          if (storagePath) {
            this.backupConfig.storagePath = storagePath;
          }
        }
      } catch (err) {
        console.error("加载备份列表失败:", err);
        this.$message.error("加载备份列表失败: " + (err.message || ""));
      } finally {
        this.backupLoading = false;
      }
    },

    handleBackupSizeChange(size) {
      this.backupPageSize = size;
      this.backupPage = 1;
      this.loadBackupList();
    },

    handleBackupPageChange(page) {
      this.backupPage = page;
      this.loadBackupList();
    },

    handleRestore(backup) {
      MessageBox.confirm(
        this.$t("menu.superPanel.database.restoreConfirm", {
          name: backup.backup_name,
        }),
        this.$t("menu.superPanel.database.warning"),
        {
          confirmButtonText: this.$t("menu.superPanel.database.confirm"),
          cancelButtonText: this.$t("menu.superPanel.database.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const res = await requestRestoreBackupApi(backup.id);
            if (res.code === 200) {
              this.$message.success(
                this.$t("menu.superPanel.database.restoreSuccess")
              );
              this.loadBackupList();
            } else {
              this.$message.error(
                res.message || this.$t("menu.superPanel.database.restoreFailed")
              );
            }
          } catch (err) {
            console.error("回滚失败:", err);
            this.$message.error(
              this.$t("menu.superPanel.database.restoreFailed") +
                ": " +
                (err.message || "")
            );
          }
        })
        .catch(() => {});
    },

    handleDeleteBackup(backup) {
      MessageBox.confirm(
        this.$t("menu.superPanel.database.deleteBackupConfirm", {
          name: backup.backup_name,
        }),
        this.$t("menu.superPanel.database.warning"),
        {
          confirmButtonText: this.$t("menu.superPanel.database.confirm"),
          cancelButtonText: this.$t("menu.superPanel.database.cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const res = await requestDeleteBackupApi(backup.id);
            if (res.code === 200) {
              this.$message.success(
                this.$t("menu.superPanel.database.deleteSuccess")
              );
              this.loadBackupList();
            } else {
              this.$message.error(
                res.message || this.$t("menu.superPanel.database.deleteFailed")
              );
            }
          } catch (err) {
            console.error("删除备份失败:", err);
            this.$message.error(
              this.$t("menu.superPanel.database.deleteFailed") +
                ": " +
                (err.message || "")
            );
          }
        })
        .catch(() => {});
    },
  },
};
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

  .header-left {
    .page-title {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
    .page-desc {
      margin: 0;
      font-size: 13px;
      color: #909399;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

.main-tabs {
  margin-top: 0;
}

.tab-content {
  padding: 10px 0;
}

/* 数据查看 - 左侧表列表（卡片式设计） */
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

.panel-title {
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

.panel-header .el-input__inner {
  background: rgba(255, 255, 255, 0.9);
  border: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-help-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  cursor: help;
  transition: color 0.2s;
}

.config-help-icon:hover {
  color: #fff;
}

.table-list {
  height: calc(100% - 54px);
  overflow-y: auto;
  padding: 10px;
}

/* 表分类 */
.table-category {
  margin-bottom: 15px;
}

.category-title {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #909399;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.category-title i {
  margin-right: 5px;
  color: #409eff;
}

.category-count {
  margin-left: auto;
  background: #409eff;
  color: #fff;
  border-radius: 10px;
  padding: 0 8px;
  font-size: 11px;
}

/* 分类标题可点击 */
.category-title {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.category-title:hover {
  background: #e8f0fe;
  color: #409eff;
}

/* 分类箭头图标 */
.category-arrow {
  margin-right: 4px;
  font-size: 12px;
  transition: transform 0.2s ease;
}

/* 分类下表列表容器 */
.category-tables {
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 展开/折叠全部按钮 */
.expand-collapse-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.expand-collapse-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.1);
}

.expand-collapse-btn i {
  font-size: 14px;
}

/* 表卡片 */
.table-card {
  position: relative;
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.table-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.table-card.active {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.table-card .card-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.table-card .card-icon {
  font-size: 18px;
  color: #409eff;
  margin-right: 8px;
}

.table-card .card-alias {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.table-card .card-name {
  font-size: 11px;
  color: #909399;
  font-family: "Courier New", monospace;
  margin-bottom: 4px;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  display: inline-block;
}

.table-card .card-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.4;
}

.table-card .card-stats {
  display: flex;
  gap: 10px;
}

.table-card .stat {
  font-size: 11px;
  color: #909399;
  display: flex;
  align-items: center;
}

.table-card .stat i {
  margin-right: 3px;
}

.table-card .card-connector {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
}

.empty-tip {
  padding: 40px 20px;
  text-align: center;
  color: #909399;
  font-size: 13px;
}

/* 右侧数据展示 */
.data-panel {
  display: inline-block;
  width: calc(100% - 320px);
  vertical-align: top;
}

.empty-data {
  text-align: center;
  padding: 100px 0;
  color: #909399;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.empty-data i {
  font-size: 60px;
  margin-bottom: 20px;
  display: block;
  color: #c0c4cc;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.data-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.data-title .title-icon {
  font-size: 28px;
  color: #409eff;
}

.data-title .title-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-title .title-alias {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.data-title .title-name {
  font-size: 12px;
  color: #909399;
  font-family: "Courier New", monospace;
}

.data-search {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 表统计信息栏 */
.table-stats-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.table-stats-bar .stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.table-stats-bar .stat-item i {
  font-size: 24px;
  color: #409eff;
  margin-right: 10px;
}

.table-stats-bar .stat-label {
  font-size: 12px;
  color: #909399;
  margin-right: 8px;
}

.table-stats-bar .stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.pagination {
  margin-top: 15px;
  text-align: right;
}

/* 自适应列宽 - 最大宽度限制 */
.auto-width-col {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .auto-width-col .cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 表头样式 - 增加padding，解决文字连在一起的问题 */
::v-deep .el-table__header th {
  padding: 12px 0;
}

::v-deep .el-table__header .cell {
  padding: 0 10px;
  line-height: 1.5;
}

/* 表格单元格样式 */
::v-deep .el-table__body td {
  padding: 8px 0;
}

/* 配置表编辑 - 左右布局 */
.edit-tab-content {
  display: flex;
  gap: 15px;
}

.config-list-panel {
  width: 280px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  height: 600px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.config-list {
  height: calc(100% - 54px);
  overflow-y: auto;
  padding: 10px;
}

.config-card {
  position: relative;
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.config-card:hover {
  border-color: #67c23a;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15);
  transform: translateY(-2px);
}

.config-card.active {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9eb 0%, #f5fcf0 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.2);
}

.config-card .card-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.config-card .card-icon {
  font-size: 18px;
  color: #67c23a;
  margin-right: 8px;
}

.config-card .card-alias {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.config-card .card-name {
  font-size: 11px;
  color: #909399;
  font-family: "Courier New", monospace;
  margin-bottom: 6px;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  display: inline-block;
}

.config-card .card-stats {
  display: flex;
  gap: 10px;
}

.config-card .stat {
  font-size: 11px;
  color: #909399;
  display: flex;
  align-items: center;
}

.config-card .stat i {
  margin-right: 3px;
}

.config-card .card-connector {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: #67c23a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
}

.edit-panel {
  flex: 1;
  min-width: 0;
}

/* 配置表编辑表格 - 确保列宽稳定 */
.edit-table-wrapper {
  width: 100%;
  overflow: hidden;
}

.config-edit-table {
  width: 100% !important;
  table-layout: fixed;
}

.config-edit-table .el-table__body-wrapper {
  overflow-x: auto;
}

.config-edit-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.edit-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.edit-title .title-icon {
  font-size: 28px;
  color: #67c23a;
}

.edit-title .title-text {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.edit-title .title-alias {
  margin-top: 5px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.edit-title .title-name {
  font-size: 12px;
  color: #909399;
  font-family: "Courier New", monospace;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

/* 版本备份 */
.backup-tab-content {
  padding: 0;
}

/* 统计卡片 */
.backup-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.backup-stats .stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.backup-stats .stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.backup-stats .stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-right: 15px;
}

.backup-stats .stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.backup-stats .stat-icon.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.backup-stats .stat-icon.failed {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.backup-stats .stat-icon.size {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.backup-stats .stat-info {
  display: flex;
  flex-direction: column;
}

.backup-stats .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.backup-stats .stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.backup-header {
  margin-bottom: 15px;
}

.backup-actions {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: linear-gradient(135deg, #f8f9fc 0%, #f0f2f8 100%);
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

/* 快捷路径标签 */
.quick-paths {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-path-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-path-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 存储路径问号图标 */
.path-question {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  color: #909399;
  font-size: 12px;
  font-weight: bold;
  cursor: help;
  transition: all 0.3s;
  border: 1px solid #dcdfe6;
  margin-left: 5px;
}

.path-question:hover {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.backup-tip {
  padding: 12px 15px;
  background: linear-gradient(135deg, #fef9e7 0%, #fdf2d1 100%);
  border: 1px solid #faecd8;
  border-radius: 6px;
  font-size: 13px;
  color: #e6a23c;
}

.backup-tip i {
  color: #e6a23c;
  margin-right: 5px;
}

/* 回滚指南 */
.restore-guide {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 30px;
}

.restore-guide h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #409eff;
}

.guide-steps {
  margin-bottom: 30px;
}

.step {
  display: flex;
  margin-bottom: 20px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  margin-right: 15px;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.step-content p {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.restore-warning {
  padding: 20px;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border: 1px solid #fde2e2;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
}

.restore-warning i {
  font-size: 24px;
  color: #f56c6c;
  margin-right: 15px;
  flex-shrink: 0;
}

.restore-warning h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #f56c6c;
}

.restore-warning ul {
  margin: 0;
  padding-left: 20px;
}

.restore-warning li {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.restore-action {
  text-align: center;
}
</style>
