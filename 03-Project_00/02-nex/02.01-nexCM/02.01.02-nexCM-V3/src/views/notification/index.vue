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
      <el-radio-group v-model="filterType" size="small" @change="getList">
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

<script>
import Pagination from '@/components/Pagination/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import ExportDropdown from '@/components/ExportDropdown/index.vue'
import dictMixin from '@/mixins/dict'
import { formatDate } from '@/utils/date'
import {
  requestGetNotificationListApi,
  requestMarkAsReadApi,
  requestMarkAllAsReadApi,
  requestDeleteNotificationApi
} from '@/api'

export default {
  name: 'NotificationPage',
  components: { Pagination, DictTag, ExportDropdown },
  mixins: [dictMixin],
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      filterType: '',
      /** 需要加载的字典编码 */
      dictCodes: ['notification_type', 'notification_priority']
    }
  },
  computed: {
    exportColumns() {
      return [
        { label: this.$t('notification.type'), prop: 'type', width: 100, formatter: row => this.typeMap[row.type] || row.type },
        { label: this.$t('notification.title'), prop: 'title', width: 200 },
        { label: this.$t('notification.content'), prop: 'content', width: 300 },
        {
          label: this.$t('notification.read'),
          prop: 'is_read',
          width: 80,
          formatter: row => (row.is_read === 1 ? this.$t('notification.read') : this.$t('notification.unread'))
        },
        { label: this.$t('common.createTime'), prop: 'created_at', width: 170, formatter: row => formatDate(row.created_at) }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const params = { page: this.pageNum, pageSize: this.pageSize }
        if (this.filterType !== '') {
          params.isRead = this.filterType
        }
        const res = await requestGetNotificationListApi(params)
        this.tableData = res.data?.list || []
        this.total = res.data?.total || 0
      } finally {
        this.loading = false
      }
    },
    async handleMarkRead(item) {
      await requestMarkAsReadApi(item.id)
      item.is_read = 1
      this.$message.success(this.$t('notification.markReadSuccess'))
    },
    async handleMarkAll() {
      await requestMarkAllAsReadApi()
      this.$message.success(this.$t('notification.markAllSuccess'))
      this.getList()
    },
    handleDetail(item) {
      if (!item.is_read) {
        this.handleMarkRead(item)
      }
    },
    handleDelete(item) {
      this.$confirm(this.$t('notification.deleteConfirm'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async () => {
        await requestDeleteNotificationApi(item.id)
        this.$message.success(this.$t('common.deleteSuccess'))
        this.getList()
      }).catch(() => {})
    },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  }
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
