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
 * 蹇冭烦鎸囩ず鍣ㄧ粍浠?
 * 鐢ㄤ簬鏄剧ず WebSocket 杩炴帴鐘舵€佸拰 PLC 杩炴帴鐘舵€?
 * 浠?Vuex websocket 妯″潡鑾峰彇瀹炴椂鐘舵€?
 */
import { computed } from 'vue'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { useI18n } from '@/composables/useI18n'

const { t: $t } = useI18n()

// ===== 璁＄畻灞炴€э紙浠?store 鑾峰彇锛?=====
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

  // 鏈嶅姟鍣ㄧ姸鎬?
  if (isWsOnline.value) {
    lines.push($t('heartbeat.serverConnected'))
  } else if (state.connected) {
    lines.push($t('heartbeat.serverAuthenticating'))
  } else if (state.reconnectAttempts > 0) {
    lines.push($t('heartbeat.serverReconnecting', { count: state.reconnectAttempts }))
  } else {
    lines.push($t('heartbeat.serverDisconnected'))
  }

  // 璁惧鐘舵€侊紙鍙湁鏈嶅姟鍣ㄨ繛鎺ュ悗鎵嶆樉绀猴級
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

// ===== 鏂规硶 =====
function showDetail() {
  const state = store.state.websocket
  const lines = []

  // 鏈嶅姟鍣ㄧ姸鎬?
  if (isWsOnline.value) {
    lines.push($t('heartbeat.detailServerConnected'))
  } else if (state.connected) {
    lines.push($t('heartbeat.detailServerAuthenticating'))
  } else if (state.reconnectAttempts > 0) {
    lines.push($t('heartbeat.detailServerReconnecting', { count: state.reconnectAttempts }))
  } else {
    lines.push($t('heartbeat.detailServerDisconnected'))
  }

  // 璁惧鐘舵€?
  if (isPlcOnline.value) {
    lines.push($t('heartbeat.detailDeviceConnected'))
  } else {
    lines.push($t('heartbeat.detailDeviceDisconnected'))
  }

  // 鍏朵粬淇℃伅
  lines.push($t('heartbeat.detailLastHeartbeat', { time: lastHeartbeatText.value }))
  lines.push($t('heartbeat.detailHeartbeatInterval', { seconds: (state.heartbeatInterval / 1000).toFixed(0) }))

  const detail = lines.join('\n')
  const type = isOnline.value ? 'success' : (isWsOnline.value ? 'warning' : 'error')

  MessageBox.alert(detail, $t('heartbeat.detailTitle'), {
    confirmButtonText: $t('heartbeat.confirm'),
    type
  }).catch(() => {})
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

  // 鍦ㄧ嚎鐘舵€侊細缁胯壊
  &.online {
    .heartbeat-dot::before {
      background: #67c23a;
    }
    .heartbeat-label {
      color: #67c23a;
    }
  }

  // 璀﹀憡鐘舵€侊細姗欒壊锛堟湇鍔″櫒鍦ㄧ嚎浣?PLC 鏈繛鎺ワ級
  &.warning {
    .heartbeat-dot::before {
      background: #e6a23c;
    }
    .heartbeat-label {
      color: #e6a23c;
    }
  }

  // 绂荤嚎鐘舵€侊細绾㈣壊
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
