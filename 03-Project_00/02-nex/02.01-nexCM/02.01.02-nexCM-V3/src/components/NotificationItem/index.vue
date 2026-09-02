<template>
  <div
    class="notification-item"
    :class="{ unread: !item.is_read, read: item.is_read, selected: selected }"
    @click="$emit('click', item)"
    @dblclick="$emit('dblclick', item)"
  >
    <!-- 选择框 -->
    <div v-if="showCheckbox" class="item-checkbox" @click.stop="$emit('toggle-select', item.id)">
      <el-checkbox :value="selected"></el-checkbox>
    </div>

    <div class="item-content-wrapper">
      <div class="item-header">
        <div class="item-status">
          <span v-if="!item.is_read" class="status-dot unread-dot"></span>
          <el-tag v-if="!item.is_read" size="mini" type="danger" effect="dark">{{ $t('notification.unread') }}</el-tag>
          <el-tag v-else size="mini" type="info" effect="plain">{{ $t('notification.read') }}</el-tag>
        </div>
        <el-tag size="mini" :type="priorityType" class="type-tag">
          {{ typeName }}
        </el-tag>
        <span class="item-title">{{ displayTitle }}</span>
        <span class="item-time">{{ formatTime(item.created_at) }}</span>
      </div>
      <div class="item-content">{{ displayContent }}</div>
      <div class="item-actions" @click.stop>
        <el-button v-if="!item.is_read" type="text" size="mini" @click="$emit('mark-read', item)">
          {{ $t('notification.markRead') }}
        </el-button>
        <el-button v-if="archiveTab === '0'" type="text" size="mini" @click="$emit('archive', item)">
          {{ $t('notification.archive') }}
        </el-button>
        <el-button v-if="archiveTab === '1'" type="text" size="mini" @click="$emit('unarchive', item)">
          {{ $t('notification.unarchive') }}
        </el-button>
        <el-button type="text" size="mini" style="color: #f56c6c" @click="$emit('delete', item)">
          {{ $t('notification.delete') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'
import { PRIORITY_MAP } from '@/composables/useNotification'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  showCheckbox: {
    type: Boolean,
    default: true
  },
  archiveTab: {
    type: String,
    default: '0'
  }
})

defineEmits([
  'click',
  'dblclick',
  'toggle-select',
  'mark-read',
  'archive',
  'unarchive',
  'delete'
])

// 获取 i18n 实例
const { proxy } = getCurrentInstance()
const $t = proxy.$t.bind(proxy)

// 解析动态参数（JSON 字符串转对象）
function parseParams(paramsStr) {
  if (!paramsStr) return {}
  try {
    return typeof paramsStr === 'string' ? JSON.parse(paramsStr) : paramsStr
  } catch (e) {
    return {}
  }
}

// 显示标题：使用国际化 key + 动态参数
const displayTitle = computed(() => {
  const params = parseParams(props.item.title_params)
  return $t(props.item.title_key, params)
})

// 显示内容：使用国际化 key + 动态参数
const displayContent = computed(() => {
  const params = parseParams(props.item.content_params)
  return $t(props.item.content_key, params)
})

// 类型名称（使用国际化）
const typeName = computed(() => {
  const typeKeyMap = {
    system: 'notification.typeSystem',
    plc: 'notification.typePlc',
    user: 'notification.typeUser',
    audit: 'notification.typeAudit',
    device: 'notification.typeDevice',
    connection: 'notification.typeConnection',
    security: 'notification.typeSecurity',
    production: 'notification.typeProduction',
    config: 'notification.typeConfig',
    license: 'notification.typeLicense',
  }
  const key = typeKeyMap[props.item.type]
  return key ? $t(key) : (props.item.type || '')
})

// 优先级类型
const priorityType = computed(() => {
  return PRIORITY_MAP[props.item.priority]?.type || 'info'
})

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return $t('notification.justNow')
  if (minutes < 60) return `${minutes}${$t('notification.minutesAgo')}`
  if (hours < 24) return `${hours}${$t('notification.hoursAgo')}`
  if (days < 30) return `${days}${$t('notification.daysAgo')}`

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped lang="less">
.notification-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f5f7fa;
  }

  &.unread {
    background: #f0f7ff;
    border-left: 3px solid #409eff;
  }

  &.read {
    opacity: 0.7;
  }

  &.selected {
    background: #ecf5ff;
  }

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

        &.unread-dot {
          background: #f56c6c;
        }
      }
    }

    .type-tag {
      flex-shrink: 0;
    }

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
