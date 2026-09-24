<template>
  <div class="notification-center-page">
    <!-- 头部工具栏 -->
    <div class="center-toolbar">
      <div class="toolbar-left">
        <el-radio-group v-model="filterType" size="small" @change="handleFilterChange">
          <el-radio-button value="">{{ t('notification.filter.all') }}</el-radio-button>
          <el-radio-button value="alarm">{{ t('notification.type.device') }}</el-radio-button>
          <el-radio-button value="production">{{ t('notification.type.production') }}</el-radio-button>
          <el-radio-button value="system">{{ t('notification.type.system') }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="keyword"
          :placeholder="t('notification.page.searchPlaceholder')"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter="handleFilterChange"
        />
        <el-button size="small" @click="handleMarkAll">{{ t('notification.action.markAllRead') }}</el-button>
        <el-button size="small" @click="openSettings">{{ t('notification.settings.title') }}</el-button>
      </div>
    </div>

    <!-- 通知列表 -->
    <el-card v-loading="loading" shadow="never" class="list-card">
      <el-empty v-if="items.length === 0" :description="t('notification.page.empty')" />
      <div
        v-for="item in items"
        :key="item.id"
        class="notify-item"
        :class="{ unread: !item.read }"
        @click="handleMarkRead(item.raw)"
      >
        <div class="notify-icon">
          <el-icon :size="18" :color="typeColor(item.type)"><component :is="typeIcon(item.type)" /></el-icon>
        </div>
        <div class="notify-body">
          <div class="notify-title-row">
            <span class="notify-title">{{ item.title }}</span>
            <el-badge v-if="!item.read" is-dot />
          </div>
          <div class="notify-content">{{ item.content }}</div>
          <div class="notify-time">{{ item.time }}</div>
        </div>
        <div class="notify-actions">
          <el-button type="danger" link size="small" @click.stop="handleDelete(item.raw)">{{
            t('notification.action.delete')
          }}</el-button>
        </div>
      </div>
    </el-card>

    <!-- 分页 -->
    <div class="pager">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="onPageChange"
      />
    </div>

    <!-- 设置弹窗 -->
    <el-dialog v-model="settingsVisible" :title="t('notification.settings.title')" width="520px">
      <el-form label-width="160px">
        <el-form-item :label="t('notification.settings.popupEnabled')">
          <el-switch v-model="settings.popupEnabled" />
        </el-form-item>
        <el-form-item :label="t('notification.settings.soundEnabled')">
          <el-switch v-model="settings.soundEnabled" />
        </el-form-item>
        <el-form-item :label="t('notification.settings.device')">
          <el-switch v-model="settings.typeEnabled.device" />
        </el-form-item>
        <el-form-item :label="t('notification.settings.plc')">
          <el-switch v-model="settings.typeEnabled.plc" />
        </el-form-item>
        <el-form-item :label="t('notification.settings.system')">
          <el-switch v-model="settings.typeEnabled.system" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="settingsVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="settingsSaving" @click="saveSettings">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 通知中心页：列表 / 类型筛选 / 已读 / 全部已读 / 删除 / 通知设置
 * 数据与行为封装在 useNotification（地基已提供），本页仅做视图组合。
 * 说明：原 Vue2 版拆分为 NotificationFilter / NotificationItem /
 * NotificationBatchToolbar / NotificationSettings 等通用子组件，待「通用组件 shard」
 * 迁移 src/components 后，可将本页内联 UI 拆回对应子组件。
 * 作者：GooHv
 */
import { ref, computed, onMounted } from 'vue'
import { Bell, Warning, Tools, InfoFilled } from '@element-plus/icons-vue'
import { useI18n } from '@/composables/useI18n'
import { useNotification } from '@/composables/useNotification'
import { toNotificationVMList, type NotificationDTO, type NotificationVM } from '@/utils/business/notificationPresenter'

const { t } = useI18n()
const {
  list,
  loading,
  total,
  pageNum,
  pageSize,
  filterType,
  keyword,
  getList,
  handleFilterChange,
  handleMarkRead,
  handleMarkAll,
  handleDelete,
  settings,
  settingsSaving,
  loadSettings,
  saveSettings
} = useNotification()

const settingsVisible = ref(false)

/** 后端 DTO 列表统一经展示适配层映射为视图模型（标题/内容翻译、相对时间、已读布尔） */
const items = computed<NotificationVM[]>(() =>
  toNotificationVMList(
    t as unknown as (key: string, named?: Record<string, unknown>) => string,
    list.value as unknown as NotificationDTO[]
  )
)

function typeIcon(type: string) {
  if (type === 'alarm') return Warning
  if (type === 'production') return Tools
  if (type === 'system') return InfoFilled
  return Bell
}
function typeColor(type: string): string {
  if (type === 'alarm') return '#f56c6c'
  if (type === 'production') return '#409eff'
  if (type === 'system') return '#909399'
  return '#67c23a'
}

function onPageChange(p: number) {
  pageNum.value = p
  getList()
}
function openSettings() {
  loadSettings()
  settingsVisible.value = true
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.notification-center-page {
  padding: 16px;
}
.center-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.list-card :deep(.el-card__body) {
  padding: 0;
}
.notify-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}
.notify-item.unread {
  background: #f5f9ff;
}
.notify-item:hover {
  background: #f8f9fb;
}
.notify-icon {
  margin-right: 12px;
}
.notify-body {
  flex: 1;
}
.notify-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.notify-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.notify-content {
  font-size: 12px;
  color: #606266;
  margin: 4px 0;
}
.notify-time {
  font-size: 11px;
  color: #909399;
}
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
