<template>
  <div class="notification-bell">
    <el-badge :value="badgeText" :hidden="!hasUnread" class="badge-wrapper">
      <div class="bell-btn" @click.stop="togglePanel">
        <i class="el-icon-bell"></i>
      </div>
    </el-badge>

    <!-- 下拉面板 -->
    <transition name="fade">
      <div v-show="showPanel" class="notification-panel" @click.stop>
        <!-- 标题栏 -->
        <div class="panel-header">
          <span class="panel-title">{{ $t('notification.center') }}</span>
          <span v-if="hasUnread" class="mark-all-read" @click="handleMarkAllRead">{{ $t('notification.markAllRead') }}</span>
        </div>

        <!-- 通知列表 -->
        <div class="panel-list">
          <div v-if="loading" class="panel-loading">
            <i class="el-icon-loading"></i>
            <span>{{ $t('common.loading') }}</span>
          </div>
          <div v-else-if="notifications.length === 0" class="panel-empty">
            <i class="el-icon-document"></i>
            <span>{{ $t('notification.empty') }}</span>
          </div>
          <div
            v-for="item in notifications"
            :key="item.id"
            class="notification-item"
            :class="{ unread: !item.is_read }"
            @click="handleItemClick(item)"
          >
            <div class="item-icon" :class="'type-' + (item.type || 'system')">
              <i :class="getTypeIcon(item.type)"></i>
            </div>
            <div class="item-content">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-desc">{{ item.content }}</div>
              <div class="item-time">{{ formatTime(item.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- 底部查看全部 -->
        <div class="panel-footer" @click="goToNotificationPage">
          <span class="view-all">{{ $t('notification.viewAll') }} →</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  requestGetUnreadCountApi,
  requestGetNotificationListApi,
  requestMarkAsReadApi,
  requestMarkAllAsReadApi
} from '@/api'
import ws from '@/utils/websocket'

export default {
  name: 'NotificationBell',
  data() {
    return {
      showPanel: false,
      loading: false,
      unreadCount: 0,
      notifications: []
    }
  },
  computed: {
    hasUnread() {
      return this.unreadCount > 0
    },
    /** 角标显示：>9 显示 "..." */
    badgeText() {
      if (this.unreadCount > 9) return '...'
      return this.unreadCount
    }
  },
  methods: {
    /** 获取未读数量 */
    async fetchUnreadCount() {
      try {
        const res = await requestGetUnreadCountApi()
        this.unreadCount = res.data?.count || 0
      } catch (e) {
        // 静默失败
      }
    },
    /** 获取通知列表（下拉面板显示最近5条） */
    async fetchNotifications() {
      this.loading = true
      try {
        const res = await requestGetNotificationListApi({ page: 1, pageSize: 5 })
        this.notifications = res.data?.list || []
      } catch (e) {
        this.notifications = []
      } finally {
        this.loading = false
      }
    },
    /** 切换面板 */
    togglePanel() {
      this.showPanel = !this.showPanel
      if (this.showPanel) {
        this.fetchNotifications()
      }
    },
    /** 点击单条通知：标记已读 */
    async handleItemClick(item) {
      if (!item.is_read) {
        try {
          await requestMarkAsReadApi(item.id)
          item.is_read = 1
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        } catch (e) {
          // 静默失败
        }
      }
    },
    /** 全部已读 */
    async handleMarkAllRead() {
      try {
        await requestMarkAllAsReadApi()
        this.notifications.forEach(item => { item.is_read = 1 })
        this.unreadCount = 0
        this.$message.success(this.$t('notification.markAllSuccess'))
      } catch (e) {
        this.$message.error(this.$t('common.operationFailed'))
      }
    },
    /** 跳转到通知中心完整页面 */
    goToNotificationPage() {
      this.showPanel = false
      this.$router.push('/notification')
    },
    /** 获取通知类型图标 */
    getTypeIcon(type) {
      const iconMap = {
        system: 'el-icon-message',
        plc: 'el-icon-cpu',
        user: 'el-icon-user',
        audit: 'el-icon-document',
        warning: 'el-icon-warning',
        info: 'el-icon-info',
        success: 'el-icon-success'
      }
      return iconMap[type] || 'el-icon-message'
    },
    /** 格式化时间 */
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return this.$t('notification.justNow') || '刚刚'
      if (minutes < 60) return `${minutes}${this.$t('notification.minutesAgo') || '分钟前'}`
      if (hours < 24) return `${hours}${this.$t('notification.hoursAgo') || '小时前'}`
      if (days < 7) return `${days}${this.$t('notification.daysAgo') || '天前'}`
      return date.toLocaleDateString()
    },
    /** 点击外部关闭面板 */
    handleClickOutside() {
      this.showPanel = false
    },
    /** WebSocket 收到新通知 */
    handleWsNotification(data) {
      // eslint-disable-next-line no-console
      console.log('[通知铃铛] 收到新通知:', data)
      this.unreadCount++
      // 如果面板打开着，刷新列表
      if (this.showPanel) {
        this.fetchNotifications()
      }
      // 可选：播放提示音或显示桌面通知
    }
  },
  mounted() {
    // 初始获取未读数量
    this.fetchUnreadCount()
    // 监听 WebSocket 新通知（实时推送，无需轮询）
    ws.on('notification', this.handleWsNotification)
    // 点击外部关闭
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    ws.off('notification', this.handleWsNotification)
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped lang="less">
.notification-bell {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.bell-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  color: #606266;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f5f7fa;
    color: #409eff;
  }
}

.badge-wrapper {
  display: inline-flex;

  /* 调整角标大小和位置 */
  ::v-deep .el-badge__content {
    font-size: 10px;
    line-height: 16px;
    min-height: 16px;
    padding: 0 4px;
    top: 4px;
    right: 2px;
  }
}

/* 下拉面板 */
.notification-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-height: 480px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 标题栏 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;

  .panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .mark-all-read {
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #66b1ff;
    }
  }
}

/* 通知列表 */
.panel-list {
  flex: 1;
  overflow-y: auto;
  max-height: 360px;
}

.panel-loading,
.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  color: #909399;
  font-size: 13px;

  i {
    font-size: 32px;
    margin-bottom: 8px;
  }
}

.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f7fa;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f7fa;
  }

  /* 未读项左侧蓝色竖条 */
  &.unread::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #409eff;
  }

  .item-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-right: 12px;
    flex-shrink: 0;

    &.type-system {
      background: #ecf5ff;
      color: #409eff;
    }

    &.type-plc {
      background: #f0f9eb;
      color: #67c23a;
    }

    &.type-user {
      background: #fdf6ec;
      color: #e6a23c;
    }

    &.type-audit {
      background: #f4f4f5;
      color: #909399;
    }

    &.type-warning {
      background: #fef0f0;
      color: #f56c6c;
    }

    &.type-info {
      background: #f4f4f5;
      color: #909399;
    }

    &.type-success {
      background: #f0f9eb;
      color: #67c23a;
    }
  }

  .item-content {
    flex: 1;
    min-width: 0;

    .item-title {
      font-size: 13px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-desc {
      font-size: 12px;
      color: #606266;
      line-height: 1.4;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-time {
      font-size: 11px;
      color: #c0c4cc;
    }
  }
}

/* 底部查看全部 */
.panel-footer {
  padding: 10px 16px;
  border-top: 1px solid #ebeef5;
  text-align: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f5f7fa;
  }

  .view-all {
    font-size: 13px;
    color: #409eff;
  }
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
