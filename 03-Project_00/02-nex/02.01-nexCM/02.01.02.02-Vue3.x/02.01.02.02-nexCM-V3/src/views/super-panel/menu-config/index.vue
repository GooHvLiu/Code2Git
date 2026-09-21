<template>
  <div class="menu-config-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">{{ t('superPanel.menuConfig.page.title') }}</h2>
        <p class="page-desc">{{ t('superPanel.menuConfig.page.desc') }}</p>
      </div>
      <div class="header-right">
        <el-tooltip effect="dark" placement="bottom" :width="400">
          <template #content>
            <div style="font-weight: 600; margin-bottom: 8px">{{ t('superPanel.menuConfig.warning.title') }}</div>
            <div v-for="(warning, index) in warnings" :key="index" style="margin-bottom: 4px; font-size: 12px; line-height: 1.5">
              {{ index + 1 }}. {{ warning }}
            </div>
          </template>
          <el-icon class="warning-icon"><WarningFilled /></el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 编辑模式提示条 -->
    <div v-if="isEditMode" class="edit-mode-tip">
      <el-icon><WarningFilled /></el-icon>
      <span>{{ t('superPanel.menuConfig.edit.modeTip') }}</span>
      <span v-if="changeStats.total > 0" class="unsaved-count">
        {{ t('superPanel.menuConfig.edit.unsavedChanges', { count: changeStats.total }) }}
      </span>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <template v-if="!isEditMode">
          <el-button type="primary" @click="enterEditMode">
            <el-icon><Edit /></el-icon>&nbsp;{{ t('superPanel.menuConfig.edit.enter') }}
          </el-button>
        </template>
        <template v-else>
          <el-button type="success" @click="saveChanges">
            <el-icon><Check /></el-icon>&nbsp;{{ t('superPanel.menuConfig.edit.save') }}
          </el-button>
        </template>
      </div>
      <div class="toolbar-right">
        <el-tooltip v-if="!isEditMode" :content="t('superPanel.menuConfig.tree.refresh')" placement="bottom">
          <el-button circle @click="refreshMenu"><el-icon><Refresh /></el-icon></el-button>
        </el-tooltip>
        <template v-else>
          <el-tooltip :content="t('superPanel.menuConfig.edit.undo')" placement="bottom">
            <el-button circle @click="undoChanges"><el-icon><Back /></el-icon></el-button>
          </el-tooltip>
          <el-tooltip :content="t('superPanel.menuConfig.preview.action')" placement="bottom">
            <el-button circle @click="previewEffect"><el-icon><View /></el-icon></el-button>
          </el-tooltip>
          <el-tooltip :content="t('superPanel.menuConfig.edit.exit')" placement="bottom">
            <el-button circle type="danger" @click="exitEditMode"><el-icon><CircleClose /></el-icon></el-button>
          </el-tooltip>
        </template>
        <span class="toolbar-divider"></span>
        <el-tooltip :content="t('superPanel.menuConfig.backup.create')" placement="bottom">
          <el-button circle @click="createBackup"><el-icon><Download /></el-icon></el-button>
        </el-tooltip>
        <el-tooltip :content="t('superPanel.menuConfig.common.importConfig')" placement="bottom">
          <el-button circle @click="importConfig"><el-icon><Upload /></el-icon></el-button>
        </el-tooltip>
        <el-tooltip :content="t('superPanel.menuConfig.backup.history')" placement="bottom">
          <el-button circle @click="showBackupHistory"><el-icon><Calendar /></el-icon></el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 变更统计 -->
    <div v-if="isEditMode" class="change-stats">
      <div class="stats-title"><el-icon><DataAnalysis /></el-icon>{{ t('superPanel.menuConfig.edit.changeStats') }}</div>
      <div class="stats-items">
        <div v-if="changeStats.added > 0" class="stats-item added"><el-icon><Plus /></el-icon>{{ t('superPanel.menuConfig.edit.changeAdded', { count: changeStats.added }) }}</div>
        <div v-if="changeStats.modified > 0" class="stats-item modified"><el-icon><Edit /></el-icon>{{ t('superPanel.menuConfig.edit.changeModified', { count: changeStats.modified }) }}</div>
        <div v-if="changeStats.deleted > 0" class="stats-item deleted"><el-icon><Delete /></el-icon>{{ t('superPanel.menuConfig.edit.changeDeleted', { count: changeStats.deleted }) }}</div>
        <div v-if="changeStats.total === 0" class="stats-item no-change">{{ t('superPanel.menuConfig.edit.noChanges') }}</div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单树 -->
      <div class="menu-tree-panel" :style="{ width: treeWidth + 'px' }">
        <div class="panel-header">
          <el-icon><Menu /></el-icon>
          <span>{{ t('superPanel.menuConfig.tree.title') }}</span>
          <el-button v-if="isEditMode" type="text" size="small" @click="addTopMenu">
            <el-icon><Plus /></el-icon>&nbsp;{{ t('superPanel.menuConfig.tree.addTop') }}
          </el-button>
        </div>
        <div class="tree-container">
          <el-tree
            ref="menuTreeRef"
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
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span class="node-label" :class="{ 'deleted-node': (data as MenuNode)._deleted }">
                  <el-icon class="node-icon">
                    <Folder v-if="node.level === 1" />
                    <Document v-else />
                  </el-icon>
                  <span class="node-title">{{ getMenuTitle(data as MenuNode) }}</span>
                  <span class="node-path">({{ (data as MenuNode).path }})</span>
                </span>
                <span class="node-tags">
                  <el-tag size="small" :type="getMenuTypeTagType((data as MenuNode).type)">{{ getMenuTypeLabel((data as MenuNode).type) }}</el-tag>
                  <el-tag v-if="(data as MenuNode).hidden === 1" size="small" type="info">{{ t('superPanel.menuConfig.type.hidden') }}</el-tag>
                </span>
                <span v-if="isEditMode" class="node-actions">
                  <el-button v-if="(data as MenuNode).type === 1" type="text" size="small" @click.stop="addChildMenu(data as MenuNode)"><el-icon><Plus /></el-icon></el-button>
                  <el-button type="text" size="small" @click.stop="editMenu(data as MenuNode)"><el-icon><Edit /></el-icon></el-button>
                  <el-button type="text" size="small" class="delete-btn" @click.stop="deleteMenu(data as MenuNode)"><el-icon><Delete /></el-icon></el-button>
                </span>
                <span v-if="isEditMode && (data as MenuNode)._changeType" class="node-change-mark">
                  <el-icon :class="getChangeMarkClass((data as MenuNode)._changeType)"></el-icon>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 拖拽手柄 -->
      <div class="resizer" @mousedown="startResize">
        <el-icon class="resizer-icon"><More /></el-icon>
      </div>

      <!-- 右侧菜单详情 -->
      <div class="menu-detail-panel">
        <div class="panel-header">
          <el-icon><Document /></el-icon>
          <span>{{ t('superPanel.menuConfig.detail.title') }}</span>
          <el-tag v-if="selectedMenu" size="small" :type="getMenuTypeTagType(selectedMenu.type)">{{ getMenuTypeLabel(selectedMenu.type) }}</el-tag>
          <el-tag size="small" :type="isEditMode ? 'success' : 'info'" class="mode-tag">
            {{ isEditMode ? t('superPanel.menuConfig.edit.mode') : t('superPanel.menuConfig.edit.viewMode') }}
          </el-tag>
        </div>
        <div v-if="selectedMenu" class="detail-container">
          <!-- 基本信息 -->
          <div class="detail-section">
            <div class="section-title"><el-icon><InfoFilled /></el-icon>{{ t('superPanel.menuConfig.detail.basicInfo') }}</div>
            <div class="detail-grid">
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.id') }}<span class="readonly-label">{{ t('superPanel.menuConfig.detail.readonly') }}</span></label>
                <span class="detail-value readonly">{{ selectedMenu.id }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.parentId') }}<span class="readonly-label">{{ t('superPanel.menuConfig.detail.readonly') }}</span></label>
                <span class="detail-value readonly">{{ getParentMenuName(selectedMenu.parentId || selectedMenu.parent_id) }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.name') }}</label>
                <el-input v-if="isEditMode" v-model="selectedMenu.name" size="small" @input="markMenuModified(selectedMenu)" />
                <span v-else class="detail-value">{{ selectedMenu.name }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.menuTitle') }}</label>
                <el-input v-if="isEditMode" v-model="selectedMenu.title" size="small" @input="markMenuModified(selectedMenu)" />
                <span v-else class="detail-value">{{ selectedMenu.title }}</span>
              </div>
            </div>
          </div>

          <!-- 路由配置 -->
          <div class="detail-section">
            <div class="section-title"><el-icon><Link /></el-icon>{{ t('superPanel.menuConfig.detail.routeConfig') }}</div>
            <div class="detail-grid">
              <div class="detail-item full-width">
                <label>{{ t('superPanel.menuConfig.detail.path') }}</label>
                <el-input v-if="isEditMode" v-model="selectedMenu.path" size="small" @input="markMenuModified(selectedMenu)" />
                <span v-else class="detail-value">{{ selectedMenu.path }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.component') }}</label>
                <el-input v-if="isEditMode" v-model="selectedMenu.component" size="small" @input="markMenuModified(selectedMenu)" />
                <span v-else class="detail-value">{{ selectedMenu.component }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.redirect') }}</label>
                <el-input v-if="isEditMode" v-model="selectedMenu.redirect" size="small" @input="markMenuModified(selectedMenu)" />
                <span v-else class="detail-value">{{ selectedMenu.redirect }}</span>
              </div>
            </div>
          </div>

          <!-- 显示配置 -->
          <div class="detail-section">
            <div class="section-title"><el-icon><Monitor /></el-icon>{{ t('superPanel.menuConfig.detail.displayConfig') }}</div>
            <div class="detail-grid">
              <div class="detail-item full-width">
                <label>{{ t('superPanel.menuConfig.detail.icon') }}</label>
                <el-input v-if="isEditMode" v-model="selectedMenu.icon" size="small">
                  <template #prefix><el-icon><Menu /></el-icon></template>
                </el-input>
                <span v-else class="detail-value icon-value"><el-icon><Menu /></el-icon>{{ selectedMenu.icon }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.hidden') }}</label>
                <el-switch :model-value="selectedMenu?.hidden === 1" :disabled="!isEditMode" size="small" @change="setHidden" />
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.alwaysShow') }}</label>
                <el-switch :model-value="(selectedMenu?.alwaysShow || selectedMenu?.always_show) === 1" :disabled="!isEditMode" size="small" @change="setAlwaysShow" />
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.noCache') }}</label>
                <el-switch :model-value="(selectedMenu?.noCache || selectedMenu?.no_cache) === 1" :disabled="!isEditMode" size="small" @change="setNoCache" />
              </div>
            </div>
          </div>

          <!-- 排序与类型 -->
          <div class="detail-section">
            <div class="section-title"><el-icon><Sort /></el-icon>{{ t('superPanel.menuConfig.detail.sortAndType') }}</div>
            <div class="detail-grid">
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.sort') }}</label>
                <el-input-number v-if="isEditMode" v-model="selectedMenu.sort" size="small" :min="0" controls-position="right" @change="markMenuModified(selectedMenu)" />
                <span v-else class="detail-value">{{ selectedMenu.sort }}</span>
              </div>
              <div class="detail-item">
                <label>{{ t('superPanel.menuConfig.detail.type') }}<span class="readonly-label">{{ t('superPanel.menuConfig.detail.readonly') }}</span></label>
                <div class="readonly-tag-wrapper">
                  <el-tag size="small" :type="getMenuTypeTagType(selectedMenu.type)">{{ getMenuTypeLabel(selectedMenu.type) }}</el-tag>
                </div>
              </div>
              <div class="detail-item full-width">
                <label>{{ t('superPanel.menuConfig.detail.updateTime') }}<span class="readonly-label">{{ t('superPanel.menuConfig.detail.readonly') }}</span></label>
                <span class="detail-value readonly">{{ selectedMenu.updateTime || selectedMenu.update_time }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-detail">
          <el-icon><Document /></el-icon>
          <p>{{ t('superPanel.i18n.field.noData') }}</p>
          <p class="empty-tip">{{ t('superPanel.menuConfig.tree.clickToViewDetail') }}</p>
        </div>
      </div>
    </div>

    <!-- 菜单编辑弹窗 -->
    <el-dialog v-model="menuEditDialog.visible" :title="menuEditDialog.isEdit ? t('superPanel.menuConfig.dialog.editTitle') : t('superPanel.menuConfig.dialog.addTitle')" width="600px" :close-on-click-modal="false" @closed="handleMenuEditClose">
      <el-form ref="menuEditFormRef" :model="menuEditDialog.form" :rules="menuEditRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.menuId')" prop="id">
              <el-input v-model="menuEditDialog.form.id" :placeholder="t('superPanel.menuConfig.dialog.menuIdPlaceholder')" :disabled="menuEditDialog.isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.menuType')" prop="type">
              <el-select v-model="menuEditDialog.form.type" style="width: 100%">
                <el-option :label="t('superPanel.menuConfig.type.directory')" :value="1" />
                <el-option :label="t('superPanel.menuConfig.type.menu')" :value="2" />
                <el-option :label="t('superPanel.menuConfig.type.button')" :value="3" />
                <el-option :label="t('superPanel.menuConfig.type.param')" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.routeName')" prop="name">
              <el-input v-model="menuEditDialog.form.name" :placeholder="t('superPanel.menuConfig.dialog.routeNamePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.routePath')" prop="path">
              <el-input v-model="menuEditDialog.form.path" :placeholder="t('superPanel.menuConfig.dialog.routePathPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.componentPath')" prop="component">
              <el-input v-model="menuEditDialog.form.component" :placeholder="t('superPanel.menuConfig.dialog.componentPathPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.redirectLabel')" prop="redirect">
              <el-input v-model="menuEditDialog.form.redirect" :placeholder="t('superPanel.menuConfig.dialog.redirectPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.titleI18n')" prop="title">
              <el-input v-model="menuEditDialog.form.title" :placeholder="t('superPanel.menuConfig.dialog.titlePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.iconLabel')" prop="icon">
              <el-input v-model="menuEditDialog.form.icon" :placeholder="t('superPanel.menuConfig.dialog.iconPlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('superPanel.menuConfig.dialog.sortNo')" prop="sort">
              <el-input-number v-model="menuEditDialog.form.sort" :min="0" :max="999" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('superPanel.menuConfig.dialog.hiddenFlag')">
              <el-switch v-model="menuEditDialog.form.hidden" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('superPanel.menuConfig.dialog.alwaysShowFlag')">
              <el-switch v-model="menuEditDialog.form.alwaysShow" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('superPanel.menuConfig.dialog.noCacheFlag')">
              <el-switch v-model="menuEditDialog.form.noCache" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="!menuEditDialog.isEdit" :label="t('superPanel.menuConfig.dialog.parentId')">
          <el-input v-model="menuEditDialog.form.parentId" :placeholder="t('superPanel.menuConfig.dialog.parentIdPlaceholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="menuEditDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleMenuEditSubmit">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 备份路径设置对话框 -->
    <el-dialog v-model="backupDialog.visible" :title="t('superPanel.menuConfig.backup.pathTitle')" width="720px" :close-on-click-modal="false" @open="handleOpenBackupDialog">
      <el-form label-width="160px">
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.menuConfig.backup.currentPath') }}
              <el-tooltip :content="t('superPanel.menuConfig.backup.currentPathTip')" placement="top"><el-icon class="label-tip-icon"><QuestionFilled /></el-icon></el-tooltip>
            </span>
          </template>
          <el-input :model-value="backupConfig.backupDir" readonly class="readonly-path-input" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="label-with-tip">
              {{ t('superPanel.menuConfig.backup.newPath') }}
              <el-tooltip :content="t('superPanel.menuConfig.backup.newPathTip')" placement="top"><el-icon class="label-tip-icon"><QuestionFilled /></el-icon></el-tooltip>
            </span>
          </template>
          <el-input v-model="backupPathDialog.newPath" :placeholder="t('superPanel.menuConfig.backup.newPathPlaceholder')" />
        </el-form-item>
      </el-form>

      <div class="backup-list-section">
        <div class="backup-list-header">
          <span class="backup-list-title">{{ t('superPanel.menuConfig.backup.listTitle') }}</span>
          <div class="backup-list-actions">
            <el-button size="small" @click="loadBackupList">{{ t('superPanel.menuConfig.common.refresh') }}</el-button>
          </div>
        </div>
        <div v-loading="backupDialog.loading" class="backup-list-container" :element-loading-text="t('superPanel.menuConfig.page.loading')">
          <el-table :data="backupDialog.list" size="small" border style="width: 100%" max-height="300">
            <el-table-column prop="fileName" :label="t('superPanel.menuConfig.backup.fileName')" min-width="220" show-overflow-tooltip align="center" />
            <el-table-column prop="size" :label="t('superPanel.menuConfig.backup.fileSize')" width="100" align="center" />
            <el-table-column prop="createdAt" :label="t('superPanel.menuConfig.backup.createdAt')" width="170" align="center" />
            <el-table-column prop="menuCount" :label="t('superPanel.menuConfig.tree.count')" width="90" align="center" />
            <el-table-column prop="remark" :label="t('superPanel.menuConfig.backup.remark')" min-width="120" show-overflow-tooltip align="center" />
            <el-table-column :label="t('superPanel.menuConfig.page.action')" width="120" align="center">
              <template #default="scope">
                <el-button type="text" size="small" class="delete-btn" @click="deleteBackup(scope.row)">{{ t('superPanel.menuConfig.delete.action') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="!backupDialog.loading && backupDialog.list.length === 0" class="backup-list-empty">
            <el-icon><FolderOpened /></el-icon>
            <span>{{ t('superPanel.menuConfig.backup.noFiles') }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="backupDialog.visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSaveBackupPath">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 菜单配置：树形拖拽编辑 + 批量保存 + 备份/导入/预览
 * @author GooHv
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from '@/composables/useI18n'
import { showSuccess, showError, showWarning, showInfo, confirmAction } from '@/utils/ui/feedback'
import {
  requestGetAdminMenuTreeApi,
  requestBatchSaveMenuApi,
  requestGetMenuBackupListApi,
  requestCreateMenuBackupApi,
  requestDeleteMenuBackupApi,
  requestGetMenuBackupDirApi,
  requestSetMenuBackupDirApi
} from '@/api/menu'
import {
  WarningFilled, Edit, Check, Refresh, Back, View, CircleClose, Download, Upload, Calendar,
  DataAnalysis, Plus, Delete, Menu, Document, Folder, Link, Monitor, Sort, InfoFilled,
  QuestionFilled, FolderOpened, More
} from '@element-plus/icons-vue'

const { t } = useI18n()

interface MenuNode {
  id: string
  parentId?: string
  parent_id?: string
  name: string
  path: string
  component?: string
  redirect?: string
  title: string
  icon?: string
  hidden: number
  alwaysShow?: number
  always_show?: number
  noCache?: number
  no_cache?: number
  sort: number
  type: number
  updateTime?: string
  update_time?: string
  children?: MenuNode[]
  _isNew?: boolean
  _deleted?: boolean
  _changeType?: 'added' | 'modified' | 'deleted' | string
  [key: string]: unknown
}

interface MenuEditForm {
  id: string
  parentId: string
  name: string
  path: string
  component: string
  redirect: string
  title: string
  icon: string
  hidden: number
  alwaysShow: number
  noCache: number
  sort: number
  type: number
}

const emptyForm = (): MenuEditForm => ({
  id: '', parentId: '', name: '', path: '', component: '', redirect: 'noRedirect',
  title: '', icon: '', hidden: 0, alwaysShow: 0, noCache: 0, sort: 0, type: 2
})

const isEditMode = ref(false)
const selectedMenu = ref<MenuNode | null>(null)
const originalMenuData = ref<MenuNode[]>([])
const draftMenuData = ref<MenuNode[]>([])
const treeWidth = ref(280)
const isResizing = ref(false)
const menuTreeRef = ref()

const treeProps = { children: 'children', label: 'title' }

const menuEditFormRef = ref<FormInstance>()
const menuEditDialog = reactive<{ visible: boolean; isEdit: boolean; form: Record<string, any> }>({ visible: false, isEdit: false, form: emptyForm() })

const menuEditRules = computed<FormRules>(() => ({
  id: [{ required: true, message: t('superPanel.menuConfig.dialog.idRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('superPanel.menuConfig.dialog.nameRequired'), trigger: 'blur' }],
  path: [{ required: true, message: t('superPanel.menuConfig.dialog.pathRequired'), trigger: 'blur' }],
  title: [{ required: true, message: t('superPanel.menuConfig.dialog.titleRequired'), trigger: 'blur' }],
  type: [{ required: true, message: t('superPanel.menuConfig.dialog.typeRequired'), trigger: 'change' }]
}))

const backupDialog = reactive({ visible: false, list: [] as Array<Record<string, unknown> & { size: string; createdAt: string }>, loading: false })
const backupConfig = reactive({ backupDir: '' })
const backupPathDialog = reactive({ newPath: '' })

const menuTreeData = computed<MenuNode[]>(() => (isEditMode.value ? draftMenuData.value : originalMenuData.value))

const warnings = computed(() => [
  t('superPanel.menuConfig.warning.item1'),
  t('superPanel.menuConfig.warning.item2'),
  t('superPanel.menuConfig.warning.item3'),
  t('superPanel.menuConfig.warning.item4'),
  t('superPanel.menuConfig.warning.item5')
])

const changeStats = computed(() => {
  let added = 0
  let modified = 0
  let deleted = 0
  const countChanges = (nodes: MenuNode[]): void => {
    nodes.forEach((node) => {
      if (node._changeType === 'added') added++
      else if (node._changeType === 'modified') modified++
      else if (node._changeType === 'deleted') deleted++
      if (node.children && node.children.length > 0) countChanges(node.children)
    })
  }
  countChanges(draftMenuData.value)
  return { added, modified, deleted, total: added + modified + deleted }
})

function markMenuModified(menu: MenuNode | null | undefined): void {
  if (!menu || menu._isNew || menu._deleted) return
  if (menu._changeType !== 'modified') menu._changeType = 'modified'
}

function setHidden(val: string | number | boolean): void {
  if (!selectedMenu.value) return
  selectedMenu.value.hidden = val ? 1 : 0
  markMenuModified(selectedMenu.value)
}
function setAlwaysShow(val: string | number | boolean): void {
  if (!selectedMenu.value) return
  selectedMenu.value.alwaysShow = val ? 1 : 0
  selectedMenu.value.always_show = val ? 1 : 0
  markMenuModified(selectedMenu.value)
}
function setNoCache(val: string | number | boolean): void {
  if (!selectedMenu.value) return
  selectedMenu.value.noCache = val ? 1 : 0
  selectedMenu.value.no_cache = val ? 1 : 0
  markMenuModified(selectedMenu.value)
}

function startResize(e: MouseEvent): void {
  isResizing.value = true
  const startX = e.clientX
  const startWidth = treeWidth.value
  const onMouseMove = (event: MouseEvent): void => {
    if (!isResizing.value) return
    const newWidth = startWidth + (event.clientX - startX)
    treeWidth.value = Math.max(280, Math.min(600, newWidth))
  }
  const onMouseUp = (): void => {
    isResizing.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

async function loadMenuData(): Promise<void> {
  try {
    const res: any = await requestGetAdminMenuTreeApi()
    const menuTree = res.data?.tree || []
    originalMenuData.value = JSON.parse(JSON.stringify(menuTree))
    draftMenuData.value = JSON.parse(JSON.stringify(menuTree))
  } catch (error) {
    showError(t('superPanel.menuConfig.messages.loadFailed'))
    console.error('加载菜单数据失败:', error)
  }
}

function enterEditMode(): void {
  draftMenuData.value = JSON.parse(JSON.stringify(originalMenuData.value))
  isEditMode.value = true
  if (selectedMenu.value) {
    const menuInDraft = findMenuById(draftMenuData.value, selectedMenu.value.id)
    if (menuInDraft) selectedMenu.value = menuInDraft
  }
  showSuccess(t('superPanel.menuConfig.messages.enterEdit'))
}

function exitEditMode(): void {
  if (changeStats.value.total > 0) {
    confirmAction(t('superPanel.menuConfig.edit.confirmExit'), t('superPanel.menuConfig.messages.confirmExitTitle'), { type: 'warning', confirmButtonText: t('superPanel.menuConfig.edit.saveAndExit'), cancelButtonText: t('superPanel.menuConfig.edit.discard') }).then((ok) => {
      if (ok) {
        saveChanges()
      } else {
        draftMenuData.value = JSON.parse(JSON.stringify(originalMenuData.value))
        isEditMode.value = false
        selectedMenu.value = null
      }
    })
  } else {
    isEditMode.value = false
    selectedMenu.value = null
  }
}

function collectChanges(nodes: MenuNode[], changes: any[] = []): any[] {
  nodes.forEach((node) => {
    if (node._deleted) changes.push({ type: 'delete', id: node.id })
    else if (node._isNew) changes.push({ type: 'add', data: convertToBackendFormat(node) })
    else if (node._changeType === 'modified') changes.push({ type: 'update', id: node.id, data: convertToBackendFormat(node) })
    const kids = node.children
    if (kids && kids.length > 0) collectChanges(kids, changes)
  })
  return changes
}

function convertToBackendFormat(node: MenuNode): Record<string, unknown> {
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
}

async function saveChanges(): Promise<void> {
  try {
    const changes = collectChanges(draftMenuData.value)
    if (changes.length === 0) {
      showInfo(t('superPanel.menuConfig.messages.noChangesToSave'))
      isEditMode.value = false
      return
    }
    const res: any = await requestBatchSaveMenuApi(changes as any)
    if (res.code === 200 || res.code === 0) {
      showSuccess(t('superPanel.menuConfig.common.saveSuccess'))
      await loadMenuData()
      isEditMode.value = false
      selectedMenu.value = null
    } else {
      showError(res.message || t('superPanel.menuConfig.messages.saveFailed'))
    }
  } catch (error) {
    showError(t('superPanel.menuConfig.messages.saveFailedRetry'))
    console.error('保存菜单失败:', error)
  }
}

function undoChanges(): void {
  draftMenuData.value = JSON.parse(JSON.stringify(originalMenuData.value))
  selectedMenu.value = null
  showSuccess(t('superPanel.menuConfig.messages.undone'))
}

function previewEffect(): void {
  try {
    const data = isEditMode.value ? draftMenuData.value : originalMenuData.value
    if (!data || data.length === 0) {
      showWarning(t('superPanel.menuConfig.preview.noData'))
      return
    }
    const previewData = { menuData: data, activeMenu: selectedMenu.value ? selectedMenu.value.path : '', previewTime: new Date().toISOString() }
    localStorage.setItem('menu_config_preview', JSON.stringify(previewData))
    window.open(`${window.location.origin}/#/menu-config/preview`, '_blank')
  } catch (error) {
    console.error('预览失败:', error)
    showError(t('superPanel.menuConfig.preview.loadFailed'))
  }
}

async function refreshMenu(): Promise<void> {
  await loadMenuData()
  selectedMenu.value = null
  showSuccess(t('superPanel.menuConfig.messages.refreshed'))
}

function importConfig(): void {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      try {
        const importData = JSON.parse(event.target?.result as string)
        if (!importData.menuData) {
          showError(t('superPanel.menuConfig.messages.importBadFormat'))
          return
        }
        const isBackupFile = !!(importData.createdAt || importData.remark || importData.menuCount)
        const fileTypeText = isBackupFile ? t('superPanel.menuConfig.messages.importBackupType') : t('superPanel.menuConfig.messages.importExportType')
        const confirmed = await confirmAction(
          t('superPanel.menuConfig.messages.importConfirm', { type: fileTypeText }),
          t('superPanel.menuConfig.messages.importConfirmTitle'),
          { confirmButtonText: t('superPanel.menuConfig.messages.importConfirmButton'), cancelButtonText: t('common.cancel'), type: 'warning' }
        )
        if (!confirmed) return
        originalMenuData.value = JSON.parse(JSON.stringify(importData.menuData))
        draftMenuData.value = JSON.parse(JSON.stringify(importData.menuData))
        selectedMenu.value = null
        showSuccess(t('superPanel.menuConfig.messages.importSuccess'))
      } catch (error) {
        showError(t('superPanel.menuConfig.messages.importFailed'))
        console.error('导入失败:', error)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

function showBackupHistory(): void { backupDialog.visible = true }

async function handleOpenBackupDialog(): Promise<void> {
  await loadBackupDirConfig()
  backupPathDialog.newPath = backupConfig.backupDir
  loadBackupList()
}

async function loadBackupDirConfig(): Promise<void> {
  try {
    const res: any = await requestGetMenuBackupDirApi()
    if (res && res.data && res.data.backupDir) backupConfig.backupDir = res.data.backupDir
  } catch (error) {
    console.error('加载备份目录配置失败:', error)
  }
}

async function handleSaveBackupPath(): Promise<void> {
  if (!backupPathDialog.newPath) {
    showWarning(t('superPanel.menuConfig.common.pathNotEmpty'))
    return
  }
  if (backupPathDialog.newPath === backupConfig.backupDir) {
    backupDialog.visible = false
    return
  }
  try {
    await requestSetMenuBackupDirApi(backupPathDialog.newPath)
    backupConfig.backupDir = backupPathDialog.newPath
    showSuccess(t('superPanel.menuConfig.backup.savePathSuccess'))
    backupDialog.visible = false
  } catch (error) {
    showError(t('superPanel.menuConfig.backup.savePathFailed'))
    console.error('备份路径保存失败:', error)
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
function formatDateTime(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

async function loadBackupList(): Promise<void> {
  backupDialog.loading = true
  try {
    const res: any = await requestGetMenuBackupListApi()
    if (res && res.data && Array.isArray(res.data)) {
      backupDialog.list = res.data.map((item: any) => ({ ...item, size: formatFileSize(item.size), createdAt: formatDateTime(item.createdAt) }))
    } else {
      backupDialog.list = []
    }
  } catch (error) {
    backupDialog.list = []
    console.error('加载备份列表失败:', error)
  } finally {
    backupDialog.loading = false
  }
}

function createBackup(): void {
  ElMessageBox.prompt(t('superPanel.menuConfig.backup.remarkPlaceholder'), t('superPanel.menuConfig.backup.createTitle'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    inputPlaceholder: t('superPanel.menuConfig.backup.remarkPlaceholder')
  }).then(async ({ value }) => {
    try {
      await requestCreateMenuBackupApi(value || '')
      showSuccess(t('superPanel.menuConfig.backup.createSuccess'))
      loadBackupList()
    } catch (error) {
      showError(t('superPanel.menuConfig.backup.createFailed'))
      console.error('备份创建失败:', error)
    }
  }).catch(() => {})
}

async function deleteBackup(row: Record<string, unknown>): Promise<void> {
  const message = t('superPanel.menuConfig.delete.message').replace('{name}', String(row.fileName))
  const confirmed = await confirmAction(message, t('superPanel.menuConfig.delete.title'), {
    confirmButtonText: t('superPanel.menuConfig.delete.confirmButton'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
  if (!confirmed) return
  try {
    await requestDeleteMenuBackupApi(String(row.fileName))
    showSuccess(t('superPanel.menuConfig.backup.deleteSuccess'))
    loadBackupList()
  } catch (error) {
    showError(t('superPanel.menuConfig.backup.deleteFailed'))
    console.error('备份删除失败:', error)
  }
}

function addTopMenu(): void {
  menuEditDialog.isEdit = false
  menuEditDialog.form = emptyForm()
  menuEditDialog.visible = true
}
function addChildMenu(data: MenuNode): void {
  menuEditDialog.isEdit = false
  const form = emptyForm()
  form.parentId = data.id
  form.sort = (data.children?.length || 0) + 1
  menuEditDialog.form = form
  menuEditDialog.visible = true
}
function editMenu(data: MenuNode): void {
  menuEditDialog.isEdit = true
  menuEditDialog.form = {
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
  }
  menuEditDialog.visible = true
}

function handleMenuEditClose(): void {
  menuEditFormRef.value?.clearValidate()
}

function handleMenuEditSubmit(): void {
  menuEditFormRef.value?.validate((valid) => {
    if (!valid) return
    const form = menuEditDialog.form
    if (menuEditDialog.isEdit) {
      const updateNode = (nodes: MenuNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === form.id) {
            Object.assign(nodes[i], {
              name: form.name, path: form.path, component: form.component, redirect: form.redirect,
              title: form.title, icon: form.icon, hidden: form.hidden, alwaysShow: form.alwaysShow,
              noCache: form.noCache, sort: form.sort, type: form.type, _changeType: 'modified'
            })
            return true
          }
          const kids = nodes[i].children
          if (kids && updateNode(kids)) return true
        }
        return false
      }
      updateNode(draftMenuData.value)
      showSuccess(t('superPanel.menuConfig.messages.updated'))
    } else {
      const newNode: MenuNode = {
        id: form.id, parentId: form.parentId, name: form.name, path: form.path, component: form.component,
        redirect: form.redirect, title: form.title, icon: form.icon, hidden: form.hidden,
        alwaysShow: form.alwaysShow, noCache: form.noCache, sort: form.sort, type: form.type,
        children: [], _isNew: true, _changeType: 'added'
      }
      if (form.parentId) {
        const addToParent = (nodes: MenuNode[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === form.parentId) {
              if (!nodes[i].children) nodes[i].children = []
              nodes[i].children!.push(newNode)
              return true
            }
            const kids = nodes[i].children
            if (kids && addToParent(kids)) return true
          }
          return false
        }
        addToParent(draftMenuData.value)
      } else {
        draftMenuData.value.push(newNode)
      }
      showSuccess(t('superPanel.menuConfig.messages.added'))
    }
    menuEditDialog.visible = false
  })
}

async function deleteMenu(data: MenuNode): Promise<void> {
  const childCount = countChildren(data)
  let message = t('superPanel.menuConfig.delete.confirm', { name: data.title })
  if (childCount > 0) message += '\n' + t('superPanel.menuConfig.delete.withChildren', { count: childCount })
  message += '\n' + t('superPanel.menuConfig.delete.permissionTip')
  const confirmed = await confirmAction(message, t('superPanel.menuConfig.delete.menu'), {
    confirmButtonText: t('superPanel.menuConfig.delete.confirmButton'),
    cancelButtonText: t('superPanel.menuConfig.common.cancel'),
    type: 'warning'
  })
  if (!confirmed) return
  data._deleted = true
  data._changeType = 'deleted'
  showSuccess(t('superPanel.menuConfig.messages.markedDeleted'))
}

function countChildren(node: MenuNode): number {
  let count = 0
  const kids = node.children
  if (kids && kids.length > 0) {
    count += kids.length
    kids.forEach((child) => { count += countChildren(child) })
  }
  return count
}

function findMenuById(nodes: MenuNode[], id: string): MenuNode | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return nodes[i]
    const kids = nodes[i].children
    if (kids && kids.length > 0) {
      const found = findMenuById(kids, id)
      if (found) return found
    }
  }
  return null
}

function handleNodeClick(data: MenuNode): void {
  const sourceData = isEditMode.value ? draftMenuData.value : originalMenuData.value
  const menuInSource = findMenuById(sourceData, data.id)
  selectedMenu.value = menuInSource || data
}

function handleNodeDrop(draggingNode: any): void {
  const markModified = (nodes: MenuNode[], targetId: string): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === targetId) {
        if (!nodes[i]._isNew) nodes[i]._changeType = 'modified'
        nodes[i].parentId = draggingNode.parent?.data?.id || ''
        return true
      }
      const kids = nodes[i].children
      if (kids && markModified(kids, targetId)) return true
    }
    return false
  }
  markModified(draftMenuData.value, draggingNode.data.id)

  const reorderSiblings = (nodes: MenuNode[]): void => {
    nodes.forEach((node, index) => {
      node.sort = index + 1
      if (!node._isNew && node._changeType !== 'modified') node._changeType = 'modified'
    })
  }
  const findAndReorder = (nodes: MenuNode[], parentId: string): boolean => {
    if (!parentId) {
      reorderSiblings(nodes)
      return true
    }
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === parentId && nodes[i].children) {
        reorderSiblings(nodes[i].children!)
        return true
      }
      const kids = nodes[i].children
      if (kids && findAndReorder(kids, parentId)) return true
    }
    return false
  }
  findAndReorder(draftMenuData.value, draggingNode.parent?.data?.id || '')
  showSuccess(t('superPanel.menuConfig.messages.reordered'))
}

function allowDrop(): boolean { return true }
function allowDrag(): boolean { return isEditMode.value }

function getMenuTitle(data: MenuNode): string {
  if (!data || !data.title) return ''
  if (typeof data.title === 'string' && data.title.startsWith('layout.menu.')) {
    try {
      const translated = t(data.title) as unknown
      if (translated && translated !== data.title) {
        if (typeof translated === 'object' && translated !== null) return (translated as Record<string, string>).default || data.title
        return String(translated)
      }
    } catch (e) { /* 翻译失败返回原始 */ }
  }
  return data.title
}

function getMenuTypeLabel(type: number | string): string {
  const typeNum = Number(type)
  const typeMap: Record<number, string> = {
    1: t('superPanel.menuConfig.type.directory'),
    2: t('superPanel.menuConfig.type.menu'),
    3: t('superPanel.menuConfig.type.button'),
    4: t('superPanel.menuConfig.type.param')
  }
  return typeMap[typeNum] || t('superPanel.menuConfig.type.menu')
}

function getMenuTypeTagType(type: number): 'primary' | 'success' | 'warning' | 'info' {
  const map: Record<number, 'primary' | 'success' | 'warning' | 'info'> = { 1: 'success', 2: 'primary', 3: 'warning', 4: 'info' }
  return map[type] || 'info'
}

function getChangeMarkClass(changeType?: string): string {
  const map: Record<string, string> = { added: 'el-icon-plus', modified: 'el-icon-edit', deleted: 'el-icon-delete' }
  return map[changeType || ''] || ''
}

function getParentMenuName(parentId?: string): string {
  if (!parentId) return t('superPanel.menuConfig.messages.topMenu')
  const findMenu = (nodes: MenuNode[]): MenuNode | null => {
    for (const node of nodes) {
      if (node.id === parentId) return node
      const kids = node.children
      if (kids && kids.length > 0) {
        const found = findMenu(kids)
        if (found) return found
      }
    }
    return null
  }
  const parent = findMenu(menuTreeData.value)
  return parent ? getMenuTitle(parent) : parentId
}

onMounted(() => {
  loadMenuData()
})
</script>

<style scoped>
.readonly-path-input :deep(.el-input__inner) {
  background-color: #f5f7fa !important;
  color: #909399 !important;
  cursor: not-allowed !important;
}
.menu-config-container { padding: 20px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding: 16px 20px; background: #fff; border-radius: 4px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); }
.header-left { flex: 1; }
.header-left .page-title { margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #303133; }
.header-left .page-desc { font-size: 13px; color: #909399; margin: 0; }
.header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.warning-icon {
  font-size: 22px; color: #f56c6c; cursor: help; transition: all 0.3s; animation: warningPulse 1.8s ease-in-out infinite;
  display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
  border-radius: 50%; background: rgba(245, 108, 108, 0.1); vertical-align: middle;
}
.warning-icon:hover { color: #f56c6c; background: rgba(245, 108, 108, 0.2); transform: scale(1.15); animation-play-state: paused; }
@keyframes warningPulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.5); }
  50% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(245, 108, 108, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 108, 108, 0); }
}
.edit-mode-tip { background: #fdf6ec; border-left: 4px solid #e6a23c; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #e6a23c; }
.edit-mode-tip .el-icon { font-size: 18px; }
.unsaved-count { margin-left: auto; background: #e6a23c; color: white; padding: 2px 10px; border-radius: 10px; font-size: 12px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px 16px; background: #f5f7fa; border-radius: 4px; }
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 8px; }
.toolbar-divider { width: 1px; height: 20px; background: #dcdfe6; margin: 0 4px; }
.change-stats { background: #f0f9eb; border: 1px solid #e1f3d8; border-radius: 4px; padding: 12px 16px; margin-bottom: 16px; }
.stats-title { font-size: 14px; font-weight: 600; color: #67c23a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.stats-items { display: flex; gap: 24px; flex-wrap: wrap; }
.stats-item { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.stats-item.added { color: #67c23a; }
.stats-item.modified { color: #e6a23c; }
.stats-item.deleted { color: #f56c6c; }
.stats-item.no-change { color: #909399; }
.main-content { display: flex; gap: 0; flex: 1; min-height: 0; }
.menu-tree-panel, .menu-detail-panel { background: white; border: 1px solid #e4e7ed; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.menu-tree-panel { flex-shrink: 0; border-right: none; border-top-right-radius: 0; border-bottom-right-radius: 0; }
.menu-detail-panel { flex: 1; border-top-left-radius: 0; border-bottom-left-radius: 0; }
.resizer { width: 10px; cursor: col-resize; background: transparent; transition: background 0.2s; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; }
.resizer:hover { background: #ecf5ff; }
.resizer-icon { font-size: 14px; color: #c0c4cc; transition: color 0.2s; transform: rotate(90deg); }
.resizer:hover .resizer-icon { color: #409eff; }
.panel-header { padding: 12px 16px; border-bottom: 1px solid #e4e7ed; font-size: 14px; font-weight: 600; color: #303133; display: flex; align-items: center; gap: 6px; }
.panel-header .el-icon { color: #409eff; }
.panel-header .el-button { margin-left: auto; }
.panel-header .el-tag { margin-left: auto; }
.panel-header .mode-tag { margin-left: 8px; font-weight: normal; }
.tree-container { flex: 1; overflow-y: auto; padding: 8px; }
.tree-container :deep(.el-tree-node__content) { height: 44px; border-radius: 4px; margin-bottom: 2px; }
.tree-container :deep(.el-tree-node__content:hover) { background: #f5f7fa; }
.tree-container :deep(.el-tree-node.is-current > .el-tree-node__content) { background: #ecf5ff; }
.custom-tree-node { flex: 1; display: flex; align-items: center; padding-right: 8px; font-size: 13px; }
.node-label { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; }
.deleted-node { text-decoration: line-through; color: #c0c4cc; }
.node-icon { font-size: 16px; color: #909399; flex-shrink: 0; }
.node-title { font-weight: 500; color: #303133; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node-path { font-size: 11px; color: #909399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.node-tags { display: flex; gap: 4px; margin: 0 8px; flex-shrink: 0; }
.node-actions { display: flex; gap: 2px; opacity: 0; transition: opacity 0.2s; flex-shrink: 0; }
.custom-tree-node:hover .node-actions { opacity: 1; }
.node-actions .delete-btn { color: #f56c6c; }
.node-change-mark { margin-left: 4px; flex-shrink: 0; }
.detail-container { flex: 1; overflow-y: auto; padding: 16px; }
.detail-section { margin-bottom: 24px; }
.section-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; display: flex; align-items: center; gap: 6px; }
.section-title .el-icon { color: #409eff; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item.full-width { grid-column: 1 / -1; }
.detail-item label { font-size: 12px; color: #909399; font-weight: 500; }
.detail-value { font-size: 14px; color: #909399; padding: 8px 12px; background: #f5f7fa; border-radius: 4px; border: 1px dashed #dcdfe6; word-break: break-all; min-height: 32px; box-sizing: border-box; display: inline-flex; align-items: center; width: 100%; }
.detail-value.readonly { background: repeating-linear-gradient(45deg, #f5f7fa, #f5f7fa 10px, #ebeef5 10px, #ebeef5 20px); color: #909399; border: 1px solid #dcdfe6; }
.readonly-label { color: #f56c6c; font-size: 11px; margin-left: 4px; font-weight: normal; }
.readonly-tag-wrapper { padding: 4px 12px; background: repeating-linear-gradient(45deg, #f5f7fa, #f5f7fa 10px, #ebeef5 10px, #ebeef5 20px); border: 1px solid #dcdfe6; border-radius: 4px; min-height: 32px; box-sizing: border-box; display: inline-flex; align-items: center; width: 100%; }
.icon-value { display: flex; align-items: center; gap: 10px; }
.icon-value .el-icon { font-size: 18px; color: #409eff; }
.empty-detail { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #909399; }
.empty-detail .el-icon { font-size: 48px; margin-bottom: 12px; }
.empty-detail p { margin: 4px 0; }
.empty-tip { font-size: 12px; color: #c0c4cc; }
.tree-container::-webkit-scrollbar, .detail-container::-webkit-scrollbar { width: 6px; }
.tree-container::-webkit-scrollbar-track, .detail-container::-webkit-scrollbar-track { background: #f5f7fa; }
.tree-container::-webkit-scrollbar-thumb, .detail-container::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
.tree-container::-webkit-scrollbar-thumb:hover, .detail-container::-webkit-scrollbar-thumb:hover { background: #c0c4cc; }
.label-with-tip { display: inline-flex; align-items: center; gap: 4px; }
.label-tip-icon { color: #909399; cursor: help; font-size: 14px; }
.backup-list-section { margin-top: 10px; }
.backup-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.backup-list-title { font-size: 14px; font-weight: 600; color: #303133; }
.backup-list-actions { display: flex; gap: 8px; }
.backup-list-container { position: relative; }
.backup-list-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; color: #909399; font-size: 14px; gap: 10px; }
.backup-list-empty .el-icon { font-size: 40px; color: #c0c4cc; }
.backup-list-container .delete-btn { color: #f56c6c; }
</style>
