<template>
  <div class="heartbeat-indicator" :class="statusClass" @click="showDetail">
    <div class="heartbeat-dot">
      <div class="pulse-ring" v-if="isOnline"></div>
    </div>
    <el-tooltip :content="tooltipText" placement="bottom">
      <span class="heartbeat-label">{{ statusText }}</span>
    </el-tooltip>
  </div>
</template>

<script setup>
/**
 * 心跳指示器组件
 * 用于显示 WebSocket 连接状态和 PLC 连接状态
 * 从 Vuex websocket 模块获取实时状态
 */
import { computed } from 'vue'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

// ===== 计算属性（从 store 获取） =====
const isOnline = computed(() => store.getters['websocket/isOnline'])
const isWsOnline = computed(() => store.getters['websocket/isWsOnline'])
const isPlcOnline = computed(() => store.getters['websocket/isPlcOnline'])
const lastHeartbeatText = computed(() => store.getters['websocket/lastHeartbeatText'])
const connectionStatusText = computed(() => store.getters['websocket/connectionStatusText'])
const connectionStatusType = computed(() => store.getters['websocket/connectionStatusType'])

const statusText = computed(() => connectionStatusText.value)
const statusClass = computed(() => connectionStatusType.value)

const tooltipText = computed(() => {
  const state = store.state.websocket
  const lines = []

  // 服务器状态
  if (isWsOnline.value) {
    lines.push($t('heartbeat.serverConnected'))
  } else if (state.connected) {
    lines.push($t('heartbeat.serverAuthenticating'))
  } else if (state.reconnectAttempts > 0) {
    lines.push($t('heartbeat.serverReconnecting', { count: state.reconnectAttempts }))
  } else {
    lines.push($t('heartbeat.serverDisconnected'))
  }

  // 设备状态（只有服务器连接后才显示）
  if (isWsOnline.value) {
    if (isPlcOnline.value) {
      lines.push($t('heartbeat.deviceConnected'))
    } else {
      lines.push($t('heartbeat.deviceDisconnected'))
    }
    lines.push($t('heartbeat.detailLastHeartbeat', { time: lastHeartbeatText.value }))
  }

  return lines.join(' | ')
})

// ===== 方法 =====
function showDetail() {
  const state = store.state.websocket
  const lines = []

  // 服务器状态
  if (isWsOnline.value) {
    lines.push($t('heartbeat.detailServerConnected'))
  } else if (state.connected) {
    lines.push($t('heartbeat.detailServerAuthenticating'))
  } else if (state.reconnectAttempts > 0) {
    lines.push($t('heartbeat.detailServerReconnecting', { count: state.reconnectAttempts }))
  } else {
    lines.push($t('heartbeat.detailServerDisconnected'))
  }

  // 设备状态
  if (isPlcOnline.value) {
    lines.push($t('heartbeat.detailDeviceConnected'))
  } else {
    lines.push($t('heartbeat.detailDeviceDisconnected'))
  }

  // 其他信息
  lines.push($t('heartbeat.detailLastHeartbeat', { time: lastHeartbeatText.value }))
  lines.push($t('heartbeat.detailHeartbeatInterval', { seconds: (state.heartbeatInterval / 1000).toFixed(0) }))

  const detail = lines.join('\n')
  const type = isOnline.value ? 'success' : (isWsOnline.value ? 'warning' : 'error')

  MessageBox.alert(detail, $t('heartbeat.detailTitle'), {
    confirmButtonText: $t('heartbeat.confirm'),
    type
  })
}
</script>

<style scoped lang="less">
.heartbeat-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .heartbeat-dot {
    position: relative;
    width: 8px;
    height: 8px;
    flex-shrink: 0;

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #67c23a;
      transform: translate(-50%, -50%);
      animation: pulse 2s ease-out infinite;
    }

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }

  // 在线状态：绿色
  &.online {
    .heartbeat-dot::before {
      background: #67c23a;
    }
    .heartbeat-label {
      color: #67c23a;
    }
  }

  // 警告状态：橙色（服务器在线但 PLC 未连接）
  &.warning {
    .heartbeat-dot::before {
      background: #e6a23c;
    }
    .heartbeat-label {
      color: #e6a23c;
    }
  }

  // 离线状态：红色
  &.offline {
    .heartbeat-dot::before {
      background: #f56c6c;
    }
    .heartbeat-label {
      color: #f56c6c;
    }
  }

  .heartbeat-label {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}
</style>
