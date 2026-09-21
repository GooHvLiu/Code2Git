<template>
  <div
    class="notification-item"
    :class="{ unread: !item.is_read, read: item.is_read, selected: selected }"
    @click="emit('click', item)"
    @dblclick="emit('dblclick', item)"
  >
    <!-- 选择框 -->
    <div v-if="showCheckbox" class="item-checkbox" @click.stop="emit('toggle-select', item.id)">
      <el-checkbox :model-value="selected" />
    </div>

    <div class="item-content-wrapper">
      <div class="item-header">
        <div class="item-status">
          <span v-if="!item.is_read" class="status-dot unread-dot"></span>
          <el-tag v-if="!item.is_read" size="small" type="danger" effect="dark">
            {{ t('notification.status.unread') }}
          </el-tag>
          <el-tag v-else size="small" type="info" effect="plain">
            {{ t('notification.status.read') }}
          </el-tag>
        </div>
        <el-tag size="small" :type="priorityType" class="type-tag">
          {{ typeName }}
        </el-tag>
        <span class="item-title">{{ displayTitle }}</span>
        <span class="item-time">{{ formatTime(item.create_time) }}</span>
      </div>
      <div class="item-content">{{ displayContent }}</div>
      <div class="item-actions" @click.stop>
        <el-button v-if="!item.is_read" text size="small" @click="emit('mark-read', item)">
          {{ t('notification.action.markRead') }}
        </el-button>
        <el-button v-if="archiveTab === '0'" text size="small" @click="emit('archive', item)">
          {{ t('notification.action.archive') }}
        </el-button>
        <el-button v-if="archiveTab === '1'" text size="small" @click="emit('unarchive', item)">
          {{ t('notification.action.unarchive') }}
        </el-button>
        <el-button text size="small" style="color: #f56c6c" @click="emit('delete', item)">
          {{ t('notification.action.delete') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 通知列表项
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PRIORITY_MAP } from '@/composables/useNotification'

defineOptions({ name: 'NotificationItem' })

/** 通知数据（后端字段） */
export interface NotificationData {
  id: number | string
  type: string
  priority?: string
  is_read?: number | boolean
  title_key?: string
  content_key?: string
  title_params?: string | Record<string, unknown>
  content_params?: string | Record<string, unknown>
  create_time?: string
  [key: string]: unknown
}

interface Props {
  item: NotificationData
  selected?: boolean
  showCheckbox?: boolean
  archiveTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  showCheckbox: true,
  archiveTab: '0'
})

const emit = defineEmits<{
  (e: 'click', item: NotificationData): void
  (e: 'dblclick', item: NotificationData): void
  (e: 'toggle-select', id: NotificationData['id']): void
  (e: 'mark-read', item: NotificationData): void
  (e: 'archive', item: NotificationData): void
  (e: 'unarchive', item: NotificationData): void
  (e: 'delete', item: NotificationData): void
}>()

const { t } = useI18n()

function parseParams(paramsStr?: string | Record<string, unknown>): Record<string, unknown> {
  if (!paramsStr) return {}
  try {
    return typeof paramsStr === 'string' ? JSON.parse(paramsStr) : paramsStr
  } catch {
    return {}
  }
}

const displayTitle = computed(() => t(props.item.title_key || '', parseParams(props.item.title_params)))
const displayContent = computed(() => t(props.item.content_key || '', parseParams(props.item.content_params)))

const typeName = computed(() => {
  const typeKeyMap: Record<string, string> = {
    system: 'notification.type.system',
    plc: 'notification.type.plc',
    user: 'notification.type.user',
    audit: 'notification.type.audit',
    device: 'notification.type.device',
    connection: 'notification.type.connection',
    security: 'notification.type.security',
    production: 'notification.type.production',
    config: 'notification.type.config',
    license: 'notification.type.license'
  }
  const key = typeKeyMap[props.item.type]
  return key ? t(key) : (props.item.type || '')
})

const priorityType = computed<'danger' | 'warning' | 'info'>(() => {
  const entry = (PRIORITY_MAP as Record<string, { type?: string }>)[props.item.priority || '']
  return (entry?.type as 'danger' | 'warning' | 'info') || 'info'
})

function formatTime(time?: string): string {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('notification.time.justNow')
  if (minutes < 60) return `${minutes}${t('notification.time.minutesAgo')}`
  if (hours < 24) return `${hours}${t('notification.time.hoursAgo')}`
  if (days < 30) return `${days}${t('notification.time.daysAgo')}`

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
</script>

<style scoped lang="less">
.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #f5f7fa; }

  &.unread {
    background: #f0f7ff;
    border-left: 3px solid #409eff;
  }

  &.read { opacity: 0.7; }
  &.selected { background: #ecf5ff; }

  .item-checkbox {
    display: flex;
    align-items: center;
    padding-right: 12px;
  }

  .item-content-wrapper {
    flex: 1;
    min-width: 0;
  }

  .item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    .item-status {
      display: flex;
      align-items: center;
      gap: 4px;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &.unread-dot { background: #f56c6c; }
      }
    }

    .type-tag { flex-shrink: 0; }

    .item-title {
      font-weight: 600;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .item-time {
      color: #909399;
      font-size: 12px;
      flex-shrink: 0;
    }
  }

  .item-content {
    color: #606266;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .item-actions {
    display: flex;
    gap: 8px;
  }
}
</style>
