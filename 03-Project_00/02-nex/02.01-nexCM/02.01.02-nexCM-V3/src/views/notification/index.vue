<template>
  <div class="notification-page">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="title">{{ $t('notification.title') }}</div>
      <div class="actions">
        <export-dropdown
          :data="tableData"
          :columns="exportColumns"
          :title="$t('notification.title')"
          :filename="$t('notification.title')"
          :exporter="$store.state.user.userInfo?.username || ''"
        />
        <el-button type="primary" size="small" icon="el-icon-check" @click="handleMarkAll">
          {{ $t('notification.markAllRead') }}
        </el-button>
        <el-button size="small" icon="el-icon-refresh" @click="getList">
          {{ $t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <el-radio-group v-model="filterType" size="small" @change="handleFilterChange">
        <el-radio-button label="">{{ $t('notification.all') }}</el-radio-button>
        <el-radio-button label="0">{{ $t('notification.unread') }}</el-radio-button>
        <el-radio-button label="1">{{ $t('notification.read') }}</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list" v-loading="loading">
      <div
        v-for="item in tableData"
        :key="item.id"
        class="notification-item"
        :class="{ unread: !item.is_read }"
        @click="handleDetail(item)"
      >
        <div class="item-header">
          <el-tag size="mini" :type="priorityMap[item.priority] || 'info'">
            <dict-tag dict-code="notification_type" :value="item.type" />
          </el-tag>
          <span class="item-title">{{ item.title }}</span>
          <span class="item-time">{{ formatTime(item.created_at) }}</span>
        </div>
        <div class="item-content">{{ item.content }}</div>
        <div class="item-actions" @click.stop>
          <el-button v-if="!item.is_read" type="text" size="mini" @click="handleMarkRead(item)">
            {{ $t('notification.markRead') }}
          </el-button>
          <el-button type="text" size="mini" style="color: #f56c6c" @click="handleDelete(item)">
            {{ $t('common.delete') }}
          </el-button>
        </div>
      </div>

      <div v-if="!loading && tableData.length === 0" class="empty-state">
        <i class="el-icon-bell empty-icon"></i>
        <p class="empty-text">{{ $t('notification.empty') }}</p>
      </div>
    </div>

    <!-- 分页 -->
    <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize" @pagination="getList" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useTable } from '@/composables/useTable'
import { useDict } from '@/composables/useDict'
import Pagination from '@/components/Pagination/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import { formatDate } from '@/utils/date'
import {
  requestGetNotificationListApi,
  requestMarkAsReadApi,
  requestMarkAllAsReadApi,
  requestDeleteNotificationApi
} from '@/api'

// 预加载字典数据（dict-tag 组件会自动使用）
useDict(['notification_type', 'notification_priority'])

// 筛选类型
const filterType = ref('')

// 搜索参数
const queryParams = reactive({
  isRead: ''
})

// 请求前参数转换
function beforeFetch(params) {
  const { pageNum, isRead, ...rest } = params
  const result = { page: pageNum, ...rest }
  if (isRead !== '') {
    result.isRead = isRead
  }
  return result
}

// 使用 useTable 组合式函数
const {
  loading,
  tableData,
  total,
  pageNum,
  pageSize,
  getList
} = useTable(requestGetNotificationListApi, queryParams, { beforeFetch })


// 筛选改变
function handleFilterChange() {
  queryParams.isRead = filterType.value
  pageNum.value = 1
  getList()
}

// 优先级映射
const priorityMap = computed(() => ({
  high: 'danger',
  medium: 'warning',
  low: 'info'
}))

// 导出列配置
const exportColumns = computed(() => [
  { label: '类型', prop: 'type', width: 100 },
  { label: '标题', prop: 'title', width: 200 },
  { label: '内容', prop: 'content', width: 300 },
  {
    label: '是否已读',
    prop: 'is_read',
    width: 80,
    formatter: row => (row.is_read === 1 ? '已读' : '未读')
  },
  { label: '创建时间', prop: 'created_at', width: 170, formatter: row => formatDate(row.created_at) }
])

// 标记为已读
async function handleMarkRead(item) {
  await requestMarkAsReadApi(item.id)
  item.is_read = 1
}

// 全部标记为已读
async function handleMarkAll() {
  await requestMarkAllAsReadApi()
  getList()
}

// 查看详情
function handleDetail(item) {
  if (!item.is_read) {
    handleMarkRead(item)
  }
}

// 删除
function handleDelete(item) {
  // 确认删除逻辑
  requestDeleteNotificationApi(item.id).then(() => {
    getList()
  }).catch(() => {})
}

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
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
  .filter-tabs {
    margin-bottom: 16px;
  }
  .notification-list {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    min-height: 400px;
    .notification-item {
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s;
      &:hover {
        background: #f5f7fa;
      }
      &.unread {
        background: #f0f9ff;
        .item-title {
          font-weight: 600;
        }
      }
      .item-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        .item-title {
          flex: 1;
          font-size: 14px;
        }
        .item-time {
          color: #909399;
          font-size: 12px;
        }
      }
      .item-content {
        color: #606266;
        font-size: 13px;
        line-height: 1.6;
        margin-bottom: 8px;
      }
      .item-actions {
        text-align: right;
      }
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      color: #909399;
      .empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        color: #c0c4cc;
      }
      .empty-text {
        font-size: 14px;
        margin: 0;
      }
    }
  }
}
</style>
