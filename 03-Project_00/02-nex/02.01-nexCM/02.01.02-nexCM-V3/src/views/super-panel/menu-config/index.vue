<template>
  <div class="menu-config-container">
    <!-- 页面头部（参考项目配置页面结构） -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          {{ $t("superPanel.menuConfig.page.title") }}
        </h2>
        <p class="page-desc">
          {{ $t("superPanel.menuConfig.page.desc") }}
        </p>
      </div>
      <div class="header-right">
        <!-- 重要提示图标，鼠标悬停显示提示 -->
        <el-tooltip effect="dark" placement="bottom" width="400">
          <div slot="content">
            <div style="font-weight: 600; margin-bottom: 8px">
              {{
                $t("superPanel.menuConfig.warning.title")
              }}
            </div>
            <div
              v-for="(warning, index) in warnings"
              :key="index"
              style="margin-bottom: 4px; font-size: 12px; line-height: 1.5"
            >
              {{ index + 1 }}. {{ warning }}
            </div>
          </div>
          <i class="el-icon-question warning-icon"></i>
        </el-tooltip>
      </div>
    </div>

    <!-- 编辑模式提示条 -->
    <div v-if="isEditMode" class="edit-mode-tip">
      <i class="el-icon-warning-outline"></i>
      <span>{{
        $t("superPanel.menuConfig.edit.modeTip")
      }}</span>
      <span class="unsaved-count" v-if="changeStats.total > 0">
        {{
          $t("superPanel.menuConfig.edit.unsavedChanges", {
            count: changeStats.total,
          })
        }}
      </span>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 查看模式：只保留进入编辑模式按钮 -->
        <template v-if="!isEditMode">
          <el-button type="primary" icon="el-icon-edit" @click="enterEditMode">
            {{ $t("superPanel.menuConfig.edit.enter") }}
          </el-button>
        </template>
        <!-- 编辑模式：只保留保存修改按钮 -->
        <template v-else>
          <el-button type="success" icon="el-icon-check" @click="saveChanges">
            {{ $t("superPanel.menuConfig.edit.save") }}
          </el-button>
        </template>
      </div>
      <div class="toolbar-right">
        <!-- 查看模式按钮 -->
        <el-tooltip v-if="!isEditMode" :content="$t('superPanel.menuConfig.tree.refresh')" placement="bottom">
          <el-button
            icon="el-icon-refresh"
            circle
            @click="refreshMenu"
          ></el-button>
        </el-tooltip>
        <!-- 编辑模式按钮 -->
        <template v-else>
          <el-tooltip :content="$t('superPanel.menuConfig.edit.undo')" placement="bottom">
            <el-button
              icon="el-icon-back"
              circle
              @click="undoChanges"
            ></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('superPanel.menuConfig.preview.action')" placement="bottom">
            <el-button
              icon="el-icon-view"
              circle
              @click="previewEffect"
            ></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('superPanel.menuConfig.edit.exit')" placement="bottom">
            <el-button
              type="danger"
              icon="el-icon-close"
              circle
              @click="exitEditMode"
            ></el-button>
          </el-tooltip>
        </template>
        <!-- 分隔线 -->
        <span class="toolbar-divider" v-if="isEditMode || !isEditMode"></span>
        <!-- 通用按钮 -->
        <el-tooltip :content="$t('superPanel.menuConfig.backup.create')" placement="bottom">
          <el-button
            icon="el-icon-download"
            circle
            @click="createBackup"
          ></el-button>
        </el-tooltip>
        <el-tooltip :content="$t('superPanel.menuConfig.common.importConfig')" placement="bottom">
          <el-button
            icon="el-icon-upload2"
            circle
            @click="importConfig"
          ></el-button>
        </el-tooltip>
        <el-tooltip :content="$t('superPanel.menuConfig.backup.history')" placement="bottom">
          <el-button
            icon="el-icon-date"
            circle
            @click="showBackupHistory"
          ></el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 变更统计（编辑模式） -->
    <div v-if="isEditMode" class="change-stats">
      <div class="stats-title">
        <i class="el-icon-data-analysis"></i>
        {{ $t("superPanel.menuConfig.edit.changeStats") }}
      </div>
      <div class="stats-items">
        <div class="stats-item added" v-if="changeStats.added > 0">
          <i class="el-icon-plus"></i>
          {{
            $t("superPanel.menuConfig.edit.changeAdded", {
              count: changeStats.added,
            })
          }}
        </div>
        <div class="stats-item modified" v-if="changeStats.modified > 0">
          <i class="el-icon-edit"></i>
          {{
            $t("superPanel.menuConfig.edit.changeModified", {
              count: changeStats.modified,
            })
          }}
        </div>
        <div class="stats-item deleted" v-if="changeStats.deleted > 0">
          <i class="el-icon-delete"></i>
          {{
            $t("superPanel.menuConfig.edit.changeDeleted", {
              count: changeStats.deleted,
            })
          }}
        </div>
        <div class="stats-item no-change" v-if="changeStats.total === 0">
          {{ $t("superPanel.menuConfig.edit.noChanges") }}
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单树（可拖拽调整宽度） -->
      <div class="menu-tree-panel" :style="{ width: treeWidth + 'px' }">
        <div class="panel-header">
          <i class="el-icon-menu"></i>
          <span>{{
            $t("superPanel.menuConfig.tree.title")
          }}</span>
          <el-button
            v-if="isEditMode"
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="addTopMenu"
          >
            {{ $t("superPanel.menuConfig.tree.addTop") }}
          </el-button>
        </div>
        <div class="tree-container">
          <el-tree
            ref="menuTree"
            :data="menuTreeData"
            :props="treeProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :draggable="isEditMode"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            highlight-current
            @node-click="handleNodeClick"
            @node-drop="handleNodeDrop"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                class="node-label"
                :class="{ 'deleted-node': data._deleted }"
              >
                <!-- 一级菜单用文件夹图标，二级/三级用文档图标 -->
                <i
                  :class="
                    node.level === 1 ? 'el-icon-folder' : 'el-icon-document'
                  "
                  class="node-icon"
                ></i>
                <span class="node-title">{{ getMenuTitle(data) }}</span>
                <span class="node-path">({{ data.path }})</span>
              </span>
              <span class="node-tags">
                <el-tag size="mini" :type="getMenuTypeTagType(data.type)">
                  {{ getMenuTypeLabel(data.type) }}
                </el-tag>
                <el-tag size="mini" type="info" v-if="data.hidden === 1">
                  {{
                    $t("superPanel.menuConfig.type.hidden")
                  }}
                </el-tag>
              </span>
              <span class="node-actions" v-if="isEditMode">
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  size="mini"
                  @click.stop="addChildMenu(data)"
                  v-if="data.type === 1"
                ></el-button>
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  @click.stop="editMenu(data)"
                ></el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  size="mini"
                  class="delete-btn"
                  @click.stop="deleteMenu(data)"
                ></el-button>
              </span>
              <span
                class="node-change-mark"
                v-if="isEditMode && data._changeType"
              >
                <i :class="getChangeMarkIcon(data._changeType)"></i>
              </span>
            </span>
          </el-tree>
        </div>
      </div>

      <!-- 拖拽调整宽度的手柄 -->
      <div class="resizer" @mousedown="startResize">
        <i class="el-icon-more resizer-icon"></i>
      </div>

      <!-- 右侧菜单详情 -->
      <div class="menu-detail-panel">
        <div class="panel-header">
          <i class="el-icon-document"></i>
          <span>{{
            $t("superPanel.menuConfig.detail.title")
          }}</span>
          <el-tag
            v-if="selectedMenu"
            size="small"
            :type="getMenuTypeTagType(selectedMenu.type)"
          >
            {{ getMenuTypeLabel(selectedMenu.type) }}
          </el-tag>
          <el-tag
            size="small"
            :type="isEditMode ? 'success' : 'info'"
            class="mode-tag"
          >
            {{ isEditMode ? $t("superPanel.menuConfig.edit.mode") : $t("superPanel.menuConfig.edit.viewMode") }}
          </el-tag>
        </div>
        <div class="detail-container" v-if="selectedMenu">
          <!-- 基本信息 -->
          <div class="detail-section">
            <div class="section-title">
              <i class="el-icon-info"></i>
              {{ $t("superPanel.menuConfig.detail.basicInfo") }}
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <label>
                  {{
                    $t("superPanel.menuConfig.detail.id")
                  }}
                  <span class="readonly-label">（只读）</span>
                </label>
                <span class="detail-value readonly">{{ selectedMenu.id }}</span>
              </div>
              <div class="detail-item">
                <label>
                  {{
                    $t("superPanel.menuConfig.detail.parentId")
                  }}
                  <span class="readonly-label">（只读）</span>
                </label>
                <span class="detail-value readonly">{{
                  getParentMenuName(selectedMenu.parentId || selectedMenu.parent_id)
                }}</span>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.name")
                }}</label>
                <el-input
                  v-if="isEditMode"
                  v-model="selectedMenu.name"
                  size="small"
                  @input="markMenuModified(selectedMenu)"
                ></el-input>
                <span v-else class="detail-value">{{ selectedMenu.name }}</span>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.menuTitle")
                }}</label>
                <el-input
                  v-if="isEditMode"
                  v-model="selectedMenu.title"
                  size="small"
                  @input="markMenuModified(selectedMenu)"
                ></el-input>
                <span v-else class="detail-value">{{ selectedMenu.title }}</span>
              </div>
            </div>
          </div>

          <!-- 路由配置 -->
          <div class="detail-section">
            <div class="section-title">
              <i class="el-icon-link"></i>
              {{ $t("superPanel.menuConfig.detail.routeConfig") }}
            </div>
            <div class="detail-grid">
              <div class="detail-item full-width">
                <label>{{
                  $t("superPanel.menuConfig.detail.path")
                }}</label>
                <el-input
                  v-if="isEditMode"
                  v-model="selectedMenu.path"
                  size="small"
                  @input="markMenuModified(selectedMenu)"
                ></el-input>
                <span v-else class="detail-value">{{ selectedMenu.path }}</span>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.component")
                }}</label>
                <el-input
                  v-if="isEditMode"
                  v-model="selectedMenu.component"
                  size="small"
                  @input="markMenuModified(selectedMenu)"
                ></el-input>
                <span v-else class="detail-value">{{ selectedMenu.component }}</span>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.redirect")
                }}</label>
                <el-input
                  v-if="isEditMode"
                  v-model="selectedMenu.redirect"
                  size="small"
                  @input="markMenuModified(selectedMenu)"
                ></el-input>
                <span v-else class="detail-value">{{ selectedMenu.redirect }}</span>
              </div>
            </div>
          </div>

          <!-- 显示配置 -->
          <div class="detail-section">
            <div class="section-title">
              <i class="el-icon-monitor"></i>
              {{ $t("superPanel.menuConfig.detail.displayConfig") }}
            </div>
            <div class="detail-grid">
              <div class="detail-item full-width">
                <label>{{
                  $t("superPanel.menuConfig.detail.icon")
                }}</label>
                <el-input
                  v-if="isEditMode"
                  v-model="selectedMenu.icon"
                  size="small"
                  @input="markMenuModified(selectedMenu)"
                >
                  <i slot="prefix" :class="selectedMenu.icon" class="icon-preview"></i>
                </el-input>
                <span v-else class="detail-value icon-value">
                  <i :class="selectedMenu.icon" class="icon-preview"></i>
                  {{ selectedMenu.icon }}
                </span>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.hidden")
                }}</label>
                <el-switch
                  :value="selectedMenu.hidden === 1"
                  :disabled="!isEditMode"
                  size="small"
                  @change="(val) => { selectedMenu.hidden = val ? 1 : 0; markMenuModified(selectedMenu); }"
                ></el-switch>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.alwaysShow")
                }}</label>
                <el-switch
                  :value="(selectedMenu.alwaysShow || selectedMenu.always_show) === 1"
                  :disabled="!isEditMode"
                  size="small"
                  @change="(val) => { selectedMenu.alwaysShow = val ? 1 : 0; selectedMenu.always_show = val ? 1 : 0; markMenuModified(selectedMenu); }"
                ></el-switch>
              </div>
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.noCache")
                }}</label>
                <el-switch
                  :value="(selectedMenu.noCache || selectedMenu.no_cache) === 1"
                  :disabled="!isEditMode"
                  size="small"
                  @change="(val) => { selectedMenu.noCache = val ? 1 : 0; selectedMenu.no_cache = val ? 1 : 0; markMenuModified(selectedMenu); }"
                ></el-switch>
              </div>
            </div>
          </div>

          <!-- 排序与类型 -->
          <div class="detail-section">
            <div class="section-title">
              <i class="el-icon-sort"></i>
              {{ $t("superPanel.menuConfig.detail.sortAndType") }}
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <label>{{
                  $t("superPanel.menuConfig.detail.sort")
                }}</label>
                <el-input-number
                  v-if="isEditMode"
                  v-model="selectedMenu.sort"
                  size="small"
                  :min="0"
                  controls-position="right"
                  @change="markMenuModified(selectedMenu)"
                ></el-input-number>
                <span v-else class="detail-value">{{ selectedMenu.sort }}</span>
              </div>
              <div class="detail-item">
                <label>
                  {{
                    $t("superPanel.menuConfig.detail.type")
                  }}
                  <span class="readonly-label">（只读）</span>
                </label>
                <div class="readonly-tag-wrapper">
                  <el-tag
                    size="small"
                    :type="getMenuTypeTagType(selectedMenu.type)"
                  >
                    {{ getMenuTypeLabel(selectedMenu.type) }}
                  </el-tag>
                </div>
              </div>
              <div class="detail-item full-width">
                <label>
                  {{
                    $t("superPanel.menuConfig.detail.updateTime")
                  }}
                  <span class="readonly-label">（只读）</span>
                </label>
                <span class="detail-value readonly">{{
                  selectedMenu.updateTime || selectedMenu.update_time
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-detail" v-else>
          <i class="el-icon-document"></i>
          <p>{{ $t("superPanel.i18n.field.noData") }}</p>
          <p class="empty-tip">{{ $t("superPanel.menuConfig.tree.clickToViewDetail") }}</p>
        </div>
      </div>
    </div>

    <!-- 菜单编辑弹窗 -->
    <el-dialog
      :title="menuEditDialog.isEdit ? '编辑菜单' : '新增菜单'"
      :visible.sync="menuEditDialog.visible"
      width="600px"
      :close-on-click-modal="false"
      @close="handleMenuEditClose"
    >
      <el-form
        ref="menuEditForm"
        :model="menuEditDialog.form"
        :rules="menuEditRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单ID" prop="id">
              <el-input
                v-model="menuEditDialog.form.id"
                placeholder="如：_105_11"
                :disabled="menuEditDialog.isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="type">
              <el-select v-model="menuEditDialog.form.type" style="width: 100%">
                <el-option label="目录" :value="1" />
                <el-option label="菜单" :value="2" />
                <el-option label="按钮" :value="3" />
                <el-option label="参数" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由Name" prop="name">
              <el-input v-model="menuEditDialog.form.name" placeholder="如：SuperMenuConfig" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由Path" prop="path">
              <el-input v-model="menuEditDialog.form.path" placeholder="如：menu-config" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuEditDialog.form.component" placeholder="如：super-panel/menu-config/index" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重定向" prop="redirect">
              <el-input v-model="menuEditDialog.form.redirect" placeholder="如：noRedirect" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单标题(i18n)" prop="title">
              <el-input v-model="menuEditDialog.form.title" placeholder="如：layout.menu.superPanel.menuConfig.default" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="menuEditDialog.form.icon" placeholder="如：el-icon-setting" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="sort">
              <el-input-number v-model="menuEditDialog.form.sort" :min="0" :max="999" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="是否隐藏">
              <el-switch v-model="menuEditDialog.form.hidden" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="永远展示">
              <el-switch v-model="menuEditDialog.form.alwaysShow" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不缓存">
              <el-switch v-model="menuEditDialog.form.noCache" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="父菜单ID" v-if="!menuEditDialog.isEdit">
          <el-input v-model="menuEditDialog.form.parentId" placeholder="顶级菜单留空，如：_105" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuEditDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleMenuEditSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 备份路径设置对话框 -->
    <el-dialog
      :title="$t('superPanel.menuConfig.backup.pathTitle')"
      :visible.sync="backupDialog.visible"
      width="720px"
      :close-on-click-modal="false"
      @open="handleOpenBackupDialog"
    >
      <el-form label-width="160px">
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.menuConfig.backup.currentPath') }}
              <el-tooltip
                :content="$t('superPanel.menuConfig.backup.currentPathTip')"
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input :value="backupConfig.backupDir" readonly class="readonly-path-input" />
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="label-with-tip">
              {{ $t('superPanel.menuConfig.backup.newPath') }}
              <el-tooltip
                :content="$t('superPanel.menuConfig.backup.newPathTip')"
                placement="top"
              >
                <i class="el-icon-question label-tip-icon"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="backupPathDialog.newPath"
            :placeholder="$t('superPanel.menuConfig.backup.newPathPlaceholder')"
          />
        </el-form-item>
      </el-form>

      <!-- 备份清单 -->
      <div class="backup-list-section">
        <div class="backup-list-header">
          <span class="backup-list-title">{{
            $t('superPanel.menuConfig.backup.listTitle')
          }}</span>
          <div class="backup-list-actions">
            <el-button size="mini" icon="el-icon-refresh" @click="loadBackupList">
              {{ $t('superPanel.menuConfig.common.refresh') }}
            </el-button>
          </div>
        </div>
        <div
          class="backup-list-container"
          v-loading="backupDialog.loading"
          :element-loading-text="$t('superPanel.menuConfig.page.loading')"
        >
          <el-table
            :data="backupDialog.list"
            size="small"
            border
            style="width: 100%"
            max-height="300"
          >
            <el-table-column
              prop="fileName"
              :label="$t('superPanel.menuConfig.backup.fileName')"
              min-width="220"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              prop="size"
              :label="$t('superPanel.menuConfig.backup.fileSize')"
              width="100"
              align="center"
            />
            <el-table-column
              prop="createdAt"
              :label="$t('superPanel.menuConfig.backup.createdAt')"
              width="170"
              align="center"
            />
            <el-table-column
              prop="menuCount"
              :label="$t('superPanel.menuConfig.tree.count')"
              width="90"
              align="center"
            />
            <el-table-column
              prop="remark"
              :label="$t('superPanel.menuConfig.backup.remark')"
              min-width="120"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :label="$t('superPanel.menuConfig.page.action')"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  class="delete-btn"
                  @click="deleteBackup(scope.row)"
                >
                  {{ $t('superPanel.menuConfig.delete.action') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="backup-list-empty"
            v-if="!backupDialog.loading && backupDialog.list.length === 0"
          >
            <i class="el-icon-folder-opened"></i>
            <span>{{ $t('superPanel.menuConfig.backup.noFiles') }}</span>
          </div>
        </div>
      </div>

      <span slot="footer">
        <el-button @click="backupDialog.visible = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="handleSaveBackupPath">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import {
  requestGetAdminMenuTreeApi,
  requestBatchSaveMenuApi,
  requestGetMenuBackupListApi,
  requestCreateMenuBackupApi,
  requestDeleteMenuBackupApi,
  requestGetMenuBackupDirApi,
  requestSetMenuBackupDirApi
} from '@/api/menu'

export default {
  name: "MenuConfig",
  data() {
    return {
      isEditMode: false,
      selectedMenu: null,
      originalMenuData: [],
      draftMenuData: [],
      treeWidth: 280, // 菜单树默认宽度
      isResizing: false,
      treeProps: {
        children: "children",
        label: "title",
      },
      staticMenuData: [
        {
          id: "_101",
          parent_id: "",
          name: "Home",
          path: "/home",
          component: "home/index",
          redirect: "noRedirect",
          title: "layout.menu.home.default",
          icon: "el-icon-s-home",
          hidden: 0,
          always_show: 0,
          no_cache: 0,
          sort: 1,
          type: 2,
          update_time: "2026-09-01 10:00:00",
          children: [],
        },
        {
          id: "_102",
          parent_id: "",
          name: "Device",
          path: "/device",
          component: "Layout",
          redirect: "/device/state",
          title: "layout.menu.device.default",
          icon: "el-icon-cpu",
          hidden: 0,
          always_show: 1,
          no_cache: 0,
          sort: 2,
          type: 1,
          update_time: "2026-09-01 10:00:00",
          children: [
            {
              id: "_102_01",
              parent_id: "_102",
              name: "DeviceState",
              path: "state",
              component: "device/state/index",
              redirect: "noRedirect",
              title: "layout.menu.device.state.default",
              icon: "el-icon-odometer",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 1,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_102_02",
              parent_id: "_102",
              name: "DevicePart",
              path: "part",
              component: "device/part/index",
              redirect: "noRedirect",
              title: "layout.menu.device.part.default",
              icon: "el-icon-set-up",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 2,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_102_03",
              parent_id: "_102",
              name: "DeviceAlarm",
              path: "alarm",
              component: "device/alarm/index",
              redirect: "noRedirect",
              title: "layout.menu.device.alarm.default",
              icon: "el-icon-warning",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 3,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
          ],
        },
        {
          id: "_103",
          parent_id: "",
          name: "Production",
          path: "/production",
          component: "Layout",
          redirect: "/production/order",
          title: "layout.menu.production.default",
          icon: "el-icon-s-operation",
          hidden: 0,
          always_show: 1,
          no_cache: 0,
          sort: 3,
          type: 1,
          update_time: "2026-09-01 10:00:00",
          children: [
            {
              id: "_103_01",
              parent_id: "_103",
              name: "ProductionOrder",
              path: "order",
              component: "production/order/index",
              redirect: "noRedirect",
              title: "production.order.default",
              icon: "el-icon-document",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 1,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_103_02",
              parent_id: "_103",
              name: "ProductionRecipe",
              path: "recipe",
              component: "production/recipe/index",
              redirect: "noRedirect",
              title: "production.recipe.default",
              icon: "el-icon-notebook-2",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 2,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
          ],
        },
        {
          id: "_105",
          parent_id: "",
          name: "SuperPanel",
          path: "/super-panel",
          component: "Layout",
          redirect: "/super-panel/dict",
          title: "layout.menu.superPanel.default",
          icon: "el-icon-s-tools",
          hidden: 0,
          always_show: 1,
          no_cache: 0,
          sort: 5,
          type: 1,
          update_time: "2026-09-01 10:00:00",
          children: [
            {
              id: "_105_01",
              parent_id: "_105",
              name: "SuperDict",
              path: "dict",
              component: "super-panel/dict/index",
              redirect: "noRedirect",
              title: "layout.menu.superPanel.dict.default",
              icon: "el-icon-collection",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 1,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_105_02",
              parent_id: "_105",
              name: "SuperDept",
              path: "dept",
              component: "super-panel/dept/index",
              redirect: "noRedirect",
              title: "layout.menu.superPanel.dept.default",
              icon: "el-icon-office-building",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 2,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_105_08",
              parent_id: "_105",
              name: "SuperProjectConfig",
              path: "project-config",
              component: "super-panel/project-config/index",
              redirect: "noRedirect",
              title: "superPanel.projectConfig.page.title",
              icon: "el-icon-s-platform",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 8,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_105_09",
              parent_id: "_105",
              name: "SuperMenuConfig",
              path: "menu-config",
              component: "super-panel/menu-config/index",
              redirect: "noRedirect",
              title: "layout.menu.superPanel.menuConfig.default",
              icon: "el-icon-setting",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 9,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
            {
              id: "_105_10",
              parent_id: "_105",
              name: "SuperI18n",
              path: "i18n",
              component: "super-panel/i18n/index",
              redirect: "noRedirect",
              title: "layout.menu.superPanel.i18n.default",
              icon: "el-icon-translation",
              hidden: 0,
              always_show: 0,
              no_cache: 0,
              sort: 10,
              type: 2,
              update_time: "2026-09-01 10:00:00",
              children: [],
            },
          ],
        },
      ],
      // 菜单编辑弹窗
      menuEditDialog: {
        visible: false,
        isEdit: false,
        form: {
          id: '',
          parentId: '',
          name: '',
          path: '',
          component: '',
          redirect: 'noRedirect',
          title: '',
          icon: '',
          hidden: 0,
          alwaysShow: 0,
          noCache: 0,
          sort: 0,
          type: 2
        }
      },
      // 菜单编辑表单校验规则
      menuEditRules: {
        id: [{ required: true, message: '请输入菜单ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入路由Name', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由Path', trigger: 'blur' }],
        title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }]
      },
      // 备份历史弹窗
      backupDialog: {
        visible: false,
        list: [],
        loading: false
      },
      // 备份目录配置
      backupConfig: {
        backupDir: ""
      },
      // 备份路径设置
      backupPathDialog: {
        visible: false,
        newPath: ""
      }
    };
  },
  computed: {
    menuTreeData() {
      return this.isEditMode ? this.draftMenuData : this.originalMenuData;
    },
    warnings() {
      return [
        this.$t("superPanel.menuConfig.warning.item1"),
        this.$t("superPanel.menuConfig.warning.item2"),
        this.$t("superPanel.menuConfig.warning.item3"),
        this.$t("superPanel.menuConfig.warning.item4"),
        this.$t("superPanel.menuConfig.warning.item5"),
      ];
    },
    changeStats() {
      let added = 0;
      let modified = 0;
      let deleted = 0;
      const countChanges = (nodes) => {
        nodes.forEach((node) => {
          if (node._changeType === "added") added++;
          else if (node._changeType === "modified") modified++;
          else if (node._changeType === "deleted") deleted++;
          if (node.children && node.children.length > 0) {
            countChanges(node.children);
          }
        });
      };
      countChanges(this.draftMenuData);
      return { added, modified, deleted, total: added + modified + deleted };
    },
  },
  created() {
    this.loadMenuData();
  },
  methods: {
    // 标记菜单已修改
    markMenuModified(menu) {
      if (!menu || menu._isNew || menu._deleted) return;
      if (menu._changeType !== 'modified') {
        menu._changeType = 'modified';
      }
    },
    // 拖拽调整宽度
    startResize(e) {
      this.isResizing = true;
      const startX = e.clientX;
      const startWidth = this.treeWidth;

      const onMouseMove = (event) => {
        if (!this.isResizing) return;
        const newWidth = startWidth + (event.clientX - startX);
        // 限制最小宽度和最大宽度
        this.treeWidth = Math.max(280, Math.min(600, newWidth));
      };

      const onMouseUp = () => {
        this.isResizing = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },

    async loadMenuData() {
      try {
        const res = await requestGetAdminMenuTreeApi()
        const menuTree = res.data?.tree || []
        this.originalMenuData = JSON.parse(JSON.stringify(menuTree))
        this.draftMenuData = JSON.parse(JSON.stringify(menuTree))
      } catch (error) {
        this.$message.error('加载菜单数据失败')
        console.error('加载菜单数据失败:', error)
      }
    },
    enterEditMode() {
      this.draftMenuData = JSON.parse(JSON.stringify(this.originalMenuData));
      this.isEditMode = true;
      // 重新设置 selectedMenu，让它指向 draftMenuData 中对应的对象
      // 否则 selectedMenu 还是指向 originalMenuData 中的旧对象，修改不会同步到 draftMenuData
      if (this.selectedMenu) {
        const menuInDraft = this.findMenuById(this.draftMenuData, this.selectedMenu.id);
        if (menuInDraft) {
          this.selectedMenu = menuInDraft;
        }
      }
      this.$message.success("已进入编辑模式");
    },
    exitEditMode() {
      if (this.changeStats.total > 0) {
        MessageBox.confirm(
          this.$t("superPanel.menuConfig.edit.confirmExit"),
          "确认退出",
          {
            confirmButtonText: this.$t(
              "superPanel.menuConfig.edit.saveAndExit"
            ),
            cancelButtonText: this.$t(
              "superPanel.menuConfig.edit.discard"
            ),
            distinguishCancelAndClose: true,
            type: "warning",
          }
        )
          .then(() => {
            this.saveChanges();
          })
          .catch((action) => {
            if (action === "cancel") {
              this.draftMenuData = JSON.parse(
                JSON.stringify(this.originalMenuData)
              );
              this.isEditMode = false;
              this.selectedMenu = null;
            }
          });
      } else {
        this.isEditMode = false;
        this.selectedMenu = null;
      }
    },
    // 收集所有变更
    collectChanges(nodes, changes = []) {
      nodes.forEach((node) => {
        if (node._deleted) {
          changes.push({ type: 'delete', id: node.id })
        } else if (node._isNew) {
          changes.push({ type: 'add', data: this.convertToBackendFormat(node) })
        } else if (node._changeType === 'modified') {
          changes.push({ type: 'update', id: node.id, data: this.convertToBackendFormat(node) })
        }
        if (node.children && node.children.length > 0) {
          this.collectChanges(node.children, changes)
        }
      })
      return changes
    },

    // 转换为后端格式
    convertToBackendFormat(node) {
      return {
        id: node.id,
        parent_id: node.parentId || node.parent_id || '',
        name: node.name,
        path: node.path,
        component: node.component,
        redirect: node.redirect,
        title: node.title,
        icon: node.icon,
        hidden: node.hidden,
        always_show: node.alwaysShow || node.always_show,
        no_cache: node.noCache || node.no_cache,
        sort: node.sort,
        type: node.type
      }
    },

    async saveChanges() {
      try {
        const changes = this.collectChanges(this.draftMenuData)
        if (changes.length === 0) {
          this.$message.info('没有需要保存的修改')
          this.isEditMode = false
          return
        }

        const res = await requestBatchSaveMenuApi(changes)
        if (res.code === 200 || res.code === 0) {
          this.$message.success(
            this.$t("superPanel.menuConfig.common.saveSuccess")
          )
          // 重新加载数据
          await this.loadMenuData()
          this.isEditMode = false
          this.selectedMenu = null
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        this.$message.error('保存失败，请稍后重试')
        console.error('保存菜单失败:', error)
      }
    },
    undoChanges() {
      this.draftMenuData = JSON.parse(JSON.stringify(this.originalMenuData));
      this.selectedMenu = null;
      this.$message.success("已撤销所有修改");
    },
    previewEffect() {
      try {
        // 确定要预览的菜单数据（编辑模式下用草稿数据，查看模式下用原始数据）
        const menuData = this.isEditMode ? this.draftMenuData : this.originalMenuData;
        if (!menuData || menuData.length === 0) {
          this.$message.warning(this.$t('superPanel.menuConfig.preview.noData'));
          return;
        }
        // 保存到 localStorage
        const previewData = {
          menuData: menuData,
          activeMenu: this.selectedMenu ? this.selectedMenu.path : '',
          previewTime: new Date().toISOString()
        };
        localStorage.setItem('menu_config_preview', JSON.stringify(previewData));
        // 打开新窗口预览（注意：Vue Router 使用 hash 模式，URL 格式应该是 origin/#/route）
        const previewUrl = `${window.location.origin}/#/menu-config/preview`;
        window.open(previewUrl, '_blank');
      } catch (error) {
        console.error('预览失败:', error);
        this.$message.error(this.$t('superPanel.menuConfig.preview.loadFailed'));
      }
    },
    async refreshMenu() {
      await this.loadMenuData();
      this.selectedMenu = null;
      this.$message.success("菜单已刷新");
    },
    // 导入菜单配置（支持导出格式和备份格式）
    importConfig() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const importData = JSON.parse(event.target.result);
            // 支持两种格式：导出格式（menuData）和备份格式（menuData）
            if (!importData.menuData) {
              this.$message.error('导入文件格式不正确，缺少 menuData 字段');
              return;
            }
            // 检测文件类型，给出更好的提示
            const isBackupFile = !!(importData.createdAt || importData.remark || importData.menuCount);
            const fileTypeText = isBackupFile ? '备份文件' : '导出文件';
            const confirmed = await this.$confirm.action(
              `检测到${fileTypeText}，导入将覆盖当前菜单配置，是否继续？`,
              '确认导入',
              {
                confirmButtonText: '确定导入',
                cancelButtonText: '取消',
                type: 'warning'
              }
            );
            if (!confirmed) return;
            this.originalMenuData = JSON.parse(JSON.stringify(importData.menuData));
            this.draftMenuData = JSON.parse(JSON.stringify(importData.menuData));
            this.selectedMenu = null;
            this.$message.success('菜单配置已导入');
          } catch (error) {
            this.$message.error('导入失败，文件格式不正确');
            console.error('导入失败:', error);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    },
    // 显示备份历史
    showBackupHistory() {
      this.backupDialog.visible = true;
    },
    // 打开备份弹窗时加载备份目录配置和备份列表
    async handleOpenBackupDialog() {
      await this.loadBackupDirConfig();
      this.backupPathDialog.newPath = this.backupConfig.backupDir;
      this.loadBackupList();
    },
    // 加载备份目录配置
    async loadBackupDirConfig() {
      try {
        const res = await requestGetMenuBackupDirApi();
        if (res && res.data && res.data.backupDir) {
          this.backupConfig.backupDir = res.data.backupDir;
        }
      } catch (error) {
        console.error('加载备份目录配置失败:', error);
      }
    },
    // 保存备份路径
    async handleSaveBackupPath() {
      if (!this.backupPathDialog.newPath) {
        this.$message.warning(this.$t('superPanel.menuConfig.common.pathNotEmpty'));
        return;
      }
      // 如果新路径和当前路径一致，直接关闭弹窗
      if (this.backupPathDialog.newPath === this.backupConfig.backupDir) {
        this.backupDialog.visible = false;
        return;
      }
      try {
        await requestSetMenuBackupDirApi(this.backupPathDialog.newPath);
        this.backupConfig.backupDir = this.backupPathDialog.newPath;
        this.$message.success(this.$t('superPanel.menuConfig.backup.savePathSuccess'));
        this.backupDialog.visible = false;
      } catch (error) {
        this.$message.error(this.$t('superPanel.menuConfig.backup.savePathFailed'));
        console.error('备份路径保存失败:', error);
      }
    },
    // 加载备份列表
    async loadBackupList() {
      this.backupDialog.loading = true;
      try {
        const res = await requestGetMenuBackupListApi();
        if (res && res.data && Array.isArray(res.data)) {
          this.backupDialog.list = res.data.map((item) => ({
            ...item,
            size: this.formatFileSize(item.size),
            createdAt: this.formatDateTime(item.createdAt)
          }));
        } else {
          this.backupDialog.list = [];
        }
      } catch (error) {
        this.backupDialog.list = [];
        console.error('加载备份列表失败:', error);
      } finally {
        this.backupDialog.loading = false;
      }
    },
    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    // 格式化日期时间
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const pad = (n) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    },
    // 创建备份
    createBackup() {
      this.$prompt(
        this.$t('superPanel.menuConfig.backup.remarkPlaceholder'),
        this.$t('superPanel.menuConfig.backup.createTitle'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          inputPlaceholder: this.$t('superPanel.menuConfig.backup.remarkPlaceholder')
        }
      ).then(async ({ value }) => {
        try {
          await requestCreateMenuBackupApi(value || '');
          this.$message.success(this.$t('superPanel.menuConfig.backup.createSuccess'));
          this.loadBackupList();
        } catch (error) {
          this.$message.error(this.$t('superPanel.menuConfig.backup.createFailed'));
          console.error('备份创建失败:', error);
        }
      }).catch(() => {});
    },
    // 删除备份
    async deleteBackup(row) {
      const message = this.$t('superPanel.menuConfig.delete.message').replace('{name}', row.fileName);
      const confirmed = await this.$confirm.action(
        message,
        this.$t('superPanel.menuConfig.delete.title'),
        {
          confirmButtonText: this.$t('superPanel.menuConfig.delete.confirmButton'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }
      );
      if (!confirmed) return;
      try {
        await requestDeleteMenuBackupApi(row.fileName);
        this.$message.success(this.$t('superPanel.menuConfig.backup.deleteSuccess'));
        this.loadBackupList();
      } catch (error) {
        this.$message.error(this.$t('superPanel.menuConfig.backup.deleteFailed'));
        console.error('备份删除失败:', error);
      }
    },
    addTopMenu() {
      this.menuEditDialog.isEdit = false;
      this.menuEditDialog.form = {
        id: '',
        parentId: '',
        name: '',
        path: '',
        component: '',
        redirect: 'noRedirect',
        title: '',
        icon: '',
        hidden: 0,
        alwaysShow: 0,
        noCache: 0,
        sort: 0,
        type: 2
      };
      this.menuEditDialog.visible = true;
    },
    addChildMenu(data) {
      this.menuEditDialog.isEdit = false;
      this.menuEditDialog.form = {
        id: '',
        parentId: data.id,
        name: '',
        path: '',
        component: '',
        redirect: 'noRedirect',
        title: '',
        icon: '',
        hidden: 0,
        alwaysShow: 0,
        noCache: 0,
        sort: (data.children?.length || 0) + 1,
        type: 2
      };
      this.menuEditDialog.visible = true;
    },
    editMenu(data) {
      this.menuEditDialog.isEdit = true;
      this.menuEditDialog.form = {
        id: data.id,
        parentId: data.parentId || data.parent_id || '',
        name: data.name,
        path: data.path,
        component: data.component || '',
        redirect: data.redirect || 'noRedirect',
        title: data.title,
        icon: data.icon || '',
        hidden: data.hidden || 0,
        alwaysShow: data.alwaysShow || data.always_show || 0,
        noCache: data.noCache || data.no_cache || 0,
        sort: data.sort || 0,
        type: data.type || 2
      };
      this.menuEditDialog.visible = true;
    },
    // 关闭菜单编辑弹窗
    handleMenuEditClose() {
      this.$refs.menuEditForm?.clearValidate();
    },
    // 提交菜单编辑表单
    handleMenuEditSubmit() {
      this.$refs.menuEditForm.validate((valid) => {
        if (!valid) return;

        const form = this.menuEditDialog.form;

        if (this.menuEditDialog.isEdit) {
          // 编辑模式：更新菜单
          const updateNode = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === form.id) {
                Object.assign(nodes[i], {
                  name: form.name,
                  path: form.path,
                  component: form.component,
                  redirect: form.redirect,
                  title: form.title,
                  icon: form.icon,
                  hidden: form.hidden,
                  alwaysShow: form.alwaysShow,
                  noCache: form.noCache,
                  sort: form.sort,
                  type: form.type,
                  _changeType: 'modified'
                });
                return true;
              }
              if (nodes[i].children && updateNode(nodes[i].children)) {
                return true;
              }
            }
            return false;
          };
          updateNode(this.draftMenuData);
          this.$message.success('菜单已更新，保存后生效');
        } else {
          // 新增模式：添加菜单
          const newNode = {
            id: form.id,
            parentId: form.parentId,
            name: form.name,
            path: form.path,
            component: form.component,
            redirect: form.redirect,
            title: form.title,
            icon: form.icon,
            hidden: form.hidden,
            alwaysShow: form.alwaysShow,
            noCache: form.noCache,
            sort: form.sort,
            type: form.type,
            children: [],
            _isNew: true,
            _changeType: 'added'
          };

          if (form.parentId) {
            // 添加到子菜单
            const addToParent = (nodes) => {
              for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === form.parentId) {
                  if (!nodes[i].children) nodes[i].children = [];
                  nodes[i].children.push(newNode);
                  return true;
                }
                if (nodes[i].children && addToParent(nodes[i].children)) {
                  return true;
                }
              }
              return false;
            };
            addToParent(this.draftMenuData);
          } else {
            // 添加到顶级菜单
            this.draftMenuData.push(newNode);
          }
          this.$message.success('菜单已添加，保存后生效');
        }

        this.menuEditDialog.visible = false;
      });
    },
    async deleteMenu(data) {
      const childCount = this.countChildren(data);
      let message = this.$t(
        "superPanel.menuConfig.delete.confirm",
        { name: data.title }
      );
      if (childCount > 0) {
        message +=
          "\n" +
          this.$t(
            "superPanel.menuConfig.delete.withChildren",
            { count: childCount }
          );
      }
      message +=
        "\n" +
        this.$t("superPanel.menuConfig.delete.permissionTip");

      const confirmed = await this.$confirm.action(
        message,
        this.$t("superPanel.menuConfig.delete.menu"),
        {
          confirmButtonText: this.$t(
            "superPanel.menuConfig.delete.confirmButton"
          ),
          cancelButtonText: this.$t(
            "superPanel.menuConfig.common.cancel"
          ),
          type: "warning",
        }
      );
      if (!confirmed) return;
      data._deleted = true;
      data._changeType = "deleted";
      this.$message.success("菜单已标记删除，保存后生效");
    },
    countChildren(node) {
      let count = 0;
      if (node.children && node.children.length > 0) {
        count += node.children.length;
        node.children.forEach((child) => {
          count += this.countChildren(child);
        });
      }
      return count;
    },
    // 根据 id 在树形数据中递归查找对应的节点对象
    findMenuById(nodes, id) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          return nodes[i];
        }
        if (nodes[i].children && nodes[i].children.length > 0) {
          const found = this.findMenuById(nodes[i].children, id);
          if (found) return found;
        }
      }
      return null;
    },
    handleNodeClick(data) {
      // 确保 selectedMenu 和当前菜单数据中的对象是同一个引用
      // 这样修改 selectedMenu 的属性会同步到菜单数据中，预览和保存才能生效
      const sourceData = this.isEditMode ? this.draftMenuData : this.originalMenuData;
      const menuInSource = this.findMenuById(sourceData, data.id);
      this.selectedMenu = menuInSource || data;
    },
    // eslint-disable-next-line no-unused-vars
    handleNodeDrop(draggingNode, _dropNode, _dropType) {
      // 标记拖拽的菜单为已修改
      const markModified = (nodes, targetId) => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === targetId) {
            if (!nodes[i]._isNew) {
              nodes[i]._changeType = 'modified';
            }
            // 更新 parentId
            nodes[i].parentId = draggingNode.parent.data?.id || '';
            return true;
          }
          if (nodes[i].children && markModified(nodes[i].children, targetId)) {
            return true;
          }
        }
        return false;
      };
      markModified(this.draftMenuData, draggingNode.data.id);

      // 重新排序同级菜单的 sort 字段
      const reorderSiblings = (nodes) => {
        nodes.forEach((node, index) => {
          node.sort = index + 1;
          if (!node._isNew && node._changeType !== 'modified') {
            node._changeType = 'modified';
          }
        });
      };

      // 找到拖拽节点的同级菜单并重新排序
      const findAndReorder = (nodes, parentId) => {
        if (!parentId) {
          reorderSiblings(nodes);
          return true;
        }
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === parentId && nodes[i].children) {
            reorderSiblings(nodes[i].children);
            return true;
          }
          if (nodes[i].children && findAndReorder(nodes[i].children, parentId)) {
            return true;
          }
        }
        return false;
      };
      findAndReorder(this.draftMenuData, draggingNode.parent.data?.id || '');

      this.$message.success("菜单顺序已调整，保存后生效");
    },
    // eslint-disable-next-line no-unused-vars
    allowDrop(_draggingNode, _dropNode, _type) {
      return true;
    },
    // eslint-disable-next-line no-unused-vars
    allowDrag(_draggingNode) {
      return this.isEditMode;
    },
    getMenuIcon(data) {
      return data.icon || "el-icon-menu";
    },
    getMenuTitle(data) {
      if (!data || !data.title) {
        return "";
      }
      // 如果 title 以 "layout.menu." 开头，说明是国际化 key，调用 $t 翻译
      if (typeof data.title === "string" && data.title.startsWith("layout.menu.")) {
        try {
          const translated = this.$t(data.title);
          if (translated && translated !== data.title) {
            // 如果翻译结果是对象，取 default 属性
            if (typeof translated === "object" && translated !== null) {
              return translated.default || data.title;
            }
            return translated;
          }
        } catch (e) {
          // 翻译失败，继续执行，返回原始 title
        }
      }
      // 否则直接返回 title 本身（可能是直接写的中文或英文文本）
      return data.title;
    },
    getMenuTypeLabel(type) {
      const typeNum = Number(type);
      const typeMap = {
        1: this.$t("superPanel.menuConfig.type.directory"),
        2: this.$t("superPanel.menuConfig.type.menu"),
        3: this.$t("superPanel.menuConfig.type.button"),
        4: this.$t("superPanel.menuConfig.type.param"),
      };
      return typeMap[typeNum] || this.$t("superPanel.menuConfig.type.menu");
    },
    getMenuTypeTagType(type) {
      const typeMap = {
        1: "success",
        2: "",
        3: "warning",
        4: "info",
      };
      return typeMap[type] || "info";
    },
    getChangeMarkIcon(changeType) {
      const iconMap = {
        added: "el-icon-plus",
        modified: "el-icon-edit",
        deleted: "el-icon-delete",
      };
      return iconMap[changeType] || "";
    },
    getParentMenuName(parentId) {
      if (!parentId) return "顶级菜单";
      const findMenu = (nodes) => {
        for (const node of nodes) {
          if (node.id === parentId) return node;
          if (node.children && node.children.length > 0) {
            const found = findMenu(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      const parent = findMenu(this.menuTreeData);
      return parent ? this.getMenuTitle(parent) : parentId;
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

.menu-config-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 页面头部（参考语言配置页面结构） */
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

.header-left {
  flex: 1;
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
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.warning-icon {
  font-size: 22px;
  color: #f56c6c;
  cursor: help;
  transition: all 0.3s;
  animation: warningPulse 1.8s ease-in-out infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  background: rgba(245, 108, 108, 0.1);
  vertical-align: middle;
}

.warning-icon:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.2);
  transform: scale(1.15);
  animation-play-state: paused;
}

@keyframes warningPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.5);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}

/* 编辑模式提示条 */
.edit-mode-tip {
  background: #fdf6ec;
  border-left: 4px solid #e6a23c;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #e6a23c;
}

.edit-mode-tip i {
  font-size: 18px;
}

.unsaved-count {
  margin-left: auto;
  background: #e6a23c;
  color: white;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
  margin: 0 4px;
}

/* 变更统计 */
.change-stats {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.stats-title {
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stats-items {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.stats-item.added {
  color: #67c23a;
}

.stats-item.modified {
  color: #e6a23c;
}

.stats-item.deleted {
  color: #f56c6c;
}

.stats-item.no-change {
  color: #909399;
}

/* 主内容区 */
.main-content {
  display: flex;
  gap: 0;
  flex: 1;
  min-height: 0;
}

.menu-tree-panel,
.menu-detail-panel {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu-tree-panel {
  flex-shrink: 0;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.menu-detail-panel {
  flex: 1;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* 拖拽调整宽度手柄 */
.resizer {
  width: 10px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.resizer:hover {
  background: #ecf5ff;
}

.resizer-icon {
  font-size: 14px;
  color: #c0c4cc;
  transition: color 0.2s;
  transform: rotate(90deg);
}

.resizer:hover .resizer-icon {
  color: #409eff;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
}

.panel-header i {
  color: #409eff;
}

.panel-header .el-button {
  margin-left: auto;
}

.panel-header .el-tag {
  margin-left: auto;
}

.panel-header .mode-tag {
  margin-left: 8px;
  font-weight: normal;
}

/* 树容器 */
.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* 树节点行间距加大 */
.tree-container >>> .el-tree-node__content {
  height: 44px;
  border-radius: 4px;
  margin-bottom: 2px;
}

.tree-container >>> .el-tree-node__content:hover {
  background: #f5f7fa;
}

.tree-container >>> .el-tree-node.is-current > .el-tree-node__content {
  background: #ecf5ff;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  padding-right: 8px;
  font-size: 13px;
}

.node-label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.deleted-node {
  text-decoration: line-through;
  color: #c0c4cc;
}

/* 菜单树图标：一级文件夹，二级/三级文档 */
.node-icon {
  font-size: 16px;
  color: #909399;
  flex-shrink: 0;
}

.node-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.node-title {
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-path {
  font-size: 11px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-tags {
  display: flex;
  gap: 4px;
  margin: 0 8px;
  flex-shrink: 0;
}

.node-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}

.node-actions .delete-btn {
  color: #f56c6c;
}

.node-change-mark {
  margin-left: 4px;
  flex-shrink: 0;
}

.node-change-mark i {
  font-size: 12px;
  color: #e6a23c;
}

/* 详情面板 */
.detail-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title i {
  color: #409eff;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #909399;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
  word-break: break-all;
  cursor: not-allowed;
  min-height: 32px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  width: 100%;
}

.detail-value.readonly {
  background: repeating-linear-gradient(
    45deg,
    #f5f7fa,
    #f5f7fa 10px,
    #ebeef5 10px,
    #ebeef5 20px
  );
  color: #909399;
  border: 1px solid #dcdfe6;
  position: relative;
}

.detail-value.readonly::before {
  content: "\e72e";
  font-family: "element-icons";
  margin-right: 6px;
  font-size: 12px;
  color: #c0c4cc;
}

.readonly-label {
  color: #f56c6c;
  font-size: 11px;
  margin-left: 4px;
  font-weight: normal;
}

.readonly-tag-wrapper {
  padding: 4px 12px;
  background: repeating-linear-gradient(
    45deg,
    #f5f7fa,
    #f5f7fa 10px,
    #ebeef5 10px,
    #ebeef5 20px
  );
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 32px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  width: 100%;
  cursor: not-allowed;
}

.icon-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-preview {
  font-size: 18px;
  color: #409eff;
}

/* 空状态 */
.empty-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.empty-detail i {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-detail p {
  margin: 4px 0;
}

.empty-tip {
  font-size: 12px;
  color: #c0c4cc;
}

/* 滚动条美化 */
.tree-container::-webkit-scrollbar,
.detail-container::-webkit-scrollbar {
  width: 6px;
}

.tree-container::-webkit-scrollbar-track,
.detail-container::-webkit-scrollbar-track {
  background: #f5f7fa;
}

.tree-container::-webkit-scrollbar-thumb,
.detail-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.tree-container::-webkit-scrollbar-thumb:hover,
.detail-container::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

/* 备份弹窗样式 */
.label-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-tip-icon {
  color: #909399;
  cursor: help;
  font-size: 14px;
}

.backup-list-section {
  margin-top: 10px;
}

.backup-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.backup-list-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.backup-list-actions {
  display: flex;
  gap: 8px;
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
  font-size: 14px;
  gap: 10px;
}

.backup-list-empty i {
  font-size: 40px;
  color: #c0c4cc;
}

.backup-list-container .delete-btn {
  color: #f56c6c;
}
</style>
