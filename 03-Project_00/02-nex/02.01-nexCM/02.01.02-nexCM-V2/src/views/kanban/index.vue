<!--
  kanban/index.vue - 大屏看板
  深色主题，独立路由（免登录），用于车间大屏展示
  功能：实时产量、设备状态、生产流水
  后续：WebSocket 实时推送、自动刷新
-->
<template>
  <div class="kanban-container">
    <!-- 头部 -->
    <div class="kanban-header">
      <h1>生产实时看板</h1>
      <div class="time">{{ currentTime }}</div>
    </div>
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <div class="stat-card" :style="{ borderColor: item.color }">
          <div class="stat-value" :style="{ color: item.color }">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </el-col>
    </el-row>
    <!-- 设备状态 + 生产流水 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <div class="panel">
          <div class="panel-title">设备状态</div>
          <div class="device-grid">
            <div v-for="d in devices" :key="d.id" class="device-box" :class="d.status">
              <div class="device-name">{{ d.name }}</div>
              <div class="device-status">{{ statusText[d.status] }}</div>
              <div class="device-progress" v-if="d.status === 'running'">
                <el-progress :percentage="d.progress" :show-text="false" :stroke-width="8" />
                <span>{{ d.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="panel">
          <div class="panel-title">实时生产流水</div>
          <div class="production-list">
            <div v-for="(item, idx) in records" :key="idx" class="record-item" :class="item.result">
              <span class="time">{{ item.time }}</span>
              <span class="device">{{ item.device }}</span>
              <el-tag size="mini" :type="item.result === 'good' ? 'success' : 'danger'">
                {{ item.result === 'good' ? '良品' : '不良' }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Kanban',
  data() {
    return {
      currentTime: '',
      timer: null,
      stats: [
        { label: '今日产量', value: '1,234', color: '#409EFF' },
        { label: '良品率', value: '98.5%', color: '#67C23A' },
        { label: '运行设备', value: '3/5', color: '#E6A23C' },
        { label: '活跃订单', value: '5', color: '#F56C6C' }
      ],
      statusText: { running: '运行中', idle: '待机', fault: '故障', offline: '离线' },
      devices: [
        { id: 1, name: '1号机', status: 'running', progress: 85 },
        { id: 2, name: '2号机', status: 'running', progress: 62 },
        { id: 3, name: '3号机', status: 'idle', progress: 0 },
        { id: 4, name: '4号机', status: 'offline', progress: 0 },
        { id: 5, name: '5号机', status: 'running', progress: 45 }
      ],
      records: [
        { time: '14:30:25', device: '1号机', result: 'good' },
        { time: '14:30:20', device: '2号机', result: 'good' },
        { time: '14:30:15', device: '1号机', result: 'bad' },
        { time: '14:30:10', device: '5号机', result: 'good' },
        { time: '14:30:05', device: '1号机', result: 'good' }
      ]
    }
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleString('zh-CN')
    }
  }
}
</script>
<style lang="scss" scoped>
.kanban-container {
  min-height: 100vh;
  background: #0f1f3d;
  color: #fff;
  padding: 20px;
}
.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h1 { margin: 0; font-size: 28px; color: #00d4ff; }
  .time { font-size: 18px; color: #ccc; }
}
.stats-row {
  .stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
  }
  .stat-value { font-size: 36px; font-weight: bold; }
  .stat-label { font-size: 14px; color: #ccc; margin-top: 8px; }
}
.panel {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 20px;
  height: 400px;
}
.panel-title { font-size: 18px; margin-bottom: 15px; color: #00d4ff; }
.device-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.device-box {
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #909399;
  &.running { border-left-color: #67C23A; }
  &.idle { border-left-color: #E6A23C; }
  &.fault { border-left-color: #F56C6C; }
  .device-name { font-size: 16px; font-weight: 500; }
  .device-status { font-size: 14px; color: #ccc; margin: 8px 0; }
  .device-progress { display: flex; align-items: center; gap: 10px;
    ::v-deep .el-progress-bar__outer { background: rgba(255,255,255,0.1); }
  }
}
.production-list { height: 320px; overflow: hidden; }
.record-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  .time { color: #999; font-size: 13px; }
  .device { flex: 1; }
}
</style>
