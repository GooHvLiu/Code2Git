<!--
  device/monitor/index.vue - 设备监控
  功能：实时显示所有设备状态、当前订单、进度
  后续：WebSocket 实时推送
-->
<template>
  <div class="app-container">
    <div class="page-header">
      <h2>设备监控</h2>
      <p>实时设备状态监控</p>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in devices" :key="item.id">
        <el-card shadow="hover" class="device-card">
          <div class="device-header">
            <span class="status-dot" :class="item.status"></span>
            <span class="device-name">{{ item.name }}</span>
          </div>
          <div class="device-info">
            <div>当前订单：{{ item.orderNo || '-' }}</div>
            <div>进度：{{ item.progress }}%</div>
            <el-progress :percentage="item.progress" :status="item.status === 'fault' ? 'exception' : null" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'DeviceMonitor',
  data() {
    return {
      devices: [
        { id: 1, name: '1号机', status: 'running', orderNo: 'ORD001', progress: 85 },
        { id: 2, name: '2号机', status: 'running', orderNo: 'ORD002', progress: 62 },
        { id: 3, name: '3号机', status: 'idle', orderNo: null, progress: 0 },
        { id: 4, name: '4号机', status: 'offline', orderNo: null, progress: 0 },
        { id: 5, name: '5号机', status: 'fault', orderNo: 'ORD005', progress: 45 }
      ]
    }
  }
}
</script>
<style scoped>
.device-card { margin-bottom: 20px; }
.device-header { display: flex; align-items: center; margin-bottom: 15px; }
.status-dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 10px; }
.status-dot.running { background: #67C23A; }
.status-dot.idle { background: #E6A23C; }
.status-dot.fault { background: #F56C6C; }
.status-dot.offline { background: #909399; }
.device-name { font-size: 16px; font-weight: 500; }
.device-info > div { margin-bottom: 8px; color: #606266; }
</style>
