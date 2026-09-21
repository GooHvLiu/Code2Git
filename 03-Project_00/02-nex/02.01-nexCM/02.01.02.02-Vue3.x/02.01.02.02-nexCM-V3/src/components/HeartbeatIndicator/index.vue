<template>
  <div class="heartbeat-indicator" :class="statusClass" @click.stop="handleClick">
    <div class="heartbeat-dot">
      <div v-if="isOnline" class="pulse-ring"></div>
      <div v-if="isReconnecting" class="reconnect-spinner"></div>
    </div>
    <el-tooltip :content="tooltipText" placement="bottom">
      <span class="heartbeat-label">{{ statusText }}</span>
    </el-tooltip>

    <!-- 连接状态详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="t('heartbeat.detailTitle')"
      width="400px"
      :close-on-click-modal="false"
      class="heartbeat-detail-dialog"
      @closed="handleDialogClosed"
      @click.stop
    >
      <div class="detail-content">
        <!-- 服务器状态 -->
        <div class="detail-item">
          <span class="detail-label">{{ t('heartbeat.detailServerLabel') }}</span>
          <span class="detail-value" :class="isWsOnline ? 'text-success' : 'text-error'">
            {{ isWsOnline ? t('heartbeat.detailConnected') : t('heartbeat.detailDisconnected') }}
          </span>
        </div>

        <!-- 设备状态 -->
        <div class="detail-item">
          <span class="detail-label">{{ t('heartbeat.detailDeviceLabel') }}</span>
          <span class="detail-value" :class="isPlcOnline ? 'text-success' : 'text-error'">
            {{ isPlcOnline ? t('heartbeat.detailConnected') : t('heartbeat.detailDisconnected') }}
          </span>
        </div>

        <!-- 最后心跳 -->
        <div class="detail-item">
          <span class="detail-label">{{ t('heartbeat.detailLastHeartbeatLabel') }}</span>
          <span class="detail-value">{{ lastHeartbeatText }}</span>
        </div>

        <!-- 心跳间隔 -->
        <div class="detail-item">
          <span class="detail-label">{{ t('heartbeat.detailHeartbeatIntervalLabel') }}</span>
          <span class="detail-value">{{ heartbeatIntervalText }}</span>
        </div>

        <!-- 重连状态提示（只有未连接时才显示） -->
        <div v-if="!isOnline && (isReconnecting || reconnectResult)" class="reconnect-status">
          <div v-if="isReconnecting" class="reconnect-connecting">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>{{ t('heartbeat.detailManualReconnecting') }}</span>
          </div>
          <div v-else-if="reconnectResult === 'success'" class="reconnect-success">
            <el-icon><CircleCheckFilled /></el-icon>
            <span>{{ t('heartbeat.detailReconnectSuccess') }}</span>
          </div>
          <div v-else-if="reconnectResult === 'failed'" class="reconnect-failed">
            <el-icon><CircleCloseFilled /></el-icon>
            <span>{{ t('heartbeat.detailReconnectFailed', { error: reconnectError || '' }) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" size="small" @click.stop="closeDetailDialog">
            {{ t('heartbeat.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 心跳指示器组件
 * 显示 WebSocket 连接状态与 PLC 连接状态；点击断联时触发手动重连并弹出详情。
 * 状态全部来自 websocket Pinia store。
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loading, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { useWebSocketStore } from '@/store/modules/websocket'
import { requestReconnectPlcApi } from '@/api'

defineOptions({ name: 'HeartbeatIndicator' })

const { t } = useI18n()
const wsStore = useWebSocketStore()

const showDetailDialog = ref(false)
const isHandlingClick = ref(false)

// ===== 计算属性（从 store 获取）=====
const isOnline = computed(() => wsStore.isOnline)
const isWsOnline = computed(() => wsStore.isWsOnline)
const isPlcOnline = computed(() => wsStore.isPlcOnline)
const isReconnecting = computed(() => wsStore.isReconnecting)
const reconnectResult = computed(() => wsStore.reconnectResult)
const reconnectError = computed(() => wsStore.reconnectError)
const lastHeartbeatText = computed(() => wsStore.lastHeartbeatText)

const heartbeatIntervalText = computed(() =>
  t('heartbeat.detailHeartbeatIntervalValue', { seconds: (wsStore.heartbeatInterval / 1000).toFixed(0) })
)

const statusText = computed(() => wsStore.connectionStatusText)
const statusClass = computed(() => wsStore.connectionStatusType)

const tooltipText = computed(() => {
  const lines: string[] = []

  if (wsStore.isReconnecting) {
    lines.push(t('heartbeat.tooltipManualReconnecting'))
  }

  if (isWsOnline.value) {
    lines.push(t('heartbeat.serverConnected'))
  } else if (wsStore.connected) {
    lines.push(t('heartbeat.serverAuthenticating'))
  } else if (wsStore.reconnectAttempts > 0) {
    lines.push(t('heartbeat.serverReconnecting', { count: wsStore.reconnectAttempts }))
  } else {
    lines.push(t('heartbeat.serverDisconnected'))
  }

  if (isWsOnline.value) {
    if (isPlcOnline.value) {
      lines.push(t('heartbeat.deviceConnected'))
    } else {
      lines.push(t('heartbeat.deviceDisconnected'))
    }
    lines.push(`${t('heartbeat.detailLastHeartbeatLabel')}: ${lastHeartbeatText.value}`)
  }

  return lines.join(' | ')
})

/**
 * 点击连接状态：全连接正常只显示详情；有断联则触发手动重连并显示详情。
 */
function handleClick(): void {
  if (isHandlingClick.value) return
  isHandlingClick.value = true
  setTimeout(() => {
    isHandlingClick.value = false
  }, 300)

  if (isReconnecting.value) return

  showDetailDialog.value = true

  if (!isOnline.value) {
    triggerManualReconnect()
  }
}

interface ReconnectResultPayload {
  success?: boolean
  allConnected?: boolean
  error?: string
}

/** 触发手动重连 */
async function triggerManualReconnect(): Promise<void> {
  try {
    wsStore.startManualReconnect()
    const res = await requestReconnectPlcApi('')
    const data = (res.data || {}) as ReconnectResultPayload

    await new Promise(resolve => setTimeout(resolve, 500))

    if (data.success || data.allConnected) {
      wsStore.manualReconnectSuccess()
    } else {
      const errorMsg = data.error || t('heartbeat.reconnectFailedUnknown')
      wsStore.manualReconnectFailed(errorMsg)
    }
  } catch (err) {
    console.error('[Heartbeat] 手动重连失败:', err)
    wsStore.manualReconnectFailed(t('heartbeat.reconnectFailedUnknown'))
  }
}

function closeDetailDialog(): void {
  showDetailDialog.value = false
}

/** 弹窗关闭后重置重连结果（若重连已完成） */
function handleDialogClosed(): void {
  if (!isReconnecting.value) {
    wsStore.reconnectResult = null
    wsStore.reconnectError = null
  }
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

    .reconnect-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      border: 2px solid #409eff;
      border-top-color: transparent;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: spin 1s linear infinite;
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

  &.online {
    .heartbeat-dot::before { background: #67c23a; }
    .heartbeat-label { color: #67c23a; }
  }

  &.warning {
    .heartbeat-dot::before { background: #e6a23c; }
    .heartbeat-label { color: #e6a23c; }
  }

  &.offline {
    .heartbeat-dot::before { background: #f56c6c; }
    .heartbeat-label { color: #f56c6c; }
  }

  &.reconnecting {
    .heartbeat-dot::before { background: #409eff; }
    .heartbeat-label { color: #409eff; }
    cursor: wait;
  }

  .heartbeat-label {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
}

.detail-content {
  cursor: default;

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child { border-bottom: none; }

    .detail-label { color: #606266; font-size: 14px; }

    .detail-value {
      font-size: 14px;
      font-weight: 500;

      &.text-success { color: #67c23a; }
      &.text-error { color: #f56c6c; }
    }
  }

  .reconnect-status {
    margin-top: 16px;
    padding: 12px;
    border-radius: 4px;
    background: #f5f7fa;

    .reconnect-connecting,
    .reconnect-success,
    .reconnect-failed {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;

      .el-icon { font-size: 18px; }
    }

    .reconnect-connecting {
      color: #409eff;
      .el-icon.is-loading { animation: spin-icon 1s linear infinite; }
    }
    .reconnect-success { color: #67c23a; }
    .reconnect-failed { color: #f56c6c; }
  }
}

.dialog-footer {
  text-align: center;
  cursor: default;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes spin-icon {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
