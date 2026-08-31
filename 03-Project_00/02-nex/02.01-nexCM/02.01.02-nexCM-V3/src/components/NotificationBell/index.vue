<template>
  <div class="notification-bell">
    <div class="bell-btn" :class="{ 'bell-ringing': hasUnread }" @click.stop="togglePanel">
      <i class="el-icon-bell bell-icon"></i>
    </div>

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
            :class="{ unread: !item.is_read, read: item.is_read }"
            @click="handleItemClick(item)"
            @dblclick="goToNotificationPage"
          >
            <div class="item-status">
              <span v-if="!item.is_read" class="status-dot unread-dot"></span>
            </div>
            <div class="item-icon" :class="'type-' + (item.type || 'system')">
              <i :class="getTypeIcon(item.type)"></i>
            </div>
            <div class="item-content">
              <div class="item-title-row">
                <span class="item-title">{{ getDisplayTitle(item) }}</span>
                <el-tag v-if="!item.is_read" size="mini" type="danger" effect="dark" class="status-tag">{{ $t('notification.unread') }}</el-tag>
                <el-tag v-else size="mini" type="info" effect="plain" class="status-tag">{{ $t('notification.read') }}</el-tag>
              </div>
              <div class="item-desc">{{ getDisplayContent(item) }}</div>
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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Message } from 'element-ui'
import {
  requestGetUnreadCountApi,
  requestGetNotificationListApi,
  requestMarkAsReadApi,
  requestMarkAllAsReadApi
} from '@/api'
import ws from '@/utils/websocket'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

// ===== 响应式数据 =====
const showPanel = ref(false)
const loading = ref(false)
const notifications = ref([])

// ===== 计算属性 =====
// 未读数量从 Vuex 中获取，实现全局状态同步
const unreadCount = computed(() => store.state.notification.unreadCount)
const hasUnread = computed(() => unreadCount.value > 0)

// ===== 方法 =====
/** 获取未读数量 */
async function fetchUnreadCount() {
  // 未登录时不请求未读数量，避免退出登录后出现参数错误
  if (!getToken()) {
    store.commit('notification/CLEAR_UNREAD_COUNT')
    return
  }
  try {
    const res = await requestGetUnreadCountApi()
    const count = res.data?.count || 0
    // 保存到 Vuex 中，实现全局状态同步
    store.commit('notification/SET_UNREAD_COUNT', count)
  } catch (e) {
    // 静默失败
  }
}

/** 获取通知列表（下拉面板显示最近5条） */
async function fetchNotifications() {
  // 未登录时不请求通知列表
  if (!getToken()) {
    notifications.value = []
    return
  }
  loading.value = true
  try {
    const res = await requestGetNotificationListApi({ page: 1, pageSize: 5 })
    notifications.value = res.data?.list || []
  } catch (e) {
    notifications.value = []
  } finally {
    loading.value = false
  }
}

/** 切换面板 */
function togglePanel() {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    fetchNotifications()
  }
}

/** 点击单条通知：标记已读 */
async function handleItemClick(item) {
  if (!item.is_read) {
    try {
      await requestMarkAsReadApi(item.id)
      item.is_read = 1
      // 更新 Vuex 中的未读数量
      store.commit('notification/DECREMENT_UNREAD_COUNT', 1)
      broadcastUnreadCountChange()
    } catch (e) {
      // 静默失败
    }
  }
}

/** 全部已读 */
async function handleMarkAllRead() {
  try {
    await requestMarkAllAsReadApi()
    notifications.value.forEach(item => { item.is_read = 1 })
    // 清零 Vuex 中的未读数量
    store.commit('notification/CLEAR_UNREAD_COUNT')
    Message.success($t('notification.markAllSuccess'))
    // 广播给其他标签页
    broadcastUnreadCountChange()
    broadcastNotificationUpdated()
  } catch (e) {
    Message.error($t('common.operationFailed'))
  }
}

/** 跳转到通知中心完整页面 */
function goToNotificationPage() {
  showPanel.value = false
  router.push('/notification')
}

/** 获取通知类型图标 */
function getTypeIcon(type) {
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
}

/** 解析动态参数（JSON 字符串转对象） */
function parseParams(paramsStr) {
  if (!paramsStr) return {}
  try {
    return typeof paramsStr === 'string' ? JSON.parse(paramsStr) : paramsStr
  } catch (e) {
    return {}
  }
}

/** 获取显示标题：使用国际化 key + 动态参数 */
function getDisplayTitle(item) {
  if (!item) return ''
  const params = parseParams(item.title_params)
  return $t(item.title_key, params)
}

/** 获取显示内容：使用国际化 key + 动态参数 */
function getDisplayContent(item) {
  if (!item) return ''
  const params = parseParams(item.content_params)
  return $t(item.content_key, params)
}

/** 格式化时间 */
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return $t('notification.justNow') || '刚刚'
  if (minutes < 60) return `${minutes}${$t('notification.minutesAgo') || '分钟前'}`
  if (hours < 24) return `${hours}${$t('notification.hoursAgo') || '小时前'}`
  if (days < 7) return `${days}${$t('notification.daysAgo') || '天前'}`
  return date.toLocaleDateString()
}

/** 点击外部关闭面板 */
function handleClickOutside() {
  showPanel.value = false
}

/** WebSocket 收到新通知 */
function handleWsNotification() {
  // 更新 Vuex 中的未读数量
  store.commit('notification/INCREMENT_UNREAD_COUNT', 1)
  // 如果面板打开着，刷新列表
  if (showPanel.value) {
    fetchNotifications()
  }
  // 广播给其他标签页
  broadcastUnreadCountChange()
}

/** WebSocket 收到已读同步消息（其他设备标记已读） */
function handleWsNotificationRead(data) {
  if (!data) return
  // 更新 Vuex 中的未读数量为最新值
  if (data?.unreadCount !== undefined) {
    store.commit('notification/SET_UNREAD_COUNT', data.unreadCount)
  }
  // 如果面板打开着，直接更新本地通知列表的已读状态（不重新获取，避免显示 loading）
  if (showPanel.value) {
    if (data.markAll) {
      // 全部标记已读
      notifications.value.forEach(item => {
        item.is_read = 1
      })
    } else if (data.notificationIds && data.notificationIds.length > 0) {
      // 批量标记已读
      const idSet = new Set(data.notificationIds)
      notifications.value.forEach(item => {
        if (idSet.has(item.id)) {
          item.is_read = 1
        }
      })
    }
  }
  // 广播给其他标签页
  broadcastUnreadCountChange()
}

// ===== 生命周期 =====
let afterEachUnsubscribe = null
let broadcastChannel = null

onMounted(() => {
  // 初始获取未读数量
  fetchUnreadCount()
  // 监听 WebSocket 新通知（实时推送）
  ws.on('notification', handleWsNotification)
  // 监听 WebSocket 已读同步消息（其他设备标记已读）
  ws.on('notification_read', handleWsNotificationRead)
  // 点击外部关闭
  document.addEventListener('click', handleClickOutside)
  // 监听路由变化，在路由切换时获取未读数量
  afterEachUnsubscribe = router.afterEach(() => {
    fetchUnreadCount()
  })

  // 多标签页未读数同步
  if ('BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('notification-center')
    broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'unread-count-changed') {
        // 更新 Vuex 中的未读数量
        store.commit('notification/SET_UNREAD_COUNT', event.data.count)
      } else if (event.data.type === 'notification-updated') {
        fetchUnreadCount()
        if (showPanel.value) {
          fetchNotifications()
        }
      }
    }
  } else {
    // 兼容不支持 BroadcastChannel 的浏览器，使用 localStorage
    window.addEventListener('storage', handleStorageChange)
  }
})

// localStorage 变化监听（兼容旧浏览器）
function handleStorageChange(event) {
  if (event.key === 'notification_unread_count') {
    // 更新 Vuex 中的未读数量
    store.commit('notification/SET_UNREAD_COUNT', Number(event.newValue) || 0)
  } else if (event.key === 'notification_updated') {
    fetchUnreadCount()
    if (showPanel.value) {
      fetchNotifications()
    }
  }
}

// 广播未读数变化
function broadcastUnreadCountChange() {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'unread-count-changed', count: unreadCount.value })
  }
  // 同时使用 localStorage 兼容旧浏览器
  try {
    localStorage.setItem('notification_unread_count', String(unreadCount.value))
  } catch (e) {
    // localStorage 可能被禁用或达到配额限制，静默失败
  }
}

// 广播通知更新
function broadcastNotificationUpdated() {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'notification-updated' })
  }
  try {
    localStorage.setItem('notification_updated', String(Date.now()))
  } catch (e) {
    // localStorage 可能被禁用或达到配额限制，静默失败
  }
}

onBeforeUnmount(() => {
  ws.off('notification', handleWsNotification)
  ws.off('notification_read', handleWsNotificationRead)
  document.removeEventListener('click', handleClickOutside)
  // 取消路由监听
  if (afterEachUnsubscribe) {
    afterEachUnsubscribe()
    afterEachUnsubscribe = null
  }
  // 关闭 BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.close()
    broadcastChannel = null
  }
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped lang="less">
.notification-bell {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.bell-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  color: #606266;
  transition: background 0.15s, color 0.15s;
  position: relative;

  &:hover {
    background: #f5f7fa;
    color: #409eff;
  }

  /* 铃铛摇晃动画 */
  &.bell-ringing {
    .bell-icon {
      display: inline-block;
      transform-origin: top center;
      animation: bell-shake 1.5s ease-in-out infinite;
    }
  }

  /* 有未读消息时，铃铛颜色变化 */
  &.bell-ringing .bell-icon {
    color: #f56c6c;
  }
}

/* 铃铛摇晃动画关键帧 */
@keyframes bell-shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: rotate(-12deg);
  }
  20%, 40%, 60%, 80% {
    transform: rotate(12deg);
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
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f7fa;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f7fa;
    transform: translateX(2px);
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

  /* 已读项半透明效果 */
  &.read {
    opacity: 0.7;
  }

  /* 状态点 */
  .item-status {
    display: flex;
    align-items: center;
    padding-top: 8px;
    margin-right: 8px;
    flex-shrink: 0;

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .unread-dot {
      background: #f56c6c;
      box-shadow: 0 0 6px rgba(245, 108, 108, 0.6);
      animation: dot-pulse 1.5s ease-in-out infinite;
    }

    @keyframes dot-pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.2);
      }
    }
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

    .item-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      .item-title {
        flex: 1;
        font-size: 13px;
        font-weight: 500;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-tag {
        flex-shrink: 0;
        transform: scale(0.85);
        transform-origin: right center;
      }
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
