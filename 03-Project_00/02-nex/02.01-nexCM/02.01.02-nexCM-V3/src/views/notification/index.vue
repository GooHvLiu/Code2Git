<template>
  <div class="notification-page">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="title">{{ $t('notification.title') }}</div>
      <div class="actions">
        <el-button size="small" icon="el-icon-setting" @click="showSettings = true">
          {{ $t('notification.notificationSettings') }}
        </el-button>
        <export-dropdown
          :data="list"
          :columns="exportColumns"
          :title="$t('notification.title')"
          :filename="$t('notification.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
        <el-button type="primary" size="small" icon="el-icon-check" @click="handleMarkAllWithConfirm">
          {{ $t('notification.markAllRead') }}
        </el-button>
        <el-button size="small" icon="el-icon-refresh" @click="getList">
          {{ $t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 - 使用可复用组件 -->
    <NotificationFilter
      :archiveTab.sync="archiveTab"
      :filterType.sync="filterType"
      :readFilter.sync="readFilter"
      :priorityFilter.sync="priorityFilter"
      :timeFilter.sync="timeFilter"
      :dateRange.sync="dateRange"
      :keyword.sync="keyword"
      @archive-change="handleArchiveChange"
      @filter-change="handleFilterChange"
      @read-filter-change="handleReadFilterChange"
      @time-filter-change="handleTimeFilterChange"
      @date-range-change="handleDateRangeChange"
      @reset="handleReset"
    />

    <!-- 批量操作工具栏 - 使用可复用组件 -->
    <NotificationBatchToolbar
      v-if="selectedIds.length > 0"
      :selected-count="selectedIds.length"
      :archive-tab="archiveTab"
      @batch-mark-read="handleBatchMarkRead"
      @batch-archive="handleBatchArchive"
      @batch-unarchive="handleBatchUnarchive"
      @batch-delete="handleBatchDeleteWithConfirm"
      @clear-selection="clearSelection"
    />

    <!-- 通知列表 - 使用可复用组件 -->
    <div class="notification-list" v-loading="loading">
      <NotificationItem
        v-for="item in list"
        :key="item.id"
        :item="item"
        :selected="selectedIds.includes(item.id)"
        :show-checkbox="true"
        :archive-tab="archiveTab"
        @click="handleDetail"
        @dblclick="handleDoubleClick"
        @toggle-select="toggleSelect"
        @mark-read="handleMarkRead"
        @archive="handleArchive"
        @unarchive="handleUnarchive"
        @delete="handleDeleteWithConfirm"
      />

      <div v-if="!loading && list.length === 0" class="empty-state">
        <i class="el-icon-bell empty-icon"></i>
        <p class="empty-text">{{ $t('notification.empty') }}</p>
      </div>
    </div>

    <!-- 分页 -->
    <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="getList" />

    <!-- 通知设置弹窗 -->
    <notification-settings v-model="showSettings" @updated="handleSettingsUpdated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useNotification } from '@/composables/useNotification'
import Pagination from '@/components/Pagination/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import NotificationSettings from '@/components/NotificationSettings/index.vue'
import NotificationFilter from '@/components/NotificationFilter/index.vue'
import NotificationBatchToolbar from '@/components/NotificationBatchToolbar/index.vue'
import NotificationItem from '@/components/NotificationItem/index.vue'
import { formatDate } from '@/utils/date'
import router from '@/router'
import { Message, MessageBox } from 'element-ui'

// 获取 i18n 实例
const { proxy } = getCurrentInstance()
const $t = proxy.$t.bind(proxy)

// 通知设置弹窗
const showSettings = ref(false)

// 使用 useNotification composable
const {
  // 列表数据
  list, loading, total, pageNum, pageSize,
  // 筛选状态
  archiveTab, filterType, readFilter, priorityFilter, timeFilter, dateRange, keyword,
  // 批量选择
  selectedIds, toggleSelect, clearSelection,
  // 操作方法
  getList, handleMarkRead, handleMarkAll, handleBatchMarkRead,
  handleDelete, handleBatchDelete, handleArchive, handleBatchArchive,
  handleUnarchive, handleBatchUnarchive,
  // 筛选方法
  handleArchiveChange, handleFilterChange, handleReadFilterChange,
  handleTimeFilterChange, handleDateRangeChange
} = useNotification({ autoLoad: false })

// 重置筛选
function handleReset() {
  getList()
}

// 查看详情
function handleDetail(item) {
  if (!item.is_read) {
    handleMarkRead(item)
  }
}

// 双击打开通知详情（跳转到对应的菜单页面）
function handleDoubleClick(item) {
  if (!item.is_read) {
    handleMarkRead(item)
  }
  const routeMap = {
    system: '/system/config',
    plc: '/device/state',
    user: '/system/user',
    audit: '/system/audit',
    device: '/system/config',
    connection: '/system/config',
    security: '/system/user'
  }
  const targetRoute = routeMap[item.type]
  if (targetRoute) {
    router.push(targetRoute)
  }
}

// 重写删除方法，添加确认对话框
async function handleDeleteWithConfirm(item) {
  try {
    await MessageBox.confirm($t('notification.deleteConfirm'), $t('notification.delete'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning'
    })
    await handleDelete(item)
    Message.success($t('notification.deleteSuccess'))
  } catch (e) {
    // 用户取消，不做处理
  }
}

// 重写批量删除方法，添加确认对话框
async function handleBatchDeleteWithConfirm() {
  if (selectedIds.value.length === 0) {
    Message.warning($t('notification.deleteConfirm'))
    return
  }
  try {
    await MessageBox.confirm($t('notification.batchDeleteConfirm', { count: selectedIds.value.length }), $t('notification.batchDelete'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning'
    })
    await handleBatchDelete()
    Message.success($t('notification.batchDeleteSuccess'))
  } catch (e) {
    // 用户取消，不做处理
  }
}

// 重写全部已读方法，添加确认对话框
async function handleMarkAllWithConfirm() {
  try {
    await MessageBox.confirm($t('notification.markAllConfirm'), $t('notification.markAllRead'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'info'
    })
    await handleMarkAll()
    Message.success($t('notification.markAllSuccess'))
  } catch (e) {
    // 用户取消，不做处理
  }
}

// 设置更新后刷新
function handleSettingsUpdated() {
  getList()
}

// 导出列配置
const exportColumns = computed(() => [
  { label: $t('notification.type'), prop: 'type', width: 100 },
  { label: $t('notification.title'), prop: 'title', width: 200 },
  { label: $t('notification.content'), prop: 'content', width: 300 },
  {
    label: $t('notification.read'),
    prop: 'is_read',
    width: 80,
    formatter: row => (row.is_read === 1 ? $t('notification.read') : $t('notification.unread'))
  },
  { label: $t('notification.createdAt'), prop: 'created_at', width: 170, formatter: row => formatDate(row.created_at) }
])

// 监听全局事件，当小窗口标记全部已读后自动刷新数据
function handleNotificationUpdated() {
  getList()
}

onMounted(() => {
  getList()
  window.addEventListener('notification-updated', handleNotificationUpdated)
})

onBeforeUnmount(() => {
  window.removeEventListener('notification-updated', handleNotificationUpdated)
})
</script>

<style scoped lang="less">
.notification-page {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .title {
      font-size: 18px;
      font-weight: 600;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .notification-list {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 8px;
    margin-bottom: 16px;
    min-height: 300px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #909399;

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      color: #c0c4cc;
    }

    .empty-text {
      font-size: 14px;
      margin: 0;
    }
  }
}
</style>
