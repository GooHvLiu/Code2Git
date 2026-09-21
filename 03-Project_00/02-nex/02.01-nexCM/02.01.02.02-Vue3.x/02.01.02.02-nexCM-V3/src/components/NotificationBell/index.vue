<template>
  <div class="notification-bell">
    <div class="bell-btn" :class="{ 'bell-ringing': hasUnread }" @click.stop="togglePanel">
      <el-badge :value="unreadCount" :hidden="!hasUnread" :max="99" class="bell-badge">
        <el-icon class="bell-icon"><Bell /></el-icon>
      </el-badge>
    </div>

    <!-- 下拉面板 -->
    <transition name="fade">
      <div v-show="showPanel" class="notification-panel" @click.stop>
        <!-- 标题栏 -->
        <div class="panel-header">
          <span class="panel-title">{{ t('notification.page.center') }}</span>
          <span v-if="hasUnread" class="mark-all-read" @click="handleMarkAllRead">
            {{ t('notification.action.markAllRead') }}
          </span>
        </div>

        <!-- 通知列表 -->
        <div class="panel-list">
          <div v-if="loading" class="panel-loading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>{{ t('common.loading') }}</span>
          </div>
          <div v-else-if="notifications.length === 0" class="panel-empty">
            <el-icon><Document /></el-icon>
            <span>{{ t('notification.page.empty') }}</span>
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
              <el-icon><component :is="getTypeIcon(item.type)" /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-title-row">
                <span class="item-title">{{ getDisplayTitle(item) }}</span>
                <el-tag
                  v-if="!item.is_read"
                  size="small"
                  type="danger"
                  effect="dark"
                  class="status-tag"
                >
                  {{ t('notification.status.unread') }}
                </el-tag>
                <el-tag
                  v-else
                  size="small"
                  type="info"
                  effect="plain"
                  class="status-tag"
                >
                  {{ t('notification.status.read') }}
                </el-tag>
              </div>
              <div class="item-desc">{{ getDisplayContent(item) }}</div>
              <div class="item-time">{{ formatTime(item.create_time) }}</div>
            </div>
          </div>
        </div>

        <!-- 底部查看全部 -->
        <div class="panel-footer" @click="goToNotificationPage">
          <span class="view-all">{{ t('notification.page.viewAll') }} →</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * 通知铃铛（顶部导航）
 * 未读数本地维护 + BroadcastChannel/storage 跨标签页同步 + WebSocket 实时推送。
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import {
  Bell, Loading, Document, ChatDotRound, Cpu, User,
  WarningFilled, InfoFilled, CircleCheckFilled
} from '@element-plus/icons-vue'
import {
  requestGetUnreadCountApi,
  requestGetNotificationListApi,
  requestMarkAsReadApi,
  requestMarkAllAsReadApi
} from '@/api'
import ws from '@/utils/request/websocket'
import { useRouter } from 'vue-router'
import { getToken } from '@/utils/auth/auth'
import { showSuccess, showError } from '@/utils/ui/feedback'
import {
  displayTitle,
  displayContent,
  relativeTime,
  type NotificationDTO
} from '@/utils/business/notificationPresenter'

defineOptions({ name: 'NotificationBell' })

interface NotificationItemData {
  id: number | string
  type?: string
  is_read?: number
  title_key?: string
  content_key?: string
  title_params?: string | Record<string, unknown>
  content_params?: string | Record<string, unknown>
  create_time?: string
  [key: string]: unknown
}

interface WsReadData {
  unreadCount?: number
  markAll?: boolean
  notificationIds?: Array<number | string>
}

const { t } = useI18n()
const router = useRouter()

const showPanel = ref(false)
const loading = ref(false)
const notifications = ref<NotificationItemData[]>([])
const unreadCount = ref(0)

const hasUnread = computed(() => unreadCount.value > 0)

async function fetchUnreadCount(): Promise<void> {
  if (!getToken()) {
    unreadCount.value = 0
    return
  }
  try {
    const res = await requestGetUnreadCountApi()
    unreadCount.value = (res.data as { count?: number })?.count || 0
  } catch {
    // 静默失败
  }
}

async function fetchNotifications(): Promise<void> {
  if (!getToken()) {
    notifications.value = []
    return
  }
  loading.value = true
  try {
    const res = await requestGetNotificationListApi({ page: 1, pageSize: 5 })
    notifications.value = (res.data as { list?: NotificationItemData[] })?.list || []
  } catch {
    notifications.value = []
  } finally {
    loading.value = false
  }
}

function togglePanel(): void {
  showPanel.value = !showPanel.value
  if (showPanel.value) fetchNotifications()
}

async function handleItemClick(item: NotificationItemData): Promise<void> {
  if (!item.is_read) {
    try {
      await requestMarkAsReadApi(String(item.id))
      item.is_read = 1
      unreadCount.value = Math.max(0, unreadCount.value - 1)
      broadcastUnreadCountChange()
    } catch {
      // 静默失败
    }
  }
}

async function handleMarkAllRead(): Promise<void> {
  try {
    await requestMarkAllAsReadApi()
    notifications.value.forEach(item => { item.is_read = 1 })
    unreadCount.value = 0
    showSuccess(t('notification.message.markAllSuccess'))
    broadcastUnreadCountChange()
    broadcastNotificationUpdated()
  } catch {
    showError(t('common.operationFailed'))
  }
}

function goToNotificationPage(): void {
  showPanel.value = false
  router.push('/notification')
}

function getTypeIcon(type?: string): Component {
  const iconMap: Record<string, Component> = {
    system: ChatDotRound,
    plc: Cpu,
    user: User,
    audit: Document,
    warning: WarningFilled,
    info: InfoFilled,
    success: CircleCheckFilled
  }
  return iconMap[type || ''] || ChatDotRound
}

// 标题/内容/时间统一走通知展示适配层（与「通知中心」页共用同一事实来源）
const translate = t as unknown as (key: string, named?: Record<string, unknown>) => string
function getDisplayTitle(item: NotificationItemData): string {
  return displayTitle(translate, item as NotificationDTO)
}
function getDisplayContent(item: NotificationItemData): string {
  return displayContent(translate, item as NotificationDTO)
}
function formatTime(time?: string): string {
  return relativeTime(translate, time)
}

function handleClickOutside(): void {
  showPanel.value = false
}

/** ws.on 回调包装：适配 Listener 签名（参数由运行时传入） */
function onWsNotification(): void {
  handleWsNotification()
}

function onWsNotificationRead(data: unknown): void {
  handleWsNotificationRead(data as WsReadData)
}

function handleWsNotification(): void {
  unreadCount.value += 1
  if (showPanel.value) fetchNotifications()
  broadcastUnreadCountChange()
}

function handleWsNotificationRead(data: WsReadData): void {
  if (!data) return
  if (data.unreadCount !== undefined) {
    unreadCount.value = data.unreadCount
  }
  if (showPanel.value) {
    if (data.markAll) {
      notifications.value.forEach(item => { item.is_read = 1 })
    } else if (data.notificationIds && data.notificationIds.length > 0) {
      const idSet = new Set(data.notificationIds)
      notifications.value.forEach(item => {
        if (idSet.has(item.id)) item.is_read = 1
      })
    }
  }
  broadcastUnreadCountChange()
}

let afterEachUnsubscribe: (() => void) | null = null
let broadcastChannel: BroadcastChannel | null = null

onMounted(() => {
  fetchUnreadCount()
  ws.on('notification', onWsNotification)
  ws.on('notification_read', onWsNotificationRead)
  document.addEventListener('click', handleClickOutside)
  afterEachUnsubscribe = router.afterEach(() => {
    fetchUnreadCount()
  })

  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('notification-center')
    broadcastChannel.onmessage = event => {
      const data = event.data as { type: string; count?: number }
      if (data.type === 'unread-count-changed') {
        unreadCount.value = data.count || 0
      } else if (data.type === 'notification-updated') {
        fetchUnreadCount()
        if (showPanel.value) fetchNotifications()
      }
    }
  } else {
    window.addEventListener('storage', handleStorageChange)
  }
})

function handleStorageChange(event: StorageEvent): void {
  if (event.key === 'notification_unread_count') {
    unreadCount.value = Number(event.newValue) || 0
  } else if (event.key === 'notification_updated') {
    fetchUnreadCount()
    if (showPanel.value) fetchNotifications()
  }
}

function broadcastUnreadCountChange(): void {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'unread-count-changed', count: unreadCount.value })
  }
  try {
    localStorage.setItem('notification_unread_count', String(unreadCount.value))
  } catch {
    // localStorage 不可用，静默失败
  }
}

function broadcastNotificationUpdated(): void {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'notification-updated' })
  }
  try {
    localStorage.setItem('notification_updated', String(Date.now()))
  } catch {
    // 静默失败
  }
}

onBeforeUnmount(() => {
  ws.off('notification', onWsNotification)
  ws.off('notification_read', onWsNotificationRead)
  document.removeEventListener('click', handleClickOutside)
  if (afterEachUnsubscribe) {
    afterEachUnsubscribe()
    afterEachUnsubscribe = null
  }
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

  &.bell-ringing {
    .bell-icon {
      display: inline-block;
      transform-origin: top center;
      animation: bell-shake 1.5s ease-in-out infinite;
      color: #f56c6c;
    }
  }
}

@keyframes bell-shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-12deg); }
  20%, 40%, 60%, 80% { transform: rotate(12deg); }
}

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

    &:hover { color: #66b1ff; }
  }
}

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

  .el-icon {
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

  &:last-child { border-bottom: none; }
  &:hover {
    background: #f5f7fa;
    transform: translateX(2px);
  }

  &.unread::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #409eff;
  }

  &.read { opacity: 0.7; }

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

    &.type-system { background: #ecf5ff; color: #409eff; }
    &.type-plc { background: #f0f9eb; color: #67c23a; }
    &.type-user { background: #fdf6ec; color: #e6a23c; }
    &.type-audit { background: #f4f4f5; color: #909399; }
    &.type-warning { background: #fef0f0; color: #f56c6c; }
    &.type-info { background: #f4f4f5; color: #909399; }
    &.type-success { background: #f0f9eb; color: #67c23a; }
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

.panel-footer {
  padding: 10px 16px;
  border-top: 1px solid #ebeef5;
  text-align: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #f5f7fa; }

  .view-all {
    font-size: 13px;
    color: #409eff;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}
</style>
