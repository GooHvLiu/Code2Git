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

<script>
/**
 * 心跳指示器组件
 * 用于显示 WebSocket 连接状态和 PLC 连接状态
 * 从 Vuex websocket 模块获取实时状态
 *
 * 状态判断逻辑：
 * 1. 连接服务器是基础，没有连接服务器就不考虑设备状态
 * 2. 连接服务器后，再判断设备连接状态
 * 3. 只有同时满足连接服务器 + 连接设备，才算"在线"
 *
 * 状态优先级（从低到高）：
 * 1. 服务器未连接 → 离线 / 重连中
 * 2. 服务器已连接但未认证 → 认证中
 * 3. 服务器已连接且认证，但设备未连接 → 设备未连接
 * 4. 服务器已连接且认证 + 设备已连接 → 在线
 */
import { mapGetters } from 'vuex'

export default {
  name: 'HeartbeatIndicator',
  computed: {
    ...mapGetters('websocket', [
      'isOnline',
      'isWsOnline',
      'isPlcOnline',
      'lastHeartbeatText',
      'connectionStatusText',
      'connectionStatusType'
    ]),
    /**
     * 状态文本
     */
    statusText() {
      return this.connectionStatusText
    },
    /**
     * 状态样式类
     */
    statusClass() {
      return this.connectionStatusType
    },
    /**
     * 提示文本
     */
    tooltipText() {
      const state = this.$store.state.websocket
      const lines = []

      // 服务器状态
      if (this.isWsOnline) {
        lines.push(this.$t('heartbeat.serverConnected'))
      } else if (state.connected) {
        lines.push(this.$t('heartbeat.serverAuthenticating'))
      } else if (state.reconnectAttempts > 0) {
        lines.push(this.$t('heartbeat.serverReconnecting', { count: state.reconnectAttempts }))
      } else {
        lines.push(this.$t('heartbeat.serverDisconnected'))
      }

      // 设备状态（只有服务器连接后才显示）
      if (this.isWsOnline) {
        if (this.isPlcOnline) {
          lines.push(this.$t('heartbeat.deviceConnected'))
        } else {
          lines.push(this.$t('heartbeat.deviceDisconnected'))
        }
        lines.push(this.$t('heartbeat.detailLastHeartbeat', { time: this.lastHeartbeatText }))
      }

      return lines.join(' | ')
    }
  },
  methods: {
    /**
     * 点击显示详细信息
     */
    showDetail() {
      const state = this.$store.state.websocket
      const lines = []

      // 服务器状态
      if (this.isWsOnline) {
        lines.push(this.$t('heartbeat.detailServerConnected'))
      } else if (state.connected) {
        lines.push(this.$t('heartbeat.detailServerAuthenticating'))
      } else if (state.reconnectAttempts > 0) {
        lines.push(this.$t('heartbeat.detailServerReconnecting', { count: state.reconnectAttempts }))
      } else {
        lines.push(this.$t('heartbeat.detailServerDisconnected'))
      }

      // 设备状态
      if (this.isPlcOnline) {
        lines.push(this.$t('heartbeat.detailDeviceConnected'))
      } else {
        lines.push(this.$t('heartbeat.detailDeviceDisconnected'))
      }

      // 其他信息
      lines.push(this.$t('heartbeat.detailLastHeartbeat', { time: this.lastHeartbeatText }))
      lines.push(this.$t('heartbeat.detailHeartbeatInterval', { seconds: (state.heartbeatInterval / 1000).toFixed(0) }))

      const detail = lines.join('\n')
      const type = this.isOnline ? 'success' : (this.isWsOnline ? 'warning' : 'error')

      this.$alert(detail, this.$t('heartbeat.detailTitle'), {
        confirmButtonText: this.$t('heartbeat.confirm'),
        type
      })
    }
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
