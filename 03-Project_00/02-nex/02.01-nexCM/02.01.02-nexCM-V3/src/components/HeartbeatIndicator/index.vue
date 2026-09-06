<template>
  <div class="heartbeat-indicator" :class="statusClass" @click.stop="handleClick">
    <div class="heartbeat-dot">
      <div class="pulse-ring" v-if="isOnline"></div>
      <div class="reconnect-spinner" v-if="isReconnecting"></div>
    </div>
    <el-tooltip :content="tooltipText" placement="bottom">
      <span class="heartbeat-label">{{ statusText }}</span>
    </el-tooltip>

    <!-- 连接状态详情弹窗 -->
    <el-dialog
      :title="$t('heartbeat.detailTitle')"
      :visible.sync="showDetailDialog"
      width="400px"
      :close-on-click-modal="false"
      custom-class="heartbeat-detail-dialog"
      @closed="handleDialogClosed"
      @click.stop.native
    >
    <div class="detail-content">
      <!-- 服务器状态 -->
      <div class="detail-item">
        <span class="detail-label">{{ $t('heartbeat.detailServerLabel') }}</span>
        <span class="detail-value" :class="isWsOnline ? 'text-success' : 'text-error'">
          {{ isWsOnline ? $t('heartbeat.detailConnected') : $t('heartbeat.detailDisconnected') }}
        </span>
      </div>

      <!-- 设备状态 -->
      <div class="detail-item">
        <span class="detail-label">{{ $t('heartbeat.detailDeviceLabel') }}</span>
        <span class="detail-value" :class="isPlcOnline ? 'text-success' : 'text-error'">
          {{ isPlcOnline ? $t('heartbeat.detailConnected') : $t('heartbeat.detailDisconnected') }}
        </span>
      </div>

      <!-- 最后心跳 -->
      <div class="detail-item">
        <span class="detail-label">{{ $t('heartbeat.detailLastHeartbeatLabel') }}</span>
        <span class="detail-value">{{ lastHeartbeatText }}</span>
      </div>

      <!-- 心跳间隔 -->
      <div class="detail-item">
        <span class="detail-label">{{ $t('heartbeat.detailHeartbeatIntervalLabel') }}</span>
        <span class="detail-value">{{ heartbeatIntervalText }}</span>
      </div>

      <!-- 重连状态提示（只有未连接时才显示） -->
      <div v-if="!isOnline && (isReconnecting || reconnectResult)" class="reconnect-status">
        <div v-if="isReconnecting" class="reconnect-connecting">
          <i class="el-icon-loading"></i>
          <span>{{ $t('heartbeat.detailManualReconnecting') }}</span>
        </div>
        <div v-else-if="reconnectResult === 'success'" class="reconnect-success">
          <i class="el-icon-success"></i>
          <span>{{ $t('heartbeat.detailReconnectSuccess') }}</span>
        </div>
        <div v-else-if="reconnectResult === 'failed'" class="reconnect-failed">
          <i class="el-icon-error"></i>
          <span>{{ $t('heartbeat.detailReconnectFailed', { error: reconnectError || '' }) }}</span>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click.stop="closeDetailDialog"
      >
        {{ $t('heartbeat.confirm') }}
      </el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script setup>
/**
 * 心跳指示器组件
 * 用于显示 WebSocket 连接状态和 PLC 连接状态
 * 从 Vuex websocket 模块获取实时状态
 * 点击时如果有断联，自动触发手动重连
 */
import { computed, ref } from 'vue'
import store from '@/store'
import { useI18n } from '@/composables/useI18n'
import { requestReconnectPlcApi } from '@/api'

const { t: $t } = useI18n()

// 是否显示详情弹窗
const showDetailDialog = ref(false)
// 防止重复点击的标志位
const isHandlingClick = ref(false)

// ===== 计算属性（从 store 获取）=====
const isOnline = computed(() => store.getters['websocket/isOnline'])
const isWsOnline = computed(() => store.getters['websocket/isWsOnline'])
const isPlcOnline = computed(() => store.getters['websocket/isPlcOnline'])
const isReconnecting = computed(() => store.getters['websocket/isReconnecting'])
const reconnectResult = computed(() => store.getters['websocket/reconnectResult'])
const reconnectError = computed(() => store.getters['websocket/reconnectError'])
const lastHeartbeatText = computed(() => store.getters['websocket/lastHeartbeatText'])
const connectionStatusText = computed(() => store.getters['websocket/connectionStatusText'])
const connectionStatusType = computed(() => store.getters['websocket/connectionStatusType'])

const heartbeatIntervalText = computed(() => {
  const interval = store.state.websocket.heartbeatInterval
  return $t('heartbeat.detailHeartbeatIntervalValue', { seconds: (interval / 1000).toFixed(0) })
})

const statusText = computed(() => connectionStatusText.value)
const statusClass = computed(() => connectionStatusType.value)

const tooltipText = computed(() => {
  const state = store.state.websocket
  const lines = []

  // 手动重连中
  if (state.isReconnecting) {
    lines.push($t('heartbeat.tooltipManualReconnecting'))
  }

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
    lines.push($t('heartbeat.detailLastHeartbeatLabel') + ': ' + lastHeartbeatText.value)
  }

  return lines.join(' | ')
})

// ===== 方法 =====

/**
 * 点击连接状态
 * 如果全部连接正常，只显示详情
 * 如果有断联，触发手动重连并显示详情
 */
function handleClick() {
  // 防止重复点击
  if (isHandlingClick.value) {
    return
  }
  isHandlingClick.value = true

  // 延迟重置标志位，避免事件冒泡导致的重复触发
  setTimeout(() => {
    isHandlingClick.value = false
  }, 300)

  // 重连过程中忽略后续点击
  if (isReconnecting.value) {
    return
  }

  // 显示详情弹窗
  showDetailDialog.value = true

  // 如果有断联，触发手动重连
  if (!isOnline.value) {
    triggerManualReconnect()
  }
}

/**
 * 触发手动重连
 */
async function triggerManualReconnect() {
  try {
    // 设置重连中状态
    store.dispatch('websocket/startManualReconnect')

    // 调用后端手动重连接口
    const result = await requestReconnectPlcApi()

    // 等待一小段时间，让状态更新
    await new Promise(resolve => setTimeout(resolve, 500))

    if (result.success || result.allConnected) {
      // 重连成功
      store.dispatch('websocket/manualReconnectSuccess')
    } else {
      // 重连失败
      const errorMsg = result.error || $t('heartbeat.reconnectFailedUnknown')
      store.dispatch('websocket/manualReconnectFailed', errorMsg)
    }
  } catch (err) {
    console.error('[Heartbeat] 手动重连失败:', err)
    const errorMsg = err.message || $t('heartbeat.reconnectFailedUnknown')
    store.dispatch('websocket/manualReconnectFailed', errorMsg)
  }
}

/**
 * 关闭详情弹窗
 */
function closeDetailDialog() {
  showDetailDialog.value = false
}

/**
 * 弹窗关闭后的处理
 */
function handleDialogClosed() {
  // 重置重连状态（如果重连已完成）
  if (!isReconnecting.value) {
    store.dispatch('websocket/resetManualReconnect')
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

  // 重连中状态：蓝色
  &.reconnecting {
    .heartbeat-dot::before {
      background: #409eff;
    }
    .heartbeat-label {
      color: #409eff;
    }
    cursor: wait;
  }

  .heartbeat-label {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
}

// 详情弹窗样式
.detail-content {
  cursor: default;

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .detail-label {
      color: #606266;
      font-size: 14px;
    }

    .detail-value {
      font-size: 14px;
      font-weight: 500;

      &.text-success {
        color: #67c23a;
      }

      &.text-error {
        color: #f56c6c;
      }
    }
  }

  .reconnect-status {
    margin-top: 16px;
    padding: 12px;
    border-radius: 4px;
    background: #f5f7fa;

    .reconnect-connecting {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #409eff;
      font-size: 14px;

      i {
        font-size: 18px;
        animation: spin-icon 1s linear infinite;
      }
    }

    .reconnect-success {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #67c23a;
      font-size: 14px;

      i {
        font-size: 18px;
      }
    }

    .reconnect-failed {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f56c6c;
      font-size: 14px;

      i {
        font-size: 18px;
      }
    }
  }
}

.dialog-footer {
  text-align: center;
  cursor: default;
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

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes spin-icon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<!-- 全局样式：设置弹窗鼠标样式，避免继承父元素的 cursor: pointer -->
<style>
.heartbeat-detail-dialog {
  cursor: default !important;
}
.heartbeat-detail-dialog .el-dialog__header {
  cursor: default;
}
.heartbeat-detail-dialog .el-dialog__body {
  cursor: default;
}
.heartbeat-detail-dialog .el-dialog__footer {
  cursor: default;
}
.heartbeat-detail-dialog .el-dialog__close {
  cursor: pointer;
}
</style>
